import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, CheckCircle, Clock, LayoutGrid, QrCode, Camera, AlertTriangle, Activity,
  TrendingUp, Zap, Radio, Send, MessageSquare, ShieldAlert, Image, Play, Pause,
  ChevronRight, Ban, RefreshCw, Bell, ArrowRight, Filter, CheckCheck, Circle,
  UserCheck, UserX, Timer, BarChart3, PieChart, Wifi, WifiOff
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// ── Mock Data ──────────────────────────────────────────────
const tables = [
  { id: "t1", name: "Table 1", capacity: 8, seated: 8, status: "full" as const },
  { id: "t2", name: "Table 2", capacity: 8, seated: 5, status: "partial" as const },
  { id: "t3", name: "Table 3", capacity: 8, seated: 0, status: "empty" as const },
  { id: "t4", name: "Table 4", capacity: 10, seated: 10, status: "full" as const },
  { id: "t5", name: "Table 5", capacity: 8, seated: 3, status: "partial" as const },
  { id: "t6", name: "Table 6", capacity: 8, seated: 0, status: "empty" as const },
  { id: "vip", name: "VIP Table", capacity: 6, seated: 6, status: "full" as const },
];

const recentArrivals = [
  { name: "María García", time: "6:12 PM", table: "Table 1" },
  { name: "Carlos Rodríguez", time: "6:10 PM", table: "Table 1" },
  { name: "Ana López", time: "6:08 PM", table: "Table 2" },
  { name: "Valentina Cruz", time: "6:05 PM", table: "VIP Table" },
  { name: "Diego Hernández", time: "6:01 PM", table: "Table 2" },
  { name: "Elena Rivera", time: "5:55 PM", table: "Table 5" },
  { name: "Pablo Martínez", time: "5:50 PM", table: "Table 4" },
];

const galleryItems = [
  { id: "p1", url: "", uploader: "María García", time: "6:15 PM", status: "pending" as const },
  { id: "p2", url: "", uploader: "Carlos R.", time: "6:12 PM", status: "pending" as const },
  { id: "p3", url: "", uploader: "Ana López", time: "6:08 PM", status: "approved" as const },
  { id: "p4", url: "", uploader: "Diego H.", time: "6:05 PM", status: "flagged" as const },
  { id: "p5", url: "", uploader: "Valentina C.", time: "6:02 PM", status: "pending" as const },
  { id: "p6", url: "", uploader: "Elena R.", time: "5:58 PM", status: "approved" as const },
];

const timelinePhases = [
  { id: "arrival", label: "Guest Arrival", time: "5:00 PM", status: "completed" as const },
  { id: "cocktail", label: "Cocktail Hour", time: "5:30 PM", status: "completed" as const },
  { id: "ceremony", label: "Ceremony", time: "6:30 PM", status: "active" as const },
  { id: "dinner", label: "Dinner", time: "7:30 PM", status: "upcoming" as const },
  { id: "dance", label: "First Dance", time: "9:00 PM", status: "upcoming" as const },
  { id: "party", label: "Party", time: "9:30 PM", status: "upcoming" as const },
];

