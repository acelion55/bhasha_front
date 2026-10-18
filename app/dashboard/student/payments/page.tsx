'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import PayButton from '@/components/PayButton';
import {
  IndianRupee,
  CreditCard,
  Sparkles,
  BookOpen,
  GraduationCap,
  Shield,
  CheckCircle2,
  Clock,
  Zap,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

interface PlanOption {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  badge?: string;
  popular?: boolean;
}

const PLANS: PlanOption[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 999,
    duration: '1 Month',
    features: [
      'Access to all A1 & A2 classes',
      'Weekly live sessions',
      'Study materials included',
      'Community access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2499,
    duration: '3 Months',
    badge: 'Most Popular',
    popular: true,
    features: [
      'Access to all A1–B2 classes',
      'Daily live sessions',
      'Study materials & worksheets',
      '1-on-1 mentor sessions (2/month)',
      'Certificate of completion',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4999,
    duration: '6 Months',
    badge: 'Best Value',
    features: [
      'Access to all A1–C2 classes',
      'Unlimited live sessions',
      'Complete study package',
      '1-on-1 mentor sessions (4/month)',
      'Official certification',
      'Interview preparation',
      'Placement assistance',
      'Lifetime community access',
    ],
  },
];

export default function PaymentsPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [paymentHistory] = useState<any[]>([]);

  const handlePaymentSuccess = (result: any) => {
    toast.success(`Payment successful! Welcome to your new plan. 🎉`);
    console.log('[Payments] Success:', result);
  };

  const handlePaymentFailed = (result: any) => {
    toast.error('Payment failed. Please try again or contact support.');
    console.log('[Payments] Failed:', result);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 font-[Plus_Jakarta_Sans]">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNMCAyMGgyME0yMCAwdjIwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Payments & Plans</h1>
              <p className="text-emerald-100 text-sm sm:text-base font-medium">Choose a plan to unlock your language journey</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
              <Shield className="w-4 h-4" />
              <span>Secure UPI Payments</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
              <Zap className="w-4 h-4" />
              <span>Instant Activation</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Money-back Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`
                relative bg-white rounded-2xl sm:rounded-3xl border-2 p-5 sm:p-7 cursor-pointer
                transition-all duration-300 ease-out flex flex-col justify-between
                ${isSelected
                  ? 'border-emerald-500 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/20 scale-[1.02]'
                  : 'border-gray-100 hover:border-emerald-200 hover:shadow-lg'
                }
                ${plan.popular ? 'md:-mt-2 md:mb-2' : ''}
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`
                    px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md
                    ${plan.popular
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                      : 'bg-amber-400 text-amber-950'
                    }
                  `}>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="space-y-5">
                {/* Plan name + price */}
                <div className="pt-2">
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />
                    <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">
                      {plan.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">{plan.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-gray-700 font-medium">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pay button */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                {isSelected ? (
                  <PayButton
                    amount={plan.price}
                    description={`BhashaSchool ${plan.name} Plan — ${plan.duration}`}
                    courseName={plan.name}
                    customerName={user?.name}
                    customerEmail={user?.email}
                    variant="card"
                    onSuccess={handlePaymentSuccess}
                    onFailed={handlePaymentFailed}
                  />
                ) : (
                  <button
                    onClick={() => setSelectedPlan(plan.id)}
                    className="w-full py-3.5 sm:py-4 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-black text-base transition-all flex items-center justify-center gap-2"
                  >
                    <Star className="w-4 h-4 text-gray-400" />
                    Select Plan
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Section */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
        <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2.5 mb-4">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          How Payments Work
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-base font-black text-emerald-800">1</span>
            </div>
            <div>
              <p className="font-black text-sm text-gray-900">Select a Plan</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Choose the package that fits your learning goals</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-base font-black text-emerald-800">2</span>
            </div>
            <div>
              <p className="font-black text-sm text-gray-900">Pay via UPI</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Secure payment through GPay, PhonePe, Paytm, or any UPI app</p>
            </div>
          </div>
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <span className="text-base font-black text-emerald-800">3</span>
            </div>
            <div>
              <p className="font-black text-sm text-gray-900">Start Learning</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Instant access to classes, mentors, and study materials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment History (placeholder) */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
        <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2.5 mb-4">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Payment History
        </h3>

        {paymentHistory.length === 0 ? (
          <div className="text-center py-10 sm:py-14 space-y-3">
            <GraduationCap className="w-12 h-12 text-emerald-300 mx-auto" />
            <p className="text-base sm:text-lg font-bold text-gray-400">No payments yet</p>
            <p className="text-sm text-gray-400 font-medium max-w-md mx-auto">
              Select a plan above and make your first payment to start learning!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {paymentHistory.map((payment: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div>
                  <p className="font-black text-base text-gray-900">{payment.description}</p>
                  <p className="text-xs text-gray-500 font-medium">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-base text-gray-900 flex items-center gap-0.5">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {payment.amount?.toLocaleString('en-IN')}
                  </p>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                    payment.status === 'SUCCESS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
