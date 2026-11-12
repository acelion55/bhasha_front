'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  GraduationCap,
  Users,
  Search,
  X,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  IdCard,
  Sparkles,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';

interface EnrolledStudent {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  studentId?: string;
  category?: string;
  language?: string;
  createdAt?: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  language?: string;
  category?: string;
}

interface ClassItem {
  _id: string;
  title: string;
  language?: string;
  category: string;
  categories?: string[];
  isConversational?: boolean;
  description?: string;
  timing: string;
  weekdays?: string[];
  startDate?: string;
  startTime?: string;
  mentorName?: string;
  mentorId?: any;
  enrolledStudents?: (string | EnrolledStudent)[];
  students?: (string | EnrolledStudent)[];
  maxStudents?: number;
  maxCapacity?: number;
  meetingLink?: string;
  status?: string;
  createdAt: string;
}

export default function AdminMentorClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorFilter, setMentorFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // Roster Modal
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [rosterSearch, setRosterSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clsRes, userRes] = await Promise.all([
        api.get<ClassItem[]>('/classes'),
        api.get<{ users: User[] }>('/admin/users?limit=200'),
      ]);
      const allUsers = userRes.data.users || [];
      const mentorUsers = allUsers.filter((u) => u.role === 'mentor');
      setMentors(mentorUsers);

      const mentorIdSet = new Set(mentorUsers.map((m) => String(m._id)));
      const mentorNameSet = new Set(mentorUsers.map((m) => m.name.trim().toLowerCase()));

      // Filter strictly classes created by or assigned to Mentors
      const mentorOnlyClasses = (clsRes.data || []).filter((cls) => {
        const mRole = typeof cls.mentorId === 'object' ? cls.mentorId?.role : undefined;
        const mId = typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId;
        const mName =
          (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName;

        if (mRole === 'mentor') return true;
        if (mId && mentorIdSet.has(String(mId))) return true;
        if (mName && mentorNameSet.has(mName.trim().toLowerCase())) return true;
        return false;
      });

      setClasses(mentorOnlyClasses);
    } catch {
      toast.error('Failed to load mentor classes');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (cls: ClassItem) => {
    try {
      setUpdatingStatusId(cls._id);
      const nextStatus = cls.status === 'completed' ? 'upcoming' : 'completed';
      await api.put(`/classes/${cls._id}`, { status: nextStatus });
      toast.success(
        nextStatus === 'completed'
          ? 'Mentor class marked as completed'
          : 'Mentor class reactivated'
      );
      fetchData();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mentor class?')) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success('Mentor class deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete class');
    }
  };

  const filteredClasses = classes.filter((cls) => {
    if (statusFilter === 'active' && cls.status === 'completed') return false;
    if (statusFilter === 'completed' && cls.status !== 'completed') return false;
    if (languageFilter !== 'all' && (cls.language || 'German') !== languageFilter) return false;

    const mId = typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId;
    const mName = (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName || '';

    if (mentorFilter !== 'all' && String(mId) !== mentorFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = cls.title.toLowerCase().includes(q);
      const matchMentor = mName.toLowerCase().includes(q);
      const matchLevel = (cls.category || '').toLowerCase().includes(q);
      const matchLang = (cls.language || '').toLowerCase().includes(q);
      if (!matchTitle && !matchMentor && !matchLevel && !matchLang) return false;
    }

    return true;
  });

  const getMentorDetails = (cls: ClassItem) => {
    const mId = typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId;
    const mObj = typeof cls.mentorId === 'object' ? cls.mentorId : null;
    const found = mentors.find((m) => String(m._id) === String(mId));
    return {
      name: found?.name || mObj?.name || cls.mentorName || 'Mentor',
      email: found?.email || mObj?.email || '',
      language: found?.language || mObj?.language || cls.language || 'German',
    };
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-6 font-[Plus_Jakarta_Sans] p-2 sm:p-4">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Mentor Classes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200">
              {classes.length} {classes.length === 1 ? 'Class' : 'Classes'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            All classes created by Mentors are shown here and automatically appear to A1 &amp; A2 level students.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search mentor classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1E2B7B]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#1E2B7B]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => {
            setMentorFilter('all');
            setLanguageFilter('all');
            setStatusFilter('all');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
            mentorFilter === 'all' && languageFilter === 'all' && statusFilter === 'all' && !searchQuery
              ? 'bg-[#1E2B7B] text-white shadow-xs'
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
          }`}
        >
          All Mentor Classes
        </button>

        {/* By Mentor */}
        <div className="relative inline-flex items-center">
          <select
            value={mentorFilter}
            onChange={(e) => setMentorFilter(e.target.value)}
            className={`appearance-none pl-3.5 pr-8 py-2 rounded-full text-xs font-black cursor-pointer border transition-all ${
              mentorFilter !== 'all'
                ? 'bg-[#1E2B7B] text-white border-[#1E2B7B]'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <option value="all">By Mentor</option>
            {mentors.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.language || 'German'})
              </option>
            ))}
          </select>
          <ChevronDown
            className={`w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${
              mentorFilter !== 'all' ? 'text-white' : 'text-gray-400'
            }`}
          />
        </div>

        {/* By Language */}
        <div className="relative inline-flex items-center">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className={`appearance-none pl-3.5 pr-8 py-2 rounded-full text-xs font-black cursor-pointer border transition-all ${
              languageFilter !== 'all'
                ? 'bg-[#1E2B7B] text-white border-[#1E2B7B]'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <option value="all">By Language</option>
            <option value="German">German</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Conversational">Conversational</option>
          </select>
          <ChevronDown
            className={`w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${
              languageFilter !== 'all' ? 'text-white' : 'text-gray-400'
            }`}
          />
        </div>

        {/* By Status */}
        <div className="relative inline-flex items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'completed')}
            className={`appearance-none pl-3.5 pr-8 py-2 rounded-full text-xs font-black cursor-pointer border transition-all ${
              statusFilter !== 'all'
                ? 'bg-[#1E2B7B] text-white border-[#1E2B7B]'
                : 'bg-white text-gray-700 border-gray-200'
            }`}
          >
            <option value="all">By Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <ChevronDown
            className={`w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${
              statusFilter !== 'all' ? 'text-white' : 'text-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white border border-gray-100 rounded-3xl p-5 animate-pulse" />
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <BookOpen className="w-10 h-10 text-purple-300 mx-auto" />
          <h3 className="text-base font-extrabold text-gray-800">No mentor classes found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto font-medium">
            When users with the Mentor role create live classes from their Mentor Studio, they will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const mentorInfo = getMentorDetails(cls);
            const students = (cls.enrolledStudents || cls.students || []).filter(Boolean);
            const maxCap = cls.maxCapacity || cls.maxStudents || 15;
            const isActive = cls.status !== 'completed';
            const levels =
              cls.categories && cls.categories.length > 0
                ? cls.categories
                : (cls.category ? cls.category.split(',').map((s) => s.trim()).filter(Boolean) : ['A1', 'A2']);

            return (
              <div
                key={cls._id}
                className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                        {cls.language || 'German'}
                      </span>
                      {cls.isConversational && (
                        <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Conversational
                        </span>
                      )}
                      {levels.map((lvl) => (
                        <span
                          key={lvl}
                          className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          {lvl}
                        </span>
                      ))}
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      {isActive ? 'Active' : 'Completed'}
                    </span>
                  </div>

                  {/* Class Title & Timing */}
                  <div>
                    <h3 className="text-base font-black text-gray-900 leading-snug">{cls.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mt-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{cls.timing || 'Schedule TBA'}</span>
                    </div>
                  </div>

                  {/* Mentor Card Box */}
                  <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                        {mentorInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-gray-900 truncate">{mentorInfo.name}</span>
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-200/80 text-purple-900 uppercase">
                            Mentor
                          </span>
                        </div>
                        {mentorInfo.email && (
                          <p className="text-[11px] text-gray-500 truncate">{mentorInfo.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Meeting Link Preview */}
                  {cls.meetingLink && (
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold truncate px-1">
                      <Video className="w-3.5 h-3.5 shrink-0" />
                      <a
                        href={cls.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline truncate"
                      >
                        {cls.meetingLink}
                      </a>
                    </div>
                  )}

                  {/* Auto-visibility info */}
                  <p className="text-[11px] font-bold text-purple-700 bg-purple-50/50 px-2.5 py-1.5 rounded-xl border border-purple-100/80">
                    Visible to A1 &amp; A2 level students
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClass(cls);
                      setRosterSearch('');
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#1E2B7B]" />
                    <span>
                      Students ({students.length}/{maxCap})
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={updatingStatusId === cls._id}
                    onClick={() => handleToggleStatus(cls)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    title={isActive ? 'Mark Completed' : 'Reactivate'}
                  >
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <RotateCcw className="w-4 h-4 text-gray-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(cls._id)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Class"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clean Big Students Roster Dialog */}
      {selectedClass && (() => {
        const mentorInfo = getMentorDetails(selectedClass);
        const rawStudents = (selectedClass.enrolledStudents || selectedClass.students || []).filter(Boolean);
        const filteredRoster = rawStudents.filter((st: any) => {
          if (typeof st !== 'object') return true;
          if (!rosterSearch.trim()) return true;
          const q = rosterSearch.toLowerCase();
          return (
            (st.name || '').toLowerCase().includes(q) ||
            (st.email || '').toLowerCase().includes(q) ||
            (st.phoneNumber || '').toLowerCase().includes(q) ||
            (st.studentId || '').toLowerCase().includes(q)
          );
        });

        return (
          <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white border border-gray-200/90 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[88vh] overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-slate-50/80 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 border border-purple-200">
                      Mentor Class
                    </span>
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-800">
                      {selectedClass.language || 'German'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mt-1.5">{selectedClass.title}</h3>
                  <p className="text-xs text-gray-600 font-semibold mt-0.5">
                    Mentor: <strong className="text-gray-900">{mentorInfo.name}</strong> • {selectedClass.timing}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClass(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-gray-800">
                  Enrolled Students ({rawStudents.length})
                </span>
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#1E2B7B]"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {filteredRoster.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Users className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-sm font-bold text-gray-700">No students enrolled in this mentor class yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredRoster.map((st: any, idx: number) => {
                      const name = typeof st === 'object' ? st.name || 'Student' : 'Student';
                      const email = typeof st === 'object' ? st.email || '' : '';
                      const phone = typeof st === 'object' ? st.phoneNumber || '' : '';
                      const studentId = typeof st === 'object' ? st.studentId || '' : '';
                      const cat = typeof st === 'object' ? st.category || 'A1' : '';
                      return (
                        <div
                          key={typeof st === 'object' ? st._id || idx : idx}
                          className="p-4 rounded-2xl border border-gray-200/80 bg-slate-50/50 flex items-center gap-3"
                        >
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 font-black flex items-center justify-center shrink-0">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-black text-gray-900 truncate">{name}</span>
                              {cat && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  {cat}
                                </span>
                              )}
                            </div>
                            {email && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3 shrink-0" /> {email}
                              </p>
                            )}
                            {phone && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3 shrink-0" /> +{phone}
                              </p>
                            )}
                            {studentId && (
                              <p className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
                                <IdCard className="w-3 h-3 shrink-0" /> {studentId}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50/60 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedClass(null)}
                  className="px-5 py-2 rounded-xl bg-[#1E2B7B] text-white text-xs font-black cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
