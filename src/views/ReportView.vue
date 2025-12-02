<template>
  <div class="page-dark">
    <div class="container" ref="pdfSection">
      <header class="header">
        <h1>Relatório Geral</h1>
        <p class="subtitle">
          Análise baseada em {{ stats.totalTopics }} tópicos de estudo
        </p>
        
        <button 
          data-html2canvas-ignore="true"
          v-if="stats.totalTopics > 0" 
          @click="downloadPDF" 
          class="btn-download"
          :disabled="isGenerating"
        >
          <span v-if="isGenerating">Gerando PDF...</span>
          <span v-else>📄 Baixar PDF</span>
        </button>
      </header>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div v-else-if="stats.totalTopics === 0" class="empty-state">
        <p>Sem dados suficientes para gerar relatório.</p>
      </div>

      <div v-else>
        <div class="dashboard-grid">
          <div class="stat-card highlight">
            <h3>Taxa de Acerto Global</h3>
            <div class="big-number" :class="getScoreClass(stats.averageScore)">
              {{ stats.averageScore }}%
            </div>
            <p class="stat-detail">
              {{ stats.totalCorrect }} acertos em
              {{ stats.totalQuestions }} questões
            </p>
          </div>

          <div class="stat-card">
            <h3>Tópico Dominante</h3>
            <div class="icon-stat">🔥</div>
            <p class="topic-name">{{ stats.bestTopic || "N/A" }}</p>
          </div>

          <div class="stat-card">
            <h3>Ponto de Atenção</h3>
            <div class="icon-stat">⚠️</div>
            <p class="topic-name">{{ stats.worstTopic || "N/A" }}</p>
          </div>
        </div>

        <div class="chart-container">
          <div class="chart-header">
            <h3>Desempenho Detalhado</h3>
            <div class="chart-legend">
              <div class="legend-item"><span class="dot green"></span> Ótimo (≥80%)</div>
              <div class="legend-item"><span class="dot purple"></span> Médio</div>
              <div class="legend-item"><span class="dot red"></span> Atenção (<50%)</div>
            </div>
          </div>
          <div class="chart-wrapper">
            <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { getUserTopics } from "@/services/firestoreService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

  
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const loading = ref(true);
const isGenerating = ref(false);
const pdfSection = ref(null);

const stats = ref({
  totalTopics: 0, totalQuestions: 0, totalCorrect: 0, averageScore: 0, bestTopic: "", worstTopic: ""
});

const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, 
    tooltip: {
      backgroundColor: 'rgba(20, 20, 30, 0.95)',
      titleColor: '#fff',
      bodyColor: '#a0a3b5',
      borderColor: 'rgba(78, 115, 223, 0.3)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
      displayColors: false, 
      callbacks: {
        label: (context) => ` Nota: ${context.raw}%`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(255, 255, 255, 0.05)', 
        borderDash: [5, 5], 
        drawBorder: false 
      },
      ticks: {
        color: '#6c757d',
        font: { family: "'Inter', sans-serif", size: 11 },
        padding: 10,
        callback: (value) => `${value}%` 
      }
    },
    x: {
      grid: { display: false }, 
      ticks: {
        color: '#a0a3b5',
        font: { family: "'Inter', sans-serif", size: 12 },
        padding: 10
      }
    }
  },
  animation: {
    duration: 1500,
    easing: 'easeOutQuart' 
  }
});

onMounted(async () => {
  setTimeout(async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const topics = await getUserTopics(user.uid);
        processStats(topics);
      } catch (e) {
        console.error("Erro:", e);
      }
    }
    loading.value = false;
  }, 500);
});

