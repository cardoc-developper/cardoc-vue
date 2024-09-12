<script setup lang="ts">
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";

const { $auth } = useNuxtApp();
const router = useRouter();

watch($auth.currentUser, (user: any) => {
  if (user) {
    router.push("/dashboard");
  } else {
    router.push("/login");
  }
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
