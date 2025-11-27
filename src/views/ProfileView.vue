<template>
  <div class="profile-page">
    <div class="background-glow"></div>

    <div class="content-wrapper">
      <header class="header">
        <h1 class="title">Meu <span class="brand-highlight">Perfil</span></h1>
      </header>

      <div class="tabs-container">
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'info' }" 
          @click="currentTab = 'info'"
        >
          Dados
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'history' }" 
          @click="currentTab = 'history'"
        >
          Histórico
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'stats' }" 
          @click="currentTab = 'stats'"
        >
          Relatório
        </button>
      </div>

      <transition name="fade" mode="out-in">
        
        <div v-if="currentTab === 'info' && user" class="glass-card profile-info" key="info">
          <div class="avatar-container">
            <img v-if="user.photoURL" :src="user.photoURL" class="avatar" alt="Foto" />
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

        <div v-else-if="currentTab === 'history'" class="tab-content" key="history">
          <div v-if="loading" class="spinner-container"><div class="spinner"></div></div>
          
          <div v-else-if="history.length === 0" class="empty-state">
            <p>Nenhum histórico encontrado.</p>
            <router-link to="/questions" class="btn-action">Começar Quiz</router-link>
          </div>

          <div v-else class="history-list">
            <div v-for="item in history" :key="item.id" class="glass-card history-item">
              <div class="history-header">
                <span class="topic-highlight">{{ item.tema }}</span>
                <span class="date-text">{{ formatDate(item.timestamp) }}</span>
              </div>
              <div class="history-stats">
                <div class="mini-stat">
                  <span class="label">Acertos</span>
                  <span class="value text-green">{{ item.acertos }}</span>
                </div>
                <div class="mini-stat">
                  <span class="label">Erros</span>
                  <span class="value text-red">{{ item.erros }}</span>
                </div>
                <div class="mini-stat">
                  <span class="label">Nota</span>
                  <span class="value score" :class="getScoreClass(item.score)">
                    {{ item.score }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'stats'" class="tab-content" key="stats">
          <div v-if="loading" class="spinner-container"><div class="spinner"></div></div>

          <div v-else-if="stats.totalQuizzes === 0" class="empty-state">
            <p>Sem dados suficientes para gerar relatório.</p>
          </div>

          <div v-else class="dashboard-grid">
            <div class="glass-card stat-box">
              <h3>Total Quizzes</h3>
              <p class="big-number">{{ stats.totalQuizzes }}</p>
            </div>
            <div class="glass-card stat-box">
              <h3>Média Geral</h3>
              <p class="big-number" :class="getScoreClass(stats.averageScore)">
                {{ stats.averageScore }}%
              </p>
            </div>
            <div class="glass-card stat-box">
              <h3>Questões</h3>
              <p class="big-number">{{ stats.totalQuestions }}</p>
            </div>

            <div class="glass-card insight-box best">
              <h3>🔥 Melhor Tema</h3>
              <p>{{ stats.bestTopic || '-' }}</p>
            </div>
            <div class="glass-card insight-box worst">
              <h3>⚠️ Atenção</h3>
              <p>{{ stats.worstTopic || '-' }}</p>
            </div>
          </div>
        </div>

      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserHistory } from "@/services/firestoreService";

// Estado
const user = ref(null);
const currentTab = ref('info'); // 'info', 'history', 'stats'
const history = ref([]);
const loading = ref(true);
const stats = ref({
  totalQuizzes: 0,
  totalQuestions: 0,
  averageScore: 0,
  bestTopic: "",
  worstTopic: "",
});

// Carregar Dados
onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      user.value = u;
      try {
        // Busca histórico
        const data = await getUserHistory(u.uid);
        history.value = data;
        
        // Calcula Estatísticas baseado no histórico carregado
        calculateStats(data);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    }
    loading.value = false;
  });
});

// Funções Auxiliares
function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
  });
}

function getScoreClass(score) {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function calculateStats(data) {
  if (!data || data.length === 0) return;

  const totalQuizzes = data.length;
  const totalQuestions = data.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0);
  const sumScores = data.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = Math.round(sumScores / totalQuizzes);

  // Ordena por nota para achar melhor/pior
  const sorted = [...data].sort((a, b) => b.score - a.score);
  const bestTopic = sorted[0]?.tema || "";
  const worstTopic = sorted[sorted.length - 1]?.tema || "";

  stats.value = { totalQuizzes, totalQuestions, averageScore, bestTopic, worstTopic };
}
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
  --success: #00ff9d;
  --warning: #fdd663;
  --danger: #ff5f5f;

  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-light);
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Alinha no topo */
  padding-top: 80px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
  overflow-y: auto;
  font-family: "Inter", sans-serif;
}

