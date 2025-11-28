<template>
  <div
    class="question-card"
    :class="{ answered: isAnswered, 'ia-type': question.type === 'IA' }"
  >
    <div class="card-header">
      <span :class="['type-tag', question.type.toLowerCase()]">
        {{ question.type === "IA" ? "Gerada por IA" : "Concurso" }}
      </span>
      <span class="source-tag">{{ question.source }}</span>
    </div>

    <p class="question-text">{{ index + 1 }}. {{ question.question }}</p>

    <div class="options-list">
      <div
        v-for="(text, key) in question.options"
        :key="key"
        class="option-item"
        :class="optionClasses(key)"
        @click="selectOption(key)"
      >
        <div class="option-circle">
          <span
            v-if="getFeedbackIcon(key)"
            v-html="getFeedbackIcon(key)"
          ></span>
          <span v-else class="radio-inner"></span>
        </div>

        <span class="option-text">{{ key }}) {{ text }}</span>
      </div>
    </div>

    <div v-if="isAnswered" class="footer-feedback">
      <p :class="['feedback-message', isCorrect ? 'correct' : 'incorrect']">
        <strong v-if="isCorrect">✔ Correto!</strong>
        <strong v-else>❌ Errado! Resposta certa: {{ question.answer }}</strong>
      </p>
      <button class="debate-btn" @click="$emit('debate')">
        Detalhes e Debate <span class="icon">💬</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  question: Object,
  index: Number,
  modelValue: String,
});

const emit = defineEmits(["update:modelValue", "debate"]);

const isAnswered = computed(() => {
  return props.modelValue !== null;
});

const isCorrect = computed(() => {
  return isAnswered.value && props.modelValue === props.question.answer;
});

function selectOption(key) {
  if (isAnswered.value) {
    return;
  }
  emit("update:modelValue", key);
}

function optionClasses(key) {
  const classes = {
    answered: isAnswered.value,
    selected: key === props.modelValue && !isAnswered.value,
  };

  if (isAnswered.value) {
    if (key === props.question.answer) {
      classes.correct = true;
    } else if (key === props.modelValue && !isCorrect.value) {
      classes.incorrect = true;
    }
  }
  return classes;
}

function getFeedbackIcon(key) {
  if (!isAnswered.value) {
    return key === props.modelValue ? "●" : "";
  }

  if (key === props.question.answer) {
    return "✓";
  }

  if (key === props.modelValue && !isCorrect.value) {
    return "✕";
  }

  return null;
}
</script>

<style scoped>
:root {
  --color-primary: #4e73df;
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-border: #2a2d6a;
  --color-bg-card: #111116;
}

.question-card {
  background: var(--color-bg-card);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
  height: 100%;
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
</style>
