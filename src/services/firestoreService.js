import { db } from "@/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const resultadosRef = collection(db, "resultados");

export async function saveResult({ userId, tema, acertos, erros, data }) {
  return await addDoc(resultadosRef, {
    userId,
    tema,
    acertos,
    erros,
    data,
  });
}

export async function getUserResults(userId) {
  const q = query(resultadosRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
