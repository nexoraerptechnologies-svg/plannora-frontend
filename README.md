# Plannora Frontend

> Plataforma SaaS de gestión de eventos — by Nexora

---

## Stack

| Capa | Tecnología |
|------|-----------|
| UI Framework | React 18 + TypeScript + Vite |
| Routing | React Router v6 |
| Estado servidor | TanStack Query |
| Estilos | Tailwind CSS v3 + shadcn/ui |
| Animaciones | Framer Motion |
| Charts | Recharts |
| Auth | JWT + Node.js backend (cookie httpOnly) |
| i18n | LanguageContext propio (ES / EN) |
| Fuentes | Playfair Display + Inter |

---

## Inicio rápido

```bash
# 1. Clonar
git clone https://github.com/nexora/plannora-frontend.git
cd plannora-frontend

# 2. Instalar
npm install

# 3. Variables de entorno
cp .env.example .env.local

# 4. Desarrollo
npm run dev
# http://localhost:5173
```

### Scripts

```bash
npm run dev          # Servidor de desarrollo (HMR)
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # ESLint
npm run type-check   # Verificación de tipos
```

---

## Variables de entorno

```env
# Sin esto → modo DEMO (mock users, sin backend)
VITE_API_URL=http://localhost:3000
```

---

## Estructura

```
src/
├── components/
│   ├── DashboardLayout.tsx       # Layout /host
│   ├── AdminLayout.tsx           # Layout /admin
│   ├── VendorLayout.tsx          # Layout /vendor
│   ├── EventAdminLayout.tsx      # Layout /event-admin
│   ├── StaffLayout.tsx           # Layout /staff
│   ├── GuestAppLayout.tsx        # Layout guest app
│   ├── RequireAuth.tsx           # Guard de rutas por rol
│   └── ui/                       # shadcn/ui components
├── context/
│   ├── AuthContext.tsx           # Auth JWT dual-mode (demo/real)
│   ├── VendorContext.tsx
│   ├── BookingContext.tsx
│   ├── AccessControlContext.tsx
│   └── ThemeContext.tsx
├── pages/
│   ├── Index.tsx                 # Landing page
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Terms.tsx / Privacy.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   └── components/
│   │       ├── data.ts           # Tipos + datos (KPIs, charts, feed)
│   │       ├── KpiGrid.tsx
│   │       ├── ChartsRow.tsx
│   │       └── LiveFeed.tsx
│   ├── vendor/
│   ├── event-admin/
│   └── guest-app/
├── i18n/
│   └── LanguageContext.tsx
└── App.tsx                       # Router principal
```

---

## Portales y roles

| Portal | Ruta base | Roles permitidos |
|--------|-----------|-----------------|
| Host | `/host/*` | `host`, `superadmin` |
| Event Admin | `/event-admin/*` | `admin` |
| Vendor | `/vendor/*` | `vendor`, `superadmin` |
| Staff | `/staff/*` | `staff`, `admin`, `superadmin` |
| Super Admin | `/admin/*` | `superadmin` |
| Guest App | `/event/:slug/guest/:id/app/*` | público (sin auth) |

---

## Autenticación

Arquitectura de doble token:

- **`accessToken`** — vida 15 min, guardado en memoria React (nunca en `localStorage`)
- **`refreshToken`** — vida 7 días, cookie `httpOnly + secure + sameSite=strict`
- Auto-refresh silencioso 1 min antes de expirar

### Endpoints

```
POST  /api/auth/register   → crea usuario, devuelve accessToken + setea cookie
POST  /api/auth/login      → login email/password
POST  /api/auth/refresh    → rota refreshToken, devuelve nuevo accessToken
POST  /api/auth/logout     → limpia cookie
GET   /api/auth/me         → perfil del usuario autenticado
```

### Modo DEMO

Sin `VITE_API_URL` definido, el contexto usa `MOCK_USERS` internos:

| Email | Rol | Password |
|-------|-----|----------|
| `superadmin@planora.app` | superadmin | demo |
| `admin@planora.app` | admin | demo |
| `host@planora.app` | host | demo |
| `guest@planora.app` | guest | demo |
| `staff@planora.app` | staff | demo |
| `vendor@planora.app` | vendor | demo |

---

## Design System

### Tokens principales

```css
--gold:               42 50% 57%;   /* Acento principal, CTAs */
--background:          0  0% 100%;
--foreground:          0  0%   6%;
--card:              220 20%  97%;
--muted-foreground:    0  0%  45%;
--sidebar-background:  0  0%   4%;  /* Sidebar oscuro */
--border:              0  0%  90%;
--radius:              1rem;
```

### Tipografía

- **Playfair Display** — headings, logotipo, números grandes
- **Inter** — body, labels, UI components
- Patrón de énfasis: `<em className="italic text-[hsl(var(--gold))]">` en heroes

### Animaciones (Framer Motion)

```ts
// ⚠️ Siempre castear como tupla para evitar error de tipos
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({       // ⚠️ tipar 'i' explícitamente
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE, delay: i * 0.07 },
  }),
};
```

---

## Errores comunes

### `Type 'number[]' is not assignable to type 'Easing'`

```ts
// ❌
const EASE = [0.22, 1, 0.36, 1];

// ✅
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
```

### `Property 'currentUser' does not exist on AuthContextType`

El contexto expone `user` e `isLoading`. Usar alias:

```ts
// ❌
const { login, isAuthLoading, currentUser } = useAuth();

// ✅
const { login, isLoading: isAuthLoading, user: currentUser } = useAuth();
```

### Cookie httpOnly no se envía

Verificar que el `fetch` incluya `credentials: 'include'` y que el backend tenga CORS con `credentials: true` y `origin` explícito (no `*`).

---

## Base de datos

El seed SQL está en `plannora_seed.sql` e incluye:

- **`plannora_core.roles`** — 6 roles (superadmin, admin, host, vendor, staff, guest)
- **`plannora_core.system_modules`** — 62 módulos mapeados desde `App.tsx`, organizados en 7 secciones
- **`plannora_core.role_module_permissions`** — permisos por rol sobre cada módulo

Ajustar el nombre del schema si es diferente a `plannora_core`.

---

## Roadmap

| Feature | Estado |
|---------|--------|
| Floor Planner visual (drag & drop) | ✅ Completado |
| Gestión de invitados + RSVP | ✅ Completado |
| Check-in por QR | ✅ Completado |
| Galería colaborativa | ✅ Completado |
| DJ Booth + peticiones de canciones | ✅ Completado |
| Invitaciones digitales con QR | ✅ Completado |
| Auth JWT con backend Node.js | ✅ Completado |
| Marketplace de proveedores | 🔧 En progreso |
| Analytics real (conexión backend) | 🔧 En progreso |
| Timeline del evento en tiempo real | 📋 Planeado |
| Descarga masiva de fotos (.zip) | 📋 Planeado |
| Integración Google Drive | 📋 Planeado |
| Colaboración multiusuario (WebSocket) | 📋 Planeado |
| White-label (plan Business) | 📋 Planeado |
| App nativa iOS / Android | 💡 Idea |

---

## Licencia

© 2025 Nexora. Todos los derechos reservados.