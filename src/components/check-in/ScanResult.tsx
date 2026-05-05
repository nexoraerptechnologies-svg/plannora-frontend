import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, X, XCircle, ShieldAlert, UserX, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Guest, ScanErrorType, GuestTag } from "@/context/AccessControlContext";

interface ScanResultProps {
  result: {
    type: "success" | "warning" | "error";
    errorType?: ScanErrorType;
    guest?: Guest;
  };
  onReset: () => void;
}

const TAG_COLORS: Record<GuestTag, string> = {
  VIP: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)] border-[hsl(45,93%,47%)]/30",
  Family: "bg-accent/10 text-accent border-accent/30",
  Friend: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30",
  "Plus One": "bg-muted text-muted-foreground border-border/50",
  Staff: "bg-primary/10 text-primary border-primary/30",
  Vendor: "bg-[hsl(280,60%,50%)]/10 text-[hsl(280,60%,50%)] border-[hsl(280,60%,50%)]/30",
};

const ERROR_CONFIG: Record<ScanErrorType, { icon: typeof XCircle; title: string; description: string; color: string }> = {
  invalid: { icon: XCircle, title: "Invalid QR Code", description: "This code is not recognized in the system.", color: "destructive" },
  "already-checked-in": { icon: AlertTriangle, title: "Already Checked In", description: "This guest has already entered the event.", color: "[hsl(38,92%,50%)]" },
  "not-confirmed": { icon: UserX, title: "Not Confirmed", description: "This guest has not confirmed their RSVP.", color: "destructive" },
  "wrong-event": { icon: ShieldAlert, title: "Wrong Event", description: "This QR code belongs to a different event.", color: "destructive" },
};

export default function ScanResult({ result, onReset }: ScanResultProps) {
  if (result.type === "success" && result.guest) {
    const g = result.guest;
    return (
      <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full space-y-4">
        <Card className="bg-card border-2 border-[hsl(142,70%,45%)]/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3 bg-[hsl(142,70%,45%)]/10">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
              <CheckCircle2 className="h-10 w-10 text-[hsl(142,70%,45%)]" />
            </motion.div>
            <div>
              <h2 className="text-lg font-display font-semibold text-[hsl(142,70%,45%)]">Access Granted</h2>
              <p className="text-[10px] text-muted-foreground">Guest verified successfully</p>
            </div>
          </div>
          <GuestCard guest={g} />
        </Card>
        <div className="flex gap-3">
          <Button variant="gold" className="flex-1 h-12 rounded-2xl font-medium" onClick={onReset}>
            <CheckCircle2 className="h-4 w-4 mr-2" /> Next Guest
          </Button>
        </div>
      </motion.div>
    );
  }

  if (result.type === "warning" && result.errorType === "already-checked-in" && result.guest) {
    const g = result.guest;
    return (
      <motion.div key="warning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full space-y-4">
        <Card className="bg-card border-2 border-[hsl(38,92%,50%)]/50 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3 bg-[hsl(38,92%,50%)]/10">
            <AlertTriangle className="h-10 w-10 text-[hsl(38,92%,50%)]" />
            <div>
              <h2 className="text-lg font-display font-semibold text-[hsl(38,92%,50%)]">Already Checked In</h2>
              <p className="text-[10px] text-muted-foreground">Previously entered at {g.checkInTime}</p>
            </div>
          </div>
          <GuestCard guest={g} />
        </Card>
        <Button variant="outline" className="w-full h-12 rounded-2xl font-medium border-[hsl(38,92%,50%)]/30 text-[hsl(38,92%,50%)]" onClick={onReset}>Dismiss</Button>
      </motion.div>
    );
  }

  // Error states
  const errorType = result.errorType || "invalid";
  const config = ERROR_CONFIG[errorType];
  const Icon = config.icon;

  return (
    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full space-y-4">
      <Card className="bg-card border-2 border-destructive/30 rounded-2xl overflow-hidden">
        <div className="px-5 py-6 flex flex-col items-center text-center gap-3">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <Icon className="h-14 w-14 text-destructive" />
          </motion.div>
          <h2 className="text-lg font-display font-semibold text-destructive">{config.title}</h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
          {result.guest && (
            <div className="mt-2 text-sm">
              <p className="font-medium">{result.guest.name}</p>
              <p className="text-muted-foreground text-xs">{result.guest.email}</p>
            </div>
          )}
        </div>
      </Card>
      <Button variant="outline" onClick={onReset} className="w-full h-12 rounded-2xl">Try Again</Button>
    </motion.div>
  );
}

function GuestCard({ guest }: { guest: Guest }) {
  return (
    <div className="px-5 py-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center text-accent font-display font-semibold text-sm">
          {guest.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-foreground">{guest.name}</p>
          <p className="text-xs text-muted-foreground truncate">{guest.email}</p>
        </div>
      </div>
      {guest.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {guest.tags.map((tag) => (
            <Badge key={tag} variant="outline" className={`text-[9px] rounded-full ${TAG_COLORS[tag]}`}>{tag}</Badge>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Table", value: guest.table },
          { label: "Meal", value: guest.mealPreference },
          { label: "Plus One", value: guest.plusOne ? "Yes" : "No" },
          { label: "Check-in", value: guest.checkInTime || "—" },
        ].map((item) => (
          <div key={item.label} className="bg-muted rounded-xl p-2.5">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
            <p className="text-xs font-medium text-foreground mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
      {guest.entrance && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {guest.entrance}
        </div>
      )}
    </div>
  );
}
