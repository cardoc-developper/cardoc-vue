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

import CarIcon from "@/assets/icons/car.vue";
import BikeIcon from "@/assets/icons/bike.vue";

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
  numberOfOwners: parseInt("0"),
  images: [],
});

const files = ref<File[]>([]);
const vehicleId = ref("");
const currentStep = ref(1);
const totalSteps = ref(5);

const nextStep = () => {
  console.log(vehicle.value);
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
  <div class="min-h-screen bg-background flex items-center justify-center text-white px-6 py-10">
    <!-- Container principal -->
    <div class="flex flex-col md:flex-row items-center justify-between w-full md:w-4/5 max-w-[1000px] relative ">
      <!-- Section de bienvenue -->
      <button v-if="currentStep > 1" @click="previousStep" class="underline underline-offset-2 absolute left-0 -top-6">
        Retour
      </button>
      <div class="text-left w-full md:w-2/5 mb-6 md:mb-0 mt-4 md:mt-0">
        <!-- Affichage dynamique en fonction de la step -->
        <div v-if="currentStep === 1">
          <h1 class="text-4xl font-semibold opacity-80">Bienvenue John !</h1>
          <p class="mt-4 text-lg text-white">
            Vous n'avez pas encore de véhicule enregistré.<br /><br />
            Renseignez votre premier véhicule.
          </p>
        </div>
        <div v-else>
          <!-- Titre avec le nom du véhicule -->
          <h1 class="text-4xl font-semibold opacity-80">
            {{ vehicle.vehicleName || "Nom du véhicule" }}
          </h1>

          <!-- Petits rectangles avec les infos -->
          <div class="mt-6 space-y-4">
            <div v-if="currentStep >= 2" class="flex gap-2">
              <p class="w-1/2 border border-white rounded-lg p-2 font-semibold">
                {{ vehicle.licensePlate }}
              </p>
              <p
                class="w-1/2 border border-white rounded-lg p-2 font-semibold flex items-center justify-between stroke-white">
                {{ vehicle.type === "car" ? "Voiture" : "Moto" }}
                <CarIcon v-if="vehicle.type === 'car'" />
                <BikeIcon v-if="vehicle.type === 'moto'" />
              </p>
            </div>
            <div class="flex gap-2">
              <div v-if="currentStep >= 3">
                <div
                  class="w-20 h-20 p-4 border border-white rounded-lg flex items-center center font-semibold justify-center">
                  {{ vehicle.brand }}
                </div>
              </div>
              <div v-if="currentStep >= 3" class="flex gap-2 flex-col justify-between h-20 w-full">
                <p class="w-full border border-white rounded-lg px-2 py-1 font-semibold h-fit">
                  {{ vehicle.model }}
                </p>
                <div class="flex gap-2">
                  <div v-if="currentStep >= 4"
                    class="w-1/2 border border-white rounded-lg px-2 py-1 font-semibold flex items-center h-fit">
                    <div class="w-4 h-4 rounded-full mr-2 border border-white"
                      :style="{ backgroundColor: vehicle.color }">
                    </div>
                    <p>
                      {{ vehicle.color.charAt(0).toUpperCase() + vehicle.color.slice(1) }}
                    </p>
                  </div>
                  <p v-if="currentStep >= 4" class="w-1/2 border border-white rounded-lg px-2 py-1 font-semibold h-fit">
                    {{ vehicle.mileage }} KM
                  </p>
                </div>
              </div>
            </div>

            <div v-if="currentStep >= 4" class="flex gap-2">
              <p v-if="currentStep >= 4" class="w-1/2 border border-white rounded-lg px-2 py-1 font-semibold h-fit">
                {{ vehicle.energy }}
              </p>
              <p v-if="currentStep >= 5" class="w-1/2 border border-white rounded-lg px-2 py-1 font-semibold h-fit">
                Propriétaires : {{ vehicle.numberOfOwners }}
              </p>
            </div>

            <p v-if="currentStep >= 5" class="w-full border border-white rounded-lg px-2 py-1 font-semibold h-fit">
              Enregistrement : {{ vehicle.dateOfFirstRegistration }}
            </p>
            <p v-if="currentStep >= 5" class="w-full border border-white rounded-lg px-2 py-1 font-semibold h-fit">
              Achat : {{ vehicle.dateOfPurchase }}
            </p>

          </div>
        </div>
      </div>

      <!-- Formulaire -->
      <div class="px-8 py-10 py border-gradient border-transparent border rounded-3xl w-full md:w-1/2">
        <div v-if="currentStep === 1">
          <AddFormStepOne v-model:vehicle="vehicle" @next-step="nextStep" />
        </div>

        <div v-if="currentStep === 2">
          <AddFormStepTwo v-model:vehicle="vehicle" @next-step="nextStep" />
        </div>

        <div v-if="currentStep === 3">
          <AddFormStepThree v-model:vehicle="vehicle" @next-step="nextStep" />
        </div>

        <div v-if="currentStep === 4">
          <AddFormStepFour v-model:vehicle="vehicle" @next-step="nextStep" />
        </div>

        <div v-if="currentStep === 5">
          <AddFormStepFive v-model:vehicle="vehicle" v-model:files="files" @submit="createVehicle" />
        </div>
      </div>
    </div>
  </div>

</template>
