// services/authService.js
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../FirebaseConfig';

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

// Custom authentication function that handles both regular Firebase Auth and admin auth
export const signIn = async (email: string, password: string) => {
  try {
    // Check if this is an admin login attempt
    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // This is an admin login
      // Check if admin exists in Firestore
      const adminRef = doc(db, "users", "admin-user");
      const adminDoc = await getDoc(adminRef);
      
      if (!adminDoc.exists()) {
        // Create admin document if it doesn't exist
        await setDoc(adminRef, {
          uid: "admin-user",
          email: "admin@servicedeskapp.com",
          role: "admin",
          name: "Administrator",
          createdAt: new Date()
        });
      }
      
      // Return admin user object (not a real Firebase Auth user)
      return {
        user: {
          uid: "admin-user",
          email: "admin@servicedeskapp.com",
        },
        role: "admin"
      };
    } else {
      // Regular user authentication with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role || "user" : "user";
      
      return {
        user,
        role
      };
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

// Function to check if a user is an admin
export const isAdmin = async (userId: string) => {
  if (userId === "admin-user") return true;
  
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    return userDoc.exists() && userDoc.data().role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};