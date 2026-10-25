'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Clock, GraduationCap, Timer, X } from 'lucide-react';

interface Masterclass {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  category: string;
  imageUrl?: string;
}

interface ApiMasterclass extends Omit<Masterclass, 'id'> {
  _id: string;
}

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function MasterclassRegistration() {
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMasterclass, setSelectedMasterclass] = useState<Masterclass | null>(null);
  const [formData, setFormData] = useState<RegistrationForm>({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadMasterclasses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/masterclasses`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Request failed');
        const data: ApiMasterclass[] = await res.json();
        const upcoming = data
          .map((mc) => ({ ...mc, id: mc._id }))
          .filter((mc) => new Date(`${mc.date} ${mc.time}`) > new Date());
        setMasterclasses(upcoming);
      } catch {
        setMasterclasses([]);
      } finally {
        setLoading(false);
      }
    };
    loadMasterclasses();
  }, []);

  const handleOpenModal = (mc: Masterclass) => {
    setSelectedMasterclass(mc);
    setShowModal(true);
    setError('');
    setSuccess(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMasterclass(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    if (!selectedMasterclass) {
      setError('Please select a masterclass');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/masterclasses/${selectedMasterclass.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Registration failed. Please try again.');
      }
      setSuccess(true);
      setTimeout(() => {
        handleCloseModal();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading masterclasses...</div>;
  }

  if (masterclasses.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600">No upcoming masterclasses at the moment. Check back soon!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {masterclasses.map((mc: Masterclass) => (
          <div key={mc.id} className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--text-black)] mb-2">{mc.title}</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4 line-clamp-2">{mc.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-[1.4rem] text-[var(--text-black-soft)]">
                <Clock className="w-4 h-4 flex-shrink-0" /> {mc.date} • {mc.time} IST
              </div>
              <div className="flex items-center gap-2 text-[1.4rem] text-[var(--text-black-soft)]">
                <GraduationCap className="w-4 h-4 flex-shrink-0" /> {mc.instructor}
              </div>
              <div className="flex items-center gap-2 text-[1.4rem] text-[var(--text-black-soft)]">
                <Timer className="w-4 h-4 flex-shrink-0" /> {mc.duration} minutes
              </div>
              <div className="inline-block px-3 py-1 bg-[var(--green-light)] border border-emerald-300 rounded-full text-[1.2rem] font-bold text-[var(--starbucks-green)]">
                {mc.category}
              </div>
            </div>
            <button
              onClick={() => handleOpenModal(mc)}
              className="w-full px-6 py-3 bg-[var(--starbucks-green)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity text-[1.4rem]"
            >
              Register Now
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-100 rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl max-h-[92vh] overflow-y-auto">
            {success ? (
              <div className="text-center space-y-4 py-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">Registration successful!</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  You are registered for <span className="font-bold text-gray-700">{selectedMasterclass?.title}</span>.
                  Confirmation details will be sent to your email.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between border-b border-gray-100 pb-3.5 mb-5">
                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">Register for Masterclass</h3>
                    <p className="text-[11px] font-medium text-gray-400 mt-1">{selectedMasterclass?.title}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3.5 py-2.5 text-[11px] font-semibold text-emerald-800">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedMasterclass?.date} • {selectedMasterclass?.time} IST</span>
                  <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {selectedMasterclass?.duration} min</span>
                </div>

                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-600" />
                    <span className="text-xs font-medium text-rose-700">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone (10 digits)</label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Registering…' : 'Register'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
