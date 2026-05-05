import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, MessageCircle, Send, X, Clock, CheckCircle, AlertCircle,
  XCircle, FileText, Bell, Info, Filter,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBookings, BookingRequest, BookingStatus } from "@/context/BookingContext";
import { toast } from "sonner";

const STATUS_CONFIG: Record<BookingStatus, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-accent border-accent/30 bg-accent/5", label: "Pending" },
  negotiating: { icon: MessageCircle, color: "text-[hsl(30,90%,55%)] border-[hsl(30,90%,55%)]/30 bg-[hsl(30,90%,55%)]/5", label: "Negotiating" },
  confirmed: { icon: CheckCircle, color: "text-[hsl(var(--success))] border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5", label: "Confirmed" },
  cancelled: { icon: XCircle, color: "text-destructive border-destructive/30 bg-destructive/5", label: "Cancelled" },
};

export default function VendorBookings() {
  const { bookings, cancelBooking, sendBookingMessage, updateBookingStatus } = useBookings();
  const [chatOpen, setChatOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<BookingRequest | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = filterStatus === "all" ? bookings : bookings.filter((b) => b.status === filterStatus);
  const stats = {
    pending: bookings.filter((b) => b.status === "pending").length,
    negotiating: bookings.filter((b) => b.status === "negotiating").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const openChat = (booking: BookingRequest) => {
    setActiveBooking(booking);
    setChatOpen(true);
  };

  const handleSend = () => {
    if (!chatMsg.trim() || !activeBooking) return;
    sendBookingMessage(activeBooking.id, chatMsg, "host");
    setChatMsg("");
    // Simulate vendor reply
    setTimeout(() => {
      sendBookingMessage(activeBooking.id, "Thanks for your message! I'll review and get back to you shortly.", "vendor");
    }, 1500);
  };

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast.success("Booking cancelled");
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

  // Refresh activeBooking from state
  const liveBooking = activeBooking ? bookings.find((b) => b.id === activeBooking.id) || activeBooking : null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">My Bookings</h1>
        <p className="text-muted-foreground mt-1">Track and manage all your vendor service bookings.</p>
      </div>

      {/* Payment disclaimer */}
      <Card className="rounded-2xl border-accent/20 bg-accent/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium">Payments are handled directly between you and the vendor</p>
            <p className="text-xs text-muted-foreground mt-0.5">Planora facilitates coordination and booking only. All financial transactions occur outside the platform.</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {(Object.entries(STATUS_CONFIG) as [BookingStatus, typeof STATUS_CONFIG[BookingStatus]][]).map(([key, cfg]) => (
          <Card key={key} className="rounded-2xl border-border/50 p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus(key === filterStatus ? "all" : key)}>
            <div className="flex items-center gap-2 mb-1">
              <cfg.icon className={`h-4 w-4 ${cfg.color.split(" ")[0]}`} />
              <p className="text-2xl font-display font-bold">{stats[key]}</p>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{cfg.label}</p>
          </Card>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px] rounded-xl">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bookings</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookings list */}
      {filtered.length === 0 ? (
        <Card className="rounded-2xl border-border/50 p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold mb-1">No bookings found</h3>
          <p className="text-sm text-muted-foreground">Go to Vendors to request services for your event.</p>
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Card className="rounded-2xl border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Vendor</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((booking) => {
                    const cfg = STATUS_CONFIG[booking.status];
                    return (
                      <TableRow key={booking.id} className="hover:bg-muted/20">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                              {booking.vendorName[0]}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{booking.vendorName}</p>
                              <p className="text-xs text-muted-foreground">{booking.vendorCategory}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{booking.serviceType}</TableCell>
                        <TableCell className="text-sm">{booking.eventDate}</TableCell>
                        <TableCell className="text-sm font-medium">{formatCurrency(booking.estimatedBudget)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] rounded-full ${cfg.color}`}>
                            <cfg.icon className="h-3 w-3 mr-1" /> {cfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button variant="gold-outline" size="sm" className="rounded-xl text-xs" onClick={() => openChat(booking)}>
                              <MessageCircle className="h-3.5 w-3.5 mr-1" /> Chat
                            </Button>
                            {booking.status !== "cancelled" && booking.status !== "confirmed" && (
                              <Button variant="ghost" size="sm" className="rounded-xl text-xs text-destructive hover:text-destructive" onClick={() => handleCancel(booking.id)}>
                                <X className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((booking) => {
              const cfg = STATUS_CONFIG[booking.status];
              return (
                <Card key={booking.id} className="rounded-2xl border-border/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                          {booking.vendorName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.vendorName}</p>
                          <p className="text-xs text-muted-foreground">{booking.vendorCategory}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-muted-foreground">Service:</span> {booking.serviceType}</div>
                      <div><span className="text-muted-foreground">Date:</span> {booking.eventDate}</div>
                      <div><span className="text-muted-foreground">Budget:</span> {formatCurrency(booking.estimatedBudget)}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="gold-outline" size="sm" className="flex-1 rounded-xl text-xs" onClick={() => openChat(booking)}>
                        <MessageCircle className="h-3.5 w-3.5 mr-1" /> Chat
                      </Button>
                      {booking.status !== "cancelled" && booking.status !== "confirmed" && (
                        <Button variant="ghost" size="sm" className="rounded-xl text-xs text-destructive" onClick={() => handleCancel(booking.id)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* Booking timeline */}
      <Card className="rounded-2xl border-border/50">
        <CardContent className="p-6">
          <h3 className="font-display font-semibold mb-4">Booking Process</h3>
          <div className="flex items-center gap-0">
            {[
              { label: "Request Sent", icon: Send, desc: "Submit your booking request" },
              { label: "Negotiation", icon: MessageCircle, desc: "Discuss terms with vendor" },
              { label: "Confirmed", icon: CheckCircle, desc: "Both parties agree" },
              { label: "Event Day", icon: CalendarDays, desc: "Service is delivered" },
            ].map((step, i) => (
              <div key={step.label} className="flex-1 flex flex-col items-center text-center relative">
                {i > 0 && <div className="absolute left-0 top-5 w-1/2 h-0.5 bg-border -translate-x-1/2" />}
                {i < 3 && <div className="absolute right-0 top-5 w-1/2 h-0.5 bg-border translate-x-1/2" />}
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2 relative z-10">
                  <step.icon className="h-4 w-4 text-accent" />
                </div>
                <p className="text-xs font-medium">{step.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">{step.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              {liveBooking?.vendorName}
              {liveBooking && (
                <Badge variant="outline" className={`text-[9px] rounded-full ml-auto ${STATUS_CONFIG[liveBooking.status].color}`}>
                  {STATUS_CONFIG[liveBooking.status].label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {liveBooking && (
            <div className="bg-muted/30 rounded-xl p-3 text-xs space-y-1">
              <p><span className="text-muted-foreground">Service:</span> {liveBooking.serviceType}</p>
              <p><span className="text-muted-foreground">Date:</span> {liveBooking.eventDate}</p>
              <p><span className="text-muted-foreground">Budget:</span> {formatCurrency(liveBooking.estimatedBudget)}</p>
            </div>
          )}

          <div className="space-y-3 max-h-64 overflow-y-auto py-2">
            <AnimatePresence>
              {liveBooking?.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "host" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "host" ? "bg-accent text-accent-foreground" : "bg-muted"
                  }`}>
                    <p>{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === "host" ? "text-accent-foreground/60" : "text-muted-foreground"}`}>{msg.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder="Type a message..."
              className="rounded-xl resize-none min-h-[40px] max-h-[80px]"
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            />
            <Button variant="gold" size="icon" className="rounded-xl shrink-0" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
