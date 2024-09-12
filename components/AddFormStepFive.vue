<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits } from 'vue';
import type { Vehicle } from '../types/vehicle';

const vehicle = defineModel<Vehicle>('vehicle', { required: true });

const emit = defineEmits(['previousStep']);


const onPreviousStep = () => {
  emit('previousStep');
};

const selectedFiles = ref<File[]>([]);
const previewImages = ref<string[]>([]);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    const newFiles = Array.from(input.files);
    selectedFiles.value.push(...newFiles);
    previewImages.value.push(...newFiles.map(file => URL.createObjectURL(file)));
    vehicle.value.images.push(...newFiles.map(file => file.name));
  }
};

const removeImage = (index: number) => {
  selectedFiles.value.splice(index, 1);
  previewImages.value.splice(index, 1);
  vehicle.value.images.splice(index, 1);
};
</script>

<template>
    <div class="mb-6">
      <label class="block text-gray-700 mb-2">Ajouter des photos du véhicule</label>
      <input
        type="file"
        multiple
        accept="image/*"
        @change="handleFileChange"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
  
      <div v-if="previewImages.length" class="mt-4 grid grid-cols-2 gap-4">
        <div v-for="(image, index) in previewImages" :key="index" class="relative">
          <img :src="image" alt="Preview" class="w-full h-auto object-cover rounded-lg" />
  
          <button
            @click="removeImage(index)"
            class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full flex items-center justify-center"
            style="width: 24px; height: 24px"
            aria-label="Supprimer l'image"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  
    <div class="flex justify-between gap-4">
      <button
        @click="onPreviousStep"
        class="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
      >
        Précédent
      </button>
      <button
        @click="console.log(vehicle)"
        class="w-full bg-vibrant-red text-white py-2 px-4 rounded-lg hover:bg-burnt-red"
      >
        Suivant
      </button>
    </div>
  </template>
  