'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
}

export default function CoursesPage() {
  const [selectedCourse, setSelectedCourse] = useState<CourseModalData | null>(null);

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

              {/* Whimsical Left Note: "Same Language, More Opportunities" */}
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
              {/* Soft ambient radial glow */}
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

        {/* 4 Cards Grid (2 columns on tablet/desktop, 1 column on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">

          {/* ── CARD 1: Baustein + A1 ── */}
          <div className="bg-white border border-[#FEE2E2] rounded-[26px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(239,68,68,0.04)] hover:shadow-[0_12px_28px_rgba(239,68,68,0.1)] transition-all flex flex-col justify-between relative overflow-hidden group">
            <div>
              {/* Top Row: Icon + Title + Price */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-red-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF0F2] text-[#E02B3A] flex items-center justify-center shadow-2xs flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      Baustein + A1
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">From Baustein to A1</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                    ₹9,500
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-1">
                    (Total Course Fees)
                  </div>
                </div>
              </div>

              {/* Card Middle: Checklist + Landmark Arch */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-5 pb-3">
                {/* Left Checklist */}
                <div className="sm:col-span-7 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-red-100 text-[#E02B3A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Basic vocabulary and everyday expressions
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-red-100 text-[#E02B3A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Introduction to grammar and sentence structure
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-red-100 text-[#E02B3A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Listening, speaking, reading and writing practice
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-red-100 text-[#E02B3A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Interactive classes with expert guidance
                    </span>
                  </div>
                </div>

                {/* Right Landmark Arch: Brandenburg Gate */}
                <div className="sm:col-span-5 flex items-center justify-center sm:justify-end">
                  <div className="w-28 sm:w-32 lg:w-36 h-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/courses-images/card-a1-arch.png"
                      alt="Brandenburg Gate Berlin"
                      className="w-full h-auto object-contain pointer-events-none drop-shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-red-50 flex items-center justify-between">
              <button
                onClick={() =>
                  openCourseModal({
                    title: 'German Baustein + A1',
                    levelBadge: 'A1 Beginner',
                    price: '₹9,500',
                    feeNote: 'Total Course Fee (No hidden charges)',
                    themeColor: 'border-red-200',
                    iconBg: 'bg-red-50',
                    iconText: 'text-red-700',
                    description:
                      'Baustein is our signature 15-day foundational syllabus taught before opening the standard textbook. Combined with A1, you master foundational pronunciation, sentence structures, cases, and everyday conversational fluency.',
                    curriculum: [
                      'Week 1-2: Baustein Fundamentals (German sounds, alphabet, gender rules & verb conjugation)',
                      'Week 3-4: Everyday Situations (Introductions, shopping, food & ordering at cafés)',
                      'Week 5-6: Nominative & Accusative cases, modal verbs and personal pronouns',
                      'Week 7-8: Daily routine, telling time, appointments and interactive speaking club drills',
                    ],
                    schedule: 'Monday to Friday (1 Hour live per session)',
                    duration: 'Approximately 30-45 Days',
                    materials: [
                      'Complete curated PDF learning guide',
                      'Vocabulary flashcards & audio pronunciation files',
                      'Speaking partner matching via Language Exchange',
                    ],
                    examTarget: 'Goethe-Zertifikat A1 / Telc Deutsch A1',
                  })
                }
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#FFE6E8] hover:bg-[#FFD9DC] text-[#D92D3E] font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span>View Course Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/register"
                className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors hidden sm:inline-block"
              >
                Book Free Trial →
              </Link>
            </div>
          </div>

          {/* ── CARD 2: A2 ── */}
          <div className="bg-white border border-[#FEF3C7] rounded-[26px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(245,158,11,0.04)] hover:shadow-[0_12px_28px_rgba(245,158,11,0.1)] transition-all flex flex-col justify-between relative overflow-hidden group">
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-amber-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shadow-2xs flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      A2
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">From A1 to A2</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                    ₹11,000
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-1">
                    (Total Course Fees)
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-5 pb-3">
                <div className="sm:col-span-7 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Expand vocabulary for daily life and work
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Build confidence in real-life conversations
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Improve reading and listening comprehension
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-100 text-[#D97706] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Interactive classes with expert guidance
                    </span>
                  </div>
                </div>

                {/* Right Landmark Arch: Tower Bridge */}
                <div className="sm:col-span-5 flex items-center justify-center sm:justify-end">
                  <div className="w-28 sm:w-32 lg:w-36 h-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/courses-images/card-a2-arch.png"
                      alt="London Tower Bridge"
                      className="w-full h-auto object-contain pointer-events-none drop-shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-amber-50 flex items-center justify-between">
              <button
                onClick={() =>
                  openCourseModal({
                    title: 'German A2 Elementary',
                    levelBadge: 'A2 Elementary',
                    price: '₹11,000',
                    feeNote: 'Total Course Fee (No hidden charges)',
                    themeColor: 'border-amber-200',
                    iconBg: 'bg-amber-50',
                    iconText: 'text-amber-700',
                    description:
                      'Level A2 elevates your German from survival phrases to fluid conversation. Express opinions, discuss past events using Perfekt and Präteritum, describe your professional background, and handle daily life in Germany.',
                    curriculum: [
                      'Past Tenses: Master Perfekt with haben/sein and spoken narratives',
                      'Dative case mastery, reflexive verbs & two-way prepositions (Wechselpräpositionen)',
                      'Professional & social scenarios: Workplace conversations, doctor visits, apartment hunting',
                      'Advanced sentence connectors (weil, dass, wenn, obwohl) and clause inversion',
                    ],
                    schedule: 'Monday to Friday (1:30 Hours per session)',
                    duration: 'Approximately 40 Days',
                    materials: [
                      'Complete A2 PDF Textbook & Workbook',
                      'Real-life listening tracks and transcription exercises',
                      'Weekly 1-on-1 speaking evaluations',
                    ],
                    examTarget: 'Goethe-Zertifikat A2 / Telc Deutsch A2',
                  })
                }
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#FFF0D4] hover:bg-[#FFE6B8] text-[#B87A00] font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span>View Course Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/register"
                className="text-xs font-bold text-gray-500 hover:text-amber-700 transition-colors hidden sm:inline-block"
              >
                Book Free Trial →
              </Link>
            </div>
          </div>

          {/* ── CARD 3: B1 ── */}
          <div className="bg-white border border-[#D1FAE5] rounded-[26px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(16,185,129,0.04)] hover:shadow-[0_12px_28px_rgba(16,185,129,0.1)] transition-all flex flex-col justify-between relative overflow-hidden group">
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shadow-2xs flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      B1
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">From A2 to B1</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                    ₹12,500
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-1">
                    (Total Course Fees)
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-5 pb-3">
                <div className="sm:col-span-7 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Handle most situations while traveling, studying or working
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Improve fluency and accuracy
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Build advanced grammar and vocabulary
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Interactive classes with expert guidance
                    </span>
                  </div>
                </div>

                {/* Right Landmark Arch: Sagrada Família */}
                <div className="sm:col-span-5 flex items-center justify-center sm:justify-end">
                  <div className="w-28 sm:w-32 lg:w-36 h-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/courses-images/card-b1-arch.png"
                      alt="Sagrada Família"
                      className="w-full h-auto object-contain pointer-events-none drop-shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-emerald-50 flex items-center justify-between">
              <button
                onClick={() =>
                  openCourseModal({
                    title: 'German B1 Intermediate',
                    levelBadge: 'B1 Intermediate',
                    price: '₹12,500',
                    feeNote: 'Total Course Fee (Includes 10-day dedicated Exam Prep)',
                    themeColor: 'border-emerald-200',
                    iconBg: 'bg-emerald-50',
                    iconText: 'text-emerald-700',
                    description:
                      'B1 is the pivotal official threshold required for German vocational training (Ausbildung), job visas, and university admission in Germany. Learn to discuss plans, argue perspectives, write official letters, and speak spontaneously.',
                    curriculum: [
                      'Subjunctive II (Konjunktiv II) for wishes, polite requests and hypotheticals',
                      'Passive voice (Passiv Vorgang & Zustand) and complex relative clauses',
                      'Official correspondence: Formal German letters, email etiquette & complaint drafting',
                      '10 Full days of dedicated Telc & Goethe B1 model test drills and exam simulation',
                    ],
                    schedule: 'Monday to Friday (1:30 Hours per session)',
                    duration: 'Approximately 50 Days + 10 Days Exam Prep',
                    materials: [
                      'Complete B1 PDF Course Book & Exam Pack',
                      'Official Goethe / Telc past exam papers with answer keys',
                      'Certificate issued upon completion of curriculum',
                    ],
                    examTarget: 'Goethe-Zertifikat B1 / Telc Deutsch B1 / ÖSD B1',
                  })
                }
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#DDF7E8] hover:bg-[#CFF0DC] text-[#1E824C] font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
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

          {/* ── CARD 4: B2 ── */}
          <div className="bg-white border border-[#EDE9FE] rounded-[26px] p-6 sm:p-7 shadow-[0_4px_20px_rgba(139,92,246,0.04)] hover:shadow-[0_12px_28px_rgba(139,92,246,0.1)] transition-all flex flex-col justify-between relative overflow-hidden group">
            <div>
              {/* Top Row */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-purple-50">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shadow-2xs flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      B2
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">From B1 to B2</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                    ₹14,000
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-1">
                    (Total Course Fees)
                  </div>
                </div>
              </div>

              {/* Middle */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-5 pb-3">
                <div className="sm:col-span-7 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Express yourself clearly and in detail on a wide range of topics
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Develop advanced communication skills
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Refine grammar and vocabulary
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium leading-relaxed">
                      Interactive classes with expert guidance
                    </span>
                  </div>
                </div>

                {/* Right Landmark Arch: Eiffel Tower */}
                <div className="sm:col-span-5 flex items-center justify-center sm:justify-end">
                  <div className="w-28 sm:w-32 lg:w-36 h-auto flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <img
                      src="/courses-images/card-b2-arch.png"
                      alt="Eiffel Tower Paris"
                      className="w-full h-auto object-contain pointer-events-none drop-shadow-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-purple-50 flex items-center justify-between">
              <button
                onClick={() =>
                  openCourseModal({
                    title: 'German B2 Upper-Intermediate',
                    levelBadge: 'B2 Upper-Intermediate',
                    price: '₹14,000',
                    feeNote: 'Total Course Fee (Covering B2.1 & B2.2)',
                    themeColor: 'border-purple-200',
                    iconBg: 'bg-purple-50',
                    iconText: 'text-purple-700',
                    description:
                      'B2 is the golden standard for medical professionals (nurses, doctors), engineers, and corporate employees in Germany, Austria, and Switzerland. Taught in two comprehensive modules: B2.1 and B2.2.',
                    curriculum: [
                      'Part 1 (B2.1): Complex texts, abstract concepts, nuance in argumentation & debate',
                      'Part 2 (B2.2): Professional German, technical presentations & academic writing styles',
                      'Mastery of modal particles (doch, ja, mal), nominal style (Nominalstil), and advanced idioms',
                      'Comprehensive Telc B2 / Goethe B2 examination simulation and error analysis',
                    ],
                    schedule: 'Monday to Friday (1:30 Hours per session)',
                    duration: 'Approximately 60 Days (2 Months across B2.1 & B2.2)',
                    materials: [
                      'Advanced B2 Textbook, Audio & Grammar Drill Packs',
                      'Academic and technical reading supplements',
                      'Official B2 completion certificate',
                    ],
                    examTarget: 'Goethe-Zertifikat B2 / Telc Deutsch B2',
                  })
                }
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#EDE5FF] hover:bg-[#E3D6FF] text-[#6938D3] font-bold text-xs sm:text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <span>View Course Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/register"
                className="text-xs font-bold text-gray-500 hover:text-purple-700 transition-colors hidden sm:inline-block"
              >
                Book Free Trial →
              </Link>
            </div>
          </div>

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
          
          {/* Box 1: PDF */}
          <div className="bg-[#FFF0F2] border border-[#FFE0E4] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFE2E6] text-[#E02B3A] flex items-center justify-center mb-2.5">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">PDF Learning Material</h4>
            <p className="text-xs text-gray-500 font-medium">
              Comprehensive and easy to follow study material.
            </p>
          </div>

          {/* Box 2: Offline */}
          <div className="bg-[#F0F7FF] border border-[#D9EBFF] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#E0F0FE] text-[#1E75C8] flex items-center justify-center mb-2.5">
              <Headphones className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">Offline Practice</h4>
            <p className="text-xs text-gray-500 font-medium">
              Practice anytime, anywhere.
            </p>
          </div>

          {/* Box 3: Profile */}
          <div className="bg-[#FFFBEA] border border-[#FEF3C7] rounded-2xl p-5 text-center flex flex-col items-center justify-center shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF08A] text-[#B45309] flex items-center justify-center mb-2.5">
              <UserCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-gray-900 mb-1">Profile Stays Active</h4>
            <p className="text-xs text-gray-500 font-medium">
              Continue your learning progress anytime.
            </p>
          </div>

          {/* Box 4: Certificates */}
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

        {/* English Content Grid: Left Card + Right Big Ben Artwork */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
          
          {/* Card: Intermediate English (lg:col-span-7) */}
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
                        Intermediate English
                      </h3>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#EBF5FF] text-[#1351B4] border border-[#CEE3FD]">
                        Intermediate
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-2xl sm:text-[1.7rem] font-black text-gray-900 leading-none">
                    ₹450<span className="text-base font-bold text-gray-500">/mo</span>
                  </div>
                  <div className="text-[11px] text-gray-400 font-medium mt-1">
                    (Monthly Fees)
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-3 pt-5 pb-5">
                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1351B4] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                    Build advanced vocabulary and grammar
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1351B4] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                    Improve reading, writing, listening and speaking
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1351B4] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                    Real-life conversation practice
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-[#1351B4] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                    Interactive classes with expert guidance
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-blue-50 flex items-center justify-between">
              <button
                onClick={() =>
                  openCourseModal({
                    title: 'Intermediate Conversational English',
                    levelBadge: 'Intermediate (B1–B2)',
                    price: '₹450 / month',
                    feeNote: 'Affordable monthly subscription, cancel anytime',
                    themeColor: 'border-blue-200',
                    iconBg: 'bg-blue-50',
                    iconText: 'text-blue-700',
                    description:
                      'Designed for students and professionals looking to conquer hesitation, speak with natural fluency, polish pronunciation, and master formal email & presentation skills.',
                    curriculum: [
                      'Month 1: Conversational Fluency & Overcoming Hesitation in Spoken English',
                      'Month 2: Grammar in Action (Conditionals, idioms, active vs passive speaking)',
                      'Month 3: Professional English (Interviews, client calls, email drafting & debates)',
                      'Month 4: Accent Neutralization & Spontaneous Public Speaking',
                    ],
                    schedule: 'Monday to Friday (1:30 Hours per session)',
                    duration: '4 to 5 Months (Continuous mentor support)',
                    materials: [
                      'Digital practice worksheets & idiom decks',
                      'Daily conversation rooms with co-learners',
                      'Personalized feedback from certified trainers',
                    ],
                    examTarget: 'IELTS Speaking / TOEFL / Corporate Readiness',
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

          {/* Right Artwork: Big Ben with Note (lg:col-span-5) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] flex items-center justify-center">
              <img
                src="/courses-images/english-banner-ben.png"
                alt="Big Ben London with handwritten note: Better English, Bigger Opportunities"
                className="w-full h-auto object-contain select-none hover:scale-105 transition-transform duration-500 drop-shadow-md"
              />
            </div>
          </div>

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
