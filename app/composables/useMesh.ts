export interface Point {
    id?: string;
    x: number;
    y: number;
}

export const useMesh = () => {

    const points = usePoints();
    const selectedPoint = useSelectedPoint();

    const generateId = () => {
        return `point_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    const addPoint = (x: number, y: number) => {
        const exists = points.value.find((p) => p.x === x && p.y === y); 
        if (exists) return;
        
        const newPoint: Point = {
            id: generateId(),
            x: x,
            y: y
        };
        points.value.push(newPoint);
    }

    const movePoint = (pointId: string, x: number, y: number) => {
        const point = points.value.find(p => p.id === pointId);
        if (point) {
            point.x = x;
            point.y = y;
        }
    }

    const removePoint = (pointId: string) => {
        points.value = points.value.filter(p => p.id !== pointId);
    }

    const removeLastPoint = () => {
        points.value.pop();
    }

    const findNearestPoint = (x: number, y: number, threshold: number = 10): Point | null => {
        let nearestPoint: Point | null = null;
        let minDistance = threshold;

        for (const point of points.value) {
            const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
                nearestPoint = point;
            }
        }

        return nearestPoint;
    }

    const findNearestSegment = (x: number, y: number, threshold: number = 20): number | null => {
        if (points.value.length < 2) return null;

        let nearestSegment: number | null = null;
        let minDistance = threshold;

        for (let i = 0; i < points.value.length - 1; i++) {
            const p1 = points.value[i];
            const p2 = points.value[i + 1];
            if (p1 && p2) {
                const distance = pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSegment = i;
                }
            }
        }

        if (points.value.length > 2) {
            const p1 = points.value[points.value.length - 1];
            const p2 = points.value[0];
            if (p1 && p2) {
                const distance = pointToLineDistance(x, y, p1.x, p1.y, p2.x, p2.y);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestSegment = points.value.length - 1;
                }
            }
        }

        return nearestSegment;
    }

    const pointToLineDistance = (px: number, py: number, x1: number, y1: number, x2: number, y2: number): number => {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) return Math.sqrt(A * A + B * B);

        let param = dot / lenSq;

        let xx, yy;

        if (param < 0) {
            xx = x1;
            yy = y1;
        } else if (param > 1) {
            xx = x2;
            yy = y2;
        } else {
            xx = x1 + param * C;
            yy = y1 + param * D;
        }

        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }

    const insertPointInSegment = (segmentIndex: number, x: number, y: number) => {
        
        const newPoint: Point = {
            id: generateId(),
            x: x,
            y: y
        };

        points.value.splice(segmentIndex + 1, 0, newPoint);
    }

    const clearMesh = () => {
        points.value = [];
        selectedPoint.value = undefined;
    }

    const dragPoint = (pointId: string, x: number, y: number) => {
        movePoint(pointId, x, y);
    }

    const getPoints = computed(() => points.value);


    return {
        points,
        selectedPoint,
        addPoint,
        removeLastPoint,
        removePoint,
        findNearestPoint,
        findNearestSegment,
        insertPointInSegment,
        clearMesh,
        getPoints,
        movePoint,
        dragPoint,
    }
}