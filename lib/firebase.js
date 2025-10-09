import { initializeApp } from “firebase/app”; import { getFirestore } from “firebase/firestore”; import { getAnalytics } from “firebase/analytics”;

const firebaseConfig = { apiKey: “AIzaSyA8NbEVcuJ6C9ZudFP73gveYh5QdOAC8l4”, authDomain: “qb-app-b3d8f.firebaseapp.com”, projectId: “qb-app-b3d8f”, storageBucket: “qb-app-b3d8f.firebasestorage.app”, messagingSenderId: “84500452909”, appId: “1:84500452909:web:7a9983b426361482008aa4”, measurementId: “G-L85M8GCBVP” };

const app = initializeApp(firebaseConfig); const analytics = getAnalytics(app); export const db = getFirestore(app); // Firestore ডাটাবেস export default app;
