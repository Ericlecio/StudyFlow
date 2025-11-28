<template>
  <div class="carousel-container">
    <h3>Sugestões Populares</h3>
    <div class="carousel-wrapper">
      <button class="nav-btn prev" @click="scroll('prev')">‹</button>
      <div class="carousel-content" ref="carousel">
        <div
          v-for="topic in popularTopics"
          :key="topic"
          class="topic-card"
          @click="$emit('selectTopic', topic)"
        >
          {{ topic }}
        </div>
      </div>
      <button class="nav-btn next" @click="scroll('next')">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const popularTopics = ref([
  "Direito Constitucional",
  "Lógica de Programação",
  "Português - Crase",
  "Redação Enem",
  "Matemática Financeira",
  "História do Brasil Colonial",
  "Direito Administrativo",
  "Raciocínio Lógico",
]);

const carousel = ref(null);

function scroll(direction) {
  if (carousel.value) {
    const scrollAmount = direction === "next" ? 250 : -250;
    carousel.value.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
}

defineEmits(["selectTopic"]);
</script>

<style scoped>
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
</style>
