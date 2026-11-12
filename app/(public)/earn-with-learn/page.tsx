import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  GraduationCap,
  Users,
  Coins,
  Calendar,
  Gift,
  ChevronsRight,
  Globe,
  Target,
  Clock,
  Star,
  BookOpen,
  TrendingUp,
  Megaphone,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { getMergedKeywords } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Earn with Learn — German B1 Mentor Payback Policy (25% Refund) | BhashaSchool',
  description:
    'Turn your German language learning into an opportunity with BhashaSchool Earn with Learn. From B1 level onwards, become a Learner-Mentor, take 3 classes per week (1 hr 30 mins each), and get 25% of your A1, A2, and B1 fees refunded.',
  keywords: getMergedKeywords([
    'Earn with Learn BhashaSchool',
    'BhashaSchool payback policy',
    'German language fee refund program India',
    'B1 German mentor program',
    'learn German and earn India',
    'A1 A2 B1 German fee cashback',
    'German peer mentoring online India',
    'BhashaSchool B1 mentor payback',
    'online German classes with refund',
  ]),
  alternates: {
    canonical: 'https://bhashaschool.com/earn-with-learn',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  openGraph: {
    title: 'Earn with Learn — Get 25% German Fee Refund as a B1 Mentor | BhashaSchool',
    description:
      'From German B1 level onwards, mentor fellow learners for 3 classes/week (1.5 hrs/class) throughout B1 and receive a 25% refund on your A1 + A2 + B1 course fees.',
    url: 'https://bhashaschool.com/earn-with-learn',
    siteName: 'BhashaSchool',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/earn-with-learn-hero.jpg',
        width: 1376,
        height: 768,
        alt: 'BhashaSchool Earn with Learn B1 German Learner-Mentor Program',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Earn with Learn — 25% Fee Payback Policy for German Learners | BhashaSchool',
    description:
      'Reach German B1 level, mentor 3 classes/week (1:30 hrs each), and earn 25% of your A1 + A2 + B1 fees back at BhashaSchool.',
    images: ['/earn-with-learn-hero.jpg'],
  },
};

const steps = [
  {
    step: 1,
    title: 'Reach B1 Level',
    description: 'Complete your learning journey up to B1 level.',
    icon: GraduationCap,
    iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    step: 2,
    title: 'Take Classes',
    description: 'Conduct 3 classes per week, each of 1 hour 30 minutes (1:30 hours).',
    icon: Calendar,
    iconBg: 'bg-purple-50 text-purple-600 border-purple-100',
  },
  {
    step: 3,
    title: 'Continue as Mentor',
    description: 'Keep taking classes regularly throughout your B1 level.',
    icon: Users,
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
  },
  {
    step: 4,
    title: 'Get Your Refund',
    description: (
      <>
        Once you complete all required classes,{' '}
        <strong className="font-bold text-[#D97706]">25% of your A1 + A2 + B1 fees</strong> will be
        refunded to you.
      </>
    ),
    plainDescription:
      'Once you complete all required classes, 25% of your A1 + A2 + B1 fees will be refunded to you.',
    icon: Gift,
    iconBg: 'bg-orange-50 text-orange-600 border-orange-100',
  },
];

const glanceRows = [
  {
    label: 'Applicable Language',
    value: 'German (only)',
    isGerman: true,
    icon: Globe,
    iconColor: 'text-blue-600',
  },
  {
    label: 'Eligible From',
    value: 'B1 Level',
    icon: Target,
    iconColor: 'text-sky-600',
  },
  {
    label: 'Class Requirement',
    value: '3 classes per week',
    icon: Calendar,
    iconColor: 'text-indigo-600',
  },
  {
    label: 'Class Duration',
    value: '1 hour 30 minutes (per class)',
    icon: Clock,
    iconColor: 'text-blue-600',
  },
  {
    label: 'Mentor Period',
    value: 'Throughout your B1 level',
    icon: Users,
    iconColor: 'text-sky-700',
  },
  {
    label: 'Refund Amount',
    value: '25% of A1 + A2 + B1 fees',
    isBadge: true,
    icon: Coins,
    iconColor: 'text-blue-600',
  },
];

