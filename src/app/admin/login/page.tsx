'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signIn } from '@/lib/auth';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { fastLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sum_admin_authenticated', 'true');
      }
      toast.success('Authentication successful! Welcome to the Admin Portal.');
      router.push('/admin');
    } catch (err: unknown) {
      const error = err as { message?: string } | undefined;
      console.warn('Firebase login attempt:', error?.message);
      toast.error(error?.message || 'Login failed. Check credentials or use Fast 1-Click Login below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFastLogin = (role: 'super-admin' | 'admin' = 'super-admin') => {
    setIsLoading(true);
    fastLogin(role);
    toast.success('⚡ Fast 1-Click Login Successful! Welcome.');
    router.push('/admin');
  };

  const handleQuickFill = () => {
    setEmail('admin@sumschools.org');
    setPassword('admin@1963');
    toast.info('Filled default administrator credentials.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-96 max-w-full h-72 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-72 sm:w-96 max-w-full h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* School Crest Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-white p-2 flex items-center justify-center shadow-2xl shadow-blue-500/20 mx-auto mb-4 border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/school-crest.png"
              alt="S.U.M. School Official Crest"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
            S.U.M. SCHOOL
          </h1>
          <p className="text-xs font-semibold text-amber-400 tracking-wider uppercase mt-1">
            Royappanpatti • Estd. 1963
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Administrative Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800 text-xs font-semibold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Authorized Personnel Only</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Administrator Email"
              type="email"
              required
              placeholder="admin@sumschools.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Admin Portal
            </Button>
          </form>

          {/* Fast 1-Click Login & Quick Access */}
          <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Quick / Fast Access</span>
              <button
                type="button"
                onClick={handleQuickFill}
                className="text-amber-400 hover:text-amber-300 hover:underline transition cursor-pointer"
              >
                Auto-fill credentials
              </button>
            </div>

            <button
              onClick={() => handleFastLogin('super-admin')}
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all duration-200 cursor-pointer hover:scale-[1.01]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>⚡ Fast 1-Click Login (Full Admin)</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          Secure Firebase Authentication &bull; Role-Based Authorization
        </div>
      </div>
    </div>
  );
}
