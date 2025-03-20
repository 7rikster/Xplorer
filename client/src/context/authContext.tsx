"use client";

import { auth } from "@/lib/firebase/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthState = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
    });

    return () => checkAuthState();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

function useUser() {
  return useContext(AuthContext);
}

export { useUser };
