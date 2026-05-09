import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFkI3Y0zER6Rk32p6Pz4jzgktYvHYu6jI",
  authDomain: "youtune-42175.firebaseapp.com",
  projectId: "youtune-42175",
  storageBucket: "youtune-42175.firebasestorage.app",
  messagingSenderId: "935716888266",
  appId: "1:935716888266:web:f6bf4b69c4b9b13bc7de33",
  measurementId: "G-1ZJTWJ4FMZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
