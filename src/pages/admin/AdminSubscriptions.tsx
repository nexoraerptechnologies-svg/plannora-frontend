import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Users, Edit, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plans = [
  { id: "free", name: "Free", price: "$0", period: "/month", users: 1842, features: ["1 Event", "50 Guests", "Basic Gallery", "QR Check-in"], color: "border-border/50" },
  { id: "pro", name: "Pro", price: "$30", period: "/month", users: 680, features: ["5 Events", "500 Guests", "Full Gallery", "Floor Planner", "Music Suggestions", "Vendor Access"], color: "border-accent/40", popular: true },
  { id: "premium", name: "Premium", price: "$85", period: "/month", users: 325, features: ["Unlimited Events", "Unlimited Guests", "All Features", "Priority Support", "Custom Branding", "Analytics Dashboard", "API Access"], color: "border-accent" },
];

const subscribers = [
  { name: "Alan Nexora", plan: "Premium", status: "active", since: "Feb 2025", nextBill: "Aug 15" },
  { name: "Elena Rivera", plan: "Pro", status: "active", since: "Jul 2025", nextBill: "Aug 20" },
  { name: "Torres Family", plan: "Premium", status: "active", since: "Mar 2025", nextBill: "Aug 10" },
  { name: "Diego H.", plan: "Pro", status: "cancelled", since: "Apr 2025", nextBill: "—" },
  { name: "TechCo", plan: "Premium", status: "active", since: "Jun 2025", nextBill: "Aug 25" },
  { name: "Valentina C.", plan: "Pro", status: "past_due", since: "May 2025", nextBill: "Overdue" },
];

export default function AdminSubscriptions() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Subscriptions</h1>
        <p className="text-muted-foreground mt-1">Manage plans, pricing, and subscriber accounts.</p>
      </div>

      {/* Plans */}
      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`rounded-2xl ${plan.color} p-5 relative`}>
            {plan.popular && (
              <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground text-[8px] rounded-full">Popular</Badge>
            )}
            <h3 className="text-lg font-display font-semibold">{plan.name}</h3>
            <div className="flex items-baseline gap-0.5 mt-2">
              <span className="text-3xl font-display font-bold">{plan.price}</span>
              <span className="text-xs text-muted-foreground">{plan.period}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{plan.users.toLocaleString()} users</span>
            </div>
            <div className="mt-4 space-y-1.5">
              {plan.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 text-accent shrink-0" /> {f}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4 rounded-xl text-xs gap-1">
              <Edit className="h-3 w-3" /> Edit Plan
            </Button>
          </Card>
        ))}
      </div>

      {/* Subscribers */}
      <Card className="rounded-2xl border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/30">
          <h2 className="text-sm font-display font-semibold">Active Subscribers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/30">
                {["User", "Plan", "Status", "Since", "Next Billing", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.name} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent shrink-0">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <p className="text-sm font-medium">{s.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-[9px] rounded-full border-accent/30 text-accent">{s.plan}</Badge></td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={`text-[9px] rounded-full ${s.status === "active" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : s.status === "past_due" ? "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]" : "bg-muted text-muted-foreground"}`}>
                      {s.status.replace("_", " ")}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{s.since}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{s.nextBill}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="sm" className="text-xs rounded-lg">Manage</Button>
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
