'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertCircle, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  GraduationCap,
  Calendar
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FormData {
  name: string;
  email: string;
  phone: string;
  course: string;
  preferredTime: string;
  message: string;
  type: 'trial' | 'mentor';
}

export default function TrialBookingForm({ 
  type, 
  isOpen, 
  onClose 
}: { 
  type: 'trial' | 'mentor'; 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    course: '',
    preferredTime: '',
    message: '',
    type: type,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const courses = [
    'German for Beginners (A1)',
    'Elementary German (A2)',
    'Intermediate German (B1 - Visa & Work)',
    'Advanced German (B2 - Medical & Corporate)',
    'English Conversational',
    'Spanish for Beginners',
    'Goethe & telc Exam Preparation',
  ];

  const times = [
    '9:00 AM - 12:00 PM (Morning)',
    '12:00 PM - 3:00 PM (Afternoon)',
    '3:00 PM - 6:00 PM (Evening)',
    '6:00 PM - 9:00 PM (Night)',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!formData.course) {
      setError('Please select your target course');
      return false;
    }
    if (type === 'trial' && !formData.preferredTime) {
      setError('Please select a preferred demo time slot');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // 1. Attempt server capture
      try {
        await fetch(`${API_BASE_URL}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            course: formData.course,
            lead_source: `website_homepage_${type}`,
            message: formData.message 
              ? `${formData.message} (Preferred Time: ${formData.preferredTime || 'Any'})` 
              : `Preferred Time: ${formData.preferredTime || 'Any'}`,
          }),
        });
      } catch (networkErr) {
        console.warn('Backend leads API unavailable, saving to local backup:', networkErr);
      }

      // 2. Local fallback storage
      const leads = JSON.parse(localStorage.getItem('trial_mentor_leads') || '[]');
      const newLead = {
        id: Date.now().toString(),
        ...formData,
        submittedAt: new Date().toISOString(),
      };
      leads.push(newLead);
      localStorage.setItem('trial_mentor_leads', JSON.stringify(leads));

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: '',
          preferredTime: '',
          message: '',
          type: type,
        });
        setSuccess(false);
      }, 2200);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
          data-lenis-prevent
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#14181D]/65 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="relative w-full max-w-[580px] bg-[#FAF7F2] rounded-[24px] sm:rounded-[28px] border border-[rgba(32,37,42,0.12)] shadow-[0_24px_60px_rgba(20,24,29,0.22)] overflow-hidden z-10 my-auto"
            data-lenis-prevent
          >
            {/* ── TOP EDITORIAL HEADER ── */}
            <div className="pt-6 sm:pt-8 px-6 sm:px-8 pb-5 border-b border-[rgba(32,37,42,0.08)] bg-white/70 backdrop-blur-xs">
              <div className="flex items-start justify-between gap-4">
                <div>
                  {/* Eyebrow */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-[2px] bg-[#CF1E2C] rounded-full" />
                    <span className="text-[1.1rem] sm:text-[1.15rem] font-black uppercase tracking-widest text-[#626B73]">
                      {type === 'trial' ? 'FREE 1-ON-1 DEMO • CEFR ASSESSMENT' : 'ACADEMIC CONSULTATION'}
                    </span>
                  </div>

                  {/* Headline */}
                  <h2 className="text-[2.2rem] sm:text-[2.6rem] font-extrabold text-[#20252A] leading-tight tracking-tight">
                    {type === 'trial' ? 'Book Free Trial & Placement' : 'Chat with Academic Mentor'}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-[1.35rem] sm:text-[1.45rem] text-[#626B73] font-medium leading-relaxed mt-1">
                    Personalized guidance &amp; CEFR level assessment included.
                  </p>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[#626B73] hover:text-[#20252A] bg-white hover:bg-slate-100 border border-[rgba(32,37,42,0.1)] transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Perks Pill Strip */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 pt-3 border-t border-[rgba(32,37,42,0.06)]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[rgba(32,37,42,0.08)] text-[1.15rem] font-bold text-[#173B63]">
                  <Clock className="w-3.5 h-3.5 text-[#E4A642]" /> 30-Min Live Demo
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[rgba(32,37,42,0.08)] text-[1.15rem] font-bold text-[#173B63]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#CF1E2C]" /> Certified Faculty
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[rgba(32,37,42,0.08)] text-[1.15rem] font-bold text-[#173B63]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Free &amp; Private
                </span>
              </div>
            </div>

            {/* ── FORM CONTENT ── */}
            <div className="p-6 sm:p-8 max-h-[calc(85vh-140px)] overflow-y-auto">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 sm:py-10 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-[2.2rem] font-extrabold text-[#20252A] tracking-tight">
                      Trial Request Confirmed!
                    </h3>
                    <p className="text-[1.45rem] text-[#626B73] font-medium mt-2 max-w-sm mx-auto leading-relaxed">
                      Our academic advisor will call you within 24 hours to schedule your placement test and live session slot.
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[rgba(32,37,42,0.08)] text-[1.25rem] font-bold text-[#173B63]">
                    <Sparkles className="w-4 h-4 text-[#E4A642]" /> Welcome to BhashaSchool
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
                  {/* Error Notification */}
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200/80 flex items-center gap-2.5 text-red-700">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
                      <span className="text-[1.3rem] font-semibold">{error}</span>
                    </div>
                  )}

                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[1.25rem] font-bold text-[#20252A] mb-1.5">
                        Your Full Name <span className="text-[#CF1E2C]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 bg-white border border-[rgba(32,37,42,0.15)] rounded-xl text-[1.35rem] text-[#20252A] placeholder:text-slate-400 focus:outline-none focus:border-[#CF1E2C] focus:ring-3 focus:ring-[#CF1E2C]/15 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[1.25rem] font-bold text-[#20252A] mb-1.5">
                        Email Address <span className="text-[#CF1E2C]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className="w-full px-4 py-3 bg-white border border-[rgba(32,37,42,0.15)] rounded-xl text-[1.35rem] text-[#20252A] placeholder:text-slate-400 focus:outline-none focus:border-[#CF1E2C] focus:ring-3 focus:ring-[#CF1E2C]/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: WhatsApp Number & Course */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <div>
                      <label className="block text-[1.25rem] font-bold text-[#20252A] mb-1.5">
                        WhatsApp / Phone Number <span className="text-[#CF1E2C]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="w-full px-4 py-3 bg-white border border-[rgba(32,37,42,0.15)] rounded-xl text-[1.35rem] text-[#20252A] placeholder:text-slate-400 focus:outline-none focus:border-[#CF1E2C] focus:ring-3 focus:ring-[#CF1E2C]/15 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[1.25rem] font-bold text-[#20252A] mb-1.5">
                        Target Language / Course <span className="text-[#CF1E2C]">*</span>
                      </label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-[rgba(32,37,42,0.15)] rounded-xl text-[1.35rem] text-[#20252A] focus:outline-none focus:border-[#CF1E2C] focus:ring-3 focus:ring-[#CF1E2C]/15 transition-all cursor-pointer"
                      >
                        <option value="">Select course</option>
                        {courses.map(course => (
                          <option key={course} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 3: Preferred Time Slot (Trial Only) */}
                  {type === 'trial' && (
                    <div>
                      <label className="block text-[1.25rem] font-bold text-[#20252A] mb-1.5">
                        Preferred Demo Time Slot <span className="text-[#CF1E2C]">*</span>
                      </label>
                      <select
                        name="preferredTime"
                        value={formData.preferredTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-[rgba(32,37,42,0.15)] rounded-xl text-[1.35rem] text-[#20252A] focus:outline-none focus:border-[#CF1E2C] focus:ring-3 focus:ring-[#CF1E2C]/15 transition-all cursor-pointer"
                      >
                        <option value="">Select time slot</option>
                        {times.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Row 4: Learning Goal */}
                  <div>
                    <label className="block text-[1.25rem] font-bold text-[#20252A] mb-1.5">
                      Learning Goal <span className="text-[#626B73] font-normal">(Optional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="e.g. Preparing for Goethe B1 for German Job / Ausbildung in 4 months..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white border border-[rgba(32,37,42,0.15)] rounded-xl text-[1.35rem] text-[#20252A] placeholder:text-slate-400 focus:outline-none focus:border-[#CF1E2C] focus:ring-3 focus:ring-[#CF1E2C]/15 transition-all resize-none"
                    />
                  </div>

                  {/* Row 5: Action Buttons (Aligned to Home Page CTA Style) */}
                  <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#20252A] border border-[rgba(32,37,42,0.25)] font-bold text-[1.4rem] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer active:scale-95 text-center"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#CF1E2C] hover:bg-[#B51723] text-white font-bold text-[1.45rem] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                    >
                      <span>{loading ? 'Submitting...' : 'Confirm Free Booking'}</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
