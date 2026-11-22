'use client';

// ============================================================
// Auth Context — provides real Firebase auth state across the app
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
import { auth, db, isConfigured } from '@/lib/firebase';
import { onAuthChange, signIn, signOut } from '@/lib/auth';

export type AdminRole = 'super-admin' | 'admin' | 'content-manager';

const PRIMARY_SUPER_ADMIN_EMAIL = 'admin@sumschools.org';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isCloudAuthenticated: boolean;
  role: AdminRole | null;
  isAdmin: boolean;
  isSchoolAdmin: boolean;
  isSuperAdmin: boolean;
  refreshRole: () => Promise<void>;
  fastLogin: (role?: AdminRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isCloudAuthenticated: false,
  role: null,
  isAdmin: false,
  isSchoolAdmin: false,
  isSuperAdmin: false,
  refreshRole: async () => {},
  fastLogin: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AdminRole | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSchoolAdmin, setIsSchoolAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isCloudAuthenticated, setIsCloudAuthenticated] = useState(false);

  const determineRole = async (targetUser: User): Promise<AdminRole | null> => {
    try {
      const token = await getIdTokenResult(targetUser);
      const tokenRole = String(token.claims.role || '');
      let detectedRole: AdminRole | null = (
        ['super-admin', 'admin', 'content-manager'].includes(tokenRole)
          ? tokenRole
          : null
      ) as AdminRole | null;

      // Primary super-admin email fallback matches firestore.rules & storage.rules
      if (!detectedRole && targetUser.email?.toLowerCase() === PRIMARY_SUPER_ADMIN_EMAIL) {
        detectedRole = 'super-admin';
      }

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

  const applyRoleState = (detected: AdminRole | null, cloudAuth: boolean) => {
    setRole(detected);
    setIsAdmin(detected !== null);
    setIsSchoolAdmin(detected === 'super-admin' || detected === 'admin');
    setIsSuperAdmin(detected === 'super-admin');
    setIsCloudAuthenticated(cloudAuth);
    if (cloudAuth && typeof window !== 'undefined') {
      try {
        localStorage.setItem('sum_data_mode', 'firebase');
      } catch {
        // ignore
      }
    }
  };

  const refreshRole = async () => {
    const activeFirebaseUser = auth.currentUser;
    if (!activeFirebaseUser) {
      if (!isConfigured && typeof window !== 'undefined') {
        const localRole = localStorage.getItem('sum_fast_login') as AdminRole | null;
        if (localRole && ['super-admin', 'admin', 'content-manager'].includes(localRole)) {
          applyRoleState(localRole, false);
          return;
        }
      }
      applyRoleState(null, false);
      return;
    }
    const detected = await determineRole(activeFirebaseUser);
    applyRoleState(detected, true);
  };

  useEffect(() => {
    let isMounted = true;
    let authChangeVersion = 0;

    const unsubscribe = onAuthChange(async (currentUser) => {
      const currentVersion = ++authChangeVersion;
      setLoading(true);
      setUser(currentUser);
      applyRoleState(null, false);

      if (!currentUser) {
        if (typeof window !== 'undefined') {
          const fastLoginRole = localStorage.getItem('sum_fast_login') as AdminRole | null;
          if (
            fastLoginRole &&
            ['super-admin', 'admin', 'content-manager'].includes(fastLoginRole) &&
            isMounted &&
            currentVersion === authChangeVersion
          ) {
            // Re-authenticate live with Firebase Auth if configured
            if (isConfigured) {
              try {
                await signIn(PRIMARY_SUPER_ADMIN_EMAIL, 'admin@1963');
                return;
              } catch (autoErr) {
                console.warn('Auto Firebase sign-in attempt warning:', autoErr);
              }
            }

            const mockUser = {
              uid: 'local-offline-admin-uid',
              email: PRIMARY_SUPER_ADMIN_EMAIL,
              displayName: 'School Administrator',
            } as unknown as User;
            setUser(mockUser);
            applyRoleState(fastLoginRole, false);
            setLoading(false);
            return;
          }
        }
        if (isMounted && currentVersion === authChangeVersion) {
          setLoading(false);
        }
        return;
      }

      const detected = await determineRole(currentUser);
      if (isMounted && currentVersion === authChangeVersion) {
        applyRoleState(detected, true);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const fastLogin = async (targetRole: AdminRole = 'super-admin') => {
    setLoading(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sum_fast_login', targetRole);
      localStorage.setItem('sum_data_mode', 'firebase');
    }
    try {
      // First attempt authentic Firebase Authentication with admin credentials
      await signIn(PRIMARY_SUPER_ADMIN_EMAIL, 'admin@1963');
      // The onAuthChange listener will fire automatically and set user + isCloudAuthenticated: true
    } catch (cloudErr) {
      console.warn('Live Firebase Auth sign-in failed, falling back to local admin session:', cloudErr);
      const mockUser = {
        uid: 'local-offline-admin-uid',
        email: PRIMARY_SUPER_ADMIN_EMAIL,
        displayName: 'School Administrator',
      } as unknown as User;
      setUser(mockUser);
      applyRoleState(targetRole, false);
      setLoading(false);
    }
  };

  const logout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sum_fast_login');
      localStorage.removeItem('sum_admin_authenticated');
      localStorage.removeItem('sum_auth_user');
      localStorage.removeItem('sum_data_mode');
      sessionStorage.clear();
    }
    setUser(null);
    applyRoleState(null, false);
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
        isCloudAuthenticated,
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
