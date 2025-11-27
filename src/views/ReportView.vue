<template>
  <div class="page-dark">
    <div class="container">
      <header>
        <h1>Relatório de Desempenho</h1>
      </header>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <div v-else-if="stats.totalQuizzes === 0" class="empty-state">
        <p>Sem dados suficientes para gerar relatório.</p>
      </div>

      <div v-else class="dashboard">
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Quizzes</h3>
            <p class="big-number">{{ stats.totalQuizzes }}</p>
          </div>
          <div class="stat-card">
            <h3>Média Geral</h3>
            <p class="big-number" :class="getScoreClass(stats.averageScore)">
              {{ stats.averageScore }}%
            </p>
          </div>
          <div class="stat-card">
            <h3>Questões Respondidas</h3>
            <p class="big-number">{{ stats.totalQuestions }}</p>
          </div>
        </div>

        <div class="insights-section">
          <div class="insight-card">
            <h3>🔥 Melhor Desempenho</h3>
            <p v-if="stats.bestTopic" class="topic-name">
              {{ stats.bestTopic }}
            </p>
            <p v-else class="no-data">-</p>
          </div>

          <div class="insight-card warning">
            <h3>⚠️ Precisa Melhorar</h3>
            <p v-if="stats.worstTopic" class="topic-name">
              {{ stats.worstTopic }}
            </p>
            <p v-else class="no-data">-</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { getUserHistory } from "@/services/firestoreService"; // <--- Importação CORRETA

const loading = ref(true);
const stats = ref({
  totalQuizzes: 0,
  totalQuestions: 0,
  averageScore: 0,
  bestTopic: "",
  worstTopic: "",
});

onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    try {
      const history = await getUserHistory(user.uid);
      calculateStats(history);
    } catch (e) {
      console.error("Erro relatório:", e);
    }
  }
  loading.value = false;
});

function calculateStats(history) {
  if (history.length === 0) return;

  const totalQuizzes = history.length;
  const totalQuestions = history.reduce(
    (acc, curr) => acc + (curr.totalQuestions || 0),
    0
  );

  const sumScores = history.reduce((acc, curr) => acc + (curr.score || 0), 0);
  const averageScore = Math.round(sumScores / totalQuizzes);

  // Lógica simples para melhor/pior tema (baseado na última ocorrência ou média)
  // Aqui pegamos o tema com a maior nota individual para simplificar
  const sortedByScore = [...history].sort((a, b) => b.score - a.score);
  const bestTopic = sortedByScore[0]?.tema || "";
  const worstTopic = sortedByScore[sortedByScore.length - 1]?.tema || "";

  stats.value = {
    totalQuizzes,
    totalQuestions,
    averageScore,
    bestTopic,
    worstTopic,
  };
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
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  background: linear-gradient(90deg, #c58af9, #8ab4f8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: #1e1f20;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #3c4043;
}

.stat-card h3 {
  color: #9aa0a6;
  font-size: 0.9rem;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.big-number {
  font-size: 3rem;
  font-weight: 700;
  color: white;
}

.high {
  color: #81c995;
}
.medium {
  color: #fdd663;
}
.low {
  color: #f28b82;
}

.insights-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.insight-card {
  background: #1e1f20;
  padding: 24px;
  border-radius: 16px;
  border-left: 4px solid #81c995;
}

.insight-card.warning {
  border-left-color: #f28b82;
}

.insight-card h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: #e8eaed;
}

.topic-name {
  font-size: 1.2rem;
  font-weight: 500;
}

/* Responsividade */
@media (max-width: 600px) {
  .insights-section {
    grid-template-columns: 1fr;
  }
}

.loading {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #3c4043;
  border-top-color: #c58af9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
