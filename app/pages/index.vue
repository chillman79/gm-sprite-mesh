<template>
   <div class="h-screen">
      <input class="hidden" v-on:change="(event) => loadImage(event)" type="file" id="image-input" accept="image/*"/>
      
      <template v-if="selectedImage">
         <div class="relative h-full w-full overflow-hidden ">
            <canvas 
               ref="canvas" 
               :class="`absolute inset-0 w-full h-full ${tools.getCursor.value}`"
               @mousedown="handleMouseDown"
               @mousemove="handleMouseMove"
               @mouseup="handleMouseUp"
               @mouseleave="handleMouseUp"
            />
         </div>
         <Tools />
      </template>
      <template v-else>
         <div class="relative h-full w-full overflow-hidden">
            <canvas 
               ref="emptyCanvas" 
               class="absolute inset-0 w-full h-full"
            />
            <div class="absolute inset-0 flex items-center flex-col gap-4 justify-center bg-transparent">
               <h1 class="text-white bg-black/50 px-4 py-2 rounded-lg">No image selected.</h1>
               <UButton @click="openImageInput" color="primary" variant="solid">Select Image</UButton>
            </div>
         </div>
      </template>
      <ModalExport />
      <ModalImport />
   </div>
</template>

<script setup lang="ts">


defineShortcuts({
   'n': () => {
      openImageInput();
   }
})

const selectedImage = ref<File>()
const canvasRef = useTemplateRef('canvas')
const emptyCanvasRef = useTemplateRef('emptyCanvas')
const tools = useTools(); 
const canvas = useCanvas();

const loadImage = async (event: Event) => {
   if (!import.meta.client) return;
   await nextTick();

   const file = (event.target as HTMLInputElement).files?.[0]
   if (file) {
      selectedImage.value = file; 
      
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
         if (canvasRef.value) {
            canvas.setCanvas(canvasRef.value)
            
            const imageData = canvas.analyzeImagePixels(img)
            canvas.setOriginalImageData(imageData)
            canvas.redrawImageWithZoom()
         }
      }
   }

}

const openImageInput = () => {
   const file = document.getElementById('image-input') as HTMLInputElement
   file.click()
}

const handleMouseDown = (event: MouseEvent) => {
   const selectedTool = tools.getSelectedTool.value ?? 0
   canvas.handleMouseDown(event, selectedTool)
}

const handleMouseMove = (event: MouseEvent) => {
   canvas.handleMouseMove(event)
}

const handleMouseUp = () => {
   canvas.handleMouseUp()
}

const handleResize = () => {
   if (selectedImage.value) {
      canvas.redrawImageWithZoom()
   } else {
      drawEmptyGrid()
   }
}

const drawEmptyGrid = () => {
   if (emptyCanvasRef.value) {
      const ctx = emptyCanvasRef.value.getContext('2d')!
      const rect = emptyCanvasRef.value.getBoundingClientRect()
      emptyCanvasRef.value.width = rect.width
      emptyCanvasRef.value.height = rect.height
      
      canvas.drawGridBackground(ctx, rect.width, rect.height, 16)
   }
}

onMounted(() => {
   window.addEventListener('resize', handleResize)
   drawEmptyGrid()
})

onUnmounted(() => {
   window.removeEventListener('resize', handleResize)
})

watch(() => tools.getSelectedTool.value, () => {
   canvas.updateCursor()
})

watch(() => tools.zoomLevel.value, () => {
   if (selectedImage.value) {
      canvas.redrawImageWithZoom()
   }
})



</script>