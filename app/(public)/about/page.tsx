'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Video,
  Globe2,
  Award,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ExternalLink,
  X,
  Quote,
  ShieldCheck,
  Eye,
} from 'lucide-react';

const stats = [
  {
    value: '10,000+',
    label: 'Active Learners',
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    value: '200+',
    label: 'Live Classes',
    icon: Video,
    color: 'bg-rose-50 text-rose-500',
  },
  {
    value: '5',
    label: 'Languages',
    icon: Globe2,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    value: '50+',
    label: 'Expert Teachers',
    icon: Award,
    color: 'bg-purple-50 text-purple-600',
  },
];

const timeline = [
  { year: '2022', title: 'BhashaSchool Established' },
  { year: '2023', title: 'Growing Community of Learners' },
  { year: '2024', title: 'More Languages & Live Classes' },
  { year: '2025', title: 'Expanding Global Opportunities' },
];

const values = [
  {
    title: 'Structured Learning',
    description:
      'A step-by-step path based on CEFR levels with clear goals and progress.',
    icon: BookOpen,
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    title: 'Community Learning',
    description:
      'Learn together with peers, teachers and mentors from around the world.',
    icon: Users,
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    title: 'Practical Skills',
    description:
      'Focus on real-life communication for studies, work and travel.',
    icon: Target,
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    title: 'Global Opportunities',
    description:
      'Build skills that open doors to education, career and a brighter future.',
    icon: Globe2,
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
];

const teachers = [
  {
    name: 'Anna Müller',
    role: 'Native German Teacher',
    country: 'Germany',
    flag: '🇩🇪',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
    bio: 'Helping learners build confidence in everyday conversations.',
  },
  {
    name: 'James Carter',
    role: 'English Language Coach',
    country: 'United Kingdom',
    flag: '🇬🇧',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
    bio: 'Focus on fluency, pronunciation and real-life communication.',
  },
  {
    name: 'Sophie Laurent',
    role: 'Native French Teacher',
    country: 'France',
    flag: '🇫🇷',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    bio: 'Making French simple, practical and enjoyable to learn.',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Native Spanish Teacher',
    country: 'Spain',
    flag: '🇪🇸',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop',
    bio: 'Learn Spanish through culture, conversation and real-world practice.',
  },
];

const certifications = [
  {
    id: 'iso',
    title: 'ISO 9001:2015 Certified',
    subtitle: 'Quality Management System',
    issuer: 'Accredited International Certification',
    badge: 'ISO 9001:2015',
    category: 'International Quality Standard',
    description:
      'Certified for maintaining international quality standards in language curriculum design, qualified native instruction, and continuous learner assessment.',
    highlights: [
      'Internationally Audited Standards',
      'Structured CEFR-Aligned Learning',
      'Quality & Student Satisfaction',
    ],
    file: '/about us/iso_certified_mqa.png',
  },
  {
    id: 'udyam',
    title: 'Udyam Registration',
    subtitle: 'Ministry of MSME, Govt. of India',
    issuer: 'Government of India',
    badge: 'Govt. of India',
    category: 'Government Recognized Entity',
    description:
      'Officially registered under the Ministry of Micro, Small and Medium Enterprises (MSME), Government of India, establishing full compliance and trust.',
    highlights: [
      'Govt. of India Recognized',
      'Ministry of MSME Compliant',
      'Trusted Educational Platform',
    ],
    file: '/about us/udhyam_registered.png',
  },
];

export default function AboutPage() {
  const [activeCert, setActiveCert] = useState<{
    title: string;
    file: string;
  } | null>(null);

  const [activeTeacherIndex, setActiveTeacherIndex] = useState(0);

  const handlePrevTeacher = () => {
    setActiveTeacherIndex((prev) => (prev > 0 ? prev - 1 : teachers.length - 1));
  };

  const handleNextTeacher = () => {
    setActiveTeacherIndex((prev) => (prev < teachers.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-gray-900 font-[Plus_Jakarta_Sans] overflow-x-hidden">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (Edge-to-Edge, No Rounded Corners, No Side Padding) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="relative w-full max-w-none px-0 pt-0 pb-6 sm:pb-10 overflow-hidden">
        
        {/* Desktop: Full-width uncut Hero Banner with text on left */}
        <div className="hidden lg:block relative w-full overflow-hidden bg-[#FDFBF7]">
          {/* Full uncut image spanning 100% full width edge-to-edge */}
          <img
            src="/about us/heroimage.png"
            alt="A More Connected World Through Languages"
            className="w-full h-auto block select-none"
          />

          {/* Left Text Overlay sitting on the left open area */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-8 xl:pl-12 2xl:pl-16 pr-4 max-w-[48%] pointer-events-none">
            <div className="space-y-4 xl:space-y-5 text-left pointer-events-auto">
              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-50/90 backdrop-blur-xs text-sky-700 border border-sky-100 shadow-2xs">
                About Us
              </span>

              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-black text-[#0B1528] leading-[1.12] tracking-tight">
                A More <br />
                Connected World <br />
                <span className="text-[#E67E22]">
                  Through Languages
                </span>
              </h1>

              <p className="text-xs xl:text-sm 2xl:text-base text-gray-600 leading-relaxed font-medium max-w-sm xl:max-w-md">
                Empowering learners worldwide with structured, practical language skills for global education, career, and travel.
              </p>

              <div className="pt-1">
                <a
                  href="#our-journey"
                  className="inline-flex items-center gap-2.5 px-6 xl:px-7 py-3 xl:py-3.5 rounded-full bg-[#0B1528] hover:bg-[#152542] text-white text-xs xl:text-sm font-bold shadow-md hover:shadow-xl transition-all hover:gap-3 cursor-pointer"
                >
                  <span>Our Story</span>
                  <ArrowRight className="w-4 h-4 text-[#E67E22]" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet: Stacked layout with heroimage-illustration.png */}
        <div className="lg:hidden w-full space-y-6 pt-6 pb-2">
          <div className="space-y-4 text-left px-4 sm:px-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
              About Us
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-[#0B1528] leading-[1.15] tracking-tight">
              A More Connected World <br />
              <span className="text-[#E67E22]">Through Languages</span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium max-w-lg">
              Empowering learners worldwide with structured, practical language skills for global education, career, and travel.
            </p>

            <div>
              <a
                href="#our-journey"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#0B1528] text-white text-xs font-bold shadow-md"
              >
                <span>Our Story</span>
                <ArrowRight className="w-4 h-4 text-[#E67E22]" />
              </a>
            </div>
          </div>

          {/* Full-width heroimage-illustration.png for mobile view: no round, no side padding */}
          <div className="w-full">
            <img
              src="/about us/heroimage-illustration.png"
              alt="A More Connected World Through Languages"
              className="w-full h-auto block select-none"
            />
          </div>
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. STATS BAR (4 Pillars)                                     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-4">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-7 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-3.5 ${
                  i !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. OUR JOURNEY SECTION                                       */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="our-journey" className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Timeline */}
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
              Our Journey
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight">
              Our Journey <span className="text-[#E67E22]">Since 2022</span>
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              BhashaSchool was born with a simple belief – language learning should
              be structured, practical and accessible to everyone. What started as
              a small initiative has now grown into a thriving community of learners,
              teachers and mentors from across the world.
            </p>

            {/* Vertical timeline items */}
            <div className="space-y-4 pt-2">
              {timeline.map((item, idx) => (
                <div key={item.year} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
                    ●
                  </div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-sm font-black text-gray-900">{item.year}</span>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Community Collage Card from public/about us/ourjourneyimage.png */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[560px] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow">
              <img
                src="/about us/ourjourneyimage.png"
                alt="Our Journey - Same Language More Opportunities"
                className="w-full h-auto object-contain select-none"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 4. MEET THE FOUNDER SECTION                                  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-10 sm:py-16">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Founder Photo Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-gray-100 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100/40 flex items-center justify-center">
                {/* Founder portrait from public/about us/someshfounder.png */}
                <img
                  src="/about us/someshfounder.png"
                  alt="Founder Somesh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xs text-white p-3 rounded-2xl text-center">
                  <p className="text-sm font-black">Somesh</p>
                  <p className="text-[10px] text-amber-300 font-semibold">Founder &amp; CEO</p>
                </div>
              </div>
            </div>

            {/* Right: Founder Details & Quote */}
            <div className="lg:col-span-7 space-y-5">
              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                Our Founder
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight">
                Meet <span className="text-[#E67E22]">Somesh</span>
              </h2>

              <p className="text-sm font-bold text-gray-700">
                Founder &amp; CEO, BhashaSchool
              </p>

              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                Somesh founded BhashaSchool with a vision to make high-quality language
                learning accessible to everyone. His mission is to create a global platform
                where learners can gain real skills, connect with a supportive community and
                unlock new opportunities through languages.
              </p>

              {/* Founder Quote Card */}
              <div className="rounded-2xl bg-[#FFF8EC] border border-[#FDE68A] p-5 sm:p-6 space-y-3 relative">
                <Quote className="w-8 h-8 text-amber-400 opacity-60" />
                <p className="text-sm sm:text-base font-bold text-gray-800 italic leading-relaxed">
                  &ldquo;Languages open doors. At BhashaSchool, we don&apos;t just teach languages,
                  we help you use them to build a brighter future.&rdquo;
                </p>
                <div className="text-right pt-1">
                  <p className="text-xs font-black text-gray-900">— Somesh</p>
                  <p className="text-[11px] text-gray-500 font-medium">Founder, BhashaSchool</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 5. WHAT WE BELIEVE IN (Our Values)                           */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-14 sm:py-18">
        <div className="space-y-3 mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
            Our Values
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight">
            What We Believe In
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="bg-white rounded-3xl border border-gray-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${val.iconBg}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-gray-900">{val.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 6. LEARN FROM EXPERT TEACHERS                                */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-14 sm:py-18">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-2.5 max-w-xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-100">
              Our Teachers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight">
              Learn from <span className="text-blue-600">Expert Teachers</span>
            </h2>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-4 max-w-lg">
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
              Our teachers are native speakers and experienced language experts who
              make learning interactive, practical and enjoyable. They guide you at
              every step — from building confidence to achieving advanced fluency.
            </p>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handlePrevTeacher}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                aria-label="Previous teacher"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextTeacher}
                className="w-9 h-9 rounded-full bg-white border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-2xs cursor-pointer"
                aria-label="Next teacher"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Teacher Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {teachers.map((teacher) => (
            <div
              key={teacher.name}
              className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Photo Area */}
              <div className="h-44 sm:h-48 w-full bg-gray-100 overflow-hidden relative">
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Bio & Details */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{teacher.flag}</span>
                  <div>
                    <h3 className="text-sm font-black text-gray-900 leading-tight">
                      {teacher.name}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-500">
                      {teacher.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {teacher.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 7. MORE CONNECTED WORLD SECTION                              */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-6 sm:py-8">
        <div className="bg-[#0B1528] rounded-3xl p-5 sm:p-6 lg:p-7 text-white shadow-xl relative overflow-hidden">
          
          {/* Subtle cosmic glow background */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* Left Column: Full World Image fitting section height */}
            <div className="lg:col-span-6 flex justify-center items-center">
              <div className="w-full flex items-center justify-center">
                <img
                  src="/about us/world image.png"
                  alt="A More Connected World Through Languages"
                  className="w-full h-auto max-h-[320px] lg:max-h-[360px] object-contain select-none block"
                />
              </div>
            </div>

            {/* Right Column: Compact Mission Content */}
            <div className="lg:col-span-6 space-y-3.5 text-left">
              <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-amber-300 border border-white/20">
                Our Mission
              </span>

              <h2 className="text-xl sm:text-2xl lg:text-[1.75rem] font-black text-white leading-tight tracking-tight">
                A More Connected World <br />
                <span className="text-[#FBBF24]">Through Languages</span>
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                Our mission is to make language learning structured, practical and accessible
                to everyone, creating a global community where learners can confidently use
                their language skills in education, career and life.
              </p>

              {/* 4 Pillars / Badges (Compact) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] font-bold text-gray-200">Education Abroad</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                  <Globe2 className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-[11px] font-bold text-gray-200">Global Friendships</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[11px] font-bold text-gray-200">Better Career</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                  <Users className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-[11px] font-bold text-gray-200">Explore the World</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 8. CERTIFICATIONS & REGISTRATIONS (Our Recognitions)         */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-12 sm:py-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
              Official Certifications &amp; Accreditations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight">
              Our <span className="text-[#E67E22]">Recognitions</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              BhashaSchool operates with recognized quality standards and official registrations,
              ensuring a fully trusted, compliant, and world-class learning experience for all learners.
            </p>
          </div>

          {/* Quick trust metrics */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-white border border-gray-200/80 rounded-2xl px-4 py-2.5 shadow-2xs self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Verified Official Documentation</span>
          </div>
        </div>

        {/* 2 Certificate Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border border-gray-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className="p-6 sm:p-7 border-b border-gray-100 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                        {cert.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100/80 text-emerald-800">
                        Verified ✓
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      {cert.subtitle} • {cert.category}
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase bg-gray-100 text-gray-600 shrink-0">
                  {cert.badge}
                </span>
              </div>

              {/* Prominent Certificate Preview Window */}
              <div className="p-6 sm:p-7 bg-gradient-to-b from-[#FAF8F5] to-white flex flex-col items-center justify-center">
                <div
                  onClick={() => setActiveCert(cert)}
                  className="relative w-full max-w-[340px] aspect-[3/4] bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl p-3 flex items-center justify-center cursor-pointer group transition-all"
                  title="Click to view full certificate"
                >
                  <img
                    src={cert.file}
                    alt={cert.title}
                    className="w-full h-full object-contain rounded-lg group-hover:scale-[1.02] transition-transform"
                  />

                  {/* Hover Overlay with Inspect Button */}
                  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs backdrop-blur-2xs">
                    <Eye className="w-4 h-4 text-white" />
                    <span>Click to Inspect Certificate</span>
                  </div>

                  {/* Corner Ribbon */}
                  <div className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Official Document</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Description, Highlights & CTAs */}
              <div className="p-6 sm:p-7 space-y-4 border-t border-gray-100 bg-white">
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {cert.description}
                </p>

                {/* Highlights List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {cert.highlights.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] font-bold text-gray-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveCert(cert)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B1528] hover:bg-[#152542] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Full Certificate</span>
                  </button>

                  <a
                    href={cert.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Open Original</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 9. READY TO START YOUR LANGUAGE JOURNEY? (Bottom Banner)    */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-10 sm:py-16">
        <div className="bg-gradient-to-r from-[#FFF5EA] via-[#FFF1E0] to-[#FFE8D1] rounded-3xl p-8 sm:p-12 border border-[#FED7AA]/70 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xs">
          
          {/* Left Text */}
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1528] tracking-tight">
              Ready to Start Your{' '}
              <span className="text-[#E67E22]">Language Journey?</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Join thousands of learners who are already building new opportunities with BhashaSchool.
            </p>
          </div>

          {/* Center Paper Airplane Illustration */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative">
              <svg
                width="160"
                height="60"
                viewBox="0 0 160 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 40 Q 60 10, 110 35 T 140 20"
                  stroke="#E67E22"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              <span className="absolute -top-1 -right-2 text-2xl rotate-12">✈️</span>
            </div>
          </div>

          {/* Right CTA Button */}
          <div className="shrink-0">
            <Link
              href="/classes"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#0B1528] hover:bg-[#152542] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-4 h-4 text-[#E67E22]" />
            </Link>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* CERTIFICATE MODAL / LIGHTBOX                                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      {activeCert && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900">{activeCert.title}</h3>
                <p className="text-xs text-gray-500">Official verified documentation</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveCert(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={activeCert.file}
                alt={activeCert.title}
                className="w-full max-h-[65vh] object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-gray-400 font-medium">BhashaSchool Verified Certificate</span>
              <a
                href={activeCert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
