import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Send, Users, Store, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sentNotifications = [
  { id: "n-1", title: "Platform Update v2.5", message: "New features: Guest gamification and song voting!", audience: "all", date: "2 days ago", recipients: 2847 },
  { id: "n-2", title: "Vendor Verification Required", message: "Please update your profile to maintain verified status.", audience: "vendors", date: "5 days ago", recipients: 89 },
  { id: "n-3", title: "Holiday Special Pricing", message: "50% off Premium plans for the holidays!", audience: "hosts", date: "1 week ago", recipients: 680 },
];

const audienceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  all: Users,
  vendors: Store,
  hosts: Crown,
};

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!title.trim() || !message.trim()) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setTitle("");
      setMessage("");
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Notifications</h1>
        <p className="text-muted-foreground mt-1">Send announcements to platform users.</p>
      </div>

      {/* Compose */}
      <Card className="rounded-2xl border-border/50 p-5 space-y-4">
        <h2 className="text-sm font-display font-semibold">Send Notification</h2>
        <Select value={audience} onValueChange={setAudience}>
          <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users ({2847})</SelectItem>
            <SelectItem value="hosts">Hosts ({680})</SelectItem>
            <SelectItem value="vendors">Vendors ({89})</SelectItem>
          </SelectContent>
        </Select>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title..." className="rounded-xl" />
        <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your message..." className="rounded-xl min-h-[100px]" />
        <Button onClick={handleSend} variant="gold" className="rounded-xl" disabled={!title.trim() || !message.trim() || sent}>
          {sent ? "Sent! ✓" : <><Send className="h-4 w-4 mr-2" /> Send Notification</>}
        </Button>
      </Card>

      {/* History */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Sent Notifications</h2>
        {sentNotifications.map((n, i) => {
          const AudienceIcon = audienceIcons[n.audience] || Users;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card className="rounded-2xl border-border/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[8px] rounded-full gap-1">
                        <AudienceIcon className="h-2.5 w-2.5" /> {n.audience}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{n.recipients.toLocaleString()} recipients</span>
                      <span className="text-[10px] text-muted-foreground">· {n.date}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
