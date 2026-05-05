import { motion } from "framer-motion";
import { Users, Calendar, Store, BarChart3, TrendingUp, Camera, QrCode, DollarSign, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const kpis = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "text-accent" },
  { label: "Active Events", value: "156", change: "+8%", icon: Calendar, color: "text-[hsl(var(--success))]" },
  { label: "Total Guests", value: "18,432", change: "+24%", icon: Users, color: "text-accent" },
  { label: "Active Vendors", value: "89", change: "+15%", icon: Store, color: "text-accent" },
  { label: "Daily Check-ins", value: "342", change: "+18%", icon: QrCode, color: "text-[hsl(var(--success))]" },
  { label: "Photos Today", value: "1,205", change: "+32%", icon: Camera, color: "text-accent" },
  { label: "Monthly Revenue", value: "$48.2K", change: "+23%", icon: DollarSign, color: "text-[hsl(var(--success))]" },
];

const userGrowth = [
  { month: "Jan", users: 1200 }, { month: "Feb", users: 1450 }, { month: "Mar", users: 1680 },
  { month: "Apr", users: 1920 }, { month: "May", users: 2200 }, { month: "Jun", users: 2520 }, { month: "Jul", users: 2847 },
];

const eventCreation = [
  { month: "Jan", events: 18 }, { month: "Feb", events: 22 }, { month: "Mar", events: 28 },
  { month: "Apr", events: 35 }, { month: "May", events: 42 }, { month: "Jun", events: 48 }, { month: "Jul", events: 56 },
];

const liveFeed = [
  { id: 1, message: "New event created: 'Corporate Gala 2026'", time: "2 min ago", type: "event" },
  { id: 2, message: "Guest María García checked in", time: "5 min ago", type: "checkin" },
  { id: 3, message: "3 new photos uploaded to 'Alan & Sofía Wedding'", time: "8 min ago", type: "photo" },
  { id: 4, message: "Vendor 'DJ Elektra' received a new inquiry", time: "12 min ago", type: "vendor" },
  { id: 5, message: "New user registered: Elena Rivera (Host)", time: "15 min ago", type: "user" },
  { id: 6, message: "Song suggestion: 'Vivir Mi Vida' received 8 votes", time: "20 min ago", type: "music" },
  { id: 7, message: "Payment received: $299 (Pro Plan)", time: "25 min ago", type: "payment" },
  { id: 8, message: "New vendor application: 'Flores Elegantes'", time: "30 min ago", type: "vendor" },
];

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Control Center</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {user?.name}. Real-time platform overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="rounded-2xl border-border/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-[10px] text-[hsl(var(--success))] flex items-center gap-0.5">
                  <TrendingUp className="h-2.5 w-2.5" />{kpi.change}
                </span>
              </div>
              <p className="text-xl font-display font-bold">{kpi.value}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{kpi.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/50 p-5">
          <h2 className="text-sm font-display font-semibold mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowth}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(42,50%,57%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(42,50%,57%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="hsl(42,50%,57%)" fill="url(#userGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-2xl border-border/50 p-5">
          <h2 className="text-sm font-display font-semibold mb-4">Event Creation Trends</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={eventCreation}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="events" fill="hsl(42,50%,57%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card className="rounded-2xl border-border/50">
        <div className="p-4 border-b border-border/30 flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-display font-semibold">Live Activity Feed</h2>
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse ml-1" />
        </div>
        <div className="divide-y divide-border/10 max-h-80 overflow-y-auto">
          {liveFeed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="px-4 py-3 flex items-center gap-3 hover:bg-muted/10 transition-colors"
            >
              <div className="w-2 h-2 rounded-full bg-accent shrink-0" />
              <p className="text-sm text-foreground flex-1">{item.message}</p>
              <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
