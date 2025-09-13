<template>
    <UModal v-model:open="importModal" title="Import Mesh" @close="importModal = false">
        <template #content>
            <div class="p-2">
                <UTextarea class="h-full w-full" label="Mesh" size="xl" variant="outline" placeholder="Mesh" v-model="model" />
            </div>
            <div class="flex justify-end p-2">
                <UButton label="Import" size="lg" variant="solid" color="primary" @click="importMesh" />
            </div>
        </template>
    </UModal>

</template>

<script setup lang="ts">

const importModal = useImportModal()
const mesh = useMesh()
const canvas = useCanvas();
const toast = useToast()

const model = ref<string>('')

const importMesh = () => {
    try {
        let val = model.value; 
    
        // Remove first and last [ ]
        val = val.slice(1, -1);
        val.split('],').map(point => {
            
            point = point.replaceAll('[', '')
            point = point.replaceAll(']', '')
            
            const [x, y] = point.split(',')
    
            if (x && y) {
                mesh.addPoint(parseInt(x), parseInt(y))
            }
        })
    
        canvas.redrawImageWithZoom()
    
        importModal.value = false
    }
    catch (error) {
        toast.add({
            title: 'Error',
            description: 'Invalid mesh',
            color: 'error'
        })
    }
}

</script>