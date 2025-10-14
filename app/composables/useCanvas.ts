import { Tool } from "~/types";


export const MESH_COLORS = {
    addPoint: '#00ff00',
    removePoint: '#ff0000',
    movePoint: '#0000ff',
    move: '#0000ff',
}

export const CANVAS_GRID_COLORS = {
    lightGray: '#f8f8f8',
    darkGray: '#f0f0f8',
    stroke: '#e8e8e8',
}


export const useCanvas = () => {

    const mesh = useMesh();
    const zoomLevel = useZoomLevel();
    const selectedTool = useSelectedTool();
    const canvas = useCanvasState();
    const originalImageData = useOriginalImageData();
    const spritePosition = useSpritePosition();
    const isDragging = useIsDragging();
    const lastMousePosition = useLastMousePosition();
    const currentMousePosition = useCurrentMousePosition();
    const draggedPoint = useDraggedPoint();
    const automesh = useAutomesh();

    const pixelSize = computed(() => Math.max(1, Math.floor(zoomLevel.value)));

    const setCanvas = (canvasElement: HTMLCanvasElement) => {
        canvas.value = canvasElement;
    }

    const updateCursor = () => {
        if (canvas.value) {
            canvas.value.style.cursor = '';
        }
    }

    const setOriginalImageData = (imageData: ImageData) => {
        originalImageData.value = imageData;
    }

    const drawGridBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, pixelSize: number) => {

        const gridSize = Math.max(16, Math.min(32, pixelSize * 2));

        const lightGray = CANVAS_GRID_COLORS.lightGray;
        const darkGray = CANVAS_GRID_COLORS.darkGray;

        for (let x = 0; x < width; x += gridSize) {
            for (let y = 0; y < height; y += gridSize) {
                const isEven = Math.floor(x / gridSize) % 2 === Math.floor(y / gridSize) % 2;
                ctx.fillStyle = isEven ? lightGray : darkGray;
                ctx.fillRect(x, y, gridSize, gridSize);
            }
        }

        ctx.strokeStyle = CANVAS_GRID_COLORS.stroke;
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        for (let y = 0; y <= height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }


    const analyzeImagePixels = (image: HTMLImageElement): ImageData => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d')!;
        mesh.clearMesh();

        tempCanvas.width = image.width;
        tempCanvas.height = image.height;

        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.drawImage(image, 0, 0);

        return tempCtx.getImageData(0, 0, image.width, image.height);
    }

    const isPixelOpaque = (imageData: ImageData, x: number, y: number)  =>{
        if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) {
            return false; // fuera de límites cuenta como transparente
        }
        const index = (y * imageData.width + x) * 4;
        const a = imageData.data[index + 3] ?? 0;
        return a > 0;
    }

    const redrawImageWithZoom = (enableAutomesh?: boolean) => {
        if (!originalImageData.value || !canvas.value) return;

        const ctx = canvas.value.getContext('2d')!;
        const imageData = originalImageData.value;


        const rect = canvas.value.getBoundingClientRect();
        canvas.value.width = rect.width;
        canvas.value.height = rect.height;

        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        drawGridBackground(ctx, canvas.value.width, canvas.value.height, pixelSize.value);

        ctx.imageSmoothingEnabled = false;

        const spriteWidth = imageData.width * pixelSize.value;
        const spriteHeight = imageData.height * pixelSize.value;
        const centerX = (canvas.value.width - spriteWidth) / 2 + spritePosition.value.x;
        const centerY = (canvas.value.height - spriteHeight) / 2 + spritePosition.value.y;

        const borderPoints = [];
        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const pixelIndex = (y * imageData.width + x) * 4;
                const r = imageData.data[pixelIndex];
                const g = imageData.data[pixelIndex + 1];
                const b = imageData.data[pixelIndex + 2];
                const a = imageData.data[pixelIndex + 3];

                if (a && a > 0) {
                    // comprobar vecinos
                    const neighbors = [
                        [x - 1, y], // izquierda
                        [x + 1, y], // derecha
                        [x, y - 1], // arriba
                        [x, y + 1]  // abajo
                    ];

                    let isBorder = false;
                    for (const [nx, ny] of neighbors) {
                        if (nx && ny && !isPixelOpaque(imageData, nx, ny)) {
                            isBorder = true;
                            break;
                        }
                    }

                    if (isBorder) {
                        borderPoints.push({id: '', x, y})
                    }


                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                    ctx.fillRect(
                        centerX + x * pixelSize.value,
                        centerY + y * pixelSize.value,
                        pixelSize.value,
                        pixelSize.value
                    );
                }
            }
        }

        if (enableAutomesh) {
            automesh.automesh(borderPoints);
        }

        drawMesh(ctx, centerX, centerY);
    }

    const drawMesh = (ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number) => {
        const points = mesh.getPoints.value;

        if (points.length > 1) {
            ctx.strokeStyle = MESH_COLORS.addPoint;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.8;

            ctx.beginPath();
            if (points[0]) {
                ctx.moveTo(offsetX + points[0].x * pixelSize.value, offsetY + points[0].y * pixelSize.value);
            }

            for (let i = 1; i < points.length; i++) {
                const point = points[i];
                if (point) {
                    ctx.lineTo(offsetX + point.x * pixelSize.value, offsetY + point.y * pixelSize.value);
                }
            }

            if (points.length > 2) {
                ctx.closePath();
            }

            ctx.stroke();
        }

        ctx.globalAlpha = 1;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (point) {
                ctx.fillStyle = i === 0 ? MESH_COLORS.addPoint : MESH_COLORS.removePoint;
                ctx.beginPath();
                ctx.arc(offsetX + point.x * pixelSize.value, offsetY + point.y * pixelSize.value, 4, 0, 2 * Math.PI);
                ctx.fill();

                ctx.strokeStyle = MESH_COLORS.movePoint;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        if (currentMousePosition.value !== undefined && zoomLevel.value !== undefined) {
            const imageCoords = canvasToImageCoords(currentMousePosition.value.x!, currentMousePosition.value.y!);
            const snappedCoords = snapToPixelEdge(imageCoords.x, imageCoords.y);

            const guideX = offsetX + snappedCoords.x * pixelSize.value;
            const guideY = offsetY + snappedCoords.y * pixelSize.value;

            ctx.strokeStyle = MESH_COLORS.addPoint;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.8;

            const guideSize = 8;
            ctx.beginPath();
            ctx.moveTo(guideX - guideSize, guideY);
            ctx.lineTo(guideX + guideSize, guideY);
            ctx.moveTo(guideX, guideY - guideSize);
            ctx.lineTo(guideX, guideY + guideSize);
            ctx.stroke();

            ctx.globalAlpha = 1;
        }
    }

    const getMousePosition = (event: MouseEvent) => {
        if (!canvas.value) return { x: 0, y: 0 };
        const rect = canvas.value.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    const canvasToImageCoords = (canvasX: number, canvasY: number) => {
        if (!originalImageData.value || !canvas.value) return { x: 0, y: 0 };

        const imageData = originalImageData.value;
        const spriteWidth = imageData.width * pixelSize.value;
        const spriteHeight = imageData.height * pixelSize.value;
        const centerX = (canvas.value.width - spriteWidth) / 2 + spritePosition.value.x;
        const centerY = (canvas.value.height - spriteHeight) / 2 + spritePosition.value.y;

        const imageX = (canvasX - centerX) / pixelSize.value;
        const imageY = (canvasY - centerY) / pixelSize.value;

        return { x: imageX, y: imageY };
    }

    const snapToPixelEdge = (imageX: number, imageY: number) => {

        const pixelX = Math.round(imageX);
        const pixelY = Math.round(imageY);

        const deltaX = imageX - pixelX;
        const deltaY = imageY - pixelY;

        const snapThreshold = 0.3;

        let snappedX = pixelX;
        let snappedY = pixelY;

        if (Math.abs(deltaX) > snapThreshold) {
            snappedX = deltaX > 0 ? pixelX + 0.5 : pixelX - 0.5;
        }

        if (Math.abs(deltaY) > snapThreshold) {
            snappedY = deltaY > 0 ? pixelY + 0.5 : pixelY - 0.5;
        }

        return { x: snappedX, y: snappedY };
    }

    const handleMouseDown = (event: MouseEvent, selectedTool: number) => {
        const mousePos = getMousePosition(event);
        const imageCoords = canvasToImageCoords(mousePos.x, mousePos.y);

        if (!originalImageData.value) return;

        const imageData = originalImageData.value;


        switch (selectedTool) {
            case Tool.addPoint:
                const snappedCoords = snapToPixelEdge(imageCoords.x, imageCoords.y);
                mesh.addPoint(snappedCoords.x, snappedCoords.y);
                redrawImageWithZoom();
                break;

            case Tool.removePoint:
                const pointToRemove = mesh.findNearestPoint(imageCoords.x, imageCoords.y, 10);
                if (pointToRemove) {
                    mesh.removePoint(pointToRemove.id!);
                    redrawImageWithZoom();
                }
                break;
            case Tool.movePoint:
                const nearestPoint = mesh.findNearestPoint(imageCoords.x, imageCoords.y, 10);
                if (nearestPoint) {
                    draggedPoint.value = nearestPoint.id;
                    isDragging.value = true;
                    lastMousePosition.value = mousePos;
                    if (canvas.value) {
                        canvas.value.style.cursor = 'grabbing';
                    }
                }
                break;

            case Tool.move:
                isDragging.value = true;
                lastMousePosition.value = mousePos;
                if (canvas.value) {
                    canvas.value.style.cursor = 'grabbing';
                }
                break;
        }
    }

    const handleMouseMove = (event: MouseEvent) => {
        currentMousePosition.value = getMousePosition(event);

        if (!isDragging.value || !lastMousePosition.value) {
            redrawImageWithZoom();
            return;
        }

        const currentPosition = getMousePosition(event);
        const deltaX = currentPosition.x - lastMousePosition.value.x;
        const deltaY = currentPosition.y - lastMousePosition.value.y;

        if (draggedPoint.value) {
            const currentImageCoords = canvasToImageCoords(currentPosition.x, currentPosition.y);
            const snappedCoords = snapToPixelEdge(currentImageCoords.x, currentImageCoords.y);
            mesh.dragPoint(draggedPoint.value, snappedCoords.x, snappedCoords.y);
        } else {
            spritePosition.value.x += deltaX;
            spritePosition.value.y += deltaY;
        }

        lastMousePosition.value = currentPosition;
        
        redrawImageWithZoom();

    }

    const handleMouseUp = () => {
        if (isDragging.value) {
            isDragging.value = false;
            lastMousePosition.value = undefined;
            draggedPoint.value = undefined;
            if (canvas.value) {
                canvas.value.style.cursor = '';
            }
            
        }
    }

    return {
        canvas,
        originalImageData,
        spritePosition,
        setCanvas,
        setOriginalImageData,
        analyzeImagePixels,
        redrawImageWithZoom,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        updateCursor,
        mesh,
        drawGridBackground
    }
}