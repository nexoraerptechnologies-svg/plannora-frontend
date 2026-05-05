import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVendors } from "@/context/VendorContext";
import { toast } from "sonner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function VendorAvailability() {
  const { availability, toggleAvailability, pipeline } = useVendors();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const getSlot = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return availability.find((s) => s.date === dateStr);
  };

  const hasEvent = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return pipeline.find((d) => d.eventDate === dateStr);
  };

  const handleToggle = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    toggleAvailability(dateStr);
    toast.success("Availability updated");
  };

  const availableCount = availability.filter((s) => s.available).length;
  const bookedCount = availability.filter((s) => !s.available).length;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Availability</h1>
        <p className="text-muted-foreground mt-1">Manage your calendar and show availability to hosts.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl border-border/50 p-4 text-center">
          <p className="text-2xl font-display font-bold text-emerald-500">{availableCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Available Days</p>
        </Card>
        <Card className="rounded-2xl border-border/50 p-4 text-center">
          <p className="text-2xl font-display font-bold text-destructive">{bookedCount}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Booked Days</p>
        </Card>
        <Card className="rounded-2xl border-border/50 p-4 text-center">
          <p className="text-2xl font-display font-bold text-accent">{pipeline.filter((d) => d.stage === "confirmed").length}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confirmed Events</p>
        </Card>
      </div>

      <Card className="rounded-2xl border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
          <h2 className="font-display font-semibold">{MONTHS[month]} {year}</h2>
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-2">{d}</div>)}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const slot = getSlot(day);
            const event = hasEvent(day);
            const isAvailable = slot?.available ?? true;
            const today = new Date();
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            return (
              <button
                key={day}
                onClick={() => handleToggle(day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all hover:scale-105 ${
                  isAvailable ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                } ${isToday ? "ring-2 ring-accent" : ""}`}
              >
                <span className="font-medium">{day}</span>
                {event && <span className="text-[7px] font-bold mt-0.5 truncate max-w-full px-1">📅</span>}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-6 mt-4 justify-center">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-emerald-500/20" />Available</span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-3 rounded-sm bg-destructive/20" />Booked</span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-3 rounded-sm ring-2 ring-accent" />Today</span>
        </div>
      </Card>
    </motion.div>
  );
}