function processStats(topics) {
  if (!topics || topics.length === 0) return;

  const totalTopics = topics.length;
  const totalQuestions = topics.reduce((acc, t) => acc + (t.totalQuestions || 0), 0);
  const totalCorrect = topics.reduce((acc, t) => acc + (t.totalCorrect || 0), 0);
  const averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const sorted = [...topics].sort((a, b) => b.score - a.score);
  const bestTopic = sorted[0]?.title || "";
  let worstTopic = sorted[sorted.length - 1]?.title || "";
  if (bestTopic === worstTopic || sorted[sorted.length - 1]?.score >= 80) worstTopic = "-";

  stats.value = { totalTopics, totalQuestions, totalCorrect, averageScore, bestTopic, worstTopic };

  const labels = topics.map(t => t.title);
  const dataScores = topics.map(t => t.score);
  
  const colors = dataScores.map(score => {
    if (score >= 80) return { border: '#10b981', bg: 'rgba(16, 185, 129, 0.2)' }; 
    if (score < 50) return { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)' };
    return { border: '#4e73df', bg: 'rgba(78, 115, 223, 0.2)' };                
  });

  chartData.value = {
    labels: labels,
    datasets: [{
      label: 'Desempenho',
      data: dataScores,
      backgroundColor: colors.map(c => c.bg),
      borderColor: colors.map(c => c.border),
      borderWidth: 2,
      borderRadius: 8, 
      borderSkipped: false,
      barPercentage: 0.6,
    }]
  };
}

function getScoreClass(score) {
  if (score >= 80) return "text-green";
  if (score >= 60) return "text-yellow";
  return "text-red";
}

async function downloadPDF() {
  if (!pdfSection.value) return;
  isGenerating.value = true;
  try {
    const canvas = await html2canvas(pdfSection.value, {
      scale: 2,
      backgroundColor: "#050507",
      useCORS: true
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    pdf.setFillColor(5, 5, 7); 
    pdf.rect(0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight(), "F");
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("StudyFlow-Relatorio.pdf");
  } catch (error) {
    console.error("Erro PDF:", error);
    alert("Erro ao gerar PDF.");
  } finally {
    isGenerating.value = false;
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
  max-width: 900px;
  margin: 0 auto;
  padding: 20px; 
}
.header { text-align: center; margin-bottom: 40px; }
.subtitle { color: #a0a3b5; margin-bottom: 20px; }

.btn-download {
  background-color: #4e73df;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-download:hover { background-color: #375abf; }
.btn-download:disabled { background-color: #2a2d6a; cursor: not-allowed; opacity: 0.7; }

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-container {
  background: #111116;
  padding: 25px;
  border-radius: 20px; 
  border: 1px solid #2a2d6a;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); 
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(42, 45, 106, 0.5);
  flex-wrap: wrap; gap: 10px;
}
.chart-header h3 { font-size: 1.1rem; color: #fff; margin: 0; font-weight: 600; }

.chart-legend { display: flex; gap: 15px; font-size: 0.85rem; color: #a0a3b5; flex-wrap: wrap;}
.legend-item { display: flex; align-items: center; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.dot.green { background-color: #10b981; box-shadow: 0 0 6px #10b981; }
.dot.purple { background-color: #4e73df; box-shadow: 0 0 6px #4e73df; }
.dot.red { background-color: #ef4444; box-shadow: 0 0 6px #ef4444; }

.chart-wrapper {
  height: 350px; 
  position: relative;
}


.stat-card {
  background: #111116; padding: 30px; border-radius: 16px; border: 1px solid #2a2d6a; text-align: center;
}
.stat-card.highlight {
  grid-column: 1 / -1; background: linear-gradient(135deg, #111116 0%, #1a1a2e 100%); border-color: #4e73df;
}
.big-number { font-size: 3.5rem; font-weight: 800; margin: 10px 0; }
.text-green { color: #10b981; text-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
.text-yellow { color: #f59e0b; }
.text-red { color: #ef4444; text-shadow: 0 0 20px rgba(239, 68, 68, 0.2); } 
.topic-name { font-size: 1.2rem; font-weight: 600; margin: 10px 0; color: #fff; }
.icon-stat { font-size: 2rem; margin-bottom: 10px; }
.loading-state, .empty-state { text-align: center; padding: 50px; color: #a0a3b5; }
.spinner { width: 40px; height: 40px; border: 3px solid #2a2d6a; border-top-color: #4e73df; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>