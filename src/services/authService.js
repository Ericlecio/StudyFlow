import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

// Registrar novo usuário
export function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

// Login do usuário
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout do usuário
export function logout() {
  return signOut(auth);
}

// Observar mudanças de autenticação
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}
