<template>
    <div class="page">

        <h1>Gerar Questões</h1>

        <div class="form">
            <input v-model="topic" placeholder="Digite um tema (ex: Fotossíntese)" />
            <button @click="handleGenerate" :disabled="loading">
                {{ loading ? "Gerando..." : "Gerar Questões" }}
            </button>
        </div>

        <div v-if="questions.length > 0" class="questions-container">
            <h2>Questões</h2>

            <div v-for="(q, index) in questions" :key="index" class="question-card">
                <p class="question">{{ index + 1 }}. {{ q.question }}</p>

                <div class="options">
                    <label v-for="option in q.options" :key="option" class="option">
                        <input type="radio" :name="'q' + index" :value="option" v-model="answers[index]" />
                        {{ option }}
                    </label>
                </div>

                <p v-if="answers[index]" class="feedback">
                    <strong>
                        {{
                            answers[index] === q.answer
                                ? "✔ Correto!"
                                : "❌ Errado! Resposta certa: " + q.answer
                        }}
                    </strong>
                </p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from "vue";
import { generateQuestions } from "@/services/questionService";

const topic = ref("");
const loading = ref(false);
const questions = ref([]);
const answers = ref([]);

async function handleGenerate() {
    if (!topic.value.trim()) return;

    loading.value = true;
    questions.value = [];
    answers.value = [];

    try {
        const result = await generateQuestions(topic.value);
        questions.value = result;
        answers.value = Array(result.length).fill(null);
    } catch (err) {
        console.error("Erro:", err);
        alert("Erro ao gerar questões");
    }

    loading.value = false;
}
</script>

<style>
.page {
    padding: 20px;
}

.form {
    margin-bottom: 20px;
}

.question-card {
    padding: 15px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 8px;
}

.feedback {
    margin-top: 8px;
}
</style>
