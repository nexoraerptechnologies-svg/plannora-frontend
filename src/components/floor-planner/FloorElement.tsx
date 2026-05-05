import { useRef, useState, useCallback, useEffect } from "react";
import { Trash2, RotateCw } from "lucide-react";
import { Circle, RectangleHorizontal, Music, Heart, Disc3, Wine, Theater, Box } from "lucide-react";
import type { FloorElement as FloorElementType, ElementType } from "@/hooks/useFloorPlanner";

const ICON_MAP: Record<ElementType, React.ElementType> = {
  "round-table": Circle,
  "rect-table": RectangleHorizontal,
  "dance-floor": Music,
  "couple-table": Heart,
  "dj-booth": Disc3,
  "bar": Wine,
  "stage": Theater,
  "custom": Box,
};

const TYPE_COLORS: Record<ElementType, string> = {
  "round-table": "bg-muted border-border",
  "rect-table": "bg-muted border-border",
  "dance-floor": "bg-accent/10 border-accent/30",
  "couple-table": "bg-accent/20 border-accent/50",
  "dj-booth": "bg-muted border-border",
  "bar": "bg-muted border-border",
  "stage": "bg-muted border-border",
  "custom": "bg-muted border-border",
};

interface Props {
  element: FloorElementType;
  isSelected: boolean;
  isHighlighted: boolean;
  zoom: number;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  onRotate: (deg: number) => void;
  onDelete: () => void;
  enableTouch?: boolean;
}

export default function FloorElement({
  element,
  isSelected,
  isHighlighted,
  zoom,
  onSelect,
  onMove,
  onResize,
  onRotate,
  onDelete,
  enableTouch,
}: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const dragStart = useRef({ mx: 0, my: 0, ex: 0, ey: 0 });
  const resizeStart = useRef({ mx: 0, my: 0, ew: 0, eh: 0 });

  const Icon = ICON_MAP[element.type];
  const isRound = element.type === "round-table";

  // Mouse drag
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).dataset.handle) return;
      e.stopPropagation();
      onSelect();
      setDragging(true);
      dragStart.current = { mx: e.clientX, my: e.clientY, ex: element.x, ey: element.y };
    },
    [element.x, element.y, onSelect]
  );

  // Touch drag
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).dataset.handle) return;
      e.stopPropagation();
      onSelect();
      setDragging(true);
      const touch = e.touches[0];
      dragStart.current = { mx: touch.clientX, my: touch.clientY, ex: element.x, ey: element.y };
    },
    [element.x, element.y, onSelect]
  );

  useEffect(() => {
    if (!dragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragStart.current.mx) / zoom;
      const dy = (e.clientY - dragStart.current.my) / zoom;
      onMove(dragStart.current.ex + dx, dragStart.current.ey + dy);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = (touch.clientX - dragStart.current.mx) / zoom;
      const dy = (touch.clientY - dragStart.current.my) / zoom;
      onMove(dragStart.current.ex + dx, dragStart.current.ey + dy);
    };
    const handleEnd = () => setDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [dragging, zoom, onMove]);

  // Resize
  const handleResizeDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setResizing(true);
      resizeStart.current = { mx: e.clientX, my: e.clientY, ew: element.width, eh: element.height };
    },
    [element.width, element.height]
  );

  const handleResizeTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      setResizing(true);
      const touch = e.touches[0];
      resizeStart.current = { mx: touch.clientX, my: touch.clientY, ew: element.width, eh: element.height };
    },
    [element.width, element.height]
  );

  useEffect(() => {
    if (!resizing) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = (e.clientX - resizeStart.current.mx) / zoom;
      const dy = (e.clientY - resizeStart.current.my) / zoom;
      onResize(resizeStart.current.ew + dx, resizeStart.current.eh + dy);
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = (touch.clientX - resizeStart.current.mx) / zoom;
      const dy = (touch.clientY - resizeStart.current.my) / zoom;
      onResize(resizeStart.current.ew + dx, resizeStart.current.eh + dy);
    };
    const handleEnd = () => setResizing(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [resizing, zoom, onResize]);

  return (
    <div
      ref={elRef}
      onMouseDown={handleMouseDown}
      onTouchStart={enableTouch ? handleTouchStart : undefined}
      className={`absolute group transition-shadow duration-200 select-none touch-none ${dragging ? "z-30 cursor-grabbing" : "cursor-grab z-10"}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        transform: `rotate(${element.rotation}deg)`,
      }}
    >
      {/* Body */}
      <div
        className={`w-full h-full border-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-200
          ${TYPE_COLORS[element.type]}
          ${isRound ? "rounded-full" : "rounded-xl"}
          ${isSelected ? "!border-accent shadow-[0_0_0_2px_hsl(var(--accent)/0.3)]" : ""}
          ${isHighlighted ? "!border-accent ring-4 ring-accent/40 shadow-lg" : ""}
          ${element.type === "couple-table" ? "bg-gradient-to-br from-accent/20 to-accent/5" : ""}
        `}
      >
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-[9px] font-medium text-muted-foreground leading-tight text-center px-1 truncate max-w-full">
          {element.label}
        </span>
        {element.seats && (
          <span className="text-[8px] text-muted-foreground/60">{element.seats} seats</span>
        )}
      </div>

      {/* Controls when selected */}
      {isSelected && (
        <>
          {/* Resize handle - larger touch target */}
          <div
            data-handle="resize"
            onMouseDown={handleResizeDown}
            onTouchStart={enableTouch ? handleResizeTouchStart : undefined}
            className="absolute -bottom-2 -right-2 w-5 h-5 sm:w-3.5 sm:h-3.5 rounded-sm bg-accent border-2 border-background cursor-se-resize z-40"
          />
          {/* Rotate button - larger on touch */}
          <button
            data-handle="rotate"
            onClick={(e) => { e.stopPropagation(); onRotate((element.rotation + 45) % 360); }}
            onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onRotate((element.rotation + 45) % 360); }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-6 sm:h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform z-40"
          >
            <RotateCw className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
          </button>
          {/* Delete button - larger on touch */}
          <button
            data-handle="delete"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); onDelete(); }}
            className="absolute -top-2 -right-3 w-7 h-7 sm:w-5 sm:h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-transform z-40"
          >
            <Trash2 className="h-3 w-3 sm:h-2.5 sm:w-2.5" />
          </button>
        </>
      )}
    </div>
  );
}
