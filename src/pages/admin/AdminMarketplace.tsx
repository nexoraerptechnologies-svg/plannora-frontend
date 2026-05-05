import { motion } from "framer-motion";
import { ShoppingBag, Star, Eye, EyeOff, BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useVendors, CATEGORY_LABELS } from "@/context/VendorContext";

const categories = [
  { id: "venue", name: "Venues", count: 12, visible: true },
  { id: "catering", name: "Catering", count: 8, visible: true },
  { id: "dj", name: "DJ / Music", count: 15, visible: true },
  { id: "flowers", name: "Flowers & Decor", count: 10, visible: true },
  { id: "photography", name: "Photography", count: 18, visible: true },
  { id: "drinks", name: "Drinks & Bar", count: 6, visible: false },
];

export default function AdminMarketplace() {
  const { vendors } = useVendors();
  const featured = vendors.filter((v) => v.featured);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Marketplace Control</h1>
        <p className="text-muted-foreground mt-1">Manage featured vendors and marketplace categories.</p>
      </div>

      {/* Featured Vendors */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Featured Vendors</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <Card key={v.id} className="rounded-2xl border-accent/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-sm font-semibold text-accent">{v.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium truncate">{v.name}</p>
                    {v.verified && <BadgeCheck className="h-3 w-3 text-accent shrink-0" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{CATEGORY_LABELS[v.category]}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-medium">{v.rating}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="rounded-xl text-xs flex-1">Remove Feature</Button>
                <Button variant="ghost" size="sm" className="rounded-xl text-xs"><Eye className="h-3 w-3" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories */}
      <Card className="rounded-2xl border-border/50">
        <div className="p-4 border-b border-border/30">
          <h2 className="text-sm font-display font-semibold">Category Management</h2>
        </div>
        <div className="divide-y divide-border/10">
          {categories.map((cat) => (
            <div key={cat.id} className="px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="h-3.5 w-3.5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{cat.name}</p>
                <p className="text-[10px] text-muted-foreground">{cat.count} vendors</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{cat.visible ? "Visible" : "Hidden"}</span>
                <Switch defaultChecked={cat.visible} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
