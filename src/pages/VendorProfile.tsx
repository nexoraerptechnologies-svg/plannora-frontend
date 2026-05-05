import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, BadgeCheck, Heart, ArrowLeft, MessageCircle, Tag, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useVendors, CATEGORY_LABELS } from "@/context/VendorContext";
import { MediaGalleryManager, MediaPreview } from "@/components/vendor/MediaGallery";
import { MOCK_SERVICE_MEDIA, VENDOR_GALLERY, MediaItem } from "@/lib/vendorMedia";
import { toast } from "sonner";

export default function VendorProfile() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const { getVendor, toggleFavorite, isFavorite, sendMessage, reviews } = useVendors();
  const vendor = getVendor(vendorId || "");
  const [contactOpen, setContactOpen] = useState(false);
  const [msg, setMsg] = useState("Hello, I'm interested in your services for my event.");

  if (!vendor) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="max-w-md w-full rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-display">Vendor Not Found</h1>
          <p className="text-muted-foreground mt-2 text-sm">This vendor page doesn't exist.</p>
          <Link to="/vendors"><Button variant="gold" className="mt-4 rounded-xl">Back to Marketplace</Button></Link>
        </Card>
      </div>
    );
  }

  const handleSend = () => {
    sendMessage(vendor.id, msg);
    setContactOpen(false);
    toast.success("Message sent to " + vendor.name);
  };

  const fav = isFavorite(vendor.id);
  const allMedia: MediaItem[] = vendor.services.flatMap((s) => MOCK_SERVICE_MEDIA[s.id] || []);
  const vendorReviews = reviews.filter((r) => r.vendorId === vendor.id);
  const coverImage = VENDOR_GALLERY[vendor.id]?.[0];

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 flex items-center gap-3">
            <Link to="/vendors" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft className="h-4 w-4" /></Link>
            <span className="text-sm font-medium truncate">{vendor.name}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Cover */}
        <div className="h-48 sm:h-64 rounded-2xl overflow-hidden relative">
          {coverImage ? (
            <>
              <img src={coverImage} alt={vendor.name} className="w-full h-full object-cover" width={800} height={600} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </>
          ) : (
            <div className={`h-full ${vendor.featured ? "bg-gradient-to-br from-accent/20 via-accent/10 to-background" : "bg-muted"} flex items-center justify-center`}>
              <span className="text-8xl font-display font-bold text-muted-foreground/10">{vendor.name[0]}</span>
            </div>
          )}
          {vendor.featured && (
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-[10px] rounded-full border-0">⭐ Featured Vendor</Badge>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col sm:flex-row gap-6 sm:items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-display font-semibold">{vendor.name}</h1>
              {vendor.verified && <BadgeCheck className="h-5 w-5 text-accent" />}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="secondary" className="rounded-full text-xs">{CATEGORY_LABELS[vendor.category]}</Badge>
              <span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-accent text-accent" /> {vendor.rating} <span className="text-muted-foreground text-xs">({vendor.reviewCount} reviews)</span></span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {vendor.location}</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-2xl">{vendor.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant={fav ? "destructive" : "outline"} size="sm" className="rounded-xl gap-1.5" onClick={() => toggleFavorite(vendor.id)}>
              <Heart className={`h-3.5 w-3.5 ${fav ? "fill-current" : ""}`} />{fav ? "Saved" : "Save"}
            </Button>
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button variant="gold" size="sm" className="rounded-xl gap-1.5"><MessageCircle className="h-3.5 w-3.5" /> Contact</Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl">
                <DialogHeader><DialogTitle className="font-display">Contact {vendor.name}</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <Textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} className="rounded-xl" />
                  <Button variant="gold" className="w-full rounded-xl" onClick={handleSend}>Send Message</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Gallery */}
        {allMedia.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-display font-semibold">Gallery</h2>
            <MediaGalleryManager media={allMedia} onUpdate={() => {}} readOnly />
          </section>
        )}

        {/* Services */}
        <section className="space-y-4">
          <h2 className="text-lg font-display font-semibold">Services & Packages</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {vendor.services.map((service, i) => {
              const serviceMedia = MOCK_SERVICE_MEDIA[service.id] || [];
              return (
                <motion.div key={service.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="rounded-2xl border-border/50 overflow-hidden hover:shadow-md transition-all">
                    {serviceMedia.length > 0 ? (
                      <MediaPreview media={serviceMedia} className="h-32" />
                    ) : (
                      <div className="h-32 bg-muted flex items-center justify-center">
                        <span className="text-2xl font-display font-bold text-muted-foreground/10">{service.title[0]}</span>
                      </div>
                    )}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-display font-semibold text-sm">{service.title}</h3>
                        {service.price && <span className="text-accent font-semibold text-sm shrink-0">${service.price.toLocaleString()}</span>}
                      </div>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                      {/* Packages */}
                      {service.packages && service.packages.length > 0 && (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Packages</p>
                          {service.packages.map((pkg) => (
                            <div key={pkg.id} className="flex items-center justify-between text-xs bg-muted/30 rounded-lg px-3 py-1.5">
                              <span className="font-medium">{pkg.name}</span>
                              <span className="text-accent font-semibold">${pkg.price.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-1.5 flex-wrap">
                        {service.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[9px] rounded-full border-border/50 gap-0.5"><Tag className="h-2 w-2" /> {tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Testimonials */}
        {vendor.testimonials && vendor.testimonials.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2"><Quote className="h-4 w-4 text-accent" /> Testimonials</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {vendor.testimonials.map((t, i) => (
                <Card key={i} className="rounded-2xl border-border/50 p-5">
                  <p className="text-sm text-muted-foreground italic">"{t}"</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {vendorReviews.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-display font-semibold">Reviews ({vendorReviews.length})</h2>
            <div className="space-y-3">
              {vendorReviews.map((review) => (
                <Card key={review.id} className="rounded-2xl border-border/50 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-semibold text-accent">
                        {review.reviewerName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{review.reviewerName}</p>
                        <p className="text-[10px] text-muted-foreground">{review.eventName} · {review.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-accent text-accent" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.comment}</p>
                  {review.reply && (
                    <div className="bg-muted/30 rounded-xl p-3 ml-6">
                      <p className="text-[10px] text-accent font-medium mb-0.5">Vendor Reply</p>
                      <p className="text-xs text-muted-foreground">{review.reply}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
