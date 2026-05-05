import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MoreVertical, Search, Eye, Pause, Trash2, Image } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const events = [
  { id: "e-1", name: "Alan & Sofía Wedding", host: "Alan Nexora", date: "Jul 15, 2026", guests: 120, photos: 342, checkins: 85, status: "active" },
  { id: "e-2", name: "Company Retreat 2026", host: "Diego H.", date: "Aug 5, 2026", guests: 45, photos: 0, checkins: 0, status: "draft" },
  { id: "e-3", name: "XV Años - Isabella", host: "Torres Family", date: "Sep 20, 2026", guests: 200, photos: 156, checkins: 120, status: "active" },
  { id: "e-4", name: "Corporate Gala", host: "Nexora Corp", date: "Oct 10, 2026", guests: 300, photos: 0, checkins: 0, status: "upcoming" },
  { id: "e-5", name: "Birthday Bash", host: "Valentina C.", date: "Nov 1, 2026", guests: 50, photos: 0, checkins: 0, status: "draft" },
  { id: "e-6", name: "Spring Festival", host: "City Events", date: "Apr 20, 2026", guests: 500, photos: 890, checkins: 420, status: "completed" },
  { id: "e-7", name: "Charity Dinner", host: "Foundation X", date: "Mar 15, 2026", guests: 150, photos: 234, checkins: 140, status: "completed" },
  { id: "e-8", name: "Product Launch", host: "TechCo", date: "Dec 1, 2026", guests: 80, photos: 0, checkins: 0, status: "suspended" },
];

export default function AdminEvents() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = events.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s: string) => {
    if (s === "active") return "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]";
    if (s === "completed") return "bg-accent/10 text-accent";
    if (s === "suspended") return "bg-destructive/10 text-destructive";
    if (s === "upcoming") return "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]";
    return "";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 w-100">
      <div>
        <h1 className="text-3xl font-display font-semibold">Event Management</h1>
        <p className="text-muted-foreground mt-1">Control and monitor all platform events.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {["active", "completed", "draft", "suspended"].map((s) => (
          <Card key={s} className="rounded-2xl border-border/50 p-4 text-center">
            <p className="text-2xl font-display font-bold">{events.filter((e) => e.status === s).length}</p>
            <Badge variant="secondary" className={`text-[9px] rounded-full mt-1 ${statusColor(s)}`}>{s}</Badge>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {["Event", "Host", "Date", "Guests", "Photos", "Check-ins", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((ev) => (
                <tr key={ev.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <p className="text-sm font-medium">{ev.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ev.host}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ev.date}</td>
                  <td className="px-4 py-3 text-sm"><span className="flex items-center gap-1"><Users className="h-3 w-3 text-muted-foreground" />{ev.guests}</span></td>
                  <td className="px-4 py-3 text-sm"><span className="flex items-center gap-1"><Image className="h-3 w-3 text-muted-foreground" />{ev.photos}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{ev.checkins}</td>
                  <td className="px-4 py-3"><Badge variant="secondary" className={`text-[9px] rounded-full ${statusColor(ev.status)}`}>{ev.status}</Badge></td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><MoreVertical className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="text-xs gap-2"><Eye className="h-3 w-3" /> View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2"><Users className="h-3 w-3" /> Guest List</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2"><Image className="h-3 w-3" /> Gallery</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs gap-2 text-[hsl(var(--warning))]"><Pause className="h-3 w-3" /> Suspend</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2 text-destructive"><Trash2 className="h-3 w-3" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}
