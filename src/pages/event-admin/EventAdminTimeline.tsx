import { motion } from "framer-motion";
import { Clock, CheckCircle, Play, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const timelineSteps = [
  { label: "Venue Setup", time: "2:00 PM", status: "completed" as const },
  { label: "Vendor Arrival", time: "3:30 PM", status: "completed" as const },
  { label: "Guest Arrival", time: "5:00 PM", status: "active" as const },
  { label: "Cocktail Hour", time: "5:30 PM", status: "upcoming" as const },
  { label: "Ceremony", time: "6:30 PM", status: "upcoming" as const },
  { label: "Dinner Service", time: "7:30 PM", status: "upcoming" as const },
  { label: "Speeches & Toasts", time: "8:30 PM", status: "upcoming" as const },
  { label: "First Dance", time: "9:00 PM", status: "upcoming" as const },
  { label: "Party & Dancing", time: "9:30 PM", status: "upcoming" as const },
  { label: "Cake Cutting", time: "11:00 PM", status: "upcoming" as const },
  { label: "Send Off", time: "12:00 AM", status: "upcoming" as const },
];

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-[hsl(var(--success))]", bg: "bg-[hsl(var(--success))]/10", label: "Done" },
  active: { icon: Play, color: "text-accent", bg: "bg-accent/10", label: "In Progress" },
  upcoming: { icon: Clock, color: "text-muted-foreground/40", bg: "bg-muted/20", label: "Upcoming" },
};

export default function EventAdminTimeline() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Event Timeline</h1>
          <p className="text-muted-foreground mt-1">Control and update event progress in real-time.</p>
        </div>
        <Button variant="gold" size="sm" className="rounded-xl">
          <Bell className="h-4 w-4 mr-2" /> Notify Guests
        </Button>
      </div>

      <div className="space-y-0">
        {timelineSteps.map((step, i) => {
          const cfg = statusConfig[step.status];
          const Icon = cfg.icon;
          return (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-5 w-5 ${cfg.color}`} />
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className={`w-0.5 flex-1 my-1 ${step.status === "completed" ? "bg-[hsl(var(--success))]/30" : "bg-border/30"}`} />
                )}
              </div>
              <Card className={`rounded-2xl border-border/50 flex-1 mb-3 ${step.status === "active" ? "ring-1 ring-accent/30" : ""}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${step.status === "active" ? "text-accent" : "text-foreground"}`}>{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-[10px] rounded-full ${cfg.color}`}>{cfg.label}</Badge>
                    {step.status === "upcoming" && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs rounded-lg">Start</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
