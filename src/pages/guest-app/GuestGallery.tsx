import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Flame, PartyPopper, Image as ImageIcon, TrendingUp } from "lucide-react";
import { useGuestApp } from "@/context/GuestAppContext";
import { Card } from "@/components/ui/card";

const reactionEmojis = ["❤️", "🔥", "🎉"];
const colors = [
  "from-accent/20 to-accent/5",
  "from-muted/40 to-accent/10",
  "from-accent/10 to-muted/30",
  "from-muted/20 to-accent/15",
  "from-accent/15 to-muted/10",
];
const heights = ["h-40", "h-52", "h-44", "h-56", "h-48"];

export default function GuestGallery() {
  const { photos, likePhoto, reactPhoto } = useGuestApp();
  const [sort, setSort] = useState<"recent" | "popular">("recent");

  const sorted = [...photos].sort((a, b) =>
    sort === "popular" ? b.likes - a.likes : 0
  );

  const topPhotos = [...photos].sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-semibold text-foreground">Gallery 🖼️</h1>
        <p className="text-sm text-muted-foreground">{photos.length} photos shared</p>
      </div>

      {/* Top Photos */}
      <Card className="bg-gradient-to-r from-accent/10 to-transparent border-accent/20 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          <p className="text-xs font-semibold text-accent uppercase tracking-wider">Top Photos Tonight</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {topPhotos.map((p, i) => (
            <div key={p.id} className={`shrink-0 w-20 h-20 rounded-xl bg-gradient-to-br ${colors[i]} flex items-center justify-center relative`}>
              <ImageIcon className="h-5 w-5 text-accent/30" />
              <div className="absolute bottom-1 right-1 bg-foreground/50 backdrop-blur-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                <Heart className="h-2.5 w-2.5 text-accent" />
                <span className="text-[8px] text-foreground font-medium">{p.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sort */}
      <div className="flex gap-2">
        {(["recent", "popular"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSort(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              sort === s ? "bg-accent text-accent-foreground" : "bg-muted/30 text-muted-foreground"
            }`}
          >
            {s === "recent" ? "Recent" : "Popular"}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className="columns-2 gap-3 space-y-3">
        {sorted.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="break-inside-avoid"
          >
            <Card className="bg-card border-border/10 rounded-2xl overflow-hidden">
              <div className={`${heights[i % heights.length]} bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center relative`}>
                <ImageIcon className="h-8 w-8 text-accent/20" />
              </div>
              <div className="p-3 space-y-2">
                <p className="text-[11px] text-foreground">{photo.caption}</p>
                <p className="text-[9px] text-muted-foreground">by {photo.uploadedBy} · {photo.timestamp}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {reactionEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => reactPhoto(photo.id, emoji)}
                        className="px-2 py-0.5 rounded-full bg-muted/30 text-[10px] hover:bg-muted/50 transition-colors flex items-center gap-0.5"
                      >
                        {emoji}
                        {photo.reactions[emoji] ? (
                          <span className="text-muted-foreground">{photo.reactions[emoji]}</span>
                        ) : null}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => likePhoto(photo.id)} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-accent transition-colors">
                    <Heart className={`h-3.5 w-3.5 ${photo.likedBy.length > 0 ? "fill-accent text-accent" : ""}`} />
                    {photo.likes}
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
