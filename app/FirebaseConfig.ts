import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth ( FIREBASE_APP);
export const FIRESTORE_DB = getFirestore( FIREBASE_APP);

