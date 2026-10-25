'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
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
  Loader2,
  RefreshCw,
  CalendarDays,
  Languages,
} from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  language: string;
  level?: string;
  description?: string;
  price: number;
  billingPeriod?: string;
  feeNote?: string;
  durationLabel?: string;
  classDuration?: string;
  schedule?: string;
  features?: string[];
}

export default function PaymentsPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentHistory] = useState<any[]>([]);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<Course[]>('/courses/public');
      setCourses(res.data);
    } catch {
      setError('Could not load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handlePaymentSuccess = async (course: Course, result: any) => {
    try {
      await api.post('/subscriptions', {
        courseId: course._id,
        amount: course.price,
        paymentId: result?.paymentId || result?.razorpayPaymentId || '',
        orderId: result?.orderId || '',
      });
      toast.success('Payment successful! Your plan is now active.');
    } catch {
      toast.error('Payment succeeded, but we could not save your plan. Please contact support.');
    }
  };

  const handlePaymentFailed = (result: any) => {
    toast.error('Payment failed. Please try again or contact support.');
    console.log('[Payments] Failed:', result);
  };

  return (
    <div className="w-full max-w-none mx-auto space-y-6 sm:space-y-8 font-[Plus_Jakarta_Sans]">
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
              <p className="text-emerald-100 text-sm sm:text-base font-medium">Pick a course below to continue your language journey</p>
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

      {/* Course list */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Available Courses
          </h2>
          <button
            type="button"
            onClick={loadCourses}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-black text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl sm:rounded-3xl border border-emerald-100/90 bg-white p-6 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl sm:rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center">
            <p className="text-base font-bold text-rose-700">{error}</p>
            <button
              type="button"
              onClick={loadCourses}
              className="mt-3 rounded-xl bg-rose-600 px-4 py-2 text-sm font-black text-white hover:bg-rose-700"
            >
              Try again
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl sm:rounded-3xl border border-emerald-100/90 bg-white p-12 sm:p-16 text-center space-y-3">
            <GraduationCap className="w-14 h-14 text-emerald-300 mx-auto" />
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">No courses available yet</h3>
            <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto font-medium">
              New courses and plans will appear here soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border-2 border-gray-100 bg-white p-5 sm:p-7 transition-all duration-300 hover:border-emerald-200 hover:shadow-lg"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800">
                      <Languages className="w-3.5 h-3.5" />
                      {course.language}
                    </span>
                    {course.level && (
                      <span className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-black text-gray-700">
                        {course.level}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">{course.title}</h3>
                    {course.description && (
                      <p className="mt-1.5 text-sm font-medium text-gray-500 leading-relaxed line-clamp-3">
                        {course.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1">
                      <IndianRupee className="w-5 h-5 text-emerald-700" />
                      <span className="text-4xl font-black text-gray-900 tracking-tighter">
                        {course.price > 0 ? course.price.toLocaleString('en-IN') : 'Free'}
                      </span>
                      {course.price > 0 && course.billingPeriod === 'monthly' && (
                        <span className="text-sm font-bold text-gray-500">/month</span>
                      )}
                    </div>
                    {course.feeNote && (
                      <p className="mt-1 text-xs font-semibold text-gray-500">{course.feeNote}</p>
                    )}
                  </div>

                  {(course.durationLabel || course.classDuration || course.schedule) && (
                    <div className="flex flex-wrap gap-2 text-xs font-bold text-gray-600">
                      {course.durationLabel && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8faf9] px-2.5 py-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {course.durationLabel}
                        </span>
                      )}
                      {course.classDuration && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8faf9] px-2.5 py-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                          {course.classDuration}
                        </span>
                      )}
                      {course.schedule && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f8faf9] px-2.5 py-1.5">
                          <CalendarDays className="w-3.5 h-3.5 text-emerald-600" />
                          {course.schedule}
                        </span>
                      )}
                    </div>
                  )}

                  {course.features && course.features.length > 0 && (
                    <ul className="space-y-2">
                      {course.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-sm font-medium text-gray-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                  {course.price > 0 ? (
                    <PayButton
                      amount={course.price}
                      description={`BhashaSchool ${course.title}`}
                      courseName={course.title}
                      customerName={user?.name}
                      customerEmail={user?.email}
                      variant="card"
                      onSuccess={(result) => handlePaymentSuccess(course, result)}
                      onFailed={handlePaymentFailed}
                    />
                  ) : (
                    <div className="w-full py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-500 font-black text-sm text-center">
                      Price on request
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How Payments Work */}
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
              <p className="font-black text-sm text-gray-900">Choose a course</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Pick the course and level that fits your goals</p>
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
              <p className="font-black text-sm text-gray-900">Start learning</p>
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
              Choose a course above and make your first payment to start learning!
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
