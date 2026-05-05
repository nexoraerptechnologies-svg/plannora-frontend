import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, CheckCircle, Clock, DollarSign, Store, Heart, TrendingUp, Calendar,
  Sparkles, Bell, Send, Download, Wand2, MessageSquare, Camera, Star,
  AlertTriangle, ArrowRight, ChevronRight, Utensils, MapPin, Music,
  PartyPopper, Gift, Zap, BarChart3, PieChart, Timer, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import eventHero from "@/assets/event-hero-cover.jpg";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// --- Mock Data ---
const smartSuggestions = [
  { icon: Users, text: "12 guests haven't RSVPd yet", action: "Send Reminders", color: "text-[hsl(var(--warning))]" },
  { icon: MapPin, text: "5 guests have no table assigned", action: "Auto-Assign", color: "text-[hsl(var(--destructive))]" },
  { icon: Store, text: "Florist hasn't confirmed arrangements", action: "Follow Up", color: "text-accent" },
  { icon: Utensils, text: "Meal preferences incomplete for 8 guests", action: "Request Info", color: "text-[hsl(var(--warning))]" },
];

const guestInsights = {
  total: 248, confirmed: 186, declined: 14, pending: 38, maybe: 10,
  meals: { beef: 72, chicken: 58, vegan: 34, fish: 22 },
  confirmationRate: 75,
};

const vendorWorkflow = [
  { name: "Hacienda Los Robles", service: "Venue", status: "confirmed", lastMessage: "Everything is set for the big day!", avatar: "H" },
  { name: "DJ Elektra", service: "Music", status: "confirmed", lastMessage: "Song list approved ✓", avatar: "D" },
  { name: "Flores Elegantes", service: "Florals", status: "negotiating", lastMessage: "Sent new arrangement options", avatar: "F" },
  { name: "Chef Antonio", service: "Catering", status: "confirmed", lastMessage: "Menu finalized", avatar: "C" },
  { name: "Foto Premium", service: "Photography", status: "confirmed", lastMessage: "Pre-shoot scheduled", avatar: "P" },
  { name: "Sweet Dreams", service: "Cake", status: "contacted", lastMessage: "Awaiting response...", avatar: "S" },
];

const calendarEvents = [
  { date: "Apr 10", title: "Florist meeting", type: "vendor" },
  { date: "Apr 12", title: "Menu tasting", type: "vendor" },
  { date: "Apr 15", title: "RSVP deadline", type: "deadline" },
  { date: "Apr 20", title: "Rehearsal dinner", type: "milestone" },
  { date: "Apr 25", title: "Final vendor check-in", type: "vendor" },
  { date: "Apr 30", title: "Wedding Day 🎉", type: "event" },
];

const budgetData = {
  total: 18000, spent: 12400, categories: [
    { name: "Venue", amount: 4500, budget: 5000 },
    { name: "Catering", amount: 3200, budget: 3500 },
    { name: "Photography", amount: 1800, budget: 2000 },
    { name: "Music", amount: 1200, budget: 1500 },
    { name: "Florals", amount: 900, budget: 1200 },
    { name: "Cake", amount: 800, budget: 800 },
  ],
};

const galleryPhotos = [
  { id: 1, likes: 24, comments: 5, featured: true },
  { id: 2, likes: 18, comments: 3, featured: false },
  { id: 3, likes: 31, comments: 8, featured: true },
  { id: 4, likes: 12, comments: 2, featured: false },
];

const planningTimeline = [
  { date: "3 months ago", title: "Venue booked", done: true },
  { date: "2 months ago", title: "Vendors selected", done: true },
  { date: "1 month ago", title: "Invitations sent", done: true },
  { date: "2 weeks ago", title: "Menu finalized", done: true },
  { date: "1 week ago", title: "Seating plan started", done: true },
  { date: "Today", title: "Final confirmations", done: false },
  { date: "In 5 days", title: "Rehearsal dinner", done: false },
  { date: "In 23 days", title: "Wedding Day", done: false },
];

