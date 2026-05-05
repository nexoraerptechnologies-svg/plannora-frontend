// src/pages/admin/components/LiveFeed.tsx
import { motion, type Variants } from "framer-motion";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FEED_DOT, FeedItem, LIVE_FEED } from "./data";


const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const rowVariant: Variants = {
  hidden: { opacity: 0, x: -10 },
  show: (i: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EASE, delay: i * 0.04 },
  }),
};

// ─── Feed type → emoji label ──────────────────────────────────────────────────

const FEED_EMOJI: Record<string, string> = {
  event:   "🎊",
  checkin: "✅",
  photo:   "📸",
  vendor:  "🏢",
  user:    "👤",
  music:   "🎵",
  payment: "💳",
};

function FeedRow({ item, index }: { item: FeedItem; index: number }) {
  return (
    <motion.div
      variants={rowVariant}
      initial="hidden"
      animate="show"
      custom={index}
      className="px-5 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors group"
    >
      {/* Dot */}
      <div className={`w-2 h-2 rounded-full shrink-0 ${FEED_DOT[item.type]}`} />

      {/* Emoji */}
      <span className="text-[14px] leading-none shrink-0">{FEED_EMOJI[item.type]}</span>

      {/* Message */}
      <p className="text-[13px] text-foreground/80 flex-1 group-hover:text-foreground transition-colors">
        {item.message}
      </p>

      {/* Time */}
      <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
        {item.time}
      </span>
    </motion.div>
  );
}

export function LiveFeed() {
  return (
    <Card className="rounded-2xl border-border/50 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40 flex items-center gap-2.5">
        <Activity className="h-4 w-4 text-[hsl(var(--gold))]" />
        <h2 className="font-display text-[15px] font-semibold">Actividad en vivo</h2>
        <div className="flex items-center gap-1.5 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 relative" />
        </div>
        <span className="ml-auto text-[11px] text-muted-foreground">
          {LIVE_FEED.length} eventos recientes
        </span>
      </div>

      {/* Feed list */}
      <div className="divide-y divide-border/20 max-h-80 overflow-y-auto scrollbar-none">
        {LIVE_FEED.map((item, i) => (
          <FeedRow key={item.id} item={item} index={i} />
        ))}
      </div>
    </Card>
  );
}