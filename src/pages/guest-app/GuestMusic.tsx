import { useState } from "react";
import { motion } from "framer-motion";
import { Music, ThumbsUp, Send, Disc3, TrendingUp } from "lucide-react";
import { useGuestApp } from "@/context/GuestAppContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GuestMusic() {
  const { songs, suggestSong, voteSong, guest, nowPlaying } = useGuestApp();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");

  const sorted = [...songs].sort((a, b) => b.votes - a.votes);
  const topSong = sorted[0];

  const handleSubmit = () => {
    if (!title.trim()) return;
    suggestSong(title.trim(), artist.trim() || "Unknown Artist");
    setTitle("");
    setArtist("");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-semibold text-foreground">Music 🎵</h1>
        <p className="text-sm text-muted-foreground">Suggest songs & vote for your favorites</p>
      </div>

      {/* Now Playing */}
      <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center shrink-0"
          >
            <Disc3 className="h-7 w-7 text-accent" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-accent uppercase tracking-wider">Now Playing</p>
            <p className="text-base font-semibold text-foreground truncate">{nowPlaying.title}</p>
            <p className="text-xs text-muted-foreground">{nowPlaying.artist}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-muted/20 overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: `${nowPlaying.progress}%` }}
            animate={{ width: "100%" }}
            transition={{ duration: 60, ease: "linear" }}
          />
        </div>
      </Card>

      {/* Top Vote */}
      {topSong && (
        <Card className="bg-accent/5 border-accent/20 rounded-2xl p-4 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-accent uppercase tracking-wider">Most Requested</p>
            <p className="text-sm font-semibold text-foreground truncate">{topSong.title}</p>
            <p className="text-[10px] text-muted-foreground">{topSong.artist} · {topSong.votes} votes</p>
          </div>
          <span className="text-lg">🔥</span>
        </Card>
      )}

      {/* Suggest */}
      <Card className="bg-card border-border/20 rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Suggest a Song</p>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song title..."
          className="bg-muted/30 border-border/20 rounded-xl text-sm"
        />
        <Input
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist (optional)..."
          className="bg-muted/30 border-border/20 rounded-xl text-sm"
        />
        <Button onClick={handleSubmit} variant="gold" className="w-full rounded-xl" disabled={!title.trim()}>
          <Send className="h-4 w-4 mr-2" /> Suggest (+5 pts)
        </Button>
      </Card>

      {/* Playlist */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Playlist ({songs.length} songs)
        </h2>
        {sorted.map((song, i) => {
          const isTop = i === 0;
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={`rounded-2xl p-4 flex items-center gap-3 ${isTop ? "bg-accent/5 border-accent/20" : "bg-card border-border/10"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isTop ? "bg-accent/20" : "bg-accent/10"}`}>
                  {isTop ? <span className="text-sm">🏆</span> : <Music className="h-4 w-4 text-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                  <p className="text-[10px] text-muted-foreground">{song.artist} · by {song.suggestedBy}</p>
                </div>
                <button
                  onClick={() => voteSong(song.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                    song.votedBy.includes(guest.id)
                      ? "bg-accent/20 text-accent scale-105"
                      : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {song.votes}
                </button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
