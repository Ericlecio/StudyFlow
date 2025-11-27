import { db } from "@/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

/**
 * Salva uma sessão de estudos na subcoleção 'history' do usuário.
 * Estrutura: /users/{userId}/history/{documentId}
 */
export async function saveStudySession({
  userId,
  tema,
  acertos,
  erros,
  totalQuestions,
  dataISO,
}) {
  if (!userId) throw new Error("Usuário não identificado.");

  // Referência para a subcoleção "history" dentro do documento do usuário
  const historyRef = collection(db, "users", userId, "history");

  const docRef = await addDoc(historyRef, {
    tema,
    acertos,
    erros,
    totalQuestions,
    score: Math.round((acertos / totalQuestions) * 100), // Já salva a porcentagem
    timestamp: dataISO || new Date().toISOString(),
    type: "quiz",
  });

  return docRef;
}

/**
 * Busca todo o histórico de estudos de um usuário específico.
 */
export async function getUserHistory(userId) {
  if (!userId) return [];

  const historyRef = collection(db, "users", userId, "history");
  // Ordena por data (mais recente primeiro)
  const q = query(historyRef, orderBy("timestamp", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
