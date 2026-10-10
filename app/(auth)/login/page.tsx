'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'sonner';
import { BookOpen, ArrowRight, Lock, Mail } from 'lucide-react';

function LoginForm({ from }: { from: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchUser, user, setUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    if (user) {
      router.push(from);
    }
  }, [fetchUser, user, router, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/login', { email, password });
      toast.success('Welcome back! Logged in successfully.');
      await fetchUser();
      router.push(from);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = res.data;
        setUser({
          id: googleUser.sub,
          email: googleUser.email,
          name: googleUser.name,
          tenantId: 'default',
          role: 'student',
          category: 'A1',
        });
        toast.success(`Welcome back, ${googleUser.name}!`);
        router.push('/dashboard/student');
      } catch (err) {
        toast.error('Google Auth Failed');
      }
    },
    onError: () => toast.error('Google Sign-In Failed'),
  });

  return (
    <div className="min-h-screen bg-[var(--neutral-warm)] flex items-center justify-center px-[5vw] py-[10vh]">

      <div className="relative w-full max-w-[500px]">
        <div className="bg-white rounded-[24px] shadow-2xl border border-[var(--ceramic)] p-[8vw] md:p-[40px] space-y-[4vh]">

          <div className="text-center space-y-[1.5vh]">
            <Link href="/" className="inline-flex items-center gap-2 mb-[1vh]">
              <div className="w-[60px] h-[60px] rounded-[16px] bg-gradient-to-br from-[var(--starbucks-green)] to-[var(--green-accent)] flex items-center justify-center shadow-lg">
                <BookOpen className="w-[30px] h-[30px] text-white" />
              </div>
            </Link>
            <h1 className="h1-text text-[3.2rem] text-[var(--text-black)] mb-0">Welcome Back!</h1>
            <p className="body-text text-[var(--text-black-soft)]">Log in to continue your language journey on <span className="text-[var(--starbucks-green)] font-bold">BhashaSchool</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[3vh]" suppressHydrationWarning>
            <div>
              <label className="block text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[1vh] tracking-wider">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-[50px] pr-[15px] py-[2vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[1vh] tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-[50px] pr-[15px] py-[2vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-[2vh] !rounded-[12px] text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed mt-[1vh]"
            >
              {loading ? 'Logging in...' : <><span>Log In</span><ArrowRight className="w-6 h-6" /></>}
            </button>
          </form>

          <div className="flex items-center gap-[2vw] my-[3vh]">
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
            <span className="text-[1.2rem] text-[var(--text-black-soft)] font-bold uppercase tracking-widest">or continue with</span>
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-[3vw] md:gap-[15px] py-[1.8vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[1.6rem] font-bold text-[var(--text-black)] hover:bg-[var(--ceramic)] transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[24px] h-[24px]" />
            Continue with Google
          </button>

          <p className="text-center text-[1.5rem] text-[var(--text-black-soft)] pt-[1vh]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[var(--starbucks-green)] font-extrabold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-[1.3rem] text-[var(--text-black-soft)] mt-[4vh] font-medium">
          🔒 Your data is safe and encrypted with BhashaSchool
        </p>
      </div>
    </div>
  );
}

function LoginFormWrapper() {
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') || '/dashboard/whatsapp';
  return <LoginForm from={from} />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--neutral-warm)] flex items-center justify-center" />}>
      <LoginFormWrapper />
    </Suspense>
  );
}
