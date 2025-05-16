"use client";

import { auth } from "@/lib/firebase/firebaseConfig";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  id: string;
  firebaseId: string;
  email: string;
  userName: string;
  name: string;
  photoUrl: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseAuthLoading, setFirebaseAuthLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);

  async function getUser(email: string | null, token: string | null) {
    setUserLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/user/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data?.data || null);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
    setUserLoading(false);
  }

  useEffect(() => {
    setFirebaseAuthLoading(true);
    const checkAuthState = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const token = await authUser.getIdToken();
        getUser(authUser?.email, token);
      } else {
        setUser(null);
        setUserLoading(false);
      }

      setFirebaseAuthLoading(false);
    });

    return () => checkAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading: firebaseAuthLoading || userLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useUser must be used within an AuthProvider");
  }
  return context;
}

export { useUser };
