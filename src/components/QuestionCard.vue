<template>
  <div class="card">
    <p class="question">
      {{ index + 1 }}. {{ question.question }}
    </p>

    <div class="options">
      <label
        class="option"
        v-for="opt in question.options"
        :key="opt"
      >
        <input
          type="radio"
          :name="'q'+index"
          :value="opt"
          :checked="modelValue === opt"
          @change="$emit('update:modelValue', opt)"
        />
        {{ opt }}
      </label>
    </div>

    <p v-if="modelValue" class="feedback">
      <strong>
        {{
          modelValue === question.answer
            ? "✔ Correto!"
            : "❌ Errado! Resposta certa: " + question.answer
        }}
      </strong>
    </p>
  </div>
</template>

<script setup>
defineProps({
  question: Object,
  index: Number,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.card {
  background: white;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--border-soft);
  margin-bottom: 12px;
}

.question {
  font-weight: 600;
  margin-bottom: 10px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option {
  display: flex;
  gap: 8px;
}

.feedback {
  margin-top: 8px;
}
</style>
