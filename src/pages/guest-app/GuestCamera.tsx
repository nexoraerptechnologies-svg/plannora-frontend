import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Send, Sparkles, Check, Palette, Frame, Sticker } from "lucide-react";
import { useGuestApp } from "@/context/GuestAppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const FILTERS = [
  { id: "none", label: "Original", style: "" },
  { id: "warm", label: "Warm", style: "sepia(30%) saturate(130%)" },
  { id: "cool", label: "Cool", style: "hue-rotate(20deg) saturate(110%)" },
  { id: "bw", label: "B&W", style: "grayscale(100%)" },
  { id: "vintage", label: "Vintage", style: "sepia(50%) contrast(90%) brightness(105%)" },
  { id: "vivid", label: "Vivid", style: "saturate(180%) contrast(110%)" },
];

const FRAMES = [
  { id: "none", label: "None", emoji: "✖️" },
  { id: "wedding", label: "Wedding", emoji: "💒" },
  { id: "hearts", label: "Hearts", emoji: "💕" },
  { id: "gold", label: "Gold", emoji: "✨" },
  { id: "floral", label: "Floral", emoji: "🌸" },
];

const STICKERS = ["🎉", "❤️", "💒", "🥂", "💃", "🎶", "🍰", "👰", "🤵", "💍", "✨", "🎊"];

