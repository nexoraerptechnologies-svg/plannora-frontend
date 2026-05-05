import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type VendorCategory = "venue" | "catering" | "drinks" | "decoration" | "music" | "photography" | "planning" | "entertainment";

export const CATEGORY_LABELS: Record<VendorCategory, string> = {
  venue: "Venue",
  catering: "Catering",
  drinks: "Drinks & Bar",
  decoration: "Decoration & Flowers",
  music: "Music & DJ",
  photography: "Photography & Video",
  planning: "Event Planning",
  entertainment: "Entertainment",
};

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal_sent" | "won" | "lost";
export type PipelineStage = "inquiry" | "negotiation" | "proposal_sent" | "confirmed" | "completed";

export interface VendorService {
  id: string;
  title: string;
  description: string;
  price: number | null;
  category: VendorCategory;
  images: string[];
  tags: string[];
  packages?: ServicePackage[];
  extras?: ServiceExtra[];
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  includes: string[];
}

export interface ServiceExtra {
  id: string;
  name: string;
  price: number;
}

export interface Lead {
  id: string;
  organizerName: string;
  eventName: string;
  eventDate: string;
  budget: number | null;
  status: LeadStatus;
  serviceInterest: string;
  createdAt: string;
  conversationId: string | null;
  notes: string;
}

export interface PipelineDeal {
  id: string;
  leadId: string;
  organizerName: string;
  eventName: string;
  eventDate: string;
  stage: PipelineStage;
  value: number;
  serviceTitle: string;
  lastActivity: string;
  proposalSent: boolean;
}

