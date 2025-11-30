<template>
  <div class="app-layout">
    <button class="mobile-menu-btn" @click="isMobileSidebarOpen = true">
      ☰
    </button>

    <div class="sidebar-wrapper">
      <StudySidebar
        :currentTopicId="currentTopicId"
        :isMobileOpen="isMobileSidebarOpen"
        @select-topic="loadTopic"
        @new-session="resetSession"
        @close-mobile="isMobileSidebarOpen = false"
      />
    </div>

    <main class="main-content">
      <div class="content-container">
        <header class="header">
          <h1>
            StudyFlow
            <span v-if="topic" class="breadcrumb">/ {{ topic }}</span>
          </h1>
        </header>

        <div v-if="questions.length === 0 && !loading" class="new-session-view">
          <SuggestionsCarousel @selectTopic="selectTopicAndGenerate" />
          <div class="search-wrapper">
            <div class="input-group">
              <input
                v-model="topicInput"
                class="topic-input"
                placeholder="O que vamos estudar hoje?"
                @keyup.enter="startNewSession"
              />
              <button @click="startNewSession" class="btn-go">➔</button>
            </div>
          </div>
          <FilterBar v-model="filters" />
        </div>

        <LoadingScreen v-if="loading" />

        <div v-if="questions.length > 0 && !loading" class="quiz-view">
          <div class="cards-list">
            <QuestionCard
              v-for="(q, index) in questions"
              :key="q.id || index"
              :question="q"
              :index="index"
              :modelValue="answers[index]"
              @update:modelValue="(val) => handleAnswer(index, val)"
              @rate-difficulty="handleDifficultyRating"
              @debate="currentQuestion = q"
            />
          </div>

          <div class="actions-bar">
            <button
              @click="generateMore"
              :disabled="generatingMore"
              class="action-btn secondary"
            >
              <span v-if="!generatingMore">🔄 Gerar Mais</span>
              <span v-else>Criando...</span>
            </button>
            <button @click="saveAndExit" class="action-btn primary">
              💾 Salvar Progresso
            </button>
          </div>
        </div>
      </div>
    </main>

    <AIDebateModal
      v-if="currentQuestion"
      :question="currentQuestion"
      @close="currentQuestion = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { auth } from "@/firebase";
import { generateQuestions } from "@/services/questionService";
import { saveStudySession, getTopicHistory } from "@/services/firestoreService";
import StudySidebar from "@/components/StudySidebar.vue";
import LoadingScreen from "@/components/LoadingScreen.vue";
import QuestionCard from "@/components/QuestionCard.vue";
import SuggestionsCarousel from "@/components/SuggestionsCarousel.vue";
import FilterBar from "@/components/FilterBar.vue";
import AIDebateModal from "@/components/AIDebateModal.vue";

const route = useRoute();
const router = useRouter();
const isMobileSidebarOpen = ref(false);
const loading = ref(false);
const generatingMore = ref(false);
const topic = ref("");
const topicInput = ref("");
const currentTopicId = ref(null);
const filters = ref({ type: "mixed" });
const questions = ref([]);
const answers = ref([]);
const currentQuestion = ref(null);
const sessionPendingData = ref([]);

onMounted(async () => {
  if (route.query.topicId) {
    await loadTopicById(route.query.topicId, route.query.topicName);
  }
});

function resetSession() {
  topic.value = "";
  topicInput.value = "";
  currentTopicId.value = null;
  questions.value = [];
  answers.value = [];
  sessionPendingData.value = [];
  isMobileSidebarOpen.value = false;
}

async function loadTopic(topicData) {
  await loadTopicById(topicData.id, topicData.title);
}

async function loadTopicById(id, title) {
  loading.value = true;
  currentTopicId.value = id;
  topic.value = title;

  const user = auth.currentUser;
  if (user) {
    const history = await getTopicHistory(user.uid, id);
    questions.value = history.map((h) => h.questionData);
    answers.value = history.map((h) => h.userAnswer);
    // IMPORTANTE: Restaurar dificuldade se existir
    // Mas como o QuestionCard é stateless quanto a isso, o foco é nas novas
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
  }
  loading.value = false;
}

function selectTopicAndGenerate(selected) {
  topic.value = selected;
  generateMore();
}

async function startNewSession() {
  if (!topicInput.value.trim()) return;
  topic.value = topicInput.value;
  await generateMore();
}

async function generateMore() {
  generatingMore.value = true;
  if (questions.value.length === 0) loading.value = true;

  try {
    const newQuestions = await generateQuestions(topic.value, 5, filters.value);
    const processedQuestions = newQuestions.map((q) => ({
      ...q,
      id: q.id || `temp_${Date.now()}_${Math.random()}`,
    }));
    questions.value.push(...processedQuestions);
    answers.value.push(...Array(processedQuestions.length).fill(null));
  } catch (e) {
    alert("Erro ao conectar com a IA.");
  } finally {
    loading.value = false;
    generatingMore.value = false;
  }
}

