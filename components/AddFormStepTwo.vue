<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { defineEmits } from "vue";
import carModels from "~/assets/utils/carModels.json";
import bikeModels from "~/assets/utils/bikeModels.json";
import type { VehicleToAdd } from "~/types/vehicle";

export type BrandModelMap = Record<string, string[]>;

const emit = defineEmits(["nextStep", "previousStep"]);
const vehicle = defineModel<VehicleToAdd>("vehicle", { required: true });

const carBrandsData = carModels as BrandModelMap;
const bikeBrandsData = bikeModels as BrandModelMap;

const allCarBrands = ref(Object.keys(carBrandsData));
const allBikeBrands = ref(Object.keys(bikeBrandsData));

const displayedCarBrands = ref(allCarBrands.value.slice(0, 9));
const displayedBikeBrands = ref(allBikeBrands.value.slice(0, 9));

const selectedBrand = ref("");
const availableModels = ref<string[]>([]);
const filteredBrands = ref<string[]>([]);
const showBrandDropdown = ref(false);
const showModelDropdown = ref(false);

watch(
  () => vehicle.value.type,
  (newType) => {
    filteredBrands.value =
      newType === "car" ? allCarBrands.value : allBikeBrands.value;
    availableModels.value = [];
    selectedBrand.value = "";
    vehicle.value.model = "";
    showBrandDropdown.value = false;
    showModelDropdown.value = false;
  }
);

const selectBrand = (brand: string) => {
  selectedBrand.value = brand;
  availableModels.value =
    vehicle.value.type === "car" ? carBrandsData[brand] : bikeBrandsData[brand];
  vehicle.value.brand = selectedBrand.value;
  vehicle.value.model = "";
  filteredBrands.value = [];
  showBrandDropdown.value = false;
  showModelDropdown.value = true;
};

const filterBrands = (input: string) => {
  const allBrands =
    vehicle.value.type === "car" ? allCarBrands.value : allBikeBrands.value;
  filteredBrands.value = input
    ? allBrands.filter((brand) =>
        brand.toLowerCase().includes(input.toLowerCase())
      )
    : allBrands;
  showBrandDropdown.value = true;
};

const selectModel = (model: string) => {
  vehicle.value.model = model;
  showModelDropdown.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".dropdown-container")) {
    showBrandDropdown.value = false;
    showModelDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const preventCloseOnClick = (event: Event) => {
  event.stopPropagation();
};

const onNextStep = () => {
  emit("nextStep");
};

const onPreviousStep = () => {
  emit("previousStep");
};
</script>

<template>
  <div class="relative mb-6">
    <label for="brand" class="block text-gray-700 mb-2">Marque du véhicule</label>
    <input
      v-model="selectedBrand"
      @input="filterBrands(selectedBrand)"
      @focus="showBrandDropdown = true"
      type="text"
      id="brand"
      class="w-full p-2 border border-gray-300 rounded-lg"
      placeholder="Taper une marque"
      @click.stop
    />

    <transition name="dropdown">
      <ul
        v-if="showBrandDropdown && filteredBrands.length > 0"
        class="dropdown-container absolute border border-gray-300 rounded-lg bg-white mt-2 max-h-40 overflow-y-auto z-50 w-full"
        @click.stop="preventCloseOnClick"
      >
        <li
          v-for="(brand, index) in filteredBrands"
          :key="index"
          @click="selectBrand(brand)"
          class="p-2 cursor-pointer hover:bg-gray-100"
        >
          {{ brand }}
        </li>
      </ul>
    </transition>
  </div>

  <div class="mb-6 grid grid-cols-3 gap-4">
    <button
      v-for="(brand, index) in vehicle.type === 'car'
        ? displayedCarBrands
        : displayedBikeBrands"
      :key="index"
      @click="selectBrand(brand)"
      class="p-4 border border-gray-300 rounded-lg flex items-center justify-center"
    >
      {{ brand }}
    </button>
  </div>

  <div v-if="availableModels.length > 0" class="relative mb-6">
    <label for="model" class="block text-gray-700 mb-2">Modèle du véhicule</label>
    <input
      v-model="vehicle.model"
      @focus="showModelDropdown = true"
      type="text"
      placeholder="Taper un modèle"
      class="w-full p-2 border border-gray-300 rounded-lg"
      @click.stop
    />

    <transition name="dropdown">
      <ul
        v-if="showModelDropdown && availableModels.length > 0"
        class="dropdown-container absolute border border-gray-300 rounded-lg bg-white mt-2 max-h-40 overflow-y-auto z-50 w-full"
        @click.stop="preventCloseOnClick"
      >
        <li
          v-for="(model, index) in availableModels"
          :key="index"
          @click="selectModel(model)"
          class="p-2 cursor-pointer hover:bg-gray-100"
        >
          {{ model }}
        </li>
      </ul>
    </transition>
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

<style scoped>
ul {
  position: absolute;
  z-index: 50;
  top: 100%;
  left: 0;
  background-color: white;
  width: 100%;
}

li {
  cursor: pointer;
  padding: 8px;
}

li:hover {
  background-color: #f0f0f0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
}

.dropdown-enter-from,
.dropdown-leave-to {
  max-height: 0;
  opacity: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
  max-height: 160px;
  opacity: 1;
}

.dropdown-container {
  z-index: 50;
}
</style>
