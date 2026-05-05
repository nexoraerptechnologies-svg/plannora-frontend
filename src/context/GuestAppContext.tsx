import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export interface GuestPhoto {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  uploadedById: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
  reactions: Record<string, number>;
  filter?: string;
  frame?: string;
  sticker?: string;
}

export interface SongSuggestion {
  id: string;
  title: string;
  artist: string;
  suggestedBy: string;
  votes: number;
  votedBy: string[];
}

export interface FeedItem {
  id: string;
  type: "photo" | "checkin" | "song" | "announcement" | "reaction";
  message: string;
  timestamp: string;
  reactions?: Record<string, string[]>; // emoji -> userIds
}

export interface GuestProfile {
  id: string;
  name: string;
  table: string;
  tableType: string;
  qrCode: string;
  points: number;
  badges: string[];
  checkedIn: boolean;
  rsvpStatus: "pending" | "accepted" | "declined";
}

export interface TimelineItem {
  time: string;
  label: string;
  icon: string;
  active: boolean;
  completed: boolean;
}

export interface TableGuest {
  id: string;
  name: string;
  isCurrentUser: boolean;
  arrived: boolean;
  arrivedAt?: string;
}

export type QRState = "ready" | "used" | "locked";

export interface NowPlaying {
  title: string;
  artist: string;
  progress: number; // 0-100
}

interface GuestAppContextType {
  guest: GuestProfile;
  tableGuests: TableGuest[];
  photos: GuestPhoto[];
  songs: SongSuggestion[];
  feed: FeedItem[];
  timeline: TimelineItem[];
  leaderboard: { name: string; points: number; badges: string[] }[];
  notifications: { id: string; message: string; read: boolean; timestamp: string; type: string }[];
  isLive: boolean;
  qrState: QRState;
  nowPlaying: NowPlaying;
  currentActivity: TimelineItem | null;
  uploadPhoto: (caption: string, filter?: string, frame?: string, sticker?: string) => void;
  likePhoto: (photoId: string) => void;
  reactPhoto: (photoId: string, reaction: string) => void;
  reactFeed: (feedId: string, reaction: string) => void;
  suggestSong: (title: string, artist: string) => void;
  voteSong: (songId: string) => void;
  markNotificationRead: (id: string) => void;
  checkIn: () => void;
}

const TIMELINE: TimelineItem[] = [
  { time: "5:30 PM", label: "Guest Arrival", icon: "🚗", active: false, completed: true },
  { time: "6:00 PM", label: "Ceremony", icon: "💒", active: false, completed: true },
  { time: "7:00 PM", label: "Cocktail Hour", icon: "🥂", active: false, completed: true },
  { time: "8:00 PM", label: "Dinner", icon: "🍽️", active: true, completed: false },
  { time: "9:30 PM", label: "First Dance", icon: "💃", active: false, completed: false },
  { time: "10:00 PM", label: "Open Dance Floor", icon: "🎶", active: false, completed: false },
  { time: "11:30 PM", label: "Cake Cutting", icon: "🎂", active: false, completed: false },
  { time: "12:00 AM", label: "After Party", icon: "🎉", active: false, completed: false },
];

const INITIAL_PHOTOS: GuestPhoto[] = [
  { id: "p1", url: "", caption: "Beautiful ceremony! 💒", uploadedBy: "Ana López", uploadedById: "g-003", timestamp: "7:15 PM", likes: 8, likedBy: [], reactions: { "❤️": 5, "🔥": 3 } },
  { id: "p2", url: "", caption: "The venue looks stunning", uploadedBy: "Valentina Cruz", uploadedById: "g-007", timestamp: "7:30 PM", likes: 12, likedBy: [], reactions: { "❤️": 8, "🎉": 4 } },
  { id: "p3", url: "", caption: "Cocktails are amazing!", uploadedBy: "Elena Rivera", uploadedById: "g-011", timestamp: "7:45 PM", likes: 6, likedBy: [], reactions: { "🔥": 4, "❤️": 2 } },
  { id: "p4", url: "", caption: "Best wedding ever! 🎉", uploadedBy: "Diego Hernández", uploadedById: "g-004", timestamp: "8:10 PM", likes: 15, likedBy: [], reactions: { "❤️": 10, "🎉": 5 } },
  { id: "p5", url: "", caption: "Table decorations 😍", uploadedBy: "María García", uploadedById: "g-001", timestamp: "8:20 PM", likes: 9, likedBy: [], reactions: { "❤️": 6, "🔥": 3 } },
];

