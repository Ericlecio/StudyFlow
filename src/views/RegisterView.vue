<template>
  <div class="container">
    <div class="card">
      <h1>Criar Conta</h1>

      <form @submit.prevent="handleRegister">
        <div class="field">
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>

        <div class="field">
          <label>Senha</label>
          <input type="password" v-model="password" required minlength="6" />
        </div>

        <div class="field">
          <label>Confirmar Senha</label>
          <input type="password" v-model="confirmPassword" required />
        </div>

        <p class="error" v-if="error">{{ error }}</p>

        <button class="btn-primary" :disabled="loading">
          {{ loading ? "Criando..." : "Registrar" }}
        </button>
      </form>

      <p class="login">
        Já tem conta?
        <router-link to="/login">Entrar</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "@/services/authService";

const router = useRouter();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);

async function handleRegister() {
  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "As senhas não coincidem.";
    return;
  }

  try {
    loading.value = true;
    await register(email.value, password.value);
    router.push("/home");
  } catch (e) {
    console.error(e);
    error.value = "Erro ao registrar.";
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
  padding: 40px;
  width: 350px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
}

.field {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
}

.error {
  color: var(--danger);
  font-size: 14px;
}

.btn-primary {
  width: 100%;
  padding: 10px;
  background: var(--primary);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-dark);
}
</style>
