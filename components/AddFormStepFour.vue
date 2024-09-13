<script setup lang="ts">
import { ref } from "vue";
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
const registrationDay = ref<string>("");
const registrationMonth = ref<string>("");
const registrationYear = ref<string>("");

const purchaseDay = ref<string>("");
const purchaseMonth = ref<string>("");
const purchaseYear = ref<string>("");

// Références pour les inputs
const registrationMonthInputRef = ref<HTMLInputElement | null>(null);
const registrationYearInputRef = ref<HTMLInputElement | null>(null);
const purchaseMonthInputRef = ref<HTMLInputElement | null>(null);
const purchaseYearInputRef = ref<HTMLInputElement | null>(null);

// Fonction pour déplacer le focus du jour au mois, puis à l'année
const focusNextInput = (
  currentValue: string,
  nextInput: HTMLInputElement | null,
  maxLength: number
) => {
  if (currentValue.length === maxLength && nextInput) {
    nextInput.focus();
  }
};

// Fonction pour mettre à jour la date de première immatriculation dans le format YYYY-MM-DD
const updateRegistrationDate = () => {
  if (
    registrationDay.value &&
    registrationMonth.value &&
    registrationYear.value
  ) {
    vehicle.value.dateOfFirstRegistration = `${
      registrationYear.value
    }-${registrationMonth.value.padStart(
      2,
      "0"
    )}-${registrationDay.value.padStart(2, "0")}`;
  }
};

// Fonction pour mettre à jour la date d'achat dans le format YYYY-MM-DD
const updatePurchaseDate = () => {
  if (purchaseDay.value && purchaseMonth.value && purchaseYear.value) {
    vehicle.value.dateOfPurchase = `${
      purchaseYear.value
    }-${purchaseMonth.value.padStart(2, "0")}-${purchaseDay.value.padStart(
      2,
      "0"
    )}`;
  }
};
</script>

<template>
  <!-- Date de première immatriculation -->
  <div class="mb-6">
    <label class="block text-gray-700 mb-2"
      >Date de première immatriculation du véhicule</label
    >
    <div class="flex space-x-4">
      <!-- Input pour le jour -->
      <input
        v-model="registrationDay"
        @input="
          focusNextInput(registrationDay, registrationMonthInputRef, 2);
          updateRegistrationDate;
        "
        type="text"
        maxlength="2"
        placeholder="Jour"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
      <!-- Input pour le mois -->
      <input
        ref="registrationMonthInputRef"
        v-model="registrationMonth"
        @input="
          focusNextInput(registrationMonth, registrationYearInputRef, 2);
          updateRegistrationDate;
        "
        type="text"
        maxlength="2"
        placeholder="Mois"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
      <!-- Input pour l'année -->
      <input
        ref="registrationYearInputRef"
        v-model="registrationYear"
        @input="updateRegistrationDate"
        type="text"
        maxlength="4"
        placeholder="Année"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>

  <!-- Date d'achat du véhicule -->
  <div class="mb-6">
    <label class="block text-gray-700 mb-2">Date d'achat du véhicule</label>
    <div class="flex space-x-4">
      <!-- Input pour le jour -->
      <input
        v-model="purchaseDay"
        @input="
          focusNextInput(purchaseDay, purchaseMonthInputRef, 2);
          updatePurchaseDate;
        "
        type="text"
        maxlength="2"
        placeholder="Jour"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
      <!-- Input pour le mois -->
      <input
        ref="purchaseMonthInputRef"
        v-model="purchaseMonth"
        @input="
          focusNextInput(purchaseMonth, purchaseYearInputRef, 2);
          updatePurchaseDate;
        "
        type="text"
        maxlength="2"
        placeholder="Mois"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
      <!-- Input pour l'année -->
      <input
        ref="purchaseYearInputRef"
        v-model="purchaseYear"
        @input="updatePurchaseDate"
        type="text"
        maxlength="4"
        placeholder="Année"
        class="w-full p-2 border border-gray-300 rounded-lg"
      />
    </div>
  </div>

  <!-- Boutons de navigation -->
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
