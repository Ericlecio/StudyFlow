<<template>
  <div id="app" class="app-layout">
    <Navbar v-if="showLayout" />

    <div class="main-content">
      <router-view />
    </div>

    <Footer v-if="showLayout" /> 
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue"; 

const route = useRoute();

// Renomeei para 'showLayout' para ficar claro que controla Navbar E Footer
const showLayout = computed(() => {
  return route.path !== "/login" && route.path !== "/register" && route.path !== "/";;
});
</script>

<style>
/* CSS Global para garantir que o Footer fique no chão */
body {
  margin: 0;
  padding: 0;
  background-color: #050507; /* Fundo geral do site */
}

.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ocupa 100% da altura da tela */
}

.main-content {
  flex: 1; /* Faz o conteúdo crescer e empurrar o footer para baixo */
  display: flex;
  flex-direction: column;
}
</style>