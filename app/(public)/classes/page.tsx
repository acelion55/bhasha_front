'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  Search,
  Calendar,
  Clock,
  Users,
  Video,
  ArrowRight,
  Sparkles,
  Bookmark,
  Bell,
  CheckCircle2,
  X,
  MessageSquare,
  Globe2,
  GraduationCap,
  Loader2,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface PublicMasterclass {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration?: string;
  instructor: string;
  instructorRole?: string;
  instructorImage?: string;
  language?: string;
  category?: string;
  level?: string;
  capacity?: number;
  imageUrl?: string;
  meetingUrl?: string;
  interestedCount?: string;
  isLive?: boolean;
  published?: boolean;
}

// Language Flag mapping
const LANGUAGE_FLAGS: Record<string, string> = {
  German: '🇩🇪',
  Deutsch: '🇩🇪',
  English: '🇬🇧',
  French: '🇫🇷',
  Français: '🇫🇷',
  Spanish: '🇪🇸',
  Español: '🇪🇸',
  Italian: '🇮🇹',
  Italiano: '🇮🇹',
  Japanese: '🇯🇵',
};

function getLanguageFlag(lang?: string): string {
  if (!lang) return '🌐';
  return LANGUAGE_FLAGS[lang] || '🌐';
}

function getLevelBadgeStyle(level?: string) {
  const lvl = (level || '').toLowerCase();
  if (lvl.includes('beginner')) {
    return 'bg-rose-50 text-rose-600 border border-rose-100';
  }
  if (lvl.includes('conversational')) {
    return 'bg-sky-50 text-sky-700 border border-sky-100';
  }
  if (lvl.includes('all')) {
    return 'bg-amber-50 text-amber-700 border border-amber-200';
  }
  return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
}

function parseClassDate(dateStr: string) {
  if (!dateStr) return { day: '15', month: 'OCT', formatted: 'Upcoming' };
  const str = dateStr.trim();
  const upper = str.toUpperCase();

  // If it's recurring week days (e.g., "Every Saturday", "Mon, Wed, Fri", "Every Weekend")
  if (
    upper.includes('SAT') ||
    upper.includes('SUN') ||
    upper.includes('MON') ||
    upper.includes('TUE') ||
    upper.includes('WED') ||
    upper.includes('THU') ||
    upper.includes('FRI') ||
    upper.includes('WEEK')
  ) {
    let day = 'WEEK';
    if (upper.includes('SAT') && !upper.includes('SUN')) day = 'SAT';
    else if (upper.includes('SUN') && !upper.includes('SAT')) day = 'SUN';
    else if (upper.includes('SAT') && upper.includes('SUN')) day = 'WKND';
    else if (upper.includes('MON')) day = 'MON';
    else if (upper.includes('FRI')) day = 'FRI';
    return { day, month: 'EVERY', formatted: str };
  }

  const d = new Date(str);
  if (Number.isNaN(d.getTime())) {
    // If string like "2026-10-25"
    const parts = str.split('-');
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const customD = new Date(year, month, day);
      if (!Number.isNaN(customD.getTime())) {
        return {
          day: String(day).padStart(2, '0'),
          month: customD.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
          formatted: customD.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };
      }
    }
    return { day: '25', month: 'OCT', formatted: str };
  }
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    formatted: d.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
  };
}

export default function PublicMasterclassesPage() {
  const [classes, setClasses] = useState<PublicMasterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Classes');
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  // Bookmarked classes saved in localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Join Modal State
  const [activeModalClass, setActiveModalClass] = useState<PublicMasterclass | null>(null);
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '' });
  const [registering, setRegistering] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Newsletter Email
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Load classes from API
  const loadClasses = async () => {
    setLoading(true);
    setError('');
    try {
      let data: PublicMasterclass[] = [];
      try {
        const res = await api.get<PublicMasterclass[]>('/masterclasses');
        if (Array.isArray(res.data)) data = res.data;
      } catch {
        const res = await fetch(`${API_BASE_URL}/masterclasses`, { cache: 'no-store' });
        if (res.ok) data = await res.json();
      }
      setClasses(data);
    } catch (err: any) {
      console.error('Failed to load masterclasses:', err);
      setError('Unable to load masterclasses right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
    try {
      const saved = localStorage.getItem('bhasha_bookmarked_classes');
      if (saved) setBookmarkedIds(JSON.parse(saved));
    } catch {
      // noop
    }
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('bhasha_bookmarked_classes', JSON.stringify(next));
      } catch {
        // noop
      }
      toast.success(prev.includes(id) ? 'Removed from saved classes' : 'Class saved to your bookmarks');
      return next;
    });
  };

  // Derive unique languages from classes
  const languagesList = useMemo(() => {
    const list = ['All Classes'];
    const langs = new Set<string>();
    classes.forEach((c) => {
      const lang = c.language || c.category;
      if (lang && lang.trim()) langs.add(lang.trim());
    });
    // Ensure default common languages are available in filter
    ['German', 'English', 'French', 'Spanish', 'Italian'].forEach((l) => langs.add(l));
    return [...list, ...Array.from(langs)];
  }, [classes]);

  // Filtered classes
  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const lang = (cls.language || cls.category || '').toLowerCase();
      const matchesLanguage =
        selectedLanguage === 'All Classes' ||
        lang === selectedLanguage.toLowerCase();

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        cls.title.toLowerCase().includes(term) ||
        cls.description.toLowerCase().includes(term) ||
        cls.instructor.toLowerCase().includes(term) ||
        lang.includes(term) ||
        (cls.level || '').toLowerCase().includes(term);

      return matchesLanguage && matchesSearch;
    });
  }, [classes, selectedLanguage, searchTerm]);

  // Handle registration & Join
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalClass) return;

    setRegistering(true);
    try {
      await api.post(`/masterclasses/${activeModalClass._id}/register`, registerForm);
      setRegisteredSuccess(true);
      toast.success('Registration successful! Launching class...');
      if (activeModalClass.meetingUrl) {
        window.open(activeModalClass.meetingUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1B2533] pb-24 selection:bg-amber-100 selection:text-amber-900 w-full overflow-x-hidden">

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Upcoming Live Public Masterclasses)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-none px-0 pt-0 pb-6 sm:pb-8 overflow-hidden border-b border-[#EAE5DE]/80 bg-[#FAF8F5]">
        
        {/* Desktop View: Full-width uncut classes hero image with text overlay on left */}
        <div className="hidden lg:block relative w-full overflow-hidden bg-[#FAF8F5]">
          <img
            src="/classes hero image.png"
            alt="Upcoming Live Public Masterclasses"
            className="w-full h-auto block select-none"
          />

          {/* Left Text Overlay */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-8 xl:pl-12 2xl:pl-16 pr-4 max-w-[48%] pointer-events-none">
            <div className="space-y-4 xl:space-y-5 text-left pointer-events-auto">
              
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200/80 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                <span>LIVE</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl xl:text-4xl 2xl:text-[3.25rem] font-black text-[#0B1528] tracking-tight leading-[1.12]">
                Upcoming Live <br />
                <span className="text-amber-500 font-black">Public Masterclasses</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xs xl:text-sm 2xl:text-base text-gray-600 max-w-lg leading-relaxed font-medium">
                Join free live sessions with expert teachers. Learn, ask questions
                and explore new opportunities to study, work and grow globally.
              </p>

              {/* 3 Key Feature Badges */}
              <div className="pt-1 flex flex-wrap items-center gap-4 xl:gap-6">
                
                {/* Feature 1 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <GraduationCap className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">Expert Teachers</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Native speakers</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <MessageSquare className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">Live Interaction</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Ask questions in real-time</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                    <Globe2 className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">Open for Everyone</h4>
                    <p className="text-[10px] text-gray-400 font-medium">100% Free to join</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* Mobile & Tablet View: Stacked layout with classes-hero-illustration.png */}
        <div className="lg:hidden w-full space-y-5 pt-6 pb-2">
          <div className="space-y-4 text-left px-4 sm:px-6">
            
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200/80 text-[11px] font-black uppercase tracking-wider shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span>LIVE</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight leading-[1.15]">
              Upcoming Live <br />
              <span className="text-amber-500 font-black">Public Masterclasses</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium max-w-lg">
              Join free live sessions with expert teachers. Learn, ask questions
              and explore new opportunities to study, work and grow globally.
            </p>

            {/* 3 Key Feature Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <GraduationCap className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">Expert Teachers</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Native speakers</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <MessageSquare className="w-4 h-4 text-purple-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">Live Interaction</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Ask in real-time</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs">
                  <Globe2 className="w-4 h-4 text-blue-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-tight">Open for Everyone</h4>
                  <p className="text-[10px] text-gray-400 font-medium">100% Free</p>
                </div>
              </div>
            </div>

          </div>

          {/* Full-width illustration on mobile */}
          <div className="w-full">
            <img
              src="/classes-hero-illustration.png"
              alt="Upcoming Live Public Masterclasses"
              className="w-full h-auto block select-none"
            />
          </div>
        </div>

      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. FILTER & CONTROLS BAR
      ────────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 pt-8 pb-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Language filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap">
            {languagesList.map((lang) => {
              const isActive = selectedLanguage === lang;
              const flag = lang === 'All Classes' ? null : getLanguageFlag(lang);

              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#0B172E] text-white shadow-sm ring-2 ring-[#0B172E]/10'
                      : 'bg-white border border-gray-200/90 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {flag && <span className="text-sm">{flag}</span>}
                  <span>{lang}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Calendar View Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search masterclasses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-2xs"
              />
            </div>

            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'grid' ? 'calendar' : 'grid')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                viewMode === 'calendar'
                  ? 'bg-amber-500 text-white border-amber-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{viewMode === 'calendar' ? 'Grid View' : 'Calendar View'}</span>
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MASTERCLASSES CONTENT (Cards Grid / Timeline)
      ────────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 pt-4">

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[430px] bg-white border border-gray-200/80 rounded-3xl animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="h-44 bg-gray-200 rounded-2xl" />
                <div className="space-y-2 mt-4">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                  <div className="h-6 w-4/5 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-full bg-gray-200 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-rose-100 p-8 shadow-xs my-8">
            <p className="text-sm font-bold text-rose-600 mb-4">{error}</p>
            <button
              onClick={loadClasses}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200/90 p-8 shadow-xs my-8">
            <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-extrabold text-gray-800 mb-1">
              No matching masterclasses found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              {classes.length === 0
                ? 'Check back soon! New live public masterclasses are announced every Monday.'
                : 'Try adjusting your search query or select another language filter above.'}
            </p>
            {classes.length > 0 && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLanguage('All Classes');
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredClasses.map((cls) => {
              const dateInfo = parseClassDate(cls.date);
              const lang = cls.language || cls.category || 'German';
              const flag = getLanguageFlag(lang);
              const isBookmarked = bookmarkedIds.includes(cls._id);

              return (
                <div
                  key={cls._id}
                  className="bg-white rounded-3xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  {/* Top Image Banner with Date & Live Badges */}
                  <div>
                    <div className="h-44 sm:h-48 w-full bg-slate-100 relative overflow-hidden">
                      <img
                        src={cls.imageUrl || 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=800&auto=format&fit=crop'}
                        alt={cls.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Top Left Date Badge */}
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-white/80 shadow-md px-2.5 py-1.5 rounded-xl text-center min-w-[46px]">
                        <span className="block text-lg sm:text-xl font-black text-gray-900 leading-none">
                          {dateInfo.day}
                        </span>
                        <span className="block text-[9px] font-black uppercase text-gray-500 tracking-wider">
                          {dateInfo.month}
                        </span>
                      </div>

                      {/* Top Right LIVE Badge */}
                      {cls.isLive !== false && (
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-red-600 border border-red-200/90 shadow-md px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                          <span>LIVE</span>
                        </div>
                      )}
                    </div>

                    {/* Card Content Area */}
                    <div className="p-5 flex flex-col">
                      
                      {/* Language & Level Badges */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-gray-900">
                          <span className="text-sm">{flag}</span>
                          <span>{lang}</span>
                        </div>

                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${getLevelBadgeStyle(
                            cls.level,
                          )}`}
                        >
                          {cls.level || 'Beginner Friendly'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-black text-[#0B1528] group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-2">
                        {cls.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {cls.description}
                      </p>

                      {/* Instructor Row */}
                      <div className="flex items-center gap-2.5 py-2.5 border-t border-gray-100">
                        {cls.instructorImage ? (
                          <img
                            src={cls.instructorImage}
                            alt={cls.instructor}
                            className="w-8 h-8 rounded-full object-cover border border-amber-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs shadow-2xs">
                            {cls.instructor.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-900 truncate">
                            {cls.instructor}
                          </p>
                          <p className="text-[11px] text-gray-400 font-medium truncate">
                            {cls.instructorRole || 'Native Language Teacher'}
                          </p>
                        </div>
                      </div>

                      {/* Date & Time Row */}
                      <div className="flex items-center justify-between text-[11px] text-gray-600 font-medium pt-1 pb-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{dateInfo.formatted}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{cls.time}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Bottom CTA & Footer Row */}
                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModalClass(cls);
                        setRegisteredSuccess(false);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-[#0B1528] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <span>Join Live Class</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Bottom Footer: Attendees + Bookmark Toggle */}
                    <div className="flex items-center justify-between pt-3 mt-1 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[11px] font-bold text-gray-600">
                          {cls.interestedCount || '1.2K+ interested'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleBookmark(cls._id, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'text-amber-500 bg-amber-50'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark this class'}
                        aria-label="Bookmark class"
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM BANNER (Never Miss a Masterclass!)
      ────────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 pt-16">
        <div className="bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-blue-50/70 rounded-3xl p-6 sm:p-8 border border-blue-100/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Bell className="w-6 h-6 text-blue-600 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                Never Miss a Masterclass!
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                Get notified about upcoming live public classes, special sessions and language events.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="w-full md:w-auto">
            {newsletterSubscribed ? (
              <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-emerald-800 border border-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You&apos;re subscribed to masterclass alerts!</span>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newsletterEmail) return;
                  try {
                    await api.post('/masterclasses/subscribe', {
                      email: newsletterEmail,
                      source: 'public_classes',
                    });
                    setNewsletterSubscribed(true);
                    toast.success('Subscribed! We will notify you before each session.');
                  } catch (err: any) {
                    toast.error(err?.response?.data?.message || 'Failed to subscribe');
                  }
                }}
                className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-xs sm:text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-2xs"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. JOIN LIVE CLASS / REGISTRATION MODAL
      ────────────────────────────────────────────────────────────── */}
      {activeModalClass && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between relative bg-gradient-to-r from-amber-50/50 via-white to-sky-50/50">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full mb-2">
                  <Radio className="w-3 h-3 text-red-600 animate-pulse" /> Live Masterclass
                </span>
                <h3 className="text-lg font-black text-[#0B1528] leading-snug">
                  {activeModalClass.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  with <strong className="text-gray-800">{activeModalClass.instructor}</strong> ({activeModalClass.instructorRole || 'Teacher'})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveModalClass(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              
              {/* Session Meta */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50/80 border border-gray-100 rounded-2xl p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Date</p>
                    <p className="font-bold text-gray-800">{parseClassDate(activeModalClass.date).formatted}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-black">Time</p>
                    <p className="font-bold text-gray-800">{activeModalClass.time}</p>
                  </div>
                </div>
              </div>

              {registeredSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-gray-900">You&apos;re All Set!</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      A calendar invite and direct link have been sent to your email.
                    </p>
                  </div>

                  {activeModalClass.meetingUrl && (
                    <a
                      href={activeModalClass.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
                    >
                      <span>Join Live Meeting Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveModalClass(null)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 hover:underline block mx-auto"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone (WhatsApp) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="9876543210"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={registering}
                    className="w-full py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[#0B1528] font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md mt-2 cursor-pointer"
                  >
                    {registering ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm &amp; Join Session</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center">
                    🔒 Free session. No credit card or pre-enrollment required.
                  </p>
                </form>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
