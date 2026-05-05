import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type BookingStatus = "pending" | "negotiating" | "confirmed" | "cancelled";

export interface BookingRequest {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  serviceType: string;
  eventDate: string;
  estimatedBudget: number;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  messages: BookingMessage[];
}

export interface BookingMessage {
  id: string;
  text: string;
  sender: "host" | "vendor";
  timestamp: string;
}

const MOCK_BOOKINGS: BookingRequest[] = [
  {
    id: "bk-001",
    vendorId: "v1",
    vendorName: "Hacienda Los Robles",
    vendorCategory: "Venue",
    serviceType: "Full Venue Rental",
    eventDate: "2026-04-30",
    estimatedBudget: 45000,
    notes: "Need full venue with garden ceremony setup",
    status: "confirmed",
    createdAt: "2026-03-01",
    messages: [
      { id: "bm-001", text: "Hi! We'd like to book the full venue for April 30.", sender: "host", timestamp: "Mar 1, 10:30 AM" },
      { id: "bm-002", text: "Great choice! April 30 is available. The full venue rental is $45,000.", sender: "vendor", timestamp: "Mar 1, 11:15 AM" },
      { id: "bm-003", text: "That works for us. Let's confirm!", sender: "host", timestamp: "Mar 1, 2:00 PM" },
      { id: "bm-004", text: "Booking confirmed! We'll send the contract shortly.", sender: "vendor", timestamp: "Mar 1, 3:00 PM" },
    ],
  },
  {
    id: "bk-002",
    vendorId: "v2",
    vendorName: "DJ Elektra",
    vendorCategory: "Music",
    serviceType: "Wedding DJ Package",
    eventDate: "2026-04-30",
    estimatedBudget: 18000,
    notes: "8-hour package with ceremony + party music",
    status: "confirmed",
    createdAt: "2026-03-05",
    messages: [
      { id: "bm-005", text: "Interested in the wedding DJ package for April 30.", sender: "host", timestamp: "Mar 5, 9:00 AM" },
      { id: "bm-006", text: "I'm available! Let me share the details.", sender: "vendor", timestamp: "Mar 5, 10:00 AM" },
    ],
  },
  {
    id: "bk-003",
    vendorId: "v3",
    vendorName: "Flores Elegantes",
    vendorCategory: "Florals",
    serviceType: "Full Event Decoration",
    eventDate: "2026-04-30",
    estimatedBudget: 25000,
    notes: "Centerpieces, bridal bouquet, ceremony arch",
    status: "negotiating",
    createdAt: "2026-03-10",
    messages: [
      { id: "bm-007", text: "We need full decoration for our wedding. Can you send a quote?", sender: "host", timestamp: "Mar 10, 11:00 AM" },
      { id: "bm-008", text: "Of course! Based on 20 centerpieces + arch + bridal, I estimate $28,000.", sender: "vendor", timestamp: "Mar 10, 2:00 PM" },
      { id: "bm-009", text: "That's a bit over budget. Can we adjust the centerpieces?", sender: "host", timestamp: "Mar 10, 3:30 PM" },
    ],
  },
  {
    id: "bk-004",
    vendorId: "v5",
    vendorName: "Foto Premium Studio",
    vendorCategory: "Photography",
    serviceType: "Full Day Coverage",
    eventDate: "2026-04-30",
    estimatedBudget: 32000,
    notes: "Photo + video, 12-hour coverage",
    status: "pending",
    createdAt: "2026-03-15",
    messages: [
      { id: "bm-010", text: "Hi! I'm looking for photo and video coverage for April 30.", sender: "host", timestamp: "Mar 15, 4:00 PM" },
    ],
  },
];

interface BookingContextType {
  bookings: BookingRequest[];
  createBooking: (booking: Omit<BookingRequest, "id" | "createdAt" | "messages" | "status">) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  cancelBooking: (id: string) => void;
  sendBookingMessage: (bookingId: string, text: string, sender: "host" | "vendor") => void;
  getBooking: (id: string) => BookingRequest | undefined;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingRequest[]>(MOCK_BOOKINGS);

  const createBooking = useCallback((booking: Omit<BookingRequest, "id" | "createdAt" | "messages" | "status">) => {
    const newBooking: BookingRequest = {
      ...booking,
      id: `bk-${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],
      messages: [
        {
          id: `bm-${Date.now()}`,
          text: booking.notes || `Hi! I'd like to request ${booking.serviceType} for my event on ${booking.eventDate}.`,
          sender: "host",
          timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
        },
      ],
    };
    setBookings((prev) => [newBooking, ...prev]);
  }, []);

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as BookingStatus } : b)));
  }, []);

  const sendBookingMessage = useCallback((bookingId: string, text: string, sender: "host" | "vendor") => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              messages: [
                ...b.messages,
                {
                  id: `bm-${Date.now()}`,
                  text,
                  sender,
                  timestamp: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
                },
              ],
            }
          : b
      )
    );
  }, []);

  const getBooking = useCallback((id: string) => bookings.find((b) => b.id === id), [bookings]);

  return (
    <BookingContext.Provider value={{ bookings, createBooking, updateBookingStatus, cancelBooking, sendBookingMessage, getBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within BookingProvider");
  return ctx;
}
