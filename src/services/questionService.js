// A URL completa da sua API no Render
const API_URL = "https://studyflow-api-bp30.onrender.com/api/generateQuestions";

/**
 * Chama a API backend para gerar questões baseadas em um tópico.
 @param {string} topic -
 @returns {Promise<Array>} - Uma promessa que resolve para um array de questões.
 */
export async function generateQuestions(topic) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }), // Envia o "topic" no corpo da requisição
    });

    if (!response.ok) {
      // Se a resposta não for 200 (OK), tenta ler a mensagem de erro
      const err = await response.json();
      throw new Error(err.error || "Erro ao conectar na API");
    }

    const data = await response.json();
    return data.questions; // Retorna o array de questões para a QuestionsView
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    throw error; // Joga o erro para a QuestionsView poder tratar (ex: mostrar um alerta)
  }
}
