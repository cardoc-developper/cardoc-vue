<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { defineEmits } from "vue";
import carModels from "~/assets/utils/carModels.json";
import bikeModels from "~/assets/utils/bikeModels.json";
import type { VehicleToAdd } from "~/types/vehicle";

export type BrandModelMap = Record<string, string[]>;

const emit = defineEmits(["nextStep"]);
const vehicle = defineModel<VehicleToAdd>("vehicle", { required: true });

const carBrandsData = carModels as BrandModelMap;
const bikeBrandsData = bikeModels as BrandModelMap;

const allCarBrands = ref(Object.keys(carBrandsData));
const allBikeBrands = ref(Object.keys(bikeBrandsData));

const displayedBrands = ref<string[]>([]);
const selectedBrand = ref("");
const availableModels = ref<string[]>([]);
const searchExpanded = ref(false);
const brandQuery = ref("");
const modelQuery = ref("");
const showModelDropdown = ref(false);
const filteredModels = ref<string[]>([]);


watch(
  () => vehicle.value.type,
  (newType) => {
    const allBrands =
      newType === "car" ? allCarBrands.value : allBikeBrands.value;
    displayedBrands.value = allBrands.slice(0, 8);
    availableModels.value = [];
    brandQuery.value = "";
    filteredModels.value = [];
    selectedBrand.value = vehicle.value.brand;
    modelQuery.value = vehicle.value.model;
  },
  { immediate: true }
);


const selectBrand = (brand: string) => {
  selectedBrand.value = brand;
  availableModels.value =
    vehicle.value.type === "car" ? carBrandsData[brand] : bikeBrandsData[brand];
  vehicle.value.brand = selectedBrand.value;
  filteredModels.value = availableModels.value;

  if (vehicle.value.model === "") {
    modelQuery.value = ""
    vehicle.value.model = ""
  } else {
    modelQuery.value = vehicle.value.model;
    vehicle.value.model = vehicle.value.model;
  }
};

const filterBrands = (query: string) => {
  const allBrands =
    vehicle.value.type === "car" ? allCarBrands.value : allBikeBrands.value;
  displayedBrands.value = query
    ? allBrands
      .filter((brand) =>
        brand.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 8) // Limité à 8 résultats.
    : allBrands.slice(0, 8);
};

const filterModels = (input: string) => {
  const allModels = availableModels.value;
  filteredModels.value = input
    ? allModels.filter((model) =>
      model.toLowerCase().includes(input.toLowerCase())
    )
    : allModels;
  showModelDropdown.value = true;
};


const selectModel = (model: string) => {
  modelQuery.value = model;
  vehicle.value.model = model;
  showModelDropdown.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".dropdown-container")) {
    showModelDropdown.value = false;
  }
  if (!target.closest(".search-container")) {
    searchExpanded.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  if (vehicle.value.brand !== "") {
    selectBrand(vehicle.value.brand);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);

});

const preventCloseOnClick = (event: Event) => {
  event.stopPropagation();
};

const isFormValid = computed(() => {
  return (
    vehicle.value.brand.trim() !== "" &&
    vehicle.value.model.trim() !== ""
  );
});


const onNextStep = () => {
  console.log(vehicle.value);
  emit("nextStep");
};
</script>

<template>
  <div class="relative mb-6">
    <label for="brand" class="block text-white py-1">Marque du véhicule</label>
    <div @click="searchExpanded = true" :class="['search-container absolute flex items-center gap-2 rounded-full p-2 border-gradient border-transparent border cursor-pointer top-0 right-0 duration-300', searchExpanded ? 'w-full' : 'w-[34px]']">
      <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input v-if="searchExpanded" v-model="brandQuery" @input="filterBrands(brandQuery)" type="text" id="brand"
      class="w-full h-full bg-transparent" placeholder="Taper une marque" @click.stop />
    </div>

    
  </div>

  <div class="mb-6 grid grid-cols-4 gap-6 justify-evenly justify-items-center items-center content-evenly min-h-[184px]">
    <button v-for="(brand, index) in displayedBrands" :key="index" @click="selectBrand(brand)" :class="[
      'w-20 h-20 p-4 border border-white rounded-lg flex items-center center justify-center duration-200 hover:bg-white hover:text-black',
      selectedBrand === brand ? 'bg-white text-black' : 'bg-transparent text-white',
    ]">
      {{ brand }}
    </button>
    <p v-if="displayedBrands.length === 0" class="col-span-4 flex items-center justify-center text-white">Aucun Résultat</p>
  </div>

  <div v-if="availableModels.length > 0 || vehicle.brand !== ''" class="relative mb-6">
    <label for="model" class="block text-white mb-2">Modèle du véhicule</label>
    <input v-model="modelQuery" @focus="showModelDropdown = true" @input="filterModels(modelQuery)" type="text"
      placeholder="Taper un modèle" class="w-full p-2 border border-white rounded-lg bg-transparent" @click.stop />

    <transition name="dropdown">
      <ul v-if="showModelDropdown && filteredModels.length > 0"
        class="dropdown-container absolute border border-white rounded-lg bg-transparent mt-2 max-h-40 overflow-y-auto z-50 w-full"
        @click.stop="preventCloseOnClick">
        <li v-for="(model, index) in filteredModels" :key="index" @click="selectModel(model)"
          class="p-2 cursor-pointer hover:text-black hover:bg-gray-100 duration-100">
          {{ model }}
        </li>
      </ul>
    </transition>

  </div>

  <button @click="onNextStep" :disabled="!isFormValid" :class="['w-full p-4 rounded-lg font-medium duration-200',
    isFormValid ? 'bg-white text-black hover:scale-105' : 'bg-gray-400 text-gray-700 cursor-not-allowed']">
    Suivant
  </button>
</template>

<style scoped>
ul {
  position: absolute;
  z-index: 50;
  top: 100%;
  left: 0;
  background: #121317;
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
