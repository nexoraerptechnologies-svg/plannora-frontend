import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Star, BadgeCheck, Search, MoreVertical, MapPin, Eye, Award, Ban, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVendors, CATEGORY_LABELS } from "@/context/VendorContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

export default function AdminVendors() {
  const { vendors } = useVendors();
  const [search, setSearch] = useState("");
  const filtered = vendors.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Vendor Management</h1>
        <p className="text-muted-foreground mt-1">Approve, verify, and manage marketplace vendors.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        <Card className="rounded-2xl border-border/50 p-4 text-center">
          <p className="text-2xl font-display font-bold">{vendors.length}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Total Vendors</p>
        </Card>
        <Card className="rounded-2xl border-border/50 p-4 text-center">
          <p className="text-2xl font-display font-bold">{vendors.filter((v) => v.verified).length}</p>
          <p className="text-[9px] text-[hsl(var(--success))] uppercase tracking-wider mt-0.5">Verified</p>
        </Card>
        <Card className="rounded-2xl border-border/50 p-4 text-center">
          <p className="text-2xl font-display font-bold">{vendors.filter((v) => v.featured).length}</p>
          <p className="text-[9px] text-accent uppercase tracking-wider mt-0.5">Featured</p>
        </Card>
        <Card className="rounded-2xl border-border/50 p-4 text-center">
          <p className="text-2xl font-display font-bold">{vendors.filter((v) => !v.verified).length}</p>
          <p className="text-[9px] text-[hsl(var(--warning))] uppercase tracking-wider mt-0.5">Pending</p>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 rounded-xl" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {["Vendor", "Category", "Location", "Rating", "Services", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">{v.name[0]}</div>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium">{v.name}</p>
                          {v.verified && <BadgeCheck className="h-3 w-3 text-accent" />}
                          {v.featured && <Star className="h-3 w-3 fill-accent text-accent" />}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="secondary" className="text-[9px] rounded-full">{CATEGORY_LABELS[v.category]}</Badge></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{v.location}</span></td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm"><Star className="h-3 w-3 fill-accent text-accent" />{v.rating}</span></td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{v.services.length}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={`text-[9px] rounded-full ${v.verified ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]"}`}>
                      {v.verified ? "Verified" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg"><MoreVertical className="h-3.5 w-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="text-xs gap-2"><Eye className="h-3 w-3" /> View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2"><BadgeCheck className="h-3 w-3" /> Verify</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2"><Award className="h-3 w-3" /> Feature</DropdownMenuItem>
                        <DropdownMenuItem className="text-xs gap-2"><TrendingUp className="h-3 w-3" /> Promote</DropdownMenuItem>
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
      </Card>
    </motion.div>
  );
}
