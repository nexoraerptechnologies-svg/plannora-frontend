import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function VendorSettings() {
  const [notifications, setNotifications] = useState({ email: true, push: true, sms: false });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      {/* Account */}
      <Card className="rounded-2xl border-border/50 p-6 space-y-4">
        <h2 className="font-display font-semibold text-sm">Account</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Email</Label>
            <Input value="vendor@planora.app" disabled className="rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Account Type</Label>
            <Input value="Vendor" disabled className="rounded-xl" />
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card className="rounded-2xl border-border/50 p-6 space-y-4">
        <h2 className="font-display font-semibold text-sm">Change Password</h2>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Current Password</Label>
            <Input type="password" className="rounded-xl" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">New Password</Label>
            <Input type="password" className="rounded-xl" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Confirm New Password</Label>
            <Input type="password" className="rounded-xl" placeholder="••••••••" />
          </div>
          <Button variant="gold" className="rounded-xl" onClick={() => toast.success("Password updated")}>Update Password</Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="rounded-2xl border-border/50 p-6 space-y-4">
        <h2 className="font-display font-semibold text-sm">Notification Preferences</h2>
        <div className="space-y-4">
          {[
            { key: "email" as const, label: "Email Notifications", desc: "Receive inquiry alerts via email" },
            { key: "push" as const, label: "Push Notifications", desc: "Browser push notifications" },
            { key: "sms" as const, label: "SMS Notifications", desc: "Text message alerts (premium)" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Danger */}
      <Card className="rounded-2xl border-destructive/20 p-6 space-y-3">
        <h2 className="font-display font-semibold text-sm text-destructive">Danger Zone</h2>
        <p className="text-xs text-muted-foreground">Permanently delete your vendor account and all associated data.</p>
        <Button variant="destructive" size="sm" className="rounded-xl" onClick={() => toast.error("This is a demo — account deletion is disabled")}>
          Delete Account
        </Button>
      </Card>
    </motion.div>
  );
}
