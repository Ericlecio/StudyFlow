// src/services/chatService.js
const CHAT_API_URL =
  import.meta.env.VITE_API_URL ||
  "https://studyflow-api-bp30.onrender.com/api/debate";

export async function debateWithAI(question, history, userQuery) {
  try {
    // O histórico é simplificado para enviar apenas as propriedades necessárias
    const simpleHistory = history.map((msg) => ({
      role: msg.role,
      text: msg.text,
    }));

    const resp = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        chatHistory: simpleHistory,
        userQuery,
      }),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.error || "Erro ao iniciar o debate.");
    }

    const data = await resp.json();
    return data.response;
  } catch (e) {
    console.error("Erro API Debate:", e);
    throw e;
  }
}
