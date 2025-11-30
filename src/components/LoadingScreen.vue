<template>
  <div class="loading-container">
    <div class="loader-content">
      <div class="brain-loader">
        <div class="neuron"></div>
        <div class="neuron"></div>
        <div class="neuron"></div>
      </div>

      <h3>Criando Material de Estudo...</h3>

      <div class="tip-box">
        <span class="tip-icon">💡</span>
        <p class="tip-text">{{ currentTip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const tips = [
  "A técnica Pomodoro (25min estudo / 5min pausa) aumenta o foco.",
  "Explicar o conteúdo para si mesmo em voz alta melhora a retenção.",
  "Dormir bem é essencial para consolidar a memória de longo prazo.",
  "Revise seus erros: é lá que o aprendizado realmente acontece.",
  "Beba água! Um cérebro hidratado processa informações mais rápido.",
];

const currentTip = ref(tips[0]);
let interval;

onMounted(() => {
  let i = 0;
  interval = setInterval(() => {
    i = (i + 1) % tips.length;
    currentTip.value = tips[i];
  }, 3000); // Troca a dica a cada 3 segundos
});

onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  text-align: center;
  animation: fadeIn 0.5s;
}

.brain-loader {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.neuron {
  width: 15px;
  height: 15px;
  background: #4e73df;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.neuron:nth-child(1) {
  animation-delay: -0.32s;
}
.neuron:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
    background: #7096ff;
    box-shadow: 0 0 10px #7096ff;
  }
}

h3 {
  color: #fff;
  margin-bottom: 20px;
  font-weight: 300;
}

.tip-box {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px 25px;
  border-radius: 20px;
  border: 1px solid rgba(78, 115, 223, 0.3);
  max-width: 400px;
  margin: 0 auto;
}

.tip-text {
  color: #a0a3b5;
  font-style: italic;
  font-size: 0.95rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
