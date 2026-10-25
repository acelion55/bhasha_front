'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Layers, Plus, Trash2, Edit, Video, Clock, Users, GraduationCap, X } from 'lucide-react';
import { toast } from 'sonner';

interface ClassItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  timing: string;
  startDate?: string;
  startTime?: string;
  mentorName?: string;
  mentor?: { _id: string; name: string; email: string };
  mentorId?: any;
  students?: string[];
  enrolledStudents?: string[];
  maxStudents?: number;
  maxCapacity?: number;
  meetingLink?: string;
  price?: number;
  currency?: string;
  isPublic?: boolean;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');

  const [form, setForm] = useState({
    title: '',
    category: 'A1',
    description: '',
    mentorId: '',
    maxStudents: 15,
    meetingLink: '',
  });

  const formatTo12Hour = (time24: string) => {
    if (!time24) return '';
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const parseStartTime = (timingStr: string) => {
    const match = (timingStr || '').match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (!match) return '19:00';
    let h = parseInt(match[1], 10);
    const min = match[2] || '00';
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return `${h.toString().padStart(2, '0')}:${min}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clsRes, userRes] = await Promise.all([
        api.get<ClassItem[]>('/classes'),
        api.get<{ users: User[] }>('/admin/users?limit=100'),
      ]);
      setClasses(clsRes.data);
      setMentors((userRes.data.users || []).filter((u) => u.role === 'mentor' || u.role === 'teacher' || u.role === 'admin'));
    } catch (err: any) {
      toast.error('Failed to load classes or mentors');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setStartDate('');
    setStartTime('19:00');
    setForm({
      title: '',
      category: 'A1',
      description: '',
      mentorId: mentors[0]?._id || '',
      maxStudents: 15,
      meetingLink: '',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingId(cls._id);
    setStartDate(cls.startDate || '');
    setStartTime(cls.startTime || parseStartTime(cls.timing || ''));

    const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId) || '';

    setForm({
      title: cls.title,
      category: cls.category || 'A1',
      description: cls.description || '',
      mentorId: mId,
      maxStudents: cls.maxStudents || cls.maxCapacity || 15,
      meetingLink: cls.meetingLink || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedMentor = mentors.find((m) => m._id === form.mentorId);
      const formattedTiming = `${formatDateLabel(startDate)} | ${formatTo12Hour(startTime)}`;

      const payload: any = {
        title: form.title,
        category: form.category,
        description: form.description,
        timing: formattedTiming,
        startDate,
        startTime,
        maxStudents: Number(form.maxStudents) || 15,
        maxCapacity: Number(form.maxStudents) || 15,
        meetingLink: form.meetingLink || '',
        currency: 'INR',
      };

      if (form.mentorId) {
        payload.mentorId = form.mentorId;
        payload.mentorName = selectedMentor?.name || 'Instructor';
      } else {
        payload.mentorName = 'Unassigned';
      }

      if (editingId) {
        await api.put(`/classes/${editingId}`, payload);
        toast.success('Class batch updated!');
      } else {
        await api.post('/classes', payload);
        toast.success('New class batch created!');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save class');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class batch?')) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success('Class deleted');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete class');
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-4 font-[Plus_Jakarta_Sans]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white border border-emerald-100/90 px-4 py-3 rounded-2xl shadow-xs">
        <h1 className="text-sm font-extrabold text-gray-900 tracking-tight">
          Classes & Batches
        </h1>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Schedule New Batch
        </button>
      </div>

      {/* Grid of Classes */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-white border border-emerald-100/90 rounded-2xl p-5 animate-pulse" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-8 text-center space-y-2">
          <Layers className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-gray-900">No active class batches</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Click "Schedule New Batch" to create live interactive language classes for students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="bg-white border border-emerald-100/90 rounded-2xl p-4.5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100/80 text-emerald-900">
                    Level {cls.category}
                  </span>
                  <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" /> {cls.students?.length || cls.enrolledStudents?.length || 0} / {cls.maxStudents || cls.maxCapacity || 15}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-gray-900">{cls.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{cls.description || 'No description provided.'}</p>

                <div className="bg-gray-50/80 border border-gray-100 p-2.5 rounded-xl space-y-1.5 text-xs text-gray-700">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cls.timing}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mentor: {cls.mentor?.name || (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName || 'Unassigned'}</span>
                  </div>
                  {cls.meetingLink && (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold truncate">
                      <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <a href={cls.meetingLink} target="_blank" rel="noreferrer" className="underline truncate">
                        {cls.meetingLink}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-gray-100 mt-3">
                <button
                  onClick={() => handleOpenEdit(cls)}
                  className="px-2.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(cls._id)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CLASS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-emerald-100 rounded-2xl w-full max-w-2xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <h3 className="text-base font-extrabold text-gray-900">
                {editingId ? 'Edit Class Batch' : 'Schedule New Batch'}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Batch Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German A1 Conversational"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Level
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                  >
                    <option value="A1">A1 Beginner</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate</option>
                    <option value="B2">B2 Upper Intermediate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Max Seats
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={form.maxStudents}
                    onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-semibold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Instructor
                  </label>
                  <select
                    value={form.mentorId}
                    onChange={(e) => setForm({ ...form, mentorId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                  >
                    <option value="">-- Unassigned --</option>
                    {mentors.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Batch Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-bold transition-all bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Batch Start Time
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-bold transition-all bg-white"
                    />
                    <span className="block text-[10px] text-gray-400 font-medium mt-1">Starts: {formatTo12Hour(startTime)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Meeting Link
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 font-mono text-xs transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Batch objectives and syllabus notes..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-all"
              >
                {editingId ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
