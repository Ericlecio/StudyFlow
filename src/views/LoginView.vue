<template>
  <div class="container">
    <div class="card">
      <h1>StudyFlow</h1>
      <p>Acesse sua conta</p>

      <button class="google-btn" @click="login" :disabled="loading">
        {{ loading ? "Entrando..." : "Entrar com Google" }}
      </button>

      <p class="register">
        Não tem conta?
        <router-link to="/register">Criar agora</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginWithGoogle } from "@/services/authService";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

const loading = ref(false);
const router = useRouter();

onAuthStateChanged(auth, (user) => {
  if (user) router.push("/home");
});

async function login() {
  try {
    loading.value = true;
    await loginWithGoogle();
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.container {
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: white;
  padding: 40px;
  width: 350px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

.google-btn {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: white;
}

.google-btn:hover {
  background: var(--primary-dark);
}

.register {
  margin-top: 16px;
  font-size: 14px;
}
</style>
