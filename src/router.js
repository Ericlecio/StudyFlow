import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase";

import LoginView from "@/views/LoginView.vue";
import HomeView from "@/views/HomeView.vue";
import QuestionsView from "@/views/QuestionsView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ProfileView from "@/views/ProfileView.vue";

// Rotas protegidas – só entra se estiver logado
const requireAuth = (to, from, next) => {
  const user = auth.currentUser;
  if (!user) next("/login");
  else next();
};

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    beforeEnter: requireAuth,
  },
  {
    path: "/questions",
    name: "questions",
    component: QuestionsView,
    beforeEnter: requireAuth,
  },
  {
    path: "/history",
    name: "history",
    component: HistoryView,
    beforeEnter: requireAuth,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    beforeEnter: requireAuth,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
