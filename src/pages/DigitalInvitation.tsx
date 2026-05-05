import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, MapPin, Shirt, Heart, ChevronDown, Check, X,
  Music, Volume2, VolumeX, Camera, Lock, Smartphone, Users, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import heroImg from "@/assets/invitation-hero.jpg";
import gallery1 from "@/assets/invitation-gallery-1.jpg";
import gallery2 from "@/assets/invitation-gallery-2.jpg";
import gallery3 from "@/assets/invitation-gallery-3.jpg";
import gallery4 from "@/assets/invitation-gallery-4.jpg";

// ── Theme definitions ──
type InvitationTheme = "luxury" | "minimal" | "modern" | "floral";

const THEMES: Record<InvitationTheme, {
  label: string;
  bg: string;
  text: string;
  accent: string;
  card: string;
  muted: string;
  overlay: string;
  btnBg: string;
  btnText: string;
}> = {
  luxury: {
    label: "Luxury Wedding",
    bg: "bg-[hsl(0,0%,4%)]",
    text: "text-[hsl(0,0%,95%)]",
    accent: "text-[hsl(42,50%,57%)]",
    card: "bg-[hsl(0,0%,7%)] border-[hsl(0,0%,15%)]",
    muted: "text-[hsl(0,0%,55%)]",
    overlay: "from-[hsl(0,0%,4%)]/80 via-[hsl(0,0%,4%)]/40 to-[hsl(0,0%,4%)]/90",
    btnBg: "bg-[hsl(42,50%,57%)]",
    btnText: "text-[hsl(0,0%,4%)]",
  },
  minimal: {
    label: "Minimal Elegant",
    bg: "bg-[hsl(40,30%,97%)]",
    text: "text-[hsl(0,0%,10%)]",
    accent: "text-[hsl(0,0%,25%)]",
    card: "bg-[hsl(0,0%,100%)] border-[hsl(0,0%,90%)]",
    muted: "text-[hsl(0,0%,50%)]",
    overlay: "from-[hsl(40,30%,97%)]/80 via-[hsl(40,30%,97%)]/30 to-[hsl(40,30%,97%)]/90",
    btnBg: "bg-[hsl(0,0%,10%)]",
    btnText: "text-[hsl(0,0%,95%)]",
  },
  modern: {
    label: "Modern Party",
    bg: "bg-[hsl(240,10%,8%)]",
    text: "text-[hsl(0,0%,95%)]",
    accent: "text-[hsl(280,80%,65%)]",
    card: "bg-[hsl(240,10%,12%)] border-[hsl(280,80%,65%)]/20",
    muted: "text-[hsl(0,0%,50%)]",
    overlay: "from-[hsl(240,10%,8%)]/90 via-[hsl(240,10%,8%)]/40 to-[hsl(240,10%,8%)]/95",
    btnBg: "bg-[hsl(280,80%,65%)]",
    btnText: "text-[hsl(0,0%,100%)]",
  },
  floral: {
    label: "Floral Romantic",
    bg: "bg-[hsl(340,30%,97%)]",
    text: "text-[hsl(340,20%,20%)]",
    accent: "text-[hsl(340,50%,55%)]",
    card: "bg-[hsl(0,0%,100%)] border-[hsl(340,50%,55%)]/15",
    muted: "text-[hsl(340,10%,50%)]",
    overlay: "from-[hsl(340,30%,97%)]/80 via-[hsl(340,30%,97%)]/30 to-[hsl(340,30%,97%)]/90",
    btnBg: "bg-[hsl(340,50%,55%)]",
    btnText: "text-[hsl(0,0%,100%)]",
  },
};

