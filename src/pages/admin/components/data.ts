// src/pages/admin/components/data.ts
// ─── Tipos ────────────────────────────────────────────────────────────────────

export type FeedType = "event" | "checkin" | "photo" | "vendor" | "user" | "music" | "payment";

export interface KpiItem {
  label:  string;
  value:  string;
  change: string;
  icon:   React.ComponentType<{ className?: string }>;
  color:  string;
}

export interface FeedItem {
  id:      number;
  message: string;
  time:    string;
  type:    FeedType;
}

export interface ChartPoint {
  month: string;
  [key: string]: string | number;
}

// ─── KPIs ─────────────────────────────────────────────────────────────────────

import { Users, Calendar, Store, QrCode, Camera, DollarSign } from "lucide-react";

export const KPIS: KpiItem[] = [
  { label: "Usuarios totales",    value: "2,847",  change: "+12%", icon: Users,    color: "text-[hsl(var(--gold))]" },
  { label: "Eventos activos",     value: "156",    change: "+8%",  icon: Calendar, color: "text-green-500" },
  { label: "Invitados totales",   value: "18,432", change: "+24%", icon: Users,    color: "text-[hsl(var(--gold))]" },
  { label: "Proveedores activos", value: "89",     change: "+15%", icon: Store,    color: "text-[hsl(var(--gold))]" },
  { label: "Check-ins hoy",       value: "342",    change: "+18%", icon: QrCode,   color: "text-green-500" },
  { label: "Fotos hoy",           value: "1,205",  change: "+32%", icon: Camera,   color: "text-[hsl(var(--gold))]" },
  { label: "Ingresos mensuales",  value: "$48.2K", change: "+23%", icon: DollarSign, color: "text-green-500" },
];

// ─── Charts ───────────────────────────────────────────────────────────────────

export const USER_GROWTH: ChartPoint[] = [
  { month: "Ene", users: 1200 },
  { month: "Feb", users: 1450 },
  { month: "Mar", users: 1680 },
  { month: "Abr", users: 1920 },
  { month: "May", users: 2200 },
  { month: "Jun", users: 2520 },
  { month: "Jul", users: 2847 },
];

export const EVENT_CREATION: ChartPoint[] = [
  { month: "Ene", events: 18 },
  { month: "Feb", events: 22 },
  { month: "Mar", events: 28 },
  { month: "Abr", events: 35 },
  { month: "May", events: 42 },
  { month: "Jun", events: 48 },
  { month: "Jul", events: 56 },
];

// ─── Live Feed ────────────────────────────────────────────────────────────────

export const LIVE_FEED: FeedItem[] = [
  { id: 1, message: "Nuevo evento creado: 'Gala Corporativa 2026'",          time: "Hace 2 min",  type: "event" },
  { id: 2, message: "Check-in de invitado: María García",                    time: "Hace 5 min",  type: "checkin" },
  { id: 3, message: "3 nuevas fotos subidas a 'Boda Alan & Sofía'",          time: "Hace 8 min",  type: "photo" },
  { id: 4, message: "Proveedor 'DJ Elektra' recibió una nueva consulta",     time: "Hace 12 min", type: "vendor" },
  { id: 5, message: "Nuevo usuario registrado: Elena Rivera (Host)",         time: "Hace 15 min", type: "user" },
  { id: 6, message: "'Vivir Mi Vida' recibió 8 votos en DJ Booth",           time: "Hace 20 min", type: "music" },
  { id: 7, message: "Pago recibido: $299 (Plan Pro)",                        time: "Hace 25 min", type: "payment" },
  { id: 8, message: "Nueva solicitud de proveedor: 'Flores Elegantes'",      time: "Hace 30 min", type: "vendor" },
];

// ─── Feed type → color ────────────────────────────────────────────────────────

export const FEED_DOT: Record<FeedType, string> = {
  event:   "bg-[hsl(var(--gold))]",
  checkin: "bg-green-500",
  photo:   "bg-blue-500",
  vendor:  "bg-purple-500",
  user:    "bg-cyan-500",
  music:   "bg-pink-500",
  payment: "bg-emerald-500",
};