export interface VendorReview {
  id: string;
  vendorId: string;
  reviewerName: string;
  eventName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

export interface AvailabilitySlot {
  date: string;
  available: boolean;
}

export interface VendorNotification {
  id: string;
  type: "inquiry" | "view" | "message" | "review" | "booking";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  description: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  avatar: string;
  coverImage: string;
  services: VendorService[];
  gallery: string[];
  testimonials?: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "vendor" | "organizer";
  timestamp: string;
  type?: "text" | "proposal" | "quote" | "confirmation";
  attachmentName?: string;
}

export interface Conversation {
  id: string;
  vendorId: string;
  organizerName: string;
  organizerAvatar: string;
  eventName: string;
  messages: ChatMessage[];
  unread: number;
}

export interface Message {
  id: string;
  vendorId: string;
  senderName: string;
  eventName: string;
  text: string;
  time: string;
  read: boolean;
}

const MY_VENDOR_ID = "v-001";

const MOCK_VENDORS: Vendor[] = [
  {
    id: "v-001", name: "Hacienda Los Robles", category: "venue",
    description: "A stunning colonial hacienda with lush gardens, elegant ballrooms, and breathtaking sunset views. Perfect for weddings and high-end corporate events.",
    location: "Guadalajara", contactEmail: "info@hacienda.com", contactPhone: "+52 33 1234 5678",
    rating: 4.9, reviewCount: 127, verified: true, featured: true, avatar: "", coverImage: "",
    services: [
      { id: "s-001", title: "Full Venue Rental", description: "Exclusive access to all areas including gardens, ballroom, and terrace. Capacity for up to 300 guests.", price: 45000, category: "venue", images: [], tags: ["luxury", "outdoor", "indoor"],
        packages: [
          { id: "pkg-001", name: "Essential", description: "Venue access for 8 hours", price: 35000, includes: ["Ballroom", "Gardens", "Basic lighting"] },
          { id: "pkg-002", name: "Premium", description: "Full day access with extras", price: 45000, includes: ["Ballroom", "Gardens", "Terrace", "Premium lighting", "Sound system"] },
          { id: "pkg-003", name: "Luxury", description: "Complete experience", price: 65000, includes: ["All areas", "Premium lighting", "Sound system", "Bridal suite", "Valet parking", "Decoration consultation"] },
        ],
        extras: [
          { id: "ext-001", name: "Extra Hour", price: 5000 },
          { id: "ext-002", name: "Fireworks Display", price: 12000 },
          { id: "ext-003", name: "LED Dance Floor", price: 8000 },
        ],
      },
      { id: "s-002", title: "Ceremony Package", description: "Garden ceremony setup with chairs, arch, and floral arrangements.", price: 12000, category: "venue", images: [], tags: ["outdoor", "ceremony"] },
    ],
    gallery: [],
    testimonials: [
      "Hacienda Los Robles made our wedding absolutely magical. Every detail was perfect!",
      "The gardens at sunset were breathtaking. Our guests still talk about the venue.",
      "Professional staff, stunning location. Couldn't have asked for a better venue.",
    ],
  },
  { id: "v-002", name: "Chef Isabella Catering", category: "catering", description: "Award-winning catering service specializing in fusion cuisine.", location: "Mexico City", contactEmail: "chef@isabella.com", contactPhone: "+52 55 9876 5432", rating: 4.8, reviewCount: 94, verified: true, featured: true, avatar: "", coverImage: "", services: [{ id: "s-003", title: "Premium Banquet", description: "5-course plated dinner with premium ingredients.", price: 850, category: "catering", images: [], tags: ["luxury", "plated"] }, { id: "s-004", title: "Cocktail Reception", description: "Elegant passed canapés and stations.", price: 550, category: "catering", images: [], tags: ["cocktail", "casual"] }], gallery: [] },
  { id: "v-003", name: "Sonora Spirits Bar", category: "drinks", description: "Premium mobile bar service featuring craft cocktails and mezcal tastings.", location: "Guadalajara", contactEmail: "bar@sonora.com", contactPhone: "+52 33 5555 1234", rating: 4.7, reviewCount: 68, verified: true, featured: false, avatar: "", coverImage: "", services: [{ id: "s-005", title: "Open Bar Premium", description: "Unlimited premium spirits, wines, and craft cocktails for up to 5 hours.", price: 380, category: "drinks", images: [], tags: ["premium", "unlimited"] }, { id: "s-006", title: "Mezcal Tasting Station", description: "Curated selection of artisanal mezcals with expert guide.", price: 150, category: "drinks", images: [], tags: ["experience", "tasting"] }], gallery: [] },
  { id: "v-004", name: "Bloom & Petal Studio", category: "decoration", description: "Luxury floral design studio creating stunning arrangements.", location: "Monterrey", contactEmail: "hello@bloom.com", contactPhone: "+52 81 4444 5678", rating: 4.9, reviewCount: 83, verified: true, featured: true, avatar: "", coverImage: "", services: [{ id: "s-007", title: "Full Event Decoration", description: "Complete venue transformation including centerpieces, installations, and ambient lighting.", price: 35000, category: "decoration", images: [], tags: ["luxury", "full-service"] }, { id: "s-008", title: "Bridal Bouquet Collection", description: "Custom bridal bouquet plus bridesmaids bouquets.", price: 4500, category: "decoration", images: [], tags: ["wedding", "bouquet"] }], gallery: [] },
  { id: "v-005", name: "DJ Elektra", category: "music", description: "High-energy DJ and live music production for events of all sizes.", location: "Mexico City", contactEmail: "dj@elektra.com", contactPhone: "+52 55 1111 2222", rating: 4.6, reviewCount: 112, verified: false, featured: false, avatar: "", coverImage: "", services: [{ id: "s-009", title: "Wedding DJ Package", description: "8 hours of music including ceremony, cocktail, dinner, and party.", price: 18000, category: "music", images: [], tags: ["wedding", "full-night"] }, { id: "s-010", title: "Corporate Event Set", description: "4-hour ambient and energetic set.", price: 9000, category: "music", images: [], tags: ["corporate", "ambient"] }], gallery: [] },
  { id: "v-006", name: "Lens & Light Studios", category: "photography", description: "Cinematic photography and videography team.", location: "Guadalajara", contactEmail: "hi@lens.com", contactPhone: "+52 33 7777 8888", rating: 4.8, reviewCount: 156, verified: true, featured: false, avatar: "", coverImage: "", services: [{ id: "s-011", title: "Full Day Coverage", description: "12 hours of photography and videography.", price: 32000, category: "photography", images: [], tags: ["luxury", "video", "photo"] }, { id: "s-012", title: "Highlight Reel", description: "3-minute cinematic highlight video.", price: 8000, category: "photography", images: [], tags: ["video", "cinematic"] }], gallery: [] },
  { id: "v-007", name: "Elegance Events Co.", category: "planning", description: "Full-service event planning and coordination.", location: "Monterrey", contactEmail: "info@elegance.com", contactPhone: "+52 81 3333 4444", rating: 4.9, reviewCount: 71, verified: true, featured: true, avatar: "", coverImage: "", services: [{ id: "s-013", title: "Full Planning Package", description: "Complete event planning from concept to execution.", price: 55000, category: "planning", images: [], tags: ["luxury", "full-service"] }, { id: "s-014", title: "Day-of Coordination", description: "Professional coordination on the day of your event.", price: 12000, category: "planning", images: [], tags: ["coordination"] }], gallery: [] },
  { id: "v-008", name: "Fuego Shows", category: "entertainment", description: "Spectacular fire shows, aerial performances, and immersive entertainment.", location: "Mexico City", contactEmail: "shows@fuego.com", contactPhone: "+52 55 6666 7777", rating: 4.5, reviewCount: 45, verified: false, featured: false, avatar: "", coverImage: "", services: [{ id: "s-015", title: "Fire & Light Show", description: "20-minute choreographed fire performance.", price: 15000, category: "entertainment", images: [], tags: ["show", "fire", "spectacle"] }, { id: "s-016", title: "Aerial Silk Performance", description: "Elegant aerial acrobatics performance.", price: 10000, category: "entertainment", images: [], tags: ["elegant", "aerial"] }], gallery: [] },
];

const MOCK_LEADS: Lead[] = [
  { id: "lead-001", organizerName: "Alan Nexora", eventName: "Alan & Sofía Wedding", eventDate: "2026-07-15", budget: 80000, status: "qualified", serviceInterest: "Full Venue Rental", createdAt: "2026-03-28", conversationId: "conv-001", notes: "Interested in Premium package" },
  { id: "lead-002", organizerName: "María García", eventName: "Company Retreat 2026", eventDate: "2026-08-08", budget: 120000, status: "proposal_sent", serviceInterest: "Full Venue Rental", createdAt: "2026-04-01", conversationId: "conv-002", notes: "Corporate event, 3-day rental" },
  { id: "lead-003", organizerName: "Diego Hernández", eventName: "Birthday Celebration", eventDate: "2026-06-20", budget: 25000, status: "contacted", serviceInterest: "Ceremony Package", createdAt: "2026-04-03", conversationId: "conv-003", notes: "Small terrace event" },
  { id: "lead-004", organizerName: "Sofía Peña", eventName: "XV Años Isabella", eventDate: "2026-09-12", budget: 60000, status: "new", serviceInterest: "Full Venue Rental", createdAt: "2026-04-09", conversationId: "conv-004", notes: "" },
  { id: "lead-005", organizerName: "Carlos Vega", eventName: "Product Launch", eventDate: "2026-05-28", budget: 45000, status: "won", serviceInterest: "Full Venue Rental", createdAt: "2026-02-15", conversationId: null, notes: "Confirmed and deposit received" },
];

const MOCK_PIPELINE: PipelineDeal[] = [
  { id: "deal-001", leadId: "lead-004", organizerName: "Sofía Peña", eventName: "XV Años Isabella", eventDate: "2026-09-12", stage: "inquiry", value: 60000, serviceTitle: "Full Venue Rental", lastActivity: "2 hours ago", proposalSent: false },
  { id: "deal-002", leadId: "lead-003", organizerName: "Diego Hernández", eventName: "Birthday Celebration", eventDate: "2026-06-20", stage: "negotiation", value: 25000, serviceTitle: "Ceremony Package", lastActivity: "2 days ago", proposalSent: false },
  { id: "deal-003", leadId: "lead-001", organizerName: "Alan Nexora", eventName: "Alan & Sofía Wedding", eventDate: "2026-07-15", stage: "proposal_sent", value: 80000, serviceTitle: "Full Venue Rental - Premium", lastActivity: "5 hours ago", proposalSent: true },
  { id: "deal-004", leadId: "lead-002", organizerName: "María García", eventName: "Company Retreat 2026", eventDate: "2026-08-08", stage: "confirmed", value: 120000, serviceTitle: "Full Venue Rental - Luxury", lastActivity: "1 day ago", proposalSent: true },
  { id: "deal-005", leadId: "lead-005", organizerName: "Carlos Vega", eventName: "Product Launch", eventDate: "2026-05-28", stage: "completed", value: 45000, serviceTitle: "Full Venue Rental", lastActivity: "1 week ago", proposalSent: true },
];

const MOCK_REVIEWS: VendorReview[] = [
  { id: "rev-001", vendorId: "v-001", reviewerName: "Laura Méndez", eventName: "Laura & Miguel Wedding", rating: 5, comment: "Absolutely breathtaking venue! The gardens were perfect for our ceremony and the ballroom was stunning for the reception. The staff went above and beyond.", date: "2026-03-15", reply: "Thank you so much Laura! It was a pleasure hosting your beautiful wedding." },
  { id: "rev-002", vendorId: "v-001", reviewerName: "Roberto Sánchez", eventName: "Sánchez Corp Annual Gala", rating: 5, comment: "Professional, elegant, and perfectly executed. Our corporate event was a huge success thanks to the Hacienda team.", date: "2026-02-28" },
  { id: "rev-003", vendorId: "v-001", reviewerName: "Ana Torres", eventName: "Ana & David Anniversary", rating: 4, comment: "Beautiful venue with great amenities. The only small issue was parking capacity for our larger group, but the team handled it well.", date: "2026-01-20", reply: "Thank you Ana! We've since expanded our valet service to accommodate larger events." },
  { id: "rev-004", vendorId: "v-001", reviewerName: "Fernando López", eventName: "XV Años Valentina", rating: 5, comment: "The sunset views from the terrace were incredible. Our guests are still talking about the venue months later!", date: "2025-12-10" },
  { id: "rev-005", vendorId: "v-001", reviewerName: "Patricia Ruiz", eventName: "Charity Fundraiser", rating: 5, comment: "The Hacienda provided the perfect backdrop for our charity event. The elegant atmosphere helped us raise record donations.", date: "2025-11-05" },
];

const MOCK_AVAILABILITY: AvailabilitySlot[] = (() => {
  const slots: AvailabilitySlot[] = [];
  const now = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const booked = [3, 7, 14, 21, 28, 35].includes(i);
    slots.push({ date: d.toISOString().split("T")[0], available: !booked });
  }
  return slots;
})();

const MOCK_NOTIFICATIONS: VendorNotification[] = [
  { id: "vn-001", type: "inquiry", title: "New Inquiry", description: "Sofía Peña inquired about XV Años Isabella", time: "2 hours ago", read: false },
  { id: "vn-002", type: "view", title: "Profile Views", description: "Your profile was viewed 23 times today", time: "3 hours ago", read: false },
  { id: "vn-003", type: "message", title: "New Message", description: "Alan Nexora sent you a message", time: "5 hours ago", read: false },
  { id: "vn-004", type: "review", title: "New Review", description: "Laura Méndez left a 5-star review", time: "1 day ago", read: true },
  { id: "vn-005", type: "booking", title: "Booking Confirmed", description: "Company Retreat 2026 has been confirmed", time: "1 day ago", read: true },
  { id: "vn-006", type: "view", title: "Featured Boost", description: "Your listing got 45% more views this week", time: "2 days ago", read: true },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001", vendorId: "v-001", organizerName: "Alan Nexora", organizerAvatar: "", eventName: "Alan & Sofía Wedding", unread: 1,
    messages: [
      { id: "cm-001", text: "Hello! I'm interested in your venue for our wedding on July 15. Is it available?", sender: "organizer", timestamp: "10:30 AM" },
      { id: "cm-002", text: "Hi Alan! Thank you for your interest. July 15 is currently available. Would you like to schedule a visit?", sender: "vendor", timestamp: "10:45 AM" },
      { id: "cm-003", text: "That would be great! Can we come this Saturday?", sender: "organizer", timestamp: "11:02 AM" },
    ],
  },
  {
    id: "conv-002", vendorId: "v-001", organizerName: "María García", organizerAvatar: "", eventName: "Company Retreat 2026", unread: 2,
    messages: [
      { id: "cm-004", text: "Hi! We'd love to book the Full Venue Rental for a corporate event in August.", sender: "organizer", timestamp: "Yesterday" },
      { id: "cm-005", text: "What dates are you considering? We have availability in the first two weeks.", sender: "vendor", timestamp: "Yesterday" },
      { id: "cm-006", text: "August 8-10 would be ideal. How many guests can you accommodate?", sender: "organizer", timestamp: "2 hours ago" },
      { id: "cm-007", text: "We also need catering. Do you offer packages?", sender: "organizer", timestamp: "1 hour ago" },
    ],
  },
  {
    id: "conv-003", vendorId: "v-001", organizerName: "Diego Hernández", organizerAvatar: "", eventName: "Birthday Celebration", unread: 0,
    messages: [
      { id: "cm-008", text: "Hello, I'm interested in renting the terrace for a birthday party.", sender: "organizer", timestamp: "3 days ago" },
      { id: "cm-009", text: "The terrace is perfect for intimate events! How many guests are you expecting?", sender: "vendor", timestamp: "3 days ago" },
      { id: "cm-010", text: "About 50 people. What's the pricing?", sender: "organizer", timestamp: "2 days ago" },
      { id: "cm-011", text: "For 50 guests on the terrace, we offer a special package at $18,000. This includes setup, lighting, and basic decoration.", sender: "vendor", timestamp: "2 days ago" },
    ],
  },
  {
    id: "conv-004", vendorId: "v-001", organizerName: "Sofía Peña", organizerAvatar: "", eventName: "XV Años Isabella", unread: 1,
    messages: [
      { id: "cm-012", text: "Buenos días! We're planning a quinceañera for 200 guests. Do you have availability in September?", sender: "organizer", timestamp: "5 hours ago" },
    ],
  },
];

