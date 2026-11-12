'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2, XCircle, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

export interface PayButtonProps {
  amount: number; // In INR by default (e.g. 499 for ₹499)
  isPaise?: boolean; // Set true if amount is already in paise
  currency?: string;
  description?: string;
  courseName?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess?: (result: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    paymentId: string;
    orderId: string;
    [key: string]: any;
  }) => void;
  onFailed?: (error: any) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'card';
  buttonText?: string;
}

export default function PayButton({
  amount,
  isPaise = false,
  currency = 'INR',
  description,
  courseName,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailed,
  className = '',
  variant = 'default',
  buttonText,
}: PayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'failed'>('idle');

  // Convert to paise for Razorpay API (minimum 100 paise = ₹1)
  const amountInPaise = isPaise ? Math.round(amount) : Math.round(amount * 100);
  const displayAmount = isPaise ? Math.round(amount / 100) : amount;

  const handlePayment = async () => {
    if (amountInPaise < 100) {
      toast.error('Minimum payment amount is ₹1 (100 paise)');
      return;
    }

    setLoading(true);
    setStatus('loading');

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error('Could not load Razorpay Checkout SDK. Please check your internet connection.');
      }

      // 2. Step 1: Create Order on Backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            description: description || courseName || 'BhashaSchool Course',
            courseName: courseName || '',
          },
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || !orderData.order_id) {
        throw new Error(orderData.error || 'Failed to initiate payment order');
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error('NEXT_PUBLIC_RAZORPAY_KEY_ID is missing');
      }

      // 3. Step 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'BhashaSchool',
        description: description || courseName || 'Language Course Payment',
        order_id: orderData.order_id,
        prefill: {
          name: customerName || '',
          email: customerEmail || '',
          contact: customerPhone || '',
        },
        theme: {
          color: '#059669', // Emerald
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setStatus('idle');
            toast.info('Payment window closed');
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Step 3: Backend signature verification
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed');
            }

            setStatus('success');
            toast.success('Payment verified successfully!');

            const resultPayload = {
              ...response,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
            };

            onSuccess?.(resultPayload);
            setTimeout(() => setStatus('idle'), 4000);
          } catch (verifyErr: any) {
            console.error('[PayButton Verification Error]:', verifyErr);
            setStatus('failed');
            toast.error(verifyErr.message || 'Payment verification failed');
            onFailed?.(verifyErr);
            setTimeout(() => setStatus('idle'), 4000);
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on('payment.failed', (failResponse: any) => {
        console.error('[Razorpay Payment Failed]:', failResponse);
        const reason =
          failResponse?.error?.description ||
          failResponse?.error?.reason ||
          'Payment processing failed';
        setStatus('failed');
        toast.error(`Payment failed: ${reason}`);
        onFailed?.(failResponse);
        setLoading(false);
        setTimeout(() => setStatus('idle'), 4000);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('[PayButton Error]:', err);
      toast.error(err.message || 'Payment could not be started');
      setStatus('failed');
      onFailed?.(err);
      setLoading(false);
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading || status === 'success'}
      className={`
        group relative overflow-hidden
        flex items-center justify-center gap-2.5
        font-black text-base sm:text-lg
        transition-all duration-300 ease-out
        cursor-pointer disabled:cursor-not-allowed
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
          <span>Paid</span>
        </>
      ) : status === 'failed' ? (
        <>
          <XCircle className="w-5 h-5" />
          <span>Failed — Retry</span>
        </>
      ) : (
        <>
          <CreditCard className="w-5 h-5" />
          <span>{buttonText || 'Pay'}</span>
          <span className="flex items-center gap-0.5">
            <IndianRupee className="w-4 h-4" />
            {displayAmount.toLocaleString('en-IN')}
          </span>
        </>
      )}
    </button>
  );
}

/** Dynamically loads the official Razorpay Checkout SDK script */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const scriptSrc = process.env.NEXT_PUBLIC_RAZORPAY_CHECKOUT_SCRIPT_URL;
    if (!scriptSrc) {
      resolve(false);
      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
