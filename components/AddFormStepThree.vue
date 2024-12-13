<script setup lang="ts">
import { ref } from "vue";
import { defineEmits } from "vue";
import type { VehicleToAdd } from "../types/vehicle";

const vehicle = defineModel<VehicleToAdd>("vehicle", { required: true });

const emit = defineEmits(["nextStep", "previousStep"]);

const onNextStep = () => {
  emit("nextStep");
};

const onPreviousStep = () => {
  emit("previousStep");
};

const colors = ref([
  { value: "white", hex: "#FFFFFF" },
  { value: "black", hex: "#000000" },
  { value: "green", hex: "#32CD32" },
  { value: "blue", hex: "#1E90FF" },
  { value: "orange", hex: "#FFA500" },
  { value: "red", hex: "#FF0000" },
]);

const energies = ref([
  { value: "Essence" },
  { value: "Diesel" },
  { value: "Hybride" },
  { value: "Electrique" },
  { value: "GPL" },
  { value: "Autre" },
]);

const handleColorSelection = (color: { value: string; hex: string }) => {
  vehicle.color = color.value; // Met à jour la couleur dans le modèle
};

const handleEnergySelection = (energy: string) => {
  vehicle.energy = energy;
};

const isFormValid = computed(() => {
  return (
    vehicle.value.color.trim() !== "" &&
    vehicle.value.mileage !== 0 &&
    vehicle.value.energy.trim() !== ""
  );
});

</script>

<template>
  <div class="mb-6">
    <label class="block text-white mb-2">Couleur du véhicule</label>
    <Dropdown v-model="vehicle.color" :options="colors" placeholder="Choisissez une couleur"
      @color-selected="handleColorSelection" />
  </div>

  <div class="mb-6">
    <label for="mileage" class="block text-white mb-2">Kilométrage</label>
    <div class="relative">
      <input v-model="vehicle.mileage" type="number" id="mileage"
        class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-transparent" placeholder="100000" />
      <span class="absolute right-2 top-1/2 -translate-y-1/2 text-white">KM</span>
    </div>
  </div>

  <div class="mb-6">
    <label class="block text-white mb-2">Type de carburant</label>
    <Dropdown v-model="vehicle.energy" :options="energies" placeholder="Choisissez une énergie"
      @option-selected="handleEnergySelection" />
  </div>

  <button @click="onNextStep" :disabled="!isFormValid" :class="['w-full p-4 rounded-lg font-medium duration-200',
    isFormValid ? 'bg-white text-black hover:scale-105' : 'bg-gray-400 text-gray-700 cursor-not-allowed']">
    Suivant
  </button>
</template>
