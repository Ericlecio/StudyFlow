<template>
  <div class="page-dark">
    <div class="container">
      <header class="header">
        <h1>Banco de Questões</h1>
        <p class="subtitle">Estude com IA focada em concursos e exames</p>
      </header>

      <!-- Formulário de Busca -->
      <div class="search-box">
        <div class="input-group">
          <input
            v-model="topic"
            class="topic-input"
            placeholder="Digite o assunto (ex: Direito Administrativo, Python, Enem...)"
            @keyup.enter="handleGenerate"
            :disabled="loading"
          />
          <button
            @click="handleGenerate"
            :disabled="loading"
            class="search-btn"
          >
            <span v-if="!loading">Buscar</span>
            <span v-else>Buscando...</span>
          </button>
        </div>
      </div>

      <!-- Loading Inicial -->
      <div v-if="loading && questions.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>Pesquisando e gerando questões...</p>
      </div>

      <!-- Lista de Questões -->
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
            :key="index"
            :question="q"
            :index="index"
            v-model="answers[index]"
          />
        </div>

        <!-- Botão Carregar Mais -->
        <div class="load-more-container">
          <p v-if="hasErrors" class="adaptive-hint">
            💡 A IA detectou alguns erros. As próximas questões focarão nas suas
            dificuldades.
          </p>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { generateQuestions } from "@/services/questionService";
import QuestionCard from "@/components/QuestionCard.vue";

const topic = ref("");
const currentTopic = ref("");
const loading = ref(false);
const loadingMore = ref(false);
const questions = ref([]);
const answers = ref([]);

// Quantidade fixa de questões por vez
const BATCH_SIZE = 5;

// Computado para verificar se há erros visíveis para dar feedback visual
const hasErrors = computed(() => {
  return questions.value.some((q, index) => {
    const ans = answers.value[index];
    return ans && ans !== q.answer;
  });
});

async function handleGenerate() {
  if (!topic.value.trim()) return;

  loading.value = true;
  // Reseta a lista para uma nova busca
  questions.value = [];
  answers.value = [];
  currentTopic.value = topic.value;

  try {
    // Gera o primeiro lote (padrão)
    const result = await generateQuestions(topic.value, BATCH_SIZE);
    questions.value = result;
    answers.value = Array(result.length).fill(null);
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
    // 1. Identificar erros cometidos até agora
    const recentErrors = questions.value.filter((q, index) => {
      const ans = answers.value[index];
      // Considera erro apenas se já respondeu e a resposta for diferente do gabarito
      return ans && ans !== q.answer;
    });

    let searchTopic = currentTopic.value;

    // 2. Se houver erros, refinar o prompt para a IA
    if (recentErrors.length > 0) {
      // Pega o texto das últimas 3 questões erradas para dar contexto
      const errorContext = recentErrors
        .slice(-3)
        .map((q) => q.question)
        .join(". ");

      // Adiciona instrução de reforço ao tema
      searchTopic += `. O aluno errou anteriormente questões sobre: "${errorContext}". Gere novas questões focadas em reforçar os conceitos corretos para essas dúvidas, mas mantendo o tema principal.`;
    }

    // 3. Gerar novo lote (adaptativo)
    const result = await generateQuestions(searchTopic, BATCH_SIZE);

    // Adiciona à lista existente
    questions.value.push(...result);

    // Adiciona slots de resposta vazios
    const newAnswers = Array(result.length).fill(null);
    answers.value.push(...newAnswers);
  } catch (err) {
    console.error("Erro:", err);
    alert("Não foi possível carregar mais questões.");
  } finally {
    loadingMore.value = false;
  }
}
</script>

<style scoped>
.page-dark {
  background-color: #050507;
  min-height: 100vh;
  color: white;
  padding: 40px 20px;
  font-family: "Inter", sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4e73df 0%, #7096ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
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
  border: 1px solid #2a2d6a;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
}

.input-group {
  display: flex;
  gap: 12px;
}

.topic-input {
  flex: 1;
  background: #0a0a0c;
  border: 1px solid #2a2d6a;
  padding: 16px 20px;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  transition: border-color 0.2s;
}

.topic-input:focus {
  outline: none;
  border-color: #4e73df;
}

.search-btn {
  background: #4e73df;
  color: white;
  border: none;
  padding: 0 30px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.search-btn:hover:not(:disabled) {
  background: #3b63d6;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(78, 115, 223, 0.3);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Quiz Area */
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
  background: #2a2d6a;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #7096ff;
  border: 1px solid rgba(78, 115, 223, 0.3);
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Load More Section */
.load-more-container {
  margin-top: 40px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.adaptive-hint {
  color: #f59e0b;
  font-size: 0.9rem;
  margin-bottom: 12px;
  animation: fadeIn 0.5s;
}

.load-more-btn {
  background: transparent;
  color: #7096ff;
  border: 2px solid #2a2d6a;
  padding: 14px 28px;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  background: #2a2d6a;
  color: white;
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: wait;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 60px;
  color: #a0a3b5;
}
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #2a2d6a;
  border-top-color: #4e73df;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsividade */
@media (max-width: 600px) {
  .input-group {
    flex-direction: column;
  }
  .search-btn {
    width: 100%;
    padding: 16px;
  }
  .header h1 {
    font-size: 2rem;
  }
}
</style>
