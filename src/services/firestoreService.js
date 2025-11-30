// src/services/firestoreService.js (ATUALIZADO COM SRS)
import { db } from "@/firebase";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Função auxiliar para calcular data da próxima revisão (SRS Simplificado)
function calculateNextReview(difficulty) {
  const now = new Date();
  if (difficulty === "hard")
    return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 dia
  if (difficulty === "medium")
    return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 dias
  return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 dias (Fácil)
}

export async function saveStudySession(userId, sessionData) {
  if (!userId) throw new Error("Usuário não identificado.");

  const topicsRef = collection(db, "users", userId, "topics");

  // 1. Verificar se o tópico existe
  const q = query(
    topicsRef,
    where("title_normalized", "==", sessionData.tema.toLowerCase())
  );
  const querySnapshot = await getDocs(q);

  let topicId;
  let currentStats = { totalQuestions: 0, totalCorrect: 0, weakPoints: [] };

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0];
    topicId = docRef.id;
    const data = docRef.data();
    currentStats.totalQuestions = data.totalQuestions || 0;
    currentStats.totalCorrect = data.totalCorrect || 0;
    currentStats.weakPoints = data.weakPoints || [];
  } else {
    const newDoc = await addDoc(topicsRef, {
      title: sessionData.tema,
      title_normalized: sessionData.tema.toLowerCase(),
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),
      totalQuestions: 0,
      totalCorrect: 0,
      weakPoints: [],
    });
    topicId = newDoc.id;
  }

  // 2. Calcular estatísticas
  const newTotalQuestions =
    currentStats.totalQuestions + sessionData.totalQuestions;
  const newTotalCorrect = currentStats.totalCorrect + sessionData.acertos;
  const newScore =
    newTotalQuestions > 0
      ? Math.round((newTotalCorrect / newTotalQuestions) * 100)
      : 0;

  // Atualizar Weak Points se errar muito
  let updatedWeakPoints = currentStats.weakPoints;
  if (
    sessionData.score < 60 &&
    !updatedWeakPoints.includes("Conceitos Básicos")
  ) {
    updatedWeakPoints.push("Conceitos Básicos");
  }

  await updateDoc(doc(db, "users", userId, "topics", topicId), {
    lastActive: serverTimestamp(),
    totalQuestions: newTotalQuestions,
    totalCorrect: newTotalCorrect,
    score: newScore,
    weakPoints: updatedWeakPoints,
  });

  // 3. Salvar as questões com Metadata de SRS
  const messagesRef = collection(
    db,
    "users",
    userId,
    "topics",
    topicId,
    "messages"
  );

  // Enriquece as questões com data de revisão
  const enrichedQuestions = sessionData.questionsDetails.map((q) => ({
    ...q,
    nextReview: calculateNextReview(q.difficulty || "medium"), // Padrão médio se não informado
    reviewed: false,
  }));

  await addDoc(messagesRef, {
    type: "quiz_block",
    questions: enrichedQuestions,
    timestamp: serverTimestamp(),
    sessionScore: sessionData.score,
  });

  return topicId;
}

export async function getUserTopics(userId) {
  if (!userId) return [];
  const topicsRef = collection(db, "users", userId, "topics");
  const q = query(topicsRef, orderBy("lastActive", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getTopicHistory(userId, topicId) {
  if (!userId || !topicId) return [];
  const messagesRef = collection(
    db,
    "users",
    userId,
    "topics",
    topicId,
    "messages"
  );
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(q);

  let allQuestions = [];
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.questions) {
      allQuestions = [...allQuestions, ...data.questions];
    }
  });
  return allQuestions;
}
