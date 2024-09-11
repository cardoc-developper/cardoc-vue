<script setup lang="ts">
import { ref, computed } from "vue";
import { defineEmits } from 'vue';
import type { Vehicle } from "../types/vehicle";

const vehicle = defineModel<Vehicle>("vehicle", {required: true});

const emit = defineEmits(['nextStep']);
const onNextStep = () => {
  emit('nextStep'); // Émet l'événement 'nextStep' vers le parent
};


const formattedLicensePlate = computed({
  get: () => vehicle.value.licensePlate || "", 
  set: (value: string) => {
    if (vehicle) {
      vehicle.value.licensePlate = value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .replace(/(.{2})(.{3})(.{2})/, "$1-$2-$3");
    }
  },
});

const formatLicensePlate = () => {
  formattedLicensePlate.value = formattedLicensePlate.value; // Appelle le setter
};
</script>

<template>
  <div class="mb-6">
    <label for="license-plate" class="block text-gray-700 mb-2"
      >Plaque d'immatriculation</label
    >
    <input
      v-model="formattedLicensePlate"
      @input="formatLicensePlate"
      type="text"
      id="license-plate"
      class="w-full p-2 border border-gray-300 rounded-lg"
      placeholder="AA-123-BB"
      maxlength="9"
    />
  </div>

  <div class="mb-6">
    <label class="block text-gray-700 mb-2">Type de véhicule</label>
    <div class="flex justify-around">
      <button
        :class="{
          'bg-vibrant-red text-white': vehicle?.type === 'car',
          'bg-gray-100': vehicle?.type !== 'car',
        }"
        @click="vehicle && (vehicle.type = 'car')"
        class="w-full mx-2 p-4 border border-gray-300 rounded-lg flex items-center justify-center"
      >
        Voiture
      </button>
      <button
        :class="{
          'bg-vibrant-red text-white': vehicle?.type === 'moto',
          'bg-gray-100': vehicle?.type !== 'moto',
        }"
        @click="vehicle && (vehicle.type = 'moto')"
        class="w-full mx-2 p-4 border border-gray-300 rounded-lg flex items-center justify-center"
      >
        Moto
      </button>
    </div>
  </div>

  <button
    @click="onNextStep"
    class="w-full bg-vibrant-red text-white py-2 px-4 rounded-lg hover:bg-burnt-red"
  >
    Suivant
  </button>
</template>