const INITIAL_SONGS: SongSuggestion[] = [
  { id: "s1", title: "Vivir Mi Vida", artist: "Marc Anthony", suggestedBy: "Carlos", votes: 8, votedBy: [] },
  { id: "s2", title: "Despacito", artist: "Luis Fonsi", suggestedBy: "Ana", votes: 12, votedBy: [] },
  { id: "s3", title: "Bailando", artist: "Enrique Iglesias", suggestedBy: "Diego", votes: 6, votedBy: [] },
  { id: "s4", title: "La Bicicleta", artist: "Shakira & Carlos Vives", suggestedBy: "Valentina", votes: 10, votedBy: [] },
  { id: "s5", title: "Felices los 4", artist: "Maluma", suggestedBy: "Elena", votes: 4, votedBy: [] },
];

const INITIAL_FEED: FeedItem[] = [
  { id: "f1", type: "announcement", message: "🍽️ Dinner is now being served!", timestamp: "8:00 PM", reactions: {} },
  { id: "f2", type: "photo", message: "📸 María uploaded a new photo", timestamp: "8:20 PM", reactions: { "❤️": ["g-003", "g-004"] } },
  { id: "f3", type: "checkin", message: "✅ Alejandro just checked in", timestamp: "8:15 PM", reactions: { "👏": ["g-001"] } },
  { id: "f4", type: "song", message: "🎵 Diego suggested 'Bailando'", timestamp: "8:05 PM", reactions: { "🔥": ["g-002"] } },
  { id: "f5", type: "photo", message: "📸 Diego uploaded a new photo", timestamp: "8:10 PM", reactions: {} },
];

const LEADERBOARD = [
  { name: "Diego Hernández", points: 85, badges: ["📸", "🎉"] },
  { name: "Ana López", points: 72, badges: ["📸"] },
  { name: "Valentina Cruz", points: 60, badges: ["🏆"] },
  { name: "Elena Rivera", points: 45, badges: ["🎉"] },
  { name: "María García", points: 40, badges: ["📸"] },
];

const GuestAppContext = createContext<GuestAppContextType | null>(null);

