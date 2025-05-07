import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, usersCollection } from '@/lib';
import { getDocs, query, where, setDoc, doc } from 'firebase/firestore';

type UserRole = 'admin' | 'user';

export type User = {
  uid: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData) as User;
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error retrieving stored user data:", error);
      }

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const q = query(usersCollection, where("uid", "==", firebaseUser.uid));
            const querySnapshot = await getDocs(q);
            
            let userRole: UserRole = 'user';
            let userData: User;

            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0].data();
              if (userDoc.role === 'admin' || userDoc.role === 'user') {
                userRole = userDoc.role;
              }
              userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? '',
                role: userRole,
                createdAt: firebaseUser.metadata.creationTime,
              };
            } else {
              // Create a new user document with default role 'user'
              userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? '',
                role: 'user',
                createdAt: firebaseUser.metadata.creationTime,
              };
              await setDoc(doc(usersCollection, firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email ?? '',
                role: 'user',
                createdAt: firebaseUser.metadata.creationTime,
              });
            }
            
            setUser(userData);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
          } catch (error) {
            console.error("Error fetching or creating user role:", error);
            // Fallback: Allow sign-in with default role
            const userData: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? '',
              role: 'user',
              createdAt: firebaseUser.metadata.creationTime,
            };
            setUser(userData);
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
          }
        } else {
          setUser(null);
          await AsyncStorage.removeItem('userData');
        }
        
        setLoading(false);
      });
      
      return unsubscribe;
    };
    
    checkAuth();
  }, []);

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem('userData');
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const value: AuthContextType = useMemo(() => ({
    user,
    isAdmin: user?.role === 'admin',
    loading,
    setUser,
    signOut,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};