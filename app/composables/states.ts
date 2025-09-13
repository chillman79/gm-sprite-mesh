import { DEFAULT_ZOOM_LEVEL, Tool } from "~/types";


export enum AppState {
    zoomLevel = 'zoomLevel',
    selectedTool = 'selectedTool',
    canvas = 'canvas',
    originalImageData = 'originalImageData',
    spritePosition = 'spritePosition',
    isDragging = 'isDragging',
    lastMousePosition = 'lastMousePosition',
    currentMousePosition = 'currentMousePosition',
    draggedPoint = 'draggedPoint',
    points = 'points',
    selectedPoint = 'selectedPoint',
    pointsHistory = 'pointsHistory',
    xOrigin = 'xOrigin',
    yOrigin = 'yOrigin',
    exportModal = 'exportModal',
    importModal = 'importModal',
}



export const useZoomLevel = () => useState(AppState.zoomLevel, () => DEFAULT_ZOOM_LEVEL);
export const useSelectedTool = () => useState(AppState.selectedTool, () => Tool.addPoint);

export const useCanvasState = () => useState<HTMLCanvasElement | undefined>(AppState.canvas);
export const useOriginalImageData = () => useState<ImageData | undefined>(AppState.originalImageData);
export const useSpritePosition = () => useState<{ x: number, y: number }>(AppState.spritePosition, () => ({ x: 0, y: 0 }));
export const useIsDragging = () => useState<boolean>(AppState.isDragging, () => false);
export const useLastMousePosition = () => useState<{ x: number, y: number } | undefined>(AppState.lastMousePosition);
export const useCurrentMousePosition = () => useState<{ x: number, y: number } | undefined>(AppState.currentMousePosition);
export const useDraggedPoint = () => useState<string | undefined>(AppState.draggedPoint);
export const usePoints = () => useState<Point[]>(AppState.points, () => []);
export const useSelectedPoint = () => useState<Point | undefined>(AppState.selectedPoint, () => undefined);
export const usePointsHistory = () => useState<Point[]>(AppState.pointsHistory, () => []);
export const useXOrigin = () => useState<number>(AppState.xOrigin, () => 0);
export const useYOrigin = () => useState<number>(AppState.yOrigin, () => 0);
export const useExportModal = () => useState<boolean>(AppState.exportModal, () => false);
export const useImportModal = () => useState<boolean>(AppState.importModal, () => false);