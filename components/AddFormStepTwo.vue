<script setup lang="ts">
import { ref, computed } from "vue";
import { defineEmits } from 'vue';
import type { Vehicle } from "../types/vehicle";

const vehicle = defineModel<Vehicle>("vehicle", {required: true});

const emit = defineEmits(['nextStep', 'previousStep']);

const onNextStep = () => {
  emit('nextStep'); 
};

const onPreviousStep = () => {
  emit('previousStep');
}; 

const carBrands = ref([
  { name: 'Toyota', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'Ford', logo: 'https://cdn.worldvectorlogo.com/logos/ford-13.svg' },
  { name: 'Chevrolet', logo: 'https://cdn.worldvectorlogo.com/logos/chevrolet-6.svg' },
  { name: 'Honda', logo: 'https://cdn.worldvectorlogo.com/logos/honda-3.svg' },
  { name: 'Nissan', logo: 'https://cdn.worldvectorlogo.com/logos/nissan-6.svg' },
  { name: 'Volkswagen', logo: 'https://cdn.worldvectorlogo.com/logos/volkswagen-3.svg' },
  { name: 'Peugeot', logo: 'https://cdn.worldvectorlogo.com/logos/volkswagen-3.svg' },
  { name: 'Renault', logo: 'https://cdn.worldvectorlogo.com/logos/volkswagen-3.svg' },
  { name: 'Citroën', logo: 'https://cdn.worldvectorlogo.com/logos/volkswagen-3.svg' },
]);

const bikeBrands = ref([
  { name: 'Yamaha', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'Kawasaki', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'Suzuki', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'Honda', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'KTM', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'BMW', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'Benelli', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'Harley Davidson', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
  { name: 'Triumph', logo: 'https://cdn.worldvectorlogo.com/logos/toyota-14.svg' },
]);
</script>

<template>
    <div class="mb-6">
          <label for="brand" class="block text-gray-700 mb-2">Marque du véhicule</label>
          <input
            v-model="vehicle.brand"
            type="text"
            id="brand"
            class="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Toyota"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Sélectionnez la marque</label>
          <div class="grid grid-cols-3 gap-4">
            <button
              v-if="vehicle.type === 'car'"
              v-for="(brand, index) in carBrands"
              :key="index"
              :class="{
                'bg-vibrant-red text-white': vehicle.brand === brand.name,
                'bg-gray-100': vehicle.brand !== brand.name
              }"
              @click="vehicle.brand = brand.name"
              class="p-4 border border-gray-300 rounded-lg flex items-center justify-center"
            >
              <img :src="brand.logo" alt="logo" class="w-8 h-8" />
              <span class="ml-2">{{ brand.name }}</span>
            </button>
            <button
              v-if="vehicle.type === 'moto'"
              v-for="(brand, index) in bikeBrands"
              :key="index"
              :class="{
                'bg-vibrant-red text-white': vehicle.brand === brand.name,
                'bg-gray-100': vehicle.brand !== brand.name
              }"
              @click="vehicle.brand = brand.name"
              class="p-4 border border-gray-300 rounded-lg flex items-center justify-center"
            >
              <img :src="brand.logo" alt="logo" class="w-8 h-8" />
              <span class="ml-2">{{ brand.name }}</span>
            </button>
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