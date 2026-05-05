import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Shield, CheckCircle2, Lock, Zap } from "lucide-react";
import { useGuestApp } from "@/context/GuestAppContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATE_CONFIG = {
  ready: {
    color: "accent",
    bgClass: "bg-accent/10 text-accent",
    icon: Shield,
    label: "Ready for Check-in",
    glow: "hsl(42 50% 57% / 0.15)",
    glowMax: "hsl(42 50% 57% / 0.3)",
  },
  used: {
    color: "success",
    bgClass: "bg-[hsl(var(--success))]/20 text-[hsl(var(--success))]",
    icon: CheckCircle2,
    label: "Checked In ✓",
    glow: "hsl(142 50% 50% / 0.15)",
    glowMax: "hsl(142 50% 50% / 0.3)",
  },
  locked: {
    color: "destructive",
    bgClass: "bg-destructive/20 text-destructive",
    icon: Lock,
    label: "Access Locked",
    glow: "hsl(0 50% 50% / 0.15)",
    glowMax: "hsl(0 50% 50% / 0.3)",
  },
};

export default function GuestQR() {
  const { guest, qrState, checkIn, isLive } = useGuestApp();
  const config = STATE_CONFIG[qrState];
  const StateIcon = config.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-display font-semibold text-foreground">QR Access 🔐</h1>
        <p className="text-sm text-muted-foreground">Show this at the entrance</p>
      </div>

      {/* QR Card */}
      <Card className="bg-card border-border/20 rounded-2xl p-6 text-center space-y-5">
        <div className="space-y-2">
          <p className="text-lg font-display font-semibold text-foreground">{guest.name}</p>
          <Badge variant="outline" className="border-accent/30 text-accent text-xs">{guest.table}</Badge>
        </div>

        <motion.div
          animate={{
            boxShadow: [
              `0 0 20px ${config.glow}`,
              `0 0 50px ${config.glowMax}`,
              `0 0 20px ${config.glow}`,
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className={`inline-block p-5 bg-[hsl(0,0%,100%)] rounded-2xl mx-auto relative ${qrState === "locked" ? "opacity-40" : ""}`}
        >
          <QRCodeSVG
            value={JSON.stringify({ guestId: guest.id, qr: guest.qrCode, state: qrState })}
            size={200}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#0F0F0F"
          />
          {qrState === "locked" && (
            <div className="absolute inset-0 flex items-center justify-center bg-[hsl(0,0%,100%)]/60 rounded-2xl">
              <Lock className="h-12 w-12 text-destructive" />
            </div>
          )}
          {qrState === "used" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[hsl(var(--success))] flex items-center justify-center shadow-lg"
            >
              <CheckCircle2 className="h-5 w-5 text-[hsl(0,0%,100%)]" />
            </motion.div>
          )}
        </motion.div>

        <p className="text-[10px] text-muted-foreground font-mono tracking-wider">{guest.qrCode}</p>

        {/* Dynamic Status */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${config.bgClass}`}>
          <StateIcon className="h-4 w-4" />
          {config.label}
        </div>

        {/* Check-in button (simulate) */}
        {qrState === "ready" && isLive && (
          <Button onClick={checkIn} variant="gold" className="w-full rounded-xl mt-2">
            <Zap className="h-4 w-4 mr-2" /> Simulate Check-in (+15 pts)
          </Button>
        )}
      </Card>

      {/* RSVP Status */}
      <Card className="bg-card border-border/20 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">📋 Your Status</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">RSVP</p>
            <p className="text-sm font-semibold text-accent capitalize">{guest.rsvpStatus}</p>
          </div>
          <div className="bg-muted/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Check-in</p>
            <p className="text-sm font-semibold text-foreground">{guest.checkedIn ? "✅ Yes" : "⏳ Pending"}</p>
          </div>
          <div className="bg-muted/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Table</p>
            <p className="text-sm font-semibold text-foreground">{guest.table}</p>
          </div>
          <div className="bg-muted/10 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground">Points</p>
            <p className="text-sm font-semibold text-accent">{guest.points}</p>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="bg-card border-border/20 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">📋 Instructions</p>
        <ul className="text-[11px] text-muted-foreground space-y-1.5">
          <li>1. Arrive at the venue entrance</li>
          <li>2. Show this QR code to staff</li>
          <li>3. Staff will scan & verify your identity</li>
          <li>4. Enjoy the event! 🎉</li>
        </ul>
      </Card>

      {/* Branding */}
      <div className="text-center pt-2">
        <p className="text-[10px] text-muted-foreground/40">Powered by</p>
        <p className="text-xs text-muted-foreground/60">
          <span className="font-display font-semibold">Planora</span>{" "}
          <span className="text-[10px] tracking-wider uppercase">by Nexora</span>
        </p>
      </div>
    </motion.div>
  );
}
