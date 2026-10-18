'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Phone, ArrowRight, X } from 'lucide-react';

interface CompletePhoneModalProps {
  open: boolean;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CompletePhoneModal({ open, onComplete, onCancel }: CompletePhoneModalProps) {
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/profile', { phoneNumber: digits });
      toast.success('Phone number saved!');
      onComplete();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save phone number');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-[5vw]">
      <div className="relative w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl border border-[var(--ceramic)] p-[28px] sm:p-[36px]">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-[16px] right-[16px] p-[6px] rounded-full text-[var(--text-black-soft)] hover:bg-[var(--neutral-warm)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-[1vh] mb-[3vh]">
          <h2 className="h1-text text-[2.4rem] text-[var(--text-black)]">One last step</h2>
          <p className="body-text text-[var(--text-black-soft)]">
            Add your mobile number to finish setting up your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[2.5vh]">
          <div>
            <label className="block text-[1.3rem] font-bold uppercase text-[var(--text-black-soft)] mb-[1vh] tracking-wider">
              Mobile Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-[15px] w-6 h-6 text-[var(--starbucks-green)]" />
              <span className="absolute left-[50px] text-[var(--text-black-soft)] font-bold text-[1.6rem]">+91</span>
              <input
                type="tel"
                inputMode="numeric"
                autoFocus
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full pl-[95px] pr-[15px] py-[2vh] rounded-[12px] bg-[var(--neutral-warm)] border border-[var(--ceramic)] text-[var(--text-black)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--starbucks-green)] text-[1.6rem] transition"
                placeholder="98765 43210"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full btn-primary py-[2vh] !rounded-[12px] text-[1.8rem] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : <><span>Continue</span><ArrowRight className="w-6 h-6" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
