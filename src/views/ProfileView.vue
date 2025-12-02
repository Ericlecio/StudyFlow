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
          Meus Tópicos
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
        <div
          v-if="currentTab === 'info' && user"
          class="glass-card profile-info"
          key="info"
        >
          <div class="avatar-container">
            <img
              v-if="user.photoURL"
              :src="user.photoURL"
              class="avatar"
              alt="Foto"
            />
            <div v-else class="avatar-placeholder">
              {{ user.displayName ? user.displayName[0].toUpperCase() : "U" }}
            </div>
          </div>

          <div class="info-group">
            <div class="info-item">
              <span class="label">Nome</span>
              <span class="value">{{
                user.displayName || "Usuário StudyFlow"
              }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">ID</span>
              <span class="value uid">{{ user.uid.substring(0, 8) }}...</span>
            </div>
          </div>

          <button @click="logout" class="btn-logout">Sair da Conta</button>
        </div>

        <div
          v-else-if="currentTab === 'history'"
          class="tab-content"
          key="history"
        >
          <div v-if="loading" class="spinner-container">
            <div class="spinner"></div>
          </div>

          <div v-else-if="topics.length === 0" class="empty-state">
            <p>Você ainda não iniciou nenhum fluxo de estudo.</p>
            <router-link to="/questions" class="btn-action">
              Começar Novo Tópico
            </router-link>
          </div>

          <div v-else class="history-list">
            <div
              v-for="topic in topics"
              :key="topic.id"
              class="glass-card topic-card"
              @click="continueStudy(topic)"
            >
              <div class="topic-header">
                <div class="topic-info">
                  <h3 class="topic-title">{{ topic.title }}</h3>
                  <span class="topic-date"
                    >Visto em {{ formatDate(topic.lastActive) }}</span
                  >
                </div>
                <div class="topic-score" :class="getScoreClass(topic.score)">
                  {{ topic.score }}%
                </div>
              </div>

              <div class="topic-meta">
                <span>{{ topic.totalQuestions }} questões respondidas</span>
              </div>

              <div
                v-if="topic.weakPoints && topic.weakPoints.length > 0"
                class="review-section"
              >
                <span class="review-label">⚠️ Focar em:</span>
                <div class="tags">
                  <span
                    v-for="point in topic.weakPoints"
                    :key="point"
                    class="tag"
                  >
                    {{ point }}
                  </span>
                </div>
              </div>

              <div class="hover-action">Continuar Fluxo →</div>
            </div>
          </div>
        </div>

        <div v-else-if="currentTab === 'stats'" class="tab-content" key="stats">
          <div v-if="loading" class="spinner-container">
            <div class="spinner"></div>
          </div>

          <div v-else-if="stats.totalQuestions === 0" class="empty-state">
            <p>Sem dados suficientes para gerar relatório.</p>
          </div>

          <div v-else class="dashboard-grid">
            <div class="glass-card stat-box">
              <h3>Tópicos Estudados</h3>
              <p class="big-number">{{ stats.totalTopics }}</p>
            </div>
            <div class="glass-card stat-box">
              <h3>Média Geral</h3>
              <p class="big-number" :class="getScoreClass(stats.averageScore)">
                {{ stats.averageScore }}%
              </p>
            </div>
            <div class="glass-card stat-box">
              <h3>Questões Totais</h3>
              <p class="big-number">{{ stats.totalQuestions }}</p>
            </div>

            <div class="glass-card insight-box best">
              <div class="insight-icon">🔥</div>
              <div class="insight-info">
                <h3>Melhor Desempenho</h3>
                <p>{{ stats.bestTopic || "-" }}</p>
              </div>
            </div>
            <div class="glass-card insight-box worst">
              <div class="insight-icon">⚠️</div>
              <div class="insight-info">
                <h3>Precisa Revisar</h3>
                <p>{{ stats.worstTopic || "-" }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUserTopics } from "@/services/firestoreService"; // NOVO: Busca Tópicos

const router = useRouter();
const user = ref(null);
const currentTab = ref("info");
const topics = ref([]);
const loading = ref(true);
const stats = ref({
  totalTopics: 0,
  totalQuestions: 0,
  averageScore: 0,
  bestTopic: "",
  worstTopic: "",
});

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    if (u) {
      user.value = u;
      try {
        // Busca os tópicos agrupados do Firestore
        const data = await getUserTopics(u.uid);
        topics.value = data;
        calculateStats(data);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    } else {
      router.push("/login");
    }
    loading.value = false;
  });
});

