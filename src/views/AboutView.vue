<template>
  <div class="about-page">
    <div class="background-glow"></div>

    <div class="container content-wrapper">
      <header class="header-section">
        <div class="badge-pill">Revolução no Aprendizado</div>
        <h1 class="title">
          Sobre o <span class="brand-highlight">StudyFlow</span>
        </h1>
        <p class="mission-text">
          Nossa missão é democratizar o acesso à preparação de alta performance.
          Unimos a flexibilidade da tecnologia moderna com o poder da
          <strong>Inteligência Artificial</strong> para criar trilhas de
          aprendizado personalizadas, eficientes e gratuitas.
        </p>
      </header>

      <section class="origin-section">
        <div class="glass-card origin-card">
          <div class="origin-content">
            <h2>💡 Como tudo começou</h2>
            <p>
              O StudyFlow nasceu de uma frustração comum:
              <strong>a perda de tempo procurando o que estudar.</strong>
              <br /><br />
              Percebemos que estudantes gastavam mais tempo organizando
              materiais e filtrando questões desatualizadas do que realmente
              aprendendo. Decidimos criar uma solução onde a tecnologia faz o
              trabalho pesado de curadoria, permitindo que você foque no que
              importa: <strong>evoluir.</strong>
            </p>
          </div>
          <div class="origin-visual">
            <div class="flow-step">
              <span class="step-icon">❌</span>
              <span>Estudo Caótico</span>
            </div>
            <div class="arrow">➔</div>
            <div class="flow-step highlight">
              <span class="step-icon">✅</span>
              <span>StudyFlow</span>
            </div>
          </div>
        </div>
      </section>

      <section class="tech-section">
        <h2 class="section-title">Powered By ⚡</h2>
        <div class="tech-grid">
          <div class="glass-card tech-card">
            <div class="icon-wrapper vue-bg">
              <svg viewBox="0 0 128 128" width="40" height="40">
                <path
                  fill="#42b883"
                  d="M78.8,10L64,35.4L49.2,10H0l64,110.8L128,10H78.8z"
                />
              </svg>
            </div>
            <h3>Vue.js 3</h3>
            <p>Interface reativa e ultra-rápida para uma experiência fluida.</p>
          </div>

          <div class="glass-card tech-card">
            <div class="icon-wrapper fire-bg">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="#FFCA28">
                <path d="M12,2L1,22h22L12,2z" />
              </svg>
            </div>
            <h3>Firebase</h3>
            <p>Dados sincronizados em tempo real e autenticação segura.</p>
          </div>

          <div class="glass-card tech-card">
            <div class="icon-wrapper gemini-bg">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="white">
                <path
                  d="M12,2L9,9L2,12L9,15L12,22L15,15L22,12L15,9L12,2Z"
                  fill="url(#gemini-grad)"
                />
                <defs>
                  <linearGradient
                    id="gemini-grad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" style="stop-color: #4facfe" />
                    <stop offset="100%" style="stop-color: #00f2fe" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3>Gemini AI</h3>
            <p>
              O cérebro do sistema, gerando questões e explicações sob medida.
            </p>
          </div>
        </div>
      </section>

      <section class="team-section">
        <h2 class="section-title">Quem faz acontecer</h2>
        <div class="team-grid">
          <div
            v-for="(dev, index) in developers"
            :key="index"
            class="glass-card team-card"
          >
            <div class="avatar-placeholder">{{ dev.initials }}</div>
            <div class="dev-info">
              <h3>{{ dev.name }}</h3>
              <span class="role">Full Stack Developer</span>
              <div class="social-links">
                <a :href="dev.github" target="_blank" class="social-btn github">
                  <span class="github-icon">octocat</span> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <h2>Pronto para evoluir?</h2>
        <router-link to="/questions" class="btn-primary">
          Começar Agora
        </router-link>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const developers = ref([
  {
    name: "Ericlecio Thiago",
    initials: "ET",
    github: "https://github.com/Ericlecio",
  },
  {
    name: "Flavio Wallefy",
    initials: "FW",
    github: "https://github.com/FlavioWallefy1",
  },
  {
    name: "Lucas Rafael",
    initials: "LR",
    github: "https://github.com/lucasrafael2601",
  },
  {
    name: "Marcos Vinicius",
    initials: "MV",
    github: "https://github.com/MoraesMarcos",
  },
  {
    name: "Nielson Junior",
    initials: "NJ",
    github: "https://github.com/nielsonj13",
  },
]);
</script>