export default function GuestCamera() {
  const { uploadPhoto, guest } = useGuestApp();
  const [mode, setMode] = useState<"idle" | "preview" | "success">("idle");
  const [caption, setCaption] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<"filters" | "frames" | "stickers" | null>(null);

  const handleCapture = () => setMode("preview");

  const handleUpload = () => {
    uploadPhoto(caption || "📸", selectedFilter, selectedFrame, selectedStickers.join(""));
    setCaption("");
    setSelectedFilter("none");
    setSelectedFrame("none");
    setSelectedStickers([]);
    setActivePanel(null);
    setMode("success");
    setTimeout(() => setMode("idle"), 2000);
  };

  const toggleSticker = (s: string) => {
    setSelectedStickers((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : prev.length < 3 ? [...prev, s] : prev
    );
  };

  const currentFilter = FILTERS.find((f) => f.id === selectedFilter)?.style || "";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 py-5 space-y-5">
      <div className="space-y-1">
        <h1 className="text-2xl font-display font-semibold text-foreground">Camera 📸</h1>
        <p className="text-sm text-muted-foreground">Capture, style & share moments</p>
      </div>

      <AnimatePresence mode="wait">
        {mode === "idle" && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="bg-card border-border/20 rounded-2xl overflow-hidden">
              <div className="relative aspect-[3/4] bg-card flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
                <div className="absolute inset-4 border border-accent/10 rounded-xl">
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-accent/5" />
                  <div className="absolute right-1/3 top-0 bottom-0 w-px bg-accent/5" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-accent/5" />
                  <div className="absolute bottom-1/3 left-0 right-0 h-px bg-accent/5" />
                </div>
                <div className="text-center space-y-3 z-10">
                  <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                    <Camera className="h-8 w-8 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">Tap to capture</p>
                </div>
                {["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((pos, i) => (
                  <div key={i} className={`absolute ${pos} w-6 h-6`}>
                    <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-4 h-0.5 bg-accent/40`} />
                    <div className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-0.5 h-4 bg-accent/40`} />
                  </div>
                ))}
              </div>
              <div className="p-4 flex items-center justify-center">
                <button
                  onClick={handleCapture}
                  className="w-16 h-16 rounded-full border-4 border-accent/60 bg-accent/10 hover:bg-accent/20 transition-colors flex items-center justify-center active:scale-95"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/30" />
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {mode === "preview" && (
          <motion.div key="preview" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <Card className="bg-card border-border/20 rounded-2xl overflow-hidden">
              {/* Preview with filter */}
              <div
                className="relative aspect-[3/4] bg-gradient-to-br from-accent/20 via-muted/30 to-accent/10 flex items-center justify-center"
                style={{ filter: currentFilter }}
              >
                <Sparkles className="h-12 w-12 text-accent/40" />
                <button onClick={() => { setMode("idle"); setActivePanel(null); }} className="absolute top-3 right-3 p-2 rounded-full bg-foreground/20 backdrop-blur-sm z-10">
                  <X className="h-4 w-4 text-foreground" />
                </button>
                {/* Frame overlay */}
                {selectedFrame === "wedding" && <div className="absolute inset-2 border-4 border-accent/30 rounded-2xl pointer-events-none" />}
                {selectedFrame === "hearts" && (
                  <div className="absolute inset-0 pointer-events-none flex items-start justify-between p-4">
                    <span className="text-2xl opacity-40">💕</span>
                    <span className="text-2xl opacity-40">💕</span>
                  </div>
                )}
                {selectedFrame === "gold" && <div className="absolute inset-1 border-2 border-accent rounded-xl pointer-events-none" />}
                {selectedFrame === "floral" && (
                  <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute top-2 left-2 text-xl opacity-50">🌸</span>
                    <span className="absolute top-2 right-2 text-xl opacity-50">🌺</span>
                    <span className="absolute bottom-2 left-2 text-xl opacity-50">🌷</span>
                    <span className="absolute bottom-2 right-2 text-xl opacity-50">🌹</span>
                  </div>
                )}
                {/* Stickers */}
                {selectedStickers.map((s, i) => (
                  <span key={i} className="absolute text-3xl" style={{ top: `${20 + i * 25}%`, right: "10%" }}>
                    {s}
                  </span>
                ))}
              </div>

              {/* Edit tools bar */}
              <div className="flex items-center justify-center gap-2 py-2 bg-card/80 border-b border-border/10">
                {[
                  { key: "filters" as const, icon: Palette, label: "Filters" },
                  { key: "frames" as const, icon: Frame, label: "Frames" },
                  { key: "stickers" as const, icon: Sticker, label: "Stickers" },
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActivePanel(activePanel === key ? null : key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                      activePanel === key ? "bg-accent/20 text-accent" : "bg-muted/20 text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>

              {/* Panels */}
              <AnimatePresence>
                {activePanel === "filters" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 px-4 py-3 overflow-x-auto">
                      {FILTERS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFilter(f.id)}
                          className={`shrink-0 w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-colors ${
                            selectedFilter === f.id ? "border-accent bg-accent/10" : "border-border/20 bg-muted/10"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/30 to-muted/30"
                            style={{ filter: f.style }}
                          />
                          <span className="text-[8px] text-muted-foreground">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activePanel === "frames" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 px-4 py-3">
                      {FRAMES.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFrame(f.id)}
                          className={`shrink-0 w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition-colors ${
                            selectedFrame === f.id ? "border-accent bg-accent/10" : "border-border/20 bg-muted/10"
                          }`}
                        >
                          <span className="text-lg">{f.emoji}</span>
                          <span className="text-[7px] text-muted-foreground">{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {activePanel === "stickers" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-6 gap-2 px-4 py-3">
                      {STICKERS.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleSticker(s)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${
                            selectedStickers.includes(s) ? "bg-accent/20 scale-110" : "bg-muted/10 hover:bg-muted/20"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-[9px] text-center text-muted-foreground pb-2">Select up to 3 stickers</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-4 space-y-3">
                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="bg-muted/30 border-border/20 rounded-xl text-sm"
                />
                <Button onClick={handleUpload} variant="gold" className="w-full rounded-xl">
                  <Send className="h-4 w-4 mr-2" /> Share to Gallery
                </Button>
                <p className="text-[10px] text-center text-accent">+10 points for uploading!</p>
              </div>
            </Card>
          </motion.div>
        )}

        {mode === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-[hsl(var(--success))]/20 flex items-center justify-center"
            >
              <Check className="h-10 w-10 text-[hsl(var(--success))]" />
            </motion.div>
            <h2 className="text-xl font-display font-semibold text-foreground">Photo Shared! 🎉</h2>
            <p className="text-sm text-accent">+10 points earned</p>
            <p className="text-xs text-muted-foreground">Your total: {guest.points} pts</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <Card className="bg-card border-border/20 rounded-2xl p-4 space-y-2">
        <p className="text-xs font-semibold text-foreground">📸 Photo Tips</p>
        <ul className="text-[11px] text-muted-foreground space-y-1">
          <li>• Try different filters for unique looks</li>
          <li>• Add event frames to celebrate the moment</li>
          <li>• Use stickers to express yourself</li>
          <li>• Each upload earns you +10 points!</li>
          <li>• Top photographer earns a badge 🏆</li>
        </ul>
      </Card>
    </motion.div>
  );
}
