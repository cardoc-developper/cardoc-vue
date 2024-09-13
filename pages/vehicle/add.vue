<script setup lang="ts">
import { ref } from "vue";
import AddFormStepOne from "../../components/AddFormStepOne.vue";
import AddFormStepTwo from "../../components/AddFormStepTwo.vue";
import AddFormStepThree from "../../components/AddFormStepThree.vue";
import type { VehicleToAdd } from "../../types/vehicle";
import { useRouter } from "vue-router";
import { addDoc, updateDoc, collection } from "firebase/firestore";
import { useNuxtApp } from "#app";
import { useUser } from "~/composables/useUser";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage"; // Importation des fonctions pour Storage

const router = useRouter();
const { $db, $storage } = useNuxtApp();
const { user } = useUser();

const vehicle = ref<VehicleToAdd>({
  userId: "",
  licensePlate: "",
  vehicleName: "",
  type: "",
  brand: "",
  model: "",
  mileage: parseInt("0"),
  color: "",
  energy: "",
  dateOfFirstRegistration: "",
  dateOfPurchase: "",
  numberOfOwners: "",
  images: [],
});

const files = ref<File[]>([]);
const vehicleId = ref("");
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

// Fonction pour uploader un fichier dans Firebase Storage
const uploadFileToStorage = async (file: File) => {
  try {
    const fileName = file.name; // Utilisation du nom de fichier original
    const filePath = `users/${user.value?.id}/${vehicleId.value}/pictures/${fileName}`;

    // Référence au chemin du fichier dans le Storage
    const storageReference = storageRef($storage, filePath);

    // Upload du fichier
    const snapshot = await uploadBytes(storageReference, file);

    // Récupération de l'URL de téléchargement après l'upload
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL; // On retourne l'URL pour la sauvegarder dans Firestore ou l'afficher
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier :", error);
    return null;
  }
};

const createVehicle = async () => {
  const { $db } = useNuxtApp();

  const vehicleToAdd = {
    user_id: user.value?.id,
    license_plate: vehicle.value.licensePlate,
    vehicle_name: vehicle.value.vehicleName,
    type: vehicle.value.type,
    brand: vehicle.value.brand,
    model: vehicle.value.model,
    mileage: vehicle.value.mileage,
    color: vehicle.value.color,
    energy: vehicle.value.energy,
    date_of_first_registration: vehicle.value.dateOfFirstRegistration,
    date_of_purchase: vehicle.value.dateOfPurchase,
    number_of_owners: vehicle.value.numberOfOwners,
    images: [], // Ici nous allons ajouter les URLs des images après l'upload
  };

  try {
    // Ajout du véhicule dans Firestore
    const result = await addDoc(collection($db, "vehicles"), vehicleToAdd);
    vehicleId.value = result.id;

    // Uploader les fichiers après avoir créé le véhicule
    const uploadedImages = [];
    for (const file of files.value) {
      const fileURL = await uploadFileToStorage(file);
      if (fileURL) {
        uploadedImages.push(fileURL);
      }
    }

    // Mise à jour du document avec les URLs des images
    await updateDoc(result, { images: uploadedImages });

    router.push("/");
  } catch (error) {
    console.error("Erreur lors de l'ajout du document : ", error);
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-white">
    <div class="w-full max-w-md p-8 bg-white rounded-lg">
      <h2 class="text-2xl font-bold text-center mb-6">Ajout de véhicule</h2>

      <div v-if="currentStep === 1">
        <AddFormStepOne v-model:vehicle="vehicle" @next-step="nextStep" />
      </div>

      <div v-if="currentStep === 2">
        <AddFormStepTwo
          v-model:vehicle="vehicle"
          @next-step="nextStep"
          @previous-step="previousStep"
        />
      </div>

      <div v-if="currentStep === 3">
        <AddFormStepThree
          v-model:vehicle="vehicle"
          @next-step="nextStep"
          @previous-step="previousStep"
        />
      </div>

      <div v-if="currentStep === 4">
        <AddFormStepFour
          v-model:vehicle="vehicle"
          @next-step="nextStep"
          @previous-step="previousStep"
        />
      </div>

      <div v-if="currentStep === 5">
        <AddFormStepFive
          v-model:vehicle="vehicle"
          v-model:files="files"
          @previous-step="previousStep"
          @submit="createVehicle"
        />
      </div>
    </div>
  </div>
</template>
