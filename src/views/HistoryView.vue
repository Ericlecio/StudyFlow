<template>
  <div class="page">
    <h1>Histórico</h1>

    <!-- Estado de carregamento -->
    <p v-if="loading">Carregando...</p>

    <!-- Conteúdo após carregar -->
    <template v-else>
      <!-- Se houver resultados, mostra a tabela -->
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

      <!-- Se NÃO houver resultados -->
      <p v-else>Nenhum resultado encontrado.</p>
    </template>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserResults } from "@/services/firestoreService";

const loading = ref(true);
const results = ref([]);

onAuthStateChanged(auth, async (u) => {
  if (u) {
    results.value = await getUserResults(u.uid);
  }
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

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
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
