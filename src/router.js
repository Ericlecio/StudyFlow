import { createRouter, createWebHistory } from "vue-router";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

import LandingPageView from "@/views/LandingPageView.vue";
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
  { 
    path: "/", 
    name: "landing", 
    component: LandingPageView, 
    meta: { requiresAuth: false, isPublicRoot: true }
  },

  { path: "/login", name: "login", component: LoginView, meta: { requiresAuth: false } },
  { path: "/register", name: "register", component: RegisterView, meta: { requiresAuth: false } },

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

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  const isPublicRoot = to.matched.some(record => record.meta.isPublicRoot); 

  const user = await getCurrentUser();

  if (requiresAuth && !user) {
    next("/login");

  } else if (!requiresAuth && user && (to.path === '/login' || to.path === '/register' || isPublicRoot)) {
    next("/home");

  } else {
    next();
  }
});

export default router;