const alertsMock = [
  { id: "a1", message: "3 guests haven't checked in yet", severity: "warning" as const, icon: UserX },
  { id: "a2", message: "Table 3 & 6 still empty", severity: "warning" as const, icon: LayoutGrid },
  { id: "a3", message: "Check-in rate slowed in last 15 min", severity: "info" as const, icon: Timer },
  { id: "a4", message: "1 photo flagged for review", severity: "warning" as const, icon: Image },
  { id: "a5", message: "Gallery storage at 78%", severity: "info" as const, icon: Camera },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const STATUS_COLOR = {
  full: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
  partial: "bg-accent/10 text-accent border-accent/30",
  empty: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function AdminEventDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liveMode, setLiveMode] = useState(false);
  const [msgTarget, setMsgTarget] = useState("all");
  const [msgText, setMsgText] = useState("");
  const [msgOpen, setMsgOpen] = useState(false);
  const [phases, setPhases] = useState(timelinePhases);
  const [gallery, setGallery] = useState(galleryItems);
  const [galleryFilter, setGalleryFilter] = useState<"all" | "pending" | "approved" | "flagged">("all");
  const [alerts, setAlerts] = useState(alertsMock);
  const [pulse, setPulse] = useState(false);

  // Simulate live pulse
  useEffect(() => {
    if (!liveMode) return;
    const i = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(i);
  }, [liveMode]);

  const checkedIn = 142;
  const totalGuests = 248;
  const rsvpConfirmed = 210;
  const attendancePct = Math.round((checkedIn / totalGuests) * 100);
  const rsvpAccuracy = Math.round((checkedIn / rsvpConfirmed) * 100);

  const stats = [
    { label: "Total Guests", value: "248", icon: Users, color: "text-accent" },
    { label: "Checked In", value: "142", icon: CheckCircle, color: "text-[hsl(var(--success))]" },
    { label: "Pending", value: "38", icon: Clock, color: "text-accent" },
    { label: "Tables", value: `${tables.filter((t) => t.status === "full").length}/${tables.length}`, icon: LayoutGrid, color: "text-[hsl(var(--success))]" },
    { label: "QR Scans", value: "156", icon: QrCode, color: "text-accent" },
    { label: "Photos", value: `${gallery.length}`, icon: Camera, color: "text-accent" },
  ];

  const filteredGallery = useMemo(
    () => (galleryFilter === "all" ? gallery : gallery.filter((g) => g.status === galleryFilter)),
    [gallery, galleryFilter]
  );

  function advancePhase() {
    setPhases((prev) => {
      const activeIdx = prev.findIndex((p) => p.status === "active");
      if (activeIdx === -1 || activeIdx >= prev.length - 1) return prev;
      return prev.map((p, i) =>
        i === activeIdx ? { ...p, status: "completed" as const } : i === activeIdx + 1 ? { ...p, status: "active" as const } : p
      );
    });
    toast({ title: "Phase advanced", description: "Notifications synced to all staff." });
  }

  function sendMessage() {
    if (!msgText.trim()) return;
    toast({ title: "Message sent", description: `Sent to: ${msgTarget}` });
    setMsgText("");
    setMsgOpen(false);
  }

  function dismissAlert(id: string) {
    setAlerts((a) => a.filter((x) => x.id !== id));
  }

  function bulkApproveGallery() {
    setGallery((g) => g.map((p) => (p.status === "pending" ? { ...p, status: "approved" as const } : p)));
    toast({ title: "All pending photos approved" });
  }

  function toggleGalleryItem(id: string, status: "approved" | "flagged") {
    setGallery((g) => g.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-5 max-w-7xl">
      {/* ── Header + Live Toggle ── */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-semibold flex items-center gap-2">
            Event Command Center
            {liveMode && (
              <Badge className="bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] border-[hsl(var(--success))]/30 text-[10px] gap-1 animate-pulse">
                <Wifi className="h-3 w-3" /> LIVE
              </Badge>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user?.name} · <span className="text-accent font-medium">Alan & Sofía Wedding</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader><DialogTitle>Send Internal Message</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={msgTarget} onValueChange={setMsgTarget}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="staff">Staff Only</SelectItem>
                    <SelectItem value="host">Host Only</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea placeholder="Type your message…" value={msgText} onChange={(e) => setMsgText(e.target.value)} rows={3} />
                <Button className="w-full rounded-xl gap-1.5" onClick={sendMessage}>
                  <Send className="h-3.5 w-3.5" /> Send Message
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-1.5">
            {liveMode ? <Radio className="h-3.5 w-3.5 text-[hsl(var(--success))]" /> : <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />}
            <span className="text-xs font-medium">{liveMode ? "Live" : "Off"}</span>
            <Switch checked={liveMode} onCheckedChange={setLiveMode} />
          </div>
        </div>
      </motion.div>

      {/* ── Alerts ── */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div variants={item} className="flex flex-wrap gap-2">
            {alerts.map((a) => (
              <motion.div key={a.id} layout exit={{ opacity: 0, scale: 0.9 }}>
                <Badge
                  variant="outline"
                  className={`rounded-xl px-3 py-1.5 text-xs gap-1.5 cursor-pointer ${
                    a.severity === "warning" ? "border-accent/30 text-accent bg-accent/5" : "border-border text-muted-foreground"
                  }`}
                  onClick={() => dismissAlert(a.id)}
                >
                  <a.icon className="h-3 w-3" />
                  {a.message}
                  <span className="text-[9px] opacity-50 ml-1">✕</span>
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── KPI Cards ── */}
      <motion.div variants={item} className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              {liveMode && <div className={`w-2 h-2 rounded-full bg-[hsl(var(--success))] ${pulse ? "opacity-100" : "opacity-40"} transition-opacity`} />}
            </div>
            <p className="text-xl font-display font-bold">{s.value}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
          </Card>
        ))}
      </motion.div>

      {/* ── Main Grid ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Col 1: Timeline + Table Status */}
        <motion.div variants={item} className="space-y-5">
          {/* Timeline Control */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" /> Timeline Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {phases.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    p.status === "active" ? "bg-accent animate-pulse" : p.status === "completed" ? "bg-[hsl(var(--success))]" : "bg-muted-foreground/20"
                  }`} />
                  <span className={`text-sm flex-1 ${p.status === "active" ? "font-medium text-foreground" : "text-muted-foreground"}`}>{p.label}</span>
                  <span className={`text-xs ${p.status === "active" ? "text-accent font-medium" : "text-muted-foreground"}`}>{p.time}</span>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs gap-1 mt-2" onClick={advancePhase}>
                <ChevronRight className="h-3.5 w-3.5" /> Advance Phase
              </Button>
            </CardContent>
          </Card>

          {/* Table Status */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-accent" /> Table Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tables.map((t) => (
                <div key={t.id} className="flex items-center gap-3">
                  <Badge variant="outline" className={`text-[10px] rounded-lg px-2 py-0.5 ${STATUS_COLOR[t.status]}`}>
                    {t.status}
                  </Badge>
                  <span className="text-sm flex-1">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.seated}/{t.capacity}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Col 2: Check-in + Guest Tracking */}
        <motion.div variants={item} className="space-y-5">
          {/* Check-in Progress */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                <QrCode className="h-4 w-4 text-accent" /> Check-in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">Overall</span>
                  <span className="font-medium">{checkedIn} / {totalGuests}</span>
                </div>
                <Progress value={attendancePct} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <p className="text-lg font-display font-bold text-[hsl(var(--success))]">{checkedIn}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Arrived</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-3 text-center">
                  <p className="text-lg font-display font-bold text-accent">{totalGuests - checkedIn}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Expected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Arrivals */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-accent" /> Recent Arrivals
                {liveMode && <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {recentArrivals.map((g, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent">
                      {g.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{g.name}</p>
                      <p className="text-[10px] text-muted-foreground">{g.table}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">{g.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Col 3: Event Health + Gallery + Activity */}
        <motion.div variants={item} className="space-y-5">
          {/* Event Health */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" /> Event Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Attendance", value: attendancePct, suffix: "%" },
                { label: "RSVP Accuracy", value: rsvpAccuracy, suffix: "%" },
                { label: "Engagement", value: 72, suffix: "%" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-medium">{m.value}{m.suffix}</span>
                  </div>
                  <Progress
                    value={m.value}
                    className={`h-1.5 ${m.value >= 80 ? "[&>div]:bg-[hsl(var(--success))]" : m.value >= 50 ? "[&>div]:bg-accent" : "[&>div]:bg-destructive"}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gallery Moderation */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                  <Image className="h-4 w-4 text-accent" /> Gallery
                </CardTitle>
                <div className="flex gap-1">
                  {(["all", "pending", "flagged"] as const).map((f) => (
                    <Button
                      key={f}
                      variant={galleryFilter === f ? "default" : "ghost"}
                      size="sm"
                      className="h-6 px-2 text-[10px] rounded-lg"
                      onClick={() => setGalleryFilter(f)}
                    >
                      {f}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredGallery.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{p.uploader}</p>
                    <p className="text-[10px] text-muted-foreground">{p.time}</p>
                  </div>
                  <div className="flex gap-1">
                    {p.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleGalleryItem(p.id, "approved")}>
                          <CheckCircle className="h-3 w-3 text-[hsl(var(--success))]" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleGalleryItem(p.id, "flagged")}>
                          <Ban className="h-3 w-3 text-destructive" />
                        </Button>
                      </>
                    )}
                    {p.status !== "pending" && (
                      <Badge variant="outline" className={`text-[9px] rounded-lg ${p.status === "approved" ? "text-[hsl(var(--success))]" : "text-destructive"}`}>
                        {p.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {gallery.some((g) => g.status === "pending") && (
                <Button variant="outline" size="sm" className="w-full rounded-xl text-xs gap-1" onClick={bulkApproveGallery}>
                  <CheckCheck className="h-3.5 w-3.5" /> Approve All Pending
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Live Activity */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-display font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" /> Live Activity
                {liveMode && <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {[
                  { msg: "María García checked in via QR", time: "2 min ago" },
                  { msg: "Table 4 now full", time: "5 min ago" },
                  { msg: "Photo flagged for review", time: "8 min ago" },
                  { msg: "Phase advanced: Ceremony", time: "12 min ago" },
                  { msg: "5 new RSVPs confirmed", time: "18 min ago" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs">{a.msg}</p>
                      <p className="text-[10px] text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div variants={item}>
        <Card className="rounded-2xl border-border/50 p-5">
          <h2 className="text-sm font-display font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-accent" /> Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Notify Guests", icon: Bell },
              { label: "Reassign Table", icon: RefreshCw },
              { label: "Block Access", icon: ShieldAlert },
              { label: "Bulk Approve Gallery", icon: CheckCheck, action: bulkApproveGallery },
              { label: "Export Guest List", icon: ArrowRight },
              { label: "Open Floor Plan", icon: LayoutGrid },
            ].map((a) => (
              <Button
                key={a.label}
                variant="outline"
                size="sm"
                className="rounded-xl text-xs gap-1.5"
                onClick={() => a.action ? a.action() : toast({ title: a.label, description: "Action triggered." })}
              >
                <a.icon className="h-3.5 w-3.5" /> {a.label}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
