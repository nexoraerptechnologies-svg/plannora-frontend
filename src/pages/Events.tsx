import { motion } from "framer-motion";
import { Plus, MapPin, Calendar as CalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const events = [
  { id: 1, name: "Alan & Sofía's Wedding", date: "June 15, 2026", location: "Hacienda Los Laureles, Oaxaca", image: "🎊", guests: 248 },
  { id: 2, name: "Emma's Quinceañera", date: "August 22, 2026", location: "Salón Imperial, CDMX", image: "🎀", guests: 150 },
  { id: 3, name: "Annual Gala 2026", date: "December 1, 2026", location: "Hotel St. Regis, CDMX", image: "✨", guests: 320 },
];

export default function Events() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Events</h1>
          <p className="text-muted-foreground mt-1">Create and manage your events.</p>
        </div>
        <Button variant="gold" className="rounded-2xl">
          <Plus className="h-4 w-4 mr-2" /> New Event
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => (
          <Card key={e.id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
            <div className="h-36 bg-gradient-to-br from-gold-light to-secondary flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
              {e.image}
            </div>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-display font-semibold text-lg">{e.name}</h3>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><CalIcon className="h-3.5 w-3.5 text-gold" />{e.date}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-gold" />{e.location}</div>
              </div>
              <div className="text-xs text-muted-foreground pt-1">{e.guests} guests</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
