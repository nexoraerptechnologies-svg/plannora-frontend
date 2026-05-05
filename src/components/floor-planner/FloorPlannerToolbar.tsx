import { ZoomIn, ZoomOut, Maximize2, Grid3X3, Plus, Copy, Save, Search, QrCode, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import type { Floor } from "@/hooks/useFloorPlanner";
import { toast } from "sonner";

interface Props {
  floors: Floor[];
  activeFloor: Floor;
  zoom: number;
  showGrid: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setActiveFloorId: (id: string) => void;
  addFloor: () => void;
  duplicateFloor: (id: string) => void;
  deleteFloor: (id: string) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  toggleGrid: () => void;
  compact?: boolean;
}

export default function FloorPlannerToolbar({
  floors,
  activeFloor,
  zoom,
  showGrid,
  searchQuery,
  setSearchQuery,
  setActiveFloorId,
  addFloor,
  duplicateFloor,
  deleteFloor,
  zoomIn,
  zoomOut,
  resetZoom,
  toggleGrid,
  compact,
}: Props) {
  if (compact) {
    // Mobile compact toolbar
    return (
      <>
        {/* Floor selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1 h-8 min-w-0 max-w-[120px]">
              <span className="truncate">{activeFloor.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {floors.map((f) => (
              <DropdownMenuItem key={f.id} onClick={() => setActiveFloorId(f.id)} className={f.id === activeFloor.id ? "bg-accent/20 font-medium" : ""}>
                {f.name}
                <span className="ml-auto text-[10px] text-muted-foreground">{f.items.length}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={addFloor}><Plus className="h-3.5 w-3.5 mr-2" /> Add Floor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant={showGrid ? "secondary" : "ghost"} size="icon" onClick={toggleGrid} className="h-8 w-8 rounded-lg shrink-0">
          <Grid3X3 className="h-3.5 w-3.5" />
        </Button>

        <span className="text-[10px] text-muted-foreground w-8 text-center shrink-0">{Math.round(zoom * 100)}%</span>

        <div className="flex-1" />

        <Button variant="gold" size="sm" className="rounded-xl text-xs gap-1 h-8 shrink-0" onClick={() => toast.success("Layout saved!")}>
          <Save className="h-3 w-3" /> Save
        </Button>
      </>
    );
  }

  return (
    <div className="h-12 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-2 sm:px-3 gap-1.5 sm:gap-2 shrink-0">
      {/* Floor selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 min-w-[100px] sm:min-w-[140px] justify-start">
            <span className="truncate">{activeFloor.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {floors.map((f) => (
            <DropdownMenuItem key={f.id} onClick={() => setActiveFloorId(f.id)} className={f.id === activeFloor.id ? "bg-accent/20 font-medium" : ""}>
              {f.name}
              <span className="ml-auto text-[10px] text-muted-foreground">{f.items.length} items</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={addFloor}><Plus className="h-3.5 w-3.5 mr-2" /> Add Floor</DropdownMenuItem>
          <DropdownMenuItem onClick={() => duplicateFloor(activeFloor.id)}><Copy className="h-3.5 w-3.5 mr-2" /> Duplicate Floor</DropdownMenuItem>
          {floors.length > 1 && (
            <DropdownMenuItem onClick={() => deleteFloor(activeFloor.id)} className="text-destructive">Delete Floor</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-5 w-px bg-border mx-0.5 sm:mx-1 hidden sm:block" />

      {/* Zoom - hidden on smallest screens, shown in floating controls */}
      <div className="hidden sm:flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={zoomOut} className="h-8 w-8 rounded-lg"><ZoomOut className="h-3.5 w-3.5" /></Button>
        <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
        <Button variant="ghost" size="icon" onClick={zoomIn} className="h-8 w-8 rounded-lg"><ZoomIn className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" onClick={resetZoom} className="h-8 w-8 rounded-lg"><Maximize2 className="h-3.5 w-3.5" /></Button>
      </div>

      <div className="h-5 w-px bg-border mx-0.5 sm:mx-1 hidden sm:block" />

      <Button variant={showGrid ? "secondary" : "ghost"} size="icon" onClick={toggleGrid} className="h-8 w-8 rounded-lg">
        <Grid3X3 className="h-3.5 w-3.5" />
      </Button>

      <div className="flex-1" />

      {/* Search - hidden on small screens */}
      <div className="relative hidden lg:block">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Find my table..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 w-44 pl-8 text-xs rounded-xl bg-muted/50 border-border/50"
        />
      </div>

      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hidden sm:inline-flex" onClick={() => toast.info("Guest preview mode coming soon")}>
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hidden sm:inline-flex" onClick={() => toast.info("QR access mode coming soon")}>
        <QrCode className="h-3.5 w-3.5" />
      </Button>

      <Button variant="gold" size="sm" className="rounded-xl text-xs gap-1.5" onClick={() => toast.success("Layout saved!")}>
        <Save className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Save</span>
      </Button>
    </div>
  );
}
