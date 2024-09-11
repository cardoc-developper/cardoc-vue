<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNuxtApp } from "#app";
import { collection, addDoc } from "firebase/firestore";

const { $auth, $db } = useNuxtApp();

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const router = useRouter();
const isRegistering = ref(false);

const login = async () => {
  console.log("la");
  try {
    const userCredential = await signInWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    console.log("Utilisateur connecté:", userCredential.user);
    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value = error.message;
    console.error("Erreur lors de la connexion:", error);
  }
};

const register = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match!";
    return;
  }
  try {
    // Create fb user
    const userCredential = await createUserWithEmailAndPassword(
      $auth,
      email.value,
      password.value
    );
    const user = userCredential.user;

    // Create db user
    await addDoc(collection($db, "users"), {
      id: user.uid,
      email: user.email,
      created_at: new Date(),
    });

    console.log("Utilisateur enregistré:", user);
    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value = error.message;
    console.error("Erreur lors de l'inscription:", error);
  }
};

const handleSubmitForm = () => {
  if (isRegistering.value) {
    register();
  } else {
    login();
  }
};

const toggleForm = () => {
  isRegistering.value = !isRegistering.value;
  errorMessage.value = "";
  confirmPassword.value = "";
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2
        class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
      >
        {{ isRegistering ? "Create a new account" : "Sign in to your account" }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div class="space-y-6">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div v-if="isRegistering">
          <label
            for="confirm-password"
            class="block text-sm font-medium leading-6 text-gray-900"
          >
            Confirm Password
          </label>
          <div class="mt-2">
            <input
              v-model="confirmPassword"
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            @click="handleSubmitForm"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {{ isRegistering ? "Sign up" : "Sign in" }}
          </button>
        </div>
      </div>

      <p v-if="errorMessage" class="mt-4 text-center text-sm text-red-500">
        {{ errorMessage }}
      </p>

      <p class="mt-10 text-center text-sm text-gray-500">
        {{ isRegistering ? "Already have an account?" : "Not a member?" }}
        <a
          href="#"
          @click.prevent="toggleForm"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
        >
          {{ isRegistering ? "Sign in" : "Register" }}
        </a>
      </p>
    </div>
  </div>
</template>
