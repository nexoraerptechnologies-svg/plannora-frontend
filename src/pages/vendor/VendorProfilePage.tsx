import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, BadgeCheck, Eye, ImageIcon, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVendors, CATEGORY_LABELS } from "@/context/VendorContext";
import { MediaGalleryManager } from "@/components/vendor/MediaGallery";
import { MOCK_SERVICE_MEDIA, VENDOR_GALLERY, MediaItem } from "@/lib/vendorMedia";
import { toast } from "sonner";

export default function VendorProfilePage() {
  const { myVendor, updateVendorProfile } = useVendors();
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    name: myVendor.name,
    description: myVendor.description,
    location: myVendor.location,
    contactEmail: myVendor.contactEmail,
    contactPhone: myVendor.contactPhone,
  });

  // Aggregate all service media for the profile gallery
  const allMedia: MediaItem[] = Object.values(MOCK_SERVICE_MEDIA).flat();
  const [profileGallery, setProfileGallery] = useState<MediaItem[]>(allMedia);

  const handleSave = () => {
    updateVendorProfile(form);
    toast.success("Profile updated");
  };

  if (preview) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display font-semibold">Profile Preview</h1>
          <Button variant="outline" className="rounded-xl text-xs" onClick={() => setPreview(false)}>← Back to Edit</Button>
        </div>
        <Card className="rounded-2xl border-border/50 overflow-hidden">
          {/* Cover with real image */}
          <div className="h-48 relative overflow-hidden">
            {VENDOR_GALLERY["v-001"]?.[0] ? (
              <img src={VENDOR_GALLERY["v-001"][0]} alt="Cover" className="w-full h-full object-cover" width={800} height={600} />
            ) : (
              <div className="h-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                <span className="text-6xl font-display font-bold text-muted-foreground/10">{myVendor.name[0]}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-display font-semibold">{form.name}</h2>
              {myVendor.verified && <BadgeCheck className="h-5 w-5 text-accent" />}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary" className="rounded-full text-xs">{CATEGORY_LABELS[myVendor.category]}</Badge>
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{myVendor.rating} ({myVendor.reviewCount})</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{form.location}</span>
            </div>
            <p className="text-sm text-muted-foreground">{form.description}</p>

            {/* Testimonials */}
            {myVendor.testimonials && myVendor.testimonials.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/30">
                <p className="text-xs font-medium flex items-center gap-1"><Quote className="h-3 w-3 text-accent" /> Testimonials</p>
                {myVendor.testimonials.map((t, i) => (
                  <p key={i} className="text-xs text-muted-foreground italic pl-4 border-l-2 border-accent/20">"{t}"</p>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Preview Gallery */}
        <Card className="rounded-2xl border-border/50 p-5">
          <h3 className="font-display font-semibold text-sm mb-3">Gallery</h3>
          <MediaGalleryManager media={profileGallery} onUpdate={() => {}} readOnly />
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your public business profile.</p>
        </div>
        <Button variant="outline" className="rounded-xl text-xs gap-1.5" onClick={() => setPreview(true)}>
          <Eye className="h-3.5 w-3.5" /> View as Client
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="rounded-xl">
          <TabsTrigger value="info" className="rounded-lg text-xs">Business Info</TabsTrigger>
          <TabsTrigger value="gallery" className="rounded-lg text-xs">Gallery ({profileGallery.length})</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg text-xs">Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="rounded-2xl border-border/50 p-6 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs">Business Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Location</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Input value={CATEGORY_LABELS[myVendor.category]} disabled className="rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Contact Email</Label>
                <Input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="rounded-xl" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="gold" className="rounded-xl" onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="gallery">
          <Card className="rounded-2xl border-border/50 p-6">
            <MediaGalleryManager media={profileGallery} onUpdate={setProfileGallery} maxImages={20} />
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card className="rounded-2xl border-border/50 p-5">
            <h3 className="font-display font-semibold text-sm mb-3">Profile Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-display font-semibold">{myVendor.rating}</p><p className="text-[10px] text-muted-foreground">Rating</p></div>
              <div><p className="text-2xl font-display font-semibold">{myVendor.reviewCount}</p><p className="text-[10px] text-muted-foreground">Reviews</p></div>
              <div><p className="text-2xl font-display font-semibold">{myVendor.services.length}</p><p className="text-[10px] text-muted-foreground">Services</p></div>
            </div>
          </Card>
          <Card className="rounded-2xl border-border/50 p-5 mt-4">
            <h3 className="font-display font-semibold text-sm mb-3">Media Analytics</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div><p className="text-2xl font-display font-semibold">{profileGallery.length}</p><p className="text-[10px] text-muted-foreground">Total Media</p></div>
              <div><p className="text-2xl font-display font-semibold">{profileGallery.reduce((a, m) => a + m.views, 0)}</p><p className="text-[10px] text-muted-foreground">Total Views</p></div>
              <div><p className="text-2xl font-display font-semibold">{profileGallery.reduce((a, m) => a + m.engagement, 0)}</p><p className="text-[10px] text-muted-foreground">Engagements</p></div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
