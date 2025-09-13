<template>
    <div
        class="bottom-12 justify-center flex flex-col gap-4 items-center inset-x-0 mx-auto fixed  z-[9999] ">
        <div class="py-4 px-4 flex justify-around gap-2 items-center h-full z-50 bg-gray-900 rounded-full after:rounded-full border border-1 border-white/30 bottom-menu">
            <UTooltip text="Zoom In" :kbds="['Z']">
                <UButton @click="tools.zoomIn" size="lg" color="primary" square variant="outline">
                    <Icon name="solar:magnifer-zoom-in-linear" class="w-5 h-5" />
                </UButton>
            </UTooltip>
            <UTooltip text="Zoom Out" :kbds="['X']">
                <UButton @click="tools.zoomOut" size="lg" color="primary" square variant="outline">
                    <Icon name="solar:magnifer-zoom-out-linear" class="w-5 h-5" />
                </UButton>
            </UTooltip>
            <!-- <UTooltip text="Undo" :kbds="['meta', 'Z']">
                <UButton @click="undo" size="lg" color="primary" square variant="outline" :disabled="!mesh.canUndo">
                    <Icon name="solar:undo-left-round-line-duotone" class="w-5 h-5" />
                </UButton>
            </UTooltip>

            <UTooltip text="Redo" :kbds="['meta', 'Y']">
                <UButton @click="redo" size="lg" color="primary" square variant="outline" :disabled="!mesh.canRedo">
                    <Icon name="solar:redo-right-round-line-duotone" class="w-5 h-5" />
                </UButton>
            </UTooltip> -->
            <UTooltip text="Add point" :kbds="['A']">
                <UButton @click="tools.setSelectedTool(Tool.addPoint)" size="lg" color="primary" square
                    :variant="tools.getSelectedTool.value === Tool.addPoint ? 'solid' : 'outline'">
                    <Icon name="solar:map-point-add-linear" class="w-5 h-5" />
                </UButton>
            </UTooltip>
            <UTooltip text="Remove Point" :kbds="['R']">
                <UButton @click="tools.setSelectedTool(Tool.removePoint)" size="lg" color="primary" square
                    :variant="tools.getSelectedTool.value === Tool.removePoint ? 'solid' : 'outline'">
                    <Icon name="solar:map-point-remove-linear" class="w-5 h-5" />
                </UButton>
            </UTooltip>
            <UTooltip text="Move Point" :kbds="['M']">
                <UButton @click="tools.setSelectedTool(Tool.movePoint)" size="lg" color="primary" square
                    :variant="tools.getSelectedTool.value === Tool.movePoint ? 'solid' : 'outline'">
                    <Icon name="streamline-ultimate:hand-drag" class="w-5 h-5" />
                </UButton>
            </UTooltip>

            <UTooltip text="Move" :kbds="['Space']">
                <UButton @click="tools.setSelectedTool(Tool.move)" size="lg" color="primary" square
                    :variant="tools.getSelectedTool.value === Tool.move ? 'solid' : 'outline'">
                    <Icon name="ion:move" class="w-5 h-5" />
                </UButton>
            </UTooltip>

            <UTooltip text="Clear Mesh" :kbds="['Delete']">
                <UButton @click="clearMesh" size="lg" color="primary" square variant="outline">
                    <Icon name="solar:trash-bin-minimalistic-bold" class="w-5 h-5" />
                </UButton>
            </UTooltip>

            <UTooltip text="Reset" :kbds="['C']">
                <UButton @click="tools.resetZoom" size="lg" color="primary" square variant="outline">
                    <Icon name="solar:refresh-bold" class="w-5 h-5" />
                </UButton>
            </UTooltip>

            <UTooltip text="Save" :kbds="['meta', 'S']">
                <UButton @click="saveMesh" size="lg" color="primary" square variant="outline">
                    <Icon name="solar:download-minimalistic-bold" class="w-5 h-5" />
                </UButton>
            </UTooltip>

            <UTooltip text="Import" :kbds="['meta', 'I']">
                <UButton @click="importMesh" size="lg" color="primary" square variant="outline">
                    <Icon name="solar:import-bold" class="w-5 h-5" />
                </UButton>
            </UTooltip>


            <!-- <UTooltip text="Generate Mesh" :kbds="['G']">
                <UButton @click="generateAutoMesh" size="lg" color="primary" square variant="outline">
                    <Icon name="solar:magic-stick-3-linear" class="w-5 h-5" />
                </UButton>
            </UTooltip> -->
        </div>
        <div class="py-4 px-4 gap-2 !w-fit flex justify-around items-center h-full z-50 bg-gray-900 rounded-full after:rounded-full border border-1 border-white/30 bottom-menu">
            <UInput label="Origin X" size="sm" variant="outline" placeholder="Origin X" v-model="xOrigin" />
            <UInput label="Origin Y" size="sm" variant="outline" placeholder="Origin Y" v-model="yOrigin" />
        </div>
    </div>
</template>

<script setup lang="ts">

import { Tool } from '~/types';

const tools = useTools()
const canvas = useCanvas()
const mesh = useMesh()
// const automesh = useAutomesh()
const xOrigin = useXOrigin()
const yOrigin = useYOrigin()
const exportModal = useExportModal()
const importModal = useImportModal()


const saveMesh = () => {
    exportModal.value = true
}

const importMesh = () => {
    importModal.value = true
}

const clearMesh = () => {
    canvas.mesh.clearMesh()
    canvas.redrawImageWithZoom()
}

const generateAutoMesh = () => {
    // todo: 
}

const undo = () => {
    // todo
}

const redo = () => {
    // todo
}   

watch(xOrigin, () => {
    if (!mesh.points.value[0]) {
        mesh.addPoint(xOrigin.value, yOrigin.value)
    }
    else {
        mesh.movePoint(mesh.points.value[0].id, xOrigin.value, yOrigin.value)
    }
    canvas.redrawImageWithZoom()
})
watch(yOrigin, () => {
    if (!mesh.points.value[0]) {
        mesh.addPoint(xOrigin.value, yOrigin.value)
    }
    else {
        mesh.movePoint(mesh.points.value[0].id, xOrigin.value, yOrigin.value)
    }
    canvas.redrawImageWithZoom()
})

watch(() => mesh.points.value, () => {
    if (mesh.points.value[0]) {
        xOrigin.value = mesh.points.value[0].x
        yOrigin.value = mesh.points.value[0].y
    }
}, { deep: true })

defineShortcuts({
    'a': () => {
        tools.setSelectedTool(Tool.addPoint)
    },
    ' ': () => {
        tools.setSelectedTool(Tool.move)
    },
    'r': () => {
        tools.setSelectedTool(Tool.removePoint)
    },
    'm': () => {
        tools.setSelectedTool(Tool.movePoint)
    },
    'z': () => {
        tools.zoomIn()
    },
    'x': () => {
        tools.zoomOut()
    },
    'c': () => {
        tools.resetZoom()
    },
    'delete': () => {
        clearMesh()
    },
    'g': () => {
        generateAutoMesh()
    },
    'meta_z': () => {
       undo()
    },
    'meta_y': () => {
       redo()
    },
    'meta_s': () => {
        saveMesh()
    },
    'meta_i': () => {
        importMesh()
    },
})



</script>
