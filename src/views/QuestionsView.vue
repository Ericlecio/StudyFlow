<template>
  <div class="page">
    <h1>Gerar Questões</h1>

    <div class="form">
      <input
        v-model="topic"
        placeholder="Digite um tema (ex: Fotossíntese)"
      />
      <button @click="handleGenerate" :disabled="loading">
        {{ loading ? "Gerando..." : "Gerar Questões" }}
      </button>
    </div>

    <div v-if="questions.length > 0" class="questions-container">
      <h2>Questões</h2>

      <QuestionCard
        v-for="(q, index) in questions"
        :key="'q-' + index"
        :question="q"
        :index="index"
        v-model="answers[index]"
      />

      <button class="finish-btn" @click="finalizarQuiz">
        Finalizar Quiz
      </button>

      <div v-if="finished" class="summary-box">
        <p>
          Você acertou
          <strong>{{ totalAcertos }}</strong>
          de
          <strong>{{ totalQuestoes }}</strong>
          questões ({{ percentualAcertos }}%).
        </p>
        <p class="relatorio-texto">
          {{ mensagemRelatorio }}
        </p>

        <div v-if="podeGerarReforco" class="reforco-box">
          <p>
            Detectamos erros nesse tema. Que tal praticar mais com questões de
            reforço focadas nele?
          </p>
          <button @click="gerarReforco" :disabled="loadingReforco">
            {{ loadingReforco ? "Gerando reforço..." : "Gerar questões de reforço" }}
          </button>
        </div>
      </div>
    </div>

    <!-- Questões de reforço -->
    <div v-if="reforcoQuestions.length > 0" class="reforco-container">
      <h2>Questões de Reforço – {{ topic }}</h2>

      <QuestionCard
        v-for="(q, index) in reforcoQuestions"
        :key="'r-' + index"
        :question="q"
        :index="index"
        v-model="reforcoAnswers[index]"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { generateQuestions } from "@/services/questionService";
import QuestionCard from "@/components/QuestionCard.vue";
import { auth } from "@/firebase";
import { saveResult } from "@/services/firestoreService";

const topic = ref("");
const loading = ref(false);
const questions = ref([]);
const answers = ref([]);
const finished = ref(false);

const mensagemRelatorio = ref("");

const podeGerarReforco = ref(false);
const loadingReforco = ref(false);
const reforcoQuestions = ref([]);
const reforcoAnswers = ref([]);

const totalAcertos = computed(() =>
  questions.value.reduce((sum, q, i) => {
    return sum + (answers.value[i] === q.answer ? 1 : 0);
  }, 0)
);

const totalQuestoes = computed(() => questions.value.length);

const percentualAcertos = computed(() => {
  if (!totalQuestoes.value) return 0;
  return Math.round((totalAcertos.value / totalQuestoes.value) * 100);
});

async function handleGenerate() {
  if (!topic.value.trim()) return;

  loading.value = true;
  questions.value = [];
  answers.value = [];
  finished.value = false;
  mensagemRelatorio.value = "";
  podeGerarReforco.value = false;
  reforcoQuestions.value = [];
  reforcoAnswers.value = [];

  try {
    const result = await generateQuestions(topic.value);
    questions.value = result;
    answers.value = Array(result.length).fill(null);
  } catch (err) {
    console.error("Erro:", err);
    alert("Erro ao gerar questões");
  } finally {
    loading.value = false;
  }
}

async function finalizarQuiz() {
  if (!questions.value.length) return;

  finished.value = true;

  const acertos = totalAcertos.value;
  const total = totalQuestoes.value;
  const perc = percentualAcertos.value;

  if (total === 0) {
    mensagemRelatorio.value = "Nenhuma questão respondida.";
  } else if (perc >= 80) {
    mensagemRelatorio.value =
      "Excelente! Seu desempenho nesse tema está muito bom. Continue revisando periodicamente.";
  } else if (perc >= 50) {
    mensagemRelatorio.value =
      "Bom desempenho, mas ainda há espaço para melhorar. Vale reforçar os pontos em que você errou.";
  } else {
    mensagemRelatorio.value =
      "Você teve bastante dificuldade nesse tema. Recomendamos focar bem nessa matéria com novas questões.";
  }

  podeGerarReforco.value = acertos < total;

  const user = auth.currentUser;
  if (!user) return;

  try {
    await saveResult({
      userId: user.uid,
      tema: topic.value,
      acertos,
      erros: total - acertos,
      data: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Erro ao salvar resultado:", e);
  }
}

async function gerarReforco() {
  if (!topic.value.trim()) return;

  loadingReforco.value = true;
  reforcoQuestions.value = [];
  reforcoAnswers.value = [];

  try {
    const reforcoTema = `${topic.value} (reforço focado em pontos que alunos costumam errar)`;
    const result = await generateQuestions(reforcoTema);
    reforcoQuestions.value = result;
    reforcoAnswers.value = Array(result.length).fill(null);
  } catch (e) {
    console.error("Erro ao gerar reforço:", e);
    alert("Erro ao gerar questões de reforço");
  } finally {
    loadingReforco.value = false;
  }
}
</script>

<style scoped>
.page {
  padding: 24px;
}

.form {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.form input {
  flex: 1;
}

.form button {
  background: var(--primary);
  color: white;
  padding: 10px 16px;
}

.form button:hover {
  background: var(--primary-dark);
}

.questions-container {
  margin-top: 20px;
}

.finish-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: var(--primary);
  color: white;
}

.finish-btn:hover {
  background: var(--primary-dark);
}

.summary-box {
  margin-top: 12px;
  padding: 10px;
  background: #ede9ff;
  border-radius: 6px;
}

.relatorio-texto {
  margin-top: 6px;
  color: var(--text-muted);
}

.reforco-box {
  margin-top: 10px;
  padding: 10px;
  background: #fdf2ff;
  border-radius: 6px;
}

.reforco-box button {
  margin-top: 8px;
  padding: 6px 12px;
  background: var(--accent);
  color: #1E1B4B;
}

.reforco-box button:hover {
  filter: brightness(0.95);
}

.reforco-container {
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
}
</style>
