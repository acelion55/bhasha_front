'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Video,
  Clock,
  Users,
  GraduationCap,
  X,
  Check,
  Eye,
  Mail,
  Phone,
  IdCard,
  Calendar,
  History,
  Sparkles,
  RotateCcw,
  Search,
  CheckCircle2,
  Filter,
  RefreshCw,
  BookOpen,
  Award,
  PlayCircle,
  UserCheck,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { getNextUpcomingSession, getBatchSessionState } from '@/lib/session-time';

interface EnrolledStudent {
  _id: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  studentId?: string;
  category?: string;
  language?: string;
  avatar?: string;
  createdAt?: string;
  isSubscribed?: boolean;
}

interface BatchMaterial {
  _id?: string;
  title: string;
  url: string;
  fileName?: string;
  uploadedAt?: string;
}

interface ClassItem {
  _id: string;
  title: string;
  language?: string;
  category: string;
  categories?: string[];
  isConversational?: boolean;
  description: string;
  timing: string;
  weekdays?: string[];
  startDate?: string;
  endDate?: string;
  startTime?: string;
  mentorName?: string;
  mentor?: { _id: string; name: string; email: string };
  mentorId?: any;
  students?: (string | EnrolledStudent)[];
  enrolledStudents?: (string | EnrolledStudent)[];
  maxStudents?: number;
  maxCapacity?: number;
  meetingLink?: string;
  price?: number;
  currency?: string;
  isPublic?: boolean;
  status?: string;
  completedSessions?: string[];
  lastCompletedSessionDate?: string;
  activeSessionDate?: string;
  materials?: BatchMaterial[];
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  language?: string;
  category?: string;
  studentId?: string;
  phoneNumber?: string;
  isSubscribed?: boolean;
}

