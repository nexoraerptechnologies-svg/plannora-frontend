import { motion } from "framer-motion";
import { Eye, MessageCircle, TrendingUp, BarChart3, ArrowUpRight, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useVendors } from "@/context/VendorContext";

const monthlyData = [
  { month: "Jan", views: 180, inquiries: 12 },
  { month: "Feb", views: 220, inquiries: 18 },
  { month: "Mar", views: 310, inquiries: 22 },
  { month: "Apr", views: 280, inquiries: 19 },
  { month: "May", views: 390, inquiries: 28 },
  { month: "Jun", views: 420, inquiries: 35 },
];

export default function VendorAnalytics() {
  const { vendorStats } = useVendors();
  const maxViews = Math.max(...monthlyData.map((d) => d.views));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your performance and growth.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Views", value: "1,847", change: "+18%", icon: Eye },
          { label: "Inquiries", value: "42", change: "+24%", icon: MessageCircle },
          { label: "Conversion Rate", value: "12.4%", change: "+2.1%", icon: TrendingUp },
          { label: "Unique Visitors", value: "1,203", change: "+15%", icon: Users },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border-border/50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-display font-semibold mt-2">{stat.value}</p>
              <p className="text-xs text-[hsl(142,70%,45%)] mt-1 flex items-center gap-0.5"><ArrowUpRight className="h-3 w-3" />{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <Card className="rounded-2xl border-border/50 p-6">
        <h2 className="font-display font-semibold text-sm mb-6">Monthly Performance</h2>
        <div className="flex items-end gap-3 h-48">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex gap-1 items-end" style={{ height: "100%" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.views / maxViews) * 100}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex-1 bg-accent/20 rounded-t-lg min-h-[4px]"
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.inquiries / maxViews) * 100}%` }}
                  transition={{ delay: i * 0.1 + 0.1, duration: 0.5 }}
                  className="flex-1 bg-accent rounded-t-lg min-h-[4px]"
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 justify-center">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-accent/20" />Views</span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-accent" />Inquiries</span>
        </div>
      </Card>

      {/* Top sources */}
      <Card className="rounded-2xl border-border/50 p-6">
        <h2 className="font-display font-semibold text-sm mb-4">Top Traffic Sources</h2>
        <div className="space-y-3">
          {[
            { source: "Planora Marketplace", pct: 45 },
            { source: "Direct Link", pct: 28 },
            { source: "Google Search", pct: 18 },
            { source: "Social Media", pct: 9 },
          ].map((s) => (
            <div key={s.source} className="flex items-center gap-3">
              <span className="text-sm w-40 shrink-0">{s.source}</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.8 }} className="h-full bg-accent rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{s.pct}%</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
