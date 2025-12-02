import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

// IMPORT DA NOVA VIEW
import LandingPageView from "@/views/LandingPageView.vue"; // Adicione esta linha
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/HomeView.vue";
import QuestionsView from "@/views/QuestionsView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ReportView from "@/views/ReportView.vue";
import ProfileView from "@/views/ProfileView.vue";
import AboutView from "@/views/AboutView.vue"; 

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

const routes = [
  // 1. NOVA ROTA PÚBLICA (Landing Page)
  { 
    path: "/", 
    name: "landing", 
    component: LandingPageView, 
    meta: { requiresAuth: false, isPublicRoot: true } // Novo meta para identificar a raiz pública
  },

  // 2. ROTAS DE AUTENTICAÇÃO (Públicas)
  { path: "/login", name: "login", component: LoginView, meta: { requiresAuth: false } },
  { path: "/register", name: "register", component: RegisterView, meta: { requiresAuth: false } },

  // 3. ROTAS PROTEGIDAS (requiresAuth: true)
  { path: "/home", name: "home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/questions", name: "questions", component: QuestionsView, meta: { requiresAuth: true } },
  { path: "/history", name: "history", component: HistoryView, meta: { requiresAuth: true } },
  { path: "/report", name: "report", component: ReportView, meta: { requiresAuth: true } },
  { path: "/profile", name: "profile", component: ProfileView, meta: { requiresAuth: true } },
  { path: "/about", name: "about", component: AboutView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  // Simplificamos a verificação de autenticação usando a meta tag 'requiresAuth'
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // Verifica se a rota atual é a raiz pública (Landing Page)
  // Adicionei esta meta tag ao path: '/' para facilitar o controle
  const isPublicRoot = to.matched.some(record => record.meta.isPublicRoot); 

  const user = await getCurrentUser();

  if (requiresAuth && !user) {
    // CASO 1: Tenta acessar rota protegida e está deslogado.
    next("/login");

  } else if (!requiresAuth && user && (to.path === '/login' || to.path === '/register' || isPublicRoot)) {
    // CASO 2: Tenta acessar rota pública (landing/login/register) e está LOGADO.
    // Redireciona o usuário logado de rotas públicas para /home.
    next("/home");

  } else {
    // CASO 3: Acesso permitido.
    next();
  }
});

export default router;