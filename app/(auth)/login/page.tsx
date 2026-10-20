'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { ArrowRight, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import CompletePhoneModal from '@/components/complete-phone-modal';

function LoginForm({ from }: { from: string }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [googleRole, setGoogleRole] = useState<string | undefined>(undefined);
  const { fetchUser, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.phoneNumber) {
      router.push(from);
    }
  }, [user, router, from]);

  const finishLogin = (role?: string) => {
    if (role === 'admin') router.push('/dashboard/admin');
    else if (role === 'mentor') router.push('/dashboard/mentor');
    else router.push(from === '/dashboard' ? '/dashboard/student' : from);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/login', { phoneNumber: digits, password });
      toast.success('Welcome back! Logged in successfully.');
      await fetchUser();
      router.push(from);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        const googleRes = await api.post<{ user?: { name?: string; role?: string; phoneNumber?: string } }>(
          '/auth/google',
          { accessToken: tokenResponse.access_token },
        );
        toast.success(`Welcome back${googleRes.data.user?.name ? `, ${googleRes.data.user.name}` : ''}!`);
        await fetchUser();
        const role = googleRes.data.user?.role;
        if (!googleRes.data.user?.phoneNumber) {
          setGoogleRole(role);
          setShowPhonePrompt(true);
          return;
        }
        finishLogin(role);
      } catch {
        toast.error('Google Auth Failed');
      }
    },
    onError: () => toast.error('Google Sign-In Failed'),
  });

  return (
    <div className="min-h-[100dvh] bg-[var(--neutral-warm)] flex items-center justify-center px-[5vw] py-[4vh]">
      <div className="relative w-full max-w-[460px]">
        <div className="bg-white rounded-[24px] shadow-2xl border border-[var(--ceramic)] p-[7vw] md:p-[36px] space-y-[3vh]">

          <div className="text-center space-y-[1vh]">
            <Link href="/" className="inline-flex items-center justify-center mb-[0.5vh]">
              <img
                src="/logos/logowithouttext.png"
                alt="BhashaSchool Logo"
                className="w-[64px] h-[64px] object-contain"
              />
            </Link>
            <h1 className="h1-text text-[2.8rem] text-[var(--text-black)] mb-0">Welcome Back!</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[2.4vh]" suppressHydrationWarning>
            <div>
              <label className="block text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
                <span className="absolute left-[50px] text-[var(--text-black-soft)] font-bold text-[1.6rem]">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-[95px] pr-[15px] py-[1.7vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="Enter the number"
                />
              </div>
            </div>

            <div>
              <label className="block text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  maxLength={4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-[50px] pr-[50px] py-[1.7vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-[12px] p-1 text-[var(--text-black-soft)] hover:text-[var(--starbucks-green)] transition"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-[1.7vh] !rounded-[12px] text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed mt-[0.5vh]"
            >
              {loading ? 'Logging in...' : <><span>Log In</span><ArrowRight className="w-6 h-6" /></>}
            </button>
          </form>

          <div className="flex items-center gap-[2vw] my-[1.5vh]">
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
            <span className="text-[1.2rem] text-[var(--text-black-soft)] font-bold uppercase tracking-widest">or continue with</span>
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-[3vw] md:gap-[15px] py-[1.5vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[1.6rem] font-bold text-[var(--text-black)] hover:bg-[var(--ceramic)] transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[24px] h-[24px]" />
            Continue with Google
          </button>

          <p className="text-center text-[1.5rem] text-[var(--text-black-soft)]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[var(--starbucks-green)] font-extrabold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-[1.3rem] text-[var(--text-black-soft)] mt-[2.5vh] font-medium">
          🔒 Your data is safe and encrypted with BhashaSchool
        </p>
      </div>

      <CompletePhoneModal
        open={showPhonePrompt}
        onComplete={async () => {
          await fetchUser();
          setShowPhonePrompt(false);
          finishLogin(googleRole);
        }}
        onCancel={() => {
          setShowPhonePrompt(false);
          toast.error('A phone number is required to continue');
        }}
      />
    </div>
  );
}

function LoginFormWrapper() {
  const searchParams = useSearchParams();
  const from = searchParams?.get('from') || '/dashboard';
  return <LoginForm from={from} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[100dvh] bg-[var(--neutral-warm)] flex flex-col items-center justify-center gap-4">
          <img
            src="/logos/logowithouttext.png"
            alt="BhashaSchool Logo"
            className="w-[72px] h-[72px] object-contain animate-pulse"
          />
          <p className="body-text font-bold text-[var(--starbucks-green)]">Loading BhashaSchool...</p>
        </div>
      }
    >
      <LoginFormWrapper />
    </Suspense>
  );
}
