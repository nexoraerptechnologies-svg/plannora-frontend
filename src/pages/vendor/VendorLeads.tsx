import { useState } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Calendar, Filter, MoreVertical, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useVendors, LeadStatus } from "@/context/VendorContext";
import { toast } from "sonner";

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-500/10 text-blue-500" },
  contacted: { label: "Contacted", color: "bg-amber-500/10 text-amber-500" },
  qualified: { label: "Qualified", color: "bg-violet-500/10 text-violet-500" },
  proposal_sent: { label: "Proposal Sent", color: "bg-accent/10 text-accent" },
  won: { label: "Won", color: "bg-emerald-500/10 text-emerald-500" },
  lost: { label: "Lost", color: "bg-destructive/10 text-destructive" },
};

export default function VendorLeads() {
  const { leads, updateLeadStatus, vendorStats } = useVendors();
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? leads : leads.filter((l) => l.status === filter);

  const totalBudget = leads.reduce((a, l) => a + (l.budget || 0), 0);
  const wonBudget = leads.filter((l) => l.status === "won").reduce((a, l) => a + (l.budget || 0), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Leads</h1>
        <p className="text-muted-foreground mt-1">Track and convert inquiries into bookings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Leads", value: leads.length, icon: Users, change: "+3 this month" },
          { label: "Pipeline Value", value: `$${(totalBudget / 1000).toFixed(0)}K`, icon: DollarSign, change: `$${(wonBudget / 1000).toFixed(0)}K won` },
          { label: "Conversion Rate", value: `${vendorStats.conversionRate}%`, icon: TrendingUp, change: "vs 15% avg" },
          { label: "Avg Response", value: "2.3h", icon: Calendar, change: "Within SLA" },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border-border/50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-display font-semibold mt-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-44 rounded-xl"><Filter className="h-3 w-3 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Leads</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {["Lead", "Event", "Date", "Budget", "Service", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent">
                        {lead.organizerName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{lead.organizerName}</p>
                        <p className="text-[10px] text-muted-foreground">Added {lead.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{lead.eventName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{lead.eventDate}</td>
                  <td className="px-4 py-3 text-sm font-medium">{lead.budget ? `$${lead.budget.toLocaleString()}` : "—"}</td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-[9px] rounded-full">{lead.serviceInterest}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge className={`text-[9px] rounded-full border-0 ${STATUS_CONFIG[lead.status].color}`}>{STATUS_CONFIG[lead.status].label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><MoreVertical className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                          <DropdownMenuItem key={k} className="text-xs" onClick={() => { updateLeadStatus(lead.id, k as LeadStatus); toast.success(`Lead marked as ${v.label}`); }}>{v.label}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
