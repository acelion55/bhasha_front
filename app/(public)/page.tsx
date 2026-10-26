'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  GraduationCap, 
  FileText, 
  MessageCircle, 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  Lock, 
  Check, 
  ArrowRight, 
  ChevronDown, 
  Sparkles, 
  Video, 
  Layers, 
  HeartHandshake,
  MessageSquare,
  ShieldCheck,
  Compass,
  CheckCircle2
} from 'lucide-react';
import TrialBookingForm from '@/components/TrialBookingForm';
import HeroSection from '@/components/home/HeroSection';

const CEFR_STEPS = [
  { level: 'Baustein', title: 'Foundation (15 Days)', desc: 'Pronunciation, core alphabet, basic sentence architecture, and phonetics.' },
  { level: 'A1', title: 'Beginner (30 Days)', desc: 'Everyday survival phrases, daily routines, shopping, and present tense dialogues.' },
  { level: 'A2', title: 'Elementary (40 Days)', desc: 'Past tense (Perfekt), social conversations, giving directions, and workplace scenarios.' },
  { level: 'B1', title: 'Intermediate (50 Days)', desc: 'Spontaneous discussions, complex grammar, opinions, plus 10 days Goethe/telc exam prep.' },
  { level: 'B2', title: 'Professional (60 Days)', desc: 'Advanced workplace communication, medical/engineering terminology, and formal debate.' },
];

const FAQS = [
  {
    q: 'What is BhashaSchool?',
    a: 'BhashaSchool is a structured live language learning academy specializing in German and English. We combine certified native faculty instruction with our proprietary Peer-Ladder conversation system so students overcome speaking hesitation.',
  },
  {
    q: 'Which languages can I learn?',
    a: 'We currently provide full CEFR curriculum programs for German (A1 to B2), Conversational English, and beginner Spanish.',
  },
  {
    q: 'What are CEFR levels and why do they matter?',
    a: 'The Common European Framework of Reference for Languages (CEFR) is the international standard for describing language ability. It is required for German university admissions, Ausbildung vocational training, and work visas.',
  },
  {
    q: 'What is Baustein?',
    a: 'Baustein is our proprietary 15-day foundational syllabus. Before starting standard textbook chapters, Baustein teaches you the logical grammar engine of the language, making subsequent learning 3x smoother.',
  },
  {
    q: 'How do live classes work?',
    a: 'Classes run Monday to Friday in small batches (max 10 students). Sessions are 1 to 1:30 hours with certified teachers, followed by daily mentor drill sessions.',
  },
  {
    q: 'Can I practise speaking with other learners?',
    a: 'Yes! Through our Peer Ladder, junior learners (A1) converse in safe, guided sessions with senior learners (A2), and A2 learners practice with B1/B2 mentors.',
  },
  {
    q: 'Are my phone number and email visible to other students?',
    a: 'Never. All peer conversations and practice sessions happen securely within the BhashaSchool learning space. Your personal contact details remain completely private.',
  },
  {
    q: 'How do I join a free trial class or placement test?',
    a: 'Simply click "Book Free Trial" anywhere on this page. Our academic team will connect with you to schedule a 30-minute level assessment and taster class.',
  },
];

export default function HomePage() {
  const [trialFormOpen, setTrialFormOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [openFaqs, setOpenFaqs] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (idx: number) => {
    setOpenFaqs((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-[#F7F6F2] pb-[8vh] overflow-x-hidden text-[#20252A]">
      
      {/* ── 1. HERO SECTION (VIEWPORT HEIGHT ACCORDING TO SPEC) ── */}
      <HeroSection onOpenTrial={() => setTrialFormOpen(true)} />

      {/* ── MAIN STACKED PANELS CONTAINER (USING VH & VW) ── */}
      <div className="w-full max-w-[1440px] px-[2.5vw] md:px-[3.5vw] lg:px-[4vw] py-[2vh] flex flex-col gap-[2.5vh] md:gap-[3.5vh]">

        {/* ── 2. PEACH “WHY LANGUAGE LEARNING” STORY PANEL ── */}
        <section className="w-full rounded-[20px] md:rounded-[24px] bg-[#F9D9CD] p-[5vw] md:p-[4vw] border border-[rgba(32,37,42,0.08)] shadow-xs">
          <div className="max-w-4xl mx-auto text-center md:text-left">
            <span className="text-[1.1rem] sm:text-[1.2rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1.5vh] block">
              LEARN • PRACTISE • CONNECT
            </span>
            <h2 className="text-[2.6rem] sm:text-[3.4rem] md:text-[4rem] font-extrabold text-[#20252A] leading-[1.15] mb-[2vh] tracking-tight">
              Language learning is better together.
            </h2>
            <p className="text-[1.6rem] sm:text-[1.8rem] text-[#20252A] font-medium leading-relaxed mb-[3vh] max-w-3xl">
              Studying grammar rules alone in a textbook doesn&apos;t build conversational reflexes. At BhashaSchool, learners progress through verified CEFR milestones and connect with approved peers to build speaking confidence beyond class hours.
            </p>
            <div className="flex flex-wrap items-center gap-[2vw] pt-[1.5vh] border-t border-[rgba(32,37,42,0.12)]">
              <span className="text-[1.4rem] sm:text-[1.5rem] font-bold text-[#173B63] flex items-center gap-2">
                <Check className="w-5 h-5 text-[#E4A642] stroke-[3]" /> From your first words to confident conversations.
              </span>
              <span className="text-[1.4rem] sm:text-[1.5rem] font-bold text-[#173B63] flex items-center gap-2">
                <Check className="w-5 h-5 text-[#E4A642] stroke-[3]" /> Safe, judgment-free peer practice.
              </span>
            </div>
          </div>
        </section>

        {/* ── 3. TWO-COLUMN FEATURE CARDS (CEFR PATHWAY & SPEAKING COMMUNITY) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.5vh] md:gap-[2.5vw] items-stretch">
          
          {/* Card A: Pale blue-gray learning pathway */}
          <section className="rounded-[20px] md:rounded-[24px] bg-[#DCE7F0] p-[5vw] md:p-[3.5vw] border border-[rgba(32,37,42,0.08)] flex flex-col justify-between">
            <div>
              <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
                STRUCTURED PROGRESS
              </span>
              <h3 className="text-[2.4rem] sm:text-[2.8rem] font-extrabold text-[#20252A] mb-[1.5vh] leading-tight">
                A clear path from A1 to B2
              </h3>
              <p className="text-[1.5rem] text-[#626B73] leading-relaxed mb-[3vh]">
                Follow an official CEFR roadmap designed for university admission, visa qualification, and global career opportunities.
              </p>

              {/* Stepper Chips */}
              <div className="flex flex-wrap gap-[0.8vw] mb-[3vh]">
                {CEFR_STEPS.map((s, idx) => (
                  <button
                    key={s.level}
                    onClick={() => setActiveStep(idx)}
                    className={`px-[1.6vw] py-[0.8vh] rounded-full text-[1.3rem] font-bold transition-all cursor-pointer ${
                      activeStep === idx 
                        ? 'bg-[#173B63] text-white shadow-xs' 
                        : 'bg-white/80 hover:bg-white text-[#20252A] border border-[rgba(32,37,42,0.1)]'
                    }`}
                  >
                    {s.level}
                  </button>
                ))}
              </div>

              {/* Active Step Card */}
              <div className="bg-white rounded-[16px] p-[2.5vw] border border-[rgba(32,37,42,0.08)] shadow-xs">
                <div className="flex items-center gap-3 mb-[1vh]">
                  <span className="w-8 h-8 rounded-full bg-[#173B63] text-white flex items-center justify-center font-black text-[1.3rem]">
                    {CEFR_STEPS[activeStep].level[0]}
                  </span>
                  <h4 className="text-[1.8rem] font-bold text-[#20252A]">
                    {CEFR_STEPS[activeStep].title}
                  </h4>
                </div>
                <p className="text-[1.4rem] text-[#626B73] leading-relaxed">
                  {CEFR_STEPS[activeStep].desc}
                </p>
              </div>
            </div>

            <div className="pt-[3vh] mt-[2vh] border-t border-[rgba(32,37,42,0.08)] flex justify-between items-center">
              <span className="text-[1.3rem] font-bold text-[#173B63]">Mapped to Goethe &amp; telc</span>
              <Link href="/courses" className="text-[1.4rem] font-bold text-[#173B63] hover:underline flex items-center gap-1">
                View Syllabus <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Card B: Lavender speaking community */}
          <section className="rounded-[20px] md:rounded-[24px] bg-[#DCD5F5] p-[5vw] md:p-[3.5vw] border border-[rgba(32,37,42,0.08)] flex flex-col justify-between">
            <div>
              <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
                AUTHENTIC FLUENCY
              </span>
              <h3 className="text-[2.4rem] sm:text-[2.8rem] font-extrabold text-[#20252A] mb-[1.5vh] leading-tight">
                Practice with people, not just pages
              </h3>
              <p className="text-[1.5rem] text-[#626B73] leading-relaxed mb-[3vh]">
                Connect with approved learners at linked levels and build real speaking confidence together in guided conversational environments.
              </p>

              {/* Pill Labels */}
              <div className="flex flex-wrap gap-[1vw] mb-[3vh]">
                <span className="px-[1.6vw] py-[0.8vh] rounded-full bg-white text-[#173B63] font-bold text-[1.3rem] border border-[rgba(32,37,42,0.08)] shadow-xs flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#173B63]" /> Peer Chat
                </span>
                <span className="px-[1.6vw] py-[0.8vh] rounded-full bg-white text-[#173B63] font-bold text-[1.3rem] border border-[rgba(32,37,42,0.08)] shadow-xs flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#E4A642]" /> Speaking Practice
                </span>
                <span className="px-[1.6vw] py-[0.8vh] rounded-full bg-white text-[#173B63] font-bold text-[1.3rem] border border-[rgba(32,37,42,0.08)] shadow-xs flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#173B63]" /> Connected Levels
                </span>
              </div>

              {/* Privacy Callout */}
              <div className="bg-white/90 rounded-[16px] p-[2.5vw] border border-[rgba(32,37,42,0.08)] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#173B63] text-white flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[1.4rem] font-bold text-[#20252A] mb-0.5">Privacy First</p>
                  <p className="text-[1.3rem] text-[#626B73] m-0">Your phone number and email remain private. All peer practice happens securely inside the portal.</p>
                </div>
              </div>
            </div>

            <div className="pt-[3vh] mt-[2vh] border-t border-[rgba(32,37,42,0.08)] flex justify-between items-center">
              <span className="text-[1.3rem] font-bold text-[#173B63]">Junior ⇄ Senior Buddy System</span>
              <button onClick={() => setTrialFormOpen(true)} className="text-[1.4rem] font-bold text-[#173B63] hover:underline flex items-center gap-1 cursor-pointer">
                Join Community <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

        </div>

        {/* ── 4. TWO-COLUMN CONTENT CARDS (LESSONS & REAL-WORLD PRACTICE) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.5vh] md:gap-[2.5vw] items-stretch">
          
          {/* Card A: Pale Aqua Structured Online Classes */}
          <section className="rounded-[20px] md:rounded-[24px] bg-[#D9EEEE] p-[5vw] md:p-[3.5vw] border border-[rgba(32,37,42,0.08)] flex flex-col justify-between">
            <div>
              <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
                ACADEMIC EXCELLENCE
              </span>
              <h3 className="text-[2.4rem] sm:text-[2.8rem] font-extrabold text-[#20252A] mb-[1.5vh] leading-tight">
                Live classes with a clear purpose
              </h3>
              <p className="text-[1.5rem] text-[#626B73] leading-relaxed mb-[3vh]">
                See your batch start date, live Google Meet/Zoom class link, attendance history, and teacher feedback in one organized place.
              </p>

              {/* Visual Schedule Mock */}
              <div className="bg-white rounded-[16px] p-[2.5vw] border border-[rgba(32,37,42,0.08)] space-y-[1.5vh]">
                <div className="flex justify-between items-center pb-[1vh] border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-[#173B63]" />
                    <span className="font-bold text-[1.4rem] text-[#20252A]">Daily Interactive Cohort</span>
                  </div>
                  <span className="text-[1.2rem] font-bold bg-[#D8E6DB] text-[#20252A] px-2.5 py-0.5 rounded-full">Mon – Fri</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[1.3rem] text-[#626B73]">
                  <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#173B63]" /> 1:30 Hours Daily</div>
                  <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#173B63]" /> Max 10 Students</div>
                  <div className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-[#173B63]" /> PDF Notes Included</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Recorded Backup</div>
                </div>
              </div>
            </div>

            <div className="pt-[3vh] mt-[2vh] border-t border-[rgba(32,37,42,0.08)] flex justify-between items-center">
              <span className="text-[1.3rem] font-bold text-[#173B63]">Certified Faculty Mentorship</span>
              <Link href="/classes" className="text-[1.4rem] font-bold text-[#173B63] hover:underline flex items-center gap-1">
                Explore Classes <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Card B: Soft Sage Real-World Speaking Practice */}
          <section className="rounded-[20px] md:rounded-[24px] bg-[#D8E6DB] p-[5vw] md:p-[3.5vw] border border-[rgba(32,37,42,0.08)] flex flex-col justify-between">
            <div>
              <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
                PRACTICAL CONVERSATION
              </span>
              <h3 className="text-[2.4rem] sm:text-[2.8rem] font-extrabold text-[#20252A] mb-[1.5vh] leading-tight">
                Use your language in everyday life
              </h3>
              <p className="text-[1.5rem] text-[#626B73] leading-relaxed mb-[3vh]">
                Practise through guided conversational topics, role-play dialogues, short debates, and exam prompt simulations.
              </p>

              {/* Chat Dialogue Bubbles */}
              <div className="space-y-[1.2vh]">
                <div className="bg-white rounded-2xl rounded-tl-xs p-3.5 max-w-[85%] border border-[rgba(32,37,42,0.08)] shadow-xs">
                  <p className="text-[1.1rem] font-bold text-[#626B73] mb-0.5">German A1 Routine</p>
                  <p className="text-[1.4rem] font-medium text-[#20252A] m-0">"Wie spät ist es? Treffen wir uns am Hauptbahnhof?"</p>
                </div>
                <div className="bg-[#173B63] text-white rounded-2xl rounded-tr-xs p-3.5 max-w-[85%] ml-auto shadow-xs">
                  <p className="text-[1.1rem] font-bold text-[#E4A642] mb-0.5">A2 Senior Partner</p>
                  <p className="text-[1.4rem] font-medium m-0">"Ja, gerne! Um 14 Uhr vor dem Café am Ausgang."</p>
                </div>
              </div>
            </div>

            <div className="pt-[3vh] mt-[2vh] border-t border-[rgba(32,37,42,0.08)] flex justify-between items-center">
              <span className="text-[1.3rem] font-bold text-[#173B63]">German • English • Spanish</span>
              <button onClick={() => setTrialFormOpen(true)} className="text-[1.4rem] font-bold text-[#173B63] hover:underline flex items-center gap-1 cursor-pointer">
                Try a Speaking Drill <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </section>

        </div>

        {/* ── 5. HUMAN-CENTERED BRAND STATEMENT (BLUSH PANEL) ── */}
        <section className="w-full rounded-[20px] md:rounded-[24px] bg-[#F4DEDF] p-[6vw] md:p-[5vw] border border-[rgba(32,37,42,0.08)] text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[1.1rem] sm:text-[1.2rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1.5vh] block">
              MADE FOR REAL PROGRESS
            </span>
            <h2 className="text-[2.6rem] sm:text-[3.6rem] font-extrabold text-[#20252A] leading-[1.2] mb-[2vh] tracking-tight">
              A learning community built around people.
            </h2>
            <p className="text-[1.6rem] sm:text-[1.8rem] text-[#20252A] font-medium leading-relaxed max-w-2xl mx-auto mb-[3vh]">
              Language is far more than memorizing noun genders and grammar cases. It is the real-world confidence to ask, listen, share ideas, and connect meaningfully across cultures.
            </p>
            <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full border border-[rgba(32,37,42,0.1)] shadow-xs">
              <HeartHandshake className="w-5 h-5 text-[#E4A642]" />
              <span className="text-[1.4rem] font-bold text-[#173B63]">100% Certified Native &amp; Bilingual Mentorship</span>
            </div>
          </div>
        </section>

        {/* ── 6. “EVERYTHING YOU NEED” FEATURE DIRECTORY (WARM NEUTRAL PANEL) ── */}
        <section className="w-full rounded-[20px] md:rounded-[24px] bg-[#EAE5DD] p-[5vw] md:p-[4vw] border border-[rgba(32,37,42,0.08)]">
          <div className="text-center mb-[4vh]">
            <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
              YOUR LEARNING SPACE
            </span>
            <h2 className="text-[2.6rem] sm:text-[3.2rem] font-extrabold text-[#20252A] tracking-tight">
              Everything you need to keep moving.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[1.5vw] md:gap-[1.2vw]">
            {[
              { title: 'CEFR Learning Paths', icon: Compass },
              { title: 'Live Cohort Classes', icon: Video },
              { title: 'Attendance Tracking', icon: CheckCircle2 },
              { title: 'Learning Library (PDFs)', icon: BookOpen },
              { title: 'Speaking Club', icon: MessageCircle },
              { title: 'Connected Learners', icon: Users },
              { title: 'Level Guidance', icon: GraduationCap },
              { title: 'Class Timetable', icon: Calendar },
              { title: 'Privacy Controls', icon: Lock },
              { title: 'Goethe Exam Drills', icon: Sparkles },
            ].map((tile) => {
              const Icon = tile.icon;
              return (
                <div 
                  key={tile.title}
                  className="bg-white rounded-[16px] p-[2vw] border border-[rgba(32,37,42,0.08)] shadow-xs flex flex-col items-center text-center justify-center hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#F7F6F2] text-[#173B63] flex items-center justify-center mb-[1.2vh]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-[1.3rem] font-bold text-[#20252A] leading-tight m-0">
                    {tile.title}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. APP / PORTAL PROMOTION BANNER (WARM PEACH-TO-GOLD) ── */}
        <section className="w-full rounded-[20px] md:rounded-[24px] bg-gradient-to-r from-[#F9D9CD] to-[#FDE8D0] p-[5vw] md:p-[4vw] border border-[rgba(32,37,42,0.08)] flex flex-col lg:flex-row items-center justify-between gap-[3vw]">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
              STUDENT PORTAL
            </span>
            <h2 className="text-[2.6rem] sm:text-[3.2rem] font-extrabold text-[#20252A] mb-[1.5vh] leading-tight tracking-tight">
              Your language classroom, all in one place.
            </h2>
            <p className="text-[1.5rem] sm:text-[1.6rem] text-[#20252A] font-medium leading-relaxed mb-[3vh]">
              Check your class details, revisit PDF resources, book mentor speaking drills, and stay connected with your batchmates.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setTrialFormOpen(true)}
                className="px-8 py-4 bg-[#173B63] hover:bg-[#0f2947] text-white font-bold text-[1.5rem] rounded-full shadow-md transition cursor-pointer"
              >
                Book Free Trial &amp; Placement
              </button>
              <Link 
                href="/courses"
                className="px-8 py-4 bg-white/80 hover:bg-white text-[#20252A] font-bold text-[1.5rem] rounded-full border border-[rgba(32,37,42,0.12)] shadow-xs transition"
              >
                Explore Courses &amp; Fees
              </Link>
            </div>
          </div>

          <div className="w-full max-w-sm bg-white rounded-[20px] p-[2.5vw] border border-[rgba(32,37,42,0.1)] shadow-lg text-[#20252A]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="font-bold text-[1.3rem] text-[#173B63]">BhashaSchool Portal</span>
              <span className="text-[1.1rem] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Active Batch</span>
            </div>
            <div className="space-y-2 text-[1.2rem]">
              <div className="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>Next Live Class</span>
                <span className="font-bold text-[#173B63]">Today, 6:00 PM</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>Peer Speaking Partner</span>
                <span className="font-bold text-[#173B63]">Assigned</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex justify-between items-center">
                <span>Learning Material</span>
                <span className="font-bold text-emerald-600">8 PDFs Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. CONFIDENCE / SAFETY SECTION (PALE CREAM PANEL) ── */}
        <section className="w-full rounded-[20px] md:rounded-[24px] bg-[#F6E8CF] p-[5vw] md:p-[4vw] border border-[rgba(32,37,42,0.08)]">
          <div className="max-w-3xl mx-auto text-center mb-[3vh]">
            <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
              LEARN WITH CONFIDENCE
            </span>
            <h2 className="text-[2.6rem] sm:text-[3.2rem] font-extrabold text-[#20252A] tracking-tight mb-[1.5vh]">
              A comfortable space to practise.
            </h2>
            <p className="text-[1.5rem] sm:text-[1.6rem] text-[#20252A] font-medium leading-relaxed">
              Use approved learner connections and portal-based practice without publishing your personal contact details.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[2vw]">
            <div className="bg-white rounded-[16px] p-[2.5vw] border border-[rgba(32,37,42,0.08)] shadow-xs">
              <ShieldCheck className="w-8 h-8 text-[#173B63] mb-[1vh]" />
              <h4 className="text-[1.6rem] font-bold text-[#20252A] mb-[0.5vh]">Controlled Connections</h4>
              <p className="text-[1.3rem] text-[#626B73] leading-relaxed m-0">Only enrolled, verified cohort students participate in peer conversation rooms.</p>
            </div>
            <div className="bg-white rounded-[16px] p-[2.5vw] border border-[rgba(32,37,42,0.08)] shadow-xs">
              <BookOpen className="w-8 h-8 text-[#E4A642] mb-[1vh]" />
              <h4 className="text-[1.6rem] font-bold text-[#20252A] mb-[0.5vh]">Community Guidelines</h4>
              <p className="text-[1.3rem] text-[#626B73] leading-relaxed m-0">Respectful, encouraging norms curated specifically for nervous second-language speakers.</p>
            </div>
            <div className="bg-white rounded-[16px] p-[2.5vw] border border-[rgba(32,37,42,0.08)] shadow-xs">
              <Lock className="w-8 h-8 text-[#173B63] mb-[1vh]" />
              <h4 className="text-[1.6rem] font-bold text-[#20252A] mb-[0.5vh]">Private Account Details</h4>
              <p className="text-[1.3rem] text-[#626B73] leading-relaxed m-0">Your phone number, WhatsApp and email address are never shared publicly with peers.</p>
            </div>
          </div>
        </section>

        {/* ── 9. ACCESSIBLE FAQ ACCORDION (PALE AQUA PANEL - 2 COLUMNS) ── */}
        <section className="w-full rounded-[20px] md:rounded-[24px] bg-[#D9EEEE] p-[5vw] md:p-[4vw] border border-[rgba(32,37,42,0.08)]">
          <div className="max-w-3xl mx-auto text-center mb-[4vh]">
            <span className="text-[1.1rem] font-extrabold uppercase tracking-widest text-[#626B73] mb-[1vh] block">
              CLEAR ANSWERS
            </span>
            <h2 className="text-[2.6rem] sm:text-[3.4rem] font-extrabold text-[#20252A] tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-[1.5vw] items-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-[1.5vh]">
              {FAQS.slice(0, 4).map((faq, sliceIdx) => {
                const idx = sliceIdx;
                const isOpen = !!openFaqs[idx];
                return (
                  <div 
                    key={faq.q}
                    className="bg-white rounded-[16px] border border-[rgba(32,37,42,0.08)] overflow-hidden shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-[2vw] py-[2vh] text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[1.4rem] sm:text-[1.55rem] font-bold text-[#20252A]">
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[#173B63] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-[2vw] pb-[2.5vh] pt-[0.5vh] text-[1.35rem] sm:text-[1.4rem] text-[#626B73] leading-relaxed border-t border-slate-100">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-[1.5vh]">
              {FAQS.slice(4, 8).map((faq, sliceIdx) => {
                const idx = sliceIdx + 4;
                const isOpen = !!openFaqs[idx];
                return (
                  <div 
                    key={faq.q}
                    className="bg-white rounded-[16px] border border-[rgba(32,37,42,0.08)] overflow-hidden shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-[2vw] py-[2vh] text-left flex justify-between items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-[1.4rem] sm:text-[1.55rem] font-bold text-[#20252A]">
                        {faq.q}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-[#173B63] transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-[2vw] pb-[2.5vh] pt-[0.5vh] text-[1.35rem] sm:text-[1.4rem] text-[#626B73] leading-relaxed border-t border-slate-100">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>

      <TrialBookingForm type="trial" isOpen={trialFormOpen} onClose={() => setTrialFormOpen(false)} />

    </main>
  );
}
