import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Home, Users, Camera, Image, Music, QrCode, Bell, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { GuestAppProvider, useGuestApp } from "@/context/GuestAppContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTranslate } from "@/i18n/LanguageContext";

function GuestAppShell() {
  const { slug, guestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications } = useGuestApp();
  const { t } = useTranslate();

  const base = `/event/${slug}/guest/${guestId}/app`;
  const currentTab = location.pathname.split("/app/")[1] || "home";
  const isDJMode = currentTab === "dj";

  const tabs = isDJMode
    ? [
        { id: "dj", icon: Headphones, label: "DJ Booth" },
        { id: "home", icon: Home, label: t("guestApp.home") },
        { id: "music", icon: Music, label: t("guestApp.music") },
      ]
    : [
        { id: "home", icon: Home, label: t("guestApp.home") },
        { id: "table", icon: Users, label: t("guestApp.myTable") },
        { id: "camera", icon: Camera, label: t("guestApp.camera") },
        { id: "gallery", icon: Image, label: t("guestApp.gallery") },
        { id: "music", icon: Music, label: t("guestApp.music") },
        { id: "qr", icon: QrCode, label: t("guestApp.qr") },
      ];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-xl sticky top-0 z-50 border-b border-border/10">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">Planora</p>
          <p className="text-[8px] text-muted-foreground tracking-wider">{t("common.byNexora")}</p>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle variant="icon" />
          <button
            onClick={() => navigate(`${base}/notifications`)}
            className="relative p-2 rounded-full hover:bg-muted/20 transition-colors"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full text-[9px] font-bold flex items-center justify-center text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Tabs */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-xl border-t border-border/10 z-50 safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(`${base}/${tab.id}`)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 relative"
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-2 w-6 h-0.5 bg-accent rounded-full"
                  />
                )}
                <tab.icon
                  className={`h-5 w-5 transition-colors ${isActive ? "text-accent" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-[9px] transition-colors ${isActive ? "text-accent font-medium" : "text-muted-foreground"}`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export default function GuestAppLayout() {
  const { guestId } = useParams();
  return (
    <GuestAppProvider guestId={guestId || "g-001"}>
      <GuestAppShell />
    </GuestAppProvider>
  );
}
