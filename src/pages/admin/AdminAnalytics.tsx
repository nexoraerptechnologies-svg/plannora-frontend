import { motion } from "framer-motion";
import { BarChart3, Users, Camera, QrCode, TrendingUp, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const engagement = [
  { day: "Mon", logins: 420, actions: 850 }, { day: "Tue", logins: 380, actions: 720 },
  { day: "Wed", logins: 510, actions: 980 }, { day: "Thu", logins: 460, actions: 870 },
  { day: "Fri", logins: 600, actions: 1200 }, { day: "Sat", logins: 850, actions: 1800 },
  { day: "Sun", logins: 720, actions: 1500 },
];

const activity = [
  { month: "Jan", photos: 450, checkins: 320, songs: 120 },
  { month: "Feb", photos: 580, checkins: 410, songs: 180 },
  { month: "Mar", photos: 720, checkins: 550, songs: 240 },
  { month: "Apr", photos: 890, checkins: 680, songs: 320 },
  { month: "May", photos: 1050, checkins: 820, songs: 400 },
  { month: "Jun", photos: 1200, checkins: 950, songs: 480 },
];

const eventTypes = [
  { name: "Weddings", value: 45, color: "hsl(42,50%,57%)" },
  { name: "XV Años", value: 20, color: "hsl(42,60%,72%)" },
  { name: "Corporate", value: 18, color: "hsl(0,0%,45%)" },
  { name: "Birthdays", value: 12, color: "hsl(0,0%,65%)" },
  { name: "Other", value: 5, color: "hsl(0,0%,25%)" },
];

const metrics = [
  { label: "Avg. Session", value: "8.2 min", icon: Users, change: "+12%" },
  { label: "Photo Rate", value: "3.4/guest", icon: Camera, change: "+28%" },
  { label: "Check-in Rate", value: "94.2%", icon: QrCode, change: "+5%" },
  { label: "Event Satisfaction", value: "4.8/5", icon: Calendar, change: "+8%" },
];

export default function AdminAnalytics() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep insights into platform engagement and activity.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="rounded-2xl border-border/50 p-4">
              <m.icon className="h-4 w-4 text-accent mb-2" />
              <p className="text-2xl font-display font-bold">{m.value}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
                <span className="text-[10px] text-[hsl(var(--success))] flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" />{m.change}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/50 p-5">
          <h2 className="text-sm font-display font-semibold mb-4">User Engagement (Weekly)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={engagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="logins" fill="hsl(42,50%,57%)" radius={[4, 4, 0, 0]} name="Logins" />
              <Bar dataKey="actions" fill="hsl(42,50%,57%,.3)" radius={[4, 4, 0, 0]} name="Actions" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-2xl border-border/50 p-5">
          <h2 className="text-sm font-display font-semibold mb-4">Event Types Distribution</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={eventTypes} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                  {eventTypes.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {eventTypes.map((t) => (
                <div key={t.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                  <span className="text-xs text-muted-foreground">{t.name}</span>
                  <span className="text-xs font-medium ml-auto">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 p-5">
        <h2 className="text-sm font-display font-semibold mb-4">Guest Activity Trends</h2>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={activity}>
            <defs>
              <linearGradient id="photoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(42,50%,57%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(42,50%,57%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
            <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: 12, fontSize: 12 }} />
            <Area type="monotone" dataKey="photos" stroke="hsl(42,50%,57%)" fill="url(#photoGrad)" strokeWidth={2} name="Photos" />
            <Area type="monotone" dataKey="checkins" stroke="hsl(142,70%,45%)" fill="transparent" strokeWidth={2} name="Check-ins" />
            <Area type="monotone" dataKey="songs" stroke="hsl(0,0%,55%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" name="Songs" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
