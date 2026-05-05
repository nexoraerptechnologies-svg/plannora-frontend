import { motion } from "framer-motion";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const photos = [
  { id: 1, url: "", alt: "Venue exterior", by: "Alan", time: "2 hours ago", aspect: "landscape" },
  { id: 2, url: "", alt: "Flower arrangement", by: "Sofía", time: "5 hours ago", aspect: "portrait" },
  { id: 3, url: "", alt: "Table setting", by: "María", time: "Yesterday", aspect: "square" },
  { id: 4, url: "", alt: "Invitation mockup", by: "Alan", time: "Yesterday", aspect: "landscape" },
  { id: 5, url: "", alt: "Cake design", by: "Carlos", time: "2 days ago", aspect: "portrait" },
  { id: 6, url: "", alt: "Venue interior", by: "Sofía", time: "3 days ago", aspect: "landscape" },
  { id: 7, url: "", alt: "Menu tasting", by: "Alan", time: "3 days ago", aspect: "square" },
  { id: 8, url: "", alt: "Dress fitting", by: "Sofía", time: "4 days ago", aspect: "portrait" },
  { id: 9, url: "", alt: "Band rehearsal", by: "Diego", time: "5 days ago", aspect: "landscape" },
];

const heights: Record<string, string> = { landscape: "h-40", portrait: "h-60", square: "h-48" };
const colors = [
  "from-gold/20 to-gold-light",
  "from-muted to-gold/10",
  "from-gold-light to-secondary",
  "from-secondary to-gold/15",
  "from-gold/10 to-muted",
];

export default function Gallery() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">Gallery</h1>
          <p className="text-muted-foreground mt-1">Photos & memories from your event.</p>
        </div>
        <Button variant="gold" className="rounded-2xl">
          <Upload className="h-4 w-4 mr-2" /> Upload
        </Button>
      </div>

      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`${heights[p.aspect]} rounded-2xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center cursor-pointer group relative overflow-hidden break-inside-avoid`}
          >
            <ImageIcon className="h-8 w-8 text-gold/40 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-background font-medium">{p.alt}</p>
              <p className="text-[10px] text-background/70">Shared by {p.by} · {p.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
