import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const plans = [
  { name: "Free", price: "$0", features: ["1 event", "50 guests", "Basic gallery"], current: false },
  { name: "Pro", price: "$19", features: ["5 events", "500 guests", "Full gallery", "Custom URL", "Table management"], current: true },
  { name: "Business", price: "$49", features: ["Unlimited events", "Unlimited guests", "Priority support", "Custom branding", "API access"], current: false },
];

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your event and account preferences.</p>
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader><CardTitle className="font-display text-lg">Event Customization</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Event URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">planora.app/</span>
              <Input defaultValue="alan-y-sofia" className="rounded-xl max-w-xs" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="flex gap-3">
              {["Classic Gold", "Minimal White", "Dark Elegance", "Garden"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-2 rounded-xl text-sm border transition-all ${i === 0 ? "border-gold bg-gold/10 text-gold" : "border-border text-muted-foreground hover:border-gold/50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/50 shadow-sm">
        <CardHeader><CardTitle className="font-display text-lg">Account</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue="Alan Nexora" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue="alan@nexora.dev" className="rounded-xl" />
            </div>
          </div>
          <Button variant="gold" className="rounded-2xl">Save Changes</Button>
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-2xl font-display font-semibold mb-1">Subscription</h2>
        <p className="text-muted-foreground mb-6">Choose the plan that fits your needs.</p>
        <div className="grid gap-5 sm:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className={`rounded-2xl shadow-sm transition-all ${plan.current ? "border-gold shadow-md ring-1 ring-gold/30" : "border-border/50"}`}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold">{plan.name}</h3>
                  {plan.current && <Badge className="bg-gold/10 text-gold border-0 text-xs">Current</Badge>}
                </div>
                <div className="text-3xl font-display font-bold">{plan.price}<span className="text-sm text-muted-foreground font-normal">/mo</span></div>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-3.5 w-3.5 text-gold" />{f}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.current ? "gold" : "outline"} className="w-full rounded-xl" disabled={plan.current}>
                  {plan.current ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
