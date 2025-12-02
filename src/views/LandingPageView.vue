<template>
  <div class="landing-page">
    
    <div class="background-glow"></div>

    <div class="container content-wrapper">
      
      <section class="hero-section">
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
      
      <section class="screenshot-section">
          <h2 class="section-title">StudyFlow em Ação 💻</h2>
          <div class="screenshot-grid">
              
              <div class="app-mockup wide placeholder-bg">
                  <p class="placeholder-text">Dashboard (Placeholder)</p> 
              </div>
              
              <div class="app-mockup placeholder-bg">
                  <p class="placeholder-text">Questões (Placeholder)</p>
              </div>

              <div class="app-mockup placeholder-bg">
                  <p class="placeholder-text">Histórico (Placeholder)</p>
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
import Navbar from '@/components/Navbar.vue'; 
import Footer from '@/components/Footer.vue'; 
// 🚨 LINHAS DE IMPORTAÇÃO DE IMAGEM REMOVIDAS
</script>

<style scoped>
/*
 * ESTILOS DE BASE (COPIADOS E ADAPTADOS ANTERIORMENTE)
 */
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

.content-wrapper {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

/* 1. HERO SECTION */
.hero-section {
  text-align: center;
  padding: 80px 0 100px 0;
  animation: fadeInUp 1s ease-out;
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

/* 2. VANTAGENS / TECH SECTION */
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


/* 3. PRINTS DO APP */
.screenshot-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr;
    gap: 20px;
    align-items: center;
    margin-top: 30px;
    margin-bottom: 100px;
}

.app-mockup {
    background: #111116; 
    border-radius: 16px;
    padding: 10px;
    overflow: hidden;
    border: 1px solid var(--navy-border);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    transition: transform 0.3s ease-in-out;
    /* Define uma altura mínima para os placeholders */
    min-height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.app-mockup.wide {
    grid-column: 1 / span 1; 
    grid-row: 1 / span 2; 
    min-height: 420px; /* Maior para o mockup 'wide' */
}

/* Estilo para placeholders para simular as telas */
.placeholder-bg {
    background: linear-gradient(135deg, #111116 0%, #1a1a2e 100%);
}
.placeholder-text {
    color: var(--text-gray);
    font-weight: 500;
    text-align: center;
    opacity: 0.7;
}

/* 4. CTA FINAL */
.final-cta {
    text-align: center;
    padding-bottom: 80px;
}
.final-cta .section-title {
    margin-bottom: 30px;
}

/* Media Queries (Responsividade) */
@media (max-width: 1024px) {
    .hero-title { font-size: 3rem; }
}

@media (max-width: 900px) {
    .screenshot-grid {
        grid-template-columns: 1fr;
    }
    .app-mockup.wide {
        grid-column: 1; 
        grid-row: auto; 
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