import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Heart, BadgeCheck, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useVendors, CATEGORY_LABELS, VendorCategory, Vendor } from "@/context/VendorContext";
import { MediaPreview } from "@/components/vendor/MediaGallery";
import { MOCK_SERVICE_MEDIA, VENDOR_GALLERY, MediaItem } from "@/lib/vendorMedia";
import { Link } from "react-router-dom";

function getVendorMedia(vendorId: string, vendors: Vendor[]): MediaItem[] {
  const vendor = vendors.find((v) => v.id === vendorId);
  if (!vendor) return [];
  return vendor.services.flatMap((s) => MOCK_SERVICE_MEDIA[s.id] || []);
}

export default function VendorsMarketplace() {
  const { vendors, toggleFavorite, isFavorite } = useVendors();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [location, setLocation] = useState<string>("all");

  const locations = [...new Set(vendors.map((v) => v.location))];

  const filtered = vendors.filter((v) => {
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.services.some((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "all" || v.category === category;
    const matchLoc = location === "all" || v.location === location;
    return matchSearch && matchCat && matchLoc;
  });

  const featured = filtered.filter((v) => v.featured);
  const regular = filtered.filter((v) => !v.featured);

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center gap-3">
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
            <div>
              <h1 className="text-sm font-display font-semibold">Vendor Marketplace</h1>
              <p className="text-[10px] text-muted-foreground">Planora by Nexora</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-semibold">Find the Perfect Vendors</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">Discover premium service providers for your next event. Curated and verified by Planora.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors or services..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-11 rounded-xl" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl"><Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-xl"><MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" /><SelectValue placeholder="Location" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {featured.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">Featured Vendors</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((vendor, i) => (
                <VendorCard key={vendor.id} vendor={vendor} index={i} isFav={isFavorite(vendor.id)} onToggleFav={() => toggleFavorite(vendor.id)} featured media={getVendorMedia(vendor.id, vendors)} />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {category === "all" ? "All Vendors" : CATEGORY_LABELS[category as VendorCategory]} ({(featured.length + regular.length)})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {regular.map((vendor, i) => (
              <VendorCard key={vendor.id} vendor={vendor} index={i} isFav={isFavorite(vendor.id)} onToggleFav={() => toggleFavorite(vendor.id)} media={getVendorMedia(vendor.id, vendors)} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16"><p className="text-muted-foreground">No vendors match your search.</p></div>
          )}
        </section>
      </div>
    </div>
  );
}

function VendorCard({ vendor, index, isFav, onToggleFav, featured, media = [] }: {
  vendor: Vendor;
  index: number;
  isFav: boolean;
  onToggleFav: () => void;
  featured?: boolean;
  media?: MediaItem[];
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className={`rounded-2xl overflow-hidden border-border/50 hover:shadow-lg transition-all group ${featured ? "border-accent/20 shadow-md" : ""}`}>
        <div className="h-36 relative">
          {media.length > 0 ? (
            <MediaPreview media={media} className="h-full" />
          ) : (
            <div className={`h-full ${featured ? "bg-gradient-to-br from-accent/20 to-accent/5" : "bg-muted"} flex items-center justify-center`}>
              <span className="text-4xl font-display font-bold text-muted-foreground/20">{vendor.name[0]}</span>
            </div>
          )}
          {featured && (
            <Badge className="absolute top-2 left-2 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-[9px] rounded-full border-0 z-10">⭐ Featured</Badge>
          )}
          <button onClick={(e) => { e.preventDefault(); onToggleFav(); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center hover:bg-background/80 transition-colors z-10">
            <Heart className={`h-3.5 w-3.5 transition-colors ${isFav ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-display font-semibold text-sm truncate">{vendor.name}</h3>
                {vendor.verified && <BadgeCheck className="h-3.5 w-3.5 text-accent shrink-0" />}
              </div>
              <p className="text-[10px] text-accent">{CATEGORY_LABELS[vendor.category]}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{vendor.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-accent text-accent" />
              <span className="text-xs font-medium">{vendor.rating}</span>
              <span className="text-[10px] text-muted-foreground">({vendor.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="h-2.5 w-2.5" />{vendor.location}
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {vendor.services.slice(0, 2).map((s) => (
              <Badge key={s.id} variant="secondary" className="text-[9px] rounded-full">{s.title}</Badge>
            ))}
          </div>
          <Link to={`/vendors/${vendor.id}`}>
            <Button variant="gold-outline" size="sm" className="w-full rounded-xl text-xs mt-1">View Profile</Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}
