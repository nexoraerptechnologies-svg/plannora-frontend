import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tablesData = [
  { id: 1, name: "Table 1", seats: 8, guests: ["María G.", "Carlos R.", "Ana L.", "Diego H.", "Isabella T.", "Miguel S."] },
  { id: 2, name: "Table 2", seats: 8, guests: ["Valentina C.", "Alejandro M.", "Sofía P.", "Luis K."] },
  { id: 3, name: "Table 3", seats: 10, guests: ["Elena R.", "Pablo M.", "Camila F.", "Andrés B.", "Laura S.", "Ricardo T.", "Fernanda G."] },
  { id: 4, name: "Table 4", seats: 8, guests: ["Daniela H.", "Oscar N.", "Gabriela O."] },
  { id: 5, name: "VIP Table", seats: 6, guests: ["Alan N.", "Sofía M.", "Roberto N.", "Carmen M."] },
  { id: 6, name: "Table 6", seats: 8, guests: ["Jorge L.", "Patricia V.", "Eduardo C.", "Sandra R.", "Felipe M."] },
  { id: 7, name: "Table 7", seats: 8, guests: [] },
  { id: 8, name: "Table 8", seats: 10, guests: ["Mariana P.", "Gustavo A."] },
];

export default function Tables() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Table Layout</h1>
          <p className="text-muted-foreground mt-1">Organize seating for your event.</p>
        </div>
        <Button variant="gold" className="rounded-2xl">
          <Plus className="h-4 w-4 mr-2" /> Add Table
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tablesData.map((table) => {
          const occupancy = table.guests.length / table.seats;
          return (
            <Card key={table.id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-all cursor-pointer p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{table.name}</h3>
                <span className="text-xs text-muted-foreground">{table.guests.length}/{table.seats}</span>
              </div>

              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-gold/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold-light/50 flex items-center justify-center">
                    <span className="text-xs font-medium text-gold">{table.guests.length}</span>
                  </div>
                </div>
                {Array.from({ length: table.seats }).map((_, i) => {
                  const angle = (i / table.seats) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + 42 * Math.cos(rad);
                  const y = 50 + 42 * Math.sin(rad);
                  const hasGuest = i < table.guests.length;
                  return (
                    <div
                      key={i}
                      className={`absolute w-4 h-4 rounded-full border-2 transition-colors ${hasGuest ? "bg-gold border-gold" : "bg-background border-border"}`}
                      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
                    />
                  );
                })}
              </div>

              <div className="space-y-1">
                {table.guests.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center italic">No guests assigned</p>
                ) : (
                  table.guests.slice(0, 3).map((g, i) => (
                    <p key={i} className="text-xs text-muted-foreground truncate">{g}</p>
                  ))
                )}
                {table.guests.length > 3 && (
                  <p className="text-xs text-gold">+{table.guests.length - 3} more</p>
                )}
              </div>

              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-gradient-gold h-1.5 rounded-full transition-all" style={{ width: `${occupancy * 100}%` }} />
              </div>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
