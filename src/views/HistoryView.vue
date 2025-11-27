<template>
  <div class="page-dark">
    <div class="container">
      <header>
        <h1>Histórico de Estudos</h1>
        <p class="subtitle">Acompanhe sua evolução cronológica</p>
      </header>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="history.length === 0" class="empty-state">
        <p>Nenhum histórico encontrado.</p>
        <router-link to="/questions" class="btn-start"
          >Começar um Quiz</router-link
        >
      </div>

      <div v-else class="timeline">
        <div v-for="item in history" :key="item.id" class="history-card">
          <div class="card-header">
            <span class="topic">{{ item.tema }}</span>
            <span class="date">{{ formatDate(item.timestamp) }}</span>
          </div>

          <div class="card-stats">
            <div class="stat">
              <span class="label">Acertos</span>
              <span class="value text-green">{{ item.acertos }}</span>
            </div>
            <div class="stat">
              <span class="label">Erros</span>
              <span class="value text-red">{{ item.erros }}</span>
            </div>
            <div class="stat">
              <span class="label">Nota</span>
              <span class="value score" :class="getScoreClass(item.score)">
                {{ item.score }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { getUserHistory } from "@/services/firestoreService"; // <--- Importação CORRETA aqui

const history = ref([]);
const loading = ref(true);

onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      // Busca na subcoleção do usuário
      history.value = await getUserHistory(user.uid);
    } catch (e) {
      console.error("Erro ao carregar histórico:", e);
    }
  }
  loading.value = false;
});

function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getScoreClass(score) {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}
</script>

<style scoped>
.page-dark {
  background-color: #131314;
  min-height: 100vh;
  color: #e3e3e3;
  padding: 40px 20px;
}

.container {
  max-width: 700px;
  margin: 0 auto;
}

header {
  margin-bottom: 40px;
  text-align: center;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(90deg, #8ab4f8, #c58af9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #9aa0a6;
}

/* Cards */
.history-card {
  background-color: #1e1f20;
  border: 1px solid #3c4043;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  transition: transform 0.2s;
}

.history-card:hover {
  transform: translateY(-2px);
  border-color: #5f6368;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid #3c4043;
  padding-bottom: 12px;
}

.topic {
  font-weight: 600;
  font-size: 1.1rem;
  color: #e8eaed;
}

.date {
  font-size: 0.85rem;
  color: #9aa0a6;
}

.card-stats {
  display: flex;
  justify-content: space-around;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 0.8rem;
  color: #9aa0a6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.value {
  font-size: 1.2rem;
  font-weight: 700;
}

.text-green {
  color: #81c995;
}
.text-red {
  color: #f28b82;
}

.score.high {
  color: #81c995;
}
.score.medium {
  color: #fdd663;
}
.score.low {
  color: #f28b82;
}

/* Empty State */
.empty-state {
  text-align: center;
  margin-top: 50px;
  color: #9aa0a6;
}

.btn-start {
  display: inline-block;
  margin-top: 20px;
  background: #8ab4f8;
  color: #202124;
  padding: 10px 24px;
  border-radius: 24px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-start:hover {
  background: #aecbfa;
}

/* Spinner */
.loading {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #3c4043;
  border-top-color: #8ab4f8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
