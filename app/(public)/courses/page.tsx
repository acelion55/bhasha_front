'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  ArrowRight,
  Check,
  BookOpen,
  FileText,
  Headphones,
  UserCheck,
  Award,
  Lightbulb,
  Monitor,
  Users,
  Compass,
  X,
  PhoneCall,
  Calendar,
  Clock,
  Sparkles,
} from 'lucide-react';

export interface PublicCourseItem {
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
}

interface CourseModalData {
  title: string;
  levelBadge: string;
  price: string;
  feeNote: string;
  themeColor: string;
  iconBg: string;
  iconText: string;
  description: string;
  curriculum: string[];
  schedule: string;
  duration: string;
  materials: string[];
  examTarget?: string;
  certificate?: string;
  buttonColor?: string;
}

const GERMAN_STYLE_PALETTE = [
  {
    cardBg: 'bg-[#FDF2F0]',
    cardBorder: 'border-[#FCDAD7]',
    cardShadow: 'shadow-[0_4px_24px_rgba(244,63,94,0.06)] hover:shadow-[0_12px_28px_rgba(244,63,94,0.12)]',
    iconBg: 'bg-[#FFE4E9]',
    iconText: 'text-[#E02B3A]',
    checkBg: 'bg-[#FFE0E5]',
    checkText: 'text-[#E02B3A]',
    btnBg: 'bg-[#FCD8D8] hover:bg-[#F9BABA] text-[#D92D3E]',
    divider: 'border-red-100/80',
  },
  {
    cardBg: 'bg-[#FFFAEC]',
    cardBorder: 'border-[#FDE8B3]',
    cardShadow: 'shadow-[0_4px_24px_rgba(245,158,11,0.06)] hover:shadow-[0_12px_28px_rgba(245,158,11,0.12)]',
    iconBg: 'bg-[#FEF3C7]',
    iconText: 'text-[#D97706]',
    checkBg: 'bg-[#FEF3C7]',
    checkText: 'text-[#D97706]',
    btnBg: 'bg-[#FEEBA9] hover:bg-[#FDE074] text-[#92400E]',
    divider: 'border-amber-100/80',
  },
  {
    cardBg: 'bg-[#EDFDF3]',
    cardBorder: 'border-[#C6F6D5]',
    cardShadow: 'shadow-[0_4px_24px_rgba(16,185,129,0.06)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.12)]',
    iconBg: 'bg-[#DCFCE7]',
    iconText: 'text-[#059669]',
    checkBg: 'bg-[#DCFCE7]',
    checkText: 'text-[#059669]',
    btnBg: 'bg-[#C6F6D5] hover:bg-[#A7F3D0] text-[#065F46]',
    divider: 'border-emerald-100/80',
  },
  {
    cardBg: 'bg-[#F5EEFE]',
    cardBorder: 'border-[#DDD6FE]',
    cardShadow: 'shadow-[0_4px_24px_rgba(139,92,246,0.06)] hover:shadow-[0_12px_28px_rgba(139,92,246,0.12)]',
    iconBg: 'bg-[#EDE9FE]',
    iconText: 'text-[#7C3AED]',
    checkBg: 'bg-[#EDE9FE]',
    checkText: 'text-[#7C3AED]',
    btnBg: 'bg-[#E9D5FF] hover:bg-[#DDD6FE] text-[#6D28D9]',
    divider: 'border-purple-100/80',
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<PublicCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseModalData | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get<PublicCourseItem[]>('/courses/public')
      .then((res) => {
        if (isMounted && Array.isArray(res.data)) {
          setCourses(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load courses from DB:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const germanCourses = courses.filter(
    (c) => (c.language || 'German').toLowerCase() === 'german',
  );
  const englishCourses = courses.filter(
    (c) => (c.language || '').toLowerCase() === 'english',
  );

  const openCourseModal = (data: CourseModalData) => {
    setSelectedCourse(data);
  };

  const closeCourseModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-gray-800 font-[Plus_Jakarta_Sans] selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      
      {/* ── 1. HERO SECTION: "Learn a Language for a Bigger World" ── */}
      <section className="relative overflow-hidden border-b border-[rgba(32,37,42,0.06)] bg-[#FAF8F5]">
        {/* Desktop / Tablet View (md and up): Exact single panoramic banner layout */}
        <div className="hidden md:block relative w-full max-w-[1440px] mx-auto overflow-hidden">
          {/* Panoramic Illustration */}
          <img
            src="/courses-images/heroimage.png"
            alt="Learn a Language for a Bigger World"
            className="w-full h-auto block select-none pointer-events-none"
          />

          {/* Text Overlay: positioned precisely in the clear sky area between airplane and polaroids */}
          <div className="absolute left-[28%] xl:left-[28.5%] top-0 bottom-0 w-[28.5%] flex flex-col justify-center pointer-events-none">
            <div className="pointer-events-auto space-y-1.5 md:space-y-2 lg:space-y-2.5 xl:space-y-3.5 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 lg:px-3 lg:py-1 rounded-full bg-[#E5F3FE]/95 text-[#1E75C8] text-[9px] md:text-[10px] lg:text-[11px] font-black uppercase tracking-wider border border-[#CEE7FC] shadow-2xs backdrop-blur-xs">
                <span>OUR COURSES &amp; FEES</span>
              </div>

              {/* Headline */}
              <h1 className="text-lg md:text-xl lg:text-[1.85rem] xl:text-[2.25rem] 2xl:text-[2.5rem] font-black text-gray-900 tracking-tight leading-[1.12]">
                Learn a Language <br />
                for a <span className="text-[#3048D4]">Bigger</span> <span className="text-[#FF5938]">World</span>
              </h1>

              {/* Subtitle */}
              <p className="text-[10px] md:text-[11px] lg:text-xs xl:text-sm text-gray-600 font-medium leading-relaxed max-w-sm">
                Structured courses based on the CEFR framework with expert guidance, interactive classes and a global community.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile View (< md): Clean stacked layout so text is crisp, spacious & readable */}
        <div className="md:hidden pt-8 pb-6 px-4 bg-gradient-to-b from-[#F2F8FE] via-[#FAF8F5] to-[#FAF8F5]">
          <div className="text-center space-y-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F3FE] text-[#1E75C8] text-[10px] font-black uppercase tracking-wider border border-[#CEE7FC] shadow-2xs">
              <span>OUR COURSES &amp; FEES</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
              Learn a Language <br />
              for a <span className="text-[#3048D4]">Bigger</span> <span className="text-[#FF5938]">World</span>
            </h1>
            <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-xs mx-auto">
              Structured courses based on the CEFR framework with expert guidance, interactive classes and a global community.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xs border border-amber-100/60 bg-white">
            <img
              src="/courses-images/heroimage.png"
              alt="Learn a Language for a Bigger World"
              className="w-full h-auto object-contain block"
            />
          </div>
        </div>
      </section>

      {/* ── 2. GERMAN TEACHING STRUCTURE SECTION ── */}
      <section id="german-courses" className="pt-12 sm:pt-16 pb-8 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full overflow-hidden inline-flex items-center justify-center shadow-xs border border-gray-200 flex-shrink-0 text-xl leading-none">
              🇩🇪
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              German Teaching Structure
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 ml-10">
            Build your German language skills step by step with our structured courses based on the CEFR framework.
          </p>
        </div>

        {/* Dynamic Cards Grid */}
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="text-sm font-bold text-gray-500 animate-pulse">
              Loading German courses from database...
            </div>
          </div>
        ) : germanCourses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center text-gray-500 font-medium text-sm">
            No German courses available in database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
            {germanCourses.map((course, idx) => {
              const palette = GERMAN_STYLE_PALETTE[idx % GERMAN_STYLE_PALETTE.length];
              const cardImg = course.imageUrl?.trim() || '';
              const featuresList = Array.isArray(course.features) ? course.features : [];

              return (
                <div
                  key={course._id || idx}
                  className={`${palette.cardBg} border ${palette.cardBorder} rounded-[28px] p-6 sm:p-7 ${palette.cardShadow} transition-all flex flex-col justify-between relative overflow-hidden group min-h-[360px] sm:min-h-[370px]`}
                >
                  {/* Large Landmark Arch Image: positioned higher up, well clear of 'Book Free Trial' */}
                  {cardImg && (
                    <div className="absolute bottom-[96px] sm:bottom-[108px] right-1 sm:right-3 w-56 sm:w-64 md:w-60 lg:w-76 xl:w-84 h-44 sm:h-52 md:h-56 lg:h-64 pointer-events-none select-none flex items-end justify-end group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={cardImg}
                        alt={course.title}
                        className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-sm"
                      />
                    </div>
                  )}

                  <div className="relative z-10">
                    {/* Top Row: Icon + Title + Price */}
                    <div className={`flex items-start justify-between gap-4 pb-4 border-b ${palette.divider}`}>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl ${palette.iconBg} ${palette.iconText} flex items-center justify-center shadow-2xs flex-shrink-0`}
                        >
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                            {course.title}
                          </h3>
                          {course.level && (
                            <p className="text-xs text-gray-500 font-medium">
                              {course.level}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                          ₹{(course.price ?? 0).toLocaleString('en-IN')}
                          {course.billingPeriod === 'monthly' && (
                            <span className="text-base font-bold text-gray-500">/mo</span>
                          )}
                        </div>
                        {course.feeNote && (
                          <div className="text-[11px] text-gray-400 font-medium mt-1">
                            {course.feeNote}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Middle: Checklist with generous width to prevent text wrapping */}
                    <div className="pt-5 pb-4 max-w-[65%] sm:max-w-[62%] lg:max-w-[58%] space-y-2.5">
                      {featuresList.slice(0, 5).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full ${palette.checkBg} ${palette.checkText} flex items-center justify-center flex-shrink-0 mt-0.5`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-[11.5px] sm:text-xs text-gray-700 font-medium leading-relaxed sm:whitespace-nowrap xl:whitespace-normal">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Button Row: View Course Details (left) & Book Free Trial (right) */}
                  <div className={`relative z-10 pt-4 border-t ${palette.divider} flex items-center justify-between`}>
                    <button
                      onClick={() =>
                        openCourseModal({
                          title: course.title,
                          levelBadge: course.level || course.title,
                          price: `₹${(course.price ?? 0).toLocaleString('en-IN')}${
                            course.billingPeriod === 'monthly' ? ' / mo' : ''
                          }`,
                          feeNote: course.feeNote || 'Course Fee',
                          themeColor: palette.cardBorder,
                          iconBg: palette.iconBg,
                          iconText: palette.iconText,
                          description: course.description || `${course.title} language program.`,
                          curriculum: featuresList,
                          schedule: course.schedule || 'Monday to Friday',
                          duration: course.durationLabel || (course.durationDays ? `${course.durationDays} Days` : ''),
                          materials: [
                            'Complete curated PDF learning guide & workbook',
                            'Vocabulary flashcards & audio pronunciation files',
                            'Language exchange partner drills with native speaker mentors',
                          ],
                          examTarget: course.examPrep || undefined,
                          certificate: course.certificate || undefined,
                          buttonColor: 'bg-[#E02B3A] hover:bg-[#C82331]',
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full ${palette.btnBg} font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer`}
                    >
                      <span>View Course Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href="/register"
                      className="text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors flex items-center gap-1 group/btn"
                    >
                      <span>Book Free Trial</span>
                      <span className="transition-transform group-hover/btn:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── 3. BANNER: "How Our German Course Works" ── */}
        <div className="bg-[#E0F2FE] border border-[#BAE6FD] rounded-[26px] p-6 sm:p-8 mt-9 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FDE047] text-[#854D0E] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Lightbulb className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  How Our German Course Works
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 font-medium mt-1.5 leading-relaxed">
                  Our German courses are designed using the CEFR framework, ensuring a step-by-step learning journey from basic to advanced levels. You&apos;ll get expert guidance, interactive classes and plenty of practice to build real-world confidence.
                </p>
              </div>
            </div>

            {/* Right 4 Icons */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-[#FFE4E6] text-[#E11D48] flex items-center justify-center mb-1.5 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-900 leading-tight">
                  Structured Curriculum
                </span>
                <span className="text-[10px] text-gray-600 font-semibold">(CEFR Aligned)</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-1.5 shadow-2xs">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-900 leading-tight">
                  Interactive
                </span>
                <span className="text-[10px] text-gray-600 font-semibold">Live Classes</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center mb-1.5 shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-900 leading-tight">
                  Expert
                </span>
                <span className="text-[10px] text-gray-600 font-semibold">Guidance</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mb-1.5 shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-900 leading-tight">
                  Global
                </span>
                <span className="text-[10px] text-gray-600 font-semibold">Community</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── 4. FOUR VALUE PROPS ROW ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">
          <div className="bg-[#FFF0F2] border border-[#FFE0E4] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFE2E6] text-[#E02B3A] flex items-center justify-center mb-2.5">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">PDF Learning Material</h4>
            <p className="text-xs text-gray-500 font-medium">
              Comprehensive and easy to follow study material.
            </p>
          </div>

          <div className="bg-[#F0F7FF] border border-[#D9EBFF] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E0F0FE] text-[#1E75C8] flex items-center justify-center mb-2.5">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">Offline Practice</h4>
            <p className="text-xs text-gray-500 font-medium">
              Practice anytime, anywhere.
            </p>
          </div>

          <div className="bg-[#FFFBEA] border border-[#FEF3C7] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF08A] text-[#B45309] flex items-center justify-center mb-2.5">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">Profile Stays Active</h4>
            <p className="text-xs text-gray-500 font-medium">
              Continue your learning progress anytime.
            </p>
          </div>

          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-2.5">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">Certificates</h4>
            <p className="text-xs text-gray-500 font-medium">
              Get certified upon course completion.
            </p>
          </div>
        </div>

      </section>

      {/* ── 5. ENGLISH LEARNING STRUCTURE SECTION ── */}
      <section id="english-courses" className="pt-12 sm:pt-16 pb-8 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full overflow-hidden inline-flex items-center justify-center shadow-xs border border-gray-200 flex-shrink-0 text-xl leading-none">
              🇬🇧
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              English Learning Structure
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 ml-10">
            Improve your English skills with our structured course designed for real-world communication.
          </p>
        </div>

        {/* English Content: Map over all English courses from DB */}
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <div className="text-sm font-bold text-gray-500 animate-pulse">
              Loading English courses from database...
            </div>
          </div>
        ) : englishCourses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-10 text-center text-gray-500 font-medium text-sm">
            No English courses available in database.
          </div>
        ) : (
          <div className="space-y-6">
            {englishCourses.map((engCourse, engIdx) => {
              const engImage = engCourse.imageUrl?.trim() || '/courses-images/english-big-ben.png';
              const engFeatures = Array.isArray(engCourse.features) ? engCourse.features : [];

              return (
                <div
                  key={engCourse._id || engIdx}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center"
                >
                  {/* Card: English Course (lg:col-span-7 xl:col-span-6) */}
                  <div className={`${engImage ? 'lg:col-span-7 xl:col-span-6' : 'lg:col-span-12'} bg-[#ECF7FD] border border-[#BAE6FD] rounded-[26px] p-6 sm:p-8 transition-all flex flex-col justify-between relative overflow-hidden`}>
                    <div>
                      {/* Top Row: Icon + Title + Price */}
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#CEE7FE]">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-[#DBEAFE] text-[#1E75C8] flex items-center justify-center shadow-2xs flex-shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                                {engCourse.title}
                              </h3>
                              {engCourse.level && (
                                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]">
                                  {engCourse.level}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                            ₹{(engCourse.price ?? 0).toLocaleString('en-IN')}
                            {engCourse.billingPeriod === 'monthly' && (
                              <span className="text-base font-bold text-gray-500">/mo</span>
                            )}
                          </div>
                          {engCourse.feeNote && (
                            <div className="text-[11px] text-gray-400 font-medium mt-1">
                              {engCourse.feeNote}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-3 pt-5 pb-5">
                        {engFeatures.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5">
                            <div className="w-4 h-4 rounded-full bg-[#DBEAFE] text-[#0284C7] flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                            <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed sm:whitespace-nowrap xl:whitespace-normal">
                              {feat}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Button */}
                    <div className="pt-4 border-t border-[#CEE7FE] flex items-center justify-between">
                      <button
                        onClick={() =>
                          openCourseModal({
                            title: engCourse.title,
                            levelBadge: engCourse.level || engCourse.title,
                            price: `₹${(engCourse.price ?? 0).toLocaleString('en-IN')}${
                              engCourse.billingPeriod === 'monthly' ? ' / month' : ''
                            }`,
                            feeNote: engCourse.feeNote || 'Course Subscription',
                            themeColor: 'border-blue-200',
                            iconBg: 'bg-blue-50',
                            iconText: 'text-blue-700',
                            description: engCourse.description || `${engCourse.title} English curriculum.`,
                            curriculum: engFeatures,
                            schedule: engCourse.schedule || 'Monday to Friday',
                            duration: engCourse.durationLabel || (engCourse.durationDays ? `${engCourse.durationDays} Days` : ''),
                            materials: [
                              'Digital practice worksheets & idiom decks',
                              'Daily conversation rooms with co-learners',
                              'Personalized feedback from certified trainers',
                            ],
                            examTarget: engCourse.examPrep || undefined,
                            certificate: engCourse.certificate || undefined,
                            buttonColor: 'bg-[#0F52BA] hover:bg-[#0C4196]',
                          })
                        }
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#0F52BA] hover:bg-[#0C4196] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                      >
                        <span>View Course Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href="/register"
                        className="text-xs font-bold text-[#0F52BA] hover:underline hidden sm:inline-block"
                      >
                        Start Monthly Subscription →
                      </Link>
                    </div>
                  </div>

                  {/* Right Artwork: Image beside English Course (lg:col-span-5 xl:col-span-6) */}
                  {engImage && (
                    <div className="lg:col-span-5 xl:col-span-6 flex items-center justify-center relative py-4 lg:py-0">
                      <div className="relative w-full max-w-[560px] lg:max-w-[620px] flex items-center justify-center">
                        <img
                          src={engImage}
                          alt="Better English, Bigger Opportunities"
                          className="w-full h-auto object-contain select-none hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* ── 6. "Not Sure Where to Start?" CTA CARD ── */}
      <section className="pt-8 pb-12 max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#FFF5EC] via-[#FFF9F2] to-[#FFF1E6] border border-[#FED7AA] rounded-[28px] p-7 sm:p-9 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Icon + Text */}
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center shadow-2xs flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Not Sure Where to Start?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                We&apos;re here to help you choose the right course based on your goals and current level.
              </p>
              
              {/* Buttons */}
              <div className="mt-4 flex items-center justify-center md:justify-start gap-3 flex-wrap">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#E67002] hover:bg-[#C95F00] text-white font-extrabold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://wa.me/919105326128?text=Hello%20BhashaSchool!%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20course."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-extrabold text-xs sm:text-sm shadow-2xs transition-all active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-gray-500" />
                  <span>Talk to Our Team</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Flight Path Graphic: "Your Language Journey Starts Here" */}
          <div className="flex-shrink-0 flex flex-col items-center md:items-end justify-center relative select-none pr-2 sm:pr-4">
            <div className="relative transform -rotate-2 text-center md:text-right">
              <span className="block font-serif italic font-extrabold text-[#E02B3A] text-sm sm:text-base tracking-tight leading-snug">
                Your Language
              </span>
              <span className="block font-serif italic font-extrabold text-[#E02B3A] text-sm sm:text-base tracking-tight leading-snug">
                Journey Starts Here
              </span>
              {/* Flight path curve with paper airplane */}
              <svg
                className="w-32 sm:w-36 h-10 overflow-visible mt-1 mx-auto md:ml-auto text-[#E02B3A]"
                viewBox="0 0 120 40"
                fill="none"
              >
                <path
                  d="M10 32 C 40 38, 70 30, 95 12"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="4 4"
                  fill="none"
                />
                <path
                  d="M95 12 L110 5 L102 18 L99 13 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. INTERACTIVE COURSE DETAILS MODAL ── */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={closeCourseModal}
        >
          <div
            className="bg-white rounded-[32px] max-w-2xl lg:max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-gray-50/90 via-white to-gray-50/90 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-2xl ${selectedCourse.iconBg} ${selectedCourse.iconText} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                >
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight truncate">
                    {selectedCourse.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {selectedCourse.levelBadge}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-gray-900">
                      {selectedCourse.price}
                    </span>
                    {selectedCourse.feeNote && (
                      <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
                        • {selectedCourse.feeNote}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={closeCourseModal}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ml-3"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="px-6 sm:px-8 py-6 overflow-y-auto space-y-6 [scrollbar-width:thin] [scrollbar-color:#CBD5E1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              {/* About the Course */}
              <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-4 sm:p-5">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                  About The Course
                </span>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Specs Pills: Timings & Duration & Exam/Certificate */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Timings</span>
                  </div>
                  <p className="font-extrabold text-gray-900 mt-1 text-xs sm:text-sm">
                    {selectedCourse.schedule}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Duration</span>
                  </div>
                  <p className="font-extrabold text-gray-900 mt-1 text-xs sm:text-sm">
                    {selectedCourse.duration}
                  </p>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 text-gray-400 font-bold text-[10px] uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Certification</span>
                  </div>
                  <p className="font-extrabold text-gray-900 mt-1 text-xs sm:text-sm truncate">
                    {selectedCourse.certificate || selectedCourse.examTarget || 'CEFR Aligned'}
                  </p>
                </div>
              </div>

              {/* Curriculum Highlights in 2 Columns */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block mb-2.5">
                  Curriculum Highlights
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedCourse.curriculum.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50/90 border border-gray-100 text-gray-800"
                    >
                      <div className="w-5 h-5 rounded-md bg-[#DBEAFE] text-[#1E75C8] flex items-center justify-center flex-shrink-0 text-[10px] font-black mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-xs font-semibold leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Included Study Material */}
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block mb-2.5">
                  Included Study Material
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {selectedCourse.materials.map((mat, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-900"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-medium leading-snug">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Target if Available */}
              {selectedCourse.examTarget && (
                <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <span className="font-black text-emerald-900 text-xs block">
                      Official Certification Target
                    </span>
                    <span className="text-emerald-700 font-medium text-xs">
                      {selectedCourse.examTarget}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 sm:px-8 py-5 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">
                  Total Investment
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black text-gray-900">
                    {selectedCourse.price}
                  </span>
                  {selectedCourse.feeNote && (
                    <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                      ({selectedCourse.feeNote})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={closeCourseModal}
                  className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-full transition-colors cursor-pointer"
                >
                  Close
                </button>
                <Link
                  href="/register"
                  className={`inline-flex items-center gap-2 px-7 py-3 rounded-full ${
                    selectedCourse.buttonColor || 'bg-[#E02B3A] hover:bg-[#C82331]'
                  } text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer`}
                >
                  <span>Enroll Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
