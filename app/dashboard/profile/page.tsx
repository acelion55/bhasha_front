'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  User,
  Save,
  CheckCircle2,
  Shield,
  GraduationCap,
  Mail,
  Phone,
  CalendarDays,
  Languages,
  KeyRound,
  Camera,
  Loader2,
  Trash2,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, fetchUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      const digits = (user.phoneNumber || '').replace(/\D/g, '');
      setPhone(digits.length >= 10 ? digits.slice(-10) : digits);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      toast.error('Name must be between 2 and 50 characters');
      return;
    }
    if (phone && phone.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    setSaving(true);
    setSavedSuccess(false);
    try {
      const payload: Record<string, string> = { name: trimmedName };
      if (phone) payload.phoneNumber = phone;
      await api.post('/auth/profile', payload);
      toast.success('Profile updated');
      setSavedSuccess(true);
      await fetchUser();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar image must be 5 MB or smaller');
      return;
    }

    setAvatarUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post<{ url: string }>('/blogs/upload', data);
      await api.post('/auth/profile', { avatar: res.data.url });
      await fetchUser();
      toast.success('Profile avatar updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;
    setAvatarUploading(true);
    try {
      await api.post('/auth/profile', { avatar: '' });
      await fetchUser();
      toast.success('Profile photo removed');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const roleLabel = (user?.role || 'student').replace(/^./, (c) => c.toUpperCase());
  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4 font-[Plus_Jakarta_Sans] pb-10">
      {/* Profile header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 p-6 sm:p-7 text-white shadow-sm">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-white/5" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar with Upload Option */}
          <div className="relative group shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
              disabled={avatarUploading}
            />

            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/10 border-2 border-white/25 overflow-hidden flex items-center justify-center text-2xl sm:text-3xl font-black tracking-tight shrink-0 shadow-lg relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials || 'U'}</span>
              )}

              {avatarUploading && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-[10px] font-bold">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mb-1" />
                  <span>Uploading</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-white text-emerald-900 shadow-md hover:bg-emerald-50 transition-transform active:scale-95 cursor-pointer"
              title="Upload profile photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight truncate">
                  {user?.name || 'Your Profile'}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-emerald-100/80 truncate mt-0.5">
                  {user?.email || (user?.phoneNumber ? `+${user.phoneNumber}` : 'No contact added')}
                </p>
              </div>

              {user?.avatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={avatarUploading}
                  className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-rose-200 border border-white/15 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 border border-white/15 px-2 py-1 text-[11px] font-bold uppercase tracking-wide">
                <Shield className="w-3 h-3" /> {roleLabel}
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 border border-white/15 px-2 py-1 text-[11px] font-bold uppercase tracking-wide">
                <Languages className="w-3 h-3" /> {user?.language || 'German'}
              </span>
              {user?.category && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 border border-white/15 px-2 py-1 text-[11px] font-bold uppercase tracking-wide">
                  <GraduationCap className="w-3 h-3" /> {user.category}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Editable details */}
        <div className="lg:col-span-2 bg-white border border-emerald-100/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-extrabold text-gray-900 mb-4">Personal details</h2>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <span className="absolute left-9 text-gray-500 font-bold text-xs">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-16 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
              {savedSuccess && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Account summary */}
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-5 sm:p-6 shadow-xs">
          <h2 className="text-sm font-extrabold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3.5">
            {user?.email && (
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Email</p>
                  <p className="text-xs font-bold text-gray-800 truncate">{user.email}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <KeyRound className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Login</p>
                <p className="text-xs font-bold text-gray-800">
                  {user?.phoneNumber ? `+${user.phoneNumber}` : user?.email || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Languages className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Course</p>
                <p className="text-xs font-bold text-gray-800">{user?.language || 'German'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Level</p>
                <p className="text-xs font-bold text-gray-800">{user?.category || 'A1'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CalendarDays className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Member Since</p>
                <p className="text-xs font-bold text-gray-800">{joined}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                Account Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