const notifications = [
  { text: "DJ Elektra confirmed song list", time: "2 min ago", type: "vendor" },
  { text: "15 new RSVPs received", time: "1 hour ago", type: "rsvp" },
  { text: "Budget alert: Catering at 91%", time: "3 hours ago", type: "budget" },
  { text: "Florist sent arrangement preview", time: "Yesterday", type: "vendor" },
  { text: "RSVP deadline in 6 days", time: "Yesterday", type: "reminder" },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  contacted: { label: "Contacted", class: "bg-muted text-muted-foreground" },
  negotiating: { label: "Negotiating", class: "bg-accent/15 text-accent" },
  confirmed: { label: "Confirmed", class: "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" },
};

function useCountdown(targetDate: Date) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  return { days, hours, minutes };
}

export default function Dashboard() {
  const { user } = useAuth();
  const countdown = useCountdown(new Date("2026-04-30"));
  const [activeTab, setActiveTab] = useState("overview");

  const budgetPercent = Math.round((budgetData.spent / budgetData.total) * 100);
  const overBudgetCategories = budgetData.categories.filter(c => c.amount >= c.budget);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 sm:space-y-6 max-w-7xl">
      {/* ===== HERO SECTION ===== */}
      <motion.div variants={item} className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-44 sm:h-56 md:h-64">
        <img src={eventHero} alt="Event cover" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end p-4 sm:p-6 md:p-8">
          <Badge className="w-fit mb-2 bg-accent/20 text-accent border-accent/30 backdrop-blur-sm text-[10px]">
            <Heart className="h-3 w-3 mr-1" /> Wedding
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white">Alan & Sofía</h1>
          <p className="text-white/70 text-xs sm:text-sm mt-1">April 30, 2026 · Hacienda Los Robles</p>
          <div className="flex gap-2 sm:gap-4 mt-3">
            {[
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Min" },
            ].map((c) => (
              <div key={c.label} className="bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 text-center min-w-[44px] sm:min-w-[56px]">
                <p className="text-lg sm:text-xl font-display font-bold text-white">{c.value}</p>
                <p className="text-[8px] sm:text-[9px] text-white/60 uppercase tracking-wider">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ===== SMART ASSISTANT ===== */}
      <motion.div variants={item}>
        <Card className="rounded-2xl border-accent/20 bg-accent/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-display flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              Smart Assistant
            </CardTitle>
            <CardDescription>Suggested actions to keep your event on track</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {smartSuggestions.map((s, i) => (
                <div key={i} className="flex items-start sm:items-center gap-3 p-3 rounded-xl bg-background border border-border/50 hover:border-accent/30 transition-colors group cursor-pointer">
                  <s.icon className={`h-4 w-4 flex-shrink-0 mt-0.5 sm:mt-0 ${s.color}`} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-foreground">{s.text}</span>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-accent mt-1 sm:mt-0 sm:hidden px-0">
                      {s.action} <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline-flex">
                    {s.action} <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ===== TABS ===== */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 rounded-xl p-1 w-full overflow-x-auto flex">
          <TabsTrigger value="overview" className="rounded-lg text-xs flex-1">Overview</TabsTrigger>
          <TabsTrigger value="guests" className="rounded-lg text-xs flex-1">Guests</TabsTrigger>
          <TabsTrigger value="vendors" className="rounded-lg text-xs flex-1">Vendors</TabsTrigger>
          <TabsTrigger value="budget" className="rounded-lg text-xs flex-1">Budget</TabsTrigger>
          <TabsTrigger value="timeline" className="rounded-lg text-xs flex-1">Timeline</TabsTrigger>
        </TabsList>

        {/* ===== OVERVIEW TAB ===== */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          {/* Stats Row */}
          <motion.div variants={item} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Guests Confirmed", value: "186 / 248", icon: Users, detail: `${guestInsights.confirmationRate}% rate`, color: "text-[hsl(var(--success))]" },
              { label: "Budget Used", value: `$${budgetData.spent.toLocaleString()}`, icon: DollarSign, detail: `of $${budgetData.total.toLocaleString()}`, color: "text-accent" },
              { label: "Vendors Booked", value: `${vendorWorkflow.filter(v => v.status === "confirmed").length} / ${vendorWorkflow.length}`, icon: Store, detail: `${vendorWorkflow.filter(v => v.status !== "confirmed").length} pending`, color: "text-accent" },
              { label: "Days Until Event", value: String(countdown.days), icon: Calendar, detail: "April 30, 2026", color: "text-accent" },
            ].map((s) => (
              <Card key={s.label} className="rounded-2xl border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold font-display">{s.value}</div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.detail}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Notifications */}
            <motion.div variants={item}>
              <Card className="rounded-2xl border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Bell className="h-4 w-4 text-accent" />
                    Smart Notifications
                    <Badge className="ml-auto bg-accent/15 text-accent border-0 text-[10px]">{notifications.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{n.text}</p>
                        <p className="text-[11px] text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar */}
            <motion.div variants={item}>
              <Card className="rounded-2xl border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent" />
                    Event Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {calendarEvents.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        e.type === "event" ? "bg-accent/15 text-accent" :
                        e.type === "deadline" ? "bg-[hsl(var(--destructive))]/10 text-[hsl(var(--destructive))]" :
                        e.type === "milestone" ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {e.date.split(" ")[1]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{e.title}</p>
                        <p className="text-[11px] text-muted-foreground">{e.date}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Gallery Preview */}
          <motion.div variants={item}>
            <Card className="rounded-2xl border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-display flex items-center gap-2">
                    <Camera className="h-4 w-4 text-accent" />
                    Social Gallery
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs text-accent">View All <ChevronRight className="h-3 w-3 ml-1" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {galleryPhotos.map((p) => (
                    <div key={p.id} className="relative aspect-square rounded-xl bg-muted overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      {p.featured && (
                        <Badge className="absolute top-2 right-2 bg-accent/90 text-[9px] border-0">
                          <Star className="h-2.5 w-2.5 mr-0.5" /> Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-2 left-2 right-2 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-[11px] flex items-center gap-1"><Heart className="h-3 w-3" /> {p.likes}</span>
                        <span className="text-white text-[11px] flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {p.comments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* ===== GUESTS TAB ===== */}
        <TabsContent value="guests" className="space-y-6 mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Confirmed", value: guestInsights.confirmed, color: "text-[hsl(var(--success))]", bg: "bg-[hsl(var(--success))]/10" },
              { label: "Pending", value: guestInsights.pending, color: "text-[hsl(var(--warning))]", bg: "bg-[hsl(var(--warning))]/10" },
              { label: "Declined", value: guestInsights.declined, color: "text-[hsl(var(--destructive))]", bg: "bg-[hsl(var(--destructive))]/10" },
              { label: "Maybe", value: guestInsights.maybe, color: "text-accent", bg: "bg-accent/10" },
            ].map((g) => (
              <Card key={g.label} className="rounded-2xl border-border/50">
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 rounded-full ${g.bg} flex items-center justify-center mx-auto mb-2`}>
                    <span className={`text-xl font-display font-bold ${g.color}`}>{g.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{g.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Confirmation Rate */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display">RSVP Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Confirmation rate</span>
                    <span className="font-semibold text-[hsl(var(--success))]">{guestInsights.confirmationRate}%</span>
                  </div>
                  <Progress value={guestInsights.confirmationRate} className="h-2.5" />
                </div>
                <div className="flex gap-2">
                  <Button variant="gold-outline" size="sm" className="rounded-xl text-xs flex-1">
                    <Send className="h-3 w-3 mr-1" /> Send Reminders
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs flex-1">
                    <Download className="h-3 w-3 mr-1" /> Export List
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Meal Preferences */}
            <Card className="rounded-2xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-display flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-accent" />
                  Meal Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(guestInsights.meals).map(([meal, count]) => (
                  <div key={meal} className="flex items-center gap-3">
                    <span className="text-sm capitalize w-16 text-muted-foreground">{meal}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{ width: `${(count / guestInsights.confirmed) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Seating Automation */}
          <Card className="rounded-2xl border-accent/20 bg-accent/5">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center flex-shrink-0">
                <Wand2 className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display font-semibold">Smart Seating</h3>
                <p className="text-sm text-muted-foreground">Automatically assign guests to tables based on groups, relationships, and preferences.</p>
              </div>
              <Button variant="gold" className="rounded-xl">
                <Wand2 className="h-4 w-4 mr-2" /> Auto-Assign Tables
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== VENDORS TAB ===== */}
        <TabsContent value="vendors" className="space-y-6 mt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {(["contacted", "negotiating", "confirmed"] as const).map((status) => {
              const count = vendorWorkflow.filter(v => v.status === status).length;
              const cfg = statusConfig[status];
              return (
                <Card key={status} className="rounded-2xl border-border/50">
                  <CardContent className="pt-6 text-center">
                    <Badge className={`${cfg.class} border-0 text-[10px] mb-2`}>{cfg.label}</Badge>
                    <p className="text-3xl font-display font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">vendors</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-3">
            {vendorWorkflow.map((v) => {
              const cfg = statusConfig[v.status];
              return (
                <Card key={v.name} className="rounded-2xl border-border/50 hover:shadow-md transition-shadow">
                    <CardContent className="pt-4 pb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                     <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-sm font-bold text-accent flex-shrink-0">
                       {v.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground">{v.name}</p>
                        <Badge className={`${cfg.class} border-0 text-[9px]`}>{cfg.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{v.service}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">"{v.lastMessage}"</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs text-accent">
                      <MessageSquare className="h-3.5 w-3.5 mr-1" /> Chat
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ===== BUDGET TAB ===== */}
        <TabsContent value="budget" className="space-y-6 mt-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="rounded-2xl border-border/50">
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
                <p className="text-2xl font-display font-bold">${budgetData.total.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/50">
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-muted-foreground mb-1">Spent</p>
                <p className="text-2xl font-display font-bold text-accent">${budgetData.spent.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-border/50">
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                <p className="text-2xl font-display font-bold text-[hsl(var(--success))]">${(budgetData.total - budgetData.spent).toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-accent" />
                Spending by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {budgetData.categories.map((c) => {
                const pct = Math.round((c.amount / c.budget) * 100);
                const over = c.amount >= c.budget;
                return (
                  <div key={c.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{c.name}</span>
                      <span className={`text-xs font-medium ${over ? "text-[hsl(var(--destructive))]" : "text-foreground"}`}>
                        ${c.amount.toLocaleString()} / ${c.budget.toLocaleString()}
                        {over && " ⚠️"}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${over ? "bg-[hsl(var(--destructive))]" : pct > 80 ? "bg-[hsl(var(--warning))]" : "bg-accent"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {overBudgetCategories.length > 0 && (
            <Card className="rounded-2xl border-[hsl(var(--destructive))]/20 bg-[hsl(var(--destructive))]/5">
              <CardContent className="pt-4 pb-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-[hsl(var(--destructive))] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Budget Alert</p>
                  <p className="text-xs text-muted-foreground">
                    {overBudgetCategories.map(c => c.name).join(", ")} {overBudgetCategories.length === 1 ? "has" : "have"} reached the budget limit.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ===== TIMELINE TAB ===== */}
        <TabsContent value="timeline" className="space-y-6 mt-4">
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <PartyPopper className="h-4 w-4 text-accent" />
                Planning Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-[11px] top-0 bottom-0 w-0.5 bg-border" />
                <div className="space-y-4">
                  {planningTimeline.map((m, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        m.done ? "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground,0_0%_100%))]" : "bg-muted border-2 border-border"
                      }`}>
                        {m.done ? <CheckCircle className="h-3.5 w-3.5" /> : <Clock className="h-3 w-3 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 pb-1">
                        <p className={`text-sm font-medium ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.title}</p>
                        <p className="text-[11px] text-muted-foreground">{m.date}</p>
                      </div>
                      {!m.done && i === planningTimeline.findIndex(t => !t.done) && (
                        <Badge className="bg-accent/15 text-accent border-0 text-[9px]">Current</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
