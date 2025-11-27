<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-left">
        <span class="brand">Study<span class="brand-highlight">Flow</span></span>
        <p class="copyright">
          &copy; {{ currentYear }} Todos os direitos reservados.
        </p>
      </div>

      <div class="footer-right">
        <a href="#" class="footer-link">Termos</a>
        <a href="#" class="footer-link">Privacidade</a>
        
        <a 
          href="https://github.com/Ericlecio/StudyFlow" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="footer-link github-link"
        >
          <svg class="github-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const currentYear = ref(new Date().getFullYear());
</script>

<style scoped>
.footer {
  /* Cor exata do fundo da página */
  background-color: #050507; 
  /* Borda sutil */
  border-top: 1px solid #1e1e1e; 
  
  padding: 2rem 0;
  margin-top: auto;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* --- Brand Styles --- */
.brand {
  font-weight: 700;
  font-size: 1.1rem;
  color: #fff;
  display: block;
  margin-bottom: 0.25rem;
}

.brand-highlight {
  color: #4e73df;
}

.copyright {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
}

/* --- Links --- */
.footer-right {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.footer-link {
  color: #a0a3b5;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  gap: 8px; 
}

.footer-link:hover {
  color: #4e73df;
}

/* Específico para o GitHub para alinhar o ícone */
.github-icon {
  margin-top: -2px; /* Ajuste fino vertical */
}

/* Responsivo */
@media (max-width: 600px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>