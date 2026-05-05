import { motion } from "framer-motion";
import { Bell, Eye, MessageCircle, Star, CalendarCheck, CheckCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVendors } from "@/context/VendorContext";

const TYPE_ICONS = {
  inquiry: MessageCircle,
  view: Eye,
  message: MessageCircle,
  review: Star,
  booking: CalendarCheck,
};

const TYPE_COLORS = {
  inquiry: "bg-blue-500/10 text-blue-500",
  view: "bg-violet-500/10 text-violet-500",
  message: "bg-accent/10 text-accent",
  review: "bg-amber-500/10 text-amber-500",
  booking: "bg-emerald-500/10 text-emerald-500",
};

export default function VendorNotifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useVendors();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Notifications</h1>
          <p className="text-muted-foreground mt-1">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5" onClick={markAllNotificationsRead}>
            <CheckCheck className="h-3 w-3" /> Mark All Read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {notifications.map((notif, i) => {
          const Icon = TYPE_ICONS[notif.type];
          return (
            <motion.div key={notif.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card
                className={`rounded-2xl border-border/50 p-4 flex items-center gap-4 cursor-pointer hover:shadow-sm transition-all ${!notif.read ? "bg-accent/5 border-accent/20" : ""}`}
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TYPE_COLORS[notif.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>{notif.title}</p>
                    {!notif.read && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{notif.description}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{notif.time}</span>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