<style scoped>
.about-page {
  --bg-dark: #050507;
  --text-light: #ffffff;
  --text-gray: #a0a3b5;
  --brand-color: #4e73df;
  --glass-bg: rgba(23, 26, 74, 0.4);
  --glass-border: rgba(255, 255, 255, 0.08);

  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-light);
  padding: 40px 20px;
  position: relative;
  overflow-x: hidden;
  font-family: "Inter", sans-serif;
  padding-bottom: 100px;
}

.background-glow {
  position: absolute;
  top: -10%;
  left: 20%;
  width: 80%;
  height: 80%;
  background: radial-gradient(
    circle,
    rgba(78, 115, 223, 0.15) 0%,
    transparent 60%
  );
  pointer-events: none;
  z-index: 0;
  animation: pulse 8s infinite alternate;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
}

/* Header */
.header-section {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease forwards;
}

.badge-pill {
  display: inline-block;
  background: rgba(78, 115, 223, 0.2);
  color: #7096ff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 15px;
  border: 1px solid rgba(78, 115, 223, 0.3);
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1.1;
}

.brand-highlight {
  background: linear-gradient(135deg, #4e73df 0%, #7096ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mission-text {
  font-size: 1.15rem;
  color: var(--text-gray);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}

/* A Origem (Storytelling) */
.origin-section {
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease 0.1s forwards;
  opacity: 0;
}

.origin-card {
  display: flex;
  align-items: center;
  gap: 40px;
  text-align: left;
  background: linear-gradient(
    145deg,
    rgba(23, 26, 74, 0.6),
    rgba(10, 10, 12, 0.8)
  );
}

.origin-content h2 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}
.origin-content p {
  color: var(--text-gray);
  font-size: 1rem;
  line-height: 1.6;
}

.origin-visual {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(0, 0, 0, 0.3);
  padding: 20px;
  border-radius: 12px;
}
.flow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #666;
}
.flow-step.highlight {
  color: #fff;
  font-weight: bold;
}
.step-icon {
  font-size: 1.5rem;
}
.arrow {
  color: var(--brand-color);
  font-size: 1.5rem;
}

/* Cards Comuns */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 30px;
  transition: transform 0.3s, border-color 0.3s;
}
.glass-card:hover {
  transform: translateY(-5px);
  border-color: rgba(78, 115, 223, 0.4);
}

/* Tech Grid */
.tech-section {
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease 0.2s forwards;
  opacity: 0;
}
.section-title {
  font-size: 1.8rem;
  margin-bottom: 30px;
  text-align: center;
  color: #fff;
  font-weight: 700;
}
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.tech-card {
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
}
.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.05);
}

/* Team Grid */
.team-section {
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease 0.3s forwards;
  opacity: 0;
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
.team-card {
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.avatar-placeholder {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a2d6a, #171a4a);
  border: 2px solid rgba(78, 115, 223, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #7096ff;
  margin-bottom: 15px;
}

.social-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 6px 14px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transition: 0.2s;
}
.social-btn:hover {
  background: white;
  color: black;
}

/* CTA Final */
.cta-section {
  text-align: center;
  margin-top: 40px;
  animation: fadeInUp 0.8s ease 0.4s forwards;
  opacity: 0;
}
.cta-section h2 {
  margin-bottom: 20px;
  font-size: 1.5rem;
}
.btn-primary {
  background: linear-gradient(90deg, #4e73df, #7096ff);
  color: white;
  padding: 14px 32px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 5px 20px rgba(78, 115, 223, 0.4);
  transition: transform 0.2s;
  display: inline-block;
}
.btn-primary:hover {
  transform: scale(1.05);
}

/* Animações */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.2rem;
  }
  .origin-card {
    flex-direction: column;
    text-align: center;
  }
  .origin-visual {
    width: 100%;
    justify-content: center;
  }
}
</style>
