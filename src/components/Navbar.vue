<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/home" class="logo">
        Study<span class="brand-highlight">Flow</span>
      </router-link>

      <div class="nav-links">
        <router-link
          to="/home"
          class="nav-item"
          :class="{ active: isActive('/home') }"
        >
          Home
        </router-link>

        <router-link
          to="/questions"
          class="nav-item"
          :class="{ active: isActive('/questions') }"
        >
          Questões
        </router-link>

        <router-link
          to="/about"
          class="nav-item"
          :class="{ active: isActive('/about') }"
        >
          Sobre
        </router-link>

        <router-link
          to="/history"
          class="nav-item"
          :class="{ active: isActive('/history') }"
        >
          Histórico
        </router-link>

        <router-link
          to="/report"
          class="nav-item"
          :class="{ active: isActive('/report') }"
        >
          Relatório
        </router-link>
      </div>
    </div>

    <div class="nav-right" v-if="user">
      <div
        class="user-dropdown"
        @click="toggleMenu"
        v-click-outside="closeMenu"
      >
        <div class="user-info">
          <span class="user-name">{{ displayName }}</span>
          <div class="avatar">
            <img v-if="user.photoURL" :src="user.photoURL" alt="Avatar" />
            <span v-else>{{ userInitial }}</span>
          </div>
          <span class="arrow" :class="{ rotated: isMenuOpen }">▼</span>
        </div>

        <transition name="fade">
          <div class="dropdown-menu" v-if="isMenuOpen">
            <router-link to="/profile" class="dropdown-item" @click="closeMenu">
              👤 Meu Perfil
            </router-link>
            <div class="divider"></div>
            <button class="dropdown-item logout" @click="logoutUser">
              🚪 Sair
            </button>
          </div>
        </transition>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { logout as logoutService } from "@/services/authService";
import { useRoute, useRouter } from "vue-router";

const user = ref(null);
const isMenuOpen = ref(false);
const route = useRoute();
const router = useRouter();

onAuthStateChanged(auth, (u) => (user.value = u));


const displayName = computed(() => {
  if (user.value?.displayName) return user.value.displayName.split(" ")[0];
  if (user.value?.email) return user.value.email.split("@")[0];
  return "Estudante";
});


const userInitial = computed(() => {
  return displayName.value ? displayName.value.charAt(0).toUpperCase() : "U";
});

function isActive(path) {
  
  return route.path.startsWith(path);
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
  isMenuOpen.value = false;
}

async function logoutUser() {
  await logoutService();
  closeMenu();
  router.push("/");
}


const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
};
</script>

<style scoped>

.navbar {
  
  background: rgba(10, 10, 12, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  height: 70px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  font-family: "Inter", sans-serif;
}


.nav-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.brand-highlight {
  background: linear-gradient(135deg, #4e73df 0%, #7096ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


.nav-links {
  display: flex;
  gap: 24px;
}

.nav-item {
  text-decoration: none;
  color: #a0a3b5;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 8px 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: white;
}

.nav-item.active {
  color: white;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #4e73df;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(78, 115, 223, 0.6);
}


.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease;
  border: 1px solid transparent;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.user-name {
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4e73df, #2a2d6a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.arrow {
  font-size: 0.7rem;
  color: #a0a3b5;
  transition: transform 0.3s ease;
}

.arrow.rotated {
  transform: rotate(180deg);
}


.dropdown-menu {
  position: absolute;
  top: 120%;
  right: 0;
  width: 200px;
  background: #171a4a; 
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  padding: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-item {
  text-decoration: none;
  color: #e0e0e0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-item.logout {
  color: #ff6b6b;
}

.dropdown-item.logout:hover {
  background: rgba(255, 107, 107, 0.15);
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 6px 0;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}


@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  .user-name {
    display: none;
  }
}
</style>