const ALL_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const extractWeekdays = (timingStr: string): string[] => {
  if (!timingStr) return [];
  return ALL_WEEKDAYS.filter((d) => new RegExp(`\\b${d}\\b`, 'i').test(timingStr));
};

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [mentorUsers, setMentorUsers] = useState<User[]>([]);
  const [studentsList, setStudentsList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedClassForStudents, setSelectedClassForStudents] = useState<ClassItem | null>(null);
  const [rosterTab, setRosterTab] = useState<'current' | 'previous' | 'assign'>('current');
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterSelectedIds, setRosterSelectedIds] = useState<string[]>([]);
  const [savingStudents, setSavingStudents] = useState(false);
  const [modalStudentSearch, setModalStudentSearch] = useState('');

  // Classes Overview State matching mockup
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [primaryTab, setPrimaryTab] = useState<'all' | 'teacher'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedTeacherFilter, setSelectedTeacherFilter] = useState<string>('all');
  const [previewClass, setPreviewClass] = useState<ClassItem | null>(null);
  const [historyModalClass, setHistoryModalClass] = useState<ClassItem | null>(null);
  const [historyTab, setHistoryTab] = useState<'teacher' | 'all'>('teacher');
  const [pdfModalBatch, setPdfModalBatch] = useState<ClassItem | null>(null);
  const [pdfTitle, setPdfTitle] = useState('');
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [assignTeacherBatch, setAssignTeacherBatch] = useState<ClassItem | null>(null);
  const [assignTeacherId, setAssignTeacherId] = useState('');
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('19:00');
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

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
    language: 'German',
    teacherId: '',
    isConversational: false,
    categories: ['A1'] as string[],
    description: '',
    maxStudents: 15,
    meetingLink: '',
    selectedStudentIds: [] as string[],
  });

  const getMatchingStudents = (batchLanguage: string, batchCategories: string[], isConversational?: boolean) => {
    const targetLang = (batchLanguage || 'German').trim().toLowerCase();
    const normCats = (batchCategories || []).map((c) => c.trim().toUpperCase()).filter(Boolean);
    return studentsList.filter((st) => {
      const sLang = (st.language || 'German').trim().toLowerCase();
      if (targetLang !== 'conversational' && sLang !== targetLang) return false;
      if (isConversational || normCats.includes('ALL') || normCats.length === 0) return true;
      const sLvl = (st.category || 'A1').trim().toUpperCase();
      return normCats.includes(sLvl);
    });
  };

  const openRosterModal = (cls: ClassItem, initialTab: 'current' | 'previous' | 'assign' = 'current') => {
    const enrolled = (cls.enrolledStudents || cls.students || []).filter(Boolean);
    const ids = enrolled
      .map((s: any) => String(typeof s === 'object' ? (s._id || s.id) : s))
      .filter(Boolean);
    setRosterSelectedIds(ids);
    setRosterTab(initialTab);
    setRosterSearch('');
    setSelectedClassForStudents(cls);
  };

  const handleSaveRosterStudents = async () => {
    if (!selectedClassForStudents) return;
    setSavingStudents(true);
    try {
      const batchCats =
        selectedClassForStudents.categories && selectedClassForStudents.categories.length > 0
          ? selectedClassForStudents.categories
          : (selectedClassForStudents.category || 'A1').split(',').map((s) => s.trim()).filter(Boolean);
      const validSet = new Set(
        getMatchingStudents(
          selectedClassForStudents.language || 'German',
          batchCats,
          selectedClassForStudents.isConversational,
        ).map((s) => String(s._id)),
      );
      const filteredIds = rosterSelectedIds.filter((id) => validSet.has(String(id)));
      const res = await api.put<ClassItem>(`/classes/${selectedClassForStudents._id}/students`, {
        studentIds: filteredIds,
      });
      const updated = res.data;
      setSelectedClassForStudents(updated);
      setClasses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      toast.success('Batch students updated!');
      setRosterTab('current');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to assign students');
    } finally {
      setSavingStudents(false);
    }
  };

  const handleTeacherSelect = (teacherId: string) => {
    const selected = mentorUsers.find((t) => t._id === teacherId) || teachers.find((t) => t._id === teacherId);
    setForm((prev) => ({
      ...prev,
      teacherId,
      language: selected?.language || prev.language || 'German',
    }));
  };

  const handleOpenAssignTeacher = (cls: ClassItem) => {
    const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId) || '';
    setAssignTeacherId(mId ? String(mId) : '');
    setAssignTeacherBatch(cls);
  };

  const handleAssignTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTeacherBatch || !assignTeacherId) return;
    try {
      setSavingTeacher(true);
      const selectedTeacher =
        teachers.find((t) => String(t._id) === String(assignTeacherId)) ||
        mentorUsers.find((t) => String(t._id) === String(assignTeacherId));
      await api.put(`/classes/${assignTeacherBatch._id}`, {
        mentorId: assignTeacherId,
        mentorName: selectedTeacher?.name || 'Teacher',
      });
      toast.success(`Teacher assigned to "${assignTeacherBatch.title}"`);
      setAssignTeacherBatch(null);
      fetchData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to assign teacher');
    } finally {
      setSavingTeacher(false);
    }
  };

  const toggleCategory = (lvl: string) => {
    setForm((prev) => {
      if (prev.isConversational) {
        const exists = prev.categories.includes(lvl);
        const next = exists ? prev.categories.filter((c) => c !== lvl) : [...prev.categories, lvl];
        return { ...prev, categories: next.length > 0 ? next : [lvl] };
      } else {
        return { ...prev, categories: [lvl] };
      }
    });
  };

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
        api.get<{ users: User[] }>('/admin/users?limit=500'),
      ]);
      setClasses(clsRes.data);
      const allUsers = userRes.data.users || [];
      const teacherUsers = allUsers.filter((u) => u.role === 'teacher');
      setTeachers(teacherUsers);
      const mentors = allUsers.filter((u) => u.role === 'mentor' || u.role === 'teacher');
      setMentorUsers(mentors);
      setStudentsList(allUsers.filter((u) => u.role === 'student' || u.role === 'user'));
    } catch {
      toast.error('Failed to load classes or teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = (preselectedTeacherId?: string) => {
    setEditingId(null);
    const initialDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const next = getNextUpcomingSession(initialDays, '19:00');
    setStartDate(next ? next.dateStr : '');
    setEndDate('');
    setStartTime('19:00');
    setSelectedWeekdays(initialDays);
    const preTeacher = preselectedTeacherId ? (mentorUsers.find((t) => t._id === preselectedTeacherId) || teachers.find((t) => t._id === preselectedTeacherId)) : null;
    setForm({
      title: '',
      teacherId: preselectedTeacherId || '',
      language: preTeacher?.language || 'German',
      isConversational: false,
      categories: ['A1'],
      description: '',
      maxStudents: 25,
      meetingLink: '',
      selectedStudentIds: [],
    });
    setModalStudentSearch('');
    setShowModal(true);
  };

  const handleOpenEdit = (cls: ClassItem) => {
    setEditingId(cls._id);
    const days = cls.weekdays && cls.weekdays.length > 0
      ? cls.weekdays
      : extractWeekdays(cls.timing || '');
    const activeDays = days.length > 0 ? days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    setSelectedWeekdays(activeDays);

    const initTime = cls.startTime || parseStartTime(cls.timing || '');
    setStartTime(initTime);

    if (!cls.startDate && activeDays.length > 0) {
      const next = getNextUpcomingSession(activeDays, initTime);
      setStartDate(next ? next.dateStr : '');
    } else {
      setStartDate(cls.startDate || '');
    }
    setEndDate(cls.endDate || '');

    const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId) || '';

    let initialCategories = cls.categories && cls.categories.length > 0
      ? cls.categories
      : (cls.category ? cls.category.split(',').map((s) => s.trim()).filter(Boolean) : []);
    const isConv = cls.isConversational === true || cls.language === 'Conversational' || initialCategories.includes('Conversational');
    initialCategories = initialCategories.filter((c) => c !== 'Conversational');
    if (initialCategories.length === 0) {
      initialCategories = ['A1'];
    }

    const existingIds = (cls.enrolledStudents || cls.students || [])
      .filter(Boolean)
      .map((s: any) => String(typeof s === 'object' ? (s._id || s.id) : s))
      .filter(Boolean);

    setForm({
      title: cls.title,
      teacherId: mId,
      language: cls.language === 'Conversational' ? 'German' : (cls.language || 'German'),
      isConversational: isConv,
      categories: initialCategories,
      description: cls.description || '',
      maxStudents: cls.maxStudents || cls.maxCapacity || 25,
      meetingLink: cls.meetingLink || '',
      selectedStudentIds: existingIds,
    });
    setModalStudentSearch('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedTeacher = mentorUsers.find((t) => t._id === form.teacherId) || teachers.find((t) => t._id === form.teacherId);
      const daysLabel = selectedWeekdays.length > 0 ? `Every ${selectedWeekdays.join(', ')}` : '';
      const dateLabel = startDate
        ? (selectedWeekdays.length > 0 ? `Starts ${formatDateLabel(startDate)}` : formatDateLabel(startDate))
        : '';
      const timeLabel = formatTo12Hour(startTime);

      const timingParts = [daysLabel, dateLabel, timeLabel].filter(Boolean);
      const formattedTiming = timingParts.length > 0 ? timingParts.join(' | ') : 'Schedule TBA';

      const activeCategories = form.categories.length > 0 ? form.categories : ['A1'];
      const activeCategory = activeCategories.join(', ');

      const validMatchIds = new Set(
        getMatchingStudents(form.language, activeCategories, form.isConversational).map((s) =>
          String(s._id),
        ),
      );
      const filteredSelectedStudents = (form.selectedStudentIds || []).filter((id) =>
        validMatchIds.has(String(id)),
      );

      const payload: any = {
        title: form.title,
        language: form.language,
        isConversational: form.isConversational,
        categories: activeCategories,
        category: activeCategory,
        description: form.description || '',
        timing: formattedTiming,
        weekdays: selectedWeekdays,
        startDate,
        endDate,
        startTime,
        maxStudents: Number(form.maxStudents) || 25,
        maxCapacity: Number(form.maxStudents) || 25,
        enrolledStudents: filteredSelectedStudents,
        currency: 'INR',
      };

      if (editingId && form.meetingLink) {
        payload.meetingLink = form.meetingLink;
      }

      if (form.teacherId) {
        payload.mentorId = form.teacherId;
        payload.mentorName = selectedTeacher?.name || 'Teacher';
      } else {
        payload.mentorName = 'Unassigned';
      }

      if (editingId) {
        await api.put(`/classes/${editingId}`, payload);
        toast.success('Batch updated! Daily classes & Zoom links sync automatically.');
      } else {
        await api.post('/classes', payload);
        toast.success('New batch created! Daily classes will be auto-generated on schedule.');
      }
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save batch');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success('Batch deleted');
      fetchData();
    } catch (err: any) {
      toast.error('Failed to delete batch');
    }
  };

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
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update batch status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleUploadPdfToBatch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pdfModalBatch) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Please select a PDF file (.pdf)');
      e.target.value = '';
      return;
    }

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData?.url) {
        throw new Error(uploadData?.error || 'Failed to upload PDF file');
      }

      const finalTitle = pdfTitle.trim() || file.name.replace(/\.pdf$/i, '');
      const saveRes = await api.post<ClassItem>(`/classes/${pdfModalBatch._id}/materials`, {
        title: finalTitle,
        url: uploadData.url,
        fileName: file.name,
      });

      const updatedBatch = saveRes.data;
      setPdfModalBatch(updatedBatch);
      setClasses((prev) => prev.map((c) => (c._id === updatedBatch._id ? updatedBatch : c)));
      setPdfTitle('');
      toast.success(`PDF "${finalTitle}" added to batch!`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to upload PDF');
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  const handleDeletePdfFromBatch = async (batchId: string, materialId: string) => {
    if (!confirm('Remove this PDF from the batch?')) return;
    try {
      const res = await api.delete<ClassItem>(`/classes/${batchId}/materials/${materialId}`);
      const updatedBatch = res.data;
      setPdfModalBatch(updatedBatch);
      setClasses((prev) => prev.map((c) => (c._id === updatedBatch._id ? updatedBatch : c)));
      toast.success('PDF removed from batch');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete PDF');
    }
  };

  interface InstructorItem {
    _id: string;
    name: string;
    email?: string;
    role?: string;
  }

  // Build list of all mentors/teachers from user list + class mentor records
  const mentorMap = new Map<string, InstructorItem>();
  mentorUsers.forEach((u) => {
    mentorMap.set(String(u._id), {
      _id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role,
    });
  });

  classes.forEach((cls) => {
    const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId);
    const mName = cls.mentor?.name || (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName;
    if (mId && mName) {
      if (!mentorMap.has(String(mId))) {
        const found = mentorUsers.find((u) => String(u._id) === String(mId));
        mentorMap.set(String(mId), {
          _id: String(mId),
          name: mName,
          email: cls.mentor?.email || (typeof cls.mentorId === 'object' ? cls.mentorId?.email : ''),
          role: found?.role || (cls.mentor as any)?.role,
        });
      }
    } else if (mName && mName !== 'Unassigned' && mName !== 'Instructor') {
      const key = `name_${mName.toLowerCase().trim()}`;
      if (!mentorMap.has(key)) {
        const found = mentorUsers.find(
          (u) => u.name.trim().toLowerCase() === mName.trim().toLowerCase()
        );
        mentorMap.set(key, {
          _id: key,
          name: mName,
          email: '',
          role: found?.role,
        });
      }
    }
  });

  const allMentorsList = Array.from(mentorMap.values());

  const getInstructorRoleLabel = (inst?: { _id?: string; name?: string; role?: string } | null) => {
    if (!inst) return 'Teacher';
    const roleCandidate =
      inst.role ||
      mentorUsers.find(
        (u) =>
          (inst._id && String(u._id) === String(inst._id)) ||
          (inst.name && u.name.trim().toLowerCase() === inst.name.trim().toLowerCase())
      )?.role;

    if (roleCandidate) {
      const r = roleCandidate.toLowerCase().trim();
      if (r === 'mentor') return 'Mentor';
      if (r === 'teacher') return 'Teacher';
      return roleCandidate.charAt(0).toUpperCase() + roleCandidate.slice(1);
    }

    if (inst.name && inst.name.toLowerCase().includes('mentor')) return 'Mentor';
    return 'Teacher';
  };

  const classMatchesMentor = (cls: ClassItem, mentor: { _id: string; name: string }) => {
    const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId);
    const mName = cls.mentor?.name || (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName;

    if (mId && mentor._id && !mentor._id.startsWith('name_')) {
      if (String(mId) === String(mentor._id)) return true;
    }
    if (mName && mentor.name) {
      if (mName.trim().toLowerCase() === mentor.name.trim().toLowerCase()) return true;
    }
    return false;
  };

  // Compile statistics for all mentors
  const mentorStatsList = allMentorsList.map((m) => {
    const mentorClasses = classes.filter((cls) => classMatchesMentor(cls, m));
    const active = mentorClasses.filter((cls) => cls.status !== 'completed');
    const previous = mentorClasses.filter((cls) => cls.status === 'completed');

    const studentIdSet = new Set<string>();
    mentorClasses.forEach((cls) => {
      const students = cls.enrolledStudents || cls.students || [];
      students.forEach((st: any) => {
        if (!st) return;
        const sId = String(typeof st === 'object' ? (st._id || st.id || st.studentId) : st);
        if (sId) studentIdSet.add(sId);
      });
    });

    return {
      mentor: m,
      mentorClasses,
      activeClasses: active,
      previousClasses: previous,
      totalClassesCount: mentorClasses.length,
      totalStudentsCount: studentIdSet.size,
    };
  });

  // Helper for badge color & label matching the mockup
  const getClassBadge = (cls: ClassItem) => {
    const lang = cls.language || 'German';
    const cat = (cls.categories && cls.categories.length > 0 ? cls.categories[0] : cls.category) || '';

    if (cls.isConversational || lang === 'Conversational' || (cls.categories && cls.categories.includes('Conversational'))) {
      return {
        label: 'Conversational',
        color: 'bg-purple-100/90 text-purple-700 border-purple-200/60',
      };
    }
    if (lang === 'German') {
      const isLevelB = cat.startsWith('B');
      return {
        label: cat ? `${cat} German` : 'German',
        color: isLevelB
          ? 'bg-purple-100/90 text-purple-700 border-purple-200/60'
          : 'bg-blue-100/90 text-blue-700 border-blue-200/60',
      };
    }
    if (lang === 'English') {
      return {
        label: cat && cat !== 'All' ? `${cat} English` : 'English',
        color: 'bg-blue-100/90 text-blue-700 border-blue-200/60',
      };
    }
    if (lang === 'Spanish') {
      return {
        label: cat && cat !== 'All' ? `${cat} Spanish` : 'Spanish',
        color: 'bg-amber-100/90 text-amber-700 border-amber-200/60',
      };
    }
    return {
      label: `${lang} ${cat}`.trim(),
      color: 'bg-emerald-100/90 text-emerald-700 border-emerald-200/60',
    };
  };

  // Avatar theme generator matching the pastel circles in the mockup
  const getAvatarTheme = (name: string) => {
    const themes = [
      { bg: 'bg-purple-100 text-purple-700' },
      { bg: 'bg-emerald-100 text-emerald-700' },
      { bg: 'bg-amber-100 text-amber-700' },
      { bg: 'bg-blue-100 text-blue-700' },
      { bg: 'bg-rose-100 text-rose-700' },
      { bg: 'bg-orange-100 text-orange-700' },
    ];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return themes[Math.abs(hash) % themes.length];
  };

  // Date formatter matching "Tue, 10 Nov 2026"
  const formatUKDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getClassDateDisplay = (cls: ClassItem) => {
    const state = getBatchSessionState(cls);
    if (state.awaitingTeacherCompletion) {
      return `Pending teacher completion (${state.pendingFormattedDate})`;
    }
    if (cls.startDate) {
      return formatUKDate(cls.startDate);
    }
    if (state.nextSession?.dateStr) {
      return formatUKDate(state.nextSession.dateStr);
    }
    return cls.timing || 'Upcoming';
  };

  const isMentorCreatedClass = (cls: ClassItem) => {
    const mRole = typeof cls.mentorId === 'object' ? cls.mentorId?.role : undefined;
    if (mRole === 'mentor') return true;
    const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId);
    const mName = cls.mentor?.name || (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) || cls.mentorName;
    const foundUser = mentorUsers.find(
      (u) =>
        (mId && String(u._id) === String(mId)) ||
        (mName && u.name.trim().toLowerCase() === mName.trim().toLowerCase())
    );
    return foundUser?.role === 'mentor';
  };

  // Classes Studio shows regular/teacher classes (mentor classes appear in Mentor Classes page)
  const studioClasses = classes.filter((cls) => !isMentorCreatedClass(cls));

  // Filter checker for classes
  const matchesClassFilters = (cls: ClassItem) => {
    if (selectedTeacherFilter !== 'all') {
      const targetTeacher = allMentorsList.find((t) => t._id === selectedTeacherFilter);
      if (targetTeacher) {
        if (!classMatchesMentor(cls, targetTeacher)) return false;
      } else {
        const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId);
        if (String(mId) !== selectedTeacherFilter) return false;
      }
    }
    if (statusFilter === 'active' && cls.status === 'completed') return false;
    if (statusFilter === 'completed' && cls.status !== 'completed') return false;
    if (languageFilter !== 'all' && cls.language !== languageFilter) return false;
    if (levelFilter !== 'all') {
      const matchCat =
        cls.category === levelFilter ||
        (cls.categories && cls.categories.includes(levelFilter));
      if (!matchCat) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = cls.title.toLowerCase().includes(q);
      const matchDesc = (cls.description || '').toLowerCase().includes(q);
      const matchTeacher = (cls.mentorName || cls.mentor?.name || (typeof cls.mentorId === 'object' ? cls.mentorId?.name : '') || '').toLowerCase().includes(q);
      const matchLang = (cls.language || '').toLowerCase().includes(q);
      const matchLevel = (cls.category || '').toLowerCase().includes(q);
      const studentsArr = cls.enrolledStudents || cls.students || [];
      const matchStudent = studentsArr.some((st: any) =>
        typeof st === 'object' && ((st.name || '').toLowerCase().includes(q) || (st.email || '').toLowerCase().includes(q))
      );
      if (!matchTitle && !matchDesc && !matchTeacher && !matchLang && !matchLevel && !matchStudent) return false;
    }
    return true;
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-6 font-[Plus_Jakarta_Sans] p-2 sm:p-4">
      
      {/* 1. TOP TOOLBAR: Search & Add Class */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full md:w-auto justify-end">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search classes, teachers or level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200/90 bg-white text-xs sm:text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#1E2B7B] focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Create Batch Button */}
          <button
            type="button"
            onClick={() => handleOpenCreate()}
            className="px-4 py-2.5 bg-[#1E2B7B] hover:bg-[#16215B] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Batch</span>
          </button>
        </div>
      </div>



      {/* 3. FILTERS & VIEW MODE SWITCHER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          {/* All Classes Pill */}
          <button
            type="button"
            onClick={() => {
              setPrimaryTab('all');
              setSelectedTeacherFilter('all');
              setLevelFilter('all');
              setLanguageFilter('all');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              primaryTab === 'all' &&
              levelFilter === 'all' &&
              languageFilter === 'all' &&
              statusFilter === 'all' &&
              selectedTeacherFilter === 'all'
                ? 'bg-[#1E2B7B] text-white shadow-xs'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 shadow-2xs'
            }`}
          >
            All Classes
          </button>

          {/* By Teacher Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={selectedTeacherFilter}
              onChange={(e) => {
                setSelectedTeacherFilter(e.target.value);
                setPrimaryTab('teacher');
              }}
              className={`appearance-none pl-3.5 pr-8 py-2 rounded-full text-xs font-black cursor-pointer transition-all border ${
                selectedTeacherFilter !== 'all'
                  ? 'bg-[#1E2B7B] text-white border-[#1E2B7B] shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 shadow-2xs'
              }`}
            >
              <option value="all">By Teacher</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.language ? `(${t.language})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${
                selectedTeacherFilter !== 'all' ? 'text-white' : 'text-gray-400'
              }`}
            />
          </div>

          {/* By Level Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className={`appearance-none pl-3.5 pr-8 py-2 rounded-full text-xs font-black cursor-pointer transition-all border ${
                levelFilter !== 'all'
                  ? 'bg-[#1E2B7B] text-white border-[#1E2B7B] shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 shadow-2xs'
              }`}
            >
              <option value="all">By Level</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
            <ChevronDown
              className={`w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${
                levelFilter !== 'all' ? 'text-white' : 'text-gray-400'
              }`}
            />
          </div>

          {/* By Language Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className={`appearance-none pl-3.5 pr-8 py-2 rounded-full text-xs font-black cursor-pointer transition-all border ${
                languageFilter !== 'all'
                  ? 'bg-[#1E2B7B] text-white border-[#1E2B7B] shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 shadow-2xs'
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

          {/* By Status Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'completed')}
              className={`appearance-none pl-3.5 pr-8 py-2 rounded-full text-xs font-black cursor-pointer transition-all border ${
                statusFilter !== 'all'
                  ? 'bg-[#1E2B7B] text-white border-[#1E2B7B] shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 shadow-2xs'
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

          {/* Clear Filters Button */}
          {(levelFilter !== 'all' ||
            languageFilter !== 'all' ||
            statusFilter !== 'all' ||
            selectedTeacherFilter !== 'all' ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setLevelFilter('all');
                setLanguageFilter('all');
                setStatusFilter('all');
                setSelectedTeacherFilter('all');
                setSearchQuery('');
              }}
              className="text-[11px] font-bold text-gray-500 hover:text-gray-800 underline ml-1 cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* View Switchers: Grid / List */}
        <div className="flex items-center gap-1 self-end md:self-auto bg-gray-100/90 p-1 rounded-xl border border-gray-200/80">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-[#1E2B7B] text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[#1E2B7B] text-white shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTENT AREA */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 bg-white border border-gray-100 rounded-3xl p-5 animate-pulse"
            />
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW: Class-Centric Cards (Class -> Assigned Teacher -> Enrolled Students) */
        (() => {
          const displayedClasses = studioClasses.filter((cls) => matchesClassFilters(cls));

          if (displayedClasses.length === 0) {
            return (
              <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center space-y-3 shadow-xs">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="text-base font-extrabold text-gray-800">
                  No classes found
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
                  Try adjusting your search query, teacher, level, or language filters.
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedClasses.map((cls) => {
                const badge = getClassBadge(cls);
                const isActive = cls.status !== 'completed';
                const studentsList = (cls.enrolledStudents || cls.students || []).filter(Boolean);
                const enrolledCount = studentsList.length;
                const maxCapacity = cls.maxCapacity || cls.maxStudents || 25;

                const mId = cls.mentor?._id || (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId);
                const assignedTeacher =
                  teachers.find((t) => String(t._id) === String(mId)) ||
                  mentorUsers.find((t) => String(t._id) === String(mId));
                const teacherName =
                  assignedTeacher?.name ||
                  (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) ||
                  (cls.mentorName && cls.mentorName !== 'Instructor' && cls.mentorName !== 'Unassigned' ? cls.mentorName : null);
                const teacherEmail =
                  assignedTeacher?.email ||
                  (typeof cls.mentorId === 'object' ? cls.mentorId?.email : '') ||
                  '';

                return (
                  <div
                    key={cls._id}
                    className="bg-white rounded-3xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3.5">
                      {/* 1. CLASS HEADER: Level Badge, Status, Title & Timing */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${badge.color}`}>
                            {badge.label}
                          </span>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                              isActive
                                ? 'bg-emerald-100/80 text-emerald-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'
                              }`}
                            />
                            {isActive ? 'Active' : 'Completed'}
                          </span>
                        </div>

                        <div>
                          <h3
                            onClick={() => setPreviewClass(cls)}
                            className="text-base font-black text-gray-900 leading-snug cursor-pointer hover:text-[#1E2B7B] transition-colors"
                          >
                            {cls.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold mt-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{cls.timing || getClassDateDisplay(cls)}</span>
                          </div>
                        </div>
                      </div>

                      {/* 2. ASSIGNED TEACHER SECTION */}
                      <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          {teacherName ? (
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${getAvatarTheme(teacherName).bg}`}
                            >
                              {teacherName.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                              Assigned Teacher
                            </span>
                            {teacherName ? (
                              <>
                                <p className="text-xs font-black text-gray-900 truncate">{teacherName}</p>
                                {teacherEmail && (
                                  <p className="text-[11px] text-gray-500 truncate">{teacherEmail}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-xs font-bold text-amber-700">No Teacher Assigned</p>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenAssignTeacher(cls)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-gray-100 border border-gray-200 text-[11px] font-bold text-gray-700 shrink-0 cursor-pointer"
                          title="Assign or change teacher"
                        >
                          {teacherName ? 'Change' : 'Assign'}
                        </button>
                      </div>

                      {/* 3. ENROLLED STUDENTS SECTION */}
                      <div className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100/90 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-emerald-600" />
                            Students ({enrolledCount} / {maxCapacity})
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openRosterModal(cls, 'assign')}
                              className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-100/60 border border-emerald-200 text-[11px] font-bold text-emerald-800 cursor-pointer"
                            >
                              Select Students
                            </button>
                            <button
                              type="button"
                              onClick={() => openRosterModal(cls, 'current')}
                              className="text-[11px] font-extrabold text-[#1E2B7B] hover:underline cursor-pointer"
                            >
                              View Roster
                            </button>
                          </div>
                        </div>

                        {enrolledCount === 0 ? (
                          <p className="text-xs text-gray-400 font-medium">No students assigned to this batch yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {studentsList.slice(0, 4).map((st: any, idx: number) => {
                              const stName = typeof st === 'object' ? st.name || 'Student' : 'Student';
                              return (
                                <span
                                  key={typeof st === 'object' ? st._id || idx : idx}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-emerald-200/80 text-[11px] font-bold text-gray-800 shadow-2xs"
                                >
                                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[9px] font-black">
                                    {stName.charAt(0).toUpperCase()}
                                  </span>
                                  <span className="truncate max-w-[100px]">{stName}</span>
                                </span>
                              );
                            })}
                            {enrolledCount > 4 && (
                              <button
                                type="button"
                                onClick={() => openRosterModal(cls, 'current')}
                                className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-[11px] font-black cursor-pointer"
                              >
                                +{enrolledCount - 4} more
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openRosterModal(cls, 'current')}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#1E2B7B]" />
                        <span>Students ({enrolledCount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setHistoryModalClass(cls);
                          setHistoryTab('teacher');
                        }}
                        className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
                        title="Class History"
                      >
                        <History className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPdfModalBatch(cls);
                          setPdfTitle('');
                        }}
                        className="relative p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                        title="Batch PDFs"
                      >
                        <FileText className="w-4 h-4" />
                        {(cls.materials?.length || 0) > 0 && (
                          <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center">
                            {cls.materials?.length}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEdit(cls)}
                        className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors cursor-pointer"
                        title="Edit Batch"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(cls._id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                        title="Delete Batch"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()
      ) : (
        /* LIST VIEW: Flat Table matching all filters */
        (() => {
          const listFilteredClasses = studioClasses.filter((cls) => matchesClassFilters(cls));

          if (listFilteredClasses.length === 0) {
            return (
              <div className="bg-white border border-gray-200/80 rounded-3xl p-12 text-center space-y-3 shadow-xs">
                <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
                <h3 className="text-base font-extrabold text-gray-800">No classes found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto font-medium">
                  Try adjusting your search query, level, or language filters.
                </p>
              </div>
            );
          }

          return (
            <div className="bg-white border border-gray-200/80 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200/80 text-gray-500 font-extrabold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Batch Title</th>
                      <th className="py-3.5 px-4">Teacher</th>
                      <th className="py-3.5 px-4">Language &amp; Level</th>
                      <th className="py-3.5 px-4">Schedule / Date</th>
                      <th className="py-3.5 px-4">Enrolled</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {listFilteredClasses.map((cls) => {
                      const badge = getClassBadge(cls);
                      const teacher =
                        teachers.find(
                          (t) =>
                            t._id ===
                            (cls.mentor?._id ||
                              (typeof cls.mentorId === 'object'
                                ? cls.mentorId?._id
                                : cls.mentorId))
                        ) ||
                        allMentorsList.find((t) => classMatchesMentor(cls, t));
                      const teacherName =
                        teacher?.name || cls.mentorName || 'Unassigned';
                      const enrolledCount = (
                        cls.enrolledStudents || cls.students || []
                      ).length;
                      const maxCapacity =
                        cls.maxCapacity || cls.maxStudents || 15;
                      const isActive = cls.status !== 'completed';
                      const dateStr = getClassDateDisplay(cls);

                      return (
                        <tr
                          key={cls._id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-4 font-black text-gray-900">
                            <div>{cls.title}</div>
                            {cls.description && (
                              <div className="text-[11px] font-normal text-gray-400 line-clamp-1">
                                {cls.description}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-800">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center justify-center shrink-0">
                                  {teacherName.charAt(0).toUpperCase()}
                                </span>
                                <div className="min-w-0">
                                  <span className="block leading-tight truncate">{teacherName}</span>
                                  <span className="text-[10px] text-gray-400 font-semibold block">
                                    {getInstructorRoleLabel(teacher || { name: teacherName })}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleOpenAssignTeacher(cls)}
                                className="px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-gray-200 text-[10px] font-bold text-gray-700 shrink-0 cursor-pointer"
                                title="Assign or change teacher"
                              >
                                {teacherName !== 'Unassigned' ? 'Change' : 'Assign'}
                              </button>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span>{dateStr}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-gray-700">
                            {enrolledCount} / {maxCapacity}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[11px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                isActive
                                  ? 'bg-emerald-100/80 text-emerald-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive
                                    ? 'bg-emerald-600 animate-pulse'
                                    : 'bg-gray-400'
                                }`}
                              />
                              {isActive ? 'Active' : 'Completed'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => openRosterModal(cls, 'assign')}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg cursor-pointer"
                                title="Select / Assign Students"
                              >
                                <Users className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openRosterModal(cls, 'current')}
                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg cursor-pointer"
                                title="View Enrolled Roster"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setHistoryModalClass(cls);
                                  setHistoryTab('teacher');
                                }}
                                className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg cursor-pointer"
                                title="Class History"
                              >
                                <History className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPdfModalBatch(cls);
                                  setPdfTitle('');
                                }}
                                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg cursor-pointer flex items-center gap-0.5"
                                title="Batch PDFs"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                {(cls.materials?.length || 0) > 0 && (
                                  <span className="text-[10px] font-black">{cls.materials?.length}</span>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(cls)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg cursor-pointer"
                                title="Edit Class"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleToggleBatchStatus(cls._id, cls.status)
                                }
                                className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg cursor-pointer"
                                title={
                                  isActive ? 'End Batch' : 'Reactivate Batch'
                                }
                              >
                                {isActive ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <RotateCcw className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(cls._id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                                title="Delete Class"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()
      )}

      {/* 5. CLASS DETAILS QUICK MODAL (when clicking a class card) */}
      {previewClass && (() => {
        const badge = getClassBadge(previewClass);
        const enrolledCount = (previewClass.enrolledStudents || previewClass.students || []).length;
        const maxCapacity = previewClass.maxCapacity || previewClass.maxStudents || 15;
        const percentFilled = Math.min(100, Math.round((enrolledCount / maxCapacity) * 100));
        const teacher =
          teachers.find(
            (t) =>
              t._id ===
              (previewClass.mentor?._id ||
                (typeof previewClass.mentorId === 'object'
                  ? previewClass.mentorId?._id
                  : previewClass.mentorId))
          ) || allMentorsList.find((t) => classMatchesMentor(previewClass, t));
        const teacherName = teacher?.name || previewClass.mentorName || 'Unassigned';
        const isActive = previewClass.status !== 'completed';
        const dateStr = getClassDateDisplay(previewClass);

        return (
          <div className="fixed inset-0 z-[9998] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white border border-emerald-100/90 rounded-3xl w-full max-w-lg p-6 sm:p-7 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isActive
                          ? 'bg-emerald-100/80 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`} />
                      {isActive ? 'Active Batch' : 'Completed Batch'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight pt-1">
                    {previewClass.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewClass(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-4 text-xs">
                {/* Teacher Row */}
                <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm shrink-0">
                      {teacherName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        Assigned {getInstructorRoleLabel(teacher || { name: teacherName })}
                      </div>
                      <div className="text-sm font-extrabold text-gray-900 truncate">{teacherName}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const target = previewClass;
                      setPreviewClass(null);
                      handleOpenAssignTeacher(target);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-xs font-bold text-gray-700 shrink-0 cursor-pointer"
                  >
                    {teacherName !== 'Unassigned' ? 'Change' : 'Assign'}
                  </button>
                </div>

                {/* Schedule Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                      Session Timing &amp; Date
                    </span>
                    <span className="font-black text-gray-900 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-600" />
                      {previewClass.startTime ? formatTo12Hour(previewClass.startTime) : '19:00 PM'} IST
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-gray-800">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{dateStr}</span>
                  </div>
                  {previewClass.weekdays && previewClass.weekdays.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      <span className="text-[10px] font-bold text-gray-400">Days:</span>
                      {previewClass.weekdays.map((d) => (
                        <span
                          key={d}
                          className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Meeting Link */}
                {(() => {
                  const sessionState = getBatchSessionState(previewClass);
                  if (sessionState.awaitingTeacherCompletion) {
                    return (
                      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center gap-2 text-amber-900 text-xs font-bold">
                        <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>
                          Waiting for teacher to mark {sessionState.pendingFormattedDate} class complete — Next class details locked.
                        </span>
                      </div>
                    );
                  }
                  if (previewClass.meetingLink) {
                    const { joinStatus } = sessionState;
                    return (
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-emerald-900 truncate font-mono text-[11px]">
                            {previewClass.meetingLink}
                          </span>
                        </div>
                        {joinStatus.canJoin ? (
                          <a
                            href={previewClass.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] shrink-0 flex items-center gap-1"
                          >
                            <span>Join</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              toast.info(`Live session opens 10 minutes before class time (${joinStatus.reason}). Opens at ${joinStatus.opensAtTimeStr}!`);
                            }}
                            disabled className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-xl font-bold text-[11px] shrink-0 flex items-center gap-1 cursor-not-allowed opacity-75 select-none"
                            title="Opens 10 mins before class"
                          >
                            <Clock className="w-3 h-3 text-gray-500" />
                            <span>{joinStatus.opensAtTimeStr || '10m prior'}</span>
                          </button>
                        )}
                      </div>
                    );
                  }
                  return (
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold">
                      <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zoom link auto-generates everyday 10 minutes before class time</span>
                    </div>
                  );
                })()}

                {/* Enrollment Progress */}
                <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-200/70 rounded-2xl">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-gray-500">Student Enrollment</span>
                    <span className="text-gray-900">
                      {enrolledCount} / {maxCapacity} Seats ({percentFilled}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                </div>

                {/* Curriculum Description */}
                {previewClass.description && (
                  <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-1">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Batch Notes / Description
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {previewClass.description}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const target = previewClass;
                      setPreviewClass(null);
                      openRosterModal(target, 'assign');
                    }}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Select Students</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const target = previewClass;
                      setPreviewClass(null);
                      openRosterModal(target, 'current');
                    }}
                    className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-700" />
                    <span>Enrolled Roster ({enrolledCount})</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      handleToggleBatchStatus(previewClass._id, previewClass.status);
                      setPreviewClass((prev) =>
                        prev
                          ? {
                              ...prev,
                              status: prev.status === 'completed' ? 'active' : 'completed',
                            }
                          : null
                      );
                    }}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>End Batch</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reactivate</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const target = previewClass;
                      setPreviewClass(null);
                      handleOpenEdit(target);
                    }}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold cursor-pointer"
                    title="Edit Batch"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const id = previewClass._id;
                      setPreviewClass(null);
                      handleDelete(id);
                    }}
                    className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold cursor-pointer"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CREATE / EDIT CLASS MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-3xl w-full max-w-[740px] my-auto shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                  {editingId ? 'Edit Batch' : 'Create Batch'}
                </h3>
                <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                  Daily classes &amp; Zoom links auto-generate automatically inside the batch
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-5 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
              {/* 1. Batch Title */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1">
                  Batch Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German A1 : Berlin 01 Morning"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50/70 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1E2B7B] text-xs sm:text-sm font-semibold transition-all"
                />
              </div>

              {/* 2. Teacher Select -> Language Automatically Set */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1">
                  Select Teacher <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <select
                    required
                    value={form.teacherId}
                    onChange={(e) => handleTeacherSelect(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50/70 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#1E2B7B] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                  >
                    <option value="">Choose Teacher...</option>
                    {teachers.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} {t.language ? `(${t.language})` : ''}
                      </option>
                    ))}
                  </select>
                  {form.language && (
                    <div
                      className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-black text-xs shrink-0 flex items-center gap-1.5"
                      title="Language is automatically set from teacher's profile"
                    >
                      <span className="text-blue-500 font-bold text-[10px] uppercase">Language:</span>
                      <span>{form.language}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Target Level(s) & Conversational Toggle */}
              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-700">
                    Levels
                  </span>

                  {/* Conversational Checkbox */}
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
                </div>

                {/* Level pills: A1, A2, B1, B2 in all languages */}
                <div className="flex items-center gap-2 flex-wrap">
                  {['A1', 'A2', 'B1', 'B2'].map((lvl) => {
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

                  {form.isConversational && (
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

              {/* 6. Automatic Zoom Link Status */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center gap-2.5">
                <Video className="w-4 h-4 text-emerald-700 shrink-0" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-900">
                    Zoom Classroom Link
                  </span>
                  {form.meetingLink ? (
                    <span className="text-xs font-mono font-bold text-emerald-800 truncate block">
                      {form.meetingLink}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700">
                      Daily class sessions &amp; Zoom links auto-generate everyday 10 minutes before batch time
                    </span>
                  )}
                </div>
              </div>

              {/* 7. Assign Multiple Students (Strictly matched to Batch Level & Language) */}
              {(() => {
                const matchedStudents = getMatchingStudents(
                  form.language,
                  form.categories,
                  form.isConversational,
                );
                const q = modalStudentSearch.trim().toLowerCase();
                const visibleStudents = matchedStudents.filter((s) => {
                  if (!q) return true;
                  return (
                    (s.name || '').toLowerCase().includes(q) ||
                    (s.email || '').toLowerCase().includes(q) ||
                    (s.studentId || '').toLowerCase().includes(q) ||
                    (s.phoneNumber || '').toLowerCase().includes(q)
                  );
                });
                const selectedInMatched = matchedStudents.filter((s) =>
                  form.selectedStudentIds.includes(String(s._id)),
                ).length;

                return (
                  <div className="rounded-2xl border border-gray-200/90 bg-slate-50/70 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#1E2B7B]" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-800">
                          Assign Students ({form.language} • {form.isConversational ? 'Conversational' : form.categories.join(', ')})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {selectedInMatched} Selected
                        </span>
                        {matchedStudents.length > 0 && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                const allIds = Array.from(
                                  new Set([
                                    ...form.selectedStudentIds,
                                    ...visibleStudents.map((s) => String(s._id)),
                                  ]),
                                );
                                setForm((prev) => ({ ...prev, selectedStudentIds: allIds }));
                              }}
                              className="text-[11px] font-bold text-[#1E2B7B] hover:underline cursor-pointer"
                            >
                              Select All
                            </button>
                            {selectedInMatched > 0 && (
                              <button
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, selectedStudentIds: [] }))}
                                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder={`Search ${form.categories.join('/')} students by name, email or ID...`}
                        value={modalStudentSearch}
                        onChange={(e) => setModalStudentSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1E2B7B]"
                      />
                    </div>

                    {visibleStudents.length === 0 ? (
                      <p className="text-xs text-gray-400 font-medium py-3 text-center bg-white rounded-xl border border-gray-100">
                        No students found in {form.language} {form.isConversational ? '' : `Level ${form.categories.join(', ')}`}.
                      </p>
                    ) : (
                      <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                        {visibleStudents.map((st) => {
                          const stId = String(st._id);
                          const isChecked = form.selectedStudentIds.includes(stId);
                          return (
                            <label
                              key={stId}
                              className={`flex items-center justify-between gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-emerald-50/90 border-emerald-500'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    setForm((prev) => ({
                                      ...prev,
                                      selectedStudentIds: isChecked
                                        ? prev.selectedStudentIds.filter((id) => id !== stId)
                                        : [...prev.selectedStudentIds, stId],
                                    }))
                                  }
                                  className="w-4 h-4 rounded accent-emerald-600 cursor-pointer shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-extrabold text-gray-900 truncate">{st.name}</p>
                                  <p className="text-[11px] text-gray-500 truncate">
                                    {st.email || st.phoneNumber || st.studentId || 'Student'}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                                {st.category || 'A1'}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-gray-100 flex items-center justify-end gap-2.5 bg-gray-50/50 shrink-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#1E2B7B] hover:bg-[#16205b] text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>
                  {editingId ? 'Save Batch' : 'Create Batch'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ENROLLED STUDENTS MODAL */}
      {selectedClassForStudents && (() => {
        const badge = getClassBadge(selectedClassForStudents);
        const maxCapacity = selectedClassForStudents.maxCapacity || selectedClassForStudents.maxStudents || 15;
        const isActive = selectedClassForStudents.status !== 'completed';
        const dateDisplay = getClassDateDisplay(selectedClassForStudents);

        const mName =
          selectedClassForStudents.mentor?.name ||
          (typeof selectedClassForStudents.mentorId === 'object'
            ? selectedClassForStudents.mentorId?.name
            : null) ||
          selectedClassForStudents.mentorName ||
          'Unassigned';
        const inst = allMentorsList.find((t) =>
          classMatchesMentor(selectedClassForStudents, t)
        );
        const roleLabel = getInstructorRoleLabel(inst || { name: mName });

        const currentEnrolledList = (
          selectedClassForStudents.enrolledStudents || selectedClassForStudents.students || []
        ).filter(Boolean);

        const currentStudentIdSet = new Set(
          currentEnrolledList.map((s: any) =>
            String(typeof s === 'object' ? (s._id || s.id || s.studentId) : s)
          )
        );

        // Map previous students across other classes
        const previousStudentsMap = new Map<string, {
          student: any;
          studentId: string;
          name: string;
          email: string;
          phoneNumber?: string;
          category?: string;
          previousClasses: { classId: string; title: string; category?: string }[];
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
                phoneNumber: typeof st === 'object' ? st.phoneNumber : undefined,
                category: typeof st === 'object' ? st.category : undefined,
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

        // Search filtering for live search inside roster
        const q = rosterSearch.trim().toLowerCase();
        const filteredCurrentList = currentEnrolledList.filter((st: any) => {
          if (!q) return true;
          const isObj = typeof st === 'object' && st !== null;
          const name = (isObj ? st.name : '') || '';
          const email = (isObj ? st.email : '') || '';
          const phone = (isObj ? st.phoneNumber : '') || '';
          const studentId = (isObj ? st.studentId : '') || '';
          return (
            name.toLowerCase().includes(q) ||
            email.toLowerCase().includes(q) ||
            phone.toLowerCase().includes(q) ||
            studentId.toLowerCase().includes(q)
          );
        });

        const filteredPreviousList = previousStudentsList.filter((item) => {
          if (!q) return true;
          return (
            item.name.toLowerCase().includes(q) ||
            item.email.toLowerCase().includes(q) ||
            (item.phoneNumber || '').toLowerCase().includes(q) ||
            item.studentId.toLowerCase().includes(q)
          );
        });

        const percentFilled = Math.min(100, Math.round((currentEnrolledList.length / maxCapacity) * 100));

        return (
          <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white border border-gray-200/90 rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              
              {/* 1. Header: Big, Clean & Informative */}
              <div className="px-6 sm:px-8 py-5 border-b border-gray-100 bg-slate-50/70">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    {/* Top Row Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-lg border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`} />
                        {isActive ? 'Active Batch' : 'Completed Batch'}
                      </span>
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg bg-slate-200/70 text-slate-700">
                        {currentEnrolledList.length} / {maxCapacity} Seats ({percentFilled}%)
                      </span>
                    </div>

                    {/* Class Title */}
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight truncate">
                      {selectedClassForStudents.title}
                    </h3>

                    {/* Class Subtitle Info */}
                    <div className="flex items-center gap-4 text-xs text-gray-600 font-semibold flex-wrap pt-0.5">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{dateDisplay}</span>
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                        <span>{roleLabel}: <strong className="text-gray-900 font-black">{mName}</strong></span>
                      </span>
                      {selectedClassForStudents.meetingLink && (
                        <>
                          <span className="text-gray-300">•</span>
                          <a
                            href={selectedClassForStudents.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold underline"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Meeting Room</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Close button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClassForStudents(null);
                      setRosterSearch('');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 2. Controls Bar: Tabs & Live Search */}
              <div className="px-6 sm:px-8 py-3.5 border-b border-gray-100 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Tabs */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRosterTab('current')}
                    className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                      rosterTab === 'current'
                        ? 'bg-[#1E2B7B] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200/80'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>This Batch Roster ({currentEnrolledList.length})</span>
                    {returningInCurrentCount > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        rosterTab === 'current' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {returningInCurrentCount} returning
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRosterTab('previous')}
                    className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                      rosterTab === 'previous'
                        ? 'bg-[#1E2B7B] text-white shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-gray-700 border border-gray-200/80'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    <span>Previous Classes Students ({previousStudentsList.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRosterTab('assign')}
                    className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                      rosterTab === 'assign'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Assign Students</span>
                  </button>
                </div>

                {/* Live Search Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or ID..."
                    value={rosterSearch}
                    onChange={(e) => setRosterSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:border-[#1E2B7B] transition-all"
                  />
                  {rosterSearch && (
                    <button
                      type="button"
                      onClick={() => setRosterSearch('')}
                      className="p-1 text-gray-400 hover:text-gray-700 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Main Body: Spacious, Clean Student Roster */}
              <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-3 bg-slate-50/30">
                {rosterTab === 'assign' ? (() => {
                    const batchCats =
                      selectedClassForStudents.categories && selectedClassForStudents.categories.length > 0
                        ? selectedClassForStudents.categories
                        : (selectedClassForStudents.category || 'A1').split(',').map((s) => s.trim()).filter(Boolean);
                    const levelMatchedStudents = getMatchingStudents(
                      selectedClassForStudents.language || 'German',
                      batchCats,
                      selectedClassForStudents.isConversational,
                    );
                    const filteredAssignList = levelMatchedStudents.filter((s) => {
                      if (!q) return true;
                      return (
                        (s.name || '').toLowerCase().includes(q) ||
                        (s.email || '').toLowerCase().includes(q) ||
                        (s.studentId || '').toLowerCase().includes(q) ||
                        (s.phoneNumber || '').toLowerCase().includes(q)
                      );
                    });

                    return (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 bg-white border border-gray-200 rounded-2xl p-3.5">
                          <div className="text-xs font-bold text-gray-700">
                            Showing <strong className="text-gray-900">{filteredAssignList.length}</strong> students in{' '}
                            <span className="text-[#1E2B7B] font-black">
                              {selectedClassForStudents.language || 'German'} •{' '}
                              {selectedClassForStudents.isConversational ? 'Conversational' : `Level ${batchCats.join(', ')}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {filteredAssignList.length > 0 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setRosterSelectedIds((prev) =>
                                    Array.from(new Set([...prev, ...filteredAssignList.map((s) => String(s._id))])),
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-gray-800 cursor-pointer"
                              >
                                Select All ({filteredAssignList.length})
                              </button>
                            )}
                            {rosterSelectedIds.length > 0 && (
                              <button
                                type="button"
                                onClick={() => setRosterSelectedIds([])}
                                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-extrabold text-rose-700 cursor-pointer"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {filteredAssignList.length === 0 ? (
                          <div className="p-12 text-center rounded-3xl bg-white border border-gray-200/80 space-y-2">
                            <Users className="w-10 h-10 text-gray-300 mx-auto" />
                            <h4 className="text-sm font-black text-gray-900">
                              No matching {batchCats.join('/')} level students found
                            </h4>
                            <p className="text-xs text-gray-400 font-medium">
                              Only students from {selectedClassForStudents.language || 'German'} Level {batchCats.join(', ')} can be assigned to this batch.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {filteredAssignList.map((st) => {
                              const stId = String(st._id);
                              const isChecked = rosterSelectedIds.includes(stId);
                              const avatarTheme = getAvatarTheme(st.name || 'S');
                              return (
                                <label
                                  key={stId}
                                  className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                                    isChecked
                                      ? 'bg-emerald-50/90 border-emerald-500 ring-1 ring-emerald-500/20'
                                      : 'bg-white border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() =>
                                        setRosterSelectedIds((prev) =>
                                          isChecked ? prev.filter((id) => id !== stId) : [...prev, stId],
                                        )
                                      }
                                      className="w-4 h-4 rounded accent-emerald-600 cursor-pointer shrink-0"
                                    />
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${avatarTheme.bg}`}>
                                      {(st.name || 'S').charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-xs sm:text-sm font-black text-gray-900 truncate">{st.name}</p>
                                      <p className="text-[11px] text-gray-500 truncate">
                                        {st.email || st.phoneNumber || st.studentId || 'Student'}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                                    Level {st.category || 'A1'}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })() : rosterTab === 'current' ? (
                  /* Current Batch Roster */
                  currentEnrolledList.length === 0 ? (
                    <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border border-gray-200/80 space-y-3 shadow-2xs">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-gray-400">
                        <Users className="w-7 h-7" />
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-gray-900">
                        No students enrolled in this batch yet
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-medium">
                        When students join this class batch from their student portal, their enrollment profile will appear here in real-time.
                      </p>
                      {previousStudentsList.length > 0 && (
                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={() => setRosterTab('previous')}
                            className="px-4 py-2 rounded-xl bg-[#1E2B7B] hover:bg-[#16215B] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                          >
                            <History className="w-4 h-4" />
                            <span>View {previousStudentsList.length} past student(s) from previous classes</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : filteredCurrentList.length === 0 ? (
                    <div className="p-10 text-center rounded-2xl bg-white border border-gray-200 text-gray-500 space-y-1">
                      <p className="text-sm font-bold text-gray-800">No matching students found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search query.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredCurrentList.map((st: any, idx: number) => {
                        const isObj = typeof st === 'object' && st !== null;
                        const name = isObj ? (st.name || 'Student') : 'Student';
                        const email = isObj ? st.email : '';
                        const phone = isObj ? st.phoneNumber : '';
                        const studentId = isObj ? st.studentId : '';
                        const cat = isObj ? (st.category || selectedClassForStudents.category) : selectedClassForStudents.category;
                        const lang = isObj ? (st.language || selectedClassForStudents.language) : selectedClassForStudents.language;
                        const sId = String(isObj ? (st._id || st.id || st.studentId) : st);
                        const prevData = previousStudentsMap.get(sId);
                        const avatarTheme = getAvatarTheme(name);

                        return (
                          <div
                            key={st._id || idx}
                            className="p-4 sm:p-5 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-300 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              {/* Avatar */}
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-2xs ${avatarTheme.bg}`}>
                                {name.charAt(0).toUpperCase()}
                              </div>

                              {/* Details */}
                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h4 className="text-base font-black text-gray-900 leading-tight">
                                    {name}
                                  </h4>
                                  {studentId && (
                                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                                      <IdCard className="w-3 h-3 text-slate-500" />
                                      {studentId}
                                    </span>
                                  )}
                                  {prevData && prevData.previousClasses.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                                      <Sparkles className="w-3 h-3 text-purple-500 fill-purple-500" />
                                      Returning Student ({prevData.previousClasses.length} prior batch{prevData.previousClasses.length > 1 ? 'es' : ''})
                                    </span>
                                  )}
                                </div>

                                {/* Contact Pills */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold flex-wrap">
                                  {email && (
                                    <a
                                      href={`mailto:${email}`}
                                      className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                    >
                                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{email}</span>
                                    </a>
                                  )}
                                  {phone && (
                                    <a
                                      href={`tel:${phone}`}
                                      className="hover:text-emerald-600 flex items-center gap-1.5 font-mono transition-colors"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                                      <span>+91 {phone}</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right side Level / Language Badge */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {lang && (
                                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/60">
                                  {lang}
                                </span>
                              )}
                              {cat && (
                                <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                                  Level {cat}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  /* Previous Classes Students Tab */
                  previousStudentsList.length === 0 ? (
                    <div className="p-12 sm:p-16 text-center rounded-3xl bg-white border border-gray-200/80 space-y-3 shadow-2xs">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-gray-400">
                        <History className="w-7 h-7" />
                      </div>
                      <h4 className="text-base sm:text-lg font-black text-gray-900">
                        No students found from previous classes
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto font-medium">
                        As students complete batches across cohorts with this teacher, their profile history will be organized here.
                      </p>
                    </div>
                  ) : filteredPreviousList.length === 0 ? (
                    <div className="p-10 text-center rounded-2xl bg-white border border-gray-200 text-gray-500 space-y-1">
                      <p className="text-sm font-bold text-gray-800">No matching past students found</p>
                      <p className="text-xs text-gray-400">Try adjusting your search query.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {filteredPreviousList.map((item) => {
                        const avatarTheme = getAvatarTheme(item.name);
                        return (
                          <div
                            key={item.studentId}
                            className="p-4 sm:p-5 rounded-2xl border border-gray-200/90 bg-white hover:border-gray-300 shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shrink-0 shadow-2xs ${avatarTheme.bg}`}>
                                {item.name.charAt(0).toUpperCase()}
                              </div>

                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <h4 className="text-base font-black text-gray-900 leading-tight">
                                    {item.name}
                                  </h4>
                                  {item.isEnrolledInCurrent ? (
                                    <span className="inline-flex items-center gap-1 font-mono text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      Enrolled in this batch
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                      Previous Batch Only
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold flex-wrap">
                                  {item.email && (
                                    <a
                                      href={`mailto:${item.email}`}
                                      className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                    >
                                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                                      <span>{item.email}</span>
                                    </a>
                                  )}
                                  {item.phoneNumber && (
                                    <a
                                      href={`tel:${item.phoneNumber}`}
                                      className="hover:text-emerald-600 flex items-center gap-1.5 font-mono transition-colors"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                                      <span>+91 {item.phoneNumber}</span>
                                    </a>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-1 flex-wrap">
                                  <span className="font-bold text-gray-400 text-[11px]">Previous Batches:</span>
                                  {item.previousClasses.map((pc) => (
                                    <span
                                      key={pc.classId}
                                      className="font-bold text-slate-800 bg-slate-100 border border-slate-200/80 px-2.5 py-0.5 rounded-md text-[11px]"
                                    >
                                      {pc.title} {pc.category ? `(${pc.category})` : ''}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {item.category && (
                                <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                                  Level {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>

              {/* 4. Footer */}
              <div className="px-6 sm:px-8 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-semibold">
                  {rosterTab === 'assign'
                    ? `${rosterSelectedIds.length} student(s) selected for this batch`
                    : rosterTab === 'current'
                    ? `Showing ${filteredCurrentList.length} of ${currentEnrolledList.length} enrolled student(s)`
                    : `Showing ${filteredPreviousList.length} of ${previousStudentsList.length} past student(s)`}
                </span>
                <div className="flex items-center gap-2.5">
                  {rosterTab === 'assign' && (
                    <button
                      type="button"
                      disabled={savingStudents}
                      onClick={handleSaveRosterStudents}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
                    >
                      {savingStudents ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Save Students ({rosterSelectedIds.length})</span>
                        </>
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClassForStudents(null);
                      setRosterSearch('');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#1E2B7B] hover:bg-[#16215B] text-white font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                  >
                    Close Roster
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* CLASS HISTORY MODAL (Previous / Completed Classes) */}
      {historyModalClass && (() => {
        const currentTeacherName =
          teachers.find(
            (t) =>
              t._id ===
              (historyModalClass.mentor?._id ||
                (typeof historyModalClass.mentorId === 'object'
                  ? historyModalClass.mentorId?._id
                  : historyModalClass.mentorId))
          )?.name ||
          historyModalClass.mentorName ||
          'Teacher';

        const previousTeacherClasses = studioClasses.filter((cls) => {
          if (cls.status !== 'completed') return false;
          const mIdA =
            cls.mentor?._id ||
            (typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId);
          const mIdB =
            historyModalClass.mentor?._id ||
            (typeof historyModalClass.mentorId === 'object'
              ? historyModalClass.mentorId?._id
              : historyModalClass.mentorId);
          if (mIdA && mIdB && String(mIdA) === String(mIdB)) return true;
          const nameA = (cls.mentorName || '').trim().toLowerCase();
          const nameB = currentTeacherName.trim().toLowerCase();
          return Boolean(nameA && nameB && nameA === nameB);
        });

        const allPreviousClasses = studioClasses.filter((cls) => cls.status === 'completed');
        const listToShow = historyTab === 'teacher' ? previousTeacherClasses : allPreviousClasses;

        return (
          <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <div className="bg-white border border-gray-200/90 rounded-3xl w-full max-w-[820px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                      Class History (Previous Classes)
                    </h3>
                    <p className="text-xs text-gray-500 font-semibold">
                      {historyModalClass.title} • {currentTeacherName}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHistoryModalClass(null)}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="px-6 pt-4 pb-2 flex items-center gap-2 border-b border-gray-100">
                <button
                  type="button"
                  onClick={() => setHistoryTab('teacher')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    historyTab === 'teacher'
                      ? 'bg-[#1E2B7B] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {currentTeacherName}&apos;s Previous ({previousTeacherClasses.length})
                </button>
                <button
                  type="button"
                  onClick={() => setHistoryTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    historyTab === 'all'
                      ? 'bg-[#1E2B7B] text-white shadow-xs'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Previous Classes ({allPreviousClasses.length})
                </button>
              </div>

              {/* History List */}
              <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-[#f8fafc]">
                {listToShow.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center space-y-2">
                    <History className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-sm font-black text-gray-800">No previous completed classes</p>
                    <p className="text-xs text-gray-400 font-medium">
                      Completed batches will appear here for reference.
                    </p>
                  </div>
                ) : (
                  listToShow.map((prevCls) => {
                    const b = getClassBadge(prevCls);
                    const enrolledLen = (prevCls.enrolledStudents || prevCls.students || []).length;
                    const tName =
                      prevCls.mentor?.name ||
                      (typeof prevCls.mentorId === 'object' ? prevCls.mentorId?.name : null) ||
                      prevCls.mentorName ||
                      'Teacher';
                    return (
                      <div
                        key={prevCls._id}
                        className="bg-white rounded-2xl border border-gray-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${b.color}`}>
                              {b.label}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                              Completed
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-gray-900 truncate">{prevCls.title}</h4>
                          <p className="text-xs text-gray-500 font-medium">
                            {tName} • {prevCls.timing || getClassDateDisplay(prevCls)} • {enrolledLen} Students
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setHistoryModalClass(null);
                              openRosterModal(prevCls, 'current');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                          >
                            Roster ({enrolledLen})
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleBatchStatus(prevCls._id, prevCls.status)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reactivate</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* BATCH PDF UPLOAD & MATERIALS MODAL */}
      {pdfModalBatch && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white border border-gray-200/90 rounded-3xl w-full max-w-[680px] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight truncate">
                    Batch PDFs — {pdfModalBatch.title}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">
                    {pdfModalBatch.language || 'German'} {pdfModalBatch.category || ''} • Visible to enrolled students
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPdfModalBatch(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Upload New PDF Box */}
              <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-4 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PDF Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chapter 1 Grammar Notes"
                    value={pdfTitle}
                    onChange={(e) => setPdfTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="button"
                  disabled={uploadingPdf}
                  onClick={() => document.getElementById('batch-pdf-file-input')?.click()}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#1E2B7B] hover:bg-[#16215B] !text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-all shadow-xs disabled:opacity-60"
                >
                  {uploadingPdf ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span className="text-white">Uploading PDF...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-white" />
                      <span className="text-white">Choose &amp; Upload PDF to Batch</span>
                    </>
                  )}
                </button>
                <input
                  id="batch-pdf-file-input"
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={uploadingPdf}
                  onChange={handleUploadPdfToBatch}
                  className="hidden"
                />
              </div>

              {/* Uploaded PDFs List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-700">
                  Uploaded PDFs ({pdfModalBatch.materials?.length || 0})
                </h4>

                {!pdfModalBatch.materials || pdfModalBatch.materials.length === 0 ? (
                  <p className="text-xs text-gray-400 font-medium py-4 text-center bg-slate-50 rounded-2xl border border-gray-100">
                    No PDFs uploaded for this batch yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {pdfModalBatch.materials.map((mat, idx) => (
                      <div
                        key={mat._id || idx}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-200 bg-white hover:border-blue-200 transition-all"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-extrabold text-gray-900 truncate">
                              {mat.title}
                            </p>
                            {mat.fileName && (
                              <p className="text-[11px] text-gray-400 truncate">{mat.fileName}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={mat.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={mat.fileName || `${mat.title}.pdf`}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {mat._id && (
                            <button
                              type="button"
                              onClick={() => handleDeletePdfFromBatch(pdfModalBatch._id, mat._id!)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                              title="Delete PDF"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TEACHER ONLY MODAL */}
      {assignTeacherBatch && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <form
            onSubmit={handleAssignTeacherSubmit}
            className="bg-white border border-gray-200 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-gray-900 tracking-tight truncate">
                    Assign Teacher
                  </h3>
                  <p className="text-[11px] font-semibold text-gray-500 truncate">
                    {assignTeacherBatch.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssignTeacherBatch(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-700 mb-1.5">
                  Select Teacher <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={assignTeacherId}
                  onChange={(e) => setAssignTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50/70 border border-gray-200 text-gray-900 focus:outline-none focus:bg-white focus:border-[#1E2B7B] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
                >
                  <option value="">Choose Teacher...</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} {t.language ? `(${t.language})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-5 sm:px-6 py-3.5 border-t border-gray-100 flex items-center justify-end gap-2.5 bg-gray-50/50">
              <button
                type="button"
                onClick={() => setAssignTeacherBatch(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingTeacher || !assignTeacherId}
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#1E2B7B] hover:bg-[#16205b] !text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
              >
                <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                <span className="text-white">
                  {savingTeacher ? 'Saving...' : 'Assign Teacher'}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
