import { motion } from "framer-motion";
import { Image, CheckCircle, XCircle, Flag, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const photos = [
  { id: 1, uploader: "María García", time: "5 min ago", status: "pending" },
  { id: 2, uploader: "Carlos López", time: "12 min ago", status: "pending" },
  { id: 3, uploader: "Ana Martínez", time: "20 min ago", status: "approved" },
  { id: 4, uploader: "Diego Morales", time: "25 min ago", status: "approved" },
  { id: 5, uploader: "Laura Fernández", time: "30 min ago", status: "flagged" },
  { id: 6, uploader: "Roberto Díaz", time: "35 min ago", status: "pending" },
  { id: 7, uploader: "Isabel Torres", time: "40 min ago", status: "approved" },
  { id: 8, uploader: "Fernando Reyes", time: "45 min ago", status: "approved" },
];

export default function EventAdminGalleryMod() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-display font-semibold">Gallery Moderation</h1>
        <p className="text-muted-foreground mt-1">Approve or remove photos uploaded by guests.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
        {[
          { label: "Total Photos", value: "312", icon: Image },
          { label: "Approved", value: "298", icon: CheckCircle },
          { label: "Pending", value: "8", icon: Eye },
          { label: "Flagged", value: "6", icon: Flag },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-border/50 p-4">
            <s.icon className="h-4 w-4 text-accent mb-2" />
            <p className="text-xl font-display font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="rounded-2xl border-border/50 overflow-hidden">
            <div className="aspect-square bg-muted/30 flex items-center justify-center">
              <Image className="h-12 w-12 text-muted-foreground/20" />
            </div>
            <div className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{photo.uploader}</p>
                <Badge variant="outline" className={`text-[10px] rounded-full ${
                  photo.status === "approved" ? "text-[hsl(var(--success))] border-[hsl(var(--success))]/30" :
                  photo.status === "flagged" ? "text-destructive border-destructive/30" :
                  "text-accent border-accent/30"
                }`}>
                  {photo.status}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground">{photo.time}</p>
              {photo.status === "pending" && (
                <div className="flex gap-2">
                  <Button variant="gold" size="sm" className="flex-1 h-7 text-xs rounded-lg">
                    <CheckCircle className="h-3 w-3 mr-1" /> Approve
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs rounded-lg">
                    <XCircle className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}
