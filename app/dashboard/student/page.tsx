'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  Clock,
  Video,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Timer,
  Sparkles,
  Award,
  Plus,
  X,
  History,
  Check,
  RotateCcw,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';

interface StudentInfo {
  _id: string;
  name?: string;
  email?: string;
  category?: string;
}

interface Mentor {
  _id: string;
  name: string;
  email: string;
}

interface ClassItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  timing: string;
  mentor?: Mentor;
  mentorName?: string;
  mentorId?: any;
  students?: any[];
  enrolledStudents?: any[];
  maxStudents?: number;
  maxCapacity?: number;
  meetingLink?: string;
  status?: string;
  createdAt: string;
}

// Live timer that starts when the student clicks "Join Class"
function EnrolledTimer({ startMs }: { startMs: number }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateTimer = () => {
      setSeconds(Math.max(0, Math.floor((Date.now() - startMs) / 1000)));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startMs]);

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/15 to-teal-500/10 border-2 border-emerald-500/30 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
          <span className="w-3 h-3 rounded-full bg-emerald-600 relative" />
        </div>
        <div>
          <span className="text-xs sm:text-sm font-black uppercase text-emerald-950 tracking-wide flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-emerald-700" /> Active Class Timer
          </span>
          <p className="text-xs sm:text-sm font-bold text-emerald-800">
            Session joined — timer running
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="font-mono text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
          {pad(hrs)}:{pad(mins)}:{pad(secs)}
        </div>
        <span className="text-[10px] sm:text-xs font-black text-emerald-700 uppercase tracking-widest">
          Live Elapsed
        </span>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const isMentor = user?.role === 'mentor' || user?.role === 'teacher' || user?.role === 'admin';

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    user?.role === 'mentor' || user?.role === 'teacher' ? 'All' : (user?.category || 'A1')
  );
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [sessionStarts, setSessionStarts] = useState<Record<string, number>>({});
  const [hasCourseAccess, setHasCourseAccess] = useState<boolean | null>(null);

  // Mentor controls
  const [mentorTab, setMentorTab] = useState<'active' | 'previous'>('active');
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
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== 'mentor' && user?.role !== 'teacher' && user?.category) {
      setSelectedCategory(user.category);
    }
  }, [user]);

  useEffect(() => {
    const userId = user?.id || (user as any)?._id;
    if (userId) {
      const stored = JSON.parse(localStorage.getItem(`completed_classes_${userId}`) || '[]');
      setCompletedIds(stored);
    }
  }, [user]);

  useEffect(() => {
    fetchClasses();
  }, [selectedCategory, user]);

  useEffect(() => {
    const userId = user?.id || (user as any)?._id;
    if (isMentor || !userId) {
      setHasCourseAccess(true);
      return;
    }
    if ((user as any)?.isSubscribed === true) {
      setHasCourseAccess(true);
      return;
    }
    api
      .get('/subscriptions/me')
      .then((res) => setHasCourseAccess(Array.isArray(res.data) && res.data.length > 0))
      .catch(() => setHasCourseAccess(false));
  }, [user, isMentor]);

  useEffect(() => {
    const userId = user?.id || (user as any)?._id;
    if (!userId) return;
    const starts: Record<string, number> = {};
    classes.forEach((cls) => {
      const stored = localStorage.getItem(`class_join_start_${cls._id}_${userId}`);
      if (stored) starts[cls._id] = parseInt(stored, 10);
    });
    setSessionStarts(starts);
  }, [classes, user]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      const userId = user?.id || (user as any)?._id;
      // If mentor or teacher, query classes by their mentorId
      if (user?.role === 'mentor' || user?.role === 'teacher') {
        if (userId) {
          params.mentorId = userId;
        }
      }
      const res = await api.get<ClassItem[]>('/classes', { params });
      let list = res.data || [];

      // Strict fail-safe: mentor only sees classes where they are the assigned mentor
      if (user?.role === 'mentor' || user?.role === 'teacher') {
        list = list.filter((cls) => {
          const mId =
            cls.mentor?._id ||
            (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId);
          const mName =
            cls.mentor?.name ||
            (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) ||
            cls.mentorName;

          const matchesId = Boolean(mId && userId && String(mId) === String(userId));
          const matchesName = Boolean(
            mName &&
              user?.name &&
              mName.trim().toLowerCase() === user.name.trim().toLowerCase()
          );
          return matchesId || matchesName;
        });
      }

      setClasses(list);
    } catch {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (cls: ClassItem) => {
    try {
      setJoiningId(cls._id);
      const userId = user?.id || (user as any)?._id;
      await api.post(`/classes/${cls._id}/join`, { studentId: userId });

      if (userId) {
        const start = Date.now();
        localStorage.setItem(`class_join_start_${cls._id}_${userId}`, start.toString());
        setSessionStarts((prev) => ({ ...prev, [cls._id]: start }));
      }

      toast.success('Joined class! Live class timer has started.');
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to join class');
    } finally {
      setJoiningId(null);
    }
  };

  const handleStartSession = (cls: ClassItem) => {
    const userId = user?.id || (user as any)?._id;
    if (!userId) return;

    const key = `class_join_start_${cls._id}_${userId}`;
    const stored = localStorage.getItem(key);
    const start = stored ? parseInt(stored, 10) : Date.now();
    if (!stored) localStorage.setItem(key, start.toString());
    setSessionStarts((prev) => ({ ...prev, [cls._id]: start }));

    if (cls.meetingLink) {
      window.open(cls.meetingLink, '_blank', 'noopener,noreferrer');
    } else {
      toast.success('Class timer started. Your mentor will share the meeting link shortly.');
    }
  };

  const handleCompleteClass = (classId: string, title: string) => {
    const userId = user?.id || (user as any)?._id;
    if (!userId) return;

    const stored: string[] = JSON.parse(localStorage.getItem(`completed_classes_${userId}`) || '[]');
    if (!stored.includes(classId)) {
      stored.push(classId);
      localStorage.setItem(`completed_classes_${userId}`, JSON.stringify(stored));
      setCompletedIds([...stored]);
    }
    localStorage.removeItem(`class_join_start_${classId}_${userId}`);
    setSessionStarts((prev) => {
      const next = { ...prev };
      delete next[classId];
      return next;
    });

    toast.success(`Batch "${title}" marked as completed!`);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userId = user?.id || (user as any)?._id;
      const payload = {
        ...form,
        mentorId: userId,
        mentorName: user?.name || 'Instructor',
      };
      await api.post('/classes', payload);
      toast.success('New class batch published successfully!');
      setShowCreateModal(false);
      setForm({
        title: '',
        category: 'A1',
        description: '',
        timing: '',
        maxStudents: 15,
        meetingLink: '',
      });
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create class');
    } finally {
      setSubmitting(false);
    }
  };

  // Mentor toggles class between active and completed (previous)
  const handleToggleBatchStatus = async (classId: string, currentStatus?: string) => {
    try {
      setUpdatingStatusId(classId);
      const nextStatus = currentStatus === 'completed' ? 'upcoming' : 'completed';
      await api.put(`/classes/${classId}`, { status: nextStatus });
      toast.success(
        nextStatus === 'completed' 
          ? 'Batch marked as completed and moved to Previous Classes!' 
          : 'Batch reactivated and moved to Active Batches!'
      );
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update batch status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Mentor batch segregation: Active vs Previous
  const activeBatches = classes.filter((c) => c.status !== 'completed');
  const previousBatches = classes.filter((c) => c.status === 'completed');

  // Classes to display
  const displayedClasses = isMentor 
    ? (mentorTab === 'active' ? activeBatches : previousBatches)
    : classes;

  const categories = isMentor 
    ? ['All', 'A1', 'A2', 'B1', 'B2'] 
    : ['A1', 'A2', 'B1', 'B2'];

  return (
    <div className={`w-full max-w-none mx-auto font-[Plus_Jakarta_Sans] ${isMentor ? 'space-y-4' : 'space-y-5 sm:space-y-6'}`}>

      {/* Top Header & Status Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-emerald-100/90 shadow-xs ${
        isMentor ? 'p-3.5 sm:p-4 rounded-2xl' : 'p-4 sm:p-5 rounded-2xl sm:rounded-3xl'
      }`}>
        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base font-bold text-gray-800">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            {isMentor ? (
              <>
                Mentor Studio <strong className="text-emerald-950 font-black">{user?.name || 'Instructor'}</strong>
                {user?.category && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                    Level: {user.category === 'All' ? 'All Levels' : user.category}
                  </span>
                )}
              </>
            ) : (
              <>
                My Classes
              </>
            )}
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-50/70 px-2.5 py-0.5 rounded-lg">
            {isMentor 
              ? `${activeBatches.length} Active / ${previousBatches.length} Previous`
              : `${classes.length} ${classes.length === 1 ? 'Batch Available' : 'Batches Available'}`
            }
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {/* If mentor, show Create Batch button; If student, show Completed link */}
          {isMentor ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Class Batch</span>
            </button>
          ) : (
            <Link
              href="/dashboard/student/completed"
              className="px-3.5 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 font-black text-sm sm:text-base flex items-center gap-2 transition-colors shrink-0"
              title="View Completed Classes"
            >
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
              <span>Completed ({completedIds.length})</span>
            </Link>
          )}

          {isMentor && categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const isUserCat = user?.category === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 border border-gray-200 bg-gray-50/70'
                }`}
              >
                {cat === 'All' ? 'All' : cat}
                {isUserCat && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 ring-1 ring-white" />
                )}
              </button>
            );
          })}

          <button
            onClick={fetchClasses}
            disabled={loading}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50 ml-1 shrink-0"
            title="Refresh Classes"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mentor Specific: Active Batches vs Previous Batches Tabs */}
      {isMentor && (
        <div className="flex items-center gap-2 bg-white border border-emerald-100/90 p-1.5 rounded-2xl shadow-xs">
          <button
            onClick={() => setMentorTab('active')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              mentorTab === 'active'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Active Batches ({activeBatches.length})</span>
          </button>

          <button
            onClick={() => setMentorTab('previous')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
              mentorTab === 'previous'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Previous Classes / History ({previousBatches.length})</span>
          </button>
        </div>
      )}

      {/* Class Batches Grid */}
      {!isMentor && hasCourseAccess === false ? (
        <div className="bg-white border border-emerald-100/90 rounded-3xl p-10 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
            <Lock className="w-7 h-7 text-emerald-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Classes are locked
          </h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-sm mx-auto font-medium">
            Purchase any course plan to unlock live Classes Studio batches.
          </p>
          <Link
            href="/dashboard/student/payments"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-md shadow-emerald-600/20 transition-all"
          >
            View Course Plans <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : loading || (!isMentor && hasCourseAccess === null) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 bg-white border border-emerald-100/90 rounded-3xl p-6 animate-pulse"
            />
          ))}
        </div>
      ) : displayedClasses.length === 0 ? (
        <div className="bg-white border border-emerald-100/90 rounded-3xl p-12 sm:p-16 text-center space-y-3 shadow-xs">
          <BookOpen className="w-14 h-14 text-emerald-500 mx-auto" />
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isMentor
              ? (mentorTab === 'active' ? 'No active batches currently running' : 'No previous/completed classes recorded yet')
              : 'No active batches yet'}
          </h3>
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
            {isMentor
              ? (mentorTab === 'active'
                  ? 'Click "+ Create Class Batch" button above to publish your first cohort.'
                  : 'Completed classes and finished cohorts will automatically appear in this historical archive.')
              : 'New interactive sessions will appear here soon.'}
          </p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isMentor ? 'gap-3.5 sm:gap-4' : 'gap-5 sm:gap-6'}`}>
          {displayedClasses.map((cls) => {
            const userId = user?.id || (user as any)?._id;
            const studentIds = cls.enrolledStudents || cls.students || [];
            const isEnrolled = userId && studentIds.some((s: any) => (typeof s === 'object' ? s._id : s) === userId);
            const isCompleted = (userId && completedIds.includes(cls._id)) || cls.status === 'completed';
            const enrolledCount = studentIds.length;
            const maxCapacity = cls.maxStudents || cls.maxCapacity || 15;
            const isFull = enrolledCount >= maxCapacity;
            const mentorName = cls.mentor?.name || (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName || 'Senior Instructor';
            const percentFilled = Math.min(100, Math.round((enrolledCount / maxCapacity) * 100));

            return (
              <div
                key={cls._id}
                className={`bg-white border transition-all flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-md ${
                  isMentor ? 'rounded-2xl p-4 sm:p-5 gap-3.5' : 'rounded-3xl p-6 sm:p-7 gap-5'
                } ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isEnrolled
                    ? 'border-emerald-400 ring-2 ring-emerald-500/10'
                    : 'border-emerald-100/90 hover:border-emerald-300'
                }`}
              >
                {/* Completed Ribbon if Finished */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[10px] font-black px-3 py-0.5 rounded-bl-lg shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Completed Cohort
                  </div>
                )}

                <div className={isMentor ? 'space-y-3' : 'space-y-4'}>
                  {/* Category Pill and Seat Counter */}
                  <div className="flex items-center justify-between">
                    <span className={`font-black bg-emerald-100 text-emerald-900 ${
                      isMentor ? 'px-2.5 py-1 rounded-lg text-xs' : 'px-4 py-1.5 rounded-xl text-sm sm:text-base shadow-2xs'
                    }`}>
                      Level {cls.category}
                    </span>
                    <span className={`font-bold text-gray-700 flex items-center gap-1.5 ${
                      isMentor ? 'text-xs' : 'text-sm sm:text-base'
                    }`}>
                      <Users className={isMentor ? 'w-4 h-4 text-emerald-600' : 'w-5 h-5 text-emerald-600'} /> {enrolledCount} / {maxCapacity} Students
                    </span>
                  </div>

                  {/* Enrollment Stats Card for Mentor */}
                  {isMentor && (
                    <div className="bg-emerald-50/60 border border-emerald-100/80 rounded-xl p-2.5 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-black text-gray-700">
                        <span className="uppercase tracking-wider text-emerald-900 text-[11px]">Enrollment</span>
                        <span className="text-emerald-800 text-[11px]">{enrolledCount}/{maxCapacity} ({percentFilled}%)</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-emerald-200/60 overflow-hidden">
                        <div 
                          className="h-full bg-emerald-600 rounded-full transition-all duration-300" 
                          style={{ width: `${percentFilled}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Title & Description */}
                  <div>
                    <h3 className={`font-black text-gray-900 tracking-tight leading-snug ${
                      isMentor ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'
                    }`}>
                      {cls.title}
                    </h3>
                    <p className={`text-gray-600 line-clamp-2 mt-1.5 font-medium leading-relaxed ${
                      isMentor ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'
                    }`}>
                      {cls.description || 'Interactive live language sessions with native exercises.'}
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className={`border border-gray-100 text-gray-800 ${
                    isMentor ? 'bg-gray-50/80 p-3 rounded-xl space-y-1.5 text-xs' : 'bg-gray-50/90 p-4 sm:p-5 rounded-2xl space-y-2.5 text-base'
                  }`}>
                    <div className="flex items-center gap-2 font-black text-gray-900">
                      <Clock className={`${isMentor ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'} text-emerald-600 shrink-0`} />
                      <span className={isMentor ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'}>{cls.timing || 'Schedule TBA'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-800 font-bold">
                      <GraduationCap className={`${isMentor ? 'w-4 h-4' : 'w-5 h-5 sm:w-6 sm:h-6'} text-emerald-600 shrink-0`} />
                      <span className={isMentor ? 'text-xs sm:text-sm' : 'text-base sm:text-lg'}>Mentor: {mentorName}</span>
                    </div>
                    {cls.meetingLink && isMentor && (
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm underline truncate"
                        >
                          {cls.meetingLink}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Live Timer once the student joins the class */}
                  {!isMentor && isEnrolled && !isCompleted && sessionStarts[cls._id] && (
                    <EnrolledTimer startMs={sessionStarts[cls._id]} />
                  )}
                </div>

                {/* Bottom Buttons / Actions */}
                <div className={`border-t border-gray-100 ${isMentor ? 'pt-3' : 'pt-4'}`}>
                  {isMentor ? (
                    /* Mentor Actions */
                    <div className="space-y-2">
                      {/* View Student Roster */}
                      <button
                        onClick={() => setSelectedClassForStudents(cls)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>View Enrolled Roster ({enrolledCount})</span>
                      </button>

                      {/* Start Live Class (for active batches) */}
                      {cls.status !== 'completed' && cls.meetingLink && (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" /> Start Live Class
                        </a>
                      )}

                      {/* Conclude Cohort / Reactivate Cohort */}
                      <button
                        onClick={() => handleToggleBatchStatus(cls._id, cls.status)}
                        disabled={updatingStatusId === cls._id}
                        className={`w-full py-2 px-3 rounded-xl font-bold text-xs border transition-colors flex items-center justify-center gap-1.5 ${
                          cls.status === 'completed'
                            ? 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                            : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        {cls.status === 'completed' ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5 text-gray-600" /> Reactivate / Move to Active
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-700" /> Mark as Completed (End Cohort)
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Student Actions */
                    <>
                      {isCompleted ? (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-center gap-2 text-base font-black text-emerald-900 bg-emerald-100/60 py-3 rounded-2xl border border-emerald-300">
                            <CheckCircle2 className="w-5 h-5 text-emerald-700" /> Class Completed
                          </div>
                          <Link
                            href="/dashboard/student/completed"
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-sm sm:text-base transition-colors"
                          >
                            <Award className="w-4 h-4 text-emerald-600" /> View in Completed Classes
                          </Link>
                        </div>
                      ) : isEnrolled ? (
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-center gap-2 text-base font-black text-emerald-800 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Enrolled in Batch
                          </div>
                          <button
                            onClick={() => handleStartSession(cls)}
                            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base sm:text-lg shadow-md shadow-emerald-600/20 transition-all"
                          >
                            <Video className="w-5 h-5 sm:w-6 sm:h-6" /> Join Class
                          </button>
                          {!cls.meetingLink && (
                            <p className="text-xs sm:text-sm text-center text-gray-400 font-medium">
                              Timer will start now. Meeting link will be shared by your mentor.
                            </p>
                          )}
                          <button
                            onClick={() => handleCompleteClass(cls._id, cls.title)}
                            className="w-full py-3 rounded-2xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2"
                          >
                            <Award className="w-4 h-4 text-emerald-600" /> Mark as Completed
                          </button>
                        </div>
                      ) : isFull ? (
                        <button
                          disabled
                          className="w-full py-4 rounded-2xl bg-gray-100 text-gray-400 font-black text-base sm:text-lg cursor-not-allowed text-center"
                        >
                          Batch Full
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoinClass(cls)}
                          disabled={joiningId === cls._id}
                          className="w-full py-4 sm:py-4.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base sm:text-lg shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                        >
                          {joiningId === cls._id ? 'Joining Class...' : 'Join Class'}
                          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mentor: Create Class Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-emerald-100 w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Create New Class Batch</h3>
                <p className="text-sm sm:text-base text-gray-500 font-medium">Setup class schedule & student capacity</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2.5 text-gray-400 hover:text-gray-600 rounded-2xl hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm sm:text-base font-black text-gray-800 mb-1.5">Batch Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. A1 German Evening Speaking Practice"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-emerald-600 text-base font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-black text-gray-800 mb-1.5">Target Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-emerald-600 text-base font-medium"
                  >
                    {['A1', 'A2', 'B1', 'B2'].map((cat) => (
                      <option key={cat} value={cat}>Category {cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-black text-gray-800 mb-1.5">Max Students</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={form.maxStudents}
                    onChange={(e) => setForm({ ...form, maxStudents: Number(e.target.value) })}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-emerald-600 text-base font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-black text-gray-800 mb-1.5">Class Schedule / Timing</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mon, Wed, Fri - 7:00 PM to 8:00 PM IST"
                  value={form.timing}
                  onChange={(e) => setForm({ ...form, timing: e.target.value })}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-emerald-600 text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-black text-gray-800 mb-1.5">Google Meet / Zoom URL</label>
                <input
                  type="url"
                  placeholder="e.g. https://meet.google.com/abc-defg-hij"
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-emerald-600 text-base font-medium"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-black text-gray-800 mb-1.5">Class Overview / Syllabus</label>
                <textarea
                  rows={3}
                  placeholder="Provide details about topics covered in this batch..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-emerald-600 text-base font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-3 rounded-2xl bg-gray-100 text-gray-700 font-bold text-base hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-base shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Publish Class Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor: Enrolled Students Roster Modal */}
      {selectedClassForStudents && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-emerald-100 w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs sm:text-sm font-black uppercase text-emerald-700 tracking-wider">
                  Enrolled Student Roster ({selectedClassForStudents.enrolledStudents?.length || selectedClassForStudents.students?.length || 0} Students)
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">{selectedClassForStudents.title}</h3>
              </div>
              <button
                onClick={() => setSelectedClassForStudents(null)}
                className="p-2.5 text-gray-400 hover:text-gray-600 rounded-2xl hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {(!selectedClassForStudents.enrolledStudents?.length && !selectedClassForStudents.students?.length) ? (
                <div className="p-10 text-center text-gray-400 text-base font-medium">
                  No students enrolled in this batch yet.
                </div>
              ) : (
                (selectedClassForStudents.enrolledStudents || selectedClassForStudents.students || []).map((st: any, idx: number) => {
                  const name = typeof st === 'object' ? (st.name || 'Student') : 'Student';
                  const email = typeof st === 'object' ? (st.email || '') : '';
                  const cat = typeof st === 'object' ? (st.category || selectedClassForStudents.category) : selectedClassForStudents.category;

                  return (
                    <div
                      key={st._id || idx}
                      className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-base text-gray-900">{name}</p>
                          {email && <p className="text-xs sm:text-sm text-gray-500 font-medium">{email}</p>}
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-black bg-emerald-100 text-emerald-900">
                        Category {cat}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedClassForStudents(null)}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-xs"
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