export function GuestAppProvider({ guestId, children }: { guestId: string; children: ReactNode }) {
  const [guest, setGuest] = useState<GuestProfile>({
    id: guestId,
    name: guestId === "g-001" ? "María García" : "Guest",
    table: "Table 1",
    tableType: "Family",
    qrCode: `PLAN-${guestId}-evt-001`,
    points: 40,
    badges: ["📸"],
    checkedIn: false,
    rsvpStatus: "accepted",
  });

  const [tableGuests, setTableGuests] = useState<TableGuest[]>([
    { id: "g-001", name: "María García", isCurrentUser: guestId === "g-001", arrived: true, arrivedAt: "5:35 PM" },
    { id: "g-002", name: "Carlos Rodríguez", isCurrentUser: guestId === "g-002", arrived: true, arrivedAt: "5:40 PM" },
    { id: "g-013", name: "Laura Vega", isCurrentUser: false, arrived: true, arrivedAt: "5:50 PM" },
    { id: "g-014", name: "Pedro Ruiz", isCurrentUser: false, arrived: false },
    { id: "g-015", name: "Camila Flores", isCurrentUser: false, arrived: true, arrivedAt: "6:10 PM" },
    { id: "g-016", name: "Andrés Díaz", isCurrentUser: false, arrived: false },
  ]);

  const [photos, setPhotos] = useState<GuestPhoto[]>(INITIAL_PHOTOS);
  const [songs, setSongs] = useState<SongSuggestion[]>(INITIAL_SONGS);
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [qrState, setQrState] = useState<QRState>("ready");
  const [nowPlaying] = useState<NowPlaying>({ title: "Vivir Mi Vida", artist: "Marc Anthony", progress: 65 });

  const [notifications, setNotifications] = useState([
    { id: "n1", message: "🍽️ Dinner is ready!", read: false, timestamp: "8:00 PM", type: "timeline" },
    { id: "n2", message: "💃 Dance floor opens at 10 PM", read: false, timestamp: "7:45 PM", type: "timeline" },
    { id: "n3", message: "📸 Your photo got 5 likes!", read: true, timestamp: "7:30 PM", type: "social" },
    { id: "n4", message: "🎵 Your song suggestion got 3 votes!", read: false, timestamp: "8:10 PM", type: "social" },
    { id: "n5", message: "✅ Carlos just arrived at your table!", read: false, timestamp: "5:40 PM", type: "table" },
  ]);

  // Event is always "live" in this mock
  const isLive = true;
  const currentActivity = TIMELINE.find((t) => t.active) || null;

  // Simulate a guest arriving every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTableGuests((prev) => {
        const notArrived = prev.filter((g) => !g.arrived);
        if (notArrived.length === 0) return prev;
        const guest = notArrived[0];
        const time = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
        setNotifications((n) => [
          { id: `n-${Date.now()}`, message: `✅ ${guest.name} just arrived at your table!`, read: false, timestamp: time, type: "table" },
          ...n,
        ]);
        setFeed((f) => [
          { id: `f-${Date.now()}`, type: "checkin", message: `✅ ${guest.name} just arrived`, timestamp: time, reactions: {} },
          ...f,
        ]);
        return prev.map((g) => (g.id === guest.id ? { ...g, arrived: true, arrivedAt: time } : g));
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const uploadPhoto = useCallback((caption: string, filter?: string, frame?: string, sticker?: string) => {
    const newPhoto: GuestPhoto = {
      id: `p-${Date.now()}`,
      url: "",
      caption,
      uploadedBy: guest.name,
      uploadedById: guest.id,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      likes: 0,
      likedBy: [],
      reactions: {},
      filter,
      frame,
      sticker,
    };
    setPhotos((prev) => [newPhoto, ...prev]);
    setGuest((prev) => ({ ...prev, points: prev.points + 10 }));
    setFeed((prev) => [
      { id: `f-${Date.now()}`, type: "photo", message: `📸 ${guest.name} uploaded a new photo`, timestamp: newPhoto.timestamp, reactions: {} },
      ...prev,
    ]);
  }, [guest.name, guest.id]);

  const likePhoto = useCallback((photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId && !p.likedBy.includes(guest.id)
          ? { ...p, likes: p.likes + 1, likedBy: [...p.likedBy, guest.id] }
          : p
      )
    );
    setGuest((prev) => ({ ...prev, points: prev.points + 2 }));
  }, [guest.id]);

  const reactPhoto = useCallback((photoId: string, reaction: string) => {
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? { ...p, reactions: { ...p.reactions, [reaction]: (p.reactions[reaction] || 0) + 1 } }
          : p
      )
    );
  }, []);

  const reactFeed = useCallback((feedId: string, reaction: string) => {
    setFeed((prev) =>
      prev.map((f) => {
        if (f.id !== feedId) return f;
        const r = f.reactions || {};
        const users = r[reaction] || [];
        if (users.includes(guest.id)) return f;
        return { ...f, reactions: { ...r, [reaction]: [...users, guest.id] } };
      })
    );
    setGuest((prev) => ({ ...prev, points: prev.points + 1 }));
  }, [guest.id]);

  const suggestSong = useCallback((title: string, artist: string) => {
    const newSong: SongSuggestion = {
      id: `s-${Date.now()}`,
      title,
      artist,
      suggestedBy: guest.name,
      votes: 1,
      votedBy: [guest.id],
    };
    setSongs((prev) => [newSong, ...prev]);
    setGuest((prev) => ({ ...prev, points: prev.points + 5 }));
    setFeed((prev) => [
      { id: `f-${Date.now()}`, type: "song", message: `🎵 ${guest.name} suggested '${title}'`, timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), reactions: {} },
      ...prev,
    ]);
  }, [guest.name, guest.id]);

  const voteSong = useCallback((songId: string) => {
    setSongs((prev) =>
      prev.map((s) =>
        s.id === songId && !s.votedBy.includes(guest.id)
          ? { ...s, votes: s.votes + 1, votedBy: [...s.votedBy, guest.id] }
          : s
      )
    );
  }, [guest.id]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const checkIn = useCallback(() => {
    setGuest((prev) => ({ ...prev, checkedIn: true, points: prev.points + 15 }));
    setQrState("used");
    setNotifications((prev) => [
      { id: `n-${Date.now()}`, message: "🎉 You're checked in! +15 bonus points", read: false, timestamp: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }), type: "system" },
      ...prev,
    ]);
  }, []);

  return (
    <GuestAppContext.Provider
      value={{
        guest,
        tableGuests,
        photos,
        songs,
        feed,
        timeline: TIMELINE,
        leaderboard: LEADERBOARD,
        notifications,
        isLive,
        qrState,
        nowPlaying,
        currentActivity,
        uploadPhoto,
        likePhoto,
        reactPhoto,
        reactFeed,
        suggestSong,
        voteSong,
        markNotificationRead,
        checkIn,
      }}
    >
      {children}
    </GuestAppContext.Provider>
  );
}

export function useGuestApp() {
  const ctx = useContext(GuestAppContext);
  if (!ctx) throw new Error("useGuestApp must be used within GuestAppProvider");
  return ctx;
}
