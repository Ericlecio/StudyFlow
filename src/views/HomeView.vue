<template>
  <div class="home">
    <div class="background-glow"></div>

    <div class="content-wrapper">
      <header class="header">
        <h1 class="title">
          Bem-vindo ao <span class="brand-highlight">StudyFlow</span>
        </h1>
      </header>

      <div class="study-card">
        <div class="card-glow-effect"></div>
        <div class="card-content">
          <div class="icon-container"></div>
          <h2>Estudo Rápido</h2>
          <p>
            Gere questões personalizadas com e acelere seu aprendizado agora
            mesmo.
          </p>
        </div>

        <router-link to="/questions" class="action-link">
          <button class="btn-primary">
            Começar Agora
            <span class="btn-shine"></span>
          </button>
        </router-link>
      </div>
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
  /* Variáveis de Cores */
  --bg-dark: #050507;
  --navy-card: rgba(23, 26, 74, 0.7); /* Mais transparente para efeito vidro */
  --navy-border: #2a2d6a;
  --text-light: #ffffff;
  --text-gray: #a0a3b5;
  --brand-color: #4e73df;
  --brand-glow: rgba(78, 115, 223, 0.5);

  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-light);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  font-family: "Inter", system-ui, sans-serif; /* Sugestão de fonte moderna */
}

/* --- Fundo Animado (Blob) --- */
.background-glow {
  position: absolute;
  top: -20%;
  left: -10%;
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(23, 26, 74, 0.4) 0%,
    transparent 60%
  );
  z-index: 0;
  animation: pulseBackground 10s ease-in-out infinite alternate;
  pointer-events: none;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 550px;
  text-align: center;
}

/* --- Animações de Entrada (Keyframes no final) --- */
.header {
  margin-bottom: 50px;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -1px;
  line-height: 1.1;
}

/* Texto Gradiente Animado */
.brand-highlight {
  background: linear-gradient(135deg, #4e73df 0%, #7096ff 50%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shineText 5s linear infinite;
}

.user-info {
  color: var(--text-gray);
  font-size: 0.95rem;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards; /* Delay */
}

.user-email {
  color: #7096ff;
  font-weight: 500;
}

/* --- Card de Estudo --- */
.study-card {
  position: relative;
  background-color: var(--navy-card);
  backdrop-filter: blur(12px); /* Efeito de vidro fosco */
  border-radius: 24px;
  padding: 40px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efeito elástico */
  overflow: hidden;
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards; /* Delay maior */
}

.study-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(78, 115, 223, 0.4);
  box-shadow: 0 30px 60px -12px rgba(78, 115, 223, 0.15);
}

/* Brilho interno no hover do card */
.card-glow-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at top,
    rgba(78, 115, 223, 0.1),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
}

.study-card:hover .card-glow-effect {
  opacity: 1;
}

.icon-container {
  font-size: 3rem;
  margin-bottom: 20px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

.card-content h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-light);
}

.card-content p {
  color: var(--text-gray);
  margin-bottom: 32px;
  line-height: 1.6;
  font-size: 1.05rem;
}

/* --- Botão Moderno com Brilho --- */
.action-link {
  text-decoration: none;
  display: block;
}

.btn-primary {
  position: relative;
  background: var(--brand-color);
  color: white;
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(78, 115, 223, 0.3);
  letter-spacing: 0.5px;
}

/* Efeito de brilho passando pelo botão */
.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: 0.5s;
}

.btn-primary:hover .btn-shine {
  left: 100%;
  transition: 0.5s;
}

.btn-primary:hover {
  background-color: #3b63d6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(78, 115, 223, 0.5); /* Glow intenso */
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(78, 115, 223, 0.3);
}

/* --- Keyframes (Definição das Animações) --- */

/* Aparecer de baixo para cima */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Texto brilhante se movendo */
@keyframes shineText {
  to {
    background-position: 200% center;
  }
}

/* Fundo pulsante */
@keyframes pulseBackground {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Ícone flutuando */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsividade */
@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  .study-card {
    padding: 24px;
  }
}
</style>
