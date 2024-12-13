<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { defineEmits } from "vue";
import type { VehicleToAdd } from "../types/vehicle";

// Utilisation de defineModel pour gérer le véhicule
const vehicle = defineModel<VehicleToAdd>("vehicle", { required: true });

const emit = defineEmits(["nextStep", "previousStep"]);

const onNextStep = () => {
  emit("nextStep");
};

const onPreviousStep = () => {
  emit("previousStep");
};

// Champs pour les dates d'immatriculation et d'achat
const registrationDate = ref<string>("");
const purchaseDate = ref<string>("");

// Fonction pour mettre à jour la date de première immatriculation dans le format YYYY-MM-DD
const updateRegistrationDate = () => {
  const [day, month, year] = registrationDate.value.split("/");
  if (day && month && year) {
    vehicle.value.dateOfFirstRegistration = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
};

// Fonction pour mettre à jour la date d'achat dans le format YYYY-MM-DD
const updatePurchaseDate = () => {
  const [day, month, year] = purchaseDate.value.split("/");
  if (day && month && year) {
    vehicle.value.dateOfPurchase = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }
};

// Watchers pour formater les dates à chaque modification
watch(registrationDate, updateRegistrationDate);
watch(purchaseDate, updatePurchaseDate);

// Fonction pour formater la date entrée avec des `/`
const formatDate = (date: string) => {
  const cleaned = date.replace(/\D/g, ""); // Retire tout sauf les chiffres
  const length = cleaned.length;

  if (length < 3) return cleaned;
  if (length < 5) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
  return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
};

// Initialisation des dates avec le modèle "vehicle" lors du montage du composant
onMounted(() => {
  if (vehicle.value.dateOfFirstRegistration) {
    const [year, month, day] = vehicle.value.dateOfFirstRegistration.split("-");
    registrationDate.value = `${day}/${month}/${year}`;
  }
  if (vehicle.value.dateOfPurchase) {
    const [year, month, day] = vehicle.value.dateOfPurchase.split("-");
    purchaseDate.value = `${day}/${month}/${year}`;
  }
});

const isFormValid = computed(() => {
  return (
    vehicle.value.dateOfFirstRegistration.length === 10 &&
    vehicle.value.dateOfPurchase.length === 10 &&
    vehicle.value.numberOfOwners !== 0
  );
});

</script>

<template>
  <!-- Date de première immatriculation -->
  <div class="mb-6">
    <label class="block text-white mb-2">Date d’enregistrement du véhicule</label>
    <input v-model="registrationDate" @input="registrationDate = formatDate(registrationDate)" type="text"
      maxlength="10" placeholder="DD/MM/YYYY"
      class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-transparent" />
  </div>

  <!-- Date d'achat du véhicule -->
  <div class="mb-6">
    <label class="block text-white mb-2">Date d'achat du véhicule</label>
    <input v-model="purchaseDate" @input="purchaseDate = formatDate(purchaseDate)" type="text" maxlength="10"
      placeholder="DD/MM/YYYY" class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-transparent" />
  </div>

  <div class="mb-6">
    <label class="block text-white mb-2">Nombre de propriétaire(s) du véhicule</label>
    <div class="grid gap-2">
      <input v-model="vehicle.numberOfOwners" type="number" id="owner"
        class="w-full py-2 px-4 border border-gray-300 rounded-lg bg-transparent" placeholder="1" />
    </div>
  </div>

  <!-- Boutons de navigation -->
  <button @click="onNextStep" :disabled="!isFormValid" :class="['w-full p-4 rounded-lg font-medium duration-200',
    isFormValid ? 'bg-white text-black hover:scale-105' : 'bg-gray-400 text-gray-700 cursor-not-allowed']">
    Suivant
  </button>
</template>