function handleAnswer(index, val) {
  answers.value[index] = val;
  const questionObj = questions.value[index];
  const record = {
    questionData: questionObj,
    userAnswer: val,
    isCorrect: val === questionObj.answer,
    difficulty: "medium", // Valor padrão caso o usuário não vote
  };
  const pendingIndex = sessionPendingData.value.findIndex(
    (q) => q.questionData.id === questionObj.id
  );

  if (pendingIndex >= 0) {
    sessionPendingData.value[pendingIndex] = record;
  } else {
    sessionPendingData.value.push(record);
  }
}

// NOVO: Captura a dificuldade escolhida no card
function handleDifficultyRating({ questionId, level }) {
  const pendingIndex = sessionPendingData.value.findIndex(
    (q) => q.questionData.id === questionId
  );
  if (pendingIndex >= 0) {
    sessionPendingData.value[pendingIndex].difficulty = level;
    console.log(`Questão ${questionId} marcada como ${level}`);
  }
}

async function saveAndExit() {
  const user = auth.currentUser;
  if (!user) return router.push("/login");
  if (sessionPendingData.value.length === 0 && questions.length > 0) {
    return router.push("/profile");
  }
  try {
    const correctCount = sessionPendingData.value.filter(
      (q) => q.isCorrect
    ).length;
    await saveStudySession(user.uid, {
      tema: topic.value,
      totalQuestions: sessionPendingData.value.length,
      acertos: correctCount,
      score:
        sessionPendingData.value.length > 0
          ? Math.round((correctCount / sessionPendingData.value.length) * 100)
          : 0,
      questionsDetails: sessionPendingData.value,
    });
    sessionPendingData.value = [];
    router.push("/profile");
  } catch (e) {
    alert("Erro ao salvar progresso.");
  }
}
</script>

<style scoped>
/* CSS Reset Global Simples para este componente */
* {
  box-sizing: border-box;
}

/* Layout Grid Robusto */
.app-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
  width: 100%;
  background-color: #050507;
  color: white;
  font-family: "Inter", sans-serif;
  overflow: hidden;
  position: relative;
}

/* Wrapper da Sidebar (Controla espaço no grid) */
.sidebar-wrapper {
  height: 100%;
  position: relative;
  z-index: 20;
}

/* Área Principal */
.main-content {
  position: relative;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #050507;
  width: 100%;
  min-width: 0; /* Impede estouro horizontal */
}

.content-container {
  width: 100%;
  max-width: 1000px;
  padding: 40px 20px;
  margin: 0 auto;
  padding-bottom: 100px;
}

/* Header */
.header {
  text-align: center;
  margin: 20px 0 30px 0;
}
.header h1 {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4e73df, #7096ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #4e73df;
}
.breadcrumb {
  font-weight: 300;
  color: #a0a3b5;
  -webkit-text-fill-color: #a0a3b5;
}

/* Input Search */
.new-session-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 10px;
}

.search-wrapper {
  margin: 30px 0;
  width: 100%;
  display: flex;
  justify-content: center;
}

.input-group {
  position: relative;
  width: 100%;
  max-width: 700px;
  display: flex;
  align-items: center;
  border-radius: 14px;
  background: linear-gradient(45deg, #0a0a0c, #4e73df, #7096ff, #0a0a0c);
  background-size: 400%;
  padding: 2px;
  animation: borderAnim 8s infinite linear;
}

@keyframes borderAnim {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.topic-input {
  flex: 1;
  background: #0a0a0c;
  border: none;
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  outline: none;
  width: 100%;
}

.btn-go {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #4e73df;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 5;
  padding: 10px;
}

/* Quiz Grid */
.cards-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  width: 100%;
}

/* Ações */
.actions-bar {
  display: flex;
  justify-content: center;
  gap: 15px;
  padding-bottom: 40px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  border: none;
}
.action-btn.primary {
  background: linear-gradient(90deg, #10b981, #059669);
  color: white;
}
.action-btn.secondary {
  background: transparent;
  border: 1px solid #4e73df;
  color: #4e73df;
}
.action-btn:hover {
  transform: translateY(-2px);
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #2a2d6a;
  border-top-color: #4e73df;
  border-radius: 50%;
  animation: spin 1s infinite linear;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile Toggle */
.mobile-menu-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 50;
  background: #171a4a;
  border: 1px solid #2a2d6a;
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: none;
  font-size: 1.5rem;
}

/* RESPONSIVIDADE */
@media (max-width: 900px) {
  .cards-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .app-layout {
    display: block;
    position: relative;
    height: 100vh;
  }

  .mobile-menu-btn {
    display: block;
  }

  /* Sidebar absoluta no mobile */
  .sidebar-wrapper {
    position: absolute;
    z-index: 100;
  }

  .main-content {
    width: 100%;
    height: 100%;
    padding-top: 60px;
  }

  .content-container {
    padding: 20px 15px;
  }
  .header h1 {
    font-size: 1.8rem;
  }
  .input-group {
    max-width: 100%;
  }
}
</style>
