'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Calendar,
  Clock,
  Users,
  Video,
  ImagePlus,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface PublicClass {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  category: string;
  capacity: number;
  imageUrl?: string;
  published?: boolean;
  createdAt?: string;
}

const categories = [
  'Language Learning',
  'Exam Preparation',
  'Career Development',
  'Personal Development',
  'Culture & Travel',
  'Education & Admissions',
];

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  duration: '60',
  instructor: '',
  category: 'Language Learning',
  capacity: 100,
  imageUrl: '',
  published: true,
};

export default function AdminPublicClassesPage() {
  const [classes, setClasses] = useState<PublicClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get<PublicClass[]>('/masterclasses?all=true');
      setClasses(res.data);
    } catch {
      toast.error('Failed to load public classes');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (cls: PublicClass) => {
    setEditingId(cls._id);
    setForm({
      title: cls.title,
      description: cls.description || '',
      date: cls.date,
      time: cls.time,
      duration: cls.duration || '60',
      instructor: cls.instructor || '',
      category: cls.category || 'Language Learning',
      capacity: cls.capacity || 0,
      imageUrl: cls.imageUrl || '',
      published: cls.published !== false,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller');
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post<{ url: string }>('/blogs/upload', data);
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
      toast.success('Cover image uploaded');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        capacity: Number(form.capacity) || 0,
      };
      if (editingId) {
        await api.put(`/masterclasses/${editingId}`, payload);
        toast.success('Public class updated');
      } else {
        await api.post('/masterclasses', payload);
        toast.success('Public class published');
      }
      setShowModal(false);
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save public class');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this public class?')) return;
    try {
      await api.delete(`/masterclasses/${id}`);
      toast.success('Public class deleted');
      fetchClasses();
    } catch {
      toast.error('Failed to delete public class');
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-4 font-[Plus_Jakarta_Sans]">
      <div className="flex items-center justify-between gap-3 bg-white border border-emerald-100/90 px-4 py-3 rounded-2xl shadow-xs">
        <div>
          <h1 className="text-sm font-extrabold text-gray-900 tracking-tight">Public Classes</h1>
          <p className="text-[11px] font-medium text-gray-400 mt-0.5">
            These appear on the public Classes page for free registrations.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200 flex items-center gap-1.5 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Public Class
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-white border border-emerald-100/90 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-10 text-center space-y-2">
          <Video className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-sm font-bold text-gray-900">No public classes yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Add your first free public class and it will instantly appear on the public Classes page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm transition-all flex flex-col">
              {cls.imageUrl ? (
                <div className="h-36 w-full overflow-hidden">
                  <img src={cls.imageUrl} alt={cls.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-20 w-full bg-gradient-to-br from-emerald-50 to-violet-100 flex items-center justify-center">
                  <Video className="w-7 h-7 text-emerald-500/70" />
                </div>
              )}
              <div className="p-4 flex flex-col gap-2.5 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100/80 text-emerald-900">
                    {cls.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                      cls.published !== false
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {cls.published !== false ? 'Published' : 'Draft'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug">{cls.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2">{cls.description || 'No description provided.'}</p>
                <div className="bg-gray-50/80 border border-gray-100 p-2.5 rounded-xl space-y-1.5 text-xs text-gray-700">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cls.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cls.time} IST · {cls.duration} min</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{cls.instructor || 'Instructor'} · {cls.capacity || 0} seats</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => openEdit(cls)}
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
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-emerald-100 rounded-2xl w-full max-w-2xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <h3 className="text-base font-extrabold text-gray-900">
                {editingId ? 'Edit Public Class' : 'Add Public Class'}
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
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Free German Pronunciation Workshop"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Instructor</label>
                  <input
                    type="text"
                    required
                    placeholder="Instructor name"
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Date</label>
                  <input
                    type="date"
                    required
                    min={today}
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-semibold transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Time (IST)</label>
                  <input
                    type="time"
                    required
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-semibold transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Duration (min)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-semibold transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Seats</label>
                  <input
                    type="number"
                    min={0}
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-semibold transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Image</label>
                {form.imageUrl ? (
                  <div className="relative overflow-hidden rounded-xl border border-gray-200">
                    <img src={form.imageUrl} alt="Cover preview" className="h-44 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: '' })}
                      className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-black/75"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-4 py-7 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/40">
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    ) : (
                      <ImagePlus className="h-6 w-6 text-emerald-600" />
                    )}
                    <span className="text-xs font-bold text-gray-700">
                      {uploading ? 'Uploading…' : 'Click to upload a cover image'}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400">JPG, PNG, WebP or GIF · max 5 MB</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="What learners will take away from this session..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="text-xs font-semibold text-gray-700">Publish on the public website</span>
              </label>
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
                {editingId ? 'Save Changes' : 'Publish Class'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
