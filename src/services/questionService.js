// src/services/questionService.js
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://studyflow-api-bp30.onrender.com/api/generateQuestions";

export async function generateQuestions(
  topic,
  batchSize,
  filters = { type: "mixed" }
) {
  try {
    const resp = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, batchSize, filters }),
    });

    if (!resp.ok) {
      const errorData = await resp.json();
      throw new Error(errorData.error || "Erro ao chamar API");
    }

    const data = await resp.json();
    return data.questions || [];
  } catch (e) {
    console.error("Erro API:", e);
    throw e;
  }
}
