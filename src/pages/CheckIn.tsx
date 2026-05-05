import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine, Camera, CheckCircle2, AlertTriangle, X, Shield, Wifi, WifiOff,
  Zap, Users, XCircle, Clock, Activity, ChevronDown, Volume2, VolumeX, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useAccessControl, type AccessMode, type EntrancePoint, type ScanErrorType, type Guest } from "@/context/AccessControlContext";
import ScanResult from "@/components/check-in/ScanResult";
import ScanHistory from "@/components/check-in/ScanHistory";
import LiveStats from "@/components/check-in/LiveStats";

type ScanState = "idle" | "scanning" | "result";

export default function CheckIn() {
  const { guests, checkInGuest, stats, scanHistory, offlineQueue, isOnline, syncOffline } = useAccessControl();
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [selectedGuestId, setSelectedGuestId] = useState("");
  const [accessMode, setAccessMode] = useState<AccessMode>("normal");
  const [entrance, setEntrance] = useState<EntrancePoint>("Main Entrance");
  const [autoNext, setAutoNext] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastResult, setLastResult] = useState<{ type: "success" | "warning" | "error"; errorType?: ScanErrorType; guest?: Guest } | null>(null);
  const [activeTab, setActiveTab] = useState("scanner");
  const autoNextTimer = useRef<NodeJS.Timeout>();

  // Scan speed tracking
  const [scansPerMinute, setScansPerMinute] = useState(0);
  const scanTimestamps = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      scanTimestamps.current = scanTimestamps.current.filter((t) => now - t < 60000);
      setScansPerMinute(scanTimestamps.current.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const playSound = useCallback((type: "success" | "error") => {
    if (!soundEnabled) return;
    // Web Audio API beep
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = type === "success" ? 880 : 300;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + (type === "success" ? 0.15 : 0.3));
    } catch {}
  }, [soundEnabled]);

  const simulateScan = useCallback(() => {
    if (!selectedGuestId) return;
    setScanState("scanning");

    setTimeout(() => {
      const result = checkInGuest(selectedGuestId, entrance, accessMode);
      scanTimestamps.current.push(Date.now());

      if (result.success) {
        setLastResult({ type: "success", guest: result.guest });
        playSound("success");
      } else if (result.errorType === "already-checked-in") {
        setLastResult({ type: "warning", errorType: result.errorType, guest: result.guest });
        playSound("error");
      } else {
        setLastResult({ type: "error", errorType: result.errorType, guest: result.guest });
        playSound("error");
      }

      setScanState("result");
      setSelectedGuestId("");

      if (autoNext) {
        autoNextTimer.current = setTimeout(() => {
          setScanState("idle");
          setLastResult(null);
        }, 2500);
      }
    }, 800);
  }, [selectedGuestId, checkInGuest, entrance, accessMode, playSound, autoNext]);

  const reset = () => {
    clearTimeout(autoNextTimer.current);
    setScanState("idle");
    setLastResult(null);
  };

  const isHighTraffic = scansPerMinute >= 5;
  const percentage = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;
  const denied = scanHistory.filter((s) => s.result === "denied").length;

  const modeColors: Record<AccessMode, string> = {
    normal: "bg-accent/10 text-accent border-accent/30",
    strict: "bg-destructive/10 text-destructive border-destructive/30",
    vip: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)] border-[hsl(45,93%,47%)]/30",
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Mode & Status Bar */}
      <div className="px-4 py-2 flex items-center gap-2 border-b border-border/10 bg-card/50">
        <Badge variant="outline" className={`text-[9px] rounded-full ${modeColors[accessMode]}`}>
          {accessMode === "vip" ? "VIP" : accessMode.charAt(0).toUpperCase() + accessMode.slice(1)} Mode
        </Badge>
        <Badge variant="outline" className={`text-[9px] rounded-full ${isOnline ? "text-[hsl(var(--success))] border-[hsl(var(--success))]/30" : "text-destructive border-destructive/30"}`}>
          {isOnline ? <Wifi className="h-2.5 w-2.5 mr-1" /> : <WifiOff className="h-2.5 w-2.5 mr-1" />}
          {isOnline ? "Online" : `Offline (${offlineQueue.length})`}
        </Badge>
        {isHighTraffic && (
          <Badge variant="outline" className="text-[9px] rounded-full text-[hsl(38,92%,50%)] border-[hsl(38,92%,50%)]/30 animate-pulse">
            <Zap className="h-2.5 w-2.5 mr-1" /> High Traffic
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />}
          </Button>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="px-4 py-2 flex gap-3 text-center border-b border-border/10">
        <div className="flex-1">
          <p className="text-lg font-display font-bold text-[hsl(var(--success))]">{stats.checkedIn}</p>
          <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Scanned</p>
        </div>
        <div className="flex-1">
          <p className="text-lg font-display font-bold text-accent">{stats.pending}</p>
          <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Pending</p>
        </div>
        <div className="flex-1">
          <p className="text-lg font-display font-bold text-destructive">{denied}</p>
          <p className="text-[8px] text-muted-foreground uppercase tracking-wider">Denied</p>
        </div>
        <div className="flex-1">
          <p className="text-lg font-display font-bold">{scansPerMinute}</p>
          <p className="text-[8px] text-muted-foreground uppercase tracking-wider">/min</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 bg-muted/30 rounded-xl">
          <TabsTrigger value="scanner" className="rounded-lg text-xs gap-1.5"><ScanLine className="h-3 w-3" /> Scanner</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg text-xs gap-1.5"><Clock className="h-3 w-3" /> History</TabsTrigger>
          <TabsTrigger value="stats" className="rounded-lg text-xs gap-1.5"><Activity className="h-3 w-3" /> Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="flex-1 flex flex-col items-center justify-center p-4 max-w-md mx-auto w-full mt-0">
          <AnimatePresence mode="wait">
            {scanState === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full space-y-4">
                {/* Camera viewfinder */}
                <Card className="bg-card border-border/30 rounded-2xl overflow-hidden aspect-[4/3] relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card" />
                  <div className="relative flex flex-col items-center gap-3">
                    <Camera className="h-12 w-12 text-muted-foreground/20" />
                    <div className="w-40 h-40 border-2 border-accent/40 rounded-2xl relative">
                      <motion.div animate={{ top: ["10%", "80%", "10%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute left-2 right-2 h-0.5 bg-accent/60 rounded-full" />
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent rounded-tl-md" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent rounded-tr-md" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent rounded-bl-md" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent rounded-br-md" />
                    </div>
                    <p className="text-[10px] text-muted-foreground">Point camera at guest QR code</p>
                  </div>
                </Card>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-2">
                  <Select value={accessMode} onValueChange={(v) => setAccessMode(v as AccessMode)}>
                    <SelectTrigger className="rounded-xl bg-card border-border/30 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal Mode</SelectItem>
                      <SelectItem value="strict">Strict Mode</SelectItem>
                      <SelectItem value="vip">VIP Control</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={entrance} onValueChange={(v) => setEntrance(v as EntrancePoint)}>
                    <SelectTrigger className="rounded-xl bg-card border-border/30 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Entrance">Main Entrance</SelectItem>
                      <SelectItem value="VIP Entrance">VIP Entrance</SelectItem>
                      <SelectItem value="Side Gate">Side Gate</SelectItem>
                      <SelectItem value="Service Entrance">Service Entrance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={selectedGuestId} onValueChange={setSelectedGuestId}>
                  <SelectTrigger className="rounded-xl bg-card border-border/30 h-11">
                    <SelectValue placeholder="Simulate: Select guest to scan..." />
                  </SelectTrigger>
                  <SelectContent>
                    {guests.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        <span className="flex items-center gap-2">
                          {g.name}
                          {g.status === "checked-in" && <CheckCircle2 className="h-3 w-3 text-[hsl(var(--success))]" />}
                          {g.tags.includes("VIP") && <Badge variant="outline" className="text-[8px] py-0 px-1 rounded-full border-[hsl(45,93%,47%)]/50 text-[hsl(45,93%,47%)]">VIP</Badge>}
                          {!g.confirmed && <Badge variant="outline" className="text-[8px] py-0 px-1 rounded-full border-destructive/50 text-destructive">Unconfirmed</Badge>}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button variant="gold" className="flex-1 h-12 rounded-2xl text-sm font-medium gap-2" onClick={simulateScan} disabled={!selectedGuestId}>
                    <ScanLine className="h-4 w-4" /> Scan QR Code
                  </Button>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} className="rounded" />
                    Auto-next (2.5s)
                  </label>
                </div>
              </motion.div>
            )}

            {scanState === "scanning" && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-16 h-16 border-3 border-accent/20 border-t-accent rounded-full" />
                <p className="text-sm text-muted-foreground">Validating QR code...</p>
              </motion.div>
            )}

            {scanState === "result" && lastResult && (
              <ScanResult result={lastResult} onReset={reset} />
            )}
          </AnimatePresence>

          {/* Check-in progress bar */}
          {scanState === "idle" && (
            <div className="w-full mt-4 px-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-muted-foreground">Check-in Progress</span>
                <span className="text-[10px] font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4 mt-0 overflow-y-auto">
          <ScanHistory history={scanHistory} offlineQueue={offlineQueue} onSync={syncOffline} isOnline={isOnline} />
        </TabsContent>

        <TabsContent value="stats" className="flex-1 p-4 mt-0 overflow-y-auto">
          <LiveStats stats={stats} scanHistory={scanHistory} scansPerMinute={scansPerMinute} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
