import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyDlSv2hFn_CkWroUP0gxty831x7wNtPAos",
  authDomain: "studyflow-88bf2.firebaseapp.com",
  projectId: "studyflow-88bf2",
  storageBucket: "studyflow-88bf2.firebasestorage.app",
  messagingSenderId: "969906958754",
  appId: "1:969906958754:web:4d8e7ebcbf7f190e25c2fb",
  measurementId: "G-LNTXNN4XG3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
