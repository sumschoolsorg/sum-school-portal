'use client';

// ============================================================
// Auth Context — provides auth state across the application
// ============================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getIdTokenResult, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { onAuthChange } from '@/lib/auth';

export type AdminRole = 'super-admin' | 'admin' | 'content-manager';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: AdminRole | null;
  isAdmin: boolean;
  isSchoolAdmin: boolean;
  isSuperAdmin: boolean;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  role: null,
  isAdmin: false,
  isSchoolAdmin: false,
  isSuperAdmin: false,
  refreshRole: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSchoolAdmin, setIsSchoolAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const determineRole = async (targetUser: User): Promise<AdminRole | null> => {
    try {
      const token = await getIdTokenResult(targetUser);
      const tokenRole = String(token.claims.role);
      let detectedRole: AdminRole | null = (
        ['super-admin', 'admin', 'content-manager'].includes(tokenRole)
          ? tokenRole
          : null
      ) as AdminRole | null;

      if (isConfigured) {
        try {
          const roleDoc = await getDoc(doc(db, 'adminUsers', targetUser.uid));
          if (roleDoc.exists()) {
            const roleData = roleDoc.data();
            if (
              roleData?.status === 'active' &&
              ['super-admin', 'admin', 'content-manager'].includes(String(roleData.role))
            ) {
              detectedRole = roleData.role as AdminRole;
            } else {
              detectedRole = null;
            }
          }
        } catch (docErr) {
          console.warn('Firestore adminUsers lookup warning:', docErr);
        }
      }
      return detectedRole;
    } catch (err) {
      console.error('Error verifying administrator role:', err);
      return null;
    }
  };

  const refreshRole = async () => {
    if (!user) {
      setRole(null);
      setIsAdmin(false);
      setIsSchoolAdmin(false);
      setIsSuperAdmin(false);
      return;
    }
    const detected = await determineRole(user);
    setRole(detected);
    setIsAdmin(detected !== null);
    setIsSchoolAdmin(detected === 'super-admin' || detected === 'admin');
    setIsSuperAdmin(detected === 'super-admin');
  };

  useEffect(() => {
    let isMounted = true;
    let authChangeVersion = 0;
    const unsubscribe = onAuthChange(async (currentUser) => {
      const currentVersion = ++authChangeVersion;
      setLoading(true);
      setUser(currentUser);
      setRole(null);
      setIsAdmin(false);
      setIsSchoolAdmin(false);
      setIsSuperAdmin(false);

      if (!currentUser) {
        if (isMounted && currentVersion === authChangeVersion) setLoading(false);
        return;
      }

      const detected = await determineRole(currentUser);
      if (isMounted && currentVersion === authChangeVersion) {
        setRole(detected);
        setIsAdmin(detected !== null);
        setIsSchoolAdmin(detected === 'super-admin' || detected === 'admin');
        setIsSuperAdmin(detected === 'super-admin');
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role,
        isAdmin,
        isSchoolAdmin,
        isSuperAdmin,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
