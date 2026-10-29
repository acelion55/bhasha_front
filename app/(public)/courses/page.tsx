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
}

const GERMAN_STYLE_PALETTE = [
  {
    cardBorder: 'border-[#FEE2E2]',
    cardShadow: 'shadow-[0_4px_20px_rgba(239,68,68,0.04)] hover:shadow-[0_12px_28px_rgba(239,68,68,0.1)]',
    iconBg: 'bg-[#FFF0F2]',
    iconText: 'text-[#E02B3A]',
    checkBg: 'bg-red-100',
    checkText: 'text-[#E02B3A]',
    btnBg: 'bg-[#FFE6E8] hover:bg-[#FFD9DC] text-[#D92D3E]',
    subText: 'From Baustein to A1',
    defaultImg: '/courses-images/card-a1-arch.png',
  },
  {
    cardBorder: 'border-[#FEF3C7]',
    cardShadow: 'shadow-[0_4px_20px_rgba(245,158,11,0.04)] hover:shadow-[0_12px_28px_rgba(245,158,11,0.1)]',
    iconBg: 'bg-[#FFFBEB]',
    iconText: 'text-[#D97706]',
    checkBg: 'bg-amber-100',
    checkText: 'text-[#D97706]',
    btnBg: 'bg-[#FFF0D4] hover:bg-[#FFE6B8] text-[#B87A00]',
    subText: 'From A1 to A2',
    defaultImg: '/courses-images/card-a2-arch.png',
  },
  {
    cardBorder: 'border-[#D1FAE5]',
    cardShadow: 'shadow-[0_4px_20px_rgba(16,185,129,0.04)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.1)]',
    iconBg: 'bg-[#ECFDF5]',
    iconText: 'text-[#059669]',
    checkBg: 'bg-emerald-100',
    checkText: 'text-[#059669]',
    btnBg: 'bg-[#DDF7E8] hover:bg-[#CFF0DC] text-[#1E824C]',
    subText: 'From A2 to B1',
    defaultImg: '/courses-images/card-b1-arch.png',
  },
  {
    cardBorder: 'border-[#EDE9FE]',
    cardShadow: 'shadow-[0_4px_20px_rgba(139,92,246,0.04)] hover:shadow-[0_12px_28px_rgba(139,92,246,0.1)]',
    iconBg: 'bg-[#F5F3FF]',
    iconText: 'text-[#7C3AED]',
    checkBg: 'bg-purple-100',
    checkText: 'text-[#7C3AED]',
    btnBg: 'bg-[#EDE5FF] hover:bg-[#E3D6FF] text-[#6938D3]',
    subText: 'From B1 to B2',
    defaultImg: '/courses-images/card-b2-arch.png',
  },
];

const DEFAULT_GERMAN_COURSES: PublicCourseItem[] = [
  {
    _id: 'default-a1',
    title: 'Baustein + A1',
    language: 'German',
    level: 'From Baustein to A1',
    price: 9500,
    feeNote: '(Total Course Fees)',
    imageUrl: '/courses-images/card-a1-arch.png',
    description:
      'Baustein is our signature 15-day foundational syllabus taught before opening the standard textbook. Combined with A1, you master foundational pronunciation, sentence structures, cases, and everyday conversational fluency.',
    features: [
      'Basic vocabulary and everyday expressions',
      'Introduction to grammar and sentence structure',
      'Listening, speaking, reading and writing practice',
      'Interactive classes with expert guidance',
    ],
    schedule: 'Monday to Friday (1 Hour live per session)',
    durationLabel: 'Approximately 30-45 Days',
    classDuration: '1 Hour live daily',
    examPrep: 'Goethe-Zertifikat A1 / Telc Deutsch A1',
    certificate: 'Official Certificate upon A1 completion',
  },
  {
    _id: 'default-a2',
    title: 'A2',
    language: 'German',
    level: 'From A1 to A2',
    price: 11000,
    feeNote: '(Total Course Fees)',
    imageUrl: '/courses-images/card-a2-arch.png',
    description:
      'Level A2 elevates your German from survival phrases to fluid conversation. Express opinions, discuss past events using Perfekt and Präteritum, describe your professional background, and handle daily life in Germany.',
    features: [
      'Expand vocabulary for daily life and work',
      'Build confidence in real-life conversations',
      'Improve reading and listening comprehension',
      'Interactive classes with expert guidance',
    ],
    schedule: 'Monday to Friday (1:30 Hours per session)',
    durationLabel: 'Approximately 40 Days',
    classDuration: '1:30 hours daily',
    examPrep: 'Goethe-Zertifikat A2 / Telc Deutsch A2',
    certificate: 'Official Certificate upon A2 completion',
  },
  {
    _id: 'default-b1',
    title: 'B1',
    language: 'German',
    level: 'From A2 to B1',
    price: 12500,
    feeNote: '(Total Course Fees)',
    imageUrl: '/courses-images/card-b1-arch.png',
    description:
      'B1 is the pivotal official threshold required for German vocational training (Ausbildung), job visas, and university admission in Germany. Learn to discuss plans, argue perspectives, write official letters, and speak spontaneously.',
    features: [
      'Handle most situations while traveling, studying or working',
      'Improve fluency and accuracy',
      'Build advanced grammar and vocabulary',
      'Interactive classes with expert guidance',
    ],
    schedule: 'Monday to Friday (1:30 Hours per session)',
    durationLabel: 'Approximately 50 Days + 10 Days Exam Prep',
    classDuration: '1:30 hours daily',
    examPrep: 'Goethe-Zertifikat B1 / Telc Deutsch B1 / ÖSD B1',
    certificate: 'Official Certificate upon B1 completion',
  },
  {
    _id: 'default-b2',
    title: 'B2',
    language: 'German',
    level: 'From B1 to B2',
    price: 14000,
    feeNote: '(Total Course Fees)',
    imageUrl: '/courses-images/card-b2-arch.png',
    description:
      'B2 is the golden standard for medical professionals (nurses, doctors), engineers, and corporate employees in Germany, Austria, and Switzerland. Taught in two comprehensive modules: B2.1 and B2.2.',
    features: [
      'Express yourself clearly and in detail on a wide range of topics',
      'Develop advanced communication skills',
      'Refine grammar and vocabulary',
      'Interactive classes with expert guidance',
    ],
    schedule: 'Monday to Friday (1:30 Hours per session)',
    durationLabel: 'Approximately 60 Days (2 Months across B2.1 & B2.2)',
    classDuration: '1:30 hours daily',
    examPrep: 'Goethe-Zertifikat B2 / Telc Deutsch B2',
    certificate: 'Official Certificate upon B2 completion',
  },
];

const DEFAULT_ENGLISH_COURSES: PublicCourseItem[] = [
  {
    _id: 'default-eng',
    title: 'Intermediate English',
    language: 'English',
    level: 'Intermediate',
    price: 450,
    billingPeriod: 'monthly',
    feeNote: '(Monthly Fees)',
    imageUrl: '/courses-images/english-banner-ben.png',
    description:
      'Designed for students and professionals looking to conquer hesitation, speak with natural fluency, polish pronunciation, and master formal email & presentation skills.',
    features: [
      'Build advanced vocabulary and grammar',
      'Improve reading, writing, listening and speaking',
      'Real-life conversation practice',
      'Interactive classes with expert guidance',
    ],
    schedule: 'Monday to Friday (1:30 Hours per session)',
    durationLabel: '4 to 5 Months (Continuous mentor support)',
    classDuration: '1:30 hours daily',
    examPrep: 'IELTS Speaking / TOEFL / Corporate Readiness',
    certificate: 'Course Completion Certificate',
  },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<PublicCourseItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseModalData | null>(null);

  useEffect(() => {
    let isMounted = true;
    api
      .get<PublicCourseItem[]>('/courses/public')
      .then((res) => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          setCourses(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic public courses, falling back to defaults:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Separate courses by language from backend, or fall back to defaults
  const backendGerman = courses.filter(
    (c) => (c.language || 'German').toLowerCase() === 'german',
  );
  const backendEnglish = courses.filter(
    (c) => (c.language || '').toLowerCase() === 'english',
  );

  const germanCourses = backendGerman.length > 0 ? backendGerman : DEFAULT_GERMAN_COURSES;
  const englishCourses = backendEnglish.length > 0 ? backendEnglish : DEFAULT_ENGLISH_COURSES;

  const openCourseModal = (data: CourseModalData) => {
    setSelectedCourse(data);
  };

  const closeCourseModal = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-800 font-[Plus_Jakarta_Sans] selection:bg-emerald-100 selection:text-emerald-900 pb-20">
      
      {/* ── 1. HERO SECTION: "Learn a Language for a Bigger World" ── */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-[rgba(32,37,42,0.06)] bg-gradient-to-b from-[#FBF8F4] via-[#FAF7F2] to-[#FAF7F2]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5F3FE] text-[#1E75C8] text-[11px] font-black uppercase tracking-wider border border-[#CEE7FC] shadow-2xs">
                <span>OUR COURSES &amp; FEES</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-gray-900 tracking-tight leading-[1.12]">
                Learn a Language <br className="hidden sm:inline" />
                for a <span className="text-[#3048D4]">Bigger</span> <span className="text-[#FF5938]">World</span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Structured courses based on the CEFR framework with expert guidance, interactive classes and a global community.
              </p>

              {/* Whimsical Left Note */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 border border-red-100/80 shadow-2xs backdrop-blur-xs">
                  <span className="text-xs font-serif italic text-[#E02B3A] font-extrabold flex items-center gap-1.5">
                    <span className="text-sm">✈</span> Same Language, More Opportunities
                  </span>
                  <span className="text-[10px] text-amber-500 font-black">✦ ✦</span>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="#german-courses"
                    className="text-xs font-bold text-gray-700 hover:text-emerald-800 underline underline-offset-4 transition-colors"
                  >
                    Explore German ↓
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="#english-courses"
                    className="text-xs font-bold text-gray-700 hover:text-emerald-800 underline underline-offset-4 transition-colors"
                  >
                    Explore English ↓
                  </a>
                </div>
              </div>
            </div>

            {/* Right Artwork: Fanned Polaroid Landmarks */}
            <div className="lg:col-span-5 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 via-rose-200/30 to-sky-200/40 rounded-full blur-3xl pointer-events-none transform scale-90" />
              
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] flex items-center justify-center">
                <img
                  src="/courses-images/hero-polaroids-exact.png"
                  alt="Travel landmarks: Brandenburg Gate, Eiffel Tower, Colosseum"
                  className="w-full h-auto object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.12)] select-none hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {germanCourses.map((course, idx) => {
            const palette = GERMAN_STYLE_PALETTE[idx % GERMAN_STYLE_PALETTE.length];
            // Primary image from course table in DB, fallback to landmark arch preset
            const cardImg = course.imageUrl && course.imageUrl.trim() ? course.imageUrl.trim() : palette.defaultImg;
            const featuresList =
              Array.isArray(course.features) && course.features.length > 0
                ? course.features
                : [
                    'Basic vocabulary and everyday expressions',
                    'Introduction to grammar and sentence structure',
                    'Listening, speaking, reading and writing practice',
                    'Interactive classes with expert guidance',
                  ];

            return (
              <div
                key={course._id || idx}
                className={`bg-white border ${palette.cardBorder} rounded-[26px] p-6 sm:p-7 ${palette.cardShadow} transition-all flex flex-col justify-between relative overflow-hidden group`}
              >
                <div>
                  {/* Top Row: Icon + Title + Price */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
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
                        <p className="text-xs text-gray-500 font-medium">
                          {course.level || palette.subText}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                        ₹{(course.price ?? 0).toLocaleString('en-IN')}
                        {course.billingPeriod === 'monthly' && (
                          <span className="text-base font-bold text-gray-500">/mo</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 font-medium mt-1">
                        {course.feeNote || (course.billingPeriod === 'monthly' ? '(Monthly Fees)' : '(Total Course Fees)')}
                      </div>
                    </div>
                  </div>

                  {/* Card Middle: Checklist + Landmark Arch Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-5 pb-3">
                    {/* Left Checklist */}
                    <div className="sm:col-span-7 space-y-2.5">
                      {featuresList.slice(0, 4).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <div
                            className={`w-4 h-4 rounded-full ${palette.checkBg} ${palette.checkText} flex items-center justify-center flex-shrink-0 mt-0.5`}
                          >
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium leading-relaxed">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Right Landmark Arch: Fetched directly from Course table in DB */}
                    <div className="sm:col-span-5 flex items-center justify-center sm:justify-end">
                      <div className="w-28 sm:w-32 lg:w-36 h-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                        <img
                          src={cardImg}
                          alt={course.title}
                          className="w-full h-auto object-contain pointer-events-none drop-shadow-xs"
                          onError={(e) => {
                            // If custom URL fails to load, gracefully fall back to arch graphic
                            const target = e.currentTarget as HTMLImageElement;
                            if (target.src !== palette.defaultImg) {
                              target.src = palette.defaultImg;
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Button */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() =>
                      openCourseModal({
                        title: course.title,
                        levelBadge: course.level || palette.subText,
                        price: `₹${(course.price ?? 0).toLocaleString('en-IN')}${
                          course.billingPeriod === 'monthly' ? ' / mo' : ''
                        }`,
                        feeNote: course.feeNote || 'Total Course Fee (No hidden charges)',
                        themeColor: palette.cardBorder,
                        iconBg: palette.iconBg,
                        iconText: palette.iconText,
                        description:
                          course.description ||
                          `${course.title} is designed under the CEFR framework to give learners solid grammar, fluid pronunciation, and interactive conversational fluency.`,
                        curriculum: featuresList,
                        schedule: course.schedule || 'Monday to Friday (1:30 Hours live per session)',
                        duration: course.durationLabel || (course.durationDays ? `${course.durationDays} Days` : 'Approximately 40 Days'),
                        materials: [
                          'Complete curated PDF learning guide & workbook',
                          'Vocabulary flashcards & audio pronunciation files',
                          'Language exchange partner drills with native speaker mentors',
                        ],
                        examTarget: course.examPrep || 'Telc Deutsch / Goethe-Zertifikat Prep',
                        certificate: course.certificate || 'Official Certificate of Completion',
                      })
                    }
                    className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full ${palette.btnBg} font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer`}
                  >
                    <span>View Course Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <Link
                    href="/register"
                    className="text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors hidden sm:inline-block"
                  >
                    Book Free Trial →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3. BANNER: "How Our German Course Works" ── */}
        <div className="bg-[#EBF5FF] border border-[#D0E6FF] rounded-[26px] p-6 sm:p-8 mt-9 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#FFEBA5] text-amber-700 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  How Our German Course Works
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1.5 leading-relaxed">
                  Our German courses are designed using the CEFR framework, ensuring a step-by-step learning journey from basic to advanced levels. You&apos;ll get expert guidance, interactive classes and plenty of practice to build real-world confidence.
                </p>
              </div>
            </div>

            {/* Right 4 Icons */}
            <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-[#D92D3E] flex items-center justify-center mb-1.5 shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-800 leading-tight">
                  Structured Curriculum
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">(CEFR Aligned)</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1E75C8] flex items-center justify-center mb-1.5 shadow-2xs">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-800 leading-tight">
                  Interactive
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">Live Classes</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#D97706] flex items-center justify-center mb-1.5 shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-800 leading-tight">
                  Expert
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">Guidance</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#059669] flex items-center justify-center mb-1.5 shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-black text-gray-800 leading-tight">
                  Global
                </span>
                <span className="text-[10px] text-gray-500 font-semibold">Community</span>
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
        <div className="space-y-6">
          {englishCourses.map((engCourse, engIdx) => {
            const engImage =
              engCourse.imageUrl && engCourse.imageUrl.trim()
                ? engCourse.imageUrl.trim()
                : '/courses-images/english-banner-ben.png';
            const engFeatures =
              Array.isArray(engCourse.features) && engCourse.features.length > 0
                ? engCourse.features
                : [
                    'Build advanced vocabulary and grammar',
                    'Improve reading, writing, listening and speaking',
                    'Real-life conversation practice',
                    'Interactive classes with expert guidance',
                  ];

            return (
              <div
                key={engCourse._id || engIdx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center"
              >
                {/* Card: English Course (lg:col-span-7) */}
                <div className="lg:col-span-7 bg-white border border-[#D0E6FF] rounded-[26px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(30,117,200,0.05)] hover:shadow-[0_12px_28px_rgba(30,117,200,0.1)] transition-all flex flex-col justify-between relative overflow-hidden">
                  <div>
                    {/* Top Row: Icon + Title + Price */}
                    <div className="flex items-start justify-between gap-4 pb-4 border-b border-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#EAF4FE] text-[#1351B4] flex items-center justify-center shadow-2xs flex-shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                              {engCourse.title}
                            </h3>
                            {engCourse.level && (
                              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#EBF5FF] text-[#1351B4] border border-[#CEE3FD]">
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
                        <div className="text-[11px] text-gray-400 font-medium mt-1">
                          {engCourse.feeNote || (engCourse.billingPeriod === 'monthly' ? '(Monthly Fees)' : '(Total Course Fees)')}
                        </div>
                      </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-3 pt-5 pb-5">
                      {engFeatures.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1351B4] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Button */}
                  <div className="pt-4 border-t border-blue-50 flex items-center justify-between">
                    <button
                      onClick={() =>
                        openCourseModal({
                          title: engCourse.title,
                          levelBadge: engCourse.level || 'Intermediate (B1–B2)',
                          price: `₹${(engCourse.price ?? 0).toLocaleString('en-IN')}${
                            engCourse.billingPeriod === 'monthly' ? ' / month' : ''
                          }`,
                          feeNote: engCourse.feeNote || 'Affordable subscription, cancel anytime',
                          themeColor: 'border-blue-200',
                          iconBg: 'bg-blue-50',
                          iconText: 'text-blue-700',
                          description:
                            engCourse.description ||
                            'Designed for students and professionals looking to conquer hesitation, speak with natural fluency, polish pronunciation, and master formal email & presentation skills.',
                          curriculum: engFeatures,
                          schedule: engCourse.schedule || 'Monday to Friday (1:30 Hours per session)',
                          duration: engCourse.durationLabel || '4 to 5 Months (Continuous mentor support)',
                          materials: [
                            'Digital practice worksheets & idiom decks',
                            'Daily conversation rooms with co-learners',
                            'Personalized feedback from certified trainers',
                          ],
                          examTarget: engCourse.examPrep || 'IELTS Speaking / TOEFL / Corporate Readiness',
                          certificate: engCourse.certificate || 'Course Completion Certificate',
                        })
                      }
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#1351B4] hover:bg-[#0E3E8C] text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      <span>View Course Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <Link
                      href="/register"
                      className="text-xs font-bold text-[#1351B4] hover:underline hidden sm:inline-block"
                    >
                      Start Monthly Subscription →
                    </Link>
                  </div>
                </div>

                {/* Right Artwork: Image from Course DB (lg:col-span-5) */}
                <div className="lg:col-span-5 flex items-center justify-center relative">
                  <div className="relative w-full max-w-[340px] sm:max-w-[380px] flex items-center justify-center">
                    <img
                      src={engImage}
                      alt={engCourse.title}
                      className="w-full h-auto object-contain select-none hover:scale-105 transition-transform duration-500 drop-shadow-md"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        if (target.src !== '/courses-images/english-banner-ben.png') {
                          target.src = '/courses-images/english-banner-ben.png';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="https://wa.me/919105326128?text=Hello%20BhashaSchool!%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20course."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-gray-500" />
                  <span>Talk to Our Team</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Flight Path Graphic: "Your Language Journey Starts Here" */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <div className="w-40 sm:w-48 h-auto">
              <img
                src="/courses-images/cta-journey-note.png"
                alt="Your Language Journey Starts Here with paper airplane"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. INTERACTIVE COURSE DETAILS MODAL ── */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl ${selectedCourse.iconBg} ${selectedCourse.iconText} flex items-center justify-center flex-shrink-0 shadow-2xs`}
                >
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 leading-tight">
                    {selectedCourse.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {selectedCourse.levelBadge}
                    </span>
                    <span className="text-xs font-black text-emerald-700">
                      {selectedCourse.price}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={closeCourseModal}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
                  About the Course
                </h4>
                <p className="text-gray-700 leading-relaxed font-medium">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Schedule & Duration */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>TIMINGS</span>
                  </div>
                  <p className="font-extrabold text-gray-900 mt-0.5 text-xs">
                    {selectedCourse.schedule}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DURATION</span>
                  </div>
                  <p className="font-extrabold text-gray-900 mt-0.5 text-xs">
                    {selectedCourse.duration}
                  </p>
                </div>
              </div>

              {/* Curriculum */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Curriculum Highlights
                </h4>
                <ul className="space-y-2">
                  {selectedCourse.curriculum.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-black">
                        {idx + 1}
                      </div>
                      <span className="leading-snug font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
                  Included Study Material
                </h4>
                <div className="space-y-1.5">
                  {selectedCourse.materials.map((mat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-600">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span className="font-medium text-xs">{mat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Target */}
              {selectedCourse.examTarget && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs">
                  <span className="font-black text-amber-900 block">Exam Certification Target:</span>
                  <span className="text-amber-800 font-medium">{selectedCourse.examTarget}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gray-400 font-medium block">Total Investment</span>
                <span className="text-lg font-black text-gray-900">{selectedCourse.price}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={closeCourseModal}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-xl"
                >
                  Close
                </button>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition-all active:scale-95"
                >
                  Enroll Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
