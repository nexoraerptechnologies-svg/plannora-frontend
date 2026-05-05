import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Palette, Globe, Shield, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">System-wide configuration and preferences.</p>
      </div>

      {/* Branding */}
      <Card className="rounded-2xl border-border/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-display font-semibold">Branding</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Platform Name</label>
            <Input defaultValue="Planora" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Subtitle</label>
            <Input defaultValue="by Nexora" className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Primary Color</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-gold border border-accent/40" />
              <Input defaultValue="#B8953F" className="rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Support Email</label>
            <Input defaultValue="support@planora.app" className="rounded-xl" />
          </div>
        </div>
      </Card>

      {/* General */}
      <Card className="rounded-2xl border-border/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-display font-semibold">General</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Maintenance Mode", desc: "Show maintenance page to all non-admin users", default: false },
            { label: "User Registration", desc: "Allow new users to register on the platform", default: true },
            { label: "Vendor Applications", desc: "Accept new vendor applications", default: true },
            { label: "Public Events", desc: "Allow events to be publicly visible", default: true },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <Switch defaultChecked={setting.default} />
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="rounded-2xl border-border/50 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-display font-semibold">Security</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Two-Factor Authentication", desc: "Require 2FA for admin accounts", default: true },
            { label: "Rate Limiting", desc: "Enable API rate limiting for all endpoints", default: true },
            { label: "IP Blocklist", desc: "Block suspicious IP addresses automatically", default: false },
          ].map((setting) => (
            <div key={setting.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <Switch defaultChecked={setting.default} />
            </div>
          ))}
        </div>
      </Card>

      <Button onClick={handleSave} variant="gold" className="rounded-xl">
        {saved ? "Saved! ✓" : <><Save className="h-4 w-4 mr-2" /> Save Settings</>}
      </Button>
    </motion.div>
  );
}
