import { useState, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  Star,
  MapPin,
  Heart,
  BadgeCheck,
  ArrowLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useVendors,
  CATEGORY_LABELS,
  type VendorCategory,
  type Vendor,
} from "@/context/VendorContext";
import { MediaPreview } from "@/components/vendor/MediaGallery";
import {
  MOCK_SERVICE_MEDIA,
  type MediaItem,
} from "@/lib/vendorMedia";
import { Link } from "react-router-dom";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE, delay: i * 0.06 },
  }),
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

function getVendorMedia(vendorId: string, vendors: Vendor[]): MediaItem[] {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) return [];
  return vendor.services.flatMap((s) => MOCK_SERVICE_MEDIA[s.id] || []);
}

// Emoji map for category chips
const CATEGORY_EMOJI: Record<string, string> = {
  catering: "🍽️",
  photography: "📸",
  music: "🎵",
  decoration: "🌸",
  venue: "🏛️",
  video: "🎬",
  makeup: "💄",
  transport: "🚗",
};

// ─── Category Chip ─────────────────────────────────────────────────────────────

function CategoryChip({
  value,
  label,
  emoji,
  active,
  onClick,
}: {
  value: string;
  label: string;
  emoji?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[12px] font-medium
        transition-all duration-200 whitespace-nowrap border shrink-0
        ${
          active
            ? "bg-[hsl(var(--gold))] text-[#0C0C0E] border-[hsl(var(--gold))] shadow-sm"
            : "bg-card border-border text-muted-foreground hover:border-[hsl(var(--gold)/0.5)] hover:text-foreground"
        }
      `}
    >
      {emoji && <span className="text-[13px] leading-none">{emoji}</span>}
      {label}
    </button>
  );
}

// ─── Vendor Card ───────────────────────────────────────────────────────────────

function VendorCard({
  vendor,
  index,
  isFav,
  onToggleFav,
  featured,
  media = [],
}: {
  vendor: Vendor;
  index: number;
  isFav: boolean;
  onToggleFav: () => void;
  featured?: boolean;
  media?: MediaItem[];
}) {
  const priceFrom = vendor.services[0]?.price ?? null;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      custom={index}
      layout
    >
      <Link to={`/vendors/${vendor.id}`} className="block group">
        <div
          className={`
            rounded-2xl overflow-hidden border transition-all duration-300
            bg-card hover:shadow-xl hover:-translate-y-0.5
            ${
              featured
                ? "border-[hsl(var(--gold)/0.35)] shadow-md shadow-[hsl(var(--gold)/0.06)]"
                : "border-border hover:border-[hsl(var(--gold)/0.3)]"
            }
          `}
        >
          {/* Image area */}
          <div className="h-44 relative overflow-hidden bg-muted">
            {media.length > 0 ? (
              <MediaPreview media={media} className="h-full w-full object-cover" />
            ) : (
              <div
                className={`h-full flex items-center justify-center ${
                  featured
                    ? "bg-gradient-to-br from-[hsl(var(--gold)/0.2)] to-[hsl(var(--gold)/0.05)]"
                    : "bg-gradient-to-br from-muted to-muted/60"
                }`}
              >
                <span className="font-display text-5xl font-bold text-foreground/10 select-none">
                  {vendor.name[0]}
                </span>
              </div>
            )}

            {/* Overlays */}
            {featured && (
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 bg-[hsl(var(--gold))] text-[#0C0C0E] text-[9px] font-semibold px-2.5 py-1 rounded-full tracking-wide">
                  ⭐ Destacado
                </span>
              </div>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFav();
              }}
              className={`
                absolute top-3 right-3 z-10 w-8 h-8 rounded-full
                backdrop-blur-md flex items-center justify-center
                transition-all duration-200
                ${
                  isFav
                    ? "bg-destructive/90 shadow-sm"
                    : "bg-background/60 hover:bg-background/90"
                }
              `}
            >
              <Heart
                className={`h-3.5 w-3.5 transition-all ${
                  isFav ? "fill-white text-white" : "text-muted-foreground"
                }`}
              />
            </button>

            {/* Rating pill over image */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2.5 py-1">
              <Star className="h-3 w-3 fill-[hsl(var(--gold))] text-[hsl(var(--gold))]" />
              <span className="text-[11px] font-semibold">{vendor.rating}</span>
              <span className="text-[10px] text-muted-foreground">
                ({vendor.reviewCount})
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            {/* Name + verified */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-display font-semibold text-[15px] truncate">
                    {vendor.name}
                  </h3>
                  {vendor.verified && (
                    <BadgeCheck className="h-4 w-4 text-[hsl(var(--gold))] shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-[hsl(var(--gold))] font-medium tracking-wide uppercase">
                  {CATEGORY_LABELS[vendor.category]}
                </p>
              </div>
              {priceFrom && (
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-muted-foreground block">desde</span>
                  <span className="font-display text-[14px] font-semibold text-foreground">
                    ${priceFrom.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
              {vendor.description}
            </p>

            {/* Footer row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {vendor.location}
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {vendor.services.slice(0, 2).map((s) => (
                  <span
                    key={s.id}
                    className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                  >
                    {s.title}
                  </span>
                ))}
                {vendor.services.length > 2 && (
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    +{vendor.services.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="gold"
              size="sm"
              className="w-full rounded-xl text-[12px] h-9 mt-1"
              asChild
            >
              <span>Ver perfil completo</span>
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--gold)/0.08)] border border-[hsl(var(--gold)/0.2)] flex items-center justify-center mb-5 text-2xl">
        🔍
      </div>
      <h3 className="font-display text-xl mb-2">Sin resultados</h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        No encontramos proveedores con ese criterio. Intenta cambiar los filtros.
      </p>
      <Button variant="outline" className="rounded-xl" onClick={onClear}>
        <X className="h-3.5 w-3.5 mr-2" />
        Limpiar filtros
      </Button>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function VendorsMarketplace() {
  const { vendors, toggleFavorite, isFavorite } = useVendors();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const locations = useMemo(
    () => [...new Set(vendors.map((v) => v.location))],
    [vendors]
  );

  const filtered = useMemo(
    () =>
      vendors.filter((v) => {
        const matchSearch =
          !search ||
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.services.some((s) =>
            s.title.toLowerCase().includes(search.toLowerCase())
          );
        const matchCat = category === "all" || v.category === category;
        const matchLoc = location === "all" || v.location === location;
        return matchSearch && matchCat && matchLoc;
      }),
    [vendors, search, category, location]
  );

  const featured = filtered.filter((v) => v.featured);
  const regular = filtered.filter((v) => !v.featured);

  const activeFiltersCount = [
    category !== "all",
    location !== "all",
    search !== "",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setCategory("all");
    setLocation("all");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center gap-4">
            <Link
              to="/"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-sm font-semibold">
                Marketplace de Proveedores
              </h1>
              <p className="text-[10px] text-muted-foreground">
                Plannora by Nexora
              </p>
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-[hsl(var(--gold))] hover:underline"
                >
                  Limpiar ({activeFiltersCount})
                </button>
              )}
              <button
                onClick={() => setShowFilters((p) => !p)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border transition-all
                  ${
                    showFilters || activeFiltersCount > 0
                      ? "bg-[hsl(var(--gold)/0.1)] border-[hsl(var(--gold)/0.4)] text-[hsl(var(--gold))]"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[hsl(var(--gold))] text-[#0C0C0E] text-[9px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-card/40 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-[11px] tracking-[0.15em] uppercase text-[hsl(var(--gold))] mb-3">
              Proveedores verificados
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">
              Encuentra al{" "}
              <em className="italic text-[hsl(var(--gold))]">proveedor ideal</em>
            </h2>
            <p className="text-muted-foreground text-[15px] max-w-md mx-auto mb-8">
              Catering, fotografía, música y más — curados y verificados por
              Plannora para tu evento.
            </p>

            {/* Search bar */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar proveedores o servicios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-12 rounded-2xl border-border bg-background text-[14px] focus-visible:ring-[hsl(var(--gold)/0.4)] pr-10"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-border transition-colors"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Category chips ── */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto scrollbar-none">
            <CategoryChip
              value="all"
              label="Todos"
              emoji="✨"
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <CategoryChip
                key={key}
                value={key}
                label={label}
                emoji={CATEGORY_EMOJI[key]}
                active={category === key}
                onClick={() => setCategory(key)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter panel (expandable) ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden border-b border-border bg-card/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-3 items-center">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
                Filtrar por:
              </span>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-44 h-9 rounded-xl text-[12px]">
                  <MapPin className="h-3 w-3 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <X className="h-3 w-3" /> Limpiar todo
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[hsl(var(--gold))] text-[13px]">⭐</span>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[hsl(var(--gold))]">
                Proveedores destacados
              </h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {featured.map((vendor, i) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={i}
                    isFav={isFavorite(vendor.id)}
                    onToggleFav={() => toggleFavorite(vendor.id)}
                    featured
                    media={getVendorMedia(vendor.id, vendors)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* All vendors */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {category === "all"
                ? "Todos los proveedores"
                : CATEGORY_LABELS[category as VendorCategory]}{" "}
              <span className="text-foreground">
                ({featured.length + regular.length})
              </span>
            </h3>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {regular.length > 0 ? (
                regular.map((vendor, i) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    index={i}
                    isFav={isFavorite(vendor.id)}
                    onToggleFav={() => toggleFavorite(vendor.id)}
                    media={getVendorMedia(vendor.id, vendors)}
                  />
                ))
              ) : filtered.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : null}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}