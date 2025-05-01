import { auth, db } from "@/lib";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export async function signIn(email: string, password: string) {
    try {
        console.log(`Attempting to sign in with: ${email}`);

        if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            console.log("Admin login detected");

            const adminRef = doc(db, "users", "admin-user");
            const adminDoc = await getDoc(adminRef);

            /*if (!adminDoc.exists()) {
        console.log("Creating admin document in Firestore");
        await setDoc(adminRef, {
          uid: "admin-user",
          email: "admin@servicedeskapp.com",
          role: "admin",
          name: "Administrator",
          createdAt: new Date()
        });
      }

      return {
        user: {
          uid: "admin-user",
          email: "admin@servicedeskapp.com",
        },
        role: "admin"
      };*/
        } else {
            console.log("Attempting Firebase authentication");
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            );
            const user = userCredential.user;

            console.log(`User authenticated: ${user.email} (${user.uid})`);

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.log("Creating new user document in Firestore");
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    role: "user",
                    createdAt: new Date(),
                });

                return {
                    user,
                    role: "user",
                };
            }

            const userData = userDoc.data();
            console.log(`User role from Firestore: ${userData.role || "user"}`);

            return {
                user,
                role: userData.role || "user",
            };
        }
    } catch (error) {
   
        throw error;
    }
}

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
