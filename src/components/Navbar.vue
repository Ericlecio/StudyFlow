<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/home" class="logo">StudyFlow</router-link>

      <router-link to="/home" class="nav-link" :class="{ active: isActive('/home') }">Home</router-link>
      <router-link to="/questions" class="nav-link" :class="{ active: isActive('/questions') }">Questões</router-link>
      <router-link to="/history" class="nav-link" :class="{ active: isActive('/history') }">Histórico</router-link>
      <router-link to="/report" class="nav-link" :class="{ active: isActive('/report') }">Relatório</router-link>
      <router-link to="/profile" class="nav-link" :class="{ active: isActive('/profile') }">Perfil</router-link>
    </div>

    <div class="nav-right" v-if="user">
      <span class="user-email">{{ user.email }}</span>
      <button class="logout-btn" @click="logoutUser">Sair</button>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logout as logoutService } from "@/services/authService";
import { useRoute, useRouter } from "vue-router";

const user = ref(null);
const route = useRoute();
const router = useRouter();

onAuthStateChanged(auth, (u) => (user.value = u));

function isActive(path) {
  return route.path.startsWith(path);
}

async function logoutUser() {
  await logoutService();
  router.push("/login");
}
</script>

<style scoped>
.navbar {
  background: var(--bg-navbar);
  padding: 14px 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: white;
  text-decoration: none;
  margin-right: 18px;
}

.nav-link {
  margin-right: 14px;
  text-decoration: none;
  color: #f3e8ff;
  font-weight: 500;
}

.nav-link:hover {
  color: white;
}

.active {
  color: white;
  border-bottom: 2px solid var(--primary-light);
  padding-bottom: 3px;
}

.user-email {
  margin-right: 10px;
  font-size: 14px;
  color: #f5eaff;
}

.logout-btn {
  background: var(--danger);
  padding: 6px 14px;
  color: white;
}

.logout-btn:hover {
  background: #b91c1c;
}
</style>
