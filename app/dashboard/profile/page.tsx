'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { User, Save, CheckCircle2, Shield, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, fetchUser } = useAuth();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.post('/auth/profile', { name });
      toast.success('Profile updated successfully!');
      setSavedSuccess(true);
      if (fetchUser) await fetchUser();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-[Plus_Jakarta_Sans] pb-12">
      
      {/* Page Header */}
      <div className="bg-white border border-emerald-100/90 p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Account Profile & Settings
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            Manage your personal profile details, enrolled level, and authentication account.
          </p>
        </div>

        {user?.category && (
          <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-xl">
            <GraduationCap className="w-4 h-4 text-emerald-700" />
            <span className="text-sm font-black text-emerald-900">Level {user.category} Learner</span>
          </div>
        )}
      </div>

      {/* Main Settings Card */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-6 sm:p-9 shadow-xs">
        <form onSubmit={handleSave} className="space-y-7">
          
          {/* User Name */}
          <div className="space-y-2.5">
            <label className="block text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pl-12 text-gray-900 text-sm sm:text-base font-semibold placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-xs"
                placeholder="Enter your full name"
              />
              <User className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
            </div>
          </div>

          {/* Email / Phone (Disabled) */}
          <div className="space-y-2.5">
            <label className="block text-xs sm:text-sm font-black text-gray-800 uppercase tracking-wider">
              {user?.email ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={user?.email ? 'email' : 'text'}
              value={user?.email || (user?.phoneNumber ? `+${user.phoneNumber}` : '')}
              disabled
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-600 text-sm sm:text-base font-bold cursor-not-allowed"
            />
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Linked to your account authentication and cannot be changed directly.
            </p>
          </div>

          {/* Role & Level Badges */}
          <div className="p-5 sm:p-6 bg-gray-50/90 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Platform Role</div>
                <div className="text-sm sm:text-base font-black text-emerald-950 uppercase mt-0.5">{user?.role || 'student'}</div>
              </div>
            </div>

            {user?.category && (
              <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-50 text-amber-900 font-black px-4 py-2.5 rounded-xl border border-amber-200 text-sm">
                <GraduationCap className="w-4 h-4 text-amber-700" />
                <span>Proficiency: Level {user.category}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              {saving ? (
                <>Updating...</>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Settings
                </>
              )}
            </button>
            {savedSuccess && (
              <span className="text-sm text-emerald-700 flex items-center gap-1.5 font-bold bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Profile saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
