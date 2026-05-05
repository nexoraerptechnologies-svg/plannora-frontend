import { Circle, RectangleHorizontal, Music, Heart, Disc3, Wine, Theater, Box } from "lucide-react";
import type { ElementType } from "@/hooks/useFloorPlanner";
import { Button } from "@/components/ui/button";

const elements: { type: ElementType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: "round-table", label: "Round Table", icon: Circle, desc: "8-10 seats" },
  { type: "rect-table", label: "Rect Table", icon: RectangleHorizontal, desc: "10 seats" },
  { type: "dance-floor", label: "Dance Floor", icon: Music, desc: "Dance area" },
  { type: "couple-table", label: "Couple Table", icon: Heart, desc: "Premium" },
  { type: "dj-booth", label: "DJ Booth", icon: Disc3, desc: "Sound booth" },
  { type: "bar", label: "Bar Area", icon: Wine, desc: "Drinks station" },
  { type: "stage", label: "Stage", icon: Theater, desc: "Performance" },
  { type: "custom", label: "Custom", icon: Box, desc: "Generic block" },
];

interface Props {
  onAddElement: (type: ElementType, x: number, y: number) => void;
  mode?: "list" | "grid";
}

export default function FloorPlannerSidebar({ onAddElement, mode = "list" }: Props) {
  const handleDragStart = (e: React.DragEvent, type: ElementType) => {
    e.dataTransfer.setData("element-type", type);
    e.dataTransfer.effectAllowed = "copy";
  };

  // Grid mode for bottom sheet on mobile
  if (mode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2 p-4">
        {elements.map((el) => (
          <Button
            key={el.type}
            variant="outline"
            onClick={() => onAddElement(el.type, 300, 300)}
            className="h-auto flex-col gap-1.5 py-4 rounded-2xl border-border/50 hover:border-accent/50 hover:bg-accent/5 touch-target"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <el.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium">{el.label}</span>
            <span className="text-[10px] text-muted-foreground">{el.desc}</span>
          </Button>
        ))}
      </div>
    );
  }

  // List mode for desktop sidebar
  return (
    <aside className="w-56 border-r border-border bg-background/80 backdrop-blur-xl flex flex-col shrink-0">
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Elements</h3>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {elements.map((el) => (
          <div
            key={el.type}
            draggable
            onDragStart={(e) => handleDragStart(e, el.type)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-grab active:cursor-grabbing hover:bg-accent/10 border border-transparent hover:border-border/50 transition-all group"
          >
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-accent/20 transition-colors shrink-0">
              <el.icon className="h-4 w-4 text-muted-foreground group-hover:text-accent" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{el.label}</p>
              <p className="text-[10px] text-muted-foreground">{el.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
