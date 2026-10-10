'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { 
  Calendar, 
  Users, 
  Clock, 
  Plus, 
  Video, 
  Edit, 
  X, 
  Check, 
  BookOpen, 
  User, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentInfo {
  _id: string;
  name: string;
  email: string;
  category?: string;
}

interface ClassItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  timing: string;
  meetingLink?: string;
  maxStudents: number;
  students: StudentInfo[];
  createdAt: string;
}

export default function MentorDashboardPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<ClassItem | null>(null);

  const [form, setForm] = useState({
    title: '',
    category: 'A1',
    description: '',
    timing: '',
    maxStudents: 15,
    meetingLink: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMentorClasses();
  }, []);

  const fetchMentorClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get<ClassItem[]>('/classes/mentor/my-classes');
      setClasses(res.data);
    } catch (err: any) {
      toast.error('Failed to load mentor classes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/classes', form);
      toast.success('New class created successfully!');
      setShowCreateModal(false);
      setForm({
        title: '',
        category: 'A1',
        description: '',
        timing: '',
        maxStudents: 15,
        meetingLink: '',
      });
      fetchMentorClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-indigo-800 p-8 text-white shadow-xl shadow-emerald-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Mentor Studio & Schedule</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Hello, Mentor <span className="text-amber-200">{user?.name}</span>
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              Create custom language batches, set timings, track enrolled student rosters, and launch live video classrooms.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all flex-shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Create New Class Batch
          </button>
        </div>
      </div>

      {/* Classes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">My Teaching Schedule</h2>
            <p className="text-xs text-gray-500">Manage timings and view registered students for each class</p>
          </div>
          <span className="font-extrabold text-xs text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
            {classes.length} Active Batches
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-white border border-emerald-100 p-6 animate-pulse" />
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No classes created yet</h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto">
              Click the "Create New Class Batch" button to setup your first live tutoring session.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
            >
              Create Class Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <div key={cls._id} className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition-all space-y-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700">
                      Category {cls.category}
                    </span>
                    <h3 className="text-lg font-extrabold text-gray-900 mt-2">{cls.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cls.description || 'Live batch session'}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-bold text-gray-400">Capacity</span>
                    <p className="text-sm font-extrabold text-emerald-700">
                      {cls.students?.length || 0} / {cls.maxStudents}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Timing: {cls.timing}</span>
                  </div>
                  {cls.meetingLink && (
                    <div className="flex items-center gap-2 text-gray-600 truncate">
                      <LinkIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <a href={cls.meetingLink} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline truncate">
                        {cls.meetingLink}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedClassForStudents(cls)}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    View Enrolled Roster ({cls.students?.length || 0})
                  </button>

                  {cls.meetingLink && (
                    <a
                      href={cls.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-200"
                    >
                      <Video className="w-4 h-4" /> Start Class
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-emerald-100 w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Create New Class Batch</h3>
                <p className="text-xs text-gray-500">Setup class schedule & student capacity</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Batch Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A1 German Evening Speaking Practice"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:outline-none focus:border-emerald-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Target Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:outline-none focus:border-emerald-600 font-semibold"
                  >
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((cat) => (
                      <option key={cat} value={cat}>Category {cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Students</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={form.maxStudents}
                    onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:outline-none focus:border-emerald-600 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Class Schedule / Timing</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mon, Wed, Fri - 7:00 PM to 8:00 PM IST"
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:outline-none focus:border-emerald-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Google Meet / Zoom URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:outline-none focus:border-emerald-600 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Class Overview / Syllabus</label>
                <textarea
                  rows={3}
                  placeholder="Provide details about topics covered in this batch..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 focus:outline-none focus:border-emerald-600 font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md shadow-emerald-200"
                >
                  {submitting ? 'Creating...' : 'Publish Class Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enrolled Students Roster Modal */}
      {selectedClassForStudents && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-emerald-100 w-full max-w-xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600">Enrolled Student Roster</span>
                <h3 className="text-lg font-extrabold text-gray-900">{selectedClassForStudents.title}</h3>
              </div>
              <button onClick={() => setSelectedClassForStudents(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {!selectedClassForStudents.students || selectedClassForStudents.students.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">No students enrolled in this batch yet.</div>
              ) : (
                selectedClassForStudents.students.map((st, idx) => (
                  <div key={st._id || idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-700 font-bold flex items-center justify-center">
                        {st.name ? st.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <div>
                        <p className="font-extrabold text-gray-900">{st.name}</p>
                        <p className="text-[11px] text-gray-500">{st.email}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                      Category {st.category || selectedClassForStudents.category}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedClassForStudents(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