const benefits = [
  {
    title: 'Get 25% Fee Refund',
    icon: Coins,
    color: 'text-amber-500',
    bg: 'bg-amber-50 border-amber-100',
    subtitle: 'Receive direct cashback on your A1, A2, and B1 German tuition.',
  },
  {
    title: 'Build Teaching Skills',
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-100',
    subtitle: 'Reinforce your grammar and speaking fluency by teaching A1–A2 concepts.',
  },
  {
    title: 'Gain Real Experience',
    icon: TrendingUp,
    color: 'text-orange-500',
    bg: 'bg-orange-50 border-orange-100',
    subtitle: 'Develop mentorship confidence helpful for Ausbildung & careers in Germany.',
  },
];

const faqs = [
  {
    question: 'What is the BhashaSchool Earn with Learn Payback Policy?',
    answer:
      'Earn with Learn is BhashaSchool’s German language payback policy where learners who reach CEFR B1 level can become a Learner–Mentor. By conducting 3 live mentoring classes per week (1 hour 30 minutes each) throughout their B1 level, students receive a 25% fee refund on their combined A1, A2, and B1 German course fees.',
  },
  {
    question: 'Who is eligible to join the Earn with Learn program?',
    answer:
      'Any German language student at BhashaSchool who completes A1 and A2 levels and progresses to the B1 level is eligible to become a Learner–Mentor. The program is open to online learners across India and globally.',
  },
  {
    question: 'How is the 25% fee refund calculated?',
    answer:
      'The refund equals 25% of the total tuition fees you paid for German Level A1, Level A2, and Level B1 combined. The payback is issued once you successfully complete all required mentoring sessions throughout your B1 duration.',
  },
  {
    question: 'What is the weekly class schedule for a B1 Learner–Mentor?',
    answer:
      'A B1 Learner–Mentor conducts 3 classes per week, with each class lasting 1 hour 30 minutes (90 minutes), consistently throughout their B1 course period.',
  },
  {
    question: 'Is Earn with Learn available for English or Spanish courses?',
    answer:
      'No. Currently, the Earn with Learn 25% Payback Policy is available exclusively for German language students at BhashaSchool.',
  },
  {
    question: 'How does mentoring help students preparing for Germany or Ausbildung?',
    answer:
      'Teaching foundational German reinforces grammar mastery, builds spoken confidence, and develops leadership and communication experience that stands out in Goethe exam preparation, Ausbildung interviews, and global careers.',
  },
];

function GermanFlagIcon({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <span
      className={`inline-flex flex-col overflow-hidden rounded-[2px] border border-black/10 shrink-0 ${className}`}
      aria-hidden="true"
    >
      <span className="h-1/3 w-full bg-[#111827]" />
      <span className="h-1/3 w-full bg-[#DC2626]" />
      <span className="h-1/3 w-full bg-[#FACC15]" />
    </span>
  );
}

export default function EarnWithLearnPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://bhashaschool.com/earn-with-learn#webpage',
        url: 'https://bhashaschool.com/earn-with-learn',
        name: 'Earn with Learn — German B1 Mentor Payback Policy (25% Fee Refund) | BhashaSchool',
        description:
          'Become a B1 German Learner–Mentor at BhashaSchool, conduct 3 classes per week (1:30 hours each) throughout B1 level, and get 25% of your A1, A2, and B1 fees refunded.',
        inLanguage: 'en-IN',
        isPartOf: {
          '@type': 'WebSite',
          name: 'BhashaSchool',
          url: 'https://bhashaschool.com',
        },
        about: {
          '@type': 'Thing',
          name: 'German Language Payback Policy & Peer Mentoring Program',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://bhashaschool.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Earn with Learn',
            item: 'https://bhashaschool.com/earn-with-learn',
          },
        ],
      },
      {
        '@type': 'EducationalOccupationalProgram',
        name: 'BhashaSchool Earn with Learn — German B1 Learner–Mentor Program',
        description:
          'Online peer-mentoring payback policy for German language students in India and worldwide. Reach B1 level, conduct 3 mentoring classes per week (1 hour 30 minutes per class) throughout B1, and receive a 25% refund on A1 + A2 + B1 course fees.',
        provider: {
          '@type': 'EducationalOrganization',
          name: 'BhashaSchool',
          url: 'https://bhashaschool.com',
          areaServed: [
            { '@type': 'Country', name: 'India' },
            { '@type': 'Country', name: 'Germany' },
            { '@type': 'Place', name: 'Worldwide (Online)' },
          ],
        },
        programPrerequisites: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'CEFR B1 German Proficiency Level',
        },
        occupationalCategory: 'German Language Peer Mentor',
        timeOfDay: 'Flexible Live Cohort Slots',
        educationalProgramMode: 'Online',
        offers: {
          '@type': 'Offer',
          name: '25% Tuition Fee Payback on A1 + A2 + B1 German Courses',
          description:
            '25% of combined A1, A2, and B1 German course fees refunded upon completing required weekly B1 mentoring classes.',
          availability: 'https://schema.org/InStock',
          eligibleRegion: 'IN',
        },
      },
      {
        '@type': 'HowTo',
        name: 'How BhashaSchool Earn with Learn (25% Fee Refund) Works',
        description:
          'Follow 4 steps to earn a 25% fee refund on your German A1, A2, and B1 courses by mentoring at BhashaSchool.',
        step: steps.map((s) => ({
          '@type': 'HowToStep',
          position: s.step,
          name: s.title,
          text: typeof s.description === 'string' ? s.description : s.plainDescription,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-[#0F172A] font-[Plus_Jakarta_Sans]">
      {/* Structured Data for SEO, AEO & GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION                                                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ECF3FF] via-[#F6F9FF] to-[#FFF9F2] border-b border-slate-200/70">
        {/* Subtle decorative ambient blobs */}
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200/30 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 right-1/3 w-80 h-80 rounded-full bg-amber-200/25 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 lg:py-16">
          {/* Breadcrumb for SEO */}
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1D4ED8] font-bold">Earn with Learn</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* LEFT COLUMN: Headline, Copy & 3 Pillars */}
            <div className="lg:col-span-5 space-y-6">
              {/* Language Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-xs text-xs sm:text-sm font-bold text-[#1E3A8A]">
                <GermanFlagIcon className="w-5 h-3.5" />
                <span>Payback Policy – German Language</span>
              </div>

              {/* H1 Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[5.2rem] font-black tracking-tight text-[#0F172A] leading-[1.08]">
                Earn with{' '}
                <span className="relative inline-block text-[#F59E0B]">
                  Learn
                  {/* Curved swoosh underline matching design */}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-3 text-[#F59E0B]"
                    viewBox="0 0 180 14"
                    fill="none"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 10.5C48 3 128 2 177 8.5"
                      stroke="currentColor"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium max-w-xl">
                Turn your learning into an opportunity! From{' '}
                <strong className="font-extrabold text-[#0F172A]">B1 level onwards</strong>, become a{' '}
                <strong className="font-extrabold text-[#0F172A]">Learner–Mentor</strong>, take classes, and
                get <strong className="font-extrabold text-[#D97706]">25% of your A1, A2 and B1 fees back.</strong>
              </p>

              {/* 3 Mini Feature Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="flex items-center gap-3 bg-white/85 backdrop-blur-xs rounded-2xl p-3 border border-slate-200/70 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">Learn &amp; Teach</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">Grow your skills</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/85 backdrop-blur-xs rounded-2xl p-3 border border-slate-200/70 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-200/80 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">Mentor Others</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">Support new learners</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/85 backdrop-blur-xs rounded-2xl p-3 border border-slate-200/70 shadow-2xs">
                  <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-200/80 flex items-center justify-center shrink-0">
                    <Coins className="w-5 h-5 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">Get 25% Refund</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">On A1 + A2 + B1 fees</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: B1 Mentor Hero Illustration */}
            <div className="lg:col-span-7 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/70 bg-white">
                <img
                  src="/earn-with-learn-hero.jpg"
                  alt="BhashaSchool B1 Mentor conducting 3 classes per week of 1:30 hours each to earn 25% fee refund on A1, A2 and B1 German courses"
                  className="w-full h-auto block object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MAIN CONTENT WRAPPER                                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 space-y-8">
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. HOW IT WORKS? (4 Connected Cards)                              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby="how-it-works-heading" className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-7 rounded-full bg-[#F59E0B] inline-block" aria-hidden="true" />
            <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              How It Works?
            </h2>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 relative">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <li key={item.step} className="relative flex">
                  <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-5 flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${item.iconBg}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-slate-900 leading-snug">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Double chevron arrow connector on desktop */}
                  {idx < steps.length - 1 && (
                    <div
                      className="hidden lg:flex items-center justify-center absolute -right-5 top-1/2 -translate-y-1/2 z-10 text-amber-400"
                      aria-hidden="true"
                    >
                      <ChevronsRight className="w-6 h-6" />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. PROGRAM AT A GLANCE & BENEFITS FOR YOU (2 Columns)             */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Program at a Glance */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-4 mb-2 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Program at a Glance
                </h2>
              </div>

              {/* Clean <dl> key-value summary for AEO & AI Featured Snippets */}
              <dl className="divide-y divide-slate-100">
                {glanceRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className="py-3.5 grid grid-cols-12 items-center gap-2 text-xs sm:text-sm"
                    >
                      <dt className="col-span-5 sm:col-span-5 flex items-center gap-2.5 font-semibold text-slate-600">
                        <Icon className={`w-4 h-4 shrink-0 ${row.iconColor}`} />
                        <span>{row.label}</span>
                      </dt>
                      <dd className="col-span-7 sm:col-span-7 font-bold text-slate-900 flex items-center gap-2">
                        {row.isGerman && <GermanFlagIcon className="w-5 h-3.5" />}
                        {row.isBadge ? (
                          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100/90 border border-amber-200 text-[#B45309] font-black text-xs sm:text-sm">
                            {row.value}
                          </span>
                        ) : (
                          <span>{row.value}</span>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          </div>

          {/* Right: Benefits for You */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 pb-4 mb-5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Benefits for You
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={benefit.title}
                      className="rounded-2xl bg-slate-50/70 border border-slate-200/70 p-5 flex flex-col items-center text-center space-y-3 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${benefit.bg}`}
                      >
                        <Icon className={`w-7 h-7 ${benefit.color}`} />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                        {benefit.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {benefit.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtle reinforcement strip */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Ideal for German A1–B1 learners preparing for Ausbildung &amp; careers</span>
              </span>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. IMPORTANT NOTE & CTA BAR                                       */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section
          aria-label="Important Notice and Enrollment Call to Action"
          className="bg-gradient-to-r from-[#EEF4FF] via-[#F4F8FF] to-[#EEF4FF] rounded-3xl border border-blue-200/80 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-center md:text-left">
            <div className="flex items-center gap-2 text-[#1E3A8A] font-black text-sm sm:text-base">
              <Megaphone className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Important Note</span>
            </div>
            <span className="hidden md:inline-block text-slate-300 font-light">|</span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              This payback program is currently available for{' '}
              <strong className="font-extrabold text-slate-900">German language only.</strong>
            </p>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#EA580C] hover:from-[#D97706] hover:to-[#C2410C] text-white text-xs sm:text-sm font-black shadow-md shadow-amber-500/25 hover:shadow-lg transition-all whitespace-nowrap shrink-0 cursor-pointer group"
          >
            <span>Start Your B1 Journey</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. AEO & GEO DIRECT ANSWERS + FREQUENTLY ASKED QUESTIONS          */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section aria-labelledby="faq-heading" className="pt-4 space-y-6">
          {/* Concise Direct Answer Card for Generative AI & Answer Engines */}
          <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-black uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payback Policy Summary</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              About BhashaSchool&apos;s German Earn with Learn Program
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              BhashaSchool&apos;s <strong>Earn with Learn</strong> policy rewards dedicated German
              language learners across India and worldwide. Upon reaching CEFR <strong>B1 level</strong>,
              enrolled students can become a <strong>Learner–Mentor</strong> by conducting{' '}
              <strong>3 live classes per week</strong> (each lasting <strong>1 hour 30 minutes</strong>)
              throughout their B1 phase. Upon successful completion, BhashaSchool refunds{' '}
              <strong>25% of the student&apos;s combined A1, A2, and B1 course fees</strong> while
              helping them build real teaching and German communication experience.
            </p>
          </article>

          {/* FAQs Grid matching FAQPage JSON-LD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-blue-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 id="faq-heading" className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Clear answers about eligibility, mentoring schedule, and the 25% fee refund
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-2xl bg-slate-50/60 border border-slate-200/80 p-5 space-y-2"
                >
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
