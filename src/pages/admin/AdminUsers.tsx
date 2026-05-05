import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, Shield, Ban, KeyRound, Eye, UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_LABELS, ROLE_COLORS, UserRole } from "@/context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const allUsers = [
  { id: "u-001", name: "Admin Nexora", email: "admin@planora.app", role: "admin" as UserRole, status: "active", joined: "Jan 2025", lastActive: "2 min ago", events: 0 },
  { id: "u-002", name: "Alan Nexora", email: "host@planora.app", role: "host" as UserRole, status: "active", joined: "Feb 2025", lastActive: "1 hr ago", events: 3 },
  { id: "u-003", name: "María García", email: "maria@email.com", role: "guest" as UserRole, status: "active", joined: "Mar 2025", lastActive: "5 min ago", events: 1 },
  { id: "u-004", name: "Carlos Security", email: "staff@email.com", role: "staff" as UserRole, status: "active", joined: "Mar 2025", lastActive: "10 min ago", events: 2 },
  { id: "u-005", name: "Hacienda Los Robles", email: "vendor@email.com", role: "vendor" as UserRole, status: "active", joined: "Apr 2025", lastActive: "30 min ago", events: 0 },
  { id: "u-006", name: "Valentina Cruz", email: "valentina@email.com", role: "guest" as UserRole, status: "suspended", joined: "May 2025", lastActive: "2 days ago", events: 1 },
  { id: "u-007", name: "DJ Elektra", email: "dj@email.com", role: "vendor" as UserRole, status: "active", joined: "Jun 2025", lastActive: "3 hrs ago", events: 0 },
  { id: "u-008", name: "Elena Rivera", email: "elena@email.com", role: "host" as UserRole, status: "active", joined: "Jul 2025", lastActive: "1 day ago", events: 1 },
  { id: "u-009", name: "Pedro Ruiz", email: "pedro@email.com", role: "guest" as UserRole, status: "active", joined: "Jul 2025", lastActive: "4 hrs ago", events: 2 },
  { id: "u-010", name: "Laura Vega", email: "laura@email.com", role: "staff" as UserRole, status: "inactive", joined: "Aug 2025", lastActive: "1 week ago", events: 1 },
];

const PAGE_SIZE = 8;

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(0);

  const filtered = allUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage all platform users, roles, and permissions.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-5">
        {(["admin", "host", "guest", "staff", "vendor"] as UserRole[]).map((role) => (
          <Card key={role} className="rounded-2xl border-border/50 p-4 text-center">
            <p className="text-2xl font-display font-bold">{allUsers.filter((u) => u.role === role).length}</p>
            <Badge variant="outline" className={`text-[8px] rounded-full border mt-1 ${ROLE_COLORS[role]}`}>{ROLE_LABELS[role]}</Badge>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9 rounded-xl" />
          </div>
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(0); }}>
            <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Filter by role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="host">Host</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="gold" size="sm" className="rounded-xl text-xs ml-auto">Add User</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {["User", "Role", "Status", "Last Active", "Events", "Joined", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((u) => (
                <tr key={u.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-[9px] rounded-full border ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={`text-[9px] rounded-full ${u.status === "active" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : u.status === "suspended" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastActive}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.events}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.joined}</td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><MoreVertical className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="text-xs gap-2"><Eye className="h-3 w-3" /> View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2"><UserCog className="h-3 w-3" /> Change Role</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2"><KeyRound className="h-3 w-3" /> Force Logout</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs gap-2 text-destructive"><Ban className="h-3 w-3" /> Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-3 border-t border-border/30 flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">{filtered.length} users total</p>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)} className={`w-7 h-7 rounded-lg text-xs ${page === i ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted/20"}`}>{i + 1}</button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
