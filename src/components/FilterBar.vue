<template>
  <div class="filter-bar">
    <label>Filtrar Questões:</label>
    <div class="filter-options">
      <button
        :class="{ active: modelValue.type === 'mixed' }"
        @click="updateFilter('mixed')"
      >
        Mistas
      </button>
      <button
        :class="{ active: modelValue.type === 'ia' }"
        @click="updateFilter('ia')"
      >
        Geradas por IA
      </button>
      <button
        :class="{ active: modelValue.type === 'contest' }"
        @click="updateFilter('contest')"
      >
        Concursos Reais
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ type: "mixed" }),
  },
});

const emit = defineEmits(["update:modelValue"]);

function updateFilter(type) {
  emit("update:modelValue", { ...props.modelValue, type });
}
</script>

<style scoped>
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
</style>
