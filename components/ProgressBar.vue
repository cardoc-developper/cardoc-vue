<template>
    <div class="w-full h-2 bg-gray-200 rounded-full">
      <div :style="{ width: progressPercentage + '%' }" class="h-full bg-blue-500 rounded-full"></div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      currentStep: {
        type: Number,
        required: true
      },
      totalSteps: {
        type: Number,
        required: true
      }
    },
    computed: {
      progressPercentage(): number {
        return (this.currentStep / this.totalSteps) * 100;
      }
    }
  });
  </script>
  
  <style scoped>
  /* Optionnel pour styliser */
  </style>
  