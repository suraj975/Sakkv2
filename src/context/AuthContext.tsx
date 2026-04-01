"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { FSUser } from "@/types/firebase";

interface AuthContextValue {
  user: User | null;
  profile: FSUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<FSUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    await signOut(auth);
    setProfile(null);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Fetch or auto-create Firestore user profile
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data() as FSUser);
        } else {
          // First login — create profile doc
          const newProfile: Omit<FSUser, "createdAt" | "updatedAt"> & {
            createdAt: ReturnType<typeof serverTimestamp>;
            updatedAt: ReturnType<typeof serverTimestamp>;
          } = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName ?? "Anonymous",
            email: firebaseUser.email ?? "",
            avatarUrl: firebaseUser.photoURL ?? undefined,
            isVerified: false,
            isTrustedSeller: false,
            totalSales: 0,
            totalPurchases: 0,
            rating: 0,
            reviewCount: 0,
            walletBalance: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(ref, newProfile);
          // Re-fetch to get server timestamps resolved
          const freshSnap = await getDoc(ref);
          setProfile(freshSnap.data() as FSUser);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
