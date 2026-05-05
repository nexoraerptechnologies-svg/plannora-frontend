import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, WifiOff, Upload, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ScanRecord } from "@/context/AccessControlContext";

interface ScanHistoryProps {
  history: ScanRecord[];
  offlineQueue: ScanRecord[];
  onSync: () => void;
  isOnline: boolean;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export default function ScanHistory({ history, offlineQueue, onSync, isOnline }: ScanHistoryProps) {
  const allRecords = [...history];
  const icons = { success: CheckCircle2, warning: AlertTriangle, denied: XCircle };
  const colors = {
    success: "text-[hsl(var(--success))]",
    warning: "text-[hsl(38,92%,50%)]",
    denied: "text-destructive",
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {offlineQueue.length > 0 && (
        <Card className="rounded-2xl border-[hsl(38,92%,50%)]/30 bg-[hsl(38,92%,50%)]/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <WifiOff className="h-4 w-4 text-[hsl(38,92%,50%)]" />
              <div>
                <p className="text-sm font-medium text-[hsl(38,92%,50%)]">{offlineQueue.length} pending sync</p>
                <p className="text-[10px] text-muted-foreground">Scans stored locally</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-[hsl(38,92%,50%)]/30" onClick={onSync} disabled={!isOnline}>
              <Upload className="h-3 w-3" /> Sync
            </Button>
          </div>
        </Card>
      )}

      {allRecords.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">No scans yet</p>
          <p className="text-[10px] text-muted-foreground mt-1">Start scanning to see history</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allRecords.map((record, i) => {
            const Icon = icons[record.result];
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className="rounded-xl border-border/30 p-3 flex items-center gap-3">
                  <Icon className={`h-4 w-4 shrink-0 ${colors[record.result]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{record.guestName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{timeAgo(record.timestamp)}</span>
                      {record.reason && <span className="text-[10px] text-muted-foreground">• {record.reason}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5" />
                    {record.entrance.split(" ")[0]}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
