<template>
    <UModal v-model:open="exportModal" title="Export Mesh" @close="exportModal = false">
        <template #content>
            <div class="p-2">
                <UTextarea class="h-full w-full" label="Mesh" size="xl" variant="outline" placeholder="Mesh" v-model="meshString" />
            </div>
            <div class="flex justify-end p-2">
                <UButton label="Copy" size="lg" variant="solid" color="primary" @click="copyMesh" />
            </div>
        </template>
    </UModal>

</template>

<script setup lang="ts">

const exportModal = useExportModal()
const mesh = useMesh()
const xOrigin = useXOrigin()
const yOrigin = useYOrigin()

const meshString = computed(() => {

    return `[${mesh.points.value.map(point => `[${point.x - xOrigin.value},${point.y - yOrigin.value}]`).join(',')}]`
})

const copyMesh = () => {
    navigator.clipboard.writeText(meshString.value)
}

</script>