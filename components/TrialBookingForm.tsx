'use client';

import React, { useState } from 'react';
import { X, AlertCircle, Check, CalendarCheck, MessageCircle } from 'lucide-react';

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

export default function TrialBookingForm({ type, isOpen, onClose }: { type: 'trial' | 'mentor'; isOpen: boolean; onClose: () => void }) {
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
    '9:00 AM - 12:00 PM',
    '12:00 PM - 3:00 PM',
    '3:00 PM - 6:00 PM',
    '6:00 PM - 9:00 PM',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
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
      setError('Please select a course');
      return false;
    }
    if (type === 'trial' && !formData.preferredTime) {
      setError('Please select a preferred time');
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
            message: formData.message ? `${formData.message} (Preferred Time: ${formData.preferredTime || 'Any'})` : `Preferred Time: ${formData.preferredTime || 'Any'}`,
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
      }, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[var(--house-green)] px-8 py-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {type === 'trial' ? (
                <><CalendarCheck className="w-6 h-6 text-[var(--gold)]" /> Book Free Trial & Placement</>
              ) : (
                <><MessageCircle className="w-6 h-6 text-[var(--gold)]" /> Chat with Academic Mentor</>
              )}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Personalized guidance & CEFR level assessment included
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center space-y-4 py-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Check size={32} className="text-emerald-700" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Trial Request Confirmed!</h3>
                <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
                  {type === 'trial'
                    ? 'Our certified mentor will call you within 24 hours to schedule your placement test and batch slot.'
                    : 'An academic advisor will connect with you shortly.'}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={18} />
                  <span className="text-xs sm:text-sm text-red-700 font-medium">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp / Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Language / Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none bg-white"
                  >
                    <option value="">Select course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              </div>

              {type === 'trial' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Demo Time Slot *</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none bg-white"
                  >
                    <option value="">Select time slot</option>
                    {times.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Learning Goal (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="e.g. Preparing for Goethe B1 for German Job / Ausbildung in 4 months..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-5 py-3.5 bg-[var(--gold)] hover:bg-[#b45309] text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {loading ? 'Submitting...' : 'Confirm Free Booking'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3.5 border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
