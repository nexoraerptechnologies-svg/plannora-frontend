import { motion } from "framer-motion";
import { Users, MapPin, Star, CheckCircle2, Clock } from "lucide-react";
import { useGuestApp } from "@/context/GuestAppContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function GuestMyTable() {
  const { guest, tableGuests } = useGuestApp();
  const arrivedCount = tableGuests.filter((g) => g.arrived).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-semibold text-foreground">My Table</h1>
        <p className="text-sm text-muted-foreground">Your seating details</p>
      </div>

      {/* Table Card */}
      <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 rounded-2xl p-6 text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/40 mx-auto flex items-center justify-center">
          <Users className="h-8 w-8 text-accent" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold text-foreground">{guest.table}</h2>
          <Badge variant="outline" className="border-accent/30 text-accent text-xs mt-2">
            <Star className="h-3 w-3 mr-1" /> {guest.tableType}
          </Badge>
        </div>
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> Near the dance floor
        </div>
        {/* Arrival Progress */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Arrivals</span>
            <span className="text-accent font-semibold">{arrivedCount}/{tableGuests.length}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted/20 overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(arrivedCount / tableGuests.length) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </div>
      </Card>

      {/* Guests at Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Guests at Your Table ({tableGuests.length})
        </h2>
        {tableGuests.map((g, i) => (
          <motion.div
            key={g.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className={`rounded-2xl p-4 flex items-center gap-3 ${
                g.isCurrentUser ? "bg-accent/10 border-accent/30" : "bg-card border-border/20"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    g.isCurrentUser ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {g.name[0]}
                </div>
                {/* Arrival indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${
                  g.arrived ? "bg-[hsl(var(--success))]" : "bg-muted"
                }`}>
                  {g.arrived ? (
                    <CheckCircle2 className="h-2.5 w-2.5 text-[hsl(0,0%,100%)]" />
                  ) : (
                    <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {g.name} {g.isCurrentUser && <span className="text-accent text-xs">(You)</span>}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {g.arrived ? `Arrived at ${g.arrivedAt}` : "Not yet arrived"}
                </p>
              </div>
              {g.isCurrentUser && (
                <Badge className="bg-accent/20 text-accent text-[10px] border-0">You</Badge>
              )}
              {!g.isCurrentUser && g.arrived && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-[hsl(var(--success))]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </motion.div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Venue Map */}
      <Card className="bg-card border-border/20 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">📍 Venue Map</h2>
        <div className="relative w-full h-48 bg-muted/30 rounded-xl overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-2 p-3">
            <div className="col-span-2 row-span-1 bg-accent/10 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground border border-border/10">
              Stage 🎤
            </div>
            <div className="col-span-2 row-span-1 bg-accent/10 rounded-lg flex items-center justify-center text-[10px] text-muted-foreground border border-border/10">
              Dance Floor 💃
            </div>
            <div className="bg-accent/20 border border-accent/40 rounded-lg flex items-center justify-center text-[9px] text-accent font-bold animate-pulse">
              T1 ⭐
            </div>
            <div className="bg-muted/20 rounded-lg flex items-center justify-center text-[9px] text-muted-foreground border border-border/10">T2</div>
            <div className="bg-muted/20 rounded-lg flex items-center justify-center text-[9px] text-muted-foreground border border-border/10">T3</div>
            <div className="bg-muted/20 rounded-lg flex items-center justify-center text-[9px] text-muted-foreground border border-border/10">VIP</div>
            <div className="bg-muted/20 rounded-lg flex items-center justify-center text-[9px] text-muted-foreground border border-border/10">T4</div>
            <div className="bg-muted/20 rounded-lg flex items-center justify-center text-[9px] text-muted-foreground border border-border/10">T5</div>
            <div className="bg-muted/20 rounded-lg flex items-center justify-center text-[9px] text-muted-foreground border border-border/10">T6</div>
            <div className="bg-accent/5 rounded-lg flex items-center justify-center text-[9px] text-muted-foreground border border-border/10">
              Bar 🍸
            </div>
          </div>
        </div>
        <p className="text-[10px] text-accent text-center">⭐ Your table is highlighted</p>
      </Card>
    </motion.div>
  );
}
