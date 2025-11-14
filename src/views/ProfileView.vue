<template>
    <div class="page">
        <h1>Perfil do Usuário</h1>
        <p>Aqui você poderá editar informações e ver estatísticas do usuário.</p>
    </div>
</template>

<script setup>
import { auth } from "@/firebase";
import { ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";

const user = ref(null);

onAuthStateChanged(auth, (u) => {
    user.value = u;
});
</script>

<style scoped>
.page {
    padding: 20px;
}
</style>
