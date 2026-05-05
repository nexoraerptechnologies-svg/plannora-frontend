import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, ChevronRight, Trophy, Zap, Heart, ThumbsUp, PartyPopper, Flame } from "lucide-react";
import { useGuestApp } from "@/context/GuestAppContext";
import { Card } from "@/components/ui/card";

const FEED_REACTIONS = ["❤️", "🔥", "👏", "😂", "🎉"];

export default function GuestHome() {
  const { guest, timeline, feed, leaderboard, isLive, currentActivity, reactFeed, nowPlaying } = useGuestApp();

  const now = new Date();
  const eventDate = new Date("2026-07-15T18:00:00");
  const diff = eventDate.getTime() - now.getTime();
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff / (1000 * 60 * 60)) % 24));
  const mins = Math.max(0, Math.floor((diff / (1000 * 60)) % 60));

  const [openReaction, setOpenReaction] = useState<string | null>(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 space-y-5">
      {/* Welcome */}
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-semibold text-foreground">
          Welcome, {guest.name.split(" ")[0]} 🎉
        </h1>
        <p className="text-sm text-muted-foreground">Alan & Sofía's Wedding</p>
      </div>

      {/* Live Banner */}
      {isLive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 border border-accent/30 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[hsl(var(--success))]" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-[hsl(var(--success))] animate-ping" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-accent" /> Event is Live!
              </p>
              <p className="text-[10px] text-muted-foreground">Real-time updates active</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Activity or Countdown */}
      {isLive && currentActivity ? (
        <Card className="bg-card border-border/20 rounded-2xl p-4 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center text-2xl shrink-0"
            >
              {currentActivity.icon}
            </motion.div>
            <div className="flex-1">
              <p className="text-[10px] text-accent uppercase tracking-wider font-semibold">Happening Now</p>
              <p className="text-lg font-display font-semibold text-foreground">{currentActivity.label}</p>
              <p className="text-xs text-muted-foreground">{currentActivity.time}</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--success))] animate-pulse" />
              <span className="text-[8px] text-muted-foreground">LIVE</span>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-accent mb-3">Countdown</p>
          <div className="flex gap-4">
            {[
              { value: days, label: "Days" },
              { value: hours, label: "Hours" },
              { value: mins, label: "Min" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-3xl font-display font-bold text-foreground">{item.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Now Playing Mini */}
      {isLive && (
        <Card className="bg-card border-border/20 rounded-2xl p-3 flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shrink-0"
          >
            <span className="text-sm">🎵</span>
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Now Playing</p>
            <p className="text-sm font-medium text-foreground truncate">{nowPlaying.title} · {nowPlaying.artist}</p>
          </div>
          <div className="w-12 h-1.5 rounded-full bg-muted/30 overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: `${nowPlaying.progress}%` }}
              animate={{ width: "100%" }}
              transition={{ duration: 30, ease: "linear" }}
            />
          </div>
        </Card>
      )}

      {/* Timeline */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Event Timeline</h2>
        <div className="space-y-0">
          {timeline.map((item, i) => (
            <div key={i} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                    item.active
                      ? "bg-accent text-accent-foreground"
                      : item.completed
                        ? "bg-accent/20 text-accent"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.icon}
                </div>
                {i < timeline.length - 1 && (
                  <div className={`w-px h-8 ${item.completed ? "bg-accent/30" : "bg-border/20"}`} />
                )}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-medium ${item.active ? "text-accent" : item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </p>
                <p className="text-[10px] text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <Card className="bg-card border-border/20 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <MapPin className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Hacienda Los Robles</p>
            <p className="text-xs text-muted-foreground">Guadalajara, Mexico</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </Card>

      {/* Leaderboard preview */}
      <Card className="bg-card border-border/20 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Leaderboard</h2>
        </div>
        {leaderboard.slice(0, 3).map((entry, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-sm font-bold text-accent w-5">{i + 1}</span>
            <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent">
              {entry.name[0]}
            </div>
            <p className="text-sm text-foreground flex-1">{entry.name}</p>
            <div className="flex gap-1">{entry.badges.map((b, j) => <span key={j} className="text-xs">{b}</span>)}</div>
            <p className="text-xs text-accent font-medium">{entry.points} pts</p>
          </div>
        ))}
      </Card>

      {/* Your Points */}
      <Card className="bg-gradient-to-r from-accent/15 to-transparent border-accent/20 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Your Points</p>
            <p className="text-2xl font-display font-bold text-accent">{guest.points}</p>
          </div>
          <div className="flex gap-1">
            {guest.badges.map((b, i) => (
              <span key={i} className="text-lg">{b}</span>
            ))}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {[
            { action: "Upload photo", pts: "+10" },
            { action: "Suggest song", pts: "+5" },
            { action: "React", pts: "+1" },
          ].map((item) => (
            <div key={item.action} className="text-center bg-accent/5 rounded-lg py-1">
              <p className="text-[9px] text-muted-foreground">{item.action}</p>
              <p className="text-[10px] text-accent font-semibold">{item.pts}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Live Feed with Reactions */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Live Feed</h2>
        {feed.slice(0, 6).map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-3 py-2.5 rounded-xl bg-card border border-border/10 space-y-1.5"
          >
            <div className="flex items-center gap-3">
              <p className="text-sm text-foreground flex-1">{item.message}</p>
              <p className="text-[10px] text-muted-foreground shrink-0">{item.timestamp}</p>
            </div>
            {/* Reaction bar */}
            <div className="flex items-center gap-1.5 relative">
              {/* Existing reactions */}
              {item.reactions && Object.entries(item.reactions).filter(([, v]) => v.length > 0).map(([emoji, users]) => (
                <span
                  key={emoji}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-accent/10 text-[10px]"
                >
                  {emoji} <span className="text-accent">{users.length}</span>
                </span>
              ))}
              {/* Add reaction button */}
              <button
                onClick={() => setOpenReaction(openReaction === item.id ? null : item.id)}
                className="px-1.5 py-0.5 rounded-full bg-muted/20 text-[10px] text-muted-foreground hover:bg-muted/40 transition-colors"
              >
                +
              </button>
              <AnimatePresence>
                {openReaction === item.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute bottom-full left-0 mb-1 flex gap-1 bg-card border border-border/20 rounded-full px-2 py-1 shadow-lg z-10"
                  >
                    {FEED_REACTIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => { reactFeed(item.id, r); setOpenReaction(null); }}
                        className="text-sm hover:scale-125 transition-transform"
                      >
                        {r}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
