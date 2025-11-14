<template>
    <nav class="navbar">
        <div class="nav-left">
            <router-link to="/home" class="logo">StudyFlow</router-link>

            <router-link to="/home" class="nav-link" :class="{ active: isActive('/home') }">
                Home
            </router-link>

            <router-link to="/questions" class="nav-link" :class="{ active: isActive('/questions') }">
                Questões
            </router-link>

            <router-link to="/history" class="nav-link" :class="{ active: isActive('/history') }">
                Histórico
            </router-link>

            <router-link to="/profile" class="nav-link" :class="{ active: isActive('/profile') }">
                Perfil
            </router-link>
        </div>

        <div class="nav-right" v-if="user">
            <span class="user-email">{{ user.email }}</span>
            <button class="logout-btn" @click="logoutUser">Sair</button>
        </div>
    </nav>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const router = useRouter();
const route = useRoute();

const user = ref(null);

// Detectar usuário logado
onAuthStateChanged(auth, (u) => {
    user.value = u;
});

// Determinar rota ativa
function isActive(path) {
    return route.path.startsWith(path);
}

// Logout
function logoutUser() {
    signOut(auth);
    router.push("/login");
}
</script>

<style scoped>
.navbar {
    background: #1e293b;
    color: white;
    padding: 12px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-left {
    display: flex;
    gap: 20px;
    align-items: center;
}

.logo {
    font-weight: bold;
    font-size: 20px;
    color: #fff;
    text-decoration: none;
    margin-right: 20px;
}

.nav-link {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 16px;
}

.nav-link:hover {
    color: white;
}

.active {
    color: #38bdf8;
    font-weight: bold;
    border-bottom: 2px solid #38bdf8;
    padding-bottom: 2px;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-email {
    font-size: 14px;
    opacity: 0.9;
}

.logout-btn {
    background: #dc2626;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}

.logout-btn:hover {
    background: #b91c1c;
}
</style>
