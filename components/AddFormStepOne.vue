<script setup lang="ts">
import { ref, computed } from 'vue';
import { defineEmits } from 'vue';
import type { Vehicle } from '../types/vehicle';

const vehicle = defineModel<Vehicle>('vehicle', { required: true });
const emit = defineEmits(['nextStep']);

const formattedLicensePlate = computed({
  get() {
    return vehicle.value.licensePlate;
  },
  set(value: string) {
    let formattedValue = value.replace(/[^A-Za-z0-9]/g, ''); 
    if (formattedValue.length > 2) {
      formattedValue = formattedValue.slice(0, 2) + '-' + formattedValue.slice(2);
    }
    if (formattedValue.length > 6) {
      formattedValue = formattedValue.slice(0, 6) + '-' + formattedValue.slice(6);
    }
    vehicle.value.licensePlate = formattedValue;
  },
});

const nextStep = () => {
  emit('nextStep');
};
</script>

<template>
  <div class="mb-6">
    <label for="vehicle-name" class="block text-gray-700 mb-2">Nom du véhicule</label>
    <input
      v-model="vehicle.vehicleName"
      type="text"
      id="vehicle-name"
      class="w-full p-2 border border-gray-300 rounded-lg"
      placeholder="Nom du véhicule"
    />
  </div>

  <div class="mb-6">
    <label for="license-plate" class="block text-gray-700 mb-2">Plaque d'immatriculation</label>
    <input
      v-model="formattedLicensePlate"
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
          'bg-vibrant-red text-white': vehicle.type === 'car',
          'bg-gray-100': vehicle.type !== 'car',
        }"
        @click="vehicle.type = 'car'"
        class="w-full mx-2 p-4 border border-gray-300 rounded-lg flex items-center justify-center"
      >
        Voiture
      </button>
      <button
        :class="{
          'bg-vibrant-red text-white': vehicle.type === 'moto',
          'bg-gray-100': vehicle.type !== 'moto',
        }"
        @click="vehicle.type = 'moto'"
        class="w-full mx-2 p-4 border border-gray-300 rounded-lg flex items-center justify-center"
      >
        Moto
      </button>
    </div>
  </div>

  <button
    @click="nextStep"
    class="w-full bg-vibrant-red text-white py-2 px-4 rounded-lg hover:bg-burnt-red"
  >
    Suivant
  </button>
</template>