// ── Mock data ──
const MOCK_INVITATION = {
  eventName: "Alan & Sofía",
  subtitle: "are getting married",
  date: "April 30, 2026",
  time: "5:00 PM",
  location: "Hacienda Los Robles, Guadalajara",
  dressCode: "Black Tie Optional",
  message:
    "We are so excited to celebrate this special moment with you. Your presence means the world to us. Together, let's create memories that will last a lifetime.",
  guestName: "Carlos Mendoza",
  table: "Mesa 7",
  plusOne: true,
  mapUrl: "https://maps.google.com/?q=Hacienda+Los+Robles+Guadalajara",
  eventSlug: "alan-y-sofia",
  guestId: "g-001",
};

const galleryImages = [gallery1, gallery2, gallery3, gallery4];

// ── Countdown hook ──
function useCountdown(targetDate: string) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// ── Section animation wrapper ──
function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function DigitalInvitation() {
  const { eventSlug, guestId } = useParams();
  const [theme, setTheme] = useState<InvitationTheme>("luxury");
  const [rsvp, setRsvp] = useState<"pending" | "accepted" | "declined">("pending");
  const [plusOne, setPlusOne] = useState(false);
  const [mealChoice, setMealChoice] = useState("beef");
  const [musicOn, setMusicOn] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const t = THEMES[theme];
  const inv = MOCK_INVITATION;
  const countdown = useCountdown("2026-04-30T17:00:00");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleRsvp = (status: "accepted" | "declined") => {
    setRsvp(status);
    toast.success(status === "accepted" ? "🎉 We can't wait to see you!" : "We'll miss you! 💛");
  };

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} overflow-x-hidden`}>
      {/* Theme picker toggle */}
      <motion.button
        className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-[hsl(0,0%,0%)]/50 backdrop-blur-sm flex items-center justify-center text-[hsl(0,0%,100%)] border border-[hsl(0,0%,100%)]/10"
        onClick={() => setShowThemePicker(!showThemePicker)}
        whileTap={{ scale: 0.9 }}
      >
        🎨
      </motion.button>

      <AnimatePresence>
        {showThemePicker && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-16 right-4 z-50 p-3 rounded-2xl bg-[hsl(0,0%,0%)]/80 backdrop-blur-md border border-[hsl(0,0%,100%)]/10 space-y-2"
          >
            {(Object.entries(THEMES) as [InvitationTheme, typeof THEMES[InvitationTheme]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setTheme(key); setShowThemePicker(false); }}
                className={`block w-full text-left text-xs px-3 py-2 rounded-xl transition-colors ${
                  theme === key ? "bg-[hsl(0,0%,100%)]/20 text-[hsl(0,0%,100%)]" : "text-[hsl(0,0%,70%)] hover:text-[hsl(0,0%,100%)]"
                }`}
              >
                {val.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music toggle */}
      <motion.button
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-[hsl(0,0%,0%)]/50 backdrop-blur-sm flex items-center justify-center text-[hsl(0,0%,100%)] border border-[hsl(0,0%,100%)]/10"
        onClick={() => { setMusicOn(!musicOn); toast.info(musicOn ? "Music paused" : "🎵 Music playing"); }}
        whileTap={{ scale: 0.9 }}
      >
        {musicOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </motion.button>

      {/* ═══════════════════════════════════════ */}
      {/* 1. HERO SECTION */}
      {/* ═══════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ scale: heroScale }} className="absolute inset-0">
          <img src={heroImg} alt="Wedding hero" className="w-full h-full object-cover" width={1080} height={1920} />
        </motion.div>
        <div className={`absolute inset-0 bg-gradient-to-b ${t.overlay}`} />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6 max-w-lg"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className={`text-xs uppercase tracking-[0.4em] ${t.muted} mb-4`}
          >
            You are invited
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl font-display font-semibold leading-tight"
          >
            {inv.eventName}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className={`text-sm ${t.muted} mt-3 font-light`}
          >
            {inv.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className={`mt-4 text-lg ${t.accent} font-display`}
          >
            {inv.date}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="mt-8"
          >
            <ChevronDown className={`h-6 w-6 mx-auto ${t.muted} animate-bounce`} />
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════ */}
      {/* COUNTDOWN */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <p className={`text-xs uppercase tracking-[0.3em] ${t.muted} mb-6`}>Counting down to</p>
          <div className="grid grid-cols-4 gap-3">
            {([
              { value: countdown.days, label: "Days" },
              { value: countdown.hours, label: "Hours" },
              { value: countdown.minutes, label: "Min" },
              { value: countdown.seconds, label: "Sec" },
            ]).map((item) => (
              <div key={item.label} className={`${t.card} border rounded-2xl p-4`}>
                <p className={`text-3xl sm:text-4xl font-display font-bold ${t.accent}`}>
                  {String(item.value).padStart(2, "0")}
                </p>
                <p className={`text-[10px] uppercase tracking-wider ${t.muted} mt-1`}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* 2. PHOTO GALLERY */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-12">
        <p className={`text-xs uppercase tracking-[0.3em] ${t.muted} text-center mb-6`}>Our Story</p>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className="shrink-0 w-64 sm:w-72 snap-center"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  loading="lazy"
                  width={800}
                  height={1200}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* 3. EVENT DETAILS */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-16 px-6">
        <div className={`max-w-md mx-auto ${t.card} border rounded-3xl p-8 space-y-5`}>
          <h2 className="text-2xl font-display font-semibold text-center mb-6">Event Details</h2>

          {[
            { icon: Calendar, label: "Date", value: inv.date },
            { icon: Clock, label: "Time", value: inv.time },
            { icon: MapPin, label: "Location", value: inv.location },
            { icon: Shirt, label: "Dress Code", value: inv.dressCode },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${t.btnBg}/10 flex items-center justify-center shrink-0`}>
                <item.icon className={`h-4 w-4 ${t.accent}`} />
              </div>
              <div>
                <p className={`text-[10px] uppercase tracking-wider ${t.muted}`}>{item.label}</p>
                <p className="text-sm font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* 4. PERSONAL MESSAGE */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-16 px-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <Heart className={`h-8 w-8 mx-auto ${t.accent}`} />
          <p className={`text-lg sm:text-xl font-display leading-relaxed italic ${t.muted}`}>
            "{inv.message}"
          </p>
          <div>
            <p className={`text-sm ${t.accent} font-display`}>With love,</p>
            <p className="text-lg font-display font-semibold mt-1">{inv.eventName}</p>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* 5. LOCATION MAP */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className={`${t.card} border rounded-3xl overflow-hidden`}>
            <div className="aspect-video bg-[hsl(0,0%,15%)] relative flex items-center justify-center">
              <MapPin className={`h-12 w-12 ${t.accent} opacity-30`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className={`h-8 w-8 mx-auto ${t.accent} mb-2`} />
                  <p className="text-sm font-medium">{inv.location}</p>
                </div>
              </div>
            </div>
            <div className="p-5 text-center">
              <a
                href={inv.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className={`${t.btnBg} ${t.btnText} rounded-xl w-full`}>
                  <MapPin className="h-4 w-4 mr-2" /> Open in Maps
                </Button>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* 6. RSVP SECTION */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-16 px-6">
        <div className={`max-w-md mx-auto ${t.card} border rounded-3xl p-8`}>
          <h2 className="text-2xl font-display font-semibold text-center mb-2">RSVP</h2>
          <p className={`text-xs ${t.muted} text-center mb-8`}>Please let us know if you can attend</p>

          {rsvp === "pending" ? (
            <div className="space-y-6">
              <div className="flex gap-3">
                <Button
                  className={`flex-1 ${t.btnBg} ${t.btnText} rounded-xl h-12 text-base`}
                  onClick={() => handleRsvp("accepted")}
                >
                  <Check className="h-5 w-5 mr-2" /> Accept
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-12 text-base border-[hsl(0,0%,30%)]"
                  onClick={() => handleRsvp("declined")}
                >
                  <X className="h-5 w-5 mr-2" /> Decline
                </Button>
              </div>

              {inv.plusOne && (
                <div className="flex items-center justify-between">
                  <Label className={`text-sm ${t.muted}`}>Bringing a plus one?</Label>
                  <Switch checked={plusOne} onCheckedChange={setPlusOne} />
                </div>
              )}

              <div>
                <p className={`text-xs ${t.muted} mb-3`}>Meal preference</p>
                <RadioGroup value={mealChoice} onValueChange={setMealChoice} className="grid grid-cols-3 gap-2">
                  {[
                    { value: "beef", label: "🥩 Beef" },
                    { value: "chicken", label: "🍗 Chicken" },
                    { value: "vegan", label: "🥗 Vegan" },
                  ].map((m) => (
                    <div key={m.value}>
                      <RadioGroupItem value={m.value} id={m.value} className="peer sr-only" />
                      <Label
                        htmlFor={m.value}
                        className={`flex items-center justify-center rounded-xl border p-3 text-xs cursor-pointer transition-colors peer-data-[state=checked]:border-[hsl(42,50%,57%)] peer-data-[state=checked]:bg-[hsl(42,50%,57%)]/10 ${
                          mealChoice === m.value ? `border-[hsl(42,50%,57%)] bg-[hsl(42,50%,57%)]/10` : "border-[hsl(0,0%,20%)]"
                        }`}
                      >
                        {m.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              {rsvp === "accepted" ? (
                <>
                  <div className={`w-16 h-16 rounded-full ${t.btnBg}/10 flex items-center justify-center mx-auto mb-4`}>
                    <Check className={`h-8 w-8 ${t.accent}`} />
                  </div>
                  <h3 className="text-xl font-display font-semibold">See you there!</h3>
                  <p className={`text-sm ${t.muted} mt-1`}>We can't wait to celebrate with you</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-[hsl(0,0%,15%)] flex items-center justify-center mx-auto mb-4">
                    <Heart className={`h-8 w-8 ${t.muted}`} />
                  </div>
                  <h3 className="text-xl font-display font-semibold">We'll miss you</h3>
                  <p className={`text-sm ${t.muted} mt-1`}>Thank you for letting us know</p>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={`mt-4 text-xs ${t.muted}`}
                onClick={() => setRsvp("pending")}
              >
                Change response
              </Button>
            </motion.div>
          )}
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* 8. GALLERY TEASER */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <Camera className={`h-8 w-8 mx-auto ${t.accent} mb-4`} />
          <h2 className="text-2xl font-display font-semibold mb-2">Event Gallery</h2>
          <p className={`text-sm ${t.muted} mb-6`}>Photos will be available after the event</p>

          <div className="grid grid-cols-3 gap-2">
            {[gallery1, gallery3, gallery4].map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
                <img src={img} alt="" className="w-full h-full object-cover opacity-30 blur-sm" loading="lazy" width={200} height={200} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className={`h-5 w-5 ${t.muted}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════ */}
      {/* 9. ACCESS CTA */}
      {/* ═══════════════════════════════════════ */}
      <Section className="py-20 px-6">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className={`w-16 h-16 rounded-2xl ${t.btnBg}/10 flex items-center justify-center mx-auto`}>
            <Smartphone className={`h-8 w-8 ${t.accent}`} />
          </div>
          <h2 className="text-2xl font-display font-semibold">Your Event App</h2>
          <p className={`text-sm ${t.muted}`}>
            Access your QR code, table info, gallery, and more on the day of the event.
          </p>
          <Link to={`/event/${inv.eventSlug}/guest/${inv.guestId}/app/home`}>
            <Button className={`${t.btnBg} ${t.btnText} rounded-2xl h-14 px-8 text-base w-full max-w-xs mx-auto`}>
              Access My Event <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* Footer */}
      <div className="py-10 text-center">
        <p className={`text-[10px] ${t.muted} opacity-40`}>Powered by</p>
        <p className={`text-xs ${t.muted} opacity-60 mt-1`}>
          <span className="font-display font-semibold">Planora</span>{" "}
          <span className="text-[10px] tracking-wider uppercase">by Nexora</span>
        </p>
      </div>
    </div>
  );
}
