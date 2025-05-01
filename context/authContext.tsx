import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib';
import { isAdmin } from '@/services/auth';

type User = {
  uid:string
  email:string
  token:string
  role:string
}
export interface AuthContextType {
  user: User;
  userRole: string | null;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: any) => void;
  setUserRole: (role: string | null) => void;
  setAdminSession: () => Promise<void>;
  signOut: () => Promise<boolean>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function useAuth  () {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
type AuthProviderProps = {
  children: React.ReactNode;

}

export const AuthProvider = ({ children }:Readonly<AuthProviderProps>) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored admin session on mount
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const adminSession = await AsyncStorage.getItem('adminSession');
        
        if (adminSession) {
          // If we have a stored admin session, restore it
          setUser({ uid: 'admin-user', email: 'admin@servicedeskapp.com' });
          setUserRole('admin');
        }
      } catch (error) {
        console.error("Error checking admin session:", error);
      }
      
      // Also listen for Firebase auth state changes (for regular users)
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser);
          // Check if the user is an admin
          const adminStatus = await isAdmin(firebaseUser.uid);
          setUserRole(adminStatus ? 'admin' : 'user');
        } else if (!await AsyncStorage.getItem('adminSession')) {
          // Only clear user if we don't have an admin session
          setUser(null);
          setUserRole(null);
        }
        
        setLoading(false);
      });
      
      return unsubscribe;
    };
    
    checkAdminSession();
  }, []);

  // Store the admin session
  const setAdminSession = async () => {
    try {
      await AsyncStorage.setItem('adminSession', 'true');
    } catch (error) {
      console.error("Error storing admin session:", error);
    }
  };

  // Clear the admin session
  const clearAdminSession = async () => {
    try {
      await AsyncStorage.removeItem('adminSession');
    } catch (error) {
      console.error("Error clearing admin session:", error);
    }
  };

  // Sign out function that handles both regular and admin users
  const signOut = async () => {
    try {
      // Clear admin session if it exists
      await clearAdminSession();
      
      // Sign out from Firebase Auth
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
      
      // Clear state
      setUser(null);
      setUserRole(null);
      
      return true;
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  // Provide the context value
  const value: AuthContextType = {
    user,
    userRole,
    isAdmin: userRole === 'admin',
    loading,
    setUser,
    setUserRole,
    setAdminSession,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
