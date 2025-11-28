<template>
  <div class="page-dark">
    <div class="container">
      <header class="header">
        <h1>StudyFlow</h1>
        <p class="subtitle">Estude com foco em concursos e exames</p>
      </header>

      <SuggestionsCarousel
        @selectTopic="
          topic = $event;
          handleGenerate();
        "
      />

      <div class="search-box">
        <div class="input-group">
          <input
            v-model="topic"
            class="topic-input"
            placeholder="Digite o assunto (ex: Direito Administrativo, Python, Enem...)"
            @keyup.enter="handleGenerate"
            :disabled="loading"
          />
          <div v-if="loading" class="loading-indicator">
            <div class="spinner-small"></div>
            <span>Buscando...</span>
          </div>
        </div>
      </div>

      <FilterBar v-model="filters" @update:modelValue="handleGenerate(true)" />

      <div v-if="loading && questions.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>Pesquisando e gerando questões...</p>
      </div>

      <div v-if="questions.length > 0" class="quiz-area">
        <div class="quiz-header">
          <h2>
            Resultados para: <span>{{ currentTopic }}</span>
          </h2>
          <span class="badge">{{ questions.length }} questões encontradas</span>
        </div>

        <div class="cards-list">
          <QuestionCard
            v-for="(q, index) in questions"
            :key="q.id"
            :question="q"
            :index="index"
            v-model="answers[index]"
            @update:modelValue="saveState"
            @debate="currentQuestion = q"
          />
        </div>

        <div class="load-more-container">
          <button
            @click="handleLoadMore"
            :disabled="loadingMore"
            class="load-more-btn"
          >
            <span v-if="!loadingMore"
              >Carregar mais questões sobre "{{ currentTopic }}"</span
            >
            <span v-else>Gerando reforço personalizado...</span>
          </button>
        </div>
      </div>

      <AIDebateModal
        v-if="currentQuestion"
        :question="currentQuestion"
        @close="currentQuestion = null"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { generateQuestions } from "@/services/questionService";
import QuestionCard from "@/components/QuestionCard.vue";
import SuggestionsCarousel from "@/components/SuggestionsCarousel.vue";
import FilterBar from "@/components/FilterBar.vue";
import AIDebateModal from "@/components/AIDebateModal.vue";

const topic = ref("");
const currentTopic = ref("");
const loading = ref(false);
const loadingMore = ref(false);
const questions = ref([]);
const answers = ref([]);
const filters = ref({ type: "mixed" });
const currentQuestion = ref(null);

const BATCH_SIZE = 5;
const STORAGE_KEY = "quiz_state";

onMounted(() => {
  loadState();
});

