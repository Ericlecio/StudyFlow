<template>
  <div class="page">
    <h1>Relatório de Desempenho</h1>

    <div v-if="loading">Carregando...</div>

    <div v-else>
      <div class="grid">
        <div class="card">
          <h2>Média Geral</h2>
          <p class="big">{{ media }}%</p>
        </div>

        <div class="card">
          <h2>Temas com mais erros</h2>
          <ul class="topics">
            <li v-for="t in temasErro" :key="t.tema">
              {{ t.tema }} — {{ t.erros }} erros
            </li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h2>Histórico Detalhado</h2>
        <table class="table" v-if="results.length">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tema</th>
              <th>Acertos</th>
              <th>Erros</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in results" :key="r.id">
              <td>{{ format(r.data) }}</td>
              <td>{{ r.tema }}</td>
              <td>{{ r.acertos }}</td>
              <td>{{ r.erros }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Nenhum dado para exibir.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserResults } from "@/services/firestoreService";
import { calcularMediaAcertos } from "@/utils/stats";

const loading = ref(true);
const results = ref([]);
const media = ref(0);
const temasErro = ref([]);

onAuthStateChanged(auth, async (u) => {
  if (!u) return;

  const dados = await getUserResults(u.uid);
  results.value = dados;

  media.value = calcularMediaAcertos(dados);

  const map = {};
  dados.forEach((r) => {
    map[r.tema] = (map[r.tema] || 0) + Number(r.erros);
  });

  temasErro.value = Object.entries(map)
    .map(([tema, erros]) => ({ tema, erros }))
    .sort((a, b) => b.erros - a.erros);

  loading.value = false;
});

function format(iso) {
  return new Date(iso).toLocaleString("pt-BR");
}
</script>

<style scoped>
.page {
  padding: 24px;
}

.grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.card {
  background: white;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  flex: 1;
  min-width: 260px;
}

.big {
  font-size: 38px;
  font-weight: 700;
  color: var(--primary-dark);
}

.table {
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
}

.table th {
  background: var(--primary-light);
  color: white;
  padding: 10px;
}

.table td {
  padding: 10px;
  border-bottom: 1px solid var(--border-soft);
}
</style>
