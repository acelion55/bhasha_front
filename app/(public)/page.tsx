'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { 
  Shield, Medal, Globe, GraduationCap, FileText, 
  Radio, Headphones, MessageCircle, Users, BookOpen, 
  Zap, Target, Plane, Mic, PenTool, Timer,
  LayoutGrid, Book, Settings, Check, ArrowRight, Sparkles, Award
} from 'lucide-react';
import GooeyBackground from '@/components/effects/GooeyBackground';
import TrialBookingForm from '@/components/TrialBookingForm';
import HeroSection from '@/components/home/HeroSection';

const CEFR_DATA: Record<string, {
  title: string;
  duration: string;
  desc: string;
  badges: string[];
  target: string;
}> = {
  A1: {
    title: 'Foundations of German (A1 Beginner)',
    duration: '80 Hours • 8–10 Weeks',
    desc: 'Master phonetics, alphabet, sentence order, and daily survival German: self-introductions, ordering food, basic shopping, and asking for directions.',
    badges: ['Phonetics & Pronunciation Drills', 'Nominativ & Akkusativ', 'Daily Routines & Time', 'Official Goethe A1 Exam Prep'],
    target: 'Survive and converse in simple daily scenarios with native German speakers.'
  },
  A2: {
    title: 'Elementary Fluency (A2 Elementary)',
    duration: '90 Hours • 9–11 Weeks',
    desc: 'Express past events (Perfekt & Präteritum), give directions, describe feelings, and navigate workplace dialogues and social situations.',
    badges: ['Perfekt & Dativ Verbs', 'Modal Verbs in Past', 'Workplace Dialogues', 'Official Goethe A2 Exam Prep'],
    target: 'Handle regular situations in German work and travel environments with ease.'
  },
  B1: {
    title: 'Intermediate Mastery (B1 - German Visa & Citizenship)',
    duration: '110 Hours • 12–14 Weeks',
    desc: 'Speak spontaneously on familiar topics, defend opinions, express abstract concepts, and master the official Goethe/telc B1 certification for German residency.',
    badges: ['Konjunktiv II & Subordinate Clauses', 'Official B1 Essay Drafting', 'Spontaneous Debate Drills', 'Goethe B1 Visa Ready'],
    target: 'Full qualification for German Ausbildung, university pathway, and job visas.'
  },
  B2: {
    title: 'Advanced Professional Fluency (B2 - Work & Medical)',
    duration: '130 Hours • 14–16 Weeks',
    desc: 'Engage in complex technical discussions, formal presentations, nuances, idiomatic German, and professional workplace negotiation.',
    badges: ['Complex Connectors & Passiv', 'Professional Presentations', 'Medical & Tech Terminology', 'Goethe/telc B2 Certified'],
    target: 'Direct employment eligibility for nursing, engineering, and German corporations.'
  }
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [trialFormOpen, setTrialFormOpen] = useState(false);
  const [mentorFormOpen, setMentorFormOpen] = useState(false);

  // Reusable animation variants
  const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const popIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const staggerVariants: Variants = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  const currentLevel = CEFR_DATA[activeTab] || CEFR_DATA.A1;

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-[var(--neutral-warm)] pb-24 overflow-x-hidden">
      
      {/* ── HERO SECTION MATCHING MOCKUP ── */}
      <HeroSection onOpenTrial={() => setTrialFormOpen(true)} />

      {/* Main Container Wrapper for remaining sections */}
      <div className="w-full max-w-none px-4 md:px-8 lg:px-12 py-12 md:py-16 flex flex-col gap-14 md:gap-18">

        {/* ── CURRICULUM FRAMEWORK & DUAL SUPPORT ── */}
        <motion.div 
          id="curriculum"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="flex flex-col lg:flex-row gap-8 items-stretch"
        >
          {/* Framework Left */}
          <div className="flex-[3] flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest">Official CEFR Framework</span>
              <h2 className="text-3xl font-extrabold text-[var(--text-black)] mb-2 mt-1">Structured Language Ladder</h2>
              <p className="text-base text-[var(--text-black-soft)] mb-6">Each level maps directly to certified CEFR standards with measurable speaking and grammar outcomes.</p>
              
              {/* Level Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 hide-scrollbar border-b border-[var(--ceramic)]">
                {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                  <button 
                    key={lvl}
                    onClick={() => setActiveTab(lvl)}
                    className={`flex-shrink-0 text-sm md:text-base px-5 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      activeTab === lvl 
                        ? 'bg-[var(--house-green)] text-white shadow-md ring-1 ring-white/20' 
                        : 'bg-white text-[var(--text-black-soft)] hover:bg-slate-100 border border-[var(--ceramic)]'
                    }`}
                  >
                    {lvl} • {lvl === 'A1' ? 'Beginner' : lvl === 'A2' ? 'Elementary' : lvl === 'B1' ? 'Intermediate' : 'Advanced'}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Active Tab Card */}
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-[var(--ceramic)] p-6 md:p-8 shadow-lg flex flex-col md:flex-row gap-6"
            >
              <div className="flex-1 space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 border-4 border-[var(--gold)] bg-[var(--gold-lightest)] text-[var(--gold)] rounded-2xl flex justify-center items-center font-black text-2xl shadow-sm">
                    {activeTab}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-[var(--text-black)] mb-1">{currentLevel.title}</h3>
                    <p className="text-sm font-semibold text-[var(--gold)]">{currentLevel.duration}</p>
                  </div>
                </div>

                <p className="text-base text-[var(--text-black-soft)] leading-relaxed">
                  {currentLevel.desc}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Milestone</p>
                  <p className="text-sm font-semibold text-[var(--text-black)]">{currentLevel.target}</p>
                </div>
              </div>

              <div className="flex-1 border-t md:border-t-0 md:border-l border-[var(--ceramic)] pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--house-green)] m-0">Core Focus Modules</p>
                  <span className="text-xs font-bold uppercase bg-[var(--gold-lightest)] text-[var(--gold)] px-2.5 py-1 rounded">Goethe / telc</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentLevel.badges.map((badge) => (
                    <div key={badge} className="flex items-center gap-2 p-2.5 bg-[var(--neutral-warm)] border border-[var(--ceramic)] rounded-lg text-xs font-semibold text-[var(--text-black)]">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pedagogy Support Right */}
          <div className="flex-[2] flex flex-col justify-between pt-1">
            <div>
              <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest">Pedagogy Support</span>
              <h2 className="text-3xl font-extrabold text-[var(--text-black)] mb-2 mt-1">Dual Support System</h2>
              <p className="text-base text-[var(--text-black-soft)] mb-6">Master formal grammar with faculty. Build reflex fluency with mentors.</p>
            </div>

            <div className="space-y-4 h-full flex flex-col justify-between">
              <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-2xl border border-[var(--ceramic)] shadow-md relative overflow-hidden flex-1 flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-2 h-full bg-[var(--house-green)]"></div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--green-light)] flex justify-center items-center text-[var(--house-green)]">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-black)] mb-0">Certified Faculty</h3>
                    <p className="text-xs font-bold text-[var(--house-green)] m-0">Goethe-Certified Native Educators</p>
                  </div>
                </div>
                <ul className="text-sm text-[var(--text-black-soft)] space-y-2">
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-emerald-600" /> Complete grammar breakdown & syntax</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-emerald-600" /> Structured syllabus progression mapped to CEFR</li>
                </ul>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} className="bg-white p-6 rounded-2xl border border-[var(--ceramic)] shadow-md relative overflow-hidden flex-1 flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-2 h-full bg-[var(--gold)]"></div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--gold-lightest)] flex justify-center items-center text-[var(--gold)]">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-black)] mb-0">Dedicated Speaking Mentors</h3>
                    <p className="text-xs font-bold text-[var(--gold)] m-0">Daily Fluency & Drill Partners</p>
                  </div>
                </div>
                <ul className="text-sm text-[var(--text-black-soft)] space-y-2">
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-[var(--gold)]" /> 1-on-1 personalized pronunciation check-ins</li>
                  <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-[var(--gold)]" /> Weekly speaking habit & fluency coaching</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── BOLDER SIGNATURE INNOVATION (Peer Ladder) ── */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={popIn}
          className="bg-[var(--house-green)] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden text-white"
        >
          <MessageCircle className="absolute right-[-30px] bottom-[-30px] opacity-10 w-96 h-96 text-white pointer-events-none" />
          
          <div className="relative z-10 w-full">
            <div className="flex flex-col items-center mb-10 text-center">
              <span className="text-xs font-bold text-[var(--gold-light)] uppercase tracking-widest mb-3 bg-[rgba(255,255,255,0.08)] px-4 py-1.5 rounded-full">Proprietary Pedagogy</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight">
                Learn With Your Level — Practice Beyond Your Level
              </h2>
              <p className="text-base sm:text-lg text-[var(--text-white-soft)] max-w-2xl leading-relaxed">
                The #1 barrier to language fluency is speaking intimidation. Our Peer Ladder pairs you with senior learners so you build conversational instincts without judgment.
              </p>
            </div>

            {/* Visual Step Ladder */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white text-[var(--house-green)] font-black text-xl flex items-center justify-center mb-3 shadow-lg">A1</div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-light)]">Junior Learner</span>
                <p className="text-xs text-[var(--text-white-soft)] mt-2">Build initial phonetic confidence with guided partner drills</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white text-[var(--house-green)] font-black text-xl flex items-center justify-center mb-3 shadow-lg">A2</div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-light)]">Practice Partner</span>
                <p className="text-xs text-[var(--text-white-soft)] mt-2">Engage in spontaneous role-play and past tense stories</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white text-[var(--house-green)] font-black text-xl flex items-center justify-center mb-3 shadow-lg">B1</div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-light)]">Cohort Mentor</span>
                <p className="text-xs text-[var(--text-white-soft)] mt-2">Defend viewpoints, mentor juniors & reinforce personal fluency</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.12)] p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--gold)] text-white font-black text-xl flex items-center justify-center mb-3 shadow-lg">B2</div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--gold-lightest)]">Professional Fluent</span>
                <p className="text-xs text-[var(--text-white-soft)] mt-2">Lead discourse, master complex nuances & pass Goethe B2</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-6 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-white">A1 ⇄ A2 Dynamic</h3>
                  <span className="bg-[var(--gold)] text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase">Daily Drills</span>
                </div>
                <p className="text-sm text-[var(--text-white-soft)] leading-relaxed">A1 learners practice guided dialogues with A2 seniors, reinforcing real interaction before entering complex grammar.</p>
              </div>
              
              <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-6 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-white">A2 ⇄ B1 Labs</h3>
                  <span className="bg-[rgba(255,255,255,0.15)] text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase">2x Weekly</span>
                </div>
                <p className="text-sm text-[var(--text-white-soft)] leading-relaxed">A2 speakers bridge into spontaneous descriptions of past experiences, guided by B1 learners polishing their narration.</p>
              </div>

              <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-6 rounded-xl">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-bold text-white">B1 ⇄ B2 Discourse</h3>
                  <span className="bg-[rgba(255,255,255,0.15)] text-white px-2.5 py-0.5 rounded text-xs font-bold uppercase">Live Sessions</span>
                </div>
                <p className="text-sm text-[var(--text-white-soft)] leading-relaxed">Expressing opinions, professional topics, counter-arguments, and complex connectors seamlessly.</p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm sm:text-base font-medium text-[var(--gold-light)] italic">
              "By teaching and conversing with juniors, senior students strengthen their own mastery while juniors learn in a safe, anxiety-free setting."
            </p>
          </div>
        </motion.div>

        {/* ── EXAM PREP MASTERCLASS ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-2">
            <div>
              <span className="text-xs font-bold text-[var(--gold)] uppercase tracking-widest">Certification Success</span>
              <h2 className="text-3xl font-extrabold text-[var(--text-black)] mt-1">Goethe & telc Exam Preparation</h2>
            </div>
            <span className="bg-[var(--green-light)] text-[var(--house-green)] text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
              Official Four Pillars
            </span>
          </div>

          <p className="text-base text-[var(--text-black-soft)] mb-8">Four modular exam pillars engineered for high band scores and embassy visa approval.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-[var(--ceramic)] shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <BookOpen className="w-8 h-8 text-[var(--house-green)]" />
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">Teil 1–5</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-black)] mb-2">Lesen (Reading)</h3>
              <p className="text-sm text-[var(--text-black-soft)] leading-relaxed">Speed comprehension, inference cues, and vocabulary traps modeled directly on actual test sheets.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-[var(--ceramic)] shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <Headphones className="w-8 h-8 text-[var(--gold)]" />
                <span className="text-xs font-bold bg-[var(--gold-lightest)] text-[var(--gold)] px-2.5 py-1 rounded">Audio Drills</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-black)] mb-2">Hören (Listening)</h3>
              <p className="text-sm text-[var(--text-black-soft)] leading-relaxed">Regional accents, fast speech patterns, and selective listening techniques to catch essential clues.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-[var(--ceramic)] shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <PenTool className="w-8 h-8 text-[var(--text-black)]" />
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded">Templates</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-black)] mb-2">Schreiben (Writing)</h3>
              <p className="text-sm text-[var(--text-black-soft)] leading-relaxed">Formal letter structures, complaint emails, opinion essays, and certified examiner grading checklists.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-[var(--ceramic)] shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <Users className="w-8 h-8 text-[var(--house-green)]" />
                <span className="text-xs font-bold bg-[var(--green-light)] text-[var(--house-green)] px-2.5 py-1 rounded">Pair Drills</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--text-black)] mb-2">Sprechen (Speaking)</h3>
              <p className="text-sm text-[var(--text-black-soft)] leading-relaxed">Structured 2-person dialogues, partner presentations, and counter-questions with mock examiners.</p>
            </div>
          </div>

          <div className="bg-white border border-[var(--ceramic)] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-[var(--text-black)] flex-shrink-0">
                <Timer className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-[var(--text-black)] mb-0.5">Full-Length Goethe Simulation Tests</h4>
                <p className="text-sm text-[var(--text-black-soft)] m-0">Strict exam conditions with scored evaluation and individual correction notes.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setTrialFormOpen(true)}
              className="w-full md:w-auto px-6 py-3.5 bg-[var(--house-green)] hover:bg-[#132c4d] text-white font-bold text-sm rounded-xl transition cursor-pointer flex-shrink-0"
            >
              Check Mock Test Schedule
            </button>
          </div>
        </motion.div>

        {/* ── BOLDER BOTTOM CONVERSION BANNER ── */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={popIn}
          className="bg-[var(--house-green)] rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-8 items-center text-center lg:text-left shadow-2xl relative overflow-hidden"
        >
          <GooeyBackground />
          
          <div className="flex-1 relative z-10">
            <span className="text-xs font-bold text-[var(--gold-light)] uppercase tracking-widest mb-3 block">BhashaSchool Commitment</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
              Structured. Practical. Career-Focused.
            </h2>
            <p className="text-base text-[var(--text-white-soft)] max-w-xl leading-relaxed">
              Whether you are preparing for higher education in Munich, an engineering visa, or a nursing transfer, acquire German proficiency with complete confidence.
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-md bg-[rgba(255,255,255,0.06)] p-8 rounded-2xl border border-[rgba(255,255,255,0.12)] backdrop-blur-md relative z-10">
            <div className="space-y-4">
              <motion.button 
                onClick={() => setTrialFormOpen(true)} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[var(--gold)] hover:bg-[#b45309] text-white font-bold flex justify-between items-center px-6 py-4 rounded-xl text-lg shadow-lg cursor-pointer transition"
              >
                <span>Book Free Trial & Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <motion.button 
                onClick={() => setMentorFormOpen(true)} 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold flex justify-center items-center gap-2 py-3.5 rounded-xl text-base border border-white/20 cursor-pointer transition"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Talk to Academic Advisor</span>
              </motion.button>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[rgba(255,255,255,0.1)] text-xs font-semibold text-emerald-400">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> No Credit Card Required</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> 30-Min Instant Placement</span>
            </div>
          </div>
        </motion.div>

      </div>

      <TrialBookingForm type="trial" isOpen={trialFormOpen} onClose={() => setTrialFormOpen(false)} />
      <TrialBookingForm type="mentor" isOpen={mentorFormOpen} onClose={() => setMentorFormOpen(false)} />

    </main>
  );
}
