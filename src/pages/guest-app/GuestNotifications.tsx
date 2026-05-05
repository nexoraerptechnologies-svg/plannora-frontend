import { motion } from "framer-motion";
import { Bell, ArrowLeft, Music, Users, Camera, Zap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGuestApp } from "@/context/GuestAppContext";
import { Card } from "@/components/ui/card";

const TYPE_ICONS: Record<string, { icon: typeof Bell; color: string }> = {
  timeline: { icon: Zap, color: "text-accent" },
  social: { icon: Camera, color: "text-accent" },
  table: { icon: Users, color: "text-[hsl(var(--success))]" },
  system: { icon: Bell, color: "text-accent" },
};

export default function GuestNotifications() {
  const { notifications, markNotificationRead } = useGuestApp();
  const navigate = useNavigate();
  const { slug, guestId } = useParams();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 space-y-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/event/${slug}/guest/${guestId}/app/home`)}
          className="p-2 rounded-full hover:bg-muted/20 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-semibold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">{notifications.filter((n) => !n.read).length} unread</p>
        </div>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={() => notifications.forEach((n) => markNotificationRead(n.id))}
            className="text-[10px] text-accent font-semibold uppercase tracking-wider"
          >
            Read All
          </button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => {
          const typeConfig = TYPE_ICONS[n.type] || TYPE_ICONS.system;
          const Icon = typeConfig.icon;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                onClick={() => markNotificationRead(n.id)}
                className={`rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                  n.read ? "bg-card border-border/10" : "bg-accent/5 border-accent/20"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${n.read ? "bg-muted/30" : "bg-accent/20"}`}>
                  <Icon className={`h-4 w-4 ${n.read ? "text-muted-foreground" : typeConfig.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                    {n.message}
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{n.timestamp}</p>
                </div>
                {!n.read && <div className="w-2 h-2 rounded-full bg-accent shrink-0" />}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
