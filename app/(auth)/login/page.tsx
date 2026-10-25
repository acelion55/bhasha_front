'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'sonner';
import { ArrowRight, Lock, Phone, Eye, EyeOff, Smartphone, ShieldCheck } from 'lucide-react';
import CompletePhoneModal from '@/components/complete-phone-modal';

function LoginForm({ from }: { from: string }) {
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('otp');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [googleRole, setGoogleRole] = useState<string | undefined>(undefined);
  const { fetchUser, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.phoneNumber) {
      router.push(from);
    }
  }, [user, router, from]);

  // OTP Timer
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
      .catch(() => {});

    return () => controller.abort();
  }, [otpSent]);

  const finishLogin = (role?: string) => {
    if (role === 'admin') router.push('/dashboard/admin');
    else if (role === 'mentor' || role === 'teacher') router.push('/dashboard/mentor');
    else router.push(from === '/dashboard' ? '/dashboard/student' : from);
  };

  const handleSendOtp = async () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; message: string; devOtp?: string }>(
        '/auth/otp/send',
        { phoneNumber: digits },
      );
      toast.success('OTP sent to your phone number');
      setOtpSent(true);
      setOtpTimer(300); // 5 minutes
      if (res.data?.devOtp) {
        setDevOtp(res.data.devOtp);
        toast.message('Development mode', { description: `OTP: ${res.data.devOtp}` });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!otp || otp.length !== 4) {
      toast.error('Please enter a 4-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/otp/verify-login', { phoneNumber: digits, otp });
      toast.success('Welcome back! Logged in successfully.');
      await fetchUser();
      router.push(from);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
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

          {/* Auth Method Tabs */}
          <div className="flex gap-[1vw] bg-[var(--neutral-warm)] p-[0.5vh] rounded-[12px] border border-[var(--ceramic)]">
            <button
              onClick={() => {
                setAuthMethod('password');
                setOtpSent(false);
              }}
              className={`flex-1 py-[1.2vh] px-[1vw] rounded-[10px] text-[1.6rem] md:text-[1.3rem] font-bold transition-all ${
                authMethod === 'password'
                  ? 'bg-white text-[var(--starbucks-green)] shadow-sm'
                  : 'text-[var(--text-black-soft)]'
              }`}
            >
              <Lock className="w-5 h-5 inline mr-1" />
              Password
            </button>
            <button
              onClick={() => {
                setAuthMethod('otp');
                setPassword('');
              }}
              className={`flex-1 py-[1.2vh] px-[1vw] rounded-[10px] text-[1.6rem] md:text-[1.3rem] font-bold transition-all ${
                authMethod === 'otp'
                  ? 'bg-white text-[var(--starbucks-green)] shadow-sm'
                  : 'text-[var(--text-black-soft)]'
              }`}
            >
              <Smartphone className="w-5 h-5 inline mr-1" />
              OTP
            </button>
          </div>

          {/* Password Login */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-[2.4vh]" suppressHydrationWarning>
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
                    className="w-full pl-[95px] pr-[15px] py-[1.7vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                    placeholder="Enter the number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[1.6rem] md:text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[0.8vh] tracking-wider">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
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
                className="w-full btn-primary py-[1.7vh] !rounded-[12px] text-[2rem] md:text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed mt-[0.5vh]"
              >
                {loading ? 'Logging in...' : <><span>Log In</span><ArrowRight className="w-6 h-6" /></>}
              </button>

              <div className="text-center">
                <Link href="/forgot-password" className="text-[1.6rem] md:text-[1.3rem] text-[var(--starbucks-green)] font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </form>
          )}

          {/* OTP Login */}
          {authMethod === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-[2.4vh]" suppressHydrationWarning>
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
                    disabled={otpSent}
                    className="w-full pl-[95px] pr-[15px] py-[1.7vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition disabled:opacity-50"
                    placeholder="Enter the number"
                  />
                </div>
              </div>

              {otpSent && (
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
                    className="w-full px-[15px] py-[1.7vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition text-center letter-spacing-[0.5rem]"
                    placeholder="0000"
                  />
                  <p className="text-[1.6rem] md:text-[1.2rem] text-[var(--text-black-soft)] mt-[1vh]">
                    OTP expires in: <span className="font-bold text-[var(--starbucks-green)]">{Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</span>
                  </p>
                  {devOtp && (
                    <p className="text-[1.2rem] text-[var(--gold)] mt-[0.5vh] font-bold">
                      Dev OTP: {devOtp}
                    </p>
                  )}
                </div>
              )}

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full btn-primary py-[1.7vh] !rounded-[12px] text-[2rem] md:text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : <><span>Send OTP</span><ArrowRight className="w-6 h-6" /></>}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 4}
                    className="w-full btn-primary py-[1.7vh] !rounded-[12px] text-[2rem] md:text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : <><span>Verify OTP</span><ArrowRight className="w-6 h-6" /></>}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setOtpTimer(0);
                      setDevOtp(null);
                    }}
                    className="w-full py-[1.7vh] rounded-[12px] border-2 border-[var(--ceramic)] text-[var(--starbucks-green)] font-bold text-[1.8rem] md:text-[1.6rem] hover:bg-[var(--green-light)] transition"
                  >
                    Change Phone
                  </button>
                </>
              )}
            </form>
          )}

          <div className="flex items-center gap-[2vw] my-[1.5vh]">
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
            <span className="text-[1.6rem] md:text-[1.2rem] text-[var(--text-black-soft)] font-bold uppercase tracking-widest">or continue with</span>
            <div className="h-px bg-[var(--ceramic)] flex-1"></div>
          </div>

          <button type="button" onClick={() => loginWithGoogle()} className="w-full flex items-center justify-center gap-[3vw] md:gap-[15px] py-[1.5vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[1.8rem] md:text-[1.6rem] font-bold text-[var(--text-black)] hover:bg-[var(--ceramic)] transition-all shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-[24px] h-[24px]" />
            Continue with Google
          </button>

          <p className="text-center text-[1.8rem] md:text-[1.5rem] text-[var(--text-black-soft)]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[var(--starbucks-green)] font-extrabold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="flex items-center justify-center gap-2 text-center text-[1.6rem] md:text-[1.3rem] text-[var(--text-black-soft)] mt-[2.5vh] font-medium">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" /> Your data is safe and encrypted with BhashaSchool
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
