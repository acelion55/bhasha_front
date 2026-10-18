'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2, XCircle, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

interface PayButtonProps {
  amount: number;
  description?: string;
  courseName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: (result: any) => void;
  onFailed?: (result: any) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
}

export default function PayButton({
  amount,
  description,
  courseName,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailed,
  className = '',
  variant = 'default',
}: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');

  const RAZORPAY_API_URL = process.env.NEXT_PUBLIC_RAZORPAY_API_URL || 'http://localhost:6100';
  const RAZORPAY_CHECKOUT_URL = process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_URL || 'http://localhost:7000';

  const startPayment = async () => {
    setLoading(true);
    setStatus('loading');

    try {
      // Create payment session via our API wrapper
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          description: description || courseName || 'BhashaSchool Payment',
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Failed to create payment');
      }

      // Dynamically load the Razorpay checkout SDK and open the modal
      await loadRazorpaySDK();

      // Use the global Razorpay.pay() to open checkout modal
      const rzp = (window as any).Razorpay || (window as any).RazorpayCheckout;

      if (!rzp) {
        // Fallback: open checkout URL in new tab
        window.open(data.checkoutUrl, '_blank');
        toast.info('Payment opened in a new tab');
        setLoading(false);
        setStatus('idle');
        return;
      }

      await rzp.pay({
        paymentId: data.paymentId,
        checkoutUrl: data.checkoutUrl,
        amount,
        name: 'BhashaSchool',
        description: description || courseName || 'Course Payment',
        portalUrl: RAZORPAY_CHECKOUT_URL,
        apiUrl: RAZORPAY_API_URL,
        customer: {
          name: customerName || '',
          email: customerEmail || '',
          phone: customerPhone || '',
        },
        theme: { color: '#059669' },
        onSuccess: (result: any) => {
          setStatus('success');
          toast.success('Payment successful! 🎉');
          onSuccess?.(result);
          setTimeout(() => setStatus('idle'), 3000);
        },
        onFailed: (result: any) => {
          setStatus('failed');
          toast.error('Payment failed. Please try again.');
          onFailed?.(result);
          setTimeout(() => setStatus('idle'), 3000);
        },
        onPaymentFailed: (result: any) => {
          setStatus('failed');
          toast.error('Payment failed. Please try again.');
          onFailed?.(result);
          setTimeout(() => setStatus('idle'), 3000);
        },
        onCancelled: () => {
          setStatus('idle');
          toast.info('Payment cancelled');
        },
        onExpired: () => {
          setStatus('failed');
          toast.warning('Payment session expired. Please try again.');
          setTimeout(() => setStatus('idle'), 3000);
        },
        onClose: () => {
          if (status === 'loading') setStatus('idle');
        },
      });
    } catch (err: any) {
      console.error('[PayButton] Error:', err);
      toast.error(err.message || 'Something went wrong');
      setStatus('failed');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={startPayment}
      disabled={loading || status === 'success'}
      className={`
        group relative overflow-hidden
        flex items-center justify-center gap-2.5
        font-black text-base sm:text-lg
        transition-all duration-300 ease-out
        disabled:cursor-not-allowed
        ${variant === 'compact'
          ? 'px-5 py-2.5 rounded-xl text-sm'
          : variant === 'card'
            ? 'w-full px-6 py-4 rounded-2xl text-base sm:text-lg'
            : 'px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl'
        }
        ${status === 'success'
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
          : status === 'failed'
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 active:scale-[0.98]'
        }
        ${className}
      `}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {status === 'loading' ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Processing…</span>
        </>
      ) : status === 'success' ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span>Paid ✓</span>
        </>
      ) : status === 'failed' ? (
        <>
          <XCircle className="w-5 h-5" />
          <span>Failed — Retry</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>Pay</span>
          <span className="flex items-center gap-0.5">
            <IndianRupee className="w-4 h-4" />
            {amount.toLocaleString('en-IN')}
          </span>
        </>
      )}
    </button>
  );
}

/** Dynamically loads the Razorpay checkout SDK script if not already present */
function loadRazorpaySDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).__RAZORPAY_SDK_INITIALIZED__) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[src*="razorpay"]');
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    const checkoutUrl = process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_URL || 'http://localhost:7000';
    script.src = `${checkoutUrl}/razorpay-checkout.js`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      console.warn('[PayButton] Could not load Razorpay SDK from checkout portal, using fallback');
      resolve(); // Resolve anyway — we'll fallback to window.open
    };
    document.head.appendChild(script);
  });
}
