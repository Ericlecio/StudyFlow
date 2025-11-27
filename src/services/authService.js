import { auth, db } from "@/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Função para garantir que o usuário existe no Firestore
async function ensureUserDocument(user) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    // Cria o perfil inicial se não existir
    await setDoc(userRef, {
      name: user.displayName || user.email.split("@")[0],
      email: user.email,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
    });
  } else {
    // Atualiza apenas o último login
    await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
  }
}

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await ensureUserDocument(result.user);
  return result;
}

export async function register(email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDocument(result.user);
  return result;
}

export async function login(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDocument(result.user);
  return result;
}

export function logout() {
  return signOut(auth);
}

export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
