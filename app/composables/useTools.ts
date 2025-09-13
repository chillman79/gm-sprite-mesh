import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL, Tool } from "~/types";
import { useZoomLevel, useSelectedTool } from "./states";

export const useTools = () => {

    const maxZoom = computed(() => MAX_ZOOM_LEVEL);
    const minZoom = computed(() => MIN_ZOOM_LEVEL);

    const zoomLevel = useZoomLevel();
    const selectedTool = useSelectedTool();

    const zoomIn = () => {
        if (zoomLevel.value < maxZoom.value) {
            zoomLevel.value = Math.min(zoomLevel.value + 1, maxZoom.value);
        } 
    }
    
    const zoomOut = () => {
        if (zoomLevel.value > minZoom.value) {
            zoomLevel.value = Math.max(zoomLevel.value - 1, minZoom.value);
        }
    }
    
    const resetZoom = () => {
        zoomLevel.value = 1;
    }

    const getSelectedTool = computed(() => selectedTool.value);
    
    const setSelectedTool = (tool: Tool) => {
        selectedTool.value = tool;
    }

    const getCursor = computed(() => {
        switch (selectedTool.value) {
            case Tool.addPoint:
                return 'cursor-crosshair';
            case Tool.removePoint:
                return 'cursor-trash';
            case Tool.movePoint:
                return 'cursor-move';
            case Tool.move:
                return 'cursor-grab'; 
            default:
                return 'cursor-default';
        }
    });
   
    return {
        zoomLevel,
        zoomIn,
        zoomOut,
        resetZoom,
        getSelectedTool,
        setSelectedTool,
        getCursor,
    }

}