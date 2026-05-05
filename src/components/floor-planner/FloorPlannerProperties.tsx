import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Trash2, RotateCw, X } from "lucide-react";
import type { FloorElement } from "@/hooks/useFloorPlanner";

interface Props {
  element: FloorElement;
  onUpdate: (id: string, updates: Partial<FloorElement>) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

export default function FloorPlannerProperties({ element, onUpdate, onDelete, compact }: Props) {
  if (compact) {
    // Mobile bottom panel
    return (
      <div className="bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="px-4 py-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{element.label}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{element.type.replace("-", " ")}</p>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={() => onUpdate(element.id, { rotation: (element.rotation + 45) % 360 })}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl text-destructive"
                onClick={() => onDelete(element.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick controls */}
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Label</Label>
              <Input
                value={element.label}
                onChange={(e) => onUpdate(element.id, { label: e.target.value })}
                className="h-9 text-xs rounded-xl"
              />
            </div>
            {element.seats !== undefined && (
              <div className="w-20 space-y-1">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Seats</Label>
                <Input
                  type="number"
                  value={element.seats}
                  onChange={(e) => onUpdate(element.id, { seats: Math.max(1, +e.target.value) })}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Rotation slider */}
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Rotation ({element.rotation}°)</Label>
            <Slider
              value={[element.rotation]}
              min={0}
              max={360}
              step={15}
              onValueChange={([v]) => onUpdate(element.id, { rotation: v })}
            />
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <aside className="w-56 border-l border-border bg-background/80 backdrop-blur-xl flex flex-col shrink-0">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Properties</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive" onClick={() => onDelete(element.id)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Label</Label>
          <Input
            value={element.label}
            onChange={(e) => onUpdate(element.id, { label: e.target.value })}
            className="h-8 text-xs rounded-lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">X</Label>
            <Input type="number" value={Math.round(element.x)} onChange={(e) => onUpdate(element.id, { x: +e.target.value })} className="h-8 text-xs rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Y</Label>
            <Input type="number" value={Math.round(element.y)} onChange={(e) => onUpdate(element.id, { y: +e.target.value })} className="h-8 text-xs rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Width</Label>
            <Input type="number" value={Math.round(element.width)} onChange={(e) => onUpdate(element.id, { width: Math.max(40, +e.target.value) })} className="h-8 text-xs rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Height</Label>
            <Input type="number" value={Math.round(element.height)} onChange={(e) => onUpdate(element.id, { height: Math.max(40, +e.target.value) })} className="h-8 text-xs rounded-lg" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Rotation ({element.rotation}°)</Label>
          <Slider
            value={[element.rotation]}
            min={0}
            max={360}
            step={15}
            onValueChange={([v]) => onUpdate(element.id, { rotation: v })}
          />
        </div>

        {element.seats !== undefined && (
          <div className="space-y-1.5">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Seats</Label>
            <Input type="number" value={element.seats} onChange={(e) => onUpdate(element.id, { seats: Math.max(1, +e.target.value) })} className="h-8 text-xs rounded-lg" />
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground">Type: <span className="font-medium text-foreground">{element.type}</span></p>
          <p className="text-[10px] text-muted-foreground">ID: <span className="font-mono">{element.id.slice(0, 12)}</span></p>
        </div>
      </div>
    </aside>
  );
}
