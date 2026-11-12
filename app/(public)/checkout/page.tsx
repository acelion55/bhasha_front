'use client';

import React, { useState } from 'react';
import PayButton from '@/components/PayButton';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function CheckoutPage() {
  const [amount, setAmount] = useState<number>(1); // Default ₹1 for live/test verification
  const [customerName, setCustomerName] = useState<string>('Bhasha Learner');
  const [customerEmail, setCustomerEmail] = useState<string>('learner@bhashaschool.com');
  const [customerPhone, setCustomerPhone] = useState<string>('9876543210');
  const [lastPayment, setLastPayment] = useState<any>(null);

  const presets = [1, 99, 499, 1499, 4999];

  return (
    <div className="min-h-screen bg-[#f7faf8] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-[Plus_Jakarta_Sans]">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Razorpay Standard Web Checkout
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Checkout & Payment
          </h1>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Complete your enrollment securely with Razorpay payment gateway
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl shadow-gray-100/50 p-6 sm:p-8 space-y-6">
          {/* Preset amounts */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
              Select Amount (₹ INR)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer ${
                    amount === val
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-1.5">
              Custom Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black">₹</span>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 0))}
                className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                placeholder="Enter amount"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">Minimum ₹1 (100 paise)</p>
          </div>

          {/* Prefill details */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500">
              Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Pay Button */}
          <div className="pt-2">
            <PayButton
              amount={amount}
              description={`BhashaSchool Course Checkout — ₹${amount}`}
              customerName={customerName}
              customerEmail={customerEmail}
              customerPhone={customerPhone}
              variant="card"
              buttonText="Pay Securely"
              onSuccess={(result) => {
                setLastPayment(result);
              }}
              onFailed={(err) => {
                console.error('[Checkout Page] Payment Failed:', err);
              }}
            />
          </div>

          {/* Last Payment Status */}
          {lastPayment && (
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-black text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Payment Successfully Verified!
              </div>
              <p><span className="font-bold">Payment ID:</span> {lastPayment.razorpay_payment_id || lastPayment.paymentId}</p>
              <p><span className="font-bold">Order ID:</span> {lastPayment.razorpay_order_id || lastPayment.orderId}</p>
              <p><span className="font-bold">Signature:</span> {lastPayment.razorpay_signature?.slice(0, 24)}…</p>
            </div>
          )}
        </div>

        {/* Security / Info footer */}
        <div className="rounded-2xl bg-emerald-900/5 border border-emerald-900/10 p-5 text-xs text-gray-600 space-y-2">
          <div className="flex items-center gap-2 font-black text-gray-900 text-sm">
            <Zap className="w-4 h-4 text-emerald-600" />
            Integration Highlights
          </div>
          <ul className="list-disc list-inside space-y-1 font-medium">
            <li>Backend Order Creation (<code className="bg-emerald-100/60 px-1 py-0.5 rounded text-emerald-900">POST /api/create-order</code>) via official Razorpay SDK</li>
            <li>Razorpay Standard Checkout Modal (<code className="bg-emerald-100/60 px-1 py-0.5 rounded text-emerald-900">checkout.js</code>)</li>
            <li>HMAC-SHA256 Timing-Safe Signature Verification (<code className="bg-emerald-100/60 px-1 py-0.5 rounded text-emerald-900">POST /api/verify-payment</code>)</li>
            <li>Credentials safely isolated in environment variables (<code className="bg-emerald-100/60 px-1 py-0.5 rounded text-emerald-900">RAZORPAY_KEY_SECRET</code> is never exposed to client)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
