<script setup lang="ts">
defineProps({
  text: String,
});
</script>
<template>
  <div
    class="w-fit h-fit flex items-center px-4 py-3 rounded-full bg-slate-50 text-amber-700 text-sm hover:cursor-pointer hover:bg-slate-100"
  >
    {{ text }}
  </div>
</template>
