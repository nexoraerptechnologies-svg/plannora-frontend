import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Tag, ImageIcon, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVendors, CATEGORY_LABELS, VendorCategory, VendorService } from "@/context/VendorContext";
import { MediaGalleryManager, MediaPreview } from "@/components/vendor/MediaGallery";
import { MOCK_SERVICE_MEDIA, MediaItem } from "@/lib/vendorMedia";
import { toast } from "sonner";

const emptyForm = { title: "", description: "", price: "", category: "venue" as VendorCategory, tags: "" };

export default function VendorServices() {
  const { myVendor, addService, updateService, deleteService } = useVendors();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceMedia, setServiceMedia] = useState<Record<string, MediaItem[]>>(MOCK_SERVICE_MEDIA);

  const openNew = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (s: VendorService) => {
    setEditId(s.id);
    setForm({ title: s.title, description: s.description, price: s.price?.toString() || "", category: s.category, tags: s.tags.join(", ") });
    setDialogOpen(true);
  };
  const openMedia = (serviceId: string) => { setSelectedServiceId(serviceId); setMediaDialogOpen(true); };

  const handleSave = () => {
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (editId) {
      updateService(editId, { title: form.title, description: form.description, price: form.price ? Number(form.price) : null, category: form.category, tags });
      toast.success("Service updated");
    } else {
      addService({ title: form.title, description: form.description, price: form.price ? Number(form.price) : null, category: form.category, images: [], tags });
      toast.success("Service created");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => { deleteService(id); toast.success("Service deleted"); };

  const getMedia = (serviceId: string): MediaItem[] => serviceMedia[serviceId] || [];
  const getCover = (serviceId: string): MediaItem | undefined => getMedia(serviceId).find((m) => m.isCover) || getMedia(serviceId)[0];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold">My Services</h1>
          <p className="text-muted-foreground mt-1">Manage your service offerings and media.</p>
        </div>
        <Button variant="gold" className="rounded-2xl gap-1.5" onClick={openNew}>
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {myVendor.services.map((service, i) => {
            const media = getMedia(service.id);
            const cover = getCover(service.id);
            return (
              <motion.div key={service.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                <Card className="rounded-2xl border-border/50 overflow-hidden hover:shadow-md transition-all">
                  {/* Media preview */}
                  {media.length > 0 ? (
                    <MediaPreview media={media} className="h-36" />
                  ) : (
                    <div className="h-36 bg-muted flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                        <p className="text-[10px] text-muted-foreground mt-1">No photos yet</p>
                      </div>
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-display font-semibold">{service.title}</h3>
                        <Badge variant="secondary" className="text-[9px] rounded-full mt-1">{CATEGORY_LABELS[service.category]}</Badge>
                      </div>
                      {service.price && <span className="text-accent font-display font-semibold">${service.price.toLocaleString()}</span>}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                    <div className="flex gap-1 flex-wrap">
                      {service.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[9px] rounded-full border-border/50 gap-0.5">
                          <Tag className="h-2 w-2" /> {tag}
                        </Badge>
                      ))}
                    </div>
                    {/* Packages preview */}
                    {service.packages && service.packages.length > 0 && (
                      <div className="flex gap-1.5">
                        {service.packages.map((pkg) => (
                          <Badge key={pkg.id} variant="outline" className="text-[8px] rounded-full border-accent/20 text-accent">
                            {pkg.name} · ${pkg.price.toLocaleString()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1 flex-1" onClick={() => openMedia(service.id)}>
                        <ImageIcon className="h-3 w-3" /> Media ({media.length})
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1 flex-1" onClick={() => openEdit(service)}>
                        <Pencil className="h-3 w-3" /> Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl text-xs text-destructive" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {myVendor.services.length === 0 && (
        <Card className="rounded-2xl border-border/50 p-12 text-center">
          <p className="text-muted-foreground">No services yet. Click "Add Service" to create your first offering.</p>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">{editId ? "Edit Service" : "New Service"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Service Name</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-xl" placeholder="e.g. Wedding DJ Package" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl" rows={3} placeholder="Describe your service..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Price (MXN)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-xl" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as VendorCategory })}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Tags (comma separated)</Label>
              <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="rounded-xl" placeholder="luxury, outdoor, wedding" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="gold" className="flex-1 rounded-xl" onClick={handleSave} disabled={!form.title}>Save Service</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Media Manager Dialog */}
      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent className="rounded-2xl max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              Media Manager — {myVendor.services.find((s) => s.id === selectedServiceId)?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedServiceId && (
            <Tabs defaultValue="gallery" className="mt-2">
              <TabsList className="rounded-xl">
                <TabsTrigger value="gallery" className="rounded-lg text-xs">Gallery</TabsTrigger>
                <TabsTrigger value="analytics" className="rounded-lg text-xs">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="gallery" className="mt-4">
                <MediaGalleryManager
                  media={getMedia(selectedServiceId)}
                  onUpdate={(updated) => setServiceMedia({ ...serviceMedia, [selectedServiceId]: updated })}
                />
              </TabsContent>
              <TabsContent value="analytics" className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Total Views", value: getMedia(selectedServiceId).reduce((a, m) => a + m.views, 0) },
                    { label: "Engagement", value: getMedia(selectedServiceId).reduce((a, m) => a + m.engagement, 0) },
                    { label: "Avg per Image", value: getMedia(selectedServiceId).length > 0 ? Math.round(getMedia(selectedServiceId).reduce((a, m) => a + m.views, 0) / getMedia(selectedServiceId).length) : 0 },
                  ].map((s) => (
                    <Card key={s.label} className="rounded-xl border-border/50 p-4 text-center">
                      <p className="text-2xl font-display font-bold">{s.value}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    </Card>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium">Top Performing Images</p>
                  {[...getMedia(selectedServiceId)].sort((a, b) => b.views - a.views).slice(0, 5).map((img, i) => (
                    <div key={img.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      <img src={img.thumbnail} alt={img.name} className="w-10 h-8 rounded-lg object-cover" loading="lazy" width={40} height={32} />
                      <span className="text-xs flex-1 truncate">{img.name}</span>
                      <span className="text-xs text-muted-foreground">{img.views} views</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
