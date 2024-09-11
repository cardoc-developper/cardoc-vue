<script setup lang="ts">
definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="grid grid-cols-6 gap-2">
    <div
      class="col-span-4 h-full bg-orange-100 rounded-[42px] my-2 p-4 flex justify-between"
    >
      <div class="max-w-[70%]">
        <p class="text-2xl text-gray-800 font-medium mb-2">Bienvenue</p>
        <p class="text-gray-700">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta non
          assumenda voluptatem harum sequi omnis aperiam provident dolor
          pariatur, repellendus minima doloribus optio autem numquam,
          praesentium distinctio eum nihil et.
        </p>
      </div>

      <Button text="Ajouter un véhicule" />
    </div>
    <div class="col-span-2 h-full my-2 text-2xl text-gray-800 font-medium p-4">
      Raccourcis
    </div>
  </div>
</template>
