import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

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
  { path: "/", redirect: "/home" },
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },

  { path: "/home", name: "home", component: HomeView },
  { path: "/questions", name: "questions", component: QuestionsView },
  { path: "/history", name: "history", component: HistoryView },
  { path: "/report", name: "report", component: ReportView },
  { path: "/profile", name: "profile", component: ProfileView },
  { path: "/about", name: "about", component: AboutView,},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(
    (record) => record.path !== "/login" && record.path !== "/register"
  );

  if (!requiresAuth) {
    return next();
  }

  const user = await getCurrentUser();

  if (user) {
    next();
  } else {
    console.log("Usuário não autenticado, redirecionando para login.");
    next("/login");
  }
});

export default router;