function deriveMessages(convos: Conversation[]): Message[] {
  return convos.map((c) => {
    const last = c.messages[c.messages.length - 1];
    return { id: c.id, vendorId: c.vendorId, senderName: c.organizerName, eventName: c.eventName, text: last.text, time: last.timestamp, read: c.unread === 0 };
  });
}

interface VendorContextType {
  vendors: Vendor[];
  myVendor: Vendor;
  messages: Message[];
  conversations: Conversation[];
  favorites: string[];
  leads: Lead[];
  pipeline: PipelineDeal[];
  reviews: VendorReview[];
  availability: AvailabilitySlot[];
  notifications: VendorNotification[];
  getVendor: (id: string) => Vendor | undefined;
  toggleFavorite: (vendorId: string) => void;
  isFavorite: (vendorId: string) => boolean;
  sendMessage: (vendorId: string, text: string) => void;
  sendChatMessage: (conversationId: string, text: string, type?: ChatMessage["type"]) => void;
  markRead: (messageId: string) => void;
  markConversationRead: (conversationId: string) => void;
  addService: (service: Omit<VendorService, "id">) => void;
  updateService: (id: string, updates: Partial<VendorService>) => void;
  deleteService: (id: string) => void;
  updateVendorProfile: (updates: Partial<Vendor>) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateDealStage: (dealId: string, stage: PipelineStage) => void;
  toggleAvailability: (date: string) => void;
  replyToReview: (reviewId: string, reply: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  vendorStats: { views: number; inquiries: number; servicesCount: number; responseRate: number; conversionRate: number; totalPipelineValue: number };
}

const VendorContext = createContext<VendorContextType | null>(null);

export function VendorProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [favorites, setFavorites] = useState<string[]>(["v-001", "v-004"]);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [pipeline, setPipeline] = useState<PipelineDeal[]>(MOCK_PIPELINE);
  const [reviews, setReviews] = useState<VendorReview[]>(MOCK_REVIEWS);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>(MOCK_AVAILABILITY);
  const [notifications, setNotifications] = useState<VendorNotification[]>(MOCK_NOTIFICATIONS);

