<template>
    <div class="py-4 px-4 flex flex-col fixed bottom-12 left-4 gap-2 z-50 bg-gray-900 rounded border-white/30 bottom-menu">
        <div class="flex flex-row gap-2 items-center text-sm">
           <UKbd value="space"> </UKbd>
           <span>Move around</span>
       </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd>A</UKbd>
            <span>Add Point</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="R"> </UKbd>
            <span>Remove Point</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="M"> </UKbd>
            <span>Move Point</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="Z"> </UKbd>
            <span>Zoom in</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="X"> </UKbd>
            <span>Zoom out</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="delete"> </UKbd>
            <span>Clear mesh</span>
        </div>
         <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="meta_z"> </UKbd>
            <span>Undo</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="meta_y"> </UKbd>
            <span>Redo</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="meta_s"> </UKbd>
            <span>Save Mesh</span>
        </div>
        <div class="flex flex-row gap-2 items-center text-sm">
            <UKbd value="meta_i"> </UKbd>
            <span>Import mesh</span>
        </div>
    </div>

</template>


<script lang="ts" setup>


</script>