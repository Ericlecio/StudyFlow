<template>
  <div class="profile-page">
    <div class="background-glow"></div>

    <div class="content-wrapper">
      <header class="header">
        <h1 class="title">Meu <span class="brand-highlight">Perfil</span></h1>
      </header>

      <transition name="fade">
        <div class="profile-card" v-if="user">
          
          <div class="avatar-container">
            <img v-if="user.photoURL" :src="user.photoURL" class="avatar" alt="Foto de perfil" />
            <div v-else class="avatar-placeholder">
              {{ user.displayName ? user.displayName[0] : 'U' }}
            </div>
          </div>

          <div class="info-group">
            <div class="info-item">
              <span class="label">Nome</span>
              <span class="value">{{ user.displayName || "Não informado" }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">{{ user.email }}</span>
            </div>
          </div>
        </div>

        <div v-else class="loading-state">
          <div class="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </transition>
    </div>
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
/* --- Configurações Gerais --- */
.profile-page {
  --bg-dark: #050507;
  --navy-card: rgba(23, 26, 74, 0.7);
  --navy-border: #2a2d6a;
  --text-light: #ffffff;
  --text-gray: #a0a3b5;
  --brand-color: #4e73df;
  --brand-glow: rgba(78, 115, 223, 0.5);

  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-light);
  
  display: flex;
  justify-content: center; /* Centraliza horizontalmente */
  
  /* --- AJUSTE DE POSIÇÃO AQUI --- */
  align-items: flex-start; /* Alinha no topo */
  padding-top: 100px;      /* Empurra 100px para baixo (ajuste conforme necessário) */
  /* ----------------------------- */

  padding-left: 24px;
  padding-right: 24px;
  
  position: relative;
  overflow: hidden;
  font-family: "Inter", system-ui, sans-serif;
}

/* --- Fundo Animado --- */
.background-glow {
  position: absolute;
  top: -20%;
  right: -10%;
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
  max-width: 500px;
  text-align: center;
}

/* --- Tipografia e Título --- */
.header {
  margin-bottom: 40px;
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
}

.brand-highlight {
  background: linear-gradient(135deg, #4e73df 0%, #7096ff 50%, #ffffff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shineText 5s linear infinite;
}

/* --- Card Principal --- */
.profile-card {
  background-color: var(--navy-card);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* --- Avatar --- */
.avatar-container {
  margin-bottom: 30px;
  position: relative;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--brand-color);
  box-shadow: 0 0 20px var(--brand-glow);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--navy-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--brand-color);
  border: 2px solid rgba(255,255,255,0.1);
}

/* --- Informações --- */
.info-group {
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.value {
  font-size: 1.1rem;
  color: var(--text-light);
  font-weight: 500;
}

/* --- Loading State --- */
.loading-state {
  color: var(--text-gray);
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: var(--brand-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* --- Animações --- */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shineText {
  to { background-position: 200% center; }
}

@keyframes pulseBackground {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>