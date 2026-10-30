'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Radio,
  Sparkles,
  Upload,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  Mail,
  Search,
  Download,
  Copy,
  Check,
  Send,
  Phone,
  RefreshCw,
  Bell,
  GraduationCap,
} from 'lucide-react';
import { toast } from 'sonner';

interface EmailSubscriber {
  _id: string;
  email: string;
  source: string;
  status: string;
  createdAt: string;
}

interface ClassRegistration {
  _id: string;
  masterclassId: string;
  name: string;
  email: string;
  phone: string;
  masterclassTitle: string;
  masterclassDate: string;
  masterclassTime: string;
  createdAt: string;
}

interface PublicClass {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  instructorRole?: string;
  instructorImage?: string;
  language?: string;
  level?: string;
  category: string;
  capacity: number;
  imageUrl?: string;
  meetingUrl?: string;
  interestedCount?: string;
  isLive?: boolean;
  published?: boolean;
  createdAt?: string;
}

interface InstructorUser {
  _id: string;
  name: string;
  role: string;
  category?: string;
  language?: string;
  avatar?: string;
  email?: string;
  phoneNumber?: string;
}

const languages = [
  { name: 'German', flag: '🇩🇪' },
  { name: 'English', flag: '🇬🇧' },
  { name: 'French', flag: '🇫🇷' },
  { name: 'Spanish', flag: '🇪🇸' },
  { name: 'Italian', flag: '🇮🇹' },
  { name: 'Japanese', flag: '🇯🇵' },
  { name: 'General', flag: '🌐' },
];

const levels = [
  'Beginner Friendly',
  'Conversational',
  'All Levels',
  'A1-A2',
  'B1-B2',
  'Advanced',
];

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  duration: '60',
  instructor: '',
  instructorRole: 'Native Language Teacher',
  instructorImage: '',
  language: 'German',
  level: 'Beginner Friendly',
  category: 'German',
  capacity: 150,
  imageUrl: '',
  meetingUrl: '',
  interestedCount: '1.2K+ interested',
  isLive: true,
  published: true,
};

const DAY_FULL_NAMES: Record<string, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

export default function AdminPublicClassesPage() {
  const [classes, setClasses] = useState<PublicClass[]>([]);
  const [instructors, setInstructors] = useState<InstructorUser[]>([]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Tab state: 'classes' vs 'subscribers'
  const [activeTab, setActiveTab] = useState<'classes' | 'subscribers'>('classes');

  // Subscribers & Registrations state
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [registrations, setRegistrations] = useState<ClassRegistration[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Date OR Weekdays selection state
  const [dateMode, setDateMode] = useState<'date' | 'weekdays'>('date');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Sat']);

  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchClasses();
    fetchInstructors();
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoadingSubscribers(true);
      const [subRes, regRes] = await Promise.all([
        api.get<EmailSubscriber[]>('/masterclasses/subscribers').catch(() => ({ data: [] })),
        api.get<ClassRegistration[]>('/masterclasses/registrations').catch(() => ({ data: [] })),
      ]);
      setSubscribers(Array.isArray(subRes.data) ? subRes.data : []);
      setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
    } catch {
      toast.error('Failed to load email subscribers');
    } finally {
      setLoadingSubscribers(false);
    }
  };

  const formatDaysString = (days: string[]) => {
    if (days.length === 0) return 'Every Saturday';
    if (days.length === 1) {
      return `Every ${DAY_FULL_NAMES[days[0]] || days[0]}`;
    }
    if (days.length === 2 && days.includes('Sat') && days.includes('Sun')) {
      return 'Every Weekend (Sat & Sun)';
    }
    if (days.length === 5 && !days.includes('Sat') && !days.includes('Sun')) {
      return 'Every Weekday (Mon - Fri)';
    }
    return `Every ${days.join(', ')}`;
  };

  const toggleDay = (day: string) => {
    const next = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    const finalDays = next.length > 0 ? next : [day];
    setSelectedDays(finalDays);
    setForm((f) => ({ ...f, date: formatDaysString(finalDays) }));
  };

  const selectPresetDays = (days: string[]) => {
    setSelectedDays(days);
    setForm((f) => ({ ...f, date: formatDaysString(days) }));
  };

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

  const fetchInstructors = async () => {
    try {
      const res = await api.get<{ users: InstructorUser[] }>('/admin/users?limit=100');
      // Strictly ONLY mentors and teachers (no students or general users)
      const filtered = (res.data.users || []).filter(
        (u) => u.role === 'mentor' || u.role === 'teacher'
      );
      setInstructors(filtered);
    } catch (err) {
      console.error('Failed to fetch instructor list', err);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedInstructorId('');
    setDateMode('date');
    setSelectedDays([]);
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
      instructorRole: cls.instructorRole || 'Native Language Teacher',
      instructorImage: cls.instructorImage || '',
      language: cls.language || cls.category || 'German',
      level: cls.level || 'Beginner Friendly',
      category: cls.category || cls.language || 'German',
      capacity: cls.capacity || 150,
      imageUrl: cls.imageUrl || '',
      meetingUrl: cls.meetingUrl || '',
      interestedCount: cls.interestedCount || '1.2K+ interested',
      isLive: cls.isLive !== false,
      published: cls.published !== false,
    });

    // Detect if date is Calendar Date or Recurring Weekdays
    const rawDate = (cls.date || '').trim();
    const isCalDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate);
    if (isCalDate) {
      setDateMode('date');
      setSelectedDays(['Sat']);
    } else {
      setDateMode('weekdays');
      const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const lower = rawDate.toLowerCase();
      const matchedDays = allDays.filter((d) => lower.includes(d.toLowerCase()));
      setSelectedDays(matchedDays.length > 0 ? matchedDays : ['Sat']);
    }

    // Match instructor in existing user list if possible
    const matched = instructors.find(
      (u) => u.name.trim().toLowerCase() === (cls.instructor || '').trim().toLowerCase()
    );
    setSelectedInstructorId(matched ? matched._id : '');
    setShowModal(true);
  };

  const handleSelectInstructor = (userId: string) => {
    setSelectedInstructorId(userId);
    const chosen = instructors.find((u) => u._id === userId);
    if (chosen) {
      setForm((prev) => ({
        ...prev,
        instructor: chosen.name,
        instructorImage: chosen.avatar || '',
        instructorRole:
          chosen.role === 'mentor'
            ? `Certified Language Mentor (${chosen.language || 'German'})`
            : `Native Language Teacher (${chosen.language || 'German'})`,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        instructor: '',
        instructorImage: '',
        instructorRole: '',
      }));
    }
  };

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'imageUrl'
  ) => {
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
      setForm((f) => ({ ...f, [field]: res.data.url }));
      toast.success('Cover image uploaded successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.instructor) {
      toast.error('Please choose a mentor or teacher from the user list');
      return;
    }

    // Explicitly compute final date to ensure week days or calendar date are always saved properly
    let finalDate = form.date;
    if (dateMode === 'weekdays') {
      const daysToUse = selectedDays.length > 0 ? selectedDays : ['Sat'];
      finalDate = formatDaysString(daysToUse);
    } else {
      finalDate = form.date || new Date().toISOString().split('T')[0];
    }

    if (!finalDate) {
      toast.error('Please select a date or week days');
      return;
    }

    try {
      const payload = {
        ...form,
        date: finalDate,
        category: form.language,
        capacity: Number(form.capacity) || 0,
      };
      if (editingId) {
        await api.put(`/masterclasses/${editingId}`, payload);
        toast.success(`Public masterclass updated (${finalDate})`);
      } else {
        await api.post('/masterclasses', payload);
        toast.success(`Public masterclass published (${finalDate})`);
      }
      setShowModal(false);
      await fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save public class');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this public class?')) return;
    try {
      await api.delete(`/masterclasses/${id}`);
      toast.success('Public class deleted');
      fetchClasses();
    } catch {
      toast.error('Failed to delete public class');
    }
  };

  // Unique emails list (deduplicated)
  const emailList = useMemo(() => {
    const map = new Map<string, { id: string; email: string; createdAt: string }>();

    subscribers.forEach((s) => {
      const email = s.email?.trim().toLowerCase();
      if (email && !map.has(email)) {
        map.set(email, {
          id: s._id,
          email: s.email.trim(),
          createdAt: s.createdAt,
        });
      }
    });

    registrations.forEach((r) => {
      const email = r.email?.trim().toLowerCase();
      if (email && !map.has(email)) {
        map.set(email, {
          id: r._id,
          email: r.email.trim(),
          createdAt: r.createdAt,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }, [subscribers, registrations]);

  const filteredEmails = useMemo(() => {
    const term = subscriberSearch.trim().toLowerCase();
    if (!term) return emailList;
    return emailList.filter((item) => item.email.toLowerCase().includes(term));
  }, [emailList, subscriberSearch]);

  const handleCopyAllEmails = () => {
    const emails = filteredEmails.map((r) => r.email).filter(Boolean);
    if (emails.length === 0) {
      toast.info('No email addresses found');
      return;
    }
    navigator.clipboard.writeText(emails.join(', '));
    toast.success(`Copied ${emails.length} emails to clipboard`);
  };

  // Strictly mentors and teachers for the select dropdown (no students)
  const mentors = instructors.filter((u) => u.role === 'mentor');
  const teachers = instructors.filter((u) => u.role === 'teacher');

  const selectedInstructorObj = instructors.find((u) => u._id === selectedInstructorId);

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-5 font-[Plus_Jakarta_Sans]">
      {/* Header bar matching website theme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-emerald-100 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              {activeTab === 'classes' ? <Radio className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                {activeTab === 'classes' ? 'Public Live Masterclasses' : 'Subscribed Emails'}
              </h1>
              <p className="text-xs font-medium text-gray-500">
                {activeTab === 'classes'
                  ? 'Manage live interactive classes displayed on the public landing page.'
                  : 'List of email addresses subscribed for updates and notifications.'}
              </p>
            </div>
          </div>
        </div>

        {activeTab === 'classes' && (
          <button
            onClick={openCreate}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm shadow-emerald-200 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Public Masterclass
          </button>
        )}
      </div>

      {/* Tabs Switcher: Public Masterclasses vs Emails */}
      <div className="flex items-center gap-2 bg-gray-100/90 p-1.5 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('classes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'classes'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Radio className="w-4 h-4 text-emerald-600" />
          <span>Public Masterclasses</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
            {classes.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('subscribers');
            fetchSubscribers();
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'subscribers'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail className="w-4 h-4 text-emerald-600" />
          <span>Emails</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-100">
            {emailList.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PUBLIC MASTERCLASSES GRID */}
      {activeTab === 'classes' && (
        <>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-72 bg-white border border-emerald-100/90 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : classes.length === 0 ? (
            <div className="bg-white border border-emerald-100/90 rounded-2xl p-12 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Video className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No public masterclasses yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Click &quot;Add Public Masterclass&quot; to publish your first free live session to the website.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {classes.map((cls) => (
                <div
                  key={cls._id}
                  className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover Image banner */}
                    <div className="h-40 w-full overflow-hidden relative bg-gray-100">
                      {cls.imageUrl ? (
                        <img
                          src={cls.imageUrl}
                          alt={cls.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center text-emerald-600">
                          <Video className="w-8 h-8 opacity-60" />
                        </div>
                      )}

                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#0c1913]/85 backdrop-blur-xs text-white rounded-lg text-[10px] font-black uppercase tracking-wider">
                        {cls.language || cls.category}
                      </div>

                      {cls.isLive !== false && (
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          LIVE
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-100">
                          {cls.level || 'Beginner Friendly'}
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

                      <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                        {cls.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {cls.description || 'No description provided.'}
                      </p>

                      <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl space-y-1.5 text-xs text-gray-700">
                        <div className="flex items-center gap-2 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cls.date}</span>
                        </div>
                        <div className="flex items-center gap-2 font-medium">
                          <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{cls.time} IST ({cls.duration || '60'}m)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          {cls.instructorImage ? (
                            <img
                              src={cls.instructorImage}
                              alt={cls.instructor}
                              className="w-4 h-4 rounded-full object-cover shrink-0 border border-emerald-200"
                            />
                          ) : (
                            <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                          <span className="truncate">
                            {cls.instructor} ({cls.instructorRole || 'Teacher'})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between bg-white">
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {cls.interestedCount || '1.2K+ interested'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(cls)}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cls._id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: EMAILS ONLY */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">

          {/* Search & Copy Bar */}
          <div className="bg-white border border-emerald-100/90 p-3 sm:p-4 rounded-2xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                placeholder="Search emails..."
                className="w-full pl-10 pr-10 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 text-gray-800 placeholder-gray-400 font-medium"
              />
              {subscriberSearch && (
                <button
                  type="button"
                  onClick={() => setSubscriberSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchSubscribers}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
                title="Refresh emails list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSubscribers ? 'animate-spin' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleCopyAllEmails}
                disabled={filteredEmails.length === 0}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All ({filteredEmails.length})</span>
              </button>
            </div>
          </div>

          {/* Clean Emails Only Table */}
          <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-2xs">
            {loadingSubscribers ? (
              <div className="p-12 text-center space-y-3">
                <Loader2 className="w-7 h-7 text-emerald-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-gray-500">Loading emails...</p>
              </div>
            ) : filteredEmails.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-gray-900">No emails found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {subscriberSearch
                    ? 'No email matches your search query.'
                    : 'Subscribed emails will appear here.'}
                </p>
                {subscriberSearch && (
                  <button
                    type="button"
                    onClick={() => setSubscriberSearch('')}
                    className="px-4 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-gray-700 font-extrabold uppercase tracking-wider text-[10px] border-b border-gray-200/80">
                    <tr>
                      <th className="px-5 py-3 w-16 text-center text-gray-400">#</th>
                      <th className="px-5 py-3">Email Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                    {filteredEmails.map((item, index) => (
                      <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="px-5 py-3 text-center text-gray-400 font-mono text-xs w-16">
                          {index + 1}
                        </td>
                        <td className="px-5 py-3 font-semibold text-gray-900 text-sm select-all">
                          {item.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FULL SCREEN MODAL:
          - Desktop: Uses full screen (inset-0, 100vh), completely non-scrollable (overflow-hidden)
          - Mobile: Rests above bottom navbar (bottom-16), scrollable content (overflow-y-auto)
      */}
      {showModal && (
        <div className="fixed inset-x-0 top-0 bottom-16 md:bottom-0 md:inset-0 z-[60] bg-[#f8faf9] flex flex-col overflow-hidden font-[Plus_Jakarta_Sans]">
          {/* Header styled like BhashaSchool Dark Green Brand bar */}
          <div className="bg-[#0c1913] text-white px-5 md:px-8 py-3 flex items-center justify-between border-b border-[#1b3829] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-black tracking-tight text-white flex items-center gap-2">
                  {editingId ? 'Edit Public Masterclass' : 'Create Public Masterclass'}
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Portal Studio
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300 hidden sm:block">
                  Assign verified mentors &amp; teachers, live schedule, cover visual and meeting link.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col overflow-hidden min-h-0"
          >
            {/* Main content grid:
                - Desktop: md:overflow-hidden, all elements fit without any scrollbar
                - Mobile: overflow-y-auto, clean vertical scroll
            */}
            <div className="flex-1 overflow-y-auto md:overflow-hidden p-3.5 sm:p-5 md:p-6 min-h-0">
              <div className="w-full max-w-[1536px] mx-auto h-full grid grid-cols-1 md:grid-cols-12 gap-3.5 md:gap-5 lg:gap-6 min-h-0">
                
                {/* LEFT COLUMN: 7 Columns on Desktop */}
                <div className="md:col-span-7 flex flex-col justify-between gap-3.5 md:gap-4 h-full min-h-0">
                  
                  {/* Card 1: Masterclass Basics */}
                  <div className="bg-white border border-emerald-100/90 rounded-2xl p-4 lg:p-5 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Masterclass Details</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Class Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Introduction to German for Beginners"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm font-semibold transition-all bg-[#fafcfb]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Language
                        </label>
                        <select
                          value={form.language}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              language: e.target.value,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-[#fafcfb] text-xs font-semibold transition-all"
                        >
                          {languages.map((item) => (
                            <option key={item.name} value={item.name}>
                              {item.flag} {item.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Level / Badge
                        </label>
                        <select
                          value={form.level}
                          onChange={(e) => setForm({ ...form, level: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-[#fafcfb] text-xs font-semibold transition-all"
                        >
                          {levels.map((lvl) => (
                            <option key={lvl} value={lvl}>
                              {lvl}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Class Description <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        required
                        placeholder="Brief overview of what students will learn in this session..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-3.5 py-1.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs font-medium transition-all bg-[#fafcfb] resize-none"
                      />
                    </div>
                  </div>

                  {/* Card 2: Schedule & Live Link */}
                  <div className="bg-white border border-emerald-100/90 rounded-2xl p-4 lg:p-5 shadow-2xs space-y-3">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Schedule &amp; Access</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Date OR Week Days Selector */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-gray-800">
                            {dateMode === 'date' ? 'Date' : 'Week Days'}{' '}
                            <span className="text-rose-500">*</span>
                          </label>

                          {/* Mode Toggle: Date or Week Days */}
                          <div className="inline-flex items-center p-0.5 bg-gray-100 rounded-lg text-[10px] font-bold">
                            <button
                              type="button"
                              onClick={() => {
                                setDateMode('date');
                                const isCalDate = /^\d{4}-\d{2}-\d{2}$/.test((form.date || '').trim());
                                if (!isCalDate) {
                                  const today = new Date().toISOString().split('T')[0];
                                  setForm((f) => ({ ...f, date: today }));
                                }
                              }}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                dateMode === 'date'
                                  ? 'bg-white text-emerald-800 shadow-xs'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              Date
                            </button>
                            <span className="px-1 text-gray-400 font-normal">or</span>
                            <button
                              type="button"
                              onClick={() => {
                                setDateMode('weekdays');
                                const daysToUse = selectedDays.length > 0 ? selectedDays : ['Sat'];
                                setSelectedDays(daysToUse);
                                setForm((f) => ({ ...f, date: formatDaysString(daysToUse) }));
                              }}
                              className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                                dateMode === 'weekdays'
                                  ? 'bg-white text-emerald-800 shadow-xs'
                                  : 'text-gray-500 hover:text-gray-800'
                              }`}
                            >
                              Week Days
                            </button>
                          </div>
                        </div>

                        {/* Hidden input ensuring the date value is always bound to form */}
                        <input
                          type="hidden"
                          name="date"
                          value={
                            dateMode === 'weekdays'
                              ? formatDaysString(selectedDays.length > 0 ? selectedDays : ['Sat'])
                              : form.date
                          }
                        />

                        {dateMode === 'date' ? (
                          <input
                            type="date"
                            required
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs font-semibold transition-all bg-[#fafcfb]"
                          />
                        ) : (
                          <div className="space-y-1">
                            {/* Weekday pills */}
                            <div className="flex items-center gap-1 flex-wrap">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
                                const active = selectedDays.includes(d);
                                return (
                                  <button
                                    key={d}
                                    type="button"
                                    onClick={() => toggleDay(d)}
                                    className={`px-1.5 py-1 rounded-md text-[10px] font-black border transition-all cursor-pointer ${
                                      active
                                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                                        : 'bg-[#fafcfb] text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                                  >
                                    {d}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Quick Presets row */}
                            <div className="flex items-center justify-between text-[9px] text-gray-500">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">Presets:</span>
                                <button
                                  type="button"
                                  onClick={() => selectPresetDays(['Sat'])}
                                  className="text-emerald-700 hover:underline font-bold cursor-pointer"
                                >
                                  Sat
                                </button>
                                <span>•</span>
                                <button
                                  type="button"
                                  onClick={() => selectPresetDays(['Sun'])}
                                  className="text-emerald-700 hover:underline font-bold cursor-pointer"
                                >
                                  Sun
                                </button>
                                <span>•</span>
                                <button
                                  type="button"
                                  onClick={() => selectPresetDays(['Sat', 'Sun'])}
                                  className="text-emerald-700 hover:underline font-bold cursor-pointer"
                                >
                                  Weekend
                                </button>
                                <span>•</span>
                                <button
                                  type="button"
                                  onClick={() => selectPresetDays(['Mon', 'Wed', 'Fri'])}
                                  className="text-emerald-700 hover:underline font-bold cursor-pointer"
                                >
                                  M/W/F
                                </button>
                              </div>
                              <span
                                className="font-extrabold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded text-[10px] truncate max-w-[120px]"
                                title={formatDaysString(selectedDays.length > 0 ? selectedDays : ['Sat'])}
                              >
                                {formatDaysString(selectedDays.length > 0 ? selectedDays : ['Sat'])}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Time (IST) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 6:00 PM IST"
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs font-semibold transition-all bg-[#fafcfb]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Duration (min)
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={10}
                            value={form.duration}
                            onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs font-semibold transition-all bg-[#fafcfb]"
                          />
                          <div className="flex gap-1 shrink-0">
                            {['45', '60', '90'].map((mins) => (
                              <button
                                key={mins}
                                type="button"
                                onClick={() => setForm({ ...form, duration: mins })}
                                className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border transition-colors ${
                                  form.duration === mins
                                    ? 'bg-emerald-700 text-white border-emerald-700'
                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                              >
                                {mins}m
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-800 mb-1">
                          Social Proof Label
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 1.2K+ interested"
                          value={form.interestedCount}
                          onChange={(e) => setForm({ ...form, interestedCount: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs font-semibold transition-all bg-[#fafcfb]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1 flex items-center justify-between">
                        <span>Live Meeting URL (Google Meet / Zoom)</span>
                        {form.meetingUrl && (
                          <a
                            href={form.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5 font-bold"
                          >
                            Test Link <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </label>
                      <div className="relative">
                        <Video className="w-3.5 h-3.5 text-emerald-700 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="url"
                          placeholder="https://meet.google.com/xyz-abcd-efg"
                          value={form.meetingUrl}
                          onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-xs font-medium transition-all bg-[#fafcfb]"
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: 5 Columns on Desktop */}
                <div className="md:col-span-5 flex flex-col justify-between gap-3.5 md:gap-4 h-full min-h-0">
                  
                  {/* Card 3: Cover Image Upload (NO URL INPUT) */}
                  <div className="bg-white border border-emerald-100/90 rounded-2xl p-4 lg:p-5 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        <ImagePlus className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cover / Landmark Image</span>
                      </div>
                      {form.imageUrl && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Uploaded
                        </span>
                      )}
                    </div>

                    <input
                      ref={coverInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, 'imageUrl')}
                      disabled={uploading}
                    />

                    {form.imageUrl ? (
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 group h-32 lg:h-36">
                        <img
                          src={form.imageUrl}
                          alt="Cover"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => coverInputRef.current?.click()}
                            disabled={uploading}
                            className="px-3 py-1.5 rounded-lg bg-white text-gray-900 text-[11px] font-bold flex items-center gap-1 shadow-md hover:bg-gray-100 cursor-pointer"
                          >
                            {uploading ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 text-emerald-700" />
                            )}
                            Change
                          </button>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, imageUrl: '' })}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md hover:bg-rose-700 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => coverInputRef.current?.click()}
                        className="cursor-pointer border-2 border-dashed border-emerald-200 hover:border-emerald-600 rounded-xl h-32 lg:h-36 bg-[#fafcfb] hover:bg-emerald-50/40 transition-all flex flex-col items-center justify-center gap-1.5 text-center p-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                          ) : (
                            <ImagePlus className="w-4 h-4 text-emerald-700" />
                          )}
                        </div>
                        <p className="text-xs font-bold text-gray-800">
                          {uploading ? 'Uploading Cover…' : 'Click to Upload Landmark Image'}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Brandenburg Gate, Big Ben, Eiffel Tower (up to 5MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card 4: Instructor Profile from User List (NO MANUAL NAME INPUT & NO MANUAL IMAGE UPLOAD) */}
                  <div className="bg-white border border-emerald-100/90 rounded-2xl p-4 lg:p-5 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Instructor (Mentor / Teacher)</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Auto Profile Sync
                      </span>
                    </div>

                    {/* Choose Mentor / Teacher Dropdown (Only Mentors and Teachers) */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Select Mentor or Teacher <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={selectedInstructorId}
                        onChange={(e) => handleSelectInstructor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 bg-[#fafcfb] text-xs font-semibold transition-all"
                      >
                        <option value="">-- Choose Mentor or Teacher --</option>
                        {mentors.length > 0 && (
                          <optgroup label="🌟 Mentors">
                            {mentors.map((m) => (
                              <option key={m._id} value={m._id}>
                                {m.name} (Mentor - {m.language || 'German'})
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {teachers.length > 0 && (
                          <optgroup label="🎓 Teachers">
                            {teachers.map((t) => (
                              <option key={t._id} value={t._id}>
                                {t.name} (Teacher - {t.language || 'German'})
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>

                    {/* Selected Instructor Profile Display (No Name Input, No Image Input) */}
                    {form.instructor ? (
                      <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center gap-3.5">
                        {/* Avatar fetched directly from mentor/teacher profile */}
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-400/90 bg-white shrink-0 flex items-center justify-center shadow-xs">
                          {form.instructorImage ? (
                            <img
                              src={form.instructorImage}
                              alt={form.instructor}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-base font-black text-emerald-800">
                              {(form.instructor || 'U').slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="text-sm font-black text-gray-900 truncate">
                              {form.instructor}
                            </h4>
                            {selectedInstructorObj && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-700 text-white shrink-0">
                                {selectedInstructorObj.role}
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-bold text-emerald-800 truncate">
                            {form.instructorRole}
                          </p>

                          <p className="text-[10px] text-gray-500 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            {form.instructorImage
                              ? 'Profile avatar automatically synced'
                              : 'No avatar on profile (can upload in Profile settings)'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-gray-200 rounded-xl p-3.5 text-center bg-[#fafcfb]">
                        <UserCheck className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs font-semibold text-gray-700">
                          Choose a Mentor or Teacher from the dropdown above
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Their profile avatar and credentials will automatically sync to this masterclass.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card 5: Status Toggles */}
                  <div className="bg-white border border-emerald-100/90 rounded-2xl p-3.5 lg:p-4 shadow-2xs space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      <Radio className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Visibility &amp; Status</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <label
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          form.isLive
                            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
                            : 'bg-[#fafcfb] border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.isLive}
                          onChange={(e) => setForm({ ...form, isLive: e.target.checked })}
                          className="w-3.5 h-3.5 accent-rose-600 rounded"
                        />
                        <div>
                          <div className="text-[11px] font-black flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                            Show LIVE
                          </div>
                          <p className="text-[9px] text-gray-500">Red live badge</p>
                        </div>
                      </label>

                      <label
                        className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                          form.published
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                            : 'bg-[#fafcfb] border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.published}
                          onChange={(e) => setForm({ ...form, published: e.target.checked })}
                          className="w-3.5 h-3.5 accent-emerald-600 rounded"
                        />
                        <div>
                          <div className="text-[11px] font-black flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            Published
                          </div>
                          <p className="text-[9px] text-gray-500">Live on website</p>
                        </div>
                      </label>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white border-t border-gray-200 px-5 md:px-8 py-3 flex items-center justify-between shrink-0 shadow-xs">
              <p className="text-xs text-gray-400 hidden sm:block">
                All changes take effect immediately on the public masterclasses landing page.
              </p>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-200 hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingId ? 'Save Masterclass' : 'Publish Masterclass'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
