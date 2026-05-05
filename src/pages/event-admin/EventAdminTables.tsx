import { motion } from "framer-motion";
import { LayoutGrid, Users, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const tables = [
  { id: 1, name: "Mesa 1", capacity: 10, seated: 10, type: "VIP" },
  { id: 2, name: "Mesa 2", capacity: 10, seated: 8, type: "Family" },
  { id: 3, name: "Mesa 3", capacity: 8, seated: 8, type: "Friends" },
  { id: 4, name: "Mesa 4", capacity: 8, seated: 6, type: "Friends" },
  { id: 5, name: "Mesa 5", capacity: 10, seated: 10, type: "Family" },
  { id: 6, name: "Mesa 6", capacity: 8, seated: 5, type: "Colleagues" },
  { id: 7, name: "Mesa 7", capacity: 10, seated: 7, type: "Friends" },
  { id: 8, name: "Mesa 8", capacity: 8, seated: 0, type: "Unassigned" },
];

export default function EventAdminTables() {
  const totalSeats = tables.reduce((a, t) => a + t.capacity, 0);
  const totalSeated = tables.reduce((a, t) => a + t.seated, 0);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Table Management</h1>
          <p className="text-muted-foreground mt-1">Assign guests to tables and manage seating.</p>
        </div>
        <Button variant="gold" size="sm" className="rounded-xl">
          <Plus className="h-4 w-4 mr-2" /> Add Table
        </Button>
      </div>

      <Card className="rounded-2xl border-border/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Overall Occupancy</span>
          <span className="text-sm font-medium">{totalSeated} / {totalSeats} seats</span>
        </div>
        <Progress value={(totalSeated / totalSeats) * 100} className="h-2" />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((t) => (
          <Card key={t.id} className="rounded-2xl border-border/50 hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-display">{t.name}</CardTitle>
              <Badge variant="outline" className="text-[10px] rounded-full">{t.type}</Badge>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-accent" />
                <span className="text-sm">{t.seated} / {t.capacity}</span>
              </div>
              <Progress value={(t.seated / t.capacity) * 100} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
