<template>
  <aside
    class="sidebar"
    :class="{ collapsed: isCollapsed, 'mobile-open': isMobileOpen }"
  >
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="$emit('new-session')">
        <span>+</span> <span v-if="!isCollapsed">Novo Estudo</span>
      </button>
      <button class="toggle-btn desktop-only" @click="toggleSidebar">
        {{ isCollapsed ? "»" : "«" }}
      </button>
      <button class="close-btn mobile-only" @click="$emit('close-mobile')">
        ✕
      </button>
    </div>

    <div class="topics-list">
      <div v-if="loading" class="loading-topics">Carregando...</div>

      <div
        v-else
        v-for="topic in topics"
        :key="topic.id"
        class="topic-item"
        :class="{ active: currentTopicId === topic.id }"
        @click="selectTopic(topic)"
      >
        <span class="icon">📚</span>
        <span class="title" v-if="!isCollapsed">{{ topic.title }}</span>
        <span class="score" v-if="!isCollapsed && topic.score"
          >{{ topic.score }}%</span
        >
      </div>
    </div>
  </aside>

  <div
    v-if="isMobileOpen"
    class="sidebar-overlay"
    @click="$emit('close-mobile')"
  ></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase";
import { getUserTopics } from "@/services/firestoreService";

const props = defineProps({
  currentTopicId: String,
  isMobileOpen: Boolean, // Recebe o estado do pai
});

const emit = defineEmits(["select-topic", "new-session", "close-mobile"]);

const topics = ref([]);
const loading = ref(true);
const isCollapsed = ref(false);

onMounted(async () => {
  if (auth.currentUser) {
    try {
      topics.value = await getUserTopics(auth.currentUser.uid);
    } catch (e) {
      console.error(e);
    }
  }
  loading.value = false;
});

function selectTopic(topic) {
  emit("select-topic", topic);
  emit("close-mobile"); // Fecha o menu ao selecionar
}

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}
</script>

<style scoped>
/* --- ESTILO DESKTOP (Padrão) --- */
.sidebar {
  width: 260px;
  background-color: #0a0a0c;
  border-right: 1px solid #2a2d6a;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  height: 100%;
  position: relative;
  z-index: 20;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 15px;
  display: flex;
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.new-chat-btn {
  flex: 1;
  background: #171a4a;
  border: 1px solid #2a2d6a;
  color: #7096ff;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
}
.new-chat-btn:hover {
  background: #2a2d6a;
  color: white;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: #a0a3b5;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.topics-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.topic-item {
  padding: 12px;
  border-radius: 8px;
  color: #a0a3b5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
  transition: background 0.2s;
  white-space: nowrap;
  overflow: hidden;
}

.topic-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: white;
}
.topic-item.active {
  background-color: rgba(78, 115, 223, 0.15);
  color: #7096ff;
  border-left: 3px solid #7096ff;
}

.title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
}
.score {
  font-size: 0.75rem;
  background: #171a4a;
  padding: 2px 6px;
  border-radius: 4px;
}

.mobile-only {
  display: none;
}

/* --- ESTILO MOBILE (Telas menores que 768px) --- */
@media (max-width: 768px) {
  .sidebar {
    position: fixed; /* Fixa na tela */
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    width: 280px; /* Largura da gaveta */
    background-color: #0f0f13; /* Um pouco mais claro para destacar */
    box-shadow: 5px 0 15px rgba(0, 0, 0, 0.5);
    transform: translateX(
      -100%
    ); /* Esconde por padrão jogando para a esquerda */
    z-index: 1000; /* Acima de tudo */
  }

  /* Quando a classe mobile-open é adicionada, ela desliza para dentro */
  .sidebar.mobile-open {
    transform: translateX(0);
  }

  /* Ajustes de botões no mobile */
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: block;
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(3px);
    z-index: 999; /* Logo abaixo da sidebar */
    animation: fadeIn 0.3s;
  }
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
