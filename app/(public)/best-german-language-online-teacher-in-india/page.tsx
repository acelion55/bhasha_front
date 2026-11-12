import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  Globe2,
  GraduationCap,
  Award,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Users,
  Compass,
  CheckCircle2,
  Quote,
  MapPin,
  Calendar,
  Briefcase,
  Plane,
  HeartHandshake,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { getMergedKeywords } from '@/lib/seo-keywords';

export const metadata: Metadata = {
  title: 'Best German Language Online Teacher in India | Pawan Verma (Founder, BhashaSchool)',
  description:
    'Meet Pawan Verma, celebrated as one of the best German language online teachers in India and founder of BhashaSchool. Trained 200+ students now living and working across Germany in nursing, baking, sales, and multinational companies. Learn German with proven conversational mastery and structured CEFR guidance.',
  keywords: getMergedKeywords([
    'best german language online teacher in india',
    'best german teacher in india',
    'best german online teacher in india',
    'pawan verma german teacher',
    'pawan verma bhashaschool',
    'german language trainer online india',
    'top german teacher india',
    'learn german from scratch india',
    'professional german language teacher india',
    'best online german classes india',
    'bhashaschool founder story',
    'german language mentor india',
  ]),
  openGraph: {
    title: 'Best German Language Online Teacher in India | Pawan Verma',
    description:
      'My Journey into the World of Languages — From the City of the Taj Mahal to training 200+ students working in Germany. Discover the story and teaching philosophy of Pawan Verma, Founder of BhashaSchool.',
    url: 'https://bhashaschool.com/best-german-language-online-teacher-in-india',
    type: 'profile',
    images: [
      {
        url: '/about us/someshfounder.png',
        width: 800,
        height: 1000,
        alt: 'Pawan Verma - Best German Language Online Teacher in India',
      },
    ],
  },
  alternates: {
    canonical: 'https://bhashaschool.com/best-german-language-online-teacher-in-india',
  },
};

export default function FounderStoryPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Pawan Verma',
    jobTitle: 'Founder, CEO & Lead German Language Trainer',
    worksFor: {
      '@type': 'EducationalOrganization',
      name: 'BhashaSchool',
      url: 'https://bhashaschool.com',
    },
    homeLocation: 'Agra, Uttar Pradesh, India',
    description:
      'German language educator and founder of BhashaSchool, recognized as one of the best German language online teachers in India, having trained 200+ students for careers and studies in Germany.',
    knowsLanguage: ['German', 'English', 'Hindi'],
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1B2533] font-[Plus_Jakarta_Sans] selection:bg-amber-100 selection:text-amber-900">
      {/* Schema.org Person JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMBS & TOP NAV STRIP
      ────────────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200/80 bg-white/70 backdrop-blur-xs sticky top-0 z-30">
        <div className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-3.5 flex items-center justify-between text-xs font-semibold text-gray-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 overflow-x-auto">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <Link href="/about" className="hover:text-gray-900 transition-colors">
              About Us
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-[#E67E22] font-bold truncate">Pawan Verma (Founder Story)</span>
          </nav>

          <Link
            href="/about"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#0B1528] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>Back to About Us</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO SECTION: MY JOURNEY INTO THE WORLD OF LANGUAGES
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-12 sm:pb-16 border-b border-[#EAE5DE]/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F5F1E9]">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 rounded-full bg-sky-100/40 blur-3xl pointer-events-none" />

        <div className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-black uppercase tracking-wider shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Founder Story • Lead German Trainer</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-[#0B1528] tracking-tight leading-[1.12]">
                My Journey into the <br />
                <span className="text-[#E67E22]">World of Languages</span>
              </h1>

              {/* Byline / Intro */}
              <p className="text-base sm:text-lg text-gray-700 font-semibold leading-snug">
                By <span className="text-[#0B1528] font-black">Pawan Verma</span> — Founder &amp; CEO, BhashaSchool
              </p>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium max-w-2xl">
                From the City of the Taj Mahal to mentoring over 200+ students currently working and living across
                Germany. Read the true story behind BhashaSchool and my revolutionary philosophy: that prior English knowledge
                should never be a barrier to learning a foreign language.
              </p>

              {/* Key Trust Stats Pill Bar */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                  <div className="text-lg sm:text-xl font-black text-gray-900">10+ Yrs</div>
                  <div className="text-[11px] font-bold text-gray-500">Teaching Experience</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                  <div className="text-lg sm:text-xl font-black text-[#E67E22]">200+</div>
                  <div className="text-[11px] font-bold text-gray-500">Students in Germany</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                  <div className="text-lg sm:text-xl font-black text-emerald-600">CEFR</div>
                  <div className="text-[11px] font-bold text-gray-500">Methodology</div>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-200/90 shadow-2xs">
                  <div className="text-lg sm:text-xl font-black text-sky-700">ISO 9001</div>
                  <div className="text-[11px] font-bold text-gray-500">Certified Platform</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/classes"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#0B1528] hover:bg-[#152542] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-xl transition-all cursor-pointer group"
                >
                  <span>Learn German with Pawan</span>
                  <ArrowRight className="w-4 h-4 text-[#E67E22] group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#story"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200/90 text-xs sm:text-sm font-bold transition-all shadow-2xs"
                >
                  <span>Read Full Story</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Right Column: Founder Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-amber-50 to-orange-100 group">
                <img
                  src="/about us/someshfounder.png"
                  alt="Pawan Verma - Best German Language Online Teacher in India"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Ambient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Floating Stamp */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-lg border border-amber-200/80 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-gray-900 tracking-wider">Verified Educator</p>
                    <p className="text-[9px] font-bold text-emerald-700">Lead German Trainer</p>
                  </div>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white">Pawan Verma</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950">
                      Founder &amp; CEO
                    </span>
                  </div>
                  <p className="text-xs text-amber-200 font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Agra, India • City of the Taj Mahal</span>
                  </p>
                  <p className="text-[11px] text-gray-300 font-medium pt-1">
                    German Language Trainer (2022–Present) • 200+ Global Alumni
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FULL ESSAY & NARRATIVE (My Journey into the World of Languages)
      ────────────────────────────────────────────────────────────── */}
      <section id="story" className="w-full max-w-none px-3 sm:px-5 md:px-8 lg:px-10 py-12 sm:py-16 space-y-10">
        
        {/* Intro Chapter: Agra */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm shrink-0">
              01
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B1528] tracking-tight">
                Growing Up in Agra: The City of the Taj Mahal
              </h2>
              <p className="text-xs text-gray-500 font-medium">Roots, Culture, and the Spark of Global Curiosity</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-semibold">
            &ldquo;My name is <span className="text-[#0B1528] font-black">Pawan Verma</span>, and I come from Agra,
            famously known as <span className="text-[#E67E22] font-black">The City of the Taj Mahal</span>—a city that
            welcomes visitors from all corners of the world who come to admire the timeless beauty of this magnificent monument.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            Growing up in Agra meant being surrounded by different languages, cultures, and people from diverse backgrounds.
            With tourism being an integral part of the city&apos;s identity, foreign languages have always been a familiar part of everyday life.
            From multilingual tour guides and travel agents to professionals working in various other sectors, I grew up in an environment
            where communicating across languages and cultures was a natural part of life.
          </p>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            This multicultural atmosphere gradually inspired my deep interest in learning foreign languages.
          </p>
        </div>

        {/* Chapter 2: The English Mentorship Years */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm shrink-0">
              02
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B1528] tracking-tight">
                The English Mentorship Years (2011 – 2015)
              </h2>
              <p className="text-xs text-gray-500 font-medium">Learning to Teach, Mentoring Learners in Agra</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            My journey began shortly after completing my schooling. I started by learning English, and what initially began
            as a learning experience soon turned into a professional passion.
          </p>

          <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-100/90 text-blue-950 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-800">
              <Calendar className="w-4 h-4" />
              <span>2011 – 2015 Experience</span>
            </div>
            <p className="text-sm leading-relaxed font-semibold">
              At the same institute where I had studied, I got the opportunity to become an English language mentor.
              Within a year, I progressed to the role of an English language trainer, a profession I pursued from 2011 to 2015.
            </p>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            During these five years, I taught English at various institutions across Agra, gaining invaluable experience
            in teaching, mentoring, and understanding the real learning needs, apprehensions, and aspirations of students.
          </p>
        </div>

        {/* Chapter 3: Discovering German (2016) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
              03
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B1528] tracking-tight">
                Exploring European Linguistics &amp; Discovering German (2016)
              </h2>
              <p className="text-xs text-gray-500 font-medium">Venturing into German Language Immersion</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            With time, I felt the desire to explore new languages and take my career further in the field of linguistics.
            This curiosity led me to <strong className="text-gray-900 font-bold">German</strong>, my second foreign language,
            which I began learning in <strong className="text-emerald-700 font-black">2016</strong>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-gray-900">German Language Immersion</h4>
                <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                  Immersed in standardized CEFR methodologies, native phonetics, and German pedagogical frameworks.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-start gap-3">
              <Compass className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-gray-900">Linguistic Philosophy</h4>
                <p className="text-[11px] text-gray-600 font-medium mt-0.5">
                  Deeply studying how Germanic languages construct logic, thought, and expressions independently from English.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 4: Becoming a German Trainer & 200+ Global Students */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm shrink-0">
              04
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B1528] tracking-tight">
                Stepping into the German Trainer Role (2022 – Present)
              </h2>
              <p className="text-xs text-gray-500 font-medium">Empowering 200+ Careers in Germany &amp; Global MNCs</p>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            After developing strong proficiency in German, I eventually stepped into the role of a German language trainer in 2022.
            Since then, I have trained <strong className="text-[#0B1528] font-black">more than 200 students</strong> through online classes.
          </p>

          {/* Student Careers in Germany Cards */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500">
              Where Pawan&apos;s Students Are Thriving Today
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200 text-left space-y-1">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  🏥
                </div>
                <h4 className="text-xs font-black text-gray-900">Healthcare &amp; Nursing</h4>
                <p className="text-[10px] text-gray-500 font-medium">Working in German hospitals &amp; care facilities.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200 text-left space-y-1">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  🥐
                </div>
                <h4 className="text-xs font-black text-gray-900">Baking &amp; Gastronomy</h4>
                <p className="text-[10px] text-gray-500 font-medium">Culinary &amp; bakery apprenticeships across Germany.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200 text-left space-y-1">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  💼
                </div>
                <h4 className="text-xs font-black text-gray-900">International Sales</h4>
                <p className="text-[10px] text-gray-500 font-medium">Business development &amp; client relations in DACH.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-200 text-left space-y-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  🏢
                </div>
                <h4 className="text-xs font-black text-gray-900">Indian MNCs</h4>
                <p className="text-[10px] text-gray-500 font-medium">Working with top European multinational firms in India.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter 5: The Teaching Philosophy: "English is NOT a Prerequisite" */}
        <div className="bg-gradient-to-br from-[#0B1528] via-[#10203B] to-[#152542] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6 relative overflow-hidden">
          {/* Subtle cosmic glow */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <span className="w-9 h-9 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-black text-sm shrink-0">
              05
            </span>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">The Core Philosophy</span>
              <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                English is NOT a Prerequisite for German
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal relative z-10">
            Throughout my journey as a language learner and educator, I have developed a deeper understanding
            of how languages function and how people acquire them. One important realization has shaped my entire teaching philosophy:
          </p>

          {/* Pull Quote Card */}
          <div className="rounded-2xl bg-white/5 border border-amber-400/30 p-5 sm:p-6 space-y-3 relative z-10 backdrop-blur-xs">
            <Quote className="w-8 h-8 text-amber-400 opacity-70" />
            <blockquote className="text-base sm:text-xl font-black text-amber-100 italic leading-relaxed">
              &ldquo;Every language has its own grammatical structure, expressions, rhythm, and way of communicating.
              Learning a new language should therefore be an independent journey rather than an attempt to translate
              or reproduce the structure of another language.&rdquo;
            </blockquote>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-amber-200 text-sm sm:text-base font-bold leading-relaxed relative z-10">
            &ldquo;I strongly believe that prior knowledge of English should not be considered a prerequisite for learning
            a European or Asian language. Every language deserves to be learned through its own structure, logic, and cultural context.&rdquo;
          </div>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal relative z-10">
            For me, language learning is much more than memorising vocabulary or understanding grammar.
            It is about developing the ability to <strong className="text-white font-bold">communicate, connect with people, explore cultures</strong>,
            and create opportunities beyond geographical boundaries.
          </p>
        </div>

        {/* Chapter 6: The Founding of BhashaSchool */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm shrink-0">
              06
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#0B1528] tracking-tight">
                The Birth of BhashaSchool
              </h2>
              <p className="text-xs text-gray-500 font-medium">A Mission to Make Languages Simple, Practical &amp; Truly Accessible</p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-gray-800 leading-relaxed font-semibold">
            Pawan founded BhashaSchool with a clear vision: to make high-quality language learning accessible to everyone.
          </p>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
            His mission is to create a global platform where learners can gain real skills, connect with a supportive community,
            and unlock new life-changing opportunities through languages. Today, BhashaSchool stands as an ISO 9001:2015 certified
            and Government of India (Udyam) registered institution trusted by thousands of learners across India and abroad.
          </p>

          {/* 3 Core Commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xs font-black text-gray-900">CEFR Structured</h4>
              <p className="text-[11px] text-gray-500 font-medium">Step-by-step progress from A1 to C1 with zero ambiguity.</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xs font-black text-gray-900">Career-Oriented</h4>
              <p className="text-[11px] text-gray-500 font-medium">Dedicated support for Nursing, Ausbildung, and DACH work visas.</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xs font-black text-gray-900">Direct Acquisition</h4>
              <p className="text-[11px] text-gray-500 font-medium">Learn directly in German logic without dependency on prior English.</p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. WHY LEARN GERMAN WITH PAWAN VERMA? (SEO SECTION)
        ────────────────────────────────────────────────────────────── */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              Best German Language Online Teacher in India
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
              Why Hundreds of Learners Choose <span className="text-[#E67E22]">Pawan Verma</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              A teaching style refined through 10+ years of active language training, personalized mentorship, and proven student success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#E67E22]" />
                <h3 className="text-sm font-black text-gray-900">Native Logic, No Translation Traps</h3>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Most students struggle because institutes teach German by translating English words. Pawan teaches German in German—helping your brain think naturally in German from Day 1.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-black text-gray-900">Goethe-Zertifikat Exam Focus</h3>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Thorough preparation for official Goethe-Institut A1, A2, and B1 examinations with proven mock tests, speaking simulations, and module-wise drills.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-black text-gray-900">Supportive, Patient Mentorship</h3>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Having begun as an English mentor in Agra, Pawan understands student anxieties. Classes are interactive, conversational, warm, and highly encouraging.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-1.5">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-black text-gray-900">Proven Career Roadmap for Germany</h3>
              </div>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">
                Real-world guidance for nursing professionals, Ausbildung seekers, university applicants, and IT engineers seeking visas and employment in Germany.
              </p>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            5. BOTTOM CTA: START LEARNING WITH PAWAN VERMA
        ────────────────────────────────────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-r from-[#FFF5EA] via-[#FFF1E0] to-[#FFE8D1] p-8 sm:p-12 border border-[#FED7AA]/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left max-w-lg">
            <h3 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
              Ready to Learn German with <span className="text-[#E67E22]">Pawan Verma?</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
              Join upcoming live masterclasses, structured CEFR batches, or get in touch for personalized language guidance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              href="/classes"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#0B1528] hover:bg-[#152542] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <span>Join Live Masterclasses</span>
              <ArrowRight className="w-4 h-4 text-[#E67E22]" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs sm:text-sm font-bold transition-all shadow-2xs"
            >
              <span>About BhashaSchool</span>
            </Link>
          </div>
        </div>

      </section>
    </div>
  );
}