async function logout() {
  await signOut(auth);
  router.push("/");
}

function continueStudy(topic) {
  // Redireciona para a tela de questões carregando o ID do tópico
  router.push({
    path: "/questions",
    query: { topicId: topic.id, topicName: topic.title },
  });
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  // Trata timestamp do Firestore ou string ISO
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getScoreClass(score) {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function calculateStats(topicsData) {
  if (!topicsData || topicsData.length === 0) return;

  const totalTopics = topicsData.length;

  // Soma total de questões de todos os tópicos
  const totalQuestions = topicsData.reduce(
    (acc, t) => acc + (t.totalQuestions || 0),
    0
  );

  // Média Ponderada (Baseada no número de questões de cada tópico)
  let weightedScoreSum = 0;
  topicsData.forEach((t) => {
    weightedScoreSum += t.score * t.totalQuestions;
  });

  const averageScore =
    totalQuestions > 0 ? Math.round(weightedScoreSum / totalQuestions) : 0;

  // Encontrar melhor e pior tópico
  const sorted = [...topicsData].sort((a, b) => b.score - a.score);
  const bestTopic = sorted[0]?.title || "";

  // Só define pior tópico se for diferente do melhor e tiver score baixo
  let worstTopic = sorted[sorted.length - 1]?.title || "";
  if (bestTopic === worstTopic || sorted[sorted.length - 1]?.score >= 80) {
    worstTopic = "-";
  }

  stats.value = {
    totalTopics,
    totalQuestions,
    averageScore,
    bestTopic,
    worstTopic,
  };
}
</script>

<style scoped>
.profile-page {
  --bg-dark: #050507;
  --navy-card: rgba(23, 26, 74, 0.6);
  --navy-border: #2a2d6a;
  --text-light: #ffffff;
  --text-gray: #a0a3b5;
  --brand-color: #4e73df;
  --brand-glow: rgba(78, 115, 223, 0.5);
  --success: #10b981;
  --warning: #fdd663;
  --danger: #ff5f5f;

  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-light);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  padding-bottom: 40px;
  padding-left: 20px;
  padding-right: 20px;
  position: relative;
  font-family: "Inter", sans-serif;
  overflow-x: hidden;
}

/* Fundo Animado */
.background-glow {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 120%;
  height: 120%;
  background: radial-gradient(
    circle at 60% 40%,
    rgba(78, 115, 223, 0.15) 0%,
    transparent 60%
  );
  z-index: 0;
  pointer-events: none;
  animation: pulse 8s infinite alternate;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 700px;
  text-align: center;
}

.header {
  margin-bottom: 30px;
}
.title {
  font-size: 2.2rem;
  font-weight: 800;
}
.brand-highlight {
  background: linear-gradient(135deg, #4e73df, #7096ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Abas */
.tabs-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.03);
  padding: 5px;
  border-radius: 30px;
  display: inline-flex;
}

.tab-btn {
  background: transparent;
  border: none;
  color: var(--text-gray);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 10px 24px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: white;
}

.tab-btn.active {
  color: white;
  background: var(--brand-color);
  box-shadow: 0 4px 15px rgba(78, 115, 223, 0.4);
}

/* Glass Card Genérico */
.glass-card {
  background-color: var(--navy-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  padding: 25px;
  text-align: left;
  margin-bottom: 20px;
}

/* ABA INFO */
.profile-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.avatar-container {
  margin-bottom: 25px;
}
.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 4px solid var(--navy-border);
  box-shadow: 0 0 20px var(--brand-glow);
  object-fit: cover;
}
.avatar-placeholder {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: var(--navy-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: var(--brand-color);
  border: 2px solid rgba(255, 255, 255, 0.1);
}
.info-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.info-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.label {
  font-size: 0.8rem;
  color: var(--text-gray);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.value {
  font-size: 1.05rem;
  font-weight: 500;
  color: white;
}
.value.uid {
  font-family: monospace;
  opacity: 0.6;
}
.btn-logout {
  margin-top: 25px;
  background: transparent;
  border: 1px solid var(--danger);
  color: var(--danger);
  padding: 10px 25px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  width: 100%;
}
.btn-logout:hover {
  background: var(--danger);
  color: white;
}

/* ABA TOPICOS (Cards Inteligentes) */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.topic-card {
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s, background-color 0.2s;
  border-left: 5px solid transparent;
  position: relative;
}
.topic-card:hover {
  transform: translateX(5px);
  border-left-color: var(--brand-color);
  background-color: rgba(23, 26, 74, 0.9);
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}
.topic-title {
  font-size: 1.2rem;
  color: white;
  margin: 0 0 5px 0;
  font-weight: 700;
}
.topic-date {
  font-size: 0.8rem;
  color: var(--text-gray);
}
.topic-score {
  font-weight: 800;
  font-size: 1.2rem;
}
.topic-meta {
  font-size: 0.9rem;
  color: var(--text-gray);
  margin-bottom: 10px;
}

.review-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  border: 1px dashed rgba(255, 95, 95, 0.3);
}
.review-label {
  font-size: 0.75rem;
  color: var(--danger);
  font-weight: bold;
  text-transform: uppercase;
  display: block;
  margin-bottom: 5px;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.tag {
  font-size: 0.8rem;
  background: rgba(255, 95, 95, 0.1);
  color: #ffcccc;
  padding: 2px 8px;
  border-radius: 4px;
}

.hover-action {
  font-size: 0.8rem;
  color: var(--brand-color);
  text-align: right;
  margin-top: 10px;
  opacity: 0;
  transition: opacity 0.2s;
  font-weight: 600;
}
.topic-card:hover .hover-action {
  opacity: 1;
}

/* Cores de Nota */
.score.high {
  color: var(--success);
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}
.score.medium {
  color: var(--warning);
}
.score.low {
  color: var(--danger);
}

/* Dashboard Stats */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
.stat-box {
  text-align: center;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.stat-box h3 {
  font-size: 0.9rem;
  color: var(--text-gray);
  margin-bottom: 5px;
}
.big-number {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
}

.insight-box {
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
}
.insight-icon {
  font-size: 2rem;
}
.insight-info h3 {
  font-size: 0.9rem;
  color: var(--text-gray);
  margin: 0 0 5px 0;
}
.insight-info p {
  margin: 0;
  font-weight: 600;
  font-size: 1.1rem;
}
.insight-box.best {
  border-left: 4px solid var(--success);
}
.insight-box.worst {
  border-left: 4px solid var(--danger);
}

/* Empty & Loading */
.empty-state {
  text-align: center;
  margin-top: 40px;
  color: var(--text-gray);
}
.btn-action {
  display: inline-block;
  margin-top: 15px;
  background: var(--brand-color);
  color: white;
  padding: 10px 25px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  transition: 0.3s;
}
.btn-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px var(--brand-glow);
}
.spinner-container {
  display: flex;
  justify-content: center;
  padding: 40px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--brand-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.6;
  }
}

/* Transições */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 500px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .insight-box {
    grid-column: span 1;
    flex-direction: column;
    text-align: center;
  }
  .topic-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .topic-score {
    margin-top: 5px;
  }
}
</style>
