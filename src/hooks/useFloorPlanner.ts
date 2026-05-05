import { useState, useCallback } from "react";

export type ElementType = "round-table" | "rect-table" | "dance-floor" | "couple-table" | "dj-booth" | "bar" | "stage" | "custom";

export interface FloorElement {
  id: string;
  type: ElementType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  seats?: number;
}

export interface Floor {
  id: string;
  name: string;
  items: FloorElement[];
}

const ELEMENT_DEFAULTS: Record<ElementType, Omit<FloorElement, "id" | "x" | "y">> = {
  "round-table": { type: "round-table", label: "Round Table", width: 100, height: 100, rotation: 0, seats: 8 },
  "rect-table": { type: "rect-table", label: "Rect Table", width: 140, height: 70, rotation: 0, seats: 10 },
  "dance-floor": { type: "dance-floor", label: "Dance Floor", width: 200, height: 200, rotation: 0 },
  "couple-table": { type: "couple-table", label: "Couple Table", width: 120, height: 60, rotation: 0, seats: 2 },
  "dj-booth": { type: "dj-booth", label: "DJ Booth", width: 100, height: 60, rotation: 0 },
  "bar": { type: "bar", label: "Bar", width: 160, height: 50, rotation: 0 },
  "stage": { type: "stage", label: "Stage", width: 240, height: 120, rotation: 0 },
  "custom": { type: "custom", label: "Custom", width: 80, height: 80, rotation: 0 },
};

const GRID_SIZE = 20;

function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

let idCounter = 0;
function genId() {
  return `el-${Date.now()}-${++idCounter}`;
}

const defaultFloors: Floor[] = [
  {
    id: "floor-1",
    name: "Ground Floor",
    items: [
      { id: "el-1", type: "couple-table", label: "Couple Table", x: 400, y: 100, width: 120, height: 60, rotation: 0, seats: 2 },
      { id: "el-2", type: "round-table", label: "Table 1", x: 100, y: 260, width: 100, height: 100, rotation: 0, seats: 8 },
      { id: "el-3", type: "round-table", label: "Table 2", x: 300, y: 260, width: 100, height: 100, rotation: 0, seats: 8 },
      { id: "el-4", type: "round-table", label: "Table 3", x: 500, y: 260, width: 100, height: 100, rotation: 0, seats: 8 },
      { id: "el-5", type: "dance-floor", label: "Dance Floor", x: 260, y: 440, width: 200, height: 200, rotation: 0 },
      { id: "el-6", type: "dj-booth", label: "DJ Booth", x: 300, y: 680, width: 100, height: 60, rotation: 0 },
      { id: "el-7", type: "bar", label: "Bar", x: 620, y: 440, width: 160, height: 50, rotation: 0 },
    ],
  },
  {
    id: "floor-2",
    name: "Second Floor",
    items: [
      { id: "el-8", type: "rect-table", label: "VIP Table", x: 200, y: 200, width: 140, height: 70, rotation: 0, seats: 10 },
      { id: "el-9", type: "bar", label: "Lounge Bar", x: 500, y: 200, width: 160, height: 50, rotation: 0 },
    ],
  },
  { id: "floor-3", name: "Rooftop", items: [] },
];

export function useFloorPlanner() {
  const [floors, setFloors] = useState<Floor[]>(defaultFloors);
  const [activeFloorId, setActiveFloorId] = useState(defaultFloors[0].id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const activeFloor = floors.find((f) => f.id === activeFloorId)!;
  const selectedElement = activeFloor.items.find((el) => el.id === selectedId) || null;

  const updateFloorItems = useCallback(
    (updater: (items: FloorElement[]) => FloorElement[]) => {
      setFloors((prev) =>
        prev.map((f) => (f.id === activeFloorId ? { ...f, items: updater(f.items) } : f))
      );
    },
    [activeFloorId]
  );

  const addElement = useCallback(
    (type: ElementType, x: number, y: number) => {
      const defaults = ELEMENT_DEFAULTS[type];
      const el: FloorElement = { ...defaults, id: genId(), x: snapToGrid(x), y: snapToGrid(y) };
      updateFloorItems((items) => [...items, el]);
      setSelectedId(el.id);
    },
    [updateFloorItems]
  );

  const moveElement = useCallback(
    (id: string, x: number, y: number) => {
      updateFloorItems((items) =>
        items.map((el) => (el.id === id ? { ...el, x: snapToGrid(x), y: snapToGrid(y) } : el))
      );
    },
    [updateFloorItems]
  );

  const resizeElement = useCallback(
    (id: string, width: number, height: number) => {
      updateFloorItems((items) =>
        items.map((el) =>
          el.id === id ? { ...el, width: Math.max(40, width), height: Math.max(40, height) } : el
        )
      );
    },
    [updateFloorItems]
  );

  const rotateElement = useCallback(
    (id: string, rotation: number) => {
      updateFloorItems((items) =>
        items.map((el) => (el.id === id ? { ...el, rotation } : el))
      );
    },
    [updateFloorItems]
  );

  const updateElement = useCallback(
    (id: string, updates: Partial<FloorElement>) => {
      updateFloorItems((items) =>
        items.map((el) => (el.id === id ? { ...el, ...updates } : el))
      );
    },
    [updateFloorItems]
  );

  const deleteElement = useCallback(
    (id: string) => {
      updateFloorItems((items) => items.filter((el) => el.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [updateFloorItems, selectedId]
  );

  const addFloor = useCallback(() => {
    const newFloor: Floor = { id: `floor-${Date.now()}`, name: `Floor ${floors.length + 1}`, items: [] };
    setFloors((prev) => [...prev, newFloor]);
    setActiveFloorId(newFloor.id);
    setSelectedId(null);
  }, [floors.length]);

  const renameFloor = useCallback(
    (id: string, name: string) => {
      setFloors((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
    },
    []
  );

  const deleteFloor = useCallback(
    (id: string) => {
      if (floors.length <= 1) return;
      setFloors((prev) => prev.filter((f) => f.id !== id));
      if (activeFloorId === id) {
        setActiveFloorId(floors.find((f) => f.id !== id)!.id);
        setSelectedId(null);
      }
    },
    [floors, activeFloorId]
  );

  const duplicateFloor = useCallback(
    (id: string) => {
      const source = floors.find((f) => f.id === id);
      if (!source) return;
      const newFloor: Floor = {
        id: `floor-${Date.now()}`,
        name: `${source.name} (Copy)`,
        items: source.items.map((el) => ({ ...el, id: genId() })),
      };
      setFloors((prev) => [...prev, newFloor]);
      setActiveFloorId(newFloor.id);
    },
    [floors]
  );

  const zoomIn = useCallback(() => setZoom((z) => Math.min(2, z + 0.1)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.3, z - 0.1)), []);
  const resetZoom = useCallback(() => setZoom(1), []);
  const toggleGrid = useCallback(() => setShowGrid((v) => !v), []);

  const highlightedId = searchQuery
    ? activeFloor.items.find((el) => el.label.toLowerCase().includes(searchQuery.toLowerCase()))?.id || null
    : null;

  return {
    floors,
    activeFloor,
    activeFloorId,
    setActiveFloorId: (id: string) => { setActiveFloorId(id); setSelectedId(null); },
    selectedId,
    setSelectedId,
    selectedElement,
    zoom,
    showGrid,
    searchQuery,
    setSearchQuery,
    highlightedId,
    addElement,
    moveElement,
    resizeElement,
    rotateElement,
    updateElement,
    deleteElement,
    addFloor,
    renameFloor,
    deleteFloor,
    duplicateFloor,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
  };
}
