import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8VJGP9f4Y__cvzhEuH4uI8ohzg6aIzx4",
  authDomain: "sakk-f314c.firebaseapp.com",
  projectId: "sakk-f314c",
  storageBucket: "sakk-f314c.firebasestorage.app",
  messagingSenderId: "1043224658504",
  appId: "1:1043224658504:web:59350cedad684980f38e7d",
  measurementId: "G-CZ6B6T0HJ1",
};

// Prevent re-initialization during hot-reload in Next.js dev mode
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
