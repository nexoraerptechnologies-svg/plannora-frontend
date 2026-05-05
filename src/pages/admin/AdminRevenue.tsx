import { motion } from "framer-motion";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenue = [
  { month: "Jan", mrr: 12400, total: 14200 }, { month: "Feb", mrr: 14800, total: 17100 },
  { month: "Mar", mrr: 18200, total: 21500 }, { month: "Apr", mrr: 22100, total: 26800 },
  { month: "May", mrr: 28500, total: 33400 }, { month: "Jun", mrr: 35200, total: 41800 },
  { month: "Jul", mrr: 42100, total: 48200 },
];

const byPlan = [
  { plan: "Free", users: 1842, revenue: 0 },
  { plan: "Pro", users: 680, revenue: 20400 },
  { plan: "Premium", users: 325, revenue: 27625 },
];

const transactions = [
  { id: "t-1", user: "Alan Nexora", plan: "Premium", amount: "$85", date: "Today", status: "completed" },
  { id: "t-2", user: "Elena Rivera", plan: "Pro", amount: "$30", date: "Today", status: "completed" },
  { id: "t-3", user: "Torres Family", plan: "Premium", amount: "$85", date: "Yesterday", status: "completed" },
  { id: "t-4", user: "Diego H.", plan: "Pro", amount: "$30", date: "Yesterday", status: "refunded" },
  { id: "t-5", user: "TechCo", plan: "Premium", amount: "$85", date: "2 days ago", status: "completed" },
];

export default function AdminRevenue() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Revenue</h1>
        <p className="text-muted-foreground mt-1">Financial overview and payment tracking.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Revenue", value: "$48,200", change: "+23%", icon: DollarSign },
          { label: "MRR", value: "$42,100", change: "+19%", icon: TrendingUp },
          { label: "Avg. Transaction", value: "$57.50", change: "+8%", icon: CreditCard },
          { label: "Active Subs", value: "1,005", change: "+15%", icon: ArrowUpRight },
        ].map((m, i) => (
          <Card key={m.label} className="rounded-2xl border-border/50 p-4">
            <m.icon className="h-4 w-4 text-accent mb-2" />
            <p className="text-2xl font-display font-bold">{m.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{m.label}</p>
              <span className="text-[10px] text-[hsl(var(--success))] flex items-center gap-0.5"><TrendingUp className="h-2.5 w-2.5" />{m.change}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/50 p-5">
          <h2 className="text-sm font-display font-semibold mb-4">Revenue Growth</h2>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(42,50%,57%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(42,50%,57%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="total" stroke="hsl(42,50%,57%)" fill="url(#revGrad)" strokeWidth={2} name="Total" />
              <Area type="monotone" dataKey="mrr" stroke="hsl(142,70%,45%)" fill="transparent" strokeWidth={2} name="MRR" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="rounded-2xl border-border/50 p-5">
          <h2 className="text-sm font-display font-semibold mb-4">Revenue by Plan</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={byPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,15%)" />
              <XAxis dataKey="plan" tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0,0%,45%)" }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ background: "hsl(0,0%,7%)", border: "1px solid hsl(0,0%,15%)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="revenue" fill="hsl(42,50%,57%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h2 className="text-sm font-display font-semibold">Recent Transactions</h2>
        </div>
        <div className="divide-y divide-border/10">
          {transactions.map((t) => (
            <div key={t.id} className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                {t.user.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.user}</p>
                <p className="text-[10px] text-muted-foreground">{t.plan} · {t.date}</p>
              </div>
              <p className="text-sm font-semibold text-accent">{t.amount}</p>
              <span className={`text-[9px] px-2 py-0.5 rounded-full ${t.status === "completed" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : "bg-destructive/10 text-destructive"}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
