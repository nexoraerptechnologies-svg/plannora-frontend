import { motion } from "framer-motion";
import { Eye, MessageCircle, Package, TrendingUp, Star, ArrowUpRight, DollarSign, Users, Bell, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useVendors } from "@/context/VendorContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const STAGE_COLORS: Record<string, string> = {
  inquiry: "bg-blue-500",
  negotiation: "bg-amber-500",
  proposal_sent: "bg-violet-500",
  confirmed: "bg-emerald-500",
  completed: "bg-muted-foreground",
};

export default function VendorDashboard() {
  const { myVendor, conversations, vendorStats, leads, pipeline, reviews, notifications } = useVendors();
  const { user } = useAuth();
  const totalUnread = conversations.reduce((a, c) => a + c.unread, 0);
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const stats = [
    { label: "Profile Views", value: vendorStats.views.toLocaleString(), change: "+12%", icon: Eye },
    { label: "Active Leads", value: leads.filter((l) => !["won", "lost"].includes(l.status)).length.toString(), change: `${leads.filter((l) => l.status === "new").length} new`, icon: Users, highlight: leads.some((l) => l.status === "new") },
    { label: "Pipeline Value", value: `$${(vendorStats.totalPipelineValue / 1000).toFixed(0)}K`, change: `${vendorStats.conversionRate}% conv.`, icon: DollarSign },
    { label: "Response Rate", value: `${vendorStats.responseRate}%`, change: "Excellent", icon: TrendingUp },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">Here's how your business is performing.</p>
        </div>
        {unreadNotifs > 0 && (
          <Link to="/vendor/notifications">
            <Button variant="outline" className="rounded-xl gap-2 relative">
              <Bell className="h-4 w-4" /> Notifications
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">{unreadNotifs}</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className={`rounded-2xl border-border/50 p-5 ${stat.highlight ? "border-accent/30 bg-accent/5" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.highlight ? "text-accent" : "text-muted-foreground"}`} />
              </div>
              <p className={`text-3xl font-display font-semibold mt-2 ${stat.highlight ? "text-accent" : ""}`}>{stat.value}</p>
              <p className="text-xs text-[hsl(142,70%,45%)] mt-1">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pipeline Overview */}
      <Card className="rounded-2xl border-border/50 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-sm">Booking Pipeline</h2>
          <Link to="/vendor/pipeline"><Button variant="ghost" size="sm" className="text-xs rounded-lg gap-1">View All <ArrowUpRight className="h-3 w-3" /></Button></Link>
        </div>
        <div className="flex gap-2 mb-3">
          {["inquiry", "negotiation", "proposal_sent", "confirmed", "completed"].map((stage) => {
            const count = pipeline.filter((d) => d.stage === stage).length;
            return (
              <div key={stage} className="flex-1 text-center">
                <div className={`h-2 rounded-full ${STAGE_COLORS[stage]} mb-1.5`} style={{ opacity: count > 0 ? 1 : 0.2 }} />
                <p className="text-[10px] font-medium">{count}</p>
                <p className="text-[8px] text-muted-foreground capitalize">{stage.replace("_", " ")}</p>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Leads */}
        <Card className="rounded-2xl border-border/50">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm">Recent Leads</h2>
            <Link to="/vendor/leads"><Button variant="ghost" size="sm" className="text-xs rounded-lg gap-1">View All <ArrowUpRight className="h-3 w-3" /></Button></Link>
          </div>
          <div className="divide-y divide-border/10">
            {leads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                  {lead.organizerName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{lead.organizerName}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{lead.eventName} · {lead.budget ? `$${lead.budget.toLocaleString()}` : "No budget"}</p>
                </div>
                <Badge variant="secondary" className="text-[8px] rounded-full capitalize">{lead.status.replace("_", " ")}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Messages */}
        <Card className="rounded-2xl border-border/50">
          <div className="p-4 border-b border-border/30 flex items-center justify-between">
            <h2 className="font-display font-semibold text-sm">Recent Messages</h2>
            <Link to="/vendor/messages"><Button variant="ghost" size="sm" className="text-xs rounded-lg gap-1">View All <ArrowUpRight className="h-3 w-3" /></Button></Link>
          </div>
          <div className="divide-y divide-border/10">
            {conversations.slice(0, 4).map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              return (
                <Link to="/vendor/messages" key={conv.id} className="px-4 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                    {conv.organizerName.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{conv.organizerName}</p>
                      {conv.unread > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{lastMsg.text}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{lastMsg.timestamp}</span>
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Reviews Summary & Profile */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-sm">Latest Reviews</h2>
            <Link to="/vendor/reviews"><Button variant="ghost" size="sm" className="text-xs rounded-lg gap-1">All Reviews <ArrowUpRight className="h-3 w-3" /></Button></Link>
          </div>
          <div className="space-y-3">
            {reviews.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-start gap-3">
                <div className="flex items-center gap-0.5 shrink-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-2.5 w-2.5 ${i < r.rating ? "fill-accent text-accent" : "text-muted"}`} />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground truncate">{r.comment}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">— {r.reviewerName}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-2xl border-border/50 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-lg font-display font-semibold text-gold-foreground shrink-0">
            {myVendor.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold">{myVendor.name}</h3>
              {myVendor.verified && <Badge variant="outline" className="text-[8px] rounded-full border-accent/20 text-accent">✓ Verified</Badge>}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <Star className="h-3 w-3 fill-accent text-accent" /> {myVendor.rating} ({myVendor.reviewCount} reviews) · {myVendor.location}
            </p>
          </div>
          <Link to="/vendor/profile"><Button variant="gold-outline" size="sm" className="rounded-xl text-xs">Edit Profile</Button></Link>
        </Card>
      </div>
    </motion.div>
  );
}
