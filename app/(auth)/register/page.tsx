'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { ArrowRight, User, Phone, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import CompletePhoneModal from '@/components/complete-phone-modal';

const perks = [
  'Free first lesson with a native tutor',
  'AI practice available 24/7',
  'CEFR certified curriculum',
  'Cancel anytime — no commitment',
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [googleRole, setGoogleRole] = useState<string | undefined>(undefined);
  const { fetchUser, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user && user.phoneNumber) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const finishSignup = (role?: string) => {
    if (role === 'admin') router.push('/dashboard/admin');
    else if (role === 'mentor') router.push('/dashboard/mentor');
    else router.push('/dashboard/student');
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
      await api.post('/auth/register', { name, phoneNumber: digits, password });
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
        const googleRes = await api.post<{ user?: { name?: string; role?: string; phoneNumber?: string } }>(
          '/auth/google',
          { accessToken: tokenResponse.access_token },
        );
        toast.success(`Welcome to BhashaSchool${googleRes.data.user?.name ? `, ${googleRes.data.user.name}` : ''}!`);
        await fetchUser();
        const role = googleRes.data.user?.role;
        if (!googleRes.data.user?.phoneNumber) {
          setGoogleRole(role);
          setShowPhonePrompt(true);
          return;
        }
        finishSignup(role);
      } catch {
        toast.error('Google Sign-In Failed');
      }
    },
    onError: () => toast.error('Google Sign-In Cancelled'),
  });

  return (
    <div className="min-h-[100dvh] bg-[var(--neutral-warm)] flex items-center justify-center px-[5vw] py-[3vh]">

      <div className="relative w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-[4vw] items-center">

        {/* Left panel — perks */}
        <div className="hidden md:block space-y-[2.5vh]">
          <div className="flex items-center gap-[15px]">
            <img
              src="/logos/logowithouttext.png"
              alt="BhashaSchool Logo"
              className="w-[56px] h-[56px] object-contain"
            />
            <span className="text-[2.8rem] font-extrabold text-[var(--house-green)]">
              Bhasha<span className="text-[var(--starbucks-green)]">School</span>
            </span>
          </div>

          <h2 className="display-text text-[3.2rem] text-[var(--text-black)] leading-snug">
            Start your <span className="text-[var(--starbucks-green)]">language journey</span> today.
          </h2>
          <p className="body-text text-[1.5rem] text-[var(--text-black-soft)] leading-relaxed">
            Join thousands of learners mastering German &amp; English with expert tutors and AI-powered tools.
          </p>

          <div className="space-y-[1.4vh]">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-[1vw] text-[1.4rem] font-medium text-[var(--text-black-soft)]">
                <CheckCircle className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
                {p}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[2vw] mt-[2vh]">
            <span className="px-[1vw] py-[0.4vh] rounded-[8px] bg-white border border-[var(--ceramic)] shadow-sm text-[1.3rem] font-bold tracking-wide">🇩🇪 Deutsch</span>
            <span className="px-[1vw] py-[0.4vh] rounded-[8px] bg-white border border-[var(--ceramic)] shadow-sm text-[1.3rem] font-bold tracking-wide">🇬🇧 English</span>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="bg-white rounded-[24px] shadow-2xl border border-[var(--ceramic)] p-[7vw] md:p-[34px] space-y-[2.5vh]">

          <div className="md:hidden text-center mb-[2.5vh]">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <img
                src="/logos/logowithouttext.png"
                alt="BhashaSchool Logo"
                className="w-[56px] h-[56px] object-contain"
              />
              <span className="font-extrabold text-[2.3rem] text-[var(--text-black)] pt-2">Bhasha<span className="text-[var(--starbucks-green)]">School</span></span>
            </Link>
          </div>



          <form onSubmit={handleSubmit} className="space-y-[2vh]">
            <div>
              <label className="block text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-[50px] pr-[15px] py-[1.5vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="Your full name"
                />
              </div>
            </div>

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
                  className="w-full pl-[95px] pr-[15px] py-[1.5vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
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
                  className="w-full pl-[50px] pr-[50px] py-[1.5vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                  placeholder="Min 4 characters"
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
              className="w-full btn-primary py-[1.5vh] !rounded-[12px] text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed mt-[0.5vh]"
            >
              {loading ? 'Creating...' : <><span>Create Account</span><ArrowRight className="w-6 h-6" /></>}
            </button>
          </form>

          <div className="flex items-center gap-[2vw] my-[1.5vh]">
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
            <span className="text-[1.2rem] text-[var(--text-black-soft)] font-bold uppercase tracking-widest">or sign up via</span>
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-[3vw] md:gap-[15px] py-[1.4vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[1.6rem] font-bold text-[var(--text-black)] hover:bg-[var(--ceramic)] transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[24px] h-[24px]" />
            Sign Up with Google
          </button>

          <p className="text-center text-[1.4rem] text-[var(--text-black-soft)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--starbucks-green)] font-extrabold hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-center text-[1.1rem] text-gray-400">
            By registering, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-emerald-600">Terms</Link>{' '}
            &amp;{' '}
            <Link href="/privacy-policy" className="underline hover:text-emerald-600">Privacy Policy</Link>
          </p>
        </div>
      </div>

      <CompletePhoneModal
        open={showPhonePrompt}
        onComplete={async () => {
          await fetchUser();
          setShowPhonePrompt(false);
          finishSignup(googleRole);
        }}
        onCancel={() => {
          setShowPhonePrompt(false);
          toast.error('A phone number is required to continue');
        }}
      />
    </div>
  );
}
