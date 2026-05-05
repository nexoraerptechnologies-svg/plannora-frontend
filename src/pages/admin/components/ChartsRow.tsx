// src/pages/admin/components/ChartsRow.tsx
import { Card } from "@/components/ui/card";
import {
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import { USER_GROWTH, EVENT_CREATION } from "./data";

// ─── Shared tooltip style ─────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    background:   "hsl(0,0%,7%)",
    border:       "1px solid hsl(0,0%,15%)",
    borderRadius: 12,
    fontSize:     12,
    color:        "hsl(0,0%,85%)",
  },
  cursor: { stroke: "hsl(42,50%,57%)", strokeWidth: 1, strokeDasharray: "4 4" },
};

const axisStyle = { fontSize: 10, fill: "hsl(0,0%,45%)" };
const gridStyle = { strokeDasharray: "3 3", stroke: "hsl(0,0%,12%)" };

// ─── User Growth chart ────────────────────────────────────────────────────────

function UserGrowthChart() {
  return (
    <Card className="rounded-2xl border-border/50 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-[15px] font-semibold">Crecimiento de usuarios</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Enero – Julio 2025</p>
        </div>
        <span className="text-[11px] font-medium text-green-500 bg-green-500/10 px-2.5 py-1 rounded-full">
          +137%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={USER_GROWTH} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="hsl(42,50%,57%)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="hsl(42,50%,57%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Area
            type="monotone"
            dataKey="users"
            stroke="hsl(42,50%,57%)"
            fill="url(#userGrad)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: "hsl(42,50%,57%)", strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Event Creation chart ─────────────────────────────────────────────────────

function EventCreationChart() {
  return (
    <Card className="rounded-2xl border-border/50 p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-[15px] font-semibold">Creación de eventos</h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Eventos nuevos por mes</p>
        </div>
        <span className="text-[11px] font-medium text-[hsl(var(--gold))] bg-[hsl(var(--gold)/0.1)] px-2.5 py-1 rounded-full">
          +211%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={EVENT_CREATION} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid {...gridStyle} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar
            dataKey="events"
            fill="hsl(42,50%,57%)"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function ChartsRow() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <UserGrowthChart />
      <EventCreationChart />
    </div>
  );
}