<script setup lang="ts">
import { ref } from 'vue';
import AddFormStepOne from '../../components/AddFormStepOne.vue';
import AddFormStepTwo from '../../components/AddFormStepTwo.vue';
import AddFormStepThree from '../../components/AddFormStepThree.vue';
import type { Vehicle } from '../../types/vehicle';

const vehicle = ref<Vehicle>({
  vehicleId: '',
  licensePlate: '',
  vehicleName: '',
  type: '',
  brand: '',
  model: '',
  mileage: parseInt('0'),
  color: '',
  energy: '',
  dateOfFirstRegistration: '',
  dateOfPurchase: '',
  numberOfOwners: '',
  images: [],
});

const currentStep = ref(1);
const totalSteps = ref(5);

const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};
</script>


<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-white">
    <div class="w-full max-w-md p-8 bg-white rounded-lg ">
      <h2 class="text-2xl font-bold text-center mb-6">Ajout de véhicule</h2>

      <div v-if="currentStep === 1">
        <AddFormStepOne v-model:vehicle="vehicle" @next-step="nextStep"/>
      </div>

      <div v-if="currentStep === 2">
        <AddFormStepTwo v-model:vehicle="vehicle" @next-step="nextStep" @previous-step="previousStep"/>
      </div>

      <div v-if="currentStep === 3">
        <AddFormStepThree v-model:vehicle="vehicle" @next-step="nextStep" @previous-step="previousStep"/>
      </div>

      <div v-if="currentStep === 4">
        <AddFormStepFour v-model:vehicle="vehicle" @next-step="nextStep" @previous-step="previousStep"/>
      </div>

      <div v-if="currentStep === 5">
        <AddFormStepFive v-model:vehicle="vehicle" @previous-step="previousStep"/>
      </div>
    </div> 
  </div>
</template>
