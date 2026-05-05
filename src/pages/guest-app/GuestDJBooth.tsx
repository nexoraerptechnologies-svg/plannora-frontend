import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones, Clock, Search, Flame, Sparkles, CheckCircle2,
  ThumbsUp, Music, Check, Filter
} from "lucide-react";
import { useGuestApp } from "@/context/GuestAppContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type FilterType = "all" | "top" | "new" | "played";

interface DJSong {
  id: string;
  title: string;
  artist: string;
  suggestedBy: string;
  table: string;
  votes: number;
  votedBy: string[];
  played: boolean;
  timestamp: string;
  coverHue: number; // for simulated album art color
}

const MOCK_DJ_SONGS: DJSong[] = [
  { id: "dj1", title: "Vivir Mi Vida", artist: "Marc Anthony", suggestedBy: "María G.", table: "Mesa 5", votes: 45, votedBy: [], played: false, timestamp: "8:05 PM", coverHue: 340 },
  { id: "dj2", title: "Despacito", artist: "Luis Fonsi", suggestedBy: "Carlos R.", table: "Mesa 3", votes: 38, votedBy: [], played: false, timestamp: "8:12 PM", coverHue: 200 },
  { id: "dj3", title: "Bailando", artist: "Enrique Iglesias", suggestedBy: "Ana L.", table: "Mesa 7", votes: 32, votedBy: [], played: false, timestamp: "8:18 PM", coverHue: 270 },
  { id: "dj4", title: "La Bicicleta", artist: "Shakira & Carlos Vives", suggestedBy: "Diego H.", table: "Mesa 1", votes: 28, votedBy: [], played: false, timestamp: "8:22 PM", coverHue: 30 },
  { id: "dj5", title: "Felices los 4", artist: "Maluma", suggestedBy: "Elena R.", table: "Mesa 2", votes: 22, votedBy: [], played: true, timestamp: "7:45 PM", coverHue: 150 },
  { id: "dj6", title: "Danza Kuduro", artist: "Don Omar", suggestedBy: "Valentina C.", table: "Mesa 8", votes: 19, votedBy: [], played: true, timestamp: "7:30 PM", coverHue: 50 },
  { id: "dj7", title: "Waka Waka", artist: "Shakira", suggestedBy: "Pedro R.", table: "Mesa 4", votes: 15, votedBy: [], played: false, timestamp: "8:30 PM", coverHue: 120 },
  { id: "dj8", title: "Corazón Sin Cara", artist: "Prince Royce", suggestedBy: "Laura V.", table: "Mesa 6", votes: 12, votedBy: [], played: false, timestamp: "8:35 PM", coverHue: 0 },
];

export default function GuestDJBooth() {
  const { timeline } = useGuestApp();
  const [songs, setSongs] = useState<DJSong[]>(MOCK_DJ_SONGS);
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  const nextMilestone = timeline.find((t) => !t.completed && !t.active);
  const currentActivity = timeline.find((t) => t.active);
  const completedCount = timeline.filter((t) => t.completed).length;
  const eventProgress = Math.round(((completedCount + (currentActivity ? 0.5 : 0)) / timeline.length) * 100);

  const markPlayed = (id: string) => {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, played: true } : s)));
  };

  const filtered = useMemo(() => {
    let list = [...songs];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
    }
    switch (filter) {
      case "top": return list.filter((s) => !s.played).sort((a, b) => b.votes - a.votes);
      case "new": return list.filter((s) => !s.played).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      case "played": return list.filter((s) => s.played);
      default: return list.sort((a, b) => b.votes - a.votes);
    }
  }, [songs, filter, search]);

  const filters: { id: FilterType; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "Todas", icon: <Filter className="h-3.5 w-3.5" /> },
    { id: "top", label: "Más Votadas", icon: <Flame className="h-3.5 w-3.5" /> },
    { id: "new", label: "Nuevas", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { id: "played", label: "Reproducidas", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* DJ Header */}
      <header className="sticky top-0 z-50 bg-[hsl(var(--bg))]/95 backdrop-blur-xl border-b border-border/10 px-4 pt-4 pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Planora</p>
            <h1 className="text-lg font-display font-semibold text-foreground">Live Music Monitor</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 rounded-full px-3 py-1.5">
            <Headphones className="h-4 w-4 text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">DJ Booth</span>
          </div>
        </div>

        {/* Next milestone banner */}
        {nextMilestone && (
          <div className="flex items-center gap-2 bg-accent rounded-xl px-3 py-2">
            <Clock className="h-4 w-4 text-accent-foreground shrink-0" />
            <p className="text-xs font-semibold text-accent-foreground truncate">
              Siguiente hito: {nextMilestone.icon} {nextMilestone.label} — {nextMilestone.time}
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar peticiones..."
            className="pl-9 bg-muted/30 border-border/20 rounded-xl text-sm h-10"
          />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                filter === f.id
                  ? "bg-foreground text-background border border-accent"
                  : "bg-muted/30 text-muted-foreground border border-border/20 hover:bg-muted/50"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </header>

      {/* Song list */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-3">
        <p className="text-xs text-muted-foreground">
          {filtered.length} peticion{filtered.length !== 1 ? "es" : ""}
        </p>
        <AnimatePresence>
          {filtered.map((song, i) => (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: song.played ? 0.5 : 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={`rounded-2xl p-3 flex items-center gap-3 border-border/10 transition-all ${
                song.played ? "bg-muted/20" : "bg-card"
              }`}>
                {/* Album art placeholder */}
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, hsl(${song.coverHue}, 60%, 30%), hsl(${song.coverHue + 40}, 50%, 20%))`,
                  }}
                >
                  <Music className="h-5 w-5 text-white/70" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${song.played ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {song.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                  <p className="text-[10px] text-muted-foreground/70">
                    Pedida por: {song.suggestedBy} ({song.table})
                  </p>
                </div>

                {/* Votes + action */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="flex items-center gap-1 text-accent">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-lg font-bold">{song.votes}</span>
                  </div>
                  {song.played ? (
                    <div className="flex items-center gap-1 text-accent text-[10px] font-medium">
                      <Check className="h-3.5 w-3.5" />
                      <span>Reproducida</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => markPlayed(song.id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--success))]/15 text-[hsl(var(--success))] text-[10px] font-medium hover:bg-[hsl(var(--success))]/25 transition-colors"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Marcar</span>
                    </button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Bottom event progress bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[hsl(var(--bg))]/95 backdrop-blur-xl border-t border-border/10 z-50 px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-foreground">Progreso del Evento</p>
          <p className="text-xs text-muted-foreground">
            {eventProgress}% — {currentActivity ? currentActivity.label : "En curso"}
          </p>
        </div>
        <Progress value={eventProgress} className="h-1.5 bg-muted/20 [&>div]:bg-accent" />
      </div>
    </div>
  );
}
