'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getNextUpcomingSession, getClassJoinStatus, getBatchSessionState } from '@/lib/session-time';
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
  Lock,
  Calendar,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Target,
  CalendarCheck,
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
  language?: string;
  category: string;
  categories?: string[];
  description: string;
  timing: string;
  weekdays?: string[];
  startDate?: string;
  endDate?: string;
  startTime?: string;
  mentor?: Mentor;
  mentorName?: string;
  mentorId?: any;
  students?: any[];
  enrolledStudents?: any[];
  maxStudents?: number;
  maxCapacity?: number;
  meetingLink?: string;
  status?: string;
  completedSessions?: string[];
  lastCompletedSessionDate?: string;
  activeSessionDate?: string;
  materials?: { _id?: string; title: string; url: string; fileName?: string; uploadedAt?: string }[];
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

const ALL_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WEEKDAY_JS_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function countScheduledClassesInBatch(cls: ClassItem): number | null {
  if (!cls.startDate || !cls.endDate) return null;
  const start = new Date(`${cls.startDate}T00:00:00`);
  const end = new Date(`${cls.endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return null;

  const days = (cls.weekdays && cls.weekdays.length > 0 ? cls.weekdays : [])
    .map((d) => WEEKDAY_JS_INDEX[d])
    .filter((idx) => typeof idx === 'number');

  let count = 0;
  const cur = new Date(start);
  let guard = 0;
  while (cur <= end && guard < 400) {
    if (days.length === 0 || days.includes(cur.getDay())) {
      count += 1;
    }
    cur.setDate(cur.getDate() + 1);
    guard += 1;
  }
  return count > 0 ? count : null;
}

function formatBatchDaysRange(weekdays?: string[]): string {
  if (!weekdays || weekdays.length === 0) return 'Flexible Schedule';
  const ordered = ALL_WEEKDAYS.filter((d) => weekdays.includes(d));
  if (ordered.length === 0) return weekdays.join(', ');
  if (ordered.length === 1) return ordered[0];

  const indexes = ordered.map((d) => ALL_WEEKDAYS.indexOf(d));
  const isContiguous = indexes.every((val, idx) => idx === 0 || val === indexes[idx - 1] + 1);
  if (isContiguous && (ordered.length >= 3 || (ordered[0] === 'Sat' && ordered[1] === 'Sun'))) {
    return `${ordered[0]} – ${ordered[ordered.length - 1]}`;
  }
  return ordered.join(', ');
}

export const isRecurringClass = (c: any): boolean =>
  Boolean(
    c.isConversational ||
    c.language === 'Conversational' ||
    (c.categories && c.categories.includes('Conversational')) ||
    (c.category && typeof c.category === 'string' && c.category.toLowerCase().includes('conversational')) ||
    (c.weekdays && Array.isArray(c.weekdays) && c.weekdays.length > 0)
  );

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const isMentor = user?.role === 'mentor' || user?.role === 'teacher' || user?.role === 'admin';

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [batchMaterials, setBatchMaterials] = useState<
    {
      batchId: string;
      batchTitle: string;
      language?: string;
      category?: string;
      materials: { _id?: string; title: string; url: string; fileName?: string; uploadedAt?: string }[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    user?.role === 'mentor' || user?.role === 'teacher' ? 'All' : (user?.category || 'A1')
  );
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [completingSessionId, setCompletingSessionId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [studentAttendedDates, setStudentAttendedDates] = useState<Record<string, string[]>>({});
  const [sessionStarts, setSessionStarts] = useState<Record<string, number>>({});
  const [hasCourseAccess, setHasCourseAccess] = useState<boolean | null>(null);
  const [mentorsList, setMentorsList] = useState<any[]>([]);
  const [showMentorsModal, setShowMentorsModal] = useState(false);

  // Mentor controls
  const [mentorTab, setMentorTab] = useState<'active' | 'previous'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<ClassItem | null>(null);
  const [rosterTab, setRosterTab] = useState<'current' | 'previous'>('current');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

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

  const handleSelectWeekdays = (days: string[], timeVal = startTime) => {
    setSelectedWeekdays(days);
    if (days.length > 0) {
      const next = getNextUpcomingSession(days, timeVal);
      if (next) {
        setStartDate(next.dateStr);
      }
    }
  };

  const toggleWeekday = (day: string) => {
    const nextDays = selectedWeekdays.includes(day)
      ? selectedWeekdays.filter((d) => d !== day)
      : [...selectedWeekdays, day];
    handleSelectWeekdays(nextDays);
  };

  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime);
    if (selectedWeekdays.length > 0) {
      const next = getNextUpcomingSession(selectedWeekdays, newTime);
      if (next) {
        setStartDate(next.dateStr);
      }
    }
  };

  const [form, setForm] = useState({
    title: '',
    language: user?.language || 'German',
    isConversational: false,
    category: 'A1',
    categories: ['A1'] as string[],
    description: '',
    timing: '',
    maxStudents: 15,
    meetingLink: '',
  });

  const toggleCategory = (lvl: string) => {
    setForm((prev) => {
      if (user?.role === 'mentor') {
        if (lvl !== 'A1' && lvl !== 'A2') return prev;
        const exists = prev.categories.includes(lvl);
        const next = exists
          ? prev.categories.filter((c) => c !== lvl)
          : [...prev.categories, lvl];
        const safeNext = next.length > 0 ? next : [lvl];
        return {
          ...prev,
          categories: safeNext,
          category: safeNext.join(', '),
        };
      }
      if (prev.isConversational) {
        const exists = prev.categories.includes(lvl);
        const next = exists
          ? prev.categories.filter((c) => c !== lvl)
          : [...prev.categories, lvl];
        return {
          ...prev,
          categories: next.length > 0 ? next : [lvl],
          category: (next.length > 0 ? next : [lvl]).join(', '),
        };
      }
      return {
        ...prev,
        categories: [lvl],
        category: lvl,
      };
    });
  };
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
      try {
        const storedAttended = JSON.parse(localStorage.getItem(`student_attended_dates_${userId}`) || '{}');
        if (storedAttended && typeof storedAttended === 'object') {
          setStudentAttendedDates(storedAttended);
        }
      } catch {
        setStudentAttendedDates({});
      }
    }
  }, [user]);

  const recordAttendanceToday = (classId: string) => {
    const userId = user?.id || (user as any)?._id;
    if (!userId || isMentor) return;
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setStudentAttendedDates((prev) => {
      const curList = prev[classId] || [];
      if (curList.includes(todayStr)) return prev;
      const next = { ...prev, [classId]: [...curList, todayStr] };
      localStorage.setItem(`student_attended_dates_${userId}`, JSON.stringify(next));
      return next;
    });
  };

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
    const isBeginnerStudent = !user?.category || ['A1', 'A2', 'All', ''].includes(user.category);
    if (!isMentor && hasCourseAccess === true && isBeginnerStudent) {
      api
        .get('/classes/mentors', {
          params: { language: user?.language || 'German', studentId: userId },
        })
        .then((mRes) => setMentorsList(mRes.data || []))
        .catch(() => {});
    } else if (!isMentor) {
      setMentorsList([]);
      setShowMentorsModal(false);
    }
  }, [hasCourseAccess, isMentor, user]);

  useEffect(() => {
    const userId = user?.id || (user as any)?._id;
    if (!userId) return;
    const starts: Record<string, number> = {};
    const now = Date.now();
    classes.forEach((cls) => {
      const key = `class_join_start_${cls._id}_${userId}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const val = parseInt(stored, 10);
        // Expire session timer if older than 3 hours so student isn't permanently stuck in active session
        if (now - val < 3 * 60 * 60 * 1000) {
          starts[cls._id] = val;
        } else {
          localStorage.removeItem(key);
        }
      }
    });
    setSessionStarts(starts);
  }, [classes, user]);

  // 30-second ticker to dynamically refresh 10-minute join countdowns
  const [, setClockTick] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setClockTick(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

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
      } else {
        // Req 1: batches shown by language base to student
        params.language = user?.language || 'German';
      }
      const res = await api.get<ClassItem[]>('/classes', { params });
      let list = res.data || [];

      // Fetch mentors for student's language cohort (only for subscribed A1 & A2 students)
      const isBeginnerStudent = !user?.category || ['A1', 'A2', 'All', ''].includes(user.category);
      if (!isMentor && isBeginnerStudent && ((user as any)?.isSubscribed === true || hasCourseAccess === true)) {
        try {
          const mRes = await api.get('/classes/mentors', {
            params: {
              language: user?.language || 'German',
              studentId: userId,
            },
          });
          setMentorsList(mRes.data || []);
        } catch {}
      } else if (!isMentor) {
        setMentorsList([]);
      }

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

      if (!isMentor) {
        try {
          const matRes = await api.get('/classes/student/my-materials');
          setBatchMaterials(Array.isArray(matRes.data) ? matRes.data : []);
        } catch {
          setBatchMaterials([]);
        }
      }
    } catch {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (cls: ClassItem) => {
    const { joinStatus, awaitingTeacherCompletion } = getBatchSessionState(cls);
    if (awaitingTeacherCompletion) {
      toast.warning('Next class details are locked until your teacher marks the previous class as complete.');
      return;
    }
    if (!joinStatus.canJoin) {
      toast.warning(
        `You can only join the class 10 minutes before the scheduled time (${joinStatus.reason}). Please join at ${joinStatus.opensAtTimeStr}!`
      );
      return;
    }

    try {
      setJoiningId(cls._id);
      const userId = user?.id || (user as any)?._id;
      await api.post(`/classes/${cls._id}/join`, { studentId: userId });

      if (userId) {
        const start = Date.now();
        localStorage.setItem(`class_join_start_${cls._id}_${userId}`, start.toString());
        setSessionStarts((prev) => ({ ...prev, [cls._id]: start }));
        recordAttendanceToday(cls._id);
      }

      toast.success('Joined class! Live class timer has started.');
      fetchClasses();
      if (cls.meetingLink) {
        window.open(cls.meetingLink, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to join class');
    } finally {
      setJoiningId(null);
    }
  };

  const handleStartSession = async (cls: ClassItem) => {
    const userId = user?.id || (user as any)?._id;
    if (!userId) return;

    const { joinStatus, awaitingTeacherCompletion } = getBatchSessionState(cls);
    if (awaitingTeacherCompletion) {
      toast.warning('Please mark the pending class as complete first before starting the next session.');
      return;
    }
    if (!joinStatus.canJoin) {
      toast.warning(
        `Class can only be started or joined 10 minutes before the scheduled session time (${joinStatus.reason}). Please start/join at ${joinStatus.opensAtTimeStr}!`
      );
      return;
    }

    if (isMentor) {
      api.post(`/classes/${cls._id}/start-session`).catch(() => {});
    }

    const key = `class_join_start_${cls._id}_${userId}`;
    const stored = localStorage.getItem(key);
    const start = stored ? parseInt(stored, 10) : Date.now();
    if (!stored) localStorage.setItem(key, start.toString());
    setSessionStarts((prev) => ({ ...prev, [cls._id]: start }));
    recordAttendanceToday(cls._id);

    let activeLink = cls.meetingLink;
    if (!activeLink && isMentor) {
      try {
        const res = await api.post(`/classes/${cls._id}/generate-link`);
        activeLink = res.data?.meetingLink || res.data?.class?.meetingLink || '';
        if (activeLink) {
          fetchClasses();
        }
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Zoom link auto-generation failed');
        return;
      }
    } else if (isMentor) {
      fetchClasses();
    }

    if (activeLink) {
      window.open(activeLink, '_blank', 'noopener,noreferrer');
    } else {
      toast.success('Class timer started. Your meeting link will be available shortly.');
    }
  };

  const handleCompleteSession = async (classId: string, title: string, sessionDate?: string) => {
    try {
      setCompletingSessionId(classId);
      await api.post(`/classes/${classId}/complete-session`, { sessionDate });
      toast.success(`Class for "${title}" marked complete! Next class details are now visible.`);
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to mark class as complete');
    } finally {
      setCompletingSessionId(null);
    }
  };

  const handleCompleteClass = (classId: string, title: string) => {
    const userId = user?.id || (user as any)?._id;
    if (!userId) return;

    const targetCls = classes.find((c) => c._id === classId);
    const isRecurring = targetCls ? isRecurringClass(targetCls) : false;

    if (!isRecurring) {
      const stored: string[] = JSON.parse(localStorage.getItem(`completed_classes_${userId}`) || '[]');
      if (!stored.includes(classId)) {
        stored.push(classId);
        localStorage.setItem(`completed_classes_${userId}`, JSON.stringify(stored));
        setCompletedIds([...stored]);
      }
    }

    localStorage.removeItem(`class_join_start_${classId}_${userId}`);
    setSessionStarts((prev) => {
      const next = { ...prev };
      delete next[classId];
      return next;
    });

    if (isRecurring) {
      toast.success(`Session for "${title}" marked as completed! You can rejoin the next weekend session.`);
    } else {
      toast.success(`Batch "${title}" marked as completed!`);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userId = user?.id || (user as any)?._id;
      const userLang = user?.language || form.language || 'German';
      const daysLabel = selectedWeekdays.length > 0 ? `Every ${selectedWeekdays.join(', ')}` : '';
      const dateLabel = startDate
        ? (selectedWeekdays.length > 0 ? `Starts ${formatDateLabel(startDate)}` : formatDateLabel(startDate))
        : '';
      const timeLabel = formatTo12Hour(startTime);

      const timingParts = [daysLabel, dateLabel, timeLabel].filter(Boolean);
      const formattedTiming = timingParts.length > 0 ? timingParts.join(' | ') : 'Schedule TBA';

      const baseCategories = form.categories.length > 0 ? form.categories : ['A1'];
      const mentorFiltered = baseCategories.filter((c) => c === 'A1' || c === 'A2');
      const activeCategories =
        user?.role === 'mentor'
          ? (mentorFiltered.length > 0 ? mentorFiltered : ['A1', 'A2'])
          : baseCategories;
      const activeCategory = activeCategories.join(', ');

      const payload = {
        title: form.title,
        language: userLang,
        isConversational: user?.role === 'mentor' ? false : form.isConversational,
        categories: activeCategories,
        category: activeCategory,
        timing: formattedTiming,
        startDate: startDate || '',
        endDate: endDate || '',
        startTime: startTime || '',
        weekdays: selectedWeekdays,
        description: form.description || '',
        maxStudents: Number(form.maxStudents) || 15,
        maxCapacity: Number(form.maxStudents) || 15,
        meetingLink: form.meetingLink || '',
        mentorId: userId,
        mentorName: user?.name || 'Instructor',
      };
      await api.post('/classes', payload);
      toast.success('New class batch published successfully!');
      setShowCreateModal(false);
      setForm({
        title: '',
        language: userLang,
        isConversational: false,
        category: user?.role === 'mentor' ? 'A1, A2' : 'A1',
        categories: user?.role === 'mentor' ? ['A1', 'A2'] : ['A1'],
        description: '',
        timing: '',
        maxStudents: 15,
        meetingLink: '',
      });
      setStartDate('');
      setEndDate('');
      setStartTime('19:00');
      setSelectedWeekdays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create batch');
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

  // Classes to display (students see active classes; recurring weekend/conversational classes always stay visible!)
  const displayedClasses = isMentor 
    ? (mentorTab === 'active' ? activeBatches : previousBatches)
    : classes.filter((c) => {
        if (c.status === 'completed') return false;
        // Conversational / weekend batches are recurring: always keep them visible for upcoming sessions!
        if (isRecurringClass(c)) return true;
        return !completedIds.includes(c._id);
      });

  // Extract mentors for student view (strictly users with role 'mentor')
  const canViewMentors = isMentor || hasCourseAccess === true;
  const mentorEntries: [string, any][] = !canViewMentors
    ? []
    : mentorsList
        .filter((m) => m.role === 'mentor')
        .map((m): [string, any] => [String(m._id || m.email || m.name), { ...m, role: 'mentor' }]);
  const uniqueMentors = Array.from(new Map(mentorEntries).values());

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
              </>
            ) : (
              <>
                My Classes &amp; Cohorts
                <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-md">
                  Language: {user?.language || 'German'}
                </span>
                {user?.category && (
                  <span className="ml-1 inline-flex items-center gap-1 text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Level: {user.category}
                  </span>
                )}
              </>
            )}
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-xs sm:text-sm font-extrabold text-emerald-800 bg-emerald-50/70 px-2.5 py-0.5 rounded-lg">
            {isMentor 
              ? `${activeBatches.length} Active / ${previousBatches.length} Previous`
              : `${displayedClasses.length} ${displayedClasses.length === 1 ? 'Batch Available' : 'Batches Available'}`
            }
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {/* If mentor, show Create Batch button; If student, show Mentors & Completed links */}
          {isMentor ? (
            <button
              onClick={() => {
                const initialDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
                const next = getNextUpcomingSession(initialDays, '19:00');
                setStartDate(next ? next.dateStr : '');
                setEndDate('');
                setStartTime('19:00');
                setSelectedWeekdays(initialDays);
                const isMentorRole = user?.role === 'mentor';
                setForm({
                  title: '',
                  language: user?.language || 'German',
                  isConversational: false,
                  category: isMentorRole ? 'A1, A2' : 'A1',
                  categories: isMentorRole ? ['A1', 'A2'] : ['A1'],
                  description: '',
                  timing: '',
                  maxStudents: 15,
                  meetingLink: '',
                });
                setShowCreateModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Batch</span>
            </button>
          ) : (
            <>
              {/* View Mentors button - ONLY shown to subscribed A1/A2 students */}
              {hasCourseAccess === true && (!user?.category || ['A1', 'A2', 'All', ''].includes(user.category)) && (
                <button
                  onClick={() => setShowMentorsModal(true)}
                  className="px-3 sm:px-3.5 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100/80 text-blue-900 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0"
                  title="View Assigned Mentors"
                >
                  <Users className="w-4 h-4 text-blue-700" />
                  <span>Mentors ({uniqueMentors.length})</span>
                </button>
              )}

              <Link
                href="/dashboard/student/completed"
                className="px-3 sm:px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0"
                title="View Completed Classes"
              >
                <Award className="w-4 h-4 text-emerald-700" />
                <span>Completed ({completedIds.length})</span>
              </Link>
            </>
          )}

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

      {/* Student Specific: Your Learning Journey Progress Banner */}
      {!isMentor && (() => {
        const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
        const rawLevel = (user?.category || 'A1').toUpperCase().trim();
        const foundIdx = CEFR_LEVELS.indexOf(rawLevel as any);
        const activeIdx = foundIdx >= 0 ? foundIdx : (rawLevel === 'C1' || rawLevel === 'C2' ? 3 : 0);
        const overallPct = Math.round(((activeIdx + 1) / CEFR_LEVELS.length) * 100);

        return (
          <section
            aria-label="Your Learning Journey"
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-100/90 bg-gradient-to-r from-white via-[#f4fbf7] to-[#e4f7ee] shadow-xs"
          >
            {/* Right-edge illustrated mountain summit */}
            <div
              className="hidden md:block pointer-events-none absolute inset-y-0 right-0 w-72 lg:w-80 xl:w-[24rem] select-none"
              style={{
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.98) 58%, transparent 100%)',
                maskImage: 'linear-gradient(to left, rgba(0,0,0,0.98) 58%, transparent 100%)',
              }}
            >
              <img
                src="/learning-journey-mountain.jpg"
                alt=""
                className="w-full h-full object-cover object-right"
              />
            </div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5 px-5 py-4 sm:px-6 sm:py-5 xl:pr-52 2xl:pr-60">
              {/* Left Title & Description */}
              <div className="flex items-center gap-3.5 shrink-0">
                <div className="w-11 h-11 rounded-full bg-emerald-100/90 border border-emerald-200/80 flex items-center justify-center shrink-0">
                  <Target className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xl font-black text-gray-900 tracking-tight leading-snug">
                    Your Learning Journey
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-xs leading-snug">
                    From A1 to B2 - Track your progress and reach fluency.
                  </p>
                </div>
              </div>

              {/* Center 4-Level CEFR Stepper */}
              <div className="flex items-start justify-between sm:justify-center flex-1 max-w-md mx-auto xl:mx-0 w-full px-1">
                {CEFR_LEVELS.map((lvl, idx) => {
                  const isCompletedLvl = idx < activeIdx;
                  const isCurrentLvl = idx === activeIdx;

                  return (
                    <React.Fragment key={lvl}>
                      <div className="flex flex-col items-center gap-1.5 shrink-0">
                        <div className="relative">
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-black text-sm sm:text-base transition-all ${
                              isCompletedLvl || isCurrentLvl
                                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                                : 'bg-white/95 border border-gray-200 text-gray-700 shadow-2xs'
                            }`}
                          >
                            {lvl}
                          </div>
                          {(isCompletedLvl || isCurrentLvl) && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                            </span>
                          )}
                        </div>

                        {isCurrentLvl ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/95 border border-emerald-200/80 text-emerald-900 text-[10px] sm:text-[11px] font-extrabold whitespace-nowrap">
                            In Progress
                          </span>
                        ) : isCompletedLvl ? (
                          <span className="text-[10px] font-extrabold text-emerald-700 whitespace-nowrap">
                            Completed
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400 mt-0.5" aria-label="Locked" />
                        )}
                      </div>

                      {idx < CEFR_LEVELS.length - 1 && (
                        <div className="flex-1 h-[2px] mt-5 mx-1.5 sm:mx-2.5 rounded-full overflow-hidden bg-gray-200">
                          <div
                            className={`h-full transition-all ${
                              idx < activeIdx
                                ? 'w-full bg-emerald-500'
                                : idx === activeIdx
                                ? 'w-1/2 bg-emerald-500'
                                : 'w-0'
                            }`}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Right Overall Progress Card */}
              <div className="bg-white/95 backdrop-blur-xs border border-emerald-100 rounded-2xl px-4 py-3 min-w-[175px] sm:min-w-[195px] shadow-xs space-y-1.5 shrink-0">
                <p className="text-[11px] sm:text-xs font-bold text-gray-500 leading-none">
                  Overall Progress
                </p>
                <p className="text-xl sm:text-2xl font-black text-gray-900 tabular-nums leading-tight">
                  {overallPct}%
                </p>
                <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                    style={{ width: `${overallPct}%` }}
                  />
                </div>
              </div>
            </div>
          </section>
        );
      })()}

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

      {/* Class Batches Grid + Student Right-Side Batch PDFs */}
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
      ) : (
        <div className={!isMentor && hasCourseAccess === true ? 'grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start' : ''}>
          <div className={!isMentor && hasCourseAccess === true ? 'lg:col-span-8 xl:col-span-9 min-w-0' : ''}>
            {loading || (!isMentor && hasCourseAccess === null) ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${!isMentor && hasCourseAccess === true ? '' : 'lg:grid-cols-3'} gap-5 sm:gap-6`}>
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
                        ? 'Click "+ Create Batch" button above to publish your first cohort.'
                        : 'Completed batches and finished cohorts will automatically appear in this historical archive.')
                    : 'New interactive sessions will appear here soon.'}
                </p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${!isMentor && hasCourseAccess === true ? '' : 'lg:grid-cols-3'} ${isMentor ? 'gap-3.5 sm:gap-4' : 'gap-5 sm:gap-6'}`}>
          {displayedClasses.map((cls) => {
            const userId = user?.id || (user as any)?._id;
            const studentIds = cls.enrolledStudents || cls.students || [];
            const isEnrolled = userId && studentIds.some((s: any) => (typeof s === 'object' ? s._id : s) === userId);
            const isRecurring = isRecurringClass(cls);
            const isCompleted = cls.status === 'completed' || (!isRecurring && Boolean(userId && completedIds.includes(cls._id)));
            const enrolledCount = studentIds.length;
            const maxCapacity = cls.maxStudents || cls.maxCapacity || 15;
            const isFull = enrolledCount >= maxCapacity;
            const mentorName = cls.mentor?.name || (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName || 'Senior Instructor';
            const percentFilled = Math.min(100, Math.round((enrolledCount / maxCapacity) * 100));
            const sessionState = getBatchSessionState(cls);
            const { nextSession, joinStatus, awaitingTeacherCompletion, pendingFormattedDate, pendingSessionDate, canTeacherMarkComplete } = sessionState;
            const lockNextDetails = !isCompleted && awaitingTeacherCompletion;

            // Attendance & batch total calculations for student card
            const totalScheduledClasses = countScheduledClassesInBatch(cls);
            const combinedAttendedSet = new Set([
              ...(Array.isArray(cls.completedSessions) ? cls.completedSessions : []),
              ...(studentAttendedDates[cls._id] || []),
            ]);
            const rawAttendedCount = combinedAttendedSet.size;
            const attendedCount =
              totalScheduledClasses !== null
                ? Math.min(rawAttendedCount, totalScheduledClasses)
                : rawAttendedCount;
            const attendanceDenominator =
              totalScheduledClasses !== null
                ? totalScheduledClasses
                : rawAttendedCount > 0
                  ? rawAttendedCount
                  : 0;
            const attendancePercent =
              attendanceDenominator > 0
                ? Math.min(100, Math.round((attendedCount / attendanceDenominator) * 100))
                : 0;
            const batchDaysRangeLabel = formatBatchDaysRange(cls.weekdays);
            const ringRadius = 21;
            const ringCircumference = 2 * Math.PI * ringRadius;
            const ringDashOffset = ringCircumference - (attendancePercent / 100) * ringCircumference;

            return (
              <div
                key={cls._id}
                className={`bg-white border transition-all flex flex-col justify-between relative overflow-hidden shadow-xs hover:shadow-md ${
                  isMentor ? 'rounded-2xl p-4 sm:p-5 gap-3.5' : 'rounded-3xl p-5 sm:p-6 gap-4'
                } ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isEnrolled
                    ? 'border-emerald-300 ring-1 ring-emerald-500/15'
                    : 'border-emerald-100/90 hover:border-emerald-300'
                }`}
              >
                {/* Completed Ribbon if Finished */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-emerald-700 text-white text-[10px] font-black px-3 py-0.5 rounded-bl-lg shadow-xs uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Completed Cohort
                  </div>
                )}

                <div className={isMentor ? 'space-y-3' : 'space-y-3.5'}>
                  {/* Category & Language Pills and Seat Counter */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold bg-indigo-50 text-indigo-900 border border-indigo-200/80 px-2.5 py-0.5 rounded-md text-xs">
                        {cls.language || user?.language || 'German'}
                      </span>
                      {(cls.categories && cls.categories.length > 0
                        ? cls.categories
                        : (cls.category ? cls.category.split(',').map((s) => s.trim()).filter(Boolean) : [])
                      ).filter((c) => c !== 'Conversational').map((cat) => (
                        <span
                          key={cat}
                          className={`font-extrabold bg-emerald-50 text-emerald-900 border border-emerald-200/80 ${
                            isMentor ? 'px-2.5 py-0.5 rounded-md text-xs' : 'px-2.5 py-0.5 rounded-md text-xs'
                          }`}
                        >
                          Level {cat}
                        </span>
                      ))}
                    </div>
                    <span className={`font-bold text-gray-600 flex items-center gap-1.5 shrink-0 ${
                      isMentor ? 'text-xs' : 'text-xs sm:text-sm'
                    }`}>
                      <Users className="w-4 h-4 text-gray-400" /> {enrolledCount} / {maxCapacity} Students
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
                      isMentor ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
                    }`}>
                      {cls.title}
                    </h3>
                    <p className={`text-gray-500 line-clamp-2 mt-1 font-medium leading-relaxed ${
                      isMentor ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
                    }`}>
                      {cls.description || 'Interactive live language sessions with native exercises.'}
                    </p>
                  </div>

                  {/* Student Attendance & Batch Schedule Sub-Card */}
                  {!isMentor && (
                    <div className="rounded-2xl border border-gray-200/90 bg-white p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-0 sm:divide-x divide-gray-200/80 items-center">
                      {/* Classes Attended + Donut Progress Ring */}
                      <div className="flex items-center justify-between gap-3 sm:pr-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                            <CalendarCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">Classes Attended</span>
                          </div>
                          <p className="text-lg sm:text-xl font-black text-gray-900 tabular-nums leading-none">
                            {totalScheduledClasses !== null ? `${attendedCount} / ${totalScheduledClasses}` : `${attendedCount}`}
                          </p>
                        </div>

                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 52 52" aria-hidden="true">
                            <circle
                              cx="26"
                              cy="26"
                              r={ringRadius}
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="5"
                            />
                            <circle
                              cx="26"
                              cy="26"
                              r={ringRadius}
                              fill="none"
                              stroke="#059669"
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={ringCircumference}
                              strokeDashoffset={ringDashOffset}
                            />
                          </svg>
                          <span className="absolute text-[11px] font-black text-emerald-950 tabular-nums">
                            {attendancePercent}%
                          </span>
                        </div>
                      </div>

                      {/* Current Batch Days & Total Classes */}
                      <div className="sm:pl-4 space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                          <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">Current Batch</span>
                        </div>
                        <p className="text-sm sm:text-base font-black text-gray-900 leading-tight truncate">
                          {batchDaysRangeLabel}
                        </p>
                        <p className="text-[11px] sm:text-xs font-semibold text-gray-500">
                          {totalScheduledClasses !== null ? `${totalScheduledClasses} Total Classes` : 'Ongoing Cohort'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className={`border border-gray-100 text-gray-800 ${
                    isMentor ? 'bg-gray-50/80 p-3 rounded-xl space-y-1.5 text-xs' : 'bg-slate-50/90 p-3.5 sm:p-4 rounded-2xl space-y-2 text-sm'
                  }`}>
                    {lockNextDetails ? (
                      <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/90 space-y-1">
                        <div className="flex items-center gap-2 font-black text-amber-950">
                          <Lock className={`${isMentor ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-amber-700 shrink-0`} />
                          <span className={isMentor ? 'text-xs' : 'text-sm sm:text-base'}>
                            Class Pending Completion ({pendingFormattedDate})
                          </span>
                        </div>
                        <p className={`${isMentor ? 'text-[11px]' : 'text-xs sm:text-sm'} text-amber-800 font-semibold leading-snug`}>
                          {isMentor
                            ? 'Mark this class as complete to unlock and display the next class details.'
                            : 'Waiting for teacher to mark class as complete — Next class details will show once completed.'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 font-black text-gray-900 flex-wrap">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className={isMentor ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}>
                            {isCompleted ? (cls.timing || 'Completed Cohort') : (nextSession?.displayTiming || cls.timing || 'Schedule TBA')}
                          </span>
                          {!isCompleted && nextSession?.isToday && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white tracking-wide">
                              LIVE TODAY
                            </span>
                          )}
                        </div>
                        {cls.weekdays && cls.weekdays.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            <span className="font-semibold text-gray-400 text-xs">Days:</span>
                            {cls.weekdays.map((day) => (
                              <span key={day} className="font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-200/70 px-2 py-0.5 text-[11px] rounded-md">
                                {day}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}

                    <div className="flex items-center gap-2 text-gray-800 font-bold">
                      <GraduationCap className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm">Teacher: {mentorName}</span>
                    </div>

                    {!lockNextDetails && cls.meetingLink && isMentor && (
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">
                        <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                        {joinStatus.canJoin ? (
                          <button
                            type="button"
                            onClick={() => handleStartSession(cls)}
                            className="underline truncate hover:text-emerald-950 cursor-pointer text-left font-bold"
                          >
                            {cls.meetingLink}
                          </button>
                        ) : (
                          <span
                            className="text-gray-400 font-medium truncate select-none flex items-center gap-1.5"
                            title="Link unlocks 10 minutes before class"
                          >
                            <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>Link unlocks at {joinStatus.opensAtTimeStr || 'class time'}</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Live Timer once the student joins the class */}
                  {!isMentor && isEnrolled && !isCompleted && !lockNextDetails && sessionStarts[cls._id] && (
                    <EnrolledTimer startMs={sessionStarts[cls._id]} />
                  )}
                </div>

                {/* Bottom Buttons / Actions */}
                      <div className={`border-t border-gray-100 ${isMentor ? 'pt-3' : 'pt-4'}`}>
                        {isMentor ? (
                          /* Mentor / Teacher Actions */
                          <div className="space-y-2">
                            {/* View Student Roster */}
                            <button
                              onClick={() => {
                                setSelectedClassForStudents(cls);
                                setRosterTab('current');
                              }}
                              className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                            >
                              <Users className="w-4 h-4 text-emerald-600" />
                              <span>View Enrolled Roster ({enrolledCount})</span>
                            </button>

                            {/* Start / Mark Class Complete Controls (for active batches) */}
                            {cls.status !== 'completed' && (
                              <>
                                {!lockNextDetails && (
                                  joinStatus.canJoin ? (
                                    <button
                                      type="button"
                                      onClick={() => handleStartSession(cls)}
                                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer animate-pulse"
                                    >
                                      <Video className="w-4 h-4" /> Start Live Class
                                    </button>
                                  ) : (
                                    <div className="space-y-1.5">
                                      <button
                                        type="button"
                                        disabled
                                        className="w-full py-2.5 px-3 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs sm:text-sm border border-gray-200 transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-75 select-none"
                                        title="Start class opens 10 minutes before scheduled time"
                                      >
                                        <Lock className="w-4 h-4 text-gray-400" />
                                        <span>Start Live Class (Locked)</span>
                                      </button>
                                      <p className="text-[11px] text-center text-gray-500 font-semibold flex items-center justify-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                        <span>{joinStatus.reason}</span>
                                      </p>
                                    </div>
                                  )
                                )}

                                {(lockNextDetails || canTeacherMarkComplete) && (
                                  <button
                                    type="button"
                                    onClick={() => handleCompleteSession(cls._id, cls.title, pendingSessionDate)}
                                    disabled={completingSessionId === cls._id}
                                    className="w-full py-2.5 px-3 rounded-xl bg-[#1E2B7B] hover:bg-[#16205b] text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                                  >
                                    {completingSessionId === cls._id ? (
                                      <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span>Completing Class...</span>
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>
                                          {lockNextDetails
                                            ? `Mark ${pendingFormattedDate} Class Complete`
                                            : "Mark Today's Class Complete"}
                                        </span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </>
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
                                  <Check className="w-3.5 h-3.5 text-emerald-700" /> End Entire Batch (Move to Completed)
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
                            ) : lockNextDetails ? (
                              <div className="space-y-2">
                                {isEnrolled && (
                                  <div className="flex items-center justify-center gap-2 text-base font-black text-emerald-800 bg-emerald-50 py-2.5 rounded-2xl border border-emerald-200">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Enrolled in Batch
                                  </div>
                                )}
                                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                                  <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-amber-900">
                                    <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                                    <span>Next Class Details Locked</span>
                                  </div>
                                  <p className="text-[11px] sm:text-xs font-semibold text-amber-800">
                                    Waiting for teacher to mark the {pendingFormattedDate} class as complete.
                                  </p>
                                </div>
                              </div>
                            ) : isEnrolled ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-900 bg-emerald-50/90 py-2.5 rounded-xl border border-emerald-200/80">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Enrolled in Batch
                                </div>
                                {joinStatus.canJoin ? (
                                  <button
                                    onClick={() => handleStartSession(cls)}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
                                  >
                                    <Video className="w-4 h-4 sm:w-5 sm:h-5" /> Join Class (Live)
                                  </button>
                                ) : (
                                  <div className="space-y-1.5">
                                    <button
                                      type="button"
                                      disabled
                                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-400 font-extrabold text-xs sm:text-sm border border-gray-200 transition-all cursor-not-allowed opacity-75 select-none"
                                      title="Join class opens 10 minutes before scheduled time"
                                    >
                                      <Lock className="w-4 h-4 text-gray-400" />
                                      <span>Join Class (Locked)</span>
                                    </button>
                                    <p className="text-[11px] text-center text-gray-500 font-semibold flex items-center justify-center gap-1">
                                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{joinStatus.reason}</span>
                                    </p>
                                  </div>
                                )}
                                {!cls.meetingLink && (
                                  <p className="text-xs text-center text-gray-400 font-medium">
                                    Timer will start now. Meeting link will be shared by your mentor.
                                  </p>
                                )}
                                <button
                                  onClick={() => handleCompleteClass(cls._id, cls.title)}
                                  className="w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50/60 border border-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <Award className="w-4 h-4 text-emerald-600" /> Mark as Completed
                                </button>
                              </div>
                            ) : isFull ? (
                              <button
                                disabled
                                className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-extrabold text-sm sm:text-base cursor-not-allowed text-center"
                              >
                                Batch Full
                              </button>
                            ) : joinStatus.canJoin ? (
                              <button
                                onClick={() => handleJoinClass(cls)}
                                disabled={joiningId === cls._id}
                                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                              >
                                <Video className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>{joiningId === cls._id ? 'Joining Class...' : 'Join Class (Live)'}</span>
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            ) : (
                              <div className="space-y-1.5">
                                <button
                                  type="button"
                                  disabled
                                  className="w-full py-3.5 sm:py-4 rounded-2xl bg-gray-100 text-gray-400 font-extrabold text-base border border-gray-200 transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-75 select-none"
                                  title="Join class opens 10 minutes before scheduled time"
                                >
                                  <Lock className="w-4 h-4 text-gray-400" />
                                  <span>Join Class (Locked)</span>
                                </button>
                                <p className="text-[11px] text-center text-gray-500 font-semibold flex items-center justify-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{joinStatus.reason}</span>
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
              </div>
            );
          })}
              </div>
            )}
          </div>

          {/* Right-Side Batch PDFs Panel for Students */}
          {!isMentor && hasCourseAccess === true && (
            <aside className="lg:col-span-4 xl:col-span-3 bg-white border border-emerald-100/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 lg:sticky lg:top-6">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-black text-gray-900 tracking-tight truncate">
                      Batch PDFs
                    </h3>
                    <p className="text-[11px] font-medium text-gray-500 truncate">
                      Uploaded study materials
                    </p>
                  </div>
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                  {batchMaterials.reduce((sum, b) => sum + (b.materials?.length || 0), 0)}
                </span>
              </div>

              {batchMaterials.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 border border-dashed border-gray-200 p-5 text-center space-y-1.5">
                  <FileText className="w-7 h-7 text-gray-300 mx-auto" />
                  <p className="text-xs font-bold text-gray-500">
                    No PDFs uploaded for your batch yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-0.5">
                  {batchMaterials.map((group) => (
                    <div
                      key={group.batchId}
                      className="rounded-2xl bg-slate-50/90 border border-gray-100 p-3.5 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black text-gray-800 truncate" title={group.batchTitle}>
                          {group.batchTitle}
                        </p>
                        {group.category && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                            {group.category}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {group.materials.map((mat, mIdx) => (
                          <a
                            key={mat._id || mIdx}
                            href={mat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={mat.fileName || `${mat.title}.pdf`}
                            className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-xs font-bold text-gray-800 hover:text-emerald-900 transition-all group"
                            title={mat.title}
                          >
                            <span className="flex items-center gap-2 min-w-0">
                              <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span className="truncate">{mat.title}</span>
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-700 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          )}
        </div>
      )}

      {/* Req 3: Dedicated Mentors & Instructors Section for Students */}
      {!isMentor && uniqueMentors.length > 0 && (
        <div className="bg-white border border-emerald-100/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  Your Mentors &amp; Instructors
                </h3>
                <p className="text-xs text-gray-500 font-medium">
                  Assigned educators for your {user?.language || 'German'} cohort
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {uniqueMentors.length} {uniqueMentors.length === 1 ? 'Instructor' : 'Instructors'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueMentors.map((m: any, idx: number) => (
              <div
                key={m._id || idx}
                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/70 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all flex items-start gap-3.5"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {(m.name || 'M').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-black text-gray-900 truncate">{m.name || 'Instructor'}</h4>
                  <span className="text-xs text-emerald-800 font-bold block">
                    Mentor
                  </span>
                  <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900">
                      {m.language || user?.language || 'German'}
                    </span>
                    {m.category && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        {m.category}
                      </span>
                    )}
                  </div>
                  {m.email && (
                    <p className="text-[11px] text-gray-400 truncate mt-1">
                      {m.email}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mentors Modal Popup for Students - ONLY accessible to subscribed users */}
      {showMentorsModal && hasCourseAccess === true && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-100 rounded-3xl w-full max-w-2xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Your Assigned Mentors
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Native language mentors for {user?.language || 'German'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMentorsModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {uniqueMentors.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-gray-500 text-sm font-medium">
                  No mentors assigned yet for this cohort.
                </div>
              ) : (
                uniqueMentors.map((m: any, idx: number) => (
                  <div
                    key={m._id || idx}
                    className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 flex items-start gap-3.5"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white font-black text-base flex items-center justify-center shrink-0 shadow-sm">
                      {(m.name || 'M').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-gray-900 truncate">{m.name || 'Instructor'}</h4>
                      <p className="text-xs text-emerald-800 font-bold capitalize">
                        Mentor
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-500 font-medium">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                          {m.language || user?.language || 'German'}
                        </span>
                        {m.category && (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                            {m.category}
                          </span>
                        )}
                      </div>
                      {m.email && (
                        <p className="text-[11px] text-gray-500 font-medium mt-1 truncate">
                          {m.email}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setShowMentorsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mentor: Create Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateClass}
            className="bg-white border border-gray-200 rounded-3xl w-full max-w-2xl my-auto shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1E2B7B] text-white flex items-center justify-center shadow-xs shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                    Create Batch
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Daily classes &amp; Zoom links auto-generate automatically inside the batch
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields: Compact, non-scrollable on desktop */}
            <div className="p-5 sm:p-6 space-y-3.5">
              {/* 1. Batch Title */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1">
                  Batch Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German A1 Weekend Cohort"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50/70 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1E2B7B] text-xs sm:text-sm font-semibold transition-all"
                />
              </div>

              {/* 2. Instructor & Language Badge (Read-only, no language select) */}
              <div className="flex items-center justify-between bg-slate-50/70 border border-gray-200/90 rounded-2xl px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs font-bold">Instructor:</span>
                  <span className="text-gray-900 text-xs font-black">{user?.name || 'You'}</span>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {user?.role === 'mentor' ? 'Mentor' : 'Teacher'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-xl text-xs font-black">
                  <span className="text-blue-500 font-bold text-[10px] uppercase">Language:</span>
                  <span>{user?.language || form.language || 'German'}</span>
                </div>
              </div>

              {/* 3. Target Level(s) & Conversational Toggle */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                    Levels
                  </span>

                  {/* Conversational Checkbox (teachers/admin only; mentors only target A1 & A2) */}
                  {user?.role !== 'mentor' && (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.isConversational}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setForm((prev) => ({
                            ...prev,
                            isConversational: checked,
                            categories: checked
                              ? (prev.categories.length > 0 ? prev.categories : ['A1', 'A2'])
                              : [prev.categories[0] || 'A1'],
                          }));
                        }}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                      />
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg border transition-all ${
                        form.isConversational
                          ? 'bg-purple-100 text-purple-700 border-purple-300'
                          : 'text-gray-600 border-transparent hover:text-gray-900'
                      }`}>
                        Conversational Class
                      </span>
                    </label>
                  )}
                </div>

                {/* Level pills: A1 & A2 for mentors; A1–B2 for teachers */}
                <div className="flex items-center gap-2 flex-wrap">
                  {(user?.role === 'mentor' ? ['A1', 'A2'] : ['A1', 'A2', 'B1', 'B2']).map((lvl) => {
                    const isSelected = form.categories.includes(lvl);
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => toggleCategory(lvl)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                          isSelected
                            ? form.isConversational
                              ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                              : 'bg-[#1E2B7B] text-white border-[#1E2B7B] shadow-2xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        Level {lvl}
                      </button>
                    );
                  })}

                  {user?.role === 'mentor' ? (
                    <span className="text-[11px] font-bold text-emerald-800 ml-auto">
                      {user?.language || 'German'} • A1 &amp; A2 Only
                    </span>
                  ) : form.isConversational && (
                    <span className="text-[11px] font-bold text-purple-700 ml-auto">
                      Visible to: {form.categories.join(', ')} students
                    </span>
                  )}
                </div>
              </div>

              {/* 4. Recurring Days */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                    Recurring Days
                  </label>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-800">
                    <button
                      type="button"
                      onClick={() => handleSelectWeekdays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])}
                      className="hover:underline cursor-pointer"
                    >
                      Mon-Fri
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleSelectWeekdays(['Sat', 'Sun'])}
                      className="hover:underline cursor-pointer"
                    >
                      Weekend
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleSelectWeekdays(ALL_WEEKDAYS)}
                      className="hover:underline cursor-pointer"
                    >
                      All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {ALL_WEEKDAYS.map((day) => {
                    const isChecked = selectedWeekdays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleWeekday(day)}
                        className={`py-1.5 rounded-xl border text-xs font-black text-center transition-all cursor-pointer ${
                          isChecked
                            ? 'border-emerald-600 bg-emerald-600 text-white shadow-2xs'
                            : 'border-gray-200 bg-slate-50/60 text-gray-700 hover:bg-white'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Schedule Details: Time, Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50/70 border border-gray-200 text-gray-900 text-xs font-bold transition-all focus:bg-white focus:outline-none focus:border-[#1E2B7B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50/70 border border-gray-200 text-gray-900 text-xs font-bold transition-all focus:bg-white focus:outline-none focus:border-[#1E2B7B]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={startDate || undefined}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50/70 border border-gray-200 text-gray-900 text-xs font-bold transition-all focus:bg-white focus:outline-none focus:border-[#1E2B7B]"
                  />
                </div>
              </div>

              {/* 6. Automatic Zoom Link Indicator */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2.5">
                <Video className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-900">
                    Zoom Classroom Link
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    Daily class sessions &amp; Zoom links auto-generate everyday 10 minutes before batch time
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-gray-100 flex items-center justify-end gap-2.5 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#1E2B7B] hover:bg-[#16205b] text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Create Batch</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mentor: Enrolled Students Roster Modal */}
      {selectedClassForStudents && (() => {
        const currentEnrolledList = (
          selectedClassForStudents.enrolledStudents || selectedClassForStudents.students || []
        ).filter(Boolean);

        const currentStudentIdSet = new Set(
          currentEnrolledList.map((s: any) =>
            String(typeof s === 'object' ? (s._id || s.id || s.studentId) : s)
          )
        );

        // Group students from this mentor's previous / completed or other classes
        const previousStudentsMap = new Map<string, {
          student: any;
          studentId: string;
          name: string;
          email: string;
          phoneNumber?: string;
          category?: string;
          previousClasses: { classId: string; title: string; category?: string; status?: string }[];
          isEnrolledInCurrent: boolean;
        }>();

        classes.forEach((otherCls) => {
          if (otherCls._id === selectedClassForStudents._id) return;
          const students = otherCls.enrolledStudents || otherCls.students || [];
          students.forEach((st: any) => {
            if (!st) return;
            const sId = String(typeof st === 'object' ? (st._id || st.id || st.studentId) : st);
            if (!sId) return;

            const clsSummary = {
              classId: otherCls._id,
              title: otherCls.title,
              category: otherCls.category,
              status: otherCls.status,
            };

            if (previousStudentsMap.has(sId)) {
              const existing = previousStudentsMap.get(sId)!;
              if (!existing.previousClasses.some((c) => c.classId === otherCls._id)) {
                existing.previousClasses.push(clsSummary);
              }
            } else {
              previousStudentsMap.set(sId, {
                student: st,
                studentId: sId,
                name: typeof st === 'object' ? (st.name || 'Student') : 'Student',
                email: typeof st === 'object' ? (st.email || '') : '',
                phoneNumber: typeof st === 'object' ? (st.phoneNumber || '') : undefined,
                category: typeof st === 'object' ? (st.category || otherCls.category) : otherCls.category,
                previousClasses: [clsSummary],
                isEnrolledInCurrent: currentStudentIdSet.has(sId),
              });
            }
          });
        });

        const previousStudentsList = Array.from(previousStudentsMap.values());
        const returningInCurrentCount = currentEnrolledList.filter((st: any) => {
          const sId = String(typeof st === 'object' ? (st._id || st.id || st.studentId) : st);
          return previousStudentsMap.has(sId);
        }).length;

        return (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white rounded-3xl border border-gray-200/90 w-full max-w-5xl p-6 sm:p-8 space-y-5 shadow-2xl max-h-[92vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4 gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                      {selectedClassForStudents.language || 'German'}
                    </span>
                    {selectedClassForStudents.status === 'completed' ? (
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Completed Cohort
                      </span>
                    ) : (
                      <span className="text-[11px] font-black text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        Active Batch
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
                    {selectedClassForStudents.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {selectedClassForStudents.timing}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClassForStudents(null)}
                  className="p-2.5 text-gray-400 hover:text-gray-700 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Switcher: This Batch Roster vs Previous Classes Students */}
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <button
                  type="button"
                  onClick={() => setRosterTab('current')}
                  className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                    rosterTab === 'current'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>This Batch Roster ({currentEnrolledList.length})</span>
                  {returningInCurrentCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      rosterTab === 'current' ? 'bg-white text-emerald-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {returningInCurrentCount} from previous
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setRosterTab('previous')}
                  className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                    rosterTab === 'previous'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-gray-600 hover:text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  <span>Previous Classes Students ({previousStudentsList.length})</span>
                </button>
              </div>

              {/* Tab 1: Current Batch Enrolled Roster */}
              {rosterTab === 'current' && (
                <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0">
                  {currentEnrolledList.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-gray-800">No students enrolled in this batch yet.</p>
                      {previousStudentsList.length > 0 && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setRosterTab('previous')}
                            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <History className="w-3.5 h-3.5 text-emerald-700" />
                            <span>View {previousStudentsList.length} student(s) from your previous classes</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    currentEnrolledList.map((st: any, idx: number) => {
                      const isObj = typeof st === 'object' && st !== null;
                      const name = isObj ? (st.name || 'Student') : 'Student';
                      const email = isObj ? (st.email || '') : '';
                      const phone = isObj ? st.phoneNumber : '';
                      const cat = isObj ? (st.category || selectedClassForStudents.category) : selectedClassForStudents.category;
                      const sId = String(isObj ? (st._id || st.id || st.studentId) : st);
                      const prevData = previousStudentsMap.get(sId);

                      return (
                        <div
                          key={st._id || idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/20 border border-gray-100 gap-3 transition-colors"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center shrink-0">
                              {name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-sm sm:text-base text-gray-900 truncate">{name}</p>
                              {email && <p className="text-xs text-gray-500 font-medium truncate">{email}</p>}
                              {phone && <p className="text-xs text-gray-400 font-medium">{phone}</p>}
                              {prevData && prevData.previousClasses.length > 0 && (
                                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200/90 px-2 py-0.5 rounded-md mt-1 w-fit">
                                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                                  <span>
                                    Previous Student (Attended: {prevData.previousClasses.map((c) => c.title).join(', ')})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-black bg-emerald-100 text-emerald-900 self-start sm:self-center shrink-0">
                            Level {cat}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab 2: Students from Previous Classes */}
              {rosterTab === 'previous' && (
                <div className="space-y-3 overflow-y-auto pr-1 flex-1 min-h-0">
                  {previousStudentsList.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                        <History className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-gray-800">No students found from your previous classes yet.</p>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        As students complete batches with you, their history will be listed here.
                      </p>
                    </div>
                  ) : (
                    previousStudentsList.map((item) => (
                      <div
                        key={item.studentId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50/20 border border-gray-100 gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-base flex items-center justify-center shrink-0">
                            {item.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-black text-sm sm:text-base text-gray-900">{item.name}</p>
                              {item.isEnrolledInCurrent ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1">
                                  <Check className="w-3 h-3 stroke-[3]" /> Enrolled in this batch
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-gray-200 text-gray-700">
                                  Previous Batch Only
                                </span>
                              )}
                            </div>
                            {item.email && <p className="text-xs text-gray-500 font-medium truncate">{item.email}</p>}
                            {item.phoneNumber && <p className="text-xs text-gray-400 font-medium">{item.phoneNumber}</p>}
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-600 mt-1 flex-wrap">
                              <span className="font-bold text-gray-400">Previous Batches:</span>
                              {item.previousClasses.map((pc) => (
                                <span
                                  key={pc.classId}
                                  className="font-bold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md text-[10px]"
                                >
                                  {pc.title} {pc.category ? `(${pc.category})` : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-black bg-emerald-100 text-emerald-900 self-start sm:self-center shrink-0">
                          Level {item.category || selectedClassForStudents.category}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {rosterTab === 'current'
                    ? `Showing ${currentEnrolledList.length} student(s) in this batch`
                    : `Showing ${previousStudentsList.length} past student(s) across previous batches`}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedClassForStudents(null)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xs transition-colors cursor-pointer"
                >
                  Close Roster
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}