function loadState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      questions.value = state.questions || [];
      answers.value = state.answers || [];
      currentTopic.value = state.currentTopic || "";
      topic.value = state.currentTopic || "";
      filters.value = state.filters || { type: "mixed" };
    }
  } catch (e) {
    console.error("Erro ao carregar estado do localStorage:", e);
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveState() {
  const state = {
    questions: questions.value,
    answers: answers.value,
    currentTopic: currentTopic.value,
    filters: filters.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function handleGenerate(fromFilter = false) {
  if (!topic.value.trim() && !fromFilter) return;

  loading.value = true;

  if (!fromFilter) {
    questions.value = [];
    answers.value = [];
  }

  currentTopic.value = topic.value;

  try {
    const result = await generateQuestions(
      topic.value,
      BATCH_SIZE,
      filters.value
    );

    if (!fromFilter) {
      questions.value = result;
      answers.value = Array(result.length).fill(null);
    } else {
      questions.value = result;
      answers.value = Array(result.length).fill(null);
    }

    saveState();
  } catch (err) {
    console.error("Erro:", err);
    alert(err.message || "Erro ao buscar questões.");
  } finally {
    loading.value = false;
  }
}

async function handleLoadMore() {
  loadingMore.value = true;
  try {
    // Lógica de erros para reforço da IA
    const recentErrors = questions.value.filter((q, index) => {
      const ans = answers.value[index];
      return ans && ans !== q.answer;
    });

    let searchTopic = currentTopic.value;

    if (recentErrors.length > 0) {
      const errorContext = recentErrors
        .slice(-3)
        .map((q) => q.question)
        .join(". ");

      searchTopic += `. O aluno errou anteriormente questões sobre: "${errorContext}". Gere novas questões focadas em reforçar os conceitos corretos para essas dúvidas, mas mantendo o tema principal.`;
    }

    const result = await generateQuestions(
      searchTopic,
      BATCH_SIZE,
      filters.value
    );

    questions.value.push(...result);
    const newAnswers = Array(result.length).fill(null);
    answers.value.push(...newAnswers);

    saveState();
  } catch (err) {
    console.error("Erro:", err);
    alert("Não foi possível carregar mais questões.");
  } finally {
    loadingMore.value = false;
  }
}
</script>

<style scoped>
/* Variáveis de cores para consistência */
:root {
  --color-primary: #4e73df;
  --color-secondary: #7096ff;
  --color-bg-dark: #050507;
  --color-card-dark: #111116;
  --color-border: #2a2d6a;
  --color-success: #10b981;
  --color-error: #ef4444;
}

/* --- QuestionView.vue (Global Styles) --- */

.page-dark {
  background-color: var(--color-bg-dark);
  min-height: 100vh;
  color: white;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

/* CORREÇÃO DO TÍTULO */
.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 10px;
  text-shadow: 0 0 5px rgba(78, 115, 223, 0.2);
  color: #2a2d6a;
}

.subtitle {
  color: #a0a3b5;
  font-size: 1.1rem;
}

/* Search Box */
.search-box {
  background: #171a4a;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

/* Borda Animada do Input */
.input-group::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(
    45deg,
    #0a0a0c,
    var(--color-primary),
    var(--color-secondary),
    #0a0a0c
  );
  background-size: 400% 400%;
  border-radius: 14px;
  z-index: 1;
  animation: borderAnimation 8s ease infinite;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.input-group:focus-within::before,
.input-group:has(.loading-indicator)::before {
  opacity: 1;
}

@keyframes borderAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.topic-input {
  flex: 1;
  background: #0a0a0c;
  border: 2px solid transparent;
  padding: 16px 20px;
  border-radius: 10px;
  color: white;
  font-size: 1.1rem;
  transition: border-color 0.2s, box-shadow 0.3s;
  width: 100%;
  position: relative;
  z-index: 2;
}

.topic-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.3);
  animation: subtlePulse 1.5s infinite alternate;
}

@keyframes subtlePulse {
  0% {
    box-shadow: 0 0 0 3px rgba(78, 115, 223, 0.3),
      0 0 8px rgba(78, 115, 223, 0.5);
  }
  100% {
    box-shadow: 0 0 0 6px rgba(78, 115, 223, 0.1),
      0 0 15px rgba(78, 115, 223, 0.6);
  }
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  color: var(--color-secondary);
  font-weight: 600;
  border-radius: 10px;
  background: #0a0a0c;
  min-width: 150px;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.quiz-header h2 {
  font-size: 1.2rem;
  color: #a0a3b5;
}

.quiz-header h2 span {
  color: white;
  font-weight: 700;
}

.badge {
  background: var(--color-border);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: var(--color-secondary);
  border: 1px solid rgba(78, 115, 223, 0.3);
}

/* CORREÇÃO DO LAYOUT DE GRID */
.cards-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(480px, 1fr));
  gap: 30px 20px;
  padding: 0;
  margin: 0;
}

.load-more-container {
  margin-top: 40px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.load-more-btn {
  background: linear-gradient(
    135deg,
    var(--color-primary) 0%,
    var(--color-secondary) 100%
  );
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 5px 15px rgba(78, 115, 223, 0.4);
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(78, 115, 223, 0.6);
  filter: brightness(1.1);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: wait;
  box-shadow: none;
}

.loading-state {
  text-align: center;
  padding: 60px;
  color: #a0a3b5;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsividade QuestionView */
@media (max-width: 1050px) {
  .cards-list {
    grid-template-columns: 1fr;
    gap: 30px 0;
  }
}
@media (max-width: 600px) {
  .input-group {
    flex-direction: column;
    gap: 10px;
  }
  .loading-indicator {
    width: 100%;
    padding: 12px 0;
  }
  .header h1 {
    font-size: 2rem;
  }
}

/* --- SuggestionsCarousel.vue --- */

.carousel-container {
  margin-top: 30px;
  margin-bottom: 30px;
}
.carousel-container h3 {
  font-size: 1.1rem;
  color: #7096ff;
  margin-bottom: 15px;
}
.carousel-wrapper {
  display: flex;
  align-items: center;
}
.carousel-content {
  display: flex;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 10px;
  padding: 5px 0;
  flex-grow: 1;
}
.carousel-content::-webkit-scrollbar {
  display: none;
}
.topic-card {
  flex-shrink: 0;
  background: #171a4a;
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  border: 1px solid #2a2d6a;
  transition: background 0.2s, transform 0.2s;
  scroll-snap-align: start;
}
.topic-card:hover {
  background: #2a2d6a;
  transform: translateY(-1px);
}
.nav-btn {
  background: none;
  border: none;
  color: #7096ff;
  font-size: 2rem;
  cursor: pointer;
  padding: 0 10px;
  flex-shrink: 0;
}

/* --- FilterBar.vue --- */

.filter-bar {
  margin-top: 20px;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: #0a0a0c;
  border: 1px solid #2a2d6a;
  border-radius: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.filter-bar label {
  color: #a0a3b5;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}
.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-grow: 1;
  justify-content: flex-end;
}
.filter-options button {
  background: #171a4a;
  color: #a0a3b5;
  border: 1px solid #2a2d6a;
  padding: 10px 18px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-options button:hover:not(.active) {
  background: #2a2d6a;
  color: white;
}
.filter-options button.active {
  background: linear-gradient(135deg, #4e73df 0%, #7096ff 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(78, 115, 223, 0.3);
}

@media (max-width: 600px) {
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .filter-options {
    width: 100%;
    justify-content: center;
  }
}

/* --- QuestionCard.vue --- */

.question-card {
  background: var(--color-card-dark);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.type-tag,
.source-tag {
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
}
.type-tag.ia {
  background: rgba(78, 115, 223, 0.2);
  color: var(--color-primary);
}
.type-tag.concurso {
  background: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
}
.source-tag {
  color: #a0a3b5;
  font-style: italic;
  font-weight: 400;
}

.question-text {
  font-size: 1.15rem;
  font-weight: 500;
  color: white;
  margin-bottom: 25px;
  line-height: 1.6;
}
.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.option-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}
.option-item:hover:not(.answered) {
  background-color: #171a4a;
  border-color: rgba(78, 115, 223, 0.3);
}

.option-circle {
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #a0a3b5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  color: white;
  transition: all 0.2s;
  line-height: 1;
}
.option-circle .radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: transparent;
  transition: all 0.2s;
}

.option-text {
  color: #e0e0e0;
  line-height: 1.5;
  flex-grow: 1;
}

.option-item.correct {
  background-color: #1f3b30;
  border-color: var(--color-success);
}
.option-item.correct .option-circle {
  border-color: var(--color-success);
  background-color: var(--color-success);
}
.option-item.incorrect {
  background-color: #3b2828;
  border-color: var(--color-error);
}
.option-item.incorrect .option-circle {
  border-color: var(--color-error);
  background-color: var(--color-error);
}
.option-item.answered {
  cursor: default;
}
.option-item.answered:not(.correct):not(.incorrect) {
  opacity: 0.6;
}

.footer-feedback {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px dashed var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}
.feedback-message {
  font-size: 1.1rem;
}
.feedback-message.correct {
  color: var(--color-success);
}
.feedback-message.incorrect {
  color: var(--color-error);
}
.debate-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}
.debate-btn:hover {
  background: #3b63d6;
}
.debate-btn .icon {
  margin-left: 5px;
  font-size: 1.1rem;
}

/* --- AIDebateModal.vue --- */

@keyframes fadeInModal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideInModal {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeInModal 0.3s ease-out;
}
.modal-content {
  background: #0a0a0c;
  padding: 30px;
  border-radius: 16px;
  width: 95%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #2a2d6a;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
  animation: slideInModal 0.3s ease-out;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #a0a3b5;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: white;
}

.modal-content h2 {
  color: #7096ff;
  font-size: 1.6rem;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 700;
}
.question-text {
  color: #e0e0e0;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #2a2d6a;
  text-align: center;
  font-size: 1.1rem;
}

.debate-area {
  display: flex;
  gap: 30px;
}
.explanation {
  flex: 1;
}
.explanation h3 {
  color: #10b981;
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
}
.explanation p {
  color: #a0a3b5;
  line-height: 1.7;
  font-size: 0.95rem;
}

.chat-interface {
  flex: 1;
  border-left: 1px solid #2a2d6a;
  padding-left: 30px;
}
.chat-interface h4 {
  color: #4e73df;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 600;
}
.chat-log {
  height: 280px;
  overflow-y: auto;
  background: #111116;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid #2a2d6a;
}
.message {
  margin-bottom: 10px;
  font-size: 0.95rem;
  line-height: 1.5;
  display: flex;
}
.message strong {
  font-weight: 700;
  margin-right: 5px;
  white-space: nowrap;
}
.message.user {
  justify-content: flex-end;
  color: #fff;
}
.message.ai {
  justify-content: flex-start;
  color: #a0a3b5;
}
.message.user strong {
  color: #7096ff;
}
.message.ai strong {
  color: #10b981;
}

.chat-input-group {
  display: flex;
  gap: 10px;
}
.chat-input-group input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #2a2d6a;
  background: #0a0a0c;
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.chat-input-group input:focus {
  outline: none;
  border-color: #4e73df;
}
.chat-input-group button {
  background: #4e73df;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s, box-shadow 0.2s;
}
.chat-input-group button:hover:not(:disabled) {
  background: #3b63d6;
}
.chat-input-group button:disabled {
  background: #2a2d6a;
  cursor: wait;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .debate-area {
    flex-direction: column;
    gap: 20px;
  }
  .chat-interface {
    border-left: none;
    padding-left: 0;
    border-top: 1px solid #2a2d6a;
    padding-top: 20px;
  }
  .modal-content {
    padding: 20px 15px;
  }
  .chat-input-group {
    flex-direction: column;
  }
  .chat-input-group button {
    width: 100%;
  }
}
</style>
