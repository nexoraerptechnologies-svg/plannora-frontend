import { useState } from "react";
import { useFloorPlanner } from "@/hooks/useFloorPlanner";
import FloorPlannerSidebar from "@/components/floor-planner/FloorPlannerSidebar";
import FloorPlannerToolbar from "@/components/floor-planner/FloorPlannerToolbar";
import FloorPlannerCanvas from "@/components/floor-planner/FloorPlannerCanvas";
import FloorPlannerProperties from "@/components/floor-planner/FloorPlannerProperties";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus, ZoomIn, ZoomOut, Maximize2, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AnimatePresence, motion } from "framer-motion";
import type { ElementType } from "@/hooks/useFloorPlanner";

export default function FloorPlanner() {
  const fp = useFloorPlanner();
  const isMobile = useIsMobile();
  const [showElementPicker, setShowElementPicker] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleAddFromSheet = (type: ElementType) => {
    // Place in center of viewport
    const x = 300 / fp.zoom;
    const y = 300 / fp.zoom;
    fp.addElement(type, x, y);
    setShowElementPicker(false);
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-3 sm:-m-6 lg:-m-8 relative">
        {/* Compact mobile toolbar */}
        <div className="h-11 border-b border-border bg-background/80 backdrop-blur-xl flex items-center px-2 gap-1.5 shrink-0 z-20">
          <FloorPlannerToolbar
            floors={fp.floors}
            activeFloor={fp.activeFloor}
            zoom={fp.zoom}
            showGrid={fp.showGrid}
            searchQuery={fp.searchQuery}
            setSearchQuery={fp.setSearchQuery}
            setActiveFloorId={fp.setActiveFloorId}
            addFloor={fp.addFloor}
            duplicateFloor={fp.duplicateFloor}
            deleteFloor={fp.deleteFloor}
            zoomIn={fp.zoomIn}
            zoomOut={fp.zoomOut}
            resetZoom={fp.resetZoom}
            toggleGrid={fp.toggleGrid}
            compact
          />
        </div>

        {/* Canvas */}
        <FloorPlannerCanvas
          items={fp.activeFloor.items}
          zoom={fp.zoom}
          showGrid={fp.showGrid}
          selectedId={editMode ? fp.selectedId : null}
          highlightedId={fp.highlightedId}
          setSelectedId={editMode ? fp.setSelectedId : () => {}}
          addElement={fp.addElement}
          moveElement={fp.moveElement}
          resizeElement={fp.resizeElement}
          rotateElement={fp.rotateElement}
          deleteElement={fp.deleteElement}
          enableTouch
          onZoomChange={(z) => {
            // handled via pinch in canvas
          }}
        />

        {/* Floating zoom controls */}
        <div className="absolute bottom-20 right-3 flex flex-col gap-1.5 z-30">
          <Button variant="secondary" size="icon" onClick={fp.zoomIn} className="h-10 w-10 rounded-xl shadow-lg border border-border/50">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={fp.zoomOut} className="h-10 w-10 rounded-xl shadow-lg border border-border/50">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={fp.resetZoom} className="h-10 w-10 rounded-xl shadow-lg border border-border/50">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Mode toggle */}
        <div className="absolute bottom-20 left-3 z-30">
          <Button
            variant={editMode ? "gold" : "secondary"}
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="rounded-xl shadow-lg h-10 gap-1.5 text-xs"
          >
            {editMode ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {editMode ? "Edit" : "View"}
          </Button>
        </div>

        {/* Floating add button */}
        {editMode && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30"
          >
            <Button
              variant="gold"
              size="lg"
              onClick={() => setShowElementPicker(true)}
              className="rounded-2xl shadow-xl h-12 px-6 gap-2 text-sm font-medium"
            >
              <Plus className="h-5 w-5" /> Add Element
            </Button>
          </motion.div>
        )}

        {/* Element picker bottom sheet */}
        <Sheet open={showElementPicker} onOpenChange={setShowElementPicker}>
          <SheetContent side="bottom" className="rounded-t-3xl max-h-[60vh]">
            <SheetHeader>
              <SheetTitle className="font-display text-base">Add Element</SheetTitle>
            </SheetHeader>
            <FloorPlannerSidebar onAddElement={(type) => handleAddFromSheet(type)} mode="grid" />
          </SheetContent>
        </Sheet>

        {/* Selected element bottom panel */}
        <AnimatePresence>
          {editMode && fp.selectedElement && (
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              className="absolute bottom-0 left-0 right-0 z-40"
            >
              <FloorPlannerProperties
                element={fp.selectedElement}
                onUpdate={fp.updateElement}
                onDelete={(id) => { fp.deleteElement(id); }}
                compact
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // --- Desktop / Tablet ---
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -m-3 sm:-m-6 lg:-m-8">
      <FloorPlannerToolbar
        floors={fp.floors}
        activeFloor={fp.activeFloor}
        zoom={fp.zoom}
        showGrid={fp.showGrid}
        searchQuery={fp.searchQuery}
        setSearchQuery={fp.setSearchQuery}
        setActiveFloorId={fp.setActiveFloorId}
        addFloor={fp.addFloor}
        duplicateFloor={fp.duplicateFloor}
        deleteFloor={fp.deleteFloor}
        zoomIn={fp.zoomIn}
        zoomOut={fp.zoomOut}
        resetZoom={fp.resetZoom}
        toggleGrid={fp.toggleGrid}
      />
      <div className="flex flex-1 overflow-hidden relative">
        {/* Collapsible sidebar for tablet */}
        <div className="hidden md:block">
          <FloorPlannerSidebar onAddElement={fp.addElement} />
        </div>
        {/* Tablet: floating add button when sidebar hidden */}
        <div className="md:hidden absolute top-3 left-3 z-30">
          <Button variant="gold" size="sm" onClick={() => setShowSidebar(true)} className="rounded-xl shadow-lg gap-1.5 text-xs h-9">
            <Plus className="h-3.5 w-3.5" /> Add
          </Button>
        </div>
        <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-4 pb-0">
              <SheetTitle className="font-display text-sm">Elements</SheetTitle>
            </SheetHeader>
            <FloorPlannerSidebar onAddElement={(type, x, y) => { fp.addElement(type, x, y); setShowSidebar(false); }} />
          </SheetContent>
        </Sheet>

        <FloorPlannerCanvas
          items={fp.activeFloor.items}
          zoom={fp.zoom}
          showGrid={fp.showGrid}
          selectedId={fp.selectedId}
          highlightedId={fp.highlightedId}
          setSelectedId={fp.setSelectedId}
          addElement={fp.addElement}
          moveElement={fp.moveElement}
          resizeElement={fp.resizeElement}
          rotateElement={fp.rotateElement}
          deleteElement={fp.deleteElement}
          enableTouch
        />
        {fp.selectedElement && (
          <FloorPlannerProperties
            element={fp.selectedElement}
            onUpdate={fp.updateElement}
            onDelete={fp.deleteElement}
          />
        )}
      </div>
    </div>
  );
}
