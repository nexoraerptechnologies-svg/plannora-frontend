import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, Search, Filter, Star, MapPin, MessageCircle, CheckCircle, Clock, X, Send, Heart, Eye, CalendarDays, DollarSign, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useBookings } from "@/context/BookingContext";
import { toast } from "sonner";

interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  price: string;
  services: string[];
  verified: boolean;
  image?: string;
}

interface MyVendor {
  vendorId: string;
  name: string;
  category: string;
  status: "contacted" | "negotiating" | "confirmed";
  lastMessage: string;
  lastMessageTime: string;
}

const allVendors: Vendor[] = [
  { id: "v1", name: "Hacienda Los Robles", category: "Venue", location: "Guadalajara", rating: 4.9, reviews: 127, price: "$$$", services: ["Venue", "Catering", "Parking"], verified: true },
  { id: "v2", name: "DJ Elektra", category: "Music", location: "Mexico City", rating: 4.8, reviews: 89, price: "$$", services: ["DJ", "Sound", "Lighting"], verified: true },
  { id: "v3", name: "Flores Elegantes", category: "Florals", location: "Guadalajara", rating: 4.7, reviews: 64, price: "$$", services: ["Bouquets", "Centerpieces", "Decoration"], verified: false },
  { id: "v4", name: "Chef Antonio Catering", category: "Catering", location: "Monterrey", rating: 4.9, reviews: 156, price: "$$$", services: ["Full Menu", "Cocktails", "Desserts"], verified: true },
  { id: "v5", name: "Foto Premium Studio", category: "Photography", location: "Mexico City", rating: 4.6, reviews: 43, price: "$$", services: ["Photography", "Video", "Drone"], verified: true },
  { id: "v6", name: "Sweet Dreams Bakery", category: "Cake", location: "Guadalajara", rating: 4.8, reviews: 78, price: "$", services: ["Wedding Cake", "Cupcakes", "Dessert Table"], verified: false },
  { id: "v7", name: "Party Lights MX", category: "Lighting", location: "Mexico City", rating: 4.5, reviews: 31, price: "$$", services: ["Ambient Lighting", "LED", "Projection"], verified: false },
  { id: "v8", name: "Mariachi Real", category: "Music", location: "Guadalajara", rating: 4.9, reviews: 201, price: "$$", services: ["Mariachi", "Live Music", "Ceremony Music"], verified: true },
];

const initialMyVendors: MyVendor[] = [
  { vendorId: "v1", name: "Hacienda Los Robles", category: "Venue", status: "confirmed", lastMessage: "Everything is set for April 30!", lastMessageTime: "2 hours ago" },
  { vendorId: "v2", name: "DJ Elektra", category: "Music", status: "confirmed", lastMessage: "Song list approved. See you there!", lastMessageTime: "1 day ago" },
  { vendorId: "v3", name: "Flores Elegantes", category: "Florals", status: "negotiating", lastMessage: "Updated quote for centerpieces sent.", lastMessageTime: "3 hours ago" },
  { vendorId: "v4", name: "Chef Antonio Catering", category: "Catering", status: "confirmed", lastMessage: "Final menu confirmed.", lastMessageTime: "5 hours ago" },
  { vendorId: "v5", name: "Foto Premium Studio", category: "Photography", status: "contacted", lastMessage: "Hi! I'd love to discuss packages.", lastMessageTime: "1 day ago" },
];

const categories = ["All", "Venue", "Music", "Florals", "Catering", "Photography", "Cake", "Lighting"];

const statusConfig: Record<string, { color: string; label: string }> = {
  contacted: { color: "text-accent border-accent/30 bg-accent/5", label: "Contacted" },
  negotiating: { color: "text-[hsl(30,90%,55%)] border-[hsl(30,90%,55%)]/30 bg-[hsl(30,90%,55%)]/5", label: "Negotiating" },
  confirmed: { color: "text-[hsl(var(--success))] border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5", label: "Confirmed" },
};

