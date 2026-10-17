'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { BookOpen, ArrowRight, User, Mail, Lock, CheckCircle } from 'lucide-react';

const perks = [
  'Free first lesson with a native tutor',
  'AI practice available 24/7',
  'CEFR certified curriculum',
  'Cancel anytime — no commitment',
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { fetchUser, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    if (user) {
        router.push('/dashboard');
    }
  }, [fetchUser, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Account created! Welcome to BhashaSchool 🎓');
      await fetchUser();
      router.push('/dashboard/student');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    scope: 'openid email profile',
    onSuccess: async (tokenResponse) => {
      try {
        const googleRes = await api.post<{ user?: { name?: string; role?: string } }>(
          '/auth/google',
          { accessToken: tokenResponse.access_token },
        );
        toast.success(`Welcome to BhashaSchool${googleRes.data.user?.name ? `, ${googleRes.data.user.name}` : ''}!`);
        await fetchUser();
        const role = googleRes.data.user?.role;
        if (role === 'admin') router.push('/dashboard/admin');
        else if (role === 'mentor') router.push('/dashboard/mentor');
        else router.push('/dashboard/student');
      } catch {
        toast.error('Google Sign-In Failed');
      }
    },
    onError: () => toast.error('Google Sign-In Cancelled'),
  });

  return (
    <div className="min-h-screen bg-[var(--neutral-warm)] flex items-center justify-center px-[5vw] py-[8vh]">

      <div className="relative w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-[4vw] items-center">

        {/* Left panel — perks */}
        <div className="hidden md:block space-y-[4vh]">
          <div className="flex items-center gap-[15px]">
            <div className="w-[60px] h-[60px] rounded-[16px] bg-gradient-to-br from-[var(--starbucks-green)] to-[var(--green-accent)] flex items-center justify-center shadow-lg">
              <BookOpen className="w-[30px] h-[30px] text-white" />
            </div>
            <span className="text-[3rem] font-extrabold text-[var(--house-green)]">
              Bhasha<span className="text-[var(--starbucks-green)]">School</span>
            </span>
          </div>

          <h2 className="display-text text-[4rem] text-[var(--text-black)] leading-snug">
            Start your <span className="text-[var(--starbucks-green)]">language journey</span> today.
          </h2>
          <p className="body-text text-[1.8rem] text-[var(--text-black-soft)] leading-relaxed">
            Join thousands of learners mastering German &amp; English with expert tutors and AI-powered tools.
          </p>

          <div className="space-y-[2vh]">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-[1vw] text-[1.6rem] font-medium text-[var(--text-black-soft)]">
                <CheckCircle className="w-6 h-6 text-[var(--starbucks-green)] flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[2vw] mt-[4vh]">
            <span className="px-[1vw] py-[0.5vh] rounded-[8px] bg-white border border-[var(--ceramic)] shadow-sm text-[1.4rem] font-bold tracking-wide">🇩🇪 Deutsch</span>
            <span className="px-[1vw] py-[0.5vh] rounded-[8px] bg-white border border-[var(--ceramic)] shadow-sm text-[1.4rem] font-bold tracking-wide">🇬🇧 English</span>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="bg-white rounded-[24px] shadow-2xl border border-[var(--ceramic)] p-[8vw] md:p-[40px] space-y-[4vh]">
          
          <div className="md:hidden text-center mb-[4vh]">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <div className="w-[60px] h-[60px] rounded-[16px] bg-gradient-to-br from-[var(--starbucks-green)] to-[var(--green-accent)] flex items-center justify-center shadow">
                <BookOpen className="w-[30px] h-[30px] text-white" />
              </div>
              <span className="font-extrabold text-[2.5rem] text-[var(--text-black)] pt-2">Bhasha<span className="text-[var(--starbucks-green)]">School</span></span>
            </Link>
          </div>

          <div className="text-center space-y-[1vh]">
            <h1 className="h1-text text-[3rem] text-[var(--text-black)]">Create Your Account</h1>
            <p className="body-text text-[var(--text-black-soft)]">Free forever · No credit card needed</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[2.5vh]">
            <div>
              <label className="block text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[1vh] tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-[50px] pr-[15px] py-[2vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="Your full name"
                />
              </div>
            </div>

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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-[50px] pr-[15px] py-[2vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-[2vh] !rounded-[12px] text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed mt-[1vh]"
            >
              {loading ? 'Creating...' : <><span>Create Account</span><ArrowRight className="w-6 h-6" /></>}
            </button>
          </form>

          <div className="flex items-center gap-[2vw] my-[3vh]">
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
            <span className="text-[1.2rem] text-[var(--text-black-soft)] font-bold uppercase tracking-widest">or sign up via</span>
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-[3vw] md:gap-[15px] py-[1.8vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[1.6rem] font-bold text-[var(--text-black)] hover:bg-[var(--ceramic)] transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[24px] h-[24px]" />
            Sign Up with Google
          </button>

          <p className="text-center text-[1.4rem] text-[var(--text-black-soft)] mt-[3vh]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--starbucks-green)] font-extrabold hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-center text-[1.1rem] text-gray-400 mt-[2vh]">
            By registering, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-emerald-600">Terms</Link>{' '}
            &amp;{' '}
            <Link href="/privacy-policy" className="underline hover:text-emerald-600">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
