# StudyFlow

**Versão:** 1.0.0  
**Status:** Em Produção (MVP)

## Sobre o Projeto

O **StudyFlow** é uma plataforma de educação adaptativa baseada em Inteligência Artificial Generativa. O objetivo central da aplicação é mitigar a "paralisia da escolha" e a desorganização que estudantes enfrentam durante a preparação para concursos públicos, vestibulares e estudos técnicos.

Em contrapartida aos bancos de dados estáticos tradicionais, o StudyFlow utiliza a API do Google Gemini para criar trilhas de estudo infinitas, personalizadas e comentadas em tempo real. O sistema elimina o tempo gasto na organização de materiais, permitindo que o usuário inicie a prática imediatamente após definir um tema.

## Equipe de Desenvolvimento

* Ericlecio Thiago
* Marcos Vinicius
* Flavio Wallefy
* Lucas Rafael
* Nielson Florencio

## Funcionalidades Principais

O sistema opera sob o conceito de "Flow" (fluxo contínuo de aprendizado):

* **Geração de Questões via IA:** Criação de questões inéditas ou baseadas em bancas reais (ex: Cesgranrio, Cebraspe) sob demanda, a partir de qualquer tema inserido pelo usuário.
* **Tutor Virtual e Debate:** Chat contextual integrado a cada questão, onde a IA atua como um professor particular explicando conceitos e esclarecendo dúvidas específicas.
* **Histórico Inteligente (Tópicos Persistentes):** O sistema salva o progresso por tópicos, permitindo a retomada do contexto de estudo e a continuidade da geração de questões a partir do ponto de parada.
* **Dashboards e Métricas:** Exibição de estatísticas como taxa de acerto global, total de questões e identificação automática de pontos fortes e pontos de atenção.
* **Interface Responsiva:** Design com suporte a "Dark Mode", estética Glassmorphism e sidebar responsiva para dispositivos móveis.
* **Sistema de Repetição Espaçada (SRS):** Cálculo automático de revisão baseado no feedback de dificuldade do usuário.

## Arquitetura Técnica

O projeto segue uma arquitetura **Fullstack Serverless**, garantindo o desacoplamento entre cliente e servidor para maior escalabilidade e segurança.

### Frontend
* **Framework:** Vue.js 3 (Composition API) - Foco em reatividade e performance.
* **Build Tool:** Vite.
* **Estilização:** CSS3 Puro (Scoped) com uso de Flexbox, CSS Grid e Variáveis CSS.
* **Roteamento:** Vue Router com guardas de navegação.

### Backend
* **Runtime:** Node.js com Express.
* **IA:** Google Gemini SDK (`@google/genai`) utilizando o modelo `gemini-2.5-flash`.
* **Segurança:** Middleware CORS configurado para restrição de origem (Domínio de Produção).

### Banco de Dados e Autenticação (BaaS)
* **Autenticação:** Firebase Authentication (Google e Email/Senha).
* **Database:** Firebase Firestore (NoSQL).
* **Estrutura:** Dados hierárquicos (`Users -> Topics -> Messages`) com regras de segurança para isolamento de dados por usuário.

## Infraestrutura e Deploy

A aplicação utiliza um ambiente de alta disponibilidade distribuído entre Vercel e Render:

1.  **Frontend (Vercel):** Hospedagem da SPA (Single Page Application) com redirecionamento de rotas configurado (`vercel.json`), CDN global e SSL automático.
2.  **Backend (Render):** Serviço Node.js dedicado para gerenciamento da API. Esta camada é essencial para a proteção das variáveis de ambiente (`GEMINI_API_KEY`) e orquestração das requisições, evitando a exposição de credenciais no lado do cliente.

## Desafios Técnicos e Soluções

Durante o desenvolvimento da versão 1.0.0, a equipe solucionou os seguintes desafios críticos:

* **Segurança de API e CORS:** Implementação de uma camada intermediária em Node.js para centralizar requisições à IA, protegendo a `API_KEY` e configurando explicitamente o middleware CORS para permitir comunicação apenas com o frontend hospedado.
* **Consistência de Dados da IA:** Tratamento de "alucinações" do modelo através de Engenharia de Prompt rigorosa (exigindo formato JSON estrito) e blocos de tratamento de erro robustos no backend.
* **Persistência de Estado:** Migração do armazenamento local (`localStorage`) para banco de dados em nuvem (Firestore), garantindo a sincronização do histórico do usuário entre diferentes dispositivos.

## Diferenciais Competitivos

* **Custo-Eficiência:** Utilização otimizada do plano gratuito do Google Gemini e infraestrutura Free Tier.
* **Aprendizado Ativo:** Transição do estudo passivo para o debate ativo de conceitos.
