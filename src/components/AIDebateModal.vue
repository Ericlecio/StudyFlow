<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <h2>Debate Inteligente</h2>
      <p class="question-text">{{ question.question }}</p>

      <div class="debate-area">
        <div class="explanation">
          <h3>Explicação Detalhada (Gabarito: {{ question.answer }})</h3>
          <p>{{ question.explanation }}</p>
        </div>

        <div class="chat-interface">
          <h4>Dúvidas? Converse com o Tutor:</h4>
          <div class="chat-log" ref="chatLog">
            <div
              v-for="(msg, i) in chatHistory"
              :key="i"
              :class="['message', msg.role]"
            >
              <strong>{{ msg.role === "user" ? "Você" : "Tutor" }}:</strong>
              {{ msg.text }}
            </div>
          </div>
          <div class="chat-input-group">
            <input
              v-model="userQuery"
              placeholder="Ex: 'Me dê um exemplo prático do conceito X'"
              @keyup.enter="handleChat"
              :disabled="isChatting"
            />
            <button
              @click="handleChat"
              :disabled="isChatting"
              :class="{ 'chat-loading': isChatting }"
            >
              <span v-if="!isChatting">Enviar</span>
              <span v-else>...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { debateWithAI } from "@/services/chatService";

const props = defineProps({
  question: Object,
});

const emit = defineEmits(["close"]);

const userQuery = ref("");
const isChatting = ref(false);
const chatLog = ref(null);

const chatHistory = ref([
  {
    role: "ai",
    text: `Olá! Eu sou seu Tutor de IA. A explicação detalhada está ao lado. Sobre qual ponto da questão você gostaria de mais detalhes ou um debate?`,
  },
]);

watch(
  chatHistory.value,
  () => {
    nextTick(() => {
      if (chatLog.value) {
        chatLog.value.scrollTop = chatLog.value.scrollHeight;
      }
    });
  },
  { deep: true }
);

async function handleChat() {
  if (!userQuery.value.trim() || isChatting.value) return;

  const query = userQuery.value;
  userQuery.value = "";
  isChatting.value = true;

  chatHistory.value.push({ role: "user", text: query });

  try {
    const aiResponse = await debateWithAI(
      props.question,
      chatHistory.value,
      query
    );
    chatHistory.value.push({ role: "ai", text: aiResponse });
  } catch (e) {
    chatHistory.value.push({
      role: "ai",
      text: "Desculpe, houve um erro ao processar sua pergunta. Tente novamente.",
    });
  } finally {
    isChatting.value = false;
  }
}
</script>

<style scoped>
/* Animações */
@keyframes fadeInModal {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slideInModal {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes pulsingBlue {
  0% {
    box-shadow: 0 0 0 0 rgba(78, 115, 223, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(78, 115, 223, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(78, 115, 223, 0);
  }
}

/* Estilos do Modal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeInModal 0.3s ease-out;
}
.modal-content {
  background: #0a0a0c;
  padding: 30px;
  border-radius: 16px;
  width: 95%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 2px solid #2a2d6a;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);
  animation: slideInModal 0.3s ease-out;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  color: #a0a3b5;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}
.close-btn:hover {
  color: white;
}

/* Títulos */
.modal-content h2 {
  color: #7096ff;
  font-size: 1.6rem;
  margin-bottom: 10px;
  text-align: center;
  font-weight: 700;
}
.question-text {
  color: #e0e0e0;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #2a2d6a;
  text-align: center;
  font-size: 1.1rem;
}

/* Área de Debate (Flex Container) */
.debate-area {
  display: flex;
  gap: 30px;
}
.explanation {
  flex: 1;
}
.explanation h3 {
  color: #10b981;
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-weight: 600;
}
.explanation p {
  color: #a0a3b5;
  line-height: 1.7;
  font-size: 0.95rem;
}

/* Interface de Chat */
.chat-interface {
  flex: 1;
  border-left: 1px solid #2a2d6a;
  padding-left: 30px;
}
.chat-interface h4 {
  color: #4e73df;
  margin-bottom: 15px;
  font-size: 1.2rem;
  font-weight: 600;
}
.chat-log {
  height: 280px;
  overflow-y: auto;
  background: #111116;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid #2a2d6a;
}
/* Estilo das Mensagens */
.message {
  margin-bottom: 10px;
  font-size: 0.95rem;
  line-height: 1.5;
  display: flex;
}
.message strong {
  font-weight: 700;
  margin-right: 5px;
  white-space: nowrap;
}
.message.user {
  justify-content: flex-end;
  color: #fff;
}
.message.ai {
  justify-content: flex-start;
  color: #a0a3b5;
}
.message.user strong {
  color: #7096ff;
}
.message.ai strong {
  color: #10b981;
}

/* Input e Botão de Envio */
.chat-input-group {
  display: flex;
  gap: 10px;
}
.chat-input-group input {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #2a2d6a;
  background: #0a0a0c;
  color: white;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.chat-input-group input:focus {
  outline: none;
  border-color: #4e73df;
}
.chat-input-group button {
  background: #4e73df;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s, box-shadow 0.2s;
}
.chat-input-group button:hover:not(:disabled) {
  background: #3b63d6;
}
.chat-input-group button:disabled {
  background: #2a2d6a;
  cursor: wait;
  opacity: 0.8;
}

.chat-loading {
  animation: none; /* A animação é definida no componente pai no hover/focus */
}

/* Responsividade */
@media (max-width: 768px) {
  .debate-area {
    flex-direction: column;
    gap: 20px;
  }
  .chat-interface {
    border-left: none;
    padding-left: 0;
    border-top: 1px solid #2a2d6a;
    padding-top: 20px;
  }
  .modal-content {
    padding: 20px 15px;
  }
  .chat-input-group {
    flex-direction: column;
  }
  .chat-input-group button {
    width: 100%;
  }
}
</style>
