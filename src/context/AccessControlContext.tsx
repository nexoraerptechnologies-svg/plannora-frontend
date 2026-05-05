import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";

export type GuestTag = "VIP" | "Family" | "Friend" | "Plus One" | "Staff" | "Vendor";
export type AccessMode = "normal" | "strict" | "vip";
export type ScanErrorType = "invalid" | "already-checked-in" | "not-confirmed" | "wrong-event";
export type EntrancePoint = "Main Entrance" | "VIP Entrance" | "Side Gate" | "Service Entrance";

export interface Guest {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  qrCode: string;
  status: "pending" | "checked-in";
  table: string;
  plusOne: boolean;
  mealPreference: string;
  checkInTime?: string;
  tags: GuestTag[];
  entrance?: EntrancePoint;
  confirmed: boolean;
  eventId: string;
}

export interface ScanRecord {
  id: string;
  guestId: string;
  guestName: string;
  timestamp: Date;
  result: "success" | "warning" | "denied";
  reason?: string;
  entrance: EntrancePoint;
}

export interface EventInfo {
  id: string;
  slug: string;
  name: string;
  date: string;
  time: string;
  location: string;
  dressCode: string;
  description: string;
}

const EVENT: EventInfo = {
  id: "evt-001",
  slug: "alan-y-sofia",
  name: "Alan & Sofía",
  date: "July 15, 2026",
  time: "6:00 PM",
  location: "Hacienda Los Robles, Guadalajara",
  dressCode: "Formal / Black Tie",
  description: "Join us for an unforgettable evening celebrating love, elegance, and togetherness.",
};

const INITIAL_GUESTS: Guest[] = [
  { id: "g-001", name: "María García", email: "maria@email.com", qrCode: "PLAN-g-001-evt-001", status: "pending", table: "Table 1", plusOne: true, mealPreference: "Vegetarian", tags: ["Family"], confirmed: true, eventId: "evt-001" },
  { id: "g-002", name: "Carlos Rodríguez", email: "carlos@email.com", qrCode: "PLAN-g-002-evt-001", status: "pending", table: "Table 1", plusOne: false, mealPreference: "Beef", tags: ["Friend"], confirmed: true, eventId: "evt-001" },
  { id: "g-003", name: "Ana López", email: "ana@email.com", qrCode: "PLAN-g-003-evt-001", status: "checked-in", table: "Table 2", plusOne: true, mealPreference: "Fish", tags: ["VIP", "Family"], confirmed: true, eventId: "evt-001", checkInTime: "5:42 PM", entrance: "VIP Entrance" },
  { id: "g-004", name: "Diego Hernández", email: "diego@email.com", qrCode: "PLAN-g-004-evt-001", status: "checked-in", table: "Table 2", plusOne: false, mealPreference: "Chicken", tags: ["Friend"], confirmed: true, eventId: "evt-001", checkInTime: "5:55 PM", entrance: "Main Entrance" },
  { id: "g-005", name: "Isabella Torres", email: "isabella@email.com", qrCode: "PLAN-g-005-evt-001", status: "pending", table: "Table 3", plusOne: true, mealPreference: "Vegetarian", tags: ["VIP"], confirmed: true, eventId: "evt-001" },
  { id: "g-006", name: "Miguel Sánchez", email: "miguel@email.com", qrCode: "PLAN-g-006-evt-001", status: "pending", table: "Table 3", plusOne: false, mealPreference: "Beef", tags: ["Friend"], confirmed: true, eventId: "evt-001" },
  { id: "g-007", name: "Valentina Cruz", email: "valentina@email.com", qrCode: "PLAN-g-007-evt-001", status: "checked-in", table: "VIP Table", plusOne: true, mealPreference: "Fish", tags: ["VIP", "Family"], confirmed: true, eventId: "evt-001", checkInTime: "6:01 PM", entrance: "VIP Entrance" },
  { id: "g-008", name: "Alejandro Morales", email: "alejandro@email.com", qrCode: "PLAN-g-008-evt-001", status: "pending", table: "Table 4", plusOne: false, mealPreference: "Chicken", tags: ["Staff"], confirmed: true, eventId: "evt-001" },
  { id: "g-009", name: "Sofía Peña", email: "sofia@email.com", qrCode: "PLAN-g-009-evt-001", status: "pending", table: "Table 4", plusOne: true, mealPreference: "Vegetarian", tags: ["Family"], confirmed: true, eventId: "evt-001" },
  { id: "g-010", name: "Luis Kim", email: "luis@email.com", qrCode: "PLAN-g-010-evt-001", status: "pending", table: "Table 5", plusOne: false, mealPreference: "Beef", tags: ["Friend"], confirmed: false, eventId: "evt-001" },
  { id: "g-011", name: "Elena Rivera", email: "elena@email.com", qrCode: "PLAN-g-011-evt-001", status: "checked-in", table: "Table 5", plusOne: true, mealPreference: "Fish", tags: ["Vendor"], confirmed: true, eventId: "evt-001", checkInTime: "6:10 PM", entrance: "Service Entrance" },
  { id: "g-012", name: "Pablo Martínez", email: "pablo@email.com", qrCode: "PLAN-g-012-evt-001", status: "pending", table: "Table 6", plusOne: false, mealPreference: "Chicken", tags: ["Friend"], confirmed: true, eventId: "evt-001" },
];

