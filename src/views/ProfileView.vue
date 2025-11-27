<template>
  <div class="page">
    <h1>Meu Perfil</h1>

    <div class="card" v-if="user">
      <img v-if="user.photoURL" :src="user.photoURL" class="avatar" />
      <p><strong>Nome:</strong> {{ user.displayName || "Não informado" }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
    </div>

    <p v-else>Carregando dados...</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const user = ref(null);
onAuthStateChanged(auth, (u) => (user.value = u));
</script>

<style scoped>
.page {
  padding: 24px;
}

.card {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  max-width: 350px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 100px;
  margin-bottom: 12px;
}
</style>