export default function HostVendors() {
  const [myVendors, setMyVendors] = useState<MyVendor[]>(initialMyVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatVendor, setChatVendor] = useState<{ id: string; name: string } | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ text: string; from: "host" | "vendor"; time: string }[]>([]);

  const filteredVendors = allVendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "All" || v.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const isMyVendor = (id: string) => myVendors.some((mv) => mv.vendorId === id);

  // Booking request state
  const { createBooking } = useBookings();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingVendor, setBookingVendor] = useState<Vendor | null>(null);
  const [bookingForm, setBookingForm] = useState({ serviceType: "", eventDate: "2026-04-30", estimatedBudget: "", notes: "" });

  const handleContact = (vendor: Vendor) => {
    setChatVendor({ id: vendor.id, name: vendor.name });
    setChatMessages([
      { text: `Hi ${vendor.name}! I'm planning a wedding on April 30 and I'm interested in your services.`, from: "host", time: "Just now" },
    ]);
    setChatOpen(true);
  };

  const handleRequestService = (vendor: Vendor) => {
    setBookingVendor(vendor);
    setBookingForm({ serviceType: vendor.services[0] || "", eventDate: "2026-04-30", estimatedBudget: "", notes: "" });
    setBookingOpen(true);
  };

  const handleSubmitBooking = () => {
    if (!bookingVendor || !bookingForm.serviceType) return;
    createBooking({
      vendorId: bookingVendor.id,
      vendorName: bookingVendor.name,
      vendorCategory: bookingVendor.category,
      serviceType: bookingForm.serviceType,
      eventDate: bookingForm.eventDate,
      estimatedBudget: Number(bookingForm.estimatedBudget) || 0,
      notes: bookingForm.notes,
    });
    // Also add to My Vendors
    if (!isMyVendor(bookingVendor.id)) {
      setMyVendors((prev) => [...prev, {
        vendorId: bookingVendor.id, name: bookingVendor.name, category: bookingVendor.category,
        status: "contacted", lastMessage: `Booking request: ${bookingForm.serviceType}`, lastMessageTime: "Just now",
      }]);
    }
    setBookingOpen(false);
    toast.success(`Booking request sent to ${bookingVendor.name}!`);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || !chatVendor) return;
    setChatMessages((prev) => [...prev, { text: chatMessage, from: "host", time: "Just now" }]);
    setChatMessage("");

    // Add to My Vendors if not already
    if (!isMyVendor(chatVendor.id)) {
      const vendor = allVendors.find((v) => v.id === chatVendor.id);
      if (vendor) {
        setMyVendors((prev) => [...prev, {
          vendorId: vendor.id, name: vendor.name, category: vendor.category,
          status: "contacted", lastMessage: chatMessage, lastMessageTime: "Just now",
        }]);
        toast.success(`${vendor.name} added to My Vendors`);
      }
    }

    // Simulate vendor reply
    setTimeout(() => {
      setChatMessages((prev) => [...prev, {
        text: "Thanks for reaching out! I'd love to help with your event. Let me send you our packages.",
        from: "vendor", time: "Just now",
      }]);
    }, 1500);
  };

  const handleRemoveVendor = (vendorId: string) => {
    setMyVendors((prev) => prev.filter((v) => v.vendorId !== vendorId));
    toast.success("Vendor removed from your event team");
  };

  const handleOpenChat = (mv: MyVendor) => {
    setChatVendor({ id: mv.vendorId, name: mv.name });
    setChatMessages([
      { text: mv.lastMessage, from: "vendor", time: mv.lastMessageTime },
    ]);
    setChatOpen(true);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Vendors</h1>
        <p className="text-muted-foreground mt-1">Build your event team by discovering and managing vendors.</p>
      </div>

      <Tabs defaultValue="my-vendors" className="w-full">
        <TabsList className="rounded-xl bg-muted/30 p-1">
          <TabsTrigger value="my-vendors" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Heart className="h-4 w-4 mr-2" /> My Vendors ({myVendors.length})
          </TabsTrigger>
          <TabsTrigger value="discover" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Store className="h-4 w-4 mr-2" /> Discover
          </TabsTrigger>
        </TabsList>

        {/* MY VENDORS */}
        <TabsContent value="my-vendors" className="mt-6">
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 mb-6">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const count = myVendors.filter((v) => v.status === key).length;
              return (
                <Card key={key} className="rounded-2xl border-border/50 p-4">
                  <p className="text-2xl font-display font-bold">{count}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{cfg.label}</p>
                </Card>
              );
            })}
          </div>

          {myVendors.length === 0 ? (
            <Card className="rounded-2xl border-border/50 p-12 text-center">
              <Store className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold mb-1">No vendors yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Discover and contact vendors to start building your event team.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {myVendors.map((mv) => (
                <Card key={mv.vendorId} className="rounded-2xl border-border/50 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-lg font-bold text-accent shrink-0">
                      {mv.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium truncate">{mv.name}</p>
                        <Badge variant="outline" className={`text-[10px] rounded-full ${statusConfig[mv.status].color}`}>
                          {statusConfig[mv.status].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{mv.category}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1 truncate">"{mv.lastMessage}"</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="gold-outline" size="sm" className="rounded-xl text-xs" onClick={() => handleOpenChat(mv)}>
                        <MessageCircle className="h-3.5 w-3.5 mr-1" /> Chat
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive" onClick={() => handleRemoveVendor(mv.vendorId)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* DISCOVER */}
        <TabsContent value="discover" className="mt-6 space-y-4">
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search vendors..." className="pl-9 rounded-xl" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px] rounded-xl">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVendors.map((vendor) => {
              const added = isMyVendor(vendor.id);
              return (
                <Card key={vendor.id} className="rounded-2xl border-border/50 hover:shadow-lg transition-all overflow-hidden group">
                  <div className="aspect-[16/9] bg-muted/30 flex items-center justify-center relative">
                    <Store className="h-10 w-10 text-muted-foreground/15" />
                    {vendor.verified && (
                      <Badge className="absolute top-2 right-2 text-[9px] rounded-full bg-accent text-accent-foreground border-0">
                        <CheckCircle className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                    {added && (
                      <Badge className="absolute top-2 left-2 text-[9px] rounded-full bg-[hsl(var(--success))] text-[hsl(var(--success-foreground,0,0%,100%))] border-0">
                        <Heart className="h-3 w-3 mr-1" /> In Team
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display font-semibold text-sm truncate">{vendor.name}</h3>
                        <span className="text-xs text-muted-foreground">{vendor.price}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {vendor.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                      <span className="text-xs text-muted-foreground">({vendor.reviews})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {vendor.services.map((s) => (
                        <Badge key={s} variant="outline" className="text-[9px] rounded-full">{s}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Button variant="gold" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => handleRequestService(vendor)}>
                        <CalendarDays className="h-3.5 w-3.5 mr-1" /> Request Service
                      </Button>
                      <Button variant="gold-outline" size="sm" className="rounded-xl text-xs" onClick={() => handleContact(vendor)}>
                        <MessageCircle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              {chatVendor?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-64 overflow-y-auto py-2">
            <AnimatePresence>
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.from === "host" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.from === "host"
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted"
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.from === "host" ? "text-accent-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              className="rounded-xl resize-none min-h-[40px] max-h-[80px]"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
            />
            <Button variant="gold" size="icon" className="rounded-xl shrink-0" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Booking Request Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-accent" />
              Request Service — {bookingVendor?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Service Type</Label>
              <Select value={bookingForm.serviceType} onValueChange={(v) => setBookingForm((p) => ({ ...p, serviceType: v }))}>
                <SelectTrigger className="rounded-xl mt-1">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {bookingVendor?.services.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Event Date</Label>
              <Input type="date" className="rounded-xl mt-1" value={bookingForm.eventDate} onChange={(e) => setBookingForm((p) => ({ ...p, eventDate: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Estimated Budget (USD)</Label>
              <Input type="number" className="rounded-xl mt-1" placeholder="e.g. 15000" value={bookingForm.estimatedBudget} onChange={(e) => setBookingForm((p) => ({ ...p, estimatedBudget: e.target.value }))} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Notes / Message</Label>
              <Textarea className="rounded-xl mt-1 resize-none" placeholder="Tell the vendor about your event and requirements..." value={bookingForm.notes} onChange={(e) => setBookingForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
            <div className="bg-muted/30 rounded-xl p-3 text-xs text-muted-foreground flex items-start gap-2">
              <DollarSign className="h-4 w-4 shrink-0 mt-0.5" />
              <p>Payments are handled directly between you and the vendor. Planora only facilitates coordination.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl" onClick={() => setBookingOpen(false)}>Cancel</Button>
            <Button variant="gold" className="rounded-xl" onClick={handleSubmitBooking}>
              <Send className="h-4 w-4 mr-2" /> Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