  const myVendor = vendors.find((v) => v.id === MY_VENDOR_ID)!;
  const messages = deriveMessages(conversations);

  const getVendor = useCallback((id: string) => vendors.find((v) => v.id === id), [vendors]);
  const toggleFavorite = useCallback((vendorId: string) => {
    setFavorites((prev) => prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]);
  }, []);
  const isFavorite = useCallback((vendorId: string) => favorites.includes(vendorId), [favorites]);

  const sendMessage = useCallback((vendorId: string, text: string) => {
    const newConvo: Conversation = {
      id: `conv-${Date.now()}`, vendorId, organizerName: "You", organizerAvatar: "", eventName: "My Event",
      messages: [{ id: `cm-${Date.now()}`, text, sender: "organizer", timestamp: "Just now" }], unread: 1,
    };
    setConversations((prev) => [newConvo, ...prev]);
  }, []);

  const sendChatMessage = useCallback((conversationId: string, text: string, type: ChatMessage["type"] = "text") => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, messages: [...c.messages, { id: `cm-${Date.now()}`, text, sender: "vendor" as const, timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), type }] }
          : c
      )
    );
  }, []);

  const markRead = useCallback((messageId: string) => {
    setConversations((prev) => prev.map((c) => c.id === messageId ? { ...c, unread: 0 } : c));
  }, []);
  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((c) => c.id === conversationId ? { ...c, unread: 0 } : c));
  }, []);

  const addService = useCallback((service: Omit<VendorService, "id">) => {
    const newService: VendorService = { ...service, id: `s-${Date.now()}` };
    setVendors((prev) => prev.map((v) => v.id === MY_VENDOR_ID ? { ...v, services: [...v.services, newService] } : v));
  }, []);
  const updateService = useCallback((id: string, updates: Partial<VendorService>) => {
    setVendors((prev) => prev.map((v) => v.id === MY_VENDOR_ID ? { ...v, services: v.services.map((s) => s.id === id ? { ...s, ...updates } : s) } : v));
  }, []);
  const deleteService = useCallback((id: string) => {
    setVendors((prev) => prev.map((v) => v.id === MY_VENDOR_ID ? { ...v, services: v.services.filter((s) => s.id !== id) } : v));
  }, []);
  const updateVendorProfile = useCallback((updates: Partial<Vendor>) => {
    setVendors((prev) => prev.map((v) => v.id === MY_VENDOR_ID ? { ...v, ...updates } : v));
  }, []);

  const updateLeadStatus = useCallback((leadId: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, status } : l));
  }, []);
  const updateDealStage = useCallback((dealId: string, stage: PipelineStage) => {
    setPipeline((prev) => prev.map((d) => d.id === dealId ? { ...d, stage, lastActivity: "Just now" } : d));
  }, []);
  const toggleAvailability = useCallback((date: string) => {
    setAvailability((prev) => prev.map((s) => s.date === date ? { ...s, available: !s.available } : s));
  }, []);
  const replyToReview = useCallback((reviewId: string, reply: string) => {
    setReviews((prev) => prev.map((r) => r.id === reviewId ? { ...r, reply } : r));
  }, []);
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const wonLeads = leads.filter((l) => l.status === "won").length;
  const totalLeads = leads.length;
  const vendorStats = {
    views: 1247,
    inquiries: conversations.length,
    servicesCount: myVendor.services.length,
    responseRate: 94,
    conversionRate: totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0,
    totalPipelineValue: pipeline.filter((d) => d.stage !== "completed").reduce((a, d) => a + d.value, 0),
  };

  return (
    <VendorContext.Provider value={{
      vendors, myVendor, messages, conversations, favorites, leads, pipeline, reviews, availability, notifications,
      getVendor, toggleFavorite, isFavorite, sendMessage, sendChatMessage, markRead, markConversationRead,
      addService, updateService, deleteService, updateVendorProfile,
      updateLeadStatus, updateDealStage, toggleAvailability, replyToReview,
      markNotificationRead, markAllNotificationsRead, vendorStats,
    }}>
      {children}
    </VendorContext.Provider>
  );
}

export function useVendors() {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error("useVendors must be used within VendorProvider");
  return ctx;
}
