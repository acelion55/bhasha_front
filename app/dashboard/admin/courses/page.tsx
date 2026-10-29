'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  X,
  IndianRupee,
  Clock,
  CalendarDays,
  Check,
  GraduationCap,
  Globe2,
} from 'lucide-react';
import { toast } from 'sonner';

const fieldClass =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 font-semibold text-gray-900 transition focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100';
const labelClass = 'mb-1.5 block text-xs font-bold text-gray-600';
const sectionTitle = 'text-[11px] font-black uppercase tracking-wider text-emerald-700';

interface CourseItem {
  _id: string;
  title: string;
  language: 'German' | 'English';
  level?: string;
  description?: string;
  price: number;
  currency?: string;
  billingPeriod?: 'one-time' | 'monthly';
  feeNote?: string;
  imageUrl?: string;
  durationDays?: number;
  durationLabel?: string;
  classDuration?: string;
  schedule?: string;
  features?: string[];
  examPrep?: string;
  certificate?: string;
  order?: number;
  isPublic?: boolean;
  createdAt: string;
}

const emptyForm = {
  title: '',
  language: 'German' as 'German' | 'English',
  level: '',
  description: '',
  price: 0,
  billingPeriod: 'one-time' as 'one-time' | 'monthly',
  feeNote: '',
  imageUrl: '',
  durationDays: 0,
  durationLabel: '',
  classDuration: '1:30 hours',
  schedule: 'Monday to Friday',
  features: '',
  examPrep: '',
  certificate: '',
  order: 0,
  isPublic: true,
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get<CourseItem[]>('/courses');
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (course: CourseItem) => {
    setEditingId(course._id);
    setForm({
      title: course.title || '',
      language: course.language || 'German',
      level: course.level || '',
      description: course.description || '',
      price: course.price ?? 0,
      billingPeriod: course.billingPeriod || 'one-time',
      feeNote: course.feeNote || '',
      imageUrl: course.imageUrl || '',
      durationDays: course.durationDays ?? 0,
      durationLabel: course.durationLabel || '',
      classDuration: course.classDuration || '',
      schedule: course.schedule || 'Monday to Friday',
      features: (course.features || []).join('\n'),
      examPrep: course.examPrep || '',
      certificate: course.certificate || '',
      order: course.order ?? 0,
      isPublic: course.isPublic !== false,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Course title is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        durationDays: Number(form.durationDays) || 0,
        order: Number(form.order) || 0,
        currency: 'INR',
        features: form.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      };
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        toast.success('Course updated');
      } else {
        await api.post('/courses', payload);
        toast.success('Course created');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const grouped = {
    German: courses.filter((c) => c.language === 'German'),
    English: courses.filter((c) => c.language === 'English'),
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-4 font-[Plus_Jakarta_Sans]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" /> Courses & Fees
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Manage the courses, durations and prices shown on the public website.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-200 flex items-center gap-1.5 transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-12 text-center text-xs font-bold text-gray-400">
          Loading courses...
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-12 text-center">
          <p className="text-sm font-bold text-gray-800">No courses yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Course" to create your first course.</p>
        </div>
      ) : (
        (['German', 'English'] as const).map((lang) =>
          grouped[lang].length === 0 ? null : (
            <div key={lang} className="space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 px-1 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-emerald-600" /> {lang}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {grouped[lang].map((course) => (
                  <div
                    key={course._id}
                    className="bg-white border border-emerald-100/90 rounded-2xl p-4 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {course.imageUrl ? (
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="w-12 h-12 object-contain rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs border border-emerald-100 flex-shrink-0">
                            {course.level || '📚'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-black text-gray-900 text-sm truncate">{course.title}</h3>
                            {course.isPublic === false && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                Hidden
                              </span>
                            )}
                          </div>
                          {course.level && (
                            <p className="text-[11px] font-bold text-emerald-700 mt-0.5">{course.level}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEdit(course)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200/70"
                          title="Edit course"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200/70"
                          title="Delete course"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {course.description && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{course.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-black border border-emerald-200/70">
                        <IndianRupee className="w-3 h-3" />
                        {(course.price ?? 0).toLocaleString('en-IN')}
                        {course.billingPeriod === 'monthly' && (
                          <span className="font-bold text-[10px]">/mo</span>
                        )}
                      </span>
                      {course.durationLabel && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 text-gray-700 text-[11px] font-bold border border-gray-200">
                          <CalendarDays className="w-3 h-3" /> {course.durationLabel}
                        </span>
                      )}
                      {course.classDuration && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 text-gray-700 text-[11px] font-bold border border-gray-200">
                          <Clock className="w-3 h-3" /> {course.classDuration}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )
      )}

      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="flex items-center gap-2 text-base font-black text-gray-900">
                  <GraduationCap className="h-5 w-5 text-emerald-600" />
                  {editingId ? 'Edit Course' : 'Add Course'}
                </h2>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {editingId
                    ? 'Update the fees, duration and details shown to learners.'
                    : 'Create a new course and publish it to the website.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
                <section>
                  <h3 className={sectionTitle}>Basics</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Course Title *</label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Baustein + A1"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Language *</label>
                      <select
                        value={form.language}
                        onChange={(e) =>
                          setForm({ ...form, language: e.target.value as 'German' | 'English' })
                        }
                        className={fieldClass}
                      >
                        <option value="German">German</option>
                        <option value="English">English</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Level</label>
                      <input
                        type="text"
                        value={form.level}
                        onChange={(e) => setForm({ ...form, level: e.target.value })}
                        placeholder="e.g. A1, B1, Intermediate"
                        className={fieldClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Description</label>
                      <textarea
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="What this course covers..."
                        className={`${fieldClass} resize-none`}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-gray-100 pt-5">
                  <h3 className={sectionTitle}>Pricing</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Price (INR)</label>
                      <input
                        type="number"
                        min={0}
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Billing</label>
                      <select
                        value={form.billingPeriod}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            billingPeriod: e.target.value as 'one-time' | 'monthly',
                          })
                        }
                        className={fieldClass}
                      >
                        <option value="one-time">One-time</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Fee note</label>
                      <input
                        type="text"
                        value={form.feeNote}
                        onChange={(e) => setForm({ ...form, feeNote: e.target.value })}
                        placeholder="e.g. ₹10,000 (Total Course Fees)"
                        className={fieldClass}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-gray-100 pt-5">
                  <h3 className={sectionTitle}>Landmark / Arch Image</h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Display image on the course card (choose a landmark arch preset or enter an image URL).
                  </p>
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className={labelClass}>Image URL or Path</label>
                      <input
                        type="text"
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="e.g. /courses-images/card-a1-arch.png or https://..."
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <span className="mb-1.5 block text-[11px] font-bold text-gray-500">
                        Quick Landmark Arch Presets:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, imageUrl: '/courses-images/card-a1-arch.png' })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${
                            form.imageUrl === '/courses-images/card-a1-arch.png'
                              ? 'border-red-400 bg-red-50 text-red-700 ring-2 ring-red-200'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          🏛️ A1 Brandenburg Gate
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, imageUrl: '/courses-images/card-a2-arch.png' })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${
                            form.imageUrl === '/courses-images/card-a2-arch.png'
                              ? 'border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-200'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          🌉 A2 Tower Bridge
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, imageUrl: '/courses-images/card-b1-arch.png' })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${
                            form.imageUrl === '/courses-images/card-b1-arch.png'
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          ⛪ B1 Sagrada Família
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, imageUrl: '/courses-images/card-b2-arch.png' })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${
                            form.imageUrl === '/courses-images/card-b2-arch.png'
                              ? 'border-purple-400 bg-purple-50 text-purple-700 ring-2 ring-purple-200'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          🗼 B2 Eiffel Tower
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, imageUrl: '/courses-images/english-banner-ben.png' })}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition border ${
                            form.imageUrl === '/courses-images/english-banner-ben.png'
                              ? 'border-blue-400 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                              : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          🕰️ Big Ben (English)
                        </button>
                      </div>
                    </div>

                    {form.imageUrl && (
                      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2.5">
                        <img
                          src={form.imageUrl}
                          alt="Preview"
                          className="h-14 w-14 rounded-lg border border-gray-200 bg-white object-contain p-1"
                        />
                        <div className="min-w-0 flex-1 text-xs text-gray-600">
                          <span className="block font-bold text-gray-800">Preview</span>
                          <span className="block truncate font-mono text-[11px] text-gray-500">
                            {form.imageUrl}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                <section className="border-t border-gray-100 pt-5">
                  <h3 className={sectionTitle}>Duration & details</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Duration (days)</label>
                      <input
                        type="number"
                        min={0}
                        value={form.durationDays}
                        onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Duration label</label>
                      <input
                        type="text"
                        value={form.durationLabel}
                        onChange={(e) => setForm({ ...form, durationLabel: e.target.value })}
                        placeholder="e.g. 45 days"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Class duration</label>
                      <input
                        type="text"
                        value={form.classDuration}
                        onChange={(e) => setForm({ ...form, classDuration: e.target.value })}
                        placeholder="e.g. 1:30 hours"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Schedule</label>
                      <input
                        type="text"
                        value={form.schedule}
                        onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                        placeholder="e.g. Monday to Friday"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Exam prep</label>
                      <input
                        type="text"
                        value={form.examPrep}
                        onChange={(e) => setForm({ ...form, examPrep: e.target.value })}
                        placeholder="e.g. 10 days Telc / Goethe prep"
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Certificate</label>
                      <input
                        type="text"
                        value={form.certificate}
                        onChange={(e) => setForm({ ...form, certificate: e.target.value })}
                        placeholder="e.g. Certificate after B1"
                        className={fieldClass}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Features (one per line)</label>
                      <textarea
                        rows={5}
                        value={form.features}
                        onChange={(e) => setForm({ ...form, features: e.target.value })}
                        placeholder={'Baustein: 15-day basic structure syllabus\nA1 completed in about 30 days'}
                        className={`${fieldClass} resize-none`}
                      />
                    </div>
                  </div>
                </section>

                <section className="border-t border-gray-100 pt-5">
                  <h3 className={sectionTitle}>Settings</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Display order</label>
                      <input
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                        className={fieldClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Visibility</label>
                      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={form.isPublic}
                          onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
                          className="h-4 w-4 accent-emerald-600"
                        />
                        Show on website
                      </label>
                    </div>
                  </div>
                </section>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-100 bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  <Check className="h-4 w-4" /> {saving ? 'Saving...' : editingId ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
