import { useParams, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Shirt, Users, UtensilsCrossed, Smartphone } from "lucide-react";
import { useAccessControl } from "@/context/AccessControlContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GuestInvitation() {
  const { guestId } = useParams<{ slug: string; guestId: string }>();
  const { event, getGuest } = useAccessControl();
  const guest = getGuest(guestId || "");

  if (!guest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full bg-card border-border/30 rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-display text-foreground">Invitation Not Found</h1>
          <p className="text-muted-foreground mt-2 text-sm">This invitation link is invalid or has expired.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-5"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">You are invited to</p>
          <h1 className="text-4xl font-display font-semibold text-foreground">{event.name}</h1>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>

        {/* Guest Card */}
        <Card className="bg-card border-border/30 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-accent/20 to-accent/5 px-6 py-4 border-b border-border/20">
            <p className="text-xs text-accent uppercase tracking-wider">Guest</p>
            <h2 className="text-xl font-display font-semibold text-foreground">{guest.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={guest.status === "checked-in" ? "default" : "secondary"}
                className={`text-[10px] rounded-full ${guest.status === "checked-in" ? "bg-[hsl(142,70%,45%)] text-[hsl(0,0%,100%)]" : ""}`}
              >
                {guest.status === "checked-in" ? "Checked In" : "Pending"}
              </Badge>
              {guest.plusOne && (
                <Badge variant="outline" className="text-[10px] rounded-full border-accent/30 text-accent">+1</Badge>
              )}
            </div>
          </div>

          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">{event.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shirt className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">{event.dressCode}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">Table: <span className="text-foreground font-medium">{guest.table}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <UtensilsCrossed className="h-4 w-4 text-accent shrink-0" />
              <span className="text-muted-foreground">Meal: <span className="text-foreground font-medium">{guest.mealPreference}</span></span>
            </div>
          </div>
        </Card>

        {/* QR Code */}
        <Card className="bg-card border-border/30 rounded-2xl p-6">
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your Access Code</p>
            <motion.div
              animate={{ boxShadow: ["0 0 20px hsl(42 50% 57% / 0.15)", "0 0 40px hsl(42 50% 57% / 0.3)", "0 0 20px hsl(42 50% 57% / 0.15)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block p-4 bg-[hsl(0,0%,100%)] rounded-2xl"
            >
              <QRCodeSVG
                value={JSON.stringify({ guestId: guest.id, eventId: event.id, qr: guest.qrCode })}
                size={180}
                level="H"
                bgColor="#FFFFFF"
                fgColor="#0F0F0F"
              />
            </motion.div>
            <p className="text-sm text-accent font-medium">Present this code at the entrance</p>
            <p className="text-[10px] text-muted-foreground font-mono">{guest.qrCode}</p>
          </div>
        </Card>

        {/* Open App Button */}
        <Link to={`/event/${event.slug}/guest/${guest.id}/app/home`}>
          <Button variant="gold" className="w-full rounded-2xl h-12 text-base">
            <Smartphone className="h-5 w-5 mr-2" /> Open Event App
          </Button>
        </Link>

        {/* Branding */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-muted-foreground/40">Powered by</p>
          <p className="text-xs text-muted-foreground/60">
            <span className="font-display font-semibold">Planora</span>{" "}
            <span className="text-[10px] tracking-wider uppercase">by Nexora</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
