<template>
  <div id="app">
    <Navbar />

    <main style="padding: 20px;">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
</script>
