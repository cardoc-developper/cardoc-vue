<script setup lang="ts">
import { ref, computed } from "vue";
import { defineEmits } from "vue";
import type { VehicleToAdd } from "../types/vehicle";

import CarIcon from "@/assets/icons/car.vue";
import BikeIcon from "@/assets/icons/bike.vue";

const vehicle = defineModel<VehicleToAdd>("vehicle", { required: true });
const emit = defineEmits(["nextStep"]);

const formattedLicensePlate = computed({
  get() {
    return vehicle.value.licensePlate;
  },
  set(value: string) {
    let formattedValue = value.replace(/[^A-Za-z0-9]/g, "");
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "-" + formattedValue.slice(2);
    }
    if (formattedValue.length > 6) {
      formattedValue =
        formattedValue.slice(0, 6) + "-" + formattedValue.slice(6);
    }
    vehicle.value.licensePlate = formattedValue;
  },
});

// Vérifie si tous les champs nécessaires sont remplis
const isFormValid = computed(() => {
  return (
    vehicle.value.vehicleName.trim() !== "" &&
    vehicle.value.licensePlate.trim() !== "" &&
    vehicle.value.licensePlate.length === 9 &&
    vehicle.value.type !== ""
  );
});

const nextStep = () => {
  emit("nextStep");
};
</script>

<template>
  <div class="mb-6">
    <label for="vehicle-name" class="block mb-2 text-white">Nom du véhicule</label>
    <input v-model="vehicle.vehicleName" type="text" id="vehicle-name"
      class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-transparent" placeholder="Nom du véhicule" />
  </div>

  <div class="mb-6">
    <label for="license-plate" class="block text-white mb-2">Plaque d'immatriculation</label>
    <input v-model="formattedLicensePlate" type="text" id="license-plate"
      class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-transparent" placeholder="AA-123-BB" maxlength="9" />
  </div>

  <div class="mb-6">
    <label class="block text-white mb-2">Type de véhicule</label>
    <div class="flex flex-col gap-4">
      <button :class="{
        'bg-white text-black stroke-black': vehicle.type === 'car',
        'bg-transparent stroke-white hover:bg-white hover:text-black hover:stroke-black': vehicle.type !== 'car',
      }" @click="vehicle.type = 'car'"
        class="w-full py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-between duration-200">
        Voiture
        <CarIcon />
      </button>
      <button :class="{
        'bg-white text-black stroke-black': vehicle.type === 'moto',
        'bg-transparent stroke-white hover:bg-white hover:text-black hover:stroke-black': vehicle.type !== 'moto',
      }" @click="vehicle.type = 'moto'"
        class="w-full py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-between duration-200">
        Moto
        <BikeIcon />
      </button>
    </div>
  </div>

  <button @click="nextStep" :disabled="!isFormValid" :class="['w-full p-4 rounded-lg font-medium duration-200',
    isFormValid ? 'bg-white text-black hover:scale-105' : 'bg-gray-400 text-gray-700 cursor-not-allowed']">
    Ajouter mon véhicule
  </button>
</template>
