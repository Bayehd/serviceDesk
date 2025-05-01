import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD1-g61TNrK0H7KjdhvQj6k3Rxr_1uhnAY",
  authDomain: "servicedesk-10957.firebaseapp.com",
  projectId: "servicedesk-10957",
  storageBucket: "servicedesk-10957.firebasestorage.app",
  messagingSenderId: "905706685008",
  appId: "1:905706685008:web:b7007d69ed9faeb16d8755",
  measurementId: "G-N9LF18TDV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
const auth = getAuth(app);
const db = getFirestore(app);
const usersCollection = collection(db, "users");

export { app, auth, db, usersCollection };
