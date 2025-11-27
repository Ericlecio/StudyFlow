<template>
  <div class="login-page">
    <div class="glow-bg"></div>

    <div class="login-card">
      <div class="brand">
        <h1>Study<span class="highlight">Flow</span></h1>
        <p>Sua jornada de aprendizado inteligente começa aqui.</p>
      </div>

      <button class="google-btn" @click="handleLogin" :disabled="loading">
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="G"
          class="google-icon"
        />
        <span>{{ loading ? "Entrando..." : "Continuar com Google" }}</span>
      </button>

      <div class="divider">
        <span>ou</span>
      </div>

      <div class="footer-links">
        <p>Ao entrar, você concorda com nossos termos de uso.</p>
      </div>
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

async function handleLogin() {
  try {
    loading.value = true;
    await loginWithGoogle();
    // O redirecionamento ocorre no watcher acima
  } catch (error) {
    console.error("Erro no login:", error);
    alert("Falha ao entrar com Google.");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #050507;
  position: relative;
  overflow: hidden;
  color: white;
  font-family: "Inter", sans-serif;
}

.glow-bg {
  position: absolute;
  width: 600px;
  height: 600px;
  background: radial-gradient(
    circle,
    rgba(78, 115, 223, 0.15) 0%,
    transparent 70%
  );
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.login-card {
  background: rgba(23, 26, 74, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 48px;
  border-radius: 24px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.brand h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.highlight {
  color: #4e73df;
}

.brand p {
  color: #a0a3b5;
  margin-bottom: 32px;
  font-size: 0.95rem;
}

.google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: white;
  color: #1f1f1f;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.google-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.1);
}

.google-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.divider {
  margin: 24px 0;
  position: relative;
}

.divider span {
  background: rgba(
    23,
    26,
    74,
    0.6
  ); /* Mesma cor do card para "cortar" a linha */
  padding: 0 10px;
  color: #5c5f7a;
  font-size: 0.85rem;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.footer-links p {
  color: #5c5f7a;
  font-size: 0.8rem;
}
</style>
