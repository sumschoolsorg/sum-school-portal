'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Cloud, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { signIn } from '@/lib/auth';
import { isConfigured } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdmin, loading, fastLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // If already authenticated as admin, redirect straight to /admin
  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace('/admin');
    }
  }, [loading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      toast.error('Please enter your administrator email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(cleanEmail, password);
      toast.success('Signed in to Firebase Cloud! Welcome to the Admin Portal.');
      router.push('/admin');
    } catch (err: unknown) {
      const error = err as { message?: string } | undefined;
      const msg = error?.message || 'Invalid email or password. Please verify your Firebase Auth credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflinePreviewLogin = () => {
    if (isConfigured) return;
    setIsLoading(true);
    fastLogin('super-admin');
    toast.success('Entered offline local preview mode.');
    router.push('/admin');
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
          <div className="flex items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-800 text-xs font-semibold">
            <span className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              Authorized Personnel Only
            </span>
            {isConfigured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px]">
                <Cloud className="w-3 h-3" />
                Firebase Live
              </span>
            )}
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">{errorMessage}</p>
                <p className="text-[11px] text-rose-300/80">
                  Ensure this email/password exists in Firebase Console &rarr; Authentication &rarr; Users so Cloud Firestore &amp; Storage saves are authorized.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Administrator Email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@sumschools.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[34px] p-1 text-slate-400 hover:text-slate-200 transition cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

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

          {!isConfigured && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleOfflinePreviewLogin}
                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Continue in Local Offline Preview (No Firebase Config)
              </Button>
            </div>
          )}
        </div>

        <div className="text-center mt-6 text-xs text-slate-500">
          Secure Firebase Authentication &bull; Live Cloud Firestore &amp; Storage Sync
        </div>
      </div>
    </div>
  );
}
