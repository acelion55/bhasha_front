'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { ArrowRight, User, Phone, Lock, Eye, EyeOff, Smartphone, Languages } from 'lucide-react';
import CompletePhoneModal from '@/components/complete-phone-modal';

export default function RegisterPage() {
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');
  const [language, setLanguage] = useState('German');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);
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

  // OTP countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Capture OTP directly from the SMS notification (WebOTP / browser autofill)
  useEffect(() => {
    if (!otpSent || typeof window === 'undefined') return;
    const nav = navigator as any;
    if (!('OTPCredential' in window) || !nav.credentials?.get) return;

    const controller = new AbortController();
    nav.credentials
      .get({ otp: { transport: ['sms'] }, signal: controller.signal })
      .then((credential: any) => {
        const code = credential?.code;
        if (code) setOtp(String(code).replace(/\D/g, '').slice(0, 4));
      })
      .catch(() => { });

    return () => controller.abort();
  }, [otpSent]);

  const finishSignup = (role?: string) => {
    if (role === 'admin') router.push('/dashboard/admin');
    else if (role === 'mentor' || role === 'teacher') router.push('/dashboard/mentor');
    else router.push('/dashboard/student');
  };

  const sendOtp = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; message: string; devOtp?: string }>(
        '/auth/otp/send',
        { phoneNumber: digits },
      );
      toast.success('OTP sent to your phone number');
      setOtpSent(true);
      setOtpTimer(300);
      if (res.data?.devOtp) {
        setDevOtp(res.data.devOtp);
        toast.message('Development mode', { description: `OTP: ${res.data.devOtp}` });
      }
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      await sendOtp();
      return;
    }
    if (otp.length !== 4) {
      toast.error('Please enter the 4-digit OTP');
      return;
    }
    const digits = phone.replace(/\D/g, '');
    setLoading(true);
    try {
      await api.post('/auth/otp/register', { name, phoneNumber: digits, otp, language });
      toast.success('Account created! Welcome to BhashaSchool');
      await fetchUser();
      router.push('/dashboard/student');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, phoneNumber: digits, password, language });
      toast.success('Account created! Welcome to BhashaSchool');
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
          { accessToken: tokenResponse.access_token, language },
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

      <div className="relative w-full max-w-[520px]">

        {/* Form panel */}
        <div className="bg-white rounded-[24px] shadow-2xl border border-[var(--ceramic)] p-[7vw] md:p-[34px] space-y-[2.5vh]">

          <div className="text-center mb-[2.5vh]">
            <Link href="/" className="inline-flex flex-col items-center gap-2">
              <img
                src="/logos/logowithouttext.png"
                alt="BhashaSchool Logo"
                className="w-[56px] h-[56px] object-contain"
              />
              <span className="font-extrabold text-[2.3rem] text-[var(--text-black)] pt-2">Bhasha<span className="text-[var(--starbucks-green)]">School</span></span>
            </Link>
          </div>

          {/* Course Language Tabs */}
          <div>
            <label className="flex items-center gap-2 text-[1.6rem] md:text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">
              <Languages className="w-4 h-4 text-[var(--starbucks-green)]" /> Choose your course
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['English', 'German', 'Spanish'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`py-[1.1vh] rounded-[10px] border text-[1.5rem] md:text-[1.3rem] font-bold transition-all ${
                    language === lang
                      ? 'bg-[var(--starbucks-green)] border-[var(--starbucks-green)] text-white shadow-sm'
                      : 'bg-[var(--neutral-warm)] border-[var(--ceramic)] text-[var(--text-black-soft)] hover:border-[var(--green-accent)]'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex gap-[1vw] bg-[var(--neutral-warm)] p-[0.5vh] rounded-[12px] border border-[var(--ceramic)]">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setPassword('');
              }}
              className={`flex-1 py-[1.2vh] px-[1vw] rounded-[10px] text-[1.5rem] md:text-[1.3rem] font-bold transition-all flex items-center justify-center gap-1 ${authMethod === 'otp'
                ? 'bg-white text-[var(--starbucks-green)] shadow-sm'
                : 'text-[var(--text-black-soft)]'
                }`}
            >
              <Smartphone className="w-5 h-5" />
              OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setOtpSent(false);
                setOtp('');
                setOtpTimer(0);
                setDevOtp(null);
              }}
              className={`flex-1 py-[1.2vh] px-[1vw] rounded-[10px] text-[1.5rem] md:text-[1.3rem] font-bold transition-all flex items-center justify-center gap-1 ${authMethod === 'password'
                ? 'bg-white text-[var(--starbucks-green)] shadow-sm'
                : 'text-[var(--text-black-soft)]'
                }`}
            >
              <Lock className="w-5 h-5" />
              Password
            </button>
          </div>

          <form
            onSubmit={authMethod === 'otp' ? handleOtpSubmit : handlePasswordSubmit}
            className="space-y-[2vh]"
          >
            <div>
              <label className="block text-[1.6rem] md:text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Full Name</label>
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
              <label className="block text-[1.6rem] md:text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Phone Number</label>
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
                  disabled={authMethod === 'otp' && otpSent}
                  className="w-full pl-[95px] pr-[15px] py-[1.5vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition disabled:opacity-50"
                  placeholder="Enter the number"
                />
              </div>
            </div>

            {authMethod === 'otp' && otpSent && (
              <div>
                <label className="block text-[1.6rem] md:text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full px-[15px] py-[1.5vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition text-center tracking-[0.5rem]"
                  placeholder="0000"
                />
                <p className="text-[1.2rem] text-[var(--text-black-soft)] mt-[1vh]">
                  OTP expires in: <span className="font-bold text-[var(--starbucks-green)]">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</span>
                </p>
                {devOtp && (
                  <p className="text-[1.2rem] text-[var(--gold)] mt-[0.5vh] font-bold">Dev OTP: {devOtp}</p>
                )}
              </div>
            )}

            {authMethod === 'password' && (
              <div>
                <label className="block text-[1.6rem] md:text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Password</label>
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
            )}

            {authMethod === 'otp' ? (
              <>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-[1.5vh] !rounded-[12px] text-[2rem] md:text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed mt-[0.5vh]"
                >
                  {loading ? (
                    otpSent ? 'Creating...' : 'Sending OTP...'
                  ) : otpSent ? (
                    <><span>Verify &amp; Create Account</span><ArrowRight className="w-6 h-6" /></>
                  ) : (
                    <><span>Send OTP</span><ArrowRight className="w-6 h-6" /></>
                  )}
                </button>
                {otpSent && (
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setOtpTimer(0);
                      setDevOtp(null);
                    }}
                    className="w-full py-[1.5vh] rounded-[12px] border-2 border-[var(--ceramic)] text-[var(--starbucks-green)] font-bold text-[1.6rem] hover:bg-[var(--green-light)] transition"
                  >
                    Change Phone
                  </button>
                )}
              </>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-[1.5vh] !rounded-[12px] text-[2rem] md:text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed mt-[0.5vh]"
              >
                {loading ? 'Creating...' : <><span>Create Account</span><ArrowRight className="w-6 h-6" /></>}
              </button>
            )}
          </form>

          <div className="flex items-center gap-[2vw] my-[1.5vh]">
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
            <span className="text-[1.6rem] md:text-[1.2rem] text-[var(--text-black-soft)] font-bold uppercase tracking-widest">or sign up via</span>
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-[3vw] md:gap-[15px] py-[1.4vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[1.8rem] md:text-[1.6rem] font-bold text-[var(--text-black)] hover:bg-[var(--ceramic)] transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[24px] h-[24px]" />
            Sign Up with Google
          </button>

          <p className="text-center text-[1.8rem] md:text-[1.4rem] text-[var(--text-black-soft)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--starbucks-green)] font-extrabold hover:underline">
              Log in
            </Link>
          </p>

          <p className="text-center text-[1.4rem] md:text-[1.1rem] text-gray-400">
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
