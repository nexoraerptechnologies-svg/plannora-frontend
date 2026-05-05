import { useRef, useCallback, useState, useEffect } from "react";
import FloorElement from "./FloorElement";
import type { FloorElement as FloorElementType, ElementType } from "@/hooks/useFloorPlanner";

interface Props {
  items: FloorElementType[];
  zoom: number;
  showGrid: boolean;
  selectedId: string | null;
  highlightedId: string | null;
  setSelectedId: (id: string | null) => void;
  addElement: (type: ElementType, x: number, y: number) => void;
  moveElement: (id: string, x: number, y: number) => void;
  resizeElement: (id: string, w: number, h: number) => void;
  rotateElement: (id: string, deg: number) => void;
  deleteElement: (id: string) => void;
  enableTouch?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export default function FloorPlannerCanvas({
  items,
  zoom,
  showGrid,
  selectedId,
  highlightedId,
  setSelectedId,
  addElement,
  moveElement,
  resizeElement,
  rotateElement,
  deleteElement,
  enableTouch,
  onZoomChange,
}: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });

  // Auto-fit on mount
  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    const container = containerRef.current;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    // Center the canvas
    setPanOffset({ x: Math.max(0, (cw - 2000 * zoom) / 2), y: Math.max(0, (ch - 1400 * zoom) / 2) });
  }, []); // only on mount

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const type = e.dataTransfer.getData("element-type") as ElementType;
      if (!type || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - 50;
      const y = (e.clientY - rect.top) / zoom - 50;
      addElement(type, x, y);
    },
    [addElement, zoom]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // Touch panning
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single finger - could be pan on empty area
      const target = e.target as HTMLElement;
      if (target === containerRef.current || target.dataset.canvas === "true") {
        setIsPanning(true);
        panStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          ox: panOffset.x,
          oy: panOffset.y,
        };
      }
    }
  }, [panOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      const dx = e.touches[0].clientX - panStart.current.x;
      const dy = e.touches[0].clientY - panStart.current.y;
      setPanOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
    }
  }, [isPanning]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Mouse panning (middle click or when clicking empty canvas area on desktop)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target === containerRef.current || target.dataset.canvas === "true") {
      setSelectedId(null);
      if (e.button === 1 || e.altKey) {
        e.preventDefault();
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY, ox: panOffset.x, oy: panOffset.y };
      }
    }
  }, [setSelectedId, panOffset]);

  useEffect(() => {
    if (!isPanning) return;
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setPanOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
    };
    const handleUp = () => setIsPanning(false);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [isPanning]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      // This would need to call parent zoom - for now just prevent default scroll
    }
  }, []);

  const gridSize = showGrid ? (zoom < 0.5 ? 40 : 20) : 0;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-surface relative touch-none"
      onMouseDown={handleMouseDown}
      onTouchStart={enableTouch ? handleTouchStart : undefined}
      onTouchMove={enableTouch ? handleTouchMove : undefined}
      onTouchEnd={enableTouch ? handleTouchEnd : undefined}
      onWheel={handleWheel}
      data-canvas="true"
    >
      <div
        ref={canvasRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative origin-top-left"
        style={{
          width: 2000,
          height: 1400,
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
          backgroundImage: showGrid
            ? `linear-gradient(hsl(var(--border)/0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.3) 1px, transparent 1px)`
            : "none",
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
        data-canvas="true"
      >
        {items.map((el) => (
          <FloorElement
            key={el.id}
            element={el}
            isSelected={selectedId === el.id}
            isHighlighted={highlightedId === el.id}
            zoom={zoom}
            onSelect={() => setSelectedId(el.id)}
            onMove={(x, y) => moveElement(el.id, x, y)}
            onResize={(w, h) => resizeElement(el.id, w, h)}
            onRotate={(deg) => rotateElement(el.id, deg)}
            onDelete={() => deleteElement(el.id)}
            enableTouch={enableTouch}
          />
        ))}
      </div>
    </div>
  );
}
