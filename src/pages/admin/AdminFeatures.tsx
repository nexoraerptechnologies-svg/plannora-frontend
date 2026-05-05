import { useState } from "react";
import { motion } from "framer-motion";
import { ToggleLeft, QrCode, ShoppingBag, Camera, MessageSquare, Music, Map, Users, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const initialFeatures = [
  { id: "qr", name: "QR Check-in System", description: "Allow guests to check in using QR codes at event entrances.", icon: QrCode, enabled: true, category: "Access" },
  { id: "marketplace", name: "Vendor Marketplace", description: "Enable the vendor marketplace for event organizers to discover services.", icon: ShoppingBag, enabled: true, category: "Commerce" },
  { id: "gallery", name: "Guest Photo Gallery", description: "Allow guests to upload and share photos during events.", icon: Camera, enabled: true, category: "Social" },
  { id: "messaging", name: "In-App Messaging", description: "Enable direct messaging between organizers and vendors.", icon: MessageSquare, enabled: true, category: "Communication" },
  { id: "music", name: "Song Suggestions", description: "Let guests suggest and vote on songs during events.", icon: Music, enabled: true, category: "Social" },
  { id: "floor_planner", name: "Floor Planner", description: "Interactive floor plan builder for event layout design.", icon: Map, enabled: true, category: "Planning" },
  { id: "gamification", name: "Guest Gamification", description: "Points, badges, and leaderboard system for guest engagement.", icon: Sparkles, enabled: false, category: "Social" },
  { id: "guest_app", name: "Guest Mobile App", description: "Mobile-first guest experience with all interactive features.", icon: Users, enabled: true, category: "Experience" },
];

export default function AdminFeatures() {
  const [features, setFeatures] = useState(initialFeatures);

  const toggle = (id: string) => {
    setFeatures((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const grouped = features.reduce((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {} as Record<string, typeof features>);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Feature Control</h1>
        <p className="text-muted-foreground mt-1">Enable or disable platform features globally.</p>
      </div>

      <div className="flex gap-3">
        <Card className="rounded-2xl border-border/50 p-4 text-center flex-1">
          <p className="text-2xl font-display font-bold text-[hsl(var(--success))]">{features.filter((f) => f.enabled).length}</p>
          <p className="text-[9px] text-muted-foreground uppercase">Enabled</p>
        </Card>
        <Card className="rounded-2xl border-border/50 p-4 text-center flex-1">
          <p className="text-2xl font-display font-bold text-muted-foreground">{features.filter((f) => !f.enabled).length}</p>
          <p className="text-[9px] text-muted-foreground uppercase">Disabled</p>
        </Card>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{category}</h2>
          {items.map((feature, i) => (
            <motion.div key={feature.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="rounded-2xl border-border/50 p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.enabled ? "bg-accent/10" : "bg-muted/30"}`}>
                  <feature.icon className={`h-5 w-5 ${feature.enabled ? "text-accent" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{feature.name}</p>
                    <Badge variant="secondary" className={`text-[8px] rounded-full ${feature.enabled ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : "bg-muted text-muted-foreground"}`}>
                      {feature.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{feature.description}</p>
                </div>
                <Switch checked={feature.enabled} onCheckedChange={() => toggle(feature.id)} />
              </Card>
            </motion.div>
          ))}
        </div>
      ))}
    </motion.div>
  );
}