/* Fundo */
.background-glow {
  position: absolute;
  top: -20%; right: -10%; width: 120%; height: 120%;
  background: radial-gradient(circle at 50% 50%, rgba(23, 26, 74, 0.4) 0%, transparent 60%);
  z-index: 0; pointer-events: none;
  animation: pulse 10s infinite alternate;
}

.content-wrapper {
  position: relative; z-index: 1; width: 100%; max-width: 600px; text-align: center;
}

/* Header */
.header { margin-bottom: 30px; }
.title { font-size: 2.5rem; font-weight: 800; }
.brand-highlight {
  background: linear-gradient(135deg, #4e73df, #7096ff, #fff);
  background-size: 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  animation: shine 5s linear infinite;
}

/* --- TABS SYSTEM --- */
.tabs-container {
  display: flex; justify-content: center; gap: 15px; margin-bottom: 30px;
}

.tab-btn {
  background: transparent; border: none; color: var(--text-gray);
  font-size: 1rem; font-weight: 600; padding: 8px 16px; cursor: pointer;
  position: relative; transition: color 0.3s;
}

.tab-btn.active { color: var(--text-light); }
.tab-btn.active::after {
  content: ''; position: absolute; bottom: -5px; left: 0; width: 100%; height: 3px;
  background: var(--brand-color); border-radius: 2px;
  box-shadow: 0 0 10px var(--brand-glow);
}

/* --- CARD GENÉRICO (Glassmorphism) --- */
.glass-card {
  background-color: var(--navy-card); backdrop-filter: blur(12px);
  border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.5);
  padding: 30px; text-align: left;
}

/* --- ESTILOS DO PERFIL (Info) --- */
.profile-info { display: flex; flex-direction: column; align-items: center; }
.avatar-container { margin-bottom: 25px; }
.avatar { width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--brand-color); box-shadow: 0 0 20px var(--brand-glow); object-fit: cover; }
.avatar-placeholder { width: 100px; height: 100px; border-radius: 50%; background: var(--navy-border); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--brand-color); border: 2px solid rgba(255,255,255,0.1); }
.info-group { width: 100%; display: flex; flex-direction: column; gap: 15px; }
.info-item { background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
.label { font-size: 0.8rem; color: var(--text-gray); text-transform: uppercase; display: block; margin-bottom: 4px; }
.value { font-size: 1.1rem; font-weight: 500; }

/* --- ESTILOS DO HISTÓRICO --- */
.history-list { display: flex; flex-direction: column; gap: 15px; }
.history-item { padding: 20px; transition: transform 0.2s; }
.history-item:hover { transform: translateY(-3px); border-color: var(--brand-color); }
.history-header { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
.topic-highlight { font-weight: bold; color: var(--brand-color); }
.date-text { font-size: 0.85rem; color: var(--text-gray); }
.history-stats { display: flex; justify-content: space-between; }
.mini-stat { text-align: center; }
.text-green { color: var(--success); }
.text-red { color: var(--danger); }
.score.high { color: var(--success); text-shadow: 0 0 10px rgba(0,255,157,0.3); }
.score.medium { color: var(--warning); }
.score.low { color: var(--danger); }

/* --- ESTILOS DO RELATÓRIO (Dashboard) --- */
.dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.stat-box { text-align: center; padding: 20px; }
.stat-box h3 { font-size: 0.9rem; color: var(--text-gray); margin-bottom: 10px; }
.big-number { font-size: 2rem; font-weight: 800; }
.insight-box { grid-column: span 2; display: flex; justify-content: space-between; align-items: center; padding: 20px; }
.insight-box h3 { font-size: 1rem; margin: 0; }
.insight-box.best { border-left: 4px solid var(--success); }
.insight-box.worst { border-left: 4px solid var(--danger); }

/* Empty State & Spinner */
.empty-state { text-align: center; margin-top: 30px; color: var(--text-gray); }
.btn-action { display: inline-block; margin-top: 15px; color: var(--brand-color); border: 1px solid var(--brand-color); padding: 8px 20px; border-radius: 20px; text-decoration: none; transition: 0.3s; }
.btn-action:hover { background: var(--brand-color); color: white; box-shadow: 0 0 15px var(--brand-glow); }
.spinner-container { display: flex; justify-content: center; margin-top: 30px; }
.spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--brand-color); border-radius: 50%; animation: spin 1s linear infinite; }

/* Animações e Responsividade */
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shine { to { background-position: 200%; } }
@keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 0.8; } }

/* Animação de transição suave das abas */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 500px) {
  .dashboard-grid { grid-template-columns: 1fr; }
  .insight-box { grid-column: span 1; flex-direction: column; gap: 5px; text-align: center; }
}
</style>