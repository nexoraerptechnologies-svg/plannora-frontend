// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Mantiene la interfaz pública ORIGINAL sin romper nada:
//   { user, isLoading, login, logout, mockUsers }
//
// Agrega de forma transparente:
//   - register()
//   - accessToken en memoria
//   - Conexión real al backend Node.js (JWT + cookie httpOnly)
//
// Modo DEMO: si VITE_API_URL no está definido, funciona con MOCK_USERS
// Modo REAL: define VITE_API_URL=http://localhost:3000 y conecta al backend
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "superadmin" | "admin" | "host" | "guest" | "staff" | "vendor";

export interface AppUser {
  id:         string;
  name:       string;
  email:      string;
  role:       UserRole;
  avatar?:    string;
  eventSlug?: string;
  guestId?:   string;
}

// ─── Mock users (desarrollo / demo) ──────────────────────────────────────────

export const MOCK_USERS: AppUser[] = [
  { id: "u-000", name: "Nexora Platform",    email: "superadmin@planora.app", role: "superadmin" },
  { id: "u-001", name: "Admin Nexora",       email: "admin@planora.app",      role: "admin" },
  { id: "u-002", name: "Alan Nexora",        email: "host@planora.app",       role: "host" },
  { id: "u-003", name: "María García",       email: "guest@planora.app",      role: "guest", eventSlug: "alan-y-sofia", guestId: "g-001" },
  { id: "u-004", name: "Carlos Security",    email: "staff@planora.app",      role: "staff" },
  { id: "u-005", name: "Hacienda Los Robles",email: "vendor@planora.app",     role: "vendor" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin:      "Event Admin",
  host:       "Event Host",
  guest:      "Guest",
  staff:      "Staff",
  vendor:     "Vendor",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: "bg-accent/10 text-accent border-accent/20",
  admin:      "bg-destructive/10 text-destructive border-destructive/20",
  host:       "bg-[hsl(30,90%,55%)]/10 text-[hsl(30,90%,55%)] border-[hsl(30,90%,55%)]/20",
  guest:      "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)] border-[hsl(142,70%,45%)]/20",
  staff:      "bg-[hsl(220,70%,55%)]/10 text-[hsl(220,70%,55%)] border-[hsl(220,70%,55%)]/20",
  vendor:     "bg-[hsl(280,60%,55%)]/10 text-[hsl(280,60%,55%)] border-[hsl(280,60%,55%)]/20",
};

export function getRedirectPath(user: AppUser): string {
  switch (user.role) {
    case "superadmin": return "/admin/dashboard";
    case "admin":      return "/event-admin/dashboard";
    case "host":       return "/host";
    case "guest":      return `/event/${user.eventSlug ?? "alan-y-sofia"}/guest/${user.guestId ?? "g-001"}`;
    case "staff":      return "/staff/check-in";
    case "vendor":     return "/vendor/dashboard";
  }
}

// ─── Context type ─────────────────────────────────────────────────────────────

interface AuthContextType {
  user:        AppUser | null;
  isLoading:   boolean;
  accessToken: string | null;

  login:    (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, displayName: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout:   () => void;

  /** Vacío en producción, poblado en modo demo */
  mockUsers: AppUser[];
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const API_URL = import.meta.env.VITE_API_URL as string | undefined;
const IS_DEMO = !API_URL;

type FetchResult<T> = { data: T } | { error: string };

async function apiFetch<T>(
  path: string,
  opts: RequestInit & { token?: string } = {}
): Promise<FetchResult<T>> {
  const { token, ...rest } = opts;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...rest.headers,
      },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: json.error ?? "Error del servidor." };
    return { data: json as T };
  } catch {
    return { error: "Sin conexión. Verifica tu internet." };
  }
}

// Normaliza la respuesta del backend al shape de AppUser
function mapUser(raw: Record<string, unknown>): AppUser {
  return {
    id:        String(raw.uid ?? raw.id ?? ""),
    name:      String(raw.displayName ?? raw.name ?? raw.email ?? ""),
    email:     String(raw.email ?? ""),
    role:      raw.role as UserRole,
    avatar:    raw.avatar as string | undefined,
    eventSlug: raw.eventSlug as string | undefined,
    guestId:   raw.guestId as string | undefined,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,        setUser]        = useState<AppUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // En demo no hay carga inicial; en real esperamos recuperar la sesión
  const [isLoading, setIsLoading]     = useState(!IS_DEMO);

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Silent refresh ─────────────────────────────────────────────────────────

  async function silentRefresh(): Promise<string | null> {
    const res = await apiFetch<{ accessToken: string }>("/api/auth/refresh", {
      method: "POST",
    });
    if ("error" in res) {
      setUser(null);
      setAccessToken(null);
      return null;
    }
    const token = res.data.accessToken;
    setAccessToken(token);
    scheduleNextRefresh(token);
    return token;
  }

  function scheduleNextRefresh(token: string) {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    // Access token TTL = 15 min → refresca 1 min antes
    refreshTimer.current = setTimeout(() => silentRefresh(), 14 * 60 * 1000);
  }

  // ── Recuperar sesión al montar (solo modo real) ────────────────────────────

  useEffect(() => {
    if (IS_DEMO) return;

    (async () => {
      const token = await silentRefresh();
      if (token) {
        const res = await apiFetch<Record<string, unknown>>("/api/auth/me", { token });
        if ("data" in res) setUser(mapUser(res.data));
      }
      setIsLoading(false);
    })();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────

  const login = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (IS_DEMO) {
      await new Promise((r) => setTimeout(r, 1000));
      const found = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      setIsLoading(false);
      if (found) { setUser(found); return { success: true }; }
      return { success: false, error: "Credenciales inválidas. Usa una cuenta demo." };
    }

    const res = await apiFetch<{ user: Record<string, unknown>; accessToken: string }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) }
    );
    setIsLoading(false);
    if ("error" in res) return { success: false, error: res.error };

    setUser(mapUser(res.data.user));
    setAccessToken(res.data.accessToken);
    scheduleNextRefresh(res.data.accessToken);
    return { success: true };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────

  const register = useCallback(async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (IS_DEMO) {
      await new Promise((r) => setTimeout(r, 1000));
      const tempUser: AppUser = {
        id: `u-demo-${Date.now()}`,
        name: displayName,
        email,
        role,
      };
      setUser(tempUser);
      setIsLoading(false);
      return { success: true };
    }

    const res = await apiFetch<{ user: Record<string, unknown>; accessToken: string }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify({ email, password, displayName, role }) }
    );
    setIsLoading(false);
    if ("error" in res) return { success: false, error: res.error };

    setUser(mapUser(res.data.user));
    setAccessToken(res.data.accessToken);
    scheduleNextRefresh(res.data.accessToken);
    return { success: true };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    if (!IS_DEMO) {
      apiFetch("/api/auth/logout", { method: "POST" }); // fire-and-forget
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
    }
    setUser(null);
    setAccessToken(null);
  }, []);

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      accessToken,
      login,
      register,
      logout,
      mockUsers: IS_DEMO ? MOCK_USERS : [],
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}