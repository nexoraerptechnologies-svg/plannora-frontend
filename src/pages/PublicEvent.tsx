import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Users, Image as ImageIcon, Search } from "lucide-react";

export default function PublicEvent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-br from-foreground to-foreground/80 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(42_50%_57%_/_0.15),transparent_70%)]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center relative z-10 px-4">
          <p className="text-gold uppercase tracking-[0.3em] text-sm mb-4">You're invited to</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">Alan & Sofía</h1>
          <div className="flex items-center justify-center gap-6 text-primary-foreground/70 text-sm">
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" /> June 15, 2026</span>
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /> Hacienda Los Laureles</span>
          </div>
        </motion.div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-16">
        {/* RSVP */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-3xl border-border/50 shadow-xl">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-display font-semibold">Confirm Your Attendance</h2>
                <p className="text-muted-foreground text-sm mt-1">We'd love to celebrate with you.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Your name" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="you@email.com" className="rounded-xl" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Will you attend?</Label>
                  <div className="flex gap-3">
                    <Button variant="gold-outline" className="flex-1 rounded-xl">Yes, I'll be there!</Button>
                    <Button variant="outline" className="flex-1 rounded-xl">Can't make it</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bringing a +1?</Label>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl">Yes</Button>
                    <Button variant="outline" className="flex-1 rounded-xl">No</Button>
                  </div>
                </div>
              </div>
              <Button variant="gold" className="w-full rounded-xl h-12 text-base">Confirm RSVP</Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* Event Details */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center space-y-6">
          <h2 className="text-2xl font-display font-semibold">Event Details</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Calendar, title: "Ceremony", desc: "4:00 PM — Chapel" },
              { icon: Users, title: "Reception", desc: "6:00 PM — Grand Garden" },
              { icon: ImageIcon, title: "Dress Code", desc: "Formal / Black Tie" },
            ].map((d) => (
              <div key={d.title} className="p-6 rounded-2xl bg-surface border border-border/50">
                <d.icon className="h-6 w-6 text-gold mx-auto mb-3" />
                <h3 className="font-semibold text-sm">{d.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Gallery Preview */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-display font-semibold text-center mb-6">Gallery</h2>
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gradient-to-br from-gold/10 to-muted flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-gold/30" />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Find Your Table */}
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-3xl border-border/50 shadow-lg">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-display font-semibold">Find Your Table</h2>
              <p className="text-muted-foreground text-sm">Search by your name to find your seat.</p>
              <div className="relative max-w-sm mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Enter your name..." className="pl-10 rounded-xl" />
              </div>
              <div className="rounded-2xl bg-gold-light/50 p-6 text-center">
                <p className="text-sm text-muted-foreground">Enter your name above to find your assigned table.</p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        <Separator />

        <footer className="text-center pb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="text-gold-foreground font-display font-bold text-xs">P</span>
            </div>
            <span className="font-display text-sm">Planora</span>
            <span className="text-[10px] text-muted-foreground">by Nexora</span>
          </div>
          <p className="text-xs text-muted-foreground">Crafted with love for your special moments.</p>
        </footer>
      </div>
    </div>
  );
}
