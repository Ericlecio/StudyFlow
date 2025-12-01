<template>
  <div class="about-page">
    <div class="background-glow"></div>

    <div class="container content-wrapper">
      
      <header class="header-section">
        <h1 class="title">Sobre o <span class="brand-highlight">StudyFlow</span></h1>
        <p class="mission-text">
          Nossa missão é revolucionar a forma como você estuda. Unimos a flexibilidade 
          da tecnologia moderna com o poder da <strong>Inteligência Artificial</strong> para criar 
          trilhas de aprendizado personalizadas, eficientes e gratuitas.
        </p>
      </header>

      <section class="tech-section">
        <h2 class="section-title">Tecnologias ⚡</h2>
        <div class="tech-grid">
          
          <div class="glass-card tech-card">
            <div class="icon-wrapper vue-bg">
              <svg viewBox="0 0 128 128" width="40" height="40">
                <path fill="#42b883" d="M78.8,10L64,35.4L49.2,10H0l64,110.8L128,10H78.8z"/>
              </svg>
            </div>
            <h3>Vue.js 3</h3>
            <p>Frontend reativo de alta performance.</p>
          </div>

          <div class="glass-card tech-card">
            <div class="icon-wrapper fire-bg">
              <svg viewBox="0 0 128 128" width="40" height="40">
                <path fill="#FFCA28" d="M17.6 109.8L3.2 22.5c-.5-3.2 3.3-5.3 5.7-3.2l28.6 26.6-17.6 64.2-.3-.3z"/>
                <path fill="#FFA000" d="M66.7 42.6L46.4 7.6C44.8 4.9 41 5.3 40 8.3L19.9 109.8h93.6L66.7 42.6z"/>
                <path fill="#F57C00" d="M96.2 59.8L79.1 27.5c-1.5-2.8-5.6-2.5-6.7.5L59 66.2l37.2-6.4z"/>
              </svg>
            </div>
            <h3>Firebase</h3>
            <p>Backend serverless, Auth e Database em tempo real.</p>
          </div>

          <div class="glass-card tech-card">
            <div class="icon-wrapper gemini-bg">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="white">
                <path d="M19,2L14,6.5V17.5L19,22L24,17.5V6.5L19,2M12,2L7,6.5V17.5L12,22L17,17.5V6.5L12,2M7,2L2,6.5V17.5L7,22L12,17.5V6.5L7,2Z" fill="url(#gemini-gradient)"/>
                <defs>
                  <linearGradient id="gemini-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h3>Gemini AI</h3>
            <p>Inteligência artificial do Google para gerar conteúdo.</p>
          </div>

        </div>
      </section>

      <section class="team-section">
        <h2 class="section-title">Quem faz acontecer 🚀</h2>
        <div class="team-grid">
          
          <div v-for="(dev, index) in developers" :key="index" class="glass-card team-card">
            <div class="avatar-placeholder">
              {{ dev.initials }}
            </div>
            <div class="dev-info">
              <h3>{{ dev.name }}</h3>
              <span class="role">Full Stack Developer</span>
              
              <div class="social-links">
                <a :href="dev.github" target="_blank" class="social-btn github">
                  GitHub
                </a>
                </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const developers = ref([
  { name: 'Ericlecio Thiago', initials: 'ET', github: 'https://github.com/Ericlecio' },
  { name: 'Flavio Wallefy', initials: 'FW', github: 'https://github.com/FlavioWallefy1' },
  { name: 'Lucas Rafael', initials: 'LR', github: 'https://github.com/lucasrafael2601' },
  { name: 'Marcos Vinicius', initials: 'MV', github: 'https://github.com/MoraesMarcos' },
  { name: 'Nielson Junior', initials: 'NJ', github: 'https://github.com/nielsonj13' },
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
}


.background-glow {
  position: absolute;
  top: -10%; left: 20%; width: 80%; height: 80%;
  background: radial-gradient(circle, rgba(78, 115, 223, 0.15) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
  animation: pulse 8s infinite alternate;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  margin: 0 auto;
}


.header-section {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease forwards;
}

.title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.brand-highlight {
  background: linear-gradient(135deg, #4e73df 0%, #7096ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mission-text {
  font-size: 1.1rem;
  color: var(--text-gray);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}


.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  text-align: center;
  color: #fff;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 10px;
  display: inline-block;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
}

.tech-section, .team-section {
  margin-bottom: 60px;
  animation: fadeInUp 0.8s ease 0.2s forwards; /* Delay */
  opacity: 0;
}


.tech-grid, .team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 24px;
  transition: transform 0.3s, border-color 0.3s;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.glass-card:hover {
  transform: translateY(-5px);
  border-color: rgba(78, 115, 223, 0.4);
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
}


.icon-wrapper {
  width: 60px; height: 60px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 15px;
  background: rgba(255,255,255,0.05);
}

.tech-card h3 { margin-bottom: 8px; font-size: 1.1rem; }
.tech-card p { font-size: 0.9rem; color: var(--text-gray); }


.avatar-placeholder {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2a2d6a, #171a4a);
  border: 2px solid rgba(78, 115, 223, 0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #7096ff;
  margin-bottom: 15px;
  box-shadow: 0 0 15px rgba(78, 115, 223, 0.2);
}

.dev-info h3 { font-size: 1.1rem; margin-bottom: 4px; }
.role { font-size: 0.85rem; color: #4e73df; font-weight: 500; display: block; margin-bottom: 15px; }

.social-links { display: flex; gap: 10px; justify-content: center; }

.social-btn {
  padding: 6px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: 0.2s;
}

.social-btn.github {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
}

.social-btn.github:hover {
  background: white;
  color: black;
}


@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 0.8; }
}


@media (max-width: 600px) {
  .title { font-size: 2rem; }
  .tech-grid, .team-grid { grid-template-columns: 1fr; }
}
</style>