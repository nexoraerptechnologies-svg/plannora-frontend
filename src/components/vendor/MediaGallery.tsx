import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { X, Upload, Star, Trash2, Tag, ImageIcon, Film, Eye, TrendingUp, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MediaItem, IMAGE_TAGS } from "@/lib/vendorMedia";
import { toast } from "sonner";

interface MediaGalleryManagerProps {
  media: MediaItem[];
  onUpdate: (media: MediaItem[]) => void;
  maxImages?: number;
  readOnly?: boolean;
}

export function MediaGalleryManager({ media, onUpdate, maxImages = 20, readOnly = false }: MediaGalleryManagerProps) {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [fullscreenIdx, setFullscreenIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = selectedTag === "all" ? media : media.filter((m) => m.tags.includes(selectedTag));
  const coverImage = media.find((m) => m.isCover);
  const usedTags = [...new Set(media.flatMap((m) => m.tags))];

  const handleUpload = useCallback(() => {
    if (media.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    // Simulate upload with placeholder
    const newItem: MediaItem = {
      id: `img-${Date.now()}`,
      url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=600&fit=crop`,
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=200&h=150&fit=crop`,
      tags: [],
      isCover: media.length === 0,
      views: 0,
      engagement: 0,
      type: "image",
      name: `Image ${media.length + 1}`,
    };
    onUpdate([...media, newItem]);
    toast.success("Image uploaded");
  }, [media, maxImages, onUpdate]);

  const setCover = useCallback((id: string) => {
    onUpdate(media.map((m) => ({ ...m, isCover: m.id === id })));
    toast.success("Cover image updated");
  }, [media, onUpdate]);

  const deleteImage = useCallback((id: string) => {
    const updated = media.filter((m) => m.id !== id);
    if (updated.length > 0 && !updated.some((m) => m.isCover)) {
      updated[0].isCover = true;
    }
    onUpdate(updated);
    toast.success("Image deleted");
  }, [media, onUpdate]);

  const toggleTag = useCallback((imageId: string, tag: string) => {
    onUpdate(media.map((m) => m.id === imageId
      ? { ...m, tags: m.tags.includes(tag) ? m.tags.filter((t) => t !== tag) : [...m.tags, tag] }
      : m
    ));
  }, [media, onUpdate]);

  const handleReorder = useCallback((reordered: MediaItem[]) => {
    onUpdate(reordered);
  }, [onUpdate]);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full text-xs gap-1">
            <ImageIcon className="h-3 w-3" /> {media.filter((m) => m.type === "image").length} images
          </Badge>
          <Badge variant="secondary" className="rounded-full text-xs gap-1">
            <Film className="h-3 w-3" /> {media.filter((m) => m.type === "video").length} videos
          </Badge>
        </div>
        {!readOnly && (
          <Button variant="gold" size="sm" className="rounded-xl text-xs gap-1.5" onClick={handleUpload} disabled={media.length >= maxImages}>
            <Upload className="h-3 w-3" /> Upload ({media.length}/{maxImages})
          </Button>
        )}
      </div>

      {/* Cover preview */}
      {coverImage && (
        <div className="relative rounded-2xl overflow-hidden group">
          <img src={coverImage.url} alt={coverImage.name} className="w-full h-48 object-cover" loading="lazy" width={800} height={600} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Badge className="bg-accent text-accent-foreground text-[9px] rounded-full border-0 gap-1">
              <Star className="h-2.5 w-2.5" /> Cover Image
            </Badge>
            <span className="text-[10px] text-white/80">{coverImage.name}</span>
          </div>
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className="text-[10px] text-white/80 flex items-center gap-1"><Eye className="h-2.5 w-2.5" />{coverImage.views}</span>
            <span className="text-[10px] text-white/80 flex items-center gap-1"><TrendingUp className="h-2.5 w-2.5" />{coverImage.engagement}</span>
          </div>
        </div>
      )}

      {/* Tag filter */}
      {usedTags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          <Badge
            variant={selectedTag === "all" ? "default" : "outline"}
            className="text-[9px] rounded-full cursor-pointer"
            onClick={() => setSelectedTag("all")}
          >All</Badge>
          {usedTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="text-[9px] rounded-full cursor-pointer capitalize"
              onClick={() => setSelectedTag(tag)}
            >{tag}</Badge>
          ))}
        </div>
      )}

      {/* Grid */}
      {readOnly ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-pointer"
              onClick={() => setFullscreenIdx(idx)}
            >
              <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" width={400} height={300} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {item.isCover && (
                <Badge className="absolute top-1.5 left-1.5 bg-accent text-accent-foreground text-[7px] rounded-full border-0">Cover</Badge>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <Reorder.Group axis="x" values={filtered} onReorder={handleReorder} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2" style={{ listStyle: "none" }}>
          {filtered.map((item, idx) => (
            <Reorder.Item key={item.id} value={item}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden group cursor-grab active:cursor-grabbing">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" width={400} height={300} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                {item.isCover && (
                  <Badge className="absolute top-1.5 left-1.5 bg-accent text-accent-foreground text-[7px] rounded-full border-0">Cover</Badge>
                )}
                <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!item.isCover && (
                    <button onClick={() => setCover(item.id)} className="w-6 h-6 rounded-full bg-background/90 flex items-center justify-center hover:bg-background" title="Set as cover">
                      <Star className="h-3 w-3 text-amber-500" />
                    </button>
                  )}
                  <button onClick={() => deleteImage(item.id)} className="w-6 h-6 rounded-full bg-background/90 flex items-center justify-center hover:bg-background" title="Delete">
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>
                <div className="absolute bottom-1.5 left-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-0.5 flex-wrap">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[7px] bg-black/50 text-white rounded-full px-1.5 py-0.5 capitalize">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                  <span className="text-[8px] text-white/80 flex items-center gap-0.5"><Eye className="h-2 w-2" />{item.views}</span>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      {/* Upload drop zone */}
      {!readOnly && media.length < maxImages && (
        <div
          className="border-2 border-dashed border-border/50 rounded-2xl p-8 text-center hover:border-accent/30 hover:bg-accent/5 transition-all cursor-pointer"
          onClick={handleUpload}
        >
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Drop images here or click to upload</p>
          <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG, WEBP • Max 10MB per file</p>
        </div>
      )}

      {/* Tag manager for non-readonly */}
      {!readOnly && media.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium flex items-center gap-1"><Tag className="h-3 w-3" /> Quick Tag All</p>
          <div className="flex gap-1.5 flex-wrap">
            {IMAGE_TAGS.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[9px] rounded-full cursor-pointer capitalize hover:bg-accent/10"
                onClick={() => {
                  onUpdate(media.map((m) => m.tags.includes(tag) ? m : { ...m, tags: [...m.tags, tag] }));
                  toast.success(`Tagged all with "${tag}"`);
                }}
              >{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen viewer */}
      <FullscreenViewer
        images={filtered}
        currentIndex={fullscreenIdx}
        onClose={() => setFullscreenIdx(null)}
        onNavigate={setFullscreenIdx}
      />
    </div>
  );
}

function FullscreenViewer({ images, currentIndex, onClose, onNavigate }: {
  images: MediaItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (idx: number) => void;
}) {
  if (currentIndex === null) return null;
  const current = images[currentIndex];
  if (!current) return null;

  return (
    <Dialog open={currentIndex !== null} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl p-0 rounded-2xl overflow-hidden bg-black border-0">
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={current.id}
              src={current.url}
              alt={current.name}
              className="w-full max-h-[80vh] object-contain"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              loading="lazy"
              width={800}
              height={600}
            />
          </AnimatePresence>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
            <X className="h-4 w-4 text-white" />
          </button>
          {currentIndex > 0 && (
            <button onClick={() => onNavigate(currentIndex - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          )}
          {currentIndex < images.length - 1 && (
            <button onClick={() => onNavigate(currentIndex + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20">
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">{current.name}</p>
                <div className="flex gap-1.5 mt-1">
                  {current.tags.map((tag) => (
                    <span key={tag} className="text-[9px] bg-white/20 text-white rounded-full px-2 py-0.5 capitalize">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 text-white/70 text-xs">
                <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{current.views}</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{current.engagement}</span>
                <span>{currentIndex + 1} / {images.length}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Compact gallery preview for cards
export function MediaPreview({ media = [], className = "" }: { media?: MediaItem[]; className?: string }) {
  const safeMedia = media || [];
  const cover = safeMedia.find((m) => m.isCover) || safeMedia[0];
  const [hovered, setHovered] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(0);

  if (!cover || safeMedia.length === 0) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
      </div>
    );
  }

  const displayImage = hovered && safeMedia.length > 1 ? safeMedia[hoverIdx] : cover;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setHoverIdx(0); }}
      onMouseMove={(e) => {
        if (safeMedia.length <= 1) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const segment = rect.width / Math.min(safeMedia.length, 5);
        setHoverIdx(Math.min(Math.floor(x / segment), safeMedia.length - 1));
      }}
    >
      <img src={displayImage.url} alt={displayImage.name} className="w-full h-full object-cover transition-all duration-300" loading="lazy" width={400} height={300} />
      {hovered && safeMedia.length > 1 && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1">
          {safeMedia.slice(0, 5).map((_, i) => (
            <div key={i} className={`w-6 h-1 rounded-full transition-all ${i === hoverIdx ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      )}
      {safeMedia.length > 1 && (
        <Badge className="absolute top-1.5 right-1.5 bg-black/50 text-white text-[8px] rounded-full border-0 backdrop-blur-sm">
          {safeMedia.length} photos
        </Badge>
      )}
    </div>
  );
}
