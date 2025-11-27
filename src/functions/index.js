const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { onCall } = require("firebase-functions/v2/https");
const OpenAI = require("openai");

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

exports.generateQuestions = onCall(async (request) => {
  const { topic } = request.data;

  if (!topic) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Você precisa enviar um 'topic'."
    );
  }

  try {
    const prompt = `
Gere 5 questões de múltipla escolha sobre o tema "${topic}".
FORMATO EXATO de saída (JSON):

[
  {
    "question": "Texto da questão",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }
]

APENAS retorne JSON válido. Não explique nada.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content.trim();

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (e) {
      console.error("Erro ao parsear JSON:", text);
      throw new functions.https.HttpsError(
        "internal",
        "Resposta inválida da OpenAI."
      );
    }

    return { questions };
  } catch (error) {
    console.error("Erro na OpenAI:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Erro ao gerar questões com o ChatGPT."
    );
  }
});