interface CheckInResult {
  success: boolean;
  errorType?: ScanErrorType;
  guest?: Guest;
}

interface AccessControlContextType {
  event: EventInfo;
  guests: Guest[];
  getGuest: (id: string) => Guest | undefined;
  checkInGuest: (id: string, entrance: EntrancePoint, mode: AccessMode) => CheckInResult;
  stats: { total: number; checkedIn: number; pending: number };
  scanHistory: ScanRecord[];
  offlineQueue: ScanRecord[];
  isOnline: boolean;
  syncOffline: () => void;
}

const AccessControlContext = createContext<AccessControlContextType | null>(null);

export function AccessControlProvider({ children }: { children: ReactNode }) {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<ScanRecord[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const scanIdRef = useRef(0);

  const getGuest = useCallback((id: string) => guests.find((g) => g.id === id), [guests]);

  const checkInGuest = useCallback(
    (id: string, entrance: EntrancePoint, mode: AccessMode): CheckInResult => {
      const guest = guests.find((g) => g.id === id);

      if (!guest) {
        const record: ScanRecord = { id: `scan-${++scanIdRef.current}`, guestId: id, guestName: "Unknown", timestamp: new Date(), result: "denied", reason: "Invalid QR code", entrance };
        if (isOnline) setScanHistory((p) => [record, ...p]);
        else setOfflineQueue((p) => [record, ...p]);
        return { success: false, errorType: "invalid" };
      }

      if (guest.eventId !== "evt-001") {
        const record: ScanRecord = { id: `scan-${++scanIdRef.current}`, guestId: id, guestName: guest.name, timestamp: new Date(), result: "denied", reason: "Wrong event", entrance };
        if (isOnline) setScanHistory((p) => [record, ...p]);
        else setOfflineQueue((p) => [record, ...p]);
        return { success: false, errorType: "wrong-event", guest };
      }

      if (!guest.confirmed) {
        const record: ScanRecord = { id: `scan-${++scanIdRef.current}`, guestId: id, guestName: guest.name, timestamp: new Date(), result: "denied", reason: "Not confirmed", entrance };
        if (isOnline) setScanHistory((p) => [record, ...p]);
        else setOfflineQueue((p) => [record, ...p]);
        return { success: false, errorType: "not-confirmed", guest };
      }

      if (guest.status === "checked-in") {
        const record: ScanRecord = { id: `scan-${++scanIdRef.current}`, guestId: id, guestName: guest.name, timestamp: new Date(), result: "warning", reason: "Already checked in", entrance };
        if (isOnline) setScanHistory((p) => [record, ...p]);
        else setOfflineQueue((p) => [record, ...p]);
        return { success: false, errorType: "already-checked-in", guest };
      }

      if (mode === "vip" && !guest.tags.includes("VIP")) {
        const record: ScanRecord = { id: `scan-${++scanIdRef.current}`, guestId: id, guestName: guest.name, timestamp: new Date(), result: "denied", reason: "VIP only entrance", entrance };
        if (isOnline) setScanHistory((p) => [record, ...p]);
        else setOfflineQueue((p) => [record, ...p]);
        return { success: false, errorType: "invalid", guest };
      }

      const now = new Date();
      const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      const updatedGuest = { ...guest, status: "checked-in" as const, checkInTime: time, entrance };
      setGuests((prev) => prev.map((g) => (g.id === id ? updatedGuest : g)));

      const record: ScanRecord = { id: `scan-${++scanIdRef.current}`, guestId: id, guestName: guest.name, timestamp: now, result: "success", entrance };
      if (isOnline) setScanHistory((p) => [record, ...p]);
      else setOfflineQueue((p) => [record, ...p]);

      return { success: true, guest: updatedGuest };
    },
    [guests, isOnline]
  );

  const syncOffline = useCallback(() => {
    setScanHistory((p) => [...offlineQueue, ...p]);
    setOfflineQueue([]);
  }, [offlineQueue]);

  const stats = {
    total: guests.length,
    checkedIn: guests.filter((g) => g.status === "checked-in").length,
    pending: guests.filter((g) => g.status === "pending").length,
  };

  return (
    <AccessControlContext.Provider value={{ event: EVENT, guests, getGuest, checkInGuest, stats, scanHistory, offlineQueue, isOnline, syncOffline }}>
      {children}
    </AccessControlContext.Provider>
  );
}

export function useAccessControl() {
  const ctx = useContext(AccessControlContext);
  if (!ctx) throw new Error("useAccessControl must be used within AccessControlProvider");
  return ctx;
}
