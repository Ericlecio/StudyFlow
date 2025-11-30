<template>
  <div class="page-dark">
    <div class="container">
      <header class="header">
        <h1>Relatório Geral</h1>
        <p class="subtitle">
          Análise baseada em {{ stats.totalTopics }} tópicos de estudo
        </p>
      </header>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div v-else-if="stats.totalTopics === 0" class="empty-state">
        <p>Sem dados suficientes para gerar relatório.</p>
      </div>

      <div v-else class="dashboard-grid">
        <div class="stat-card highlight">
          <h3>Taxa de Acerto Global</h3>
          <div class="big-number" :class="getScoreClass(stats.averageScore)">
            {{ stats.averageScore }}%
          </div>
          <p class="stat-detail">
            {{ stats.totalCorrect }} acertos em
            {{ stats.totalQuestions }} questões
          </p>
        </div>

        <div class="stat-card">
          <h3>Tópico Dominante</h3>
          <div class="icon-stat">🔥</div>
          <p class="topic-name">{{ stats.bestTopic || "N/A" }}</p>
        </div>

        <div class="stat-card">
          <h3>Ponto de Atenção</h3>
          <div class="icon-stat">⚠️</div>
          <p class="topic-name">{{ stats.worstTopic || "N/A" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
// CORREÇÃO: Importa getUserTopics em vez de getUserHistory
import { getUserTopics } from "@/services/firestoreService";

const loading = ref(true);
const stats = ref({
  totalTopics: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  averageScore: 0,
  bestTopic: "",
  worstTopic: "",
});

onMounted(async () => {
  // Pequeno delay para garantir que o Auth carregou
  setTimeout(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Busca a lista de Tópicos
        const topics = await getUserTopics(user.uid);
        processStats(topics);
      } catch (e) {
        console.error("Erro ao gerar relatório:", e);
      }
    }
    loading.value = false;
  }, 500);
});

function processStats(topics) {
  if (!topics || topics.length === 0) return;

  const totalTopics = topics.length;
  // Soma os dados que já estão agregados nos tópicos
  const totalQuestions = topics.reduce(
    (acc, t) => acc + (t.totalQuestions || 0),
    0
  );
  const totalCorrect = topics.reduce(
    (acc, t) => acc + (t.totalCorrect || 0),
    0
  );

  // Média ponderada global
  const averageScore =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Ordena por score para achar melhor/pior tópico
  const sorted = [...topics].sort((a, b) => b.score - a.score);

  const bestTopic = sorted[0]?.title || "";
  let worstTopic = sorted[sorted.length - 1]?.title || "";

  // Se o melhor for igual ao pior (só tem 1 tópico) ou a nota for alta, não mostra "pior"
  if (bestTopic === worstTopic || sorted[sorted.length - 1]?.score >= 80) {
    worstTopic = "-";
  }

  stats.value = {
    totalTopics,
    totalQuestions,
    totalCorrect,
    averageScore,
    bestTopic,
    worstTopic,
  };
}

function getScoreClass(score) {
  if (score >= 80) return "text-green";
  if (score >= 60) return "text-yellow";
  return "text-red";
}
</script>

<style scoped>
/* Reuse os estilos globais ou copie abaixo */
.page-dark {
  background-color: #050507;
  min-height: 100vh;
  color: white;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;
}
.container {
  max-width: 900px;
  margin: 0 auto;
}
.header {
  text-align: center;
  margin-bottom: 40px;
}
.subtitle {
  color: #a0a3b5;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
.stat-card {
  background: #111116;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #2a2d6a;
  text-align: center;
}
.stat-card.highlight {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #111116 0%, #1a1a2e 100%);
  border-color: #4e73df;
}

.big-number {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 10px 0;
}
.text-green {
  color: #10b981;
}
.text-yellow {
  color: #f59e0b;
}
.text-red {
  color: #ef4444;
}
.topic-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 10px 0;
  color: #fff;
}
.icon-stat {
  font-size: 2rem;
  margin-bottom: 10px;
}
.loading-state,
.empty-state {
  text-align: center;
  padding: 50px;
  color: #a0a3b5;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #2a2d6a;
  border-top-color: #4e73df;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
