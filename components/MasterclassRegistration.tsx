'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check } from 'lucide-react';

export default function MasterclassRegistration() {
  const [masterclasses, setMasterclasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMasterclass, setSelectedMasterclass] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load masterclasses from localStorage
    const saved = localStorage.getItem('masterclasses');
    if (saved) {
      const data = JSON.parse(saved);
      // Filter only upcoming masterclasses
      const upcoming = data.filter(mc => new Date(mc.date + ' ' + mc.time) > new Date());
      setMasterclasses(upcoming);
    }
    setLoading(false);
  }, []);

  const handleOpenModal = (mc) => {
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

  const handleInputChange = (e) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    // Save registration to localStorage
    const registrations = JSON.parse(localStorage.getItem('masterclass_registrations') || '[]');
    const newRegistration = {
      id: Date.now().toString(),
      ...formData,
      masterclassId: selectedMasterclass.id,
      registeredAt: new Date().toISOString(),
    };
    registrations.push(newRegistration);
    localStorage.setItem('masterclass_registrations', JSON.stringify(registrations));

    setSuccess(true);
    setTimeout(() => {
      handleCloseModal();
    }, 2000);
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
        {masterclasses.map((mc) => (
          <div key={mc.id} className="bg-white border-2 border-[var(--ceramic)] rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-[1.8rem] font-bold text-[var(--text-black)] mb-2">{mc.title}</h3>
            <p className="text-[1.4rem] text-[var(--text-black-soft)] mb-4 line-clamp-2">{mc.description}</p>
            <div className="space-y-2 mb-4">
              <div className="text-[1.4rem] text-[var(--text-black-soft)]">
                🕐 {mc.date} • {mc.time} IST
              </div>
              <div className="text-[1.4rem] text-[var(--text-black-soft)]">
                👨‍🏫 {mc.instructor}
              </div>
              <div className="text-[1.4rem] text-[var(--text-black-soft)]">
                ⏱️ {mc.duration} minutes
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

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            {success ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Check size={32} className="text-emerald-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Registration Successful!</h3>
                <p className="text-gray-600">You have successfully registered for this masterclass. You will receive confirmation details via email.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Register for Masterclass</h2>
                <p className="text-gray-600 mb-6">{selectedMasterclass?.title}</p>

                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone (10 digits)</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      Register
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
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
