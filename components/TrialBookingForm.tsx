'use client';

import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';

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
    'German for Beginners',
    'English Conversational',
    'German Language for Business Professionals',
    'Exam Preparation',
    'Not Sure Yet',
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
      // Save to localStorage
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
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border-2 border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--starbucks-green)] to-emerald-600 px-10 py-6 flex justify-between items-center rounded-t-2xl">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {type === 'trial' ? '📅 Book Your Free Trial' : '💬 Chat with Academic Mentor'}
            </h2>
            <p className="text-emerald-100 text-sm mt-1">Get personalized guidance from our experts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
          >
            <X size={28} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {success ? (
            <div className="text-center space-y-3 py-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-[var(--green-light)] rounded-full flex items-center justify-center">
                  <Check size={28} className="text-[var(--starbucks-green)]" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Success! ✓</h3>
              <p className="text-sm text-gray-600">
                {type === 'trial'
                  ? 'We\'ll contact you within 24 hours to confirm.'
                  : 'A mentor will reach out to you soon!'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded flex gap-3">
                  <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[var(--starbucks-green)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[var(--starbucks-green)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone (10 digits) *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  maxLength="10"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[var(--starbucks-green)] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Course *</label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[var(--starbucks-green)] focus:border-transparent bg-white"
                >
                  <option value="">Select course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              {type === 'trial' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time *</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[var(--starbucks-green)] focus:border-transparent bg-white"
                  >
                    <option value="">Select time</option>
                    {times.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your goals..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-[var(--starbucks-green)] focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-[var(--starbucks-green)] text-white rounded-lg font-bold text-base hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold text-base hover:bg-gray-50 transition-colors"
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
