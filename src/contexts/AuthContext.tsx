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
import { onAuthChange, signOut } from '@/lib/auth';

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
  fastLogin: (role?: AdminRole) => void;
  logout: () => Promise<void>;
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
  fastLogin: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const fastLogin = localStorage.getItem('sum_fast_login') || localStorage.getItem('sum_admin_authenticated');
      if (fastLogin) {
        return {
          uid: 'fast-login-admin-uid',
          email: 'admin@sumschools.org',
          displayName: 'School Administrator (Fast Access)',
        } as unknown as User;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const fastLogin = localStorage.getItem('sum_fast_login') || localStorage.getItem('sum_admin_authenticated');
      if (fastLogin) return false;
    }
    return true;
  });
  const [role, setRole] = useState<AdminRole | null>(() => {
    if (typeof window !== 'undefined') {
      const fastLogin = localStorage.getItem('sum_fast_login');
      if (fastLogin === 'super-admin' || fastLogin === 'admin' || fastLogin === 'content-manager') {
        return fastLogin as AdminRole;
      }
      if (localStorage.getItem('sum_admin_authenticated') === 'true') {
        return 'super-admin';
      }
    }
    return null;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!(localStorage.getItem('sum_fast_login') || localStorage.getItem('sum_admin_authenticated') === 'true');
    }
    return false;
  });
  const [isSchoolAdmin, setIsSchoolAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!(localStorage.getItem('sum_fast_login') || localStorage.getItem('sum_admin_authenticated') === 'true');
    }
    return false;
  });
  const [isSuperAdmin, setIsSuperAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sum_fast_login') === 'super-admin' || localStorage.getItem('sum_admin_authenticated') === 'true';
    }
    return false;
  });

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
      if (typeof window !== 'undefined') {
        const fastLogin = localStorage.getItem('sum_fast_login') || localStorage.getItem('sum_admin_authenticated');
        if (fastLogin) {
          const fastRole = (localStorage.getItem('sum_fast_login') as AdminRole) || 'super-admin';
          setRole(fastRole);
          setIsAdmin(true);
          setIsSchoolAdmin(true);
          setIsSuperAdmin(fastRole === 'super-admin');
          return;
        }
      }
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
        if (typeof window !== 'undefined') {
          const fastLogin = localStorage.getItem('sum_fast_login') || localStorage.getItem('sum_admin_authenticated');
          if (fastLogin && isMounted && currentVersion === authChangeVersion) {
            const fastRole = (localStorage.getItem('sum_fast_login') as AdminRole) || 'super-admin';
            const mockUser = {
              uid: 'fast-login-admin-uid',
              email: 'admin@sumschools.org',
              displayName: 'School Administrator (Fast Access)',
            } as unknown as User;
            setUser(mockUser);
            setRole(fastRole);
            setIsAdmin(true);
            setIsSchoolAdmin(true);
            setIsSuperAdmin(fastRole === 'super-admin');
            setLoading(false);
            return;
          }
        }
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


  const fastLogin = (targetRole: AdminRole = 'super-admin') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sum_fast_login', targetRole);
      localStorage.setItem('sum_admin_authenticated', 'true');
    }
    const mockUser = {
      uid: 'fast-login-admin-uid',
      email: 'admin@sumschools.org',
      displayName: 'School Administrator (Fast Access)',
    } as unknown as User;
    setUser(mockUser);
    setRole(targetRole);
    setIsAdmin(true);
    setIsSchoolAdmin(true);
    setIsSuperAdmin(targetRole === 'super-admin');
    setLoading(false);
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sum_fast_login');
      localStorage.removeItem('sum_admin_authenticated');
    }
    setUser(null);
    setRole(null);
    setIsAdmin(false);
    setIsSchoolAdmin(false);
    setIsSuperAdmin(false);
    try {
      await signOut();
    } catch {
      // ignore
    }
  };

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
        fastLogin,
        logout,
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
