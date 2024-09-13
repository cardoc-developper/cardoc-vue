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
  "Essence",
  "Diesel",
  "Hybride",
  "Electrique",
  "GPL",
  "Autre",
]);
</script>

<template>
  <div class="mb-6">
    <label class="block text-gray-700 mb-2">Couleur du véhicule</label>
    <div class="flex space-x-2">
      <button
        v-for="(color, index) in colors"
        :key="index"
        :class="{ 'ring-2 ring-gray-700': vehicle.color === color.value }"
        @click="vehicle.color = color.value"
        :style="{ backgroundColor: color.hex }"
        class="w-10 h-10 rounded-full border border-gray-300"
      ></button>
    </div>
  </div>

  <div class="mb-6">
    <label for="mileage" class="block text-gray-700 mb-2"
      >Kilométrage du véhicule</label
    >
    <input
      v-model="vehicle.mileage"
      type="number"
      id="mileage"
      class="w-full p-2 border border-gray-300 rounded-lg"
      placeholder="100000"
    />
  </div>

  <div class="mb-6">
    <label class="block text-gray-700 mb-2">Energie du véhicule</label>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="(energy, index) in energies"
        :key="index"
        :class="{ 'bg-gray-300': vehicle.energy === energy }"
        @click="vehicle.energy = energy"
        class="p-2 border border-gray-300 rounded-lg text-center"
      >
        {{ energy }}
      </button>
    </div>
  </div>

  <div class="mb-6">
    <label class="block text-gray-700 mb-2"
      >Nombre de propriétaire(s) du véhicule</label
    >
    <div class="grid gap-2">
      <input
        v-model="vehicle.numberOfOwners"
        type="number"
        id="owner"
        class="w-full p-2 border border-gray-300 rounded-lg"
        placeholder="1"
      />
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
      @click="onNextStep"
      class="w-full bg-vibrant-red text-white py-2 px-4 rounded-lg hover:bg-burnt-red"
    >
      Suivant
    </button>
  </div>
</template>
