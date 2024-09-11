<template>
  <div class="grid grid-cols-12 gap-2">
    <Navbar class="col-span-1" />
    <div class="col-span-11">
      <slot />
    </div>
  </div>
</template>

<script>
import Navbar from "~/components/Navbar.vue";

export default {
  name: "home",
};
</script>
