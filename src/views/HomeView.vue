<template>
    <div class="home-page">
        <h1>Bem-vindo ao StudyFlow 👋</h1>

        <p v-if="user">
            Logado como: <strong>{{ user.email }}</strong>
        </p>

        <button class="logout" @click="logoutUser">
            Sair
        </button>

        <div class="box">
            <h2>Estudo Rápido</h2>
            <p>Em breve: gere questões por tema usando IA 🔥</p>
        </div>
    </div>
</template>

<script setup>
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const user = ref(null);

onAuthStateChanged(auth, (u) => {
    user.value = u;
});

function logoutUser() {
    signOut(auth);
    router.push("/login");
}
</script>

<style scoped>
.home-page {
    padding: 20px;
}

.logout {
    background: #dc2626;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.logout:hover {
    background: #b91c1c;
}

.box {
    margin-top: 30px;
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
</style>
