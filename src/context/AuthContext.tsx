import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type UserRole = "superadmin" | "admin" | "host" | "guest" | "staff" | "vendor";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  eventSlug?: string;
  guestId?: string;
}

const MOCK_USERS: AppUser[] = [
  { id: "u-000", name: "Nexora Platform", email: "superadmin@planora.app", role: "superadmin" },
  { id: "u-001", name: "Admin Nexora", email: "admin@planora.app", role: "admin" },
  { id: "u-002", name: "Alan Nexora", email: "host@planora.app", role: "host" },
  { id: "u-003", name: "María García", email: "guest@planora.app", role: "guest", eventSlug: "alan-y-sofia", guestId: "g-001" },
  { id: "u-004", name: "Carlos Security", email: "staff@planora.app", role: "staff" },
  { id: "u-005", name: "Hacienda Los Robles", email: "vendor@planora.app", role: "vendor" },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  superadmin: "Super Admin",
  admin: "Event Admin",
  host: "Event Host",
  guest: "Guest",
  staff: "Staff",
  vendor: "Vendor",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: "bg-accent/10 text-accent border-accent/20",
  admin: "bg-destructive/10 text-destructive border-destructive/20",
  host: "bg-[hsl(30,90%,55%)]/10 text-[hsl(30,90%,55%)] border-[hsl(30,90%,55%)]/20",
  guest: "bg-[hsl(142,70%,45%)]/10 text-[hsl(142,70%,45%)] border-[hsl(142,70%,45%)]/20",
  staff: "bg-[hsl(220,70%,55%)]/10 text-[hsl(220,70%,55%)] border-[hsl(220,70%,55%)]/20",
  vendor: "bg-[hsl(280,60%,55%)]/10 text-[hsl(280,60%,55%)] border-[hsl(280,60%,55%)]/20",
};

export function getRedirectPath(user: AppUser): string {
  switch (user.role) {
    case "superadmin": return "/admin/dashboard";
    case "admin": return "/event-admin/dashboard";
    case "host": return "/host";
    case "guest": return `/event/${user.eventSlug || "alan-y-sofia"}/guest/${user.guestId || "g-001"}`;
    case "staff": return "/staff/check-in";
    case "vendor": return "/vendor/dashboard";
  }
}

interface AuthContextType {
  user: AppUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  mockUsers: AppUser[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: "Invalid credentials. Try one of the demo accounts." };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, mockUsers: MOCK_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
