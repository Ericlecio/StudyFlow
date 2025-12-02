<template>
  <div class="landing-page">
    
    <div class="background-glow"></div>

    <div class="container content-wrapper">
      
      <section class="hero-section">
        <div class="main-logo-display">
            StudyFlow
        </div>
        <h1 class="hero-title">
          Estude de Forma <span class="brand-highlight">Inteligente</span>.
        </h1>
        <p class="hero-subtitle">
          O StudyFlow usa a Gemini AI para criar trilhas de estudo 
          personalizadas, eficientes e 100% gratuitas.
        </p>

        <div class="cta-group">
          <router-link to="/login" class="action-link">
            <button class="btn-primary large">
              Começar Agora!
              <span class="btn-shine"></span>
            </button>
          </router-link>
          
        </div>
      </section>

      <section class="value-prop-section">
        <h2 class="section-title">O que nos torna diferentes 💡</h2>
        <div class="tech-grid">
          
          <div class="glass-card value-card">
            <div class="icon-wrapper gemini-bg">
              <svg viewBox="0 0 128 128" width="30" height="30" fill="currentColor">
                <path d="M78.8,10L64,35.4L49.2,10H0l64,110.8L128,10H78.8z" fill="#4e73df"/>
              </svg>
            </div>
            <h3>Inteligência Artificial</h3>
            <p>Conteúdo e questões geradas sob demanda com a precisão da Gemini AI.</p>
          </div>

          <div class="glass-card value-card">
            <div class="icon-wrapper vue-bg">
              <span class="icon-emoji">🧠</span>
            </div>
            <h3>Aprendizado Personalizado</h3>
            <p>Trilhas de estudo adaptadas ao seu nível, ritmo e pontos fracos específicos.</p>
          </div>

          <div class="glass-card value-card">
            <div class="icon-wrapper fire-bg">
              <span class="icon-emoji">👥</span>
            </div>
            <h3>Estudo Colaborativo</h3>
            <p>Conecte-se com colegas e gerencie projetos acadêmicos em conjunto.</p>
          </div>
        </div>
      </section>
      
      <section class="developers-section">
          <h2 class="section-title">Quem Faz Acontecer 🚀</h2>
          <div class="team-grid">
            
            <div v-for="(dev, index) in developers" :key="index" class="glass-card team-card">
              <div class="avatar-placeholder">
                {{ dev.initials }}
              </div>
              <div class="dev-info">
                <h3>{{ dev.name }}</h3>
                <span class="role">Desenvolvedor Full Stack</span>
                
                <div class="social-links">
                  <a :href="dev.github" target="_blank" class="social-btn github">
                    GitHub
                  </a>
                </div>
              </div>
            </div>

          </div>
      </section>
      
      <section class="final-cta">
        <h2 class="section-title">Pare de estudar mais. Estude melhor.</h2>
        <router-link to="/login" class="action-link">
          <button class="btn-primary large">
            Comece a Aprender Grátis →
          </button>
        </router-link>
      </section>
      
    </div>
    
  </div>
</template>

<script setup>
</script>
<script setup>
import { ref } from 'vue'; 

// Dados dos Desenvolvedores
const developers = ref([
  { name: 'Ericlecio Thiago', initials: 'ET', github: 'https://github.com/Ericlecio' },
  { name: 'Flavio Wallefy', initials: 'FW', github: 'https://github.com/FlavioWallefy1' },
  { name: 'Lucas Rafael', initials: 'LR', github: 'https://github.com/lucasrafael2601' },
  { name: 'Marcos Vinicius', initials: 'MV', github: 'https://github.com/MoraesMarcos' },
  { name: 'Nielson Junior', initials: 'NJ', github: 'https://github.com/nielsonj13' },
]);
</script>
<style scoped>

.landing-page {
  --bg-dark: #050507;
  --brand-color: #4e73df;
  --text-gray: #a0a3b5;
  --navy-card: rgba(23, 26, 74, 0.4);
  --navy-border: #2a2d6a;

  background-color: var(--bg-dark);
  min-height: 100vh;
  color: white;
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow-x: hidden;
}

.background-glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(78, 115, 223, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
  animation: pulse 10s infinite alternate;
}

@keyframes pulse {
  0% { opacity: 0.5; transform: translateX(-50%) scale(0.9); }
  100% { opacity: 0.7; transform: translateX(-50%) scale(1.1); }
}

@keyframes shineText {
  to {
    background-position: 200% center;
  }
}

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.hero-section {
  text-align: center;
  padding: 80px 0 100px 0;
  animation: fadeInUp 1s ease-out;
}

.main-logo-display {
    font-size: 5.5rem; 
    font-weight: 900;
    margin-bottom: 20px; 
    letter-spacing: -2px;
    line-height: 1.1; 
    padding: 5px 0;   
    
    /* 🚨 EFEITO COPIADO DO .brand-highlight DA HOMEVIEW */
    background: linear-gradient(135deg, #4e73df 0%, #7096ff 50%, #ffffff 100%);
    background-size: 200% auto; /* Necessário para a animação */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shineText 5s linear infinite; /* Animação de brilho em loop */

    text-shadow: none; /* Remove a sombra sutil que havíamos adicionado */
}

@media (max-width: 600px) {
    .main-logo-display {
        font-size: 3.5rem; 
    }
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 20px;
}

.brand-highlight {
  background: -webkit-linear-gradient(45deg, #4e73df, #2a2d6a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}


.hero-subtitle {
  font-size: 1.4rem;
  color: var(--text-gray);
  max-width: 850px;
  margin: 0 auto 50px auto;
}

.cta-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.btn-primary {
  position: relative;
  background-color: var(--brand-color);
  color: white;
  padding: 18px 40px;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(78, 115, 223, 0.4);
  letter-spacing: 0.5px;
  min-width: 300px;
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg, transparent, rgba(255, 255, 255, 0.2), transparent
  );
  transition: 0.5s;
}

.btn-primary:hover .btn-shine {
  left: 100%;
  transition: 0.5s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(78, 115, 223, 0.5);
}

.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 40px;
  font-weight: 700;
  padding-top: 50px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 80px;
}

.glass-card {
  background: var(--navy-card);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.glass-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
}

.icon-wrapper {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  background-color: #171a4a;
}

.vue-bg { background-color: #2c3e50; color: #42b883; }
.fire-bg { background-color: #3b2a1a; color: #ff9800; }
.gemini-bg { background-color: #1a1a3b; color: #4e73df; }

.value-card h3 { margin-bottom: 8px; font-size: 1.25rem; }
.value-card p { font-size: 1rem; color: var(--text-gray); }
.icon-emoji { font-size: 1.8rem; }

.developers-section {
    padding-top: 50px;
    padding-bottom: 80px;
}

.team-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(250px, 1fr)); 
    gap: 20px;
    margin-top: 40px;
}

.team-card {
    /* Reutiliza a classe glass-card */
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

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
  box-shadow: 0 0 15px var(--brand-glow);
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


.final-cta {
    text-align: center;
    padding-bottom: 80px;
}
.final-cta .section-title {
    margin-bottom: 30px;
}

@media (max-width: 1024px) {
    .hero-title { font-size: 3rem; }
}

@media (max-width: 900px) {
    .tech-grid, .team-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .hero-title { font-size: 2.5rem; }
    .hero-subtitle { font-size: 1.2rem; }
    .btn-primary { 
        min-width: 80%;
        font-size: 1rem;
        padding: 15px 30px;
    }
    .tech-grid {
        grid-template-columns: 1fr;
    }
}
</style>