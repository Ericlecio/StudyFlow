<template>
  <div class="home">
    <h1>Bem-vindo ao StudyFlow 👋</h1>

    <p v-if="user">
      Logado como: <strong>{{ user.email }}</strong>
    </p>

    <div class="box">
      <h2>Estudo Rápido</h2>
      <p>Gere questões personalizadas com IA e acelere seu aprendizado.</p>

      <router-link to="/questions">
        <button class="btn-primary">Começar agora</button>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref } from "vue";

const user = ref(null);
onAuthStateChanged(auth, (u) => (user.value = u));
</script>

<style scoped>
.home {
  padding: 24px;
}

.box {
  margin-top: 20px;
  padding: 18px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}

.btn-primary {
  margin-top: 14px;
  background: var(--primary);
  color: white;
  padding: 10px 18px;
}

.btn-primary:hover {
  background: var(--primary-dark);
}
</style>
