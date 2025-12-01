<template>
  <footer class="footer">
    <div class="gradient-border"></div>

    <div class="container">
      <div class="footer-top">
        <div class="footer-col brand-col">
          <span class="brand"
            >Study<span class="brand-highlight">Flow</span></span
          >
        </div>

        <div class="footer-col">
          <h4 class="col-title">Explorar</h4>
          <nav class="footer-nav">
            <router-link to="/home">Início</router-link>
            <router-link to="/questions">Questões</router-link>
            <router-link to="/report">Relatórios</router-link>
          </nav>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Informações</h4>
          <nav class="footer-nav">
            <a href="#">Termos de Uso</a>
            <a href="#">Privacidade</a>
            <a href="#">Ajuda</a>
          </nav>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Desenvolvido por:</h4>
          <div class="dev-grid">
            <a
              v-for="(dev, index) in developers"
              :key="index"
              :href="dev.url"
              target="_blank"
              rel="noopener noreferrer"
              class="dev-badge"
              :title="'Ver GitHub de ' + dev.name"
            >
              <svg
                class="github-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              <span>{{ dev.firstName }}</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="copyright">
          &copy; {{ currentYear }} StudyFlow. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";

const currentYear = ref(new Date().getFullYear());

const developers = [
  {
    name: "Ericlecio Thiago",
    firstName: "Ericlecio",
    url: "https://github.com/Ericlecio",
  },
  {
    name: "Flavio Wallefy",
    firstName: "Flavio",
    url: "https://github.com/FlavioWallefy1",
  },
  {
    name: "Lucas Rafael",
    firstName: "Lucas",
    url: "https://github.com/lucasrafael2601",
  },
  {
    name: "Marcos Vinicius",
    firstName: "Marcos",
    url: "https://github.com/MoraesMarcos",
  },
  { name: 'Nielson Junior', 
    firstName: 'Nielson', 
    url: 'https://github.com/nielsonj13' },
];
</script>

<style scoped>
.footer {
  background-color: #050507;
  position: relative;
  margin-top: auto;
  width: 100%;
  font-family: "Inter", sans-serif;
  padding-top: 3rem;
  padding-bottom: 2rem;
}

.gradient-border {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #4e73df, transparent);
  opacity: 0.5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 0.8fr 1.2fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.col-title {
  color: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1.2rem;
  letter-spacing: 0.5px;
}

.brand {
  font-weight: 800;
  font-size: 1.4rem;
  color: #fff;
  display: block;
  margin-bottom: 0.8rem;
}
.brand-highlight {
  color: #4e73df;
}
.slogan {
  color: #a0a3b5;
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 280px;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-nav a {
  color: #a0a3b5;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s, padding-left 0.2s;
}

.footer-nav a:hover {
  color: #4e73df;
  padding-left: 5px;
}

.dev-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.dev-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.dev-badge:hover {
  background: rgba(78, 115, 223, 0.15);
  border-color: #4e73df;
  color: #fff;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #6b7280;
  font-size: 0.85rem;
}
.heart {
  color: #ef4444;
  animation: beat 1.5s infinite;
  display: inline-block;
}

.tech-stack {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tech-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
}

.tech-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  background: #1e1e1e;
}

.tech-tag.vue {
  color: #42b883;
  border: 1px solid rgba(66, 184, 131, 0.2);
}
.tech-tag.firebase {
  color: #ffca28;
  border: 1px solid rgba(255, 202, 40, 0.2);
}
.tech-tag.gemini {
  color: #8e24aa;
  border: 1px solid rgba(142, 36, 170, 0.2);
}

@keyframes beat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }

  .slogan {
    margin: 0 auto;
  }

  .dev-grid,
  .footer-nav {
    justify-content: center;
    align-items: center;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
