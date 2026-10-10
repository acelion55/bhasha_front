'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Medal, Globe, GraduationCap, FileText, 
  Radio, Headphones, MessageCircle, Users, BookOpen, 
  Zap, Target, Plane, Mic, PenTool, Timer,
  LayoutGrid, Book, Settings, Check
} from 'lucide-react';
import GooeyBackground from '@/components/effects/GooeyBackground';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('A1');

  // Reusable animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const popIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <main className="min-h-vh w-[100vw] flex flex-col items-center bg-[var(--neutral-warm)] pb-[10vh] overflow-x-hidden">
      
      {/* Main Container Wrapper */}
      <div className="w-full max-w-[1200px] px-[5vw] md:px-[2vw] py-[4vh] flex flex-col gap-[6vh]">
        
        {/* ── HERO & HIGHLIGHTS ROW (DESKTOP SPLIT) ── */}
        <div className="flex flex-col md:flex-row gap-[4vw] items-stretch">
          
          {/* Left Text */}
          <motion.div 
            initial="hidden" animate="visible" variants={fadeIn}
            className="flex-1 space-y-[2vh] flex flex-col justify-center"
          >
            <h2 className="body-text font-bold text-[var(--gold)] tracking-widest uppercase">Learn. Practice. Progress. Achieve.</h2>
            <h1 className="display-text mb-2 text-[var(--text-black)]">A Structured Language<br/>Learning Experience</h1>
            <p className="body-text text-[var(--text-black-soft)] max-w-xl text-[1.6rem] leading-relaxed">
              Not only teaching grammar, but empowering confident real-world German communication.
            </p>
          </motion.div>

          {/* Right Cards Stack */}
          <motion.div 
            initial="hidden" animate="visible" variants={{
              visible: { transition: { staggerChildren: 0.2 } }
            }}
            className="flex-1 flex flex-col gap-[2vh]"
          >
            {/* ── LIVE COHORT CARD ── */}
            <motion.div variants={popIn} whileHover={{ y: -5 }} className="content-card bg-[var(--house-green)] border-none text-[var(--white)] relative overflow-hidden flex-1 shadow-xl">
              <GraduationCap className="absolute right-[-20px] top-[-20px] opacity-10 w-[200px] h-[200px] text-white" />
              <span className="small-text font-bold text-[var(--gold-light)] uppercase tracking-widest mb-1">Live Cohort System</span>
              <h2 className="h1-text text-[var(--white)] mb-2">From Beginner to Career-Ready Fluency</h2>
              <p className="body-text text-[var(--text-white-soft)] mb-6 max-w-[80%]">Next batch starts Monday • Small batches (max 10)</p>
              
              <div className="flex justify-between items-center relative z-10 w-full border-t border-[rgba(255,255,255,0.1)] pt-[2vh] mt-auto">
                <div className="flex -space-x-4">
                  <div className="w-[40px] h-[40px] bg-[var(--ceramic)] border-[3px] border-[var(--house-green)] rounded-full"></div>
                  <div className="w-[40px] h-[40px] bg-[var(--gold)] border-[3px] border-[var(--house-green)] rounded-full"></div>
                  <div className="w-[40px] h-[40px] bg-[var(--green-accent)] border-[3px] border-[var(--house-green)] rounded-full flex items-center justify-center small-text font-bold">+480</div>
                </div>
                <span className="body-text font-bold text-[var(--green-light)]">98.4% Goethe Pass Rate</span>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* ── CURRICULUM FRAMEWORK & DUAL SUPPORT (DESKTOP ROW) ── */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="flex flex-col md:flex-row gap-[4vw] items-stretch mt-[2vh]"
        >
          {/* Framework */}
          <div className="flex-[3]">
            <span className="small-text font-bold text-[var(--gold)] uppercase tracking-widest">Curriculum Framework</span>
            <h2 className="h1-text text-[var(--text-black)] mb-2 mt-1">How Our Learning System Works</h2>
            <p className="body-text text-[var(--text-black-soft)] mb-[3vh]">Structured step-by-step ladder mapped directly to official CEFR standards.</p>
            
            <div className="flex gap-[1vw] overflow-x-auto pb-[1vh] mb-[2vh] hide-scrollbar border-b border-[var(--ceramic)]">
              {['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Advanced'].map((lvl) => (
                 <button 
                  key={lvl}
                  onClick={() => setActiveTab(lvl.split(' ')[0])}
                  className={`flex-shrink-0 body-text px-[2vw] py-[1vh] rounded-t-[8px] font-bold transition-all border-b-[4px] ${
                    activeTab === lvl.split(' ')[0] 
                      ? 'bg-[var(--house-green)] text-[var(--white)] border-[var(--gold)]' 
                      : 'bg-transparent text-[var(--text-black-soft)] border-transparent hover:bg-[var(--ceramic)]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <motion.div key={activeTab} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="content-card shadow-lg flex flex-col md:flex-row gap-[2vw]">
              <div className="flex-1">
                <div className="flex justify-between items-start mb-[2vh]">
                  <div className="flex gap-[1vw] items-center">
                    <div className="w-[60px] h-[60px] border-[4px] border-[var(--starbucks-green)] bg-[var(--white)] text-[var(--starbucks-green)] rounded-full flex justify-center items-center display-text">{activeTab}</div>
                    <div>
                      <h3 className="h1-text text-[var(--text-black)] mb-0">Foundations of German</h3>
                      <p className="body-text font-medium text-[var(--text-black-soft)]">80 Hours • 8-10 Weeks</p>
                    </div>
                  </div>
                </div>
                <p className="body-text text-[var(--text-black-soft)] text-[1.6rem] mb-[2vh]">
                  Build phonetics, present tense conjugation, daily introductions, shopping dialogues, and basic sentence architecture with native-level clarity.
                </p>
              </div>
              <div className="flex-1 border-l border-[var(--ceramic)] pl-[2vw] flex flex-col justify-center">
                <div className="flex justify-between items-center mb-2">
                  <p className="small-text font-bold uppercase tracking-widest text-[var(--starbucks-green)] m-0">Key Outcomes</p>
                  <span className="small-text font-bold uppercase bg-[var(--gold-lightest)] text-[var(--gold)] px-3 py-1 rounded-[4px]">Official CEFR</span>
                </div>
                <div className="flex flex-wrap gap-[1vw]">
                  {['Pronunciation Drills', 'Nominativ & Akkusativ', 'Daily Routines', `${activeTab} Exam Readiness`].map((badge) => (
                     <span key={badge} className="body-text font-medium bg-[var(--neutral-cool)] border border-[var(--ceramic)] px-[1vw] py-[0.5vh] rounded-[8px] text-[var(--text-black-soft)]">{badge}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pedagogy Support */}
          <div className="flex-[2] flex flex-col pt-[1vh]">
            <span className="small-text font-bold text-[var(--gold)] uppercase tracking-widest">Pedagogy Architecture</span>
            <h2 className="h1-text text-[var(--text-black)] mb-1 mt-1">Dual Support System</h2>
            <p className="body-text text-[var(--text-black-soft)] mb-[2.5vh]">One system for conceptual mastery. Another for daily accountability.</p>

            <div className="space-y-[2vh] h-full flex flex-col justify-between">
              <motion.div whileHover={{ scale: 1.02 }} className="content-card relative overflow-hidden flex-1 justify-center shadow-md border border-[var(--ceramic)]">
                 <div className="absolute top-0 right-0 w-[6px] h-full bg-[var(--starbucks-green)]"></div>
                 <div className="flex items-center gap-[1.5vw] mb-[1.5vh]">
                   <div className="w-[50px] h-[50px] rounded-[12px] bg-[var(--green-light)] flex justify-center items-center text-[var(--starbucks-green)]">
                     <Radio className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="h2-text text-[var(--text-black)] mb-0">Certified Faculty</h3>
                     <p className="small-text font-bold text-[var(--starbucks-green)] m-0">Classroom Architects</p>
                   </div>
                 </div>
                 <ul className="body-text font-medium text-[var(--text-black-soft)] space-y-[1vh]">
                   <li className="flex gap-3 items-center"><Check className="w-5 h-5 text-[var(--starbucks-green)]" /> Formal grammar breakdown</li>
                   <li className="flex gap-3 items-center"><Check className="w-5 h-5 text-[var(--starbucks-green)]" /> Curriculum progression</li>
                 </ul>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} className="content-card relative overflow-hidden flex-1 justify-center shadow-md border border-[var(--ceramic)]">
                 <div className="absolute top-0 right-0 w-[6px] h-full bg-[var(--gold)]"></div>
                 <div className="flex items-center gap-[1.5vw] mb-[1.5vh]">
                   <div className="w-[50px] h-[50px] rounded-[12px] bg-[var(--gold-lightest)] flex justify-center items-center text-[var(--gold)]">
                     <Headphones className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="h2-text text-[var(--text-black)] mb-0">Dedicated Mentors</h3>
                     <p className="small-text font-bold text-[var(--gold)] m-0">Daily Fluency Partners</p>
                   </div>
                 </div>
                 <ul className="body-text font-medium text-[var(--text-black-soft)] space-y-[1vh]">
                   <li className="flex gap-3 items-center"><Check className="w-5 h-5 text-[var(--gold)]" /> 1-on-1 personalized drill check-ins</li>
                   <li className="flex gap-3 items-center"><Check className="w-5 h-5 text-[var(--gold)]" /> Weekly habit coaching</li>
                 </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ── SIGNATURE INNOVATION (Peer Ladder - FULL WIDTH) ── */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={popIn}
          className="feature-band rounded-[16px] px-[5vw] py-[6vh] mt-[2vh] !w-full !ml-0 shadow-2xl relative overflow-hidden"
        >
           <MessageCircle className="absolute left-[50px] bottom-[-50px] opacity-10 w-[400px] h-[400px] text-white" />
           <div className="relative z-10">
             <div className="flex flex-col items-center mb-[4vh] text-center">
               <span className="small-text font-bold text-[var(--gold-light)] uppercase tracking-widest mb-2">Signature Innovation</span>
               <h2 className="display-text text-[var(--white)] mb-3">Learn With Your Level — Practice Beyond Your Level</h2>
               <p className="body-text text-[var(--text-white-soft)] max-w-2xl text-[1.6rem]">
                 Our peer ladder connects you with seniors so you master conversational reflexes faster without anxiety.
               </p>
             </div>

             {/* Flow chart visually structured as requested: A1->A2 on top, B1->B2 below */}
             <div className="flex flex-col mb-[6vh] bg-[rgba(0,0,0,0.2)] p-[5vw] md:p-[4vw] rounded-[16px] items-center">
               
               {/* Top Row: A1 -> A2 */}
               <div className="flex flex-row items-center gap-[4vw] md:gap-[8vw]">
                 <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                   <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--white)] text-[var(--house-green)] border-4 border-[rgba(255,255,255,0.2)]">A1</div>
                   <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Junior</span>
                 </motion.div>

                 <span className="text-[var(--gold)] font-bold text-[2.5rem] md:text-[3rem] leading-none">→</span>

                 <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                   <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--white)] text-[var(--house-green)] border-4 border-[rgba(255,255,255,0.2)]">A2</div>
                   <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Partner</span>
                 </motion.div>
               </div>

               {/* Connecting Vertical Arrow */}
               <div className="py-[1.5vh]">
                 <span className="text-[var(--white)] opacity-30 font-bold text-[2rem] leading-none">↓</span>
               </div>

               {/* Bottom Row: B1 -> B2 */}
               <div className="flex flex-row items-center gap-[4vw] md:gap-[8vw]">
                 <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                   <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--white)] text-[var(--house-green)] border-4 border-[rgba(255,255,255,0.2)]">B1</div>
                   <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Mentor</span>
                 </motion.div>

                 <span className="text-[var(--gold)] font-bold text-[2.5rem] md:text-[3rem] leading-none">→</span>

                 <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                   <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--gold)] text-[var(--house-green)]">B2</div>
                   <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Fluent</span>
                 </motion.div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-[2vw]">
               <motion.div whileHover={{ y: -5 }} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-[2vw] flex flex-col rounded-[12px] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                 <div className="flex justify-between items-center mb-[2vh]">
                   <h3 className="h2-text text-[var(--white)]">A1 ⇄ A2 Dynamic</h3>
                   <span className="bg-[var(--gold)] text-[var(--house-green)] px-3 py-1 rounded-[4px] small-text font-bold uppercase tracking-wider">Active</span>
                 </div>
                 <p className="body-text text-[var(--text-white-soft)] leading-relaxed">A1 learners practice guided dialogues with A2 seniors, reinforcing real interaction before entering complex grammar.</p>
               </motion.div>
               
               <motion.div whileHover={{ y: -5 }} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-[2vw] flex flex-col rounded-[12px] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                 <div className="flex justify-between items-center mb-[2vh]">
                   <h3 className="h2-text text-[var(--white)]">A2 ⇄ B1 Labs</h3>
                   <span className="bg-[rgba(255,255,255,0.1)] text-[var(--white)] border border-[rgba(255,255,255,0.2)] px-3 py-1 rounded-[4px] small-text font-bold uppercase tracking-wider">2x Week</span>
                 </div>
                 <p className="body-text text-[var(--text-white-soft)] leading-relaxed">A2 speakers bridge into spontaneous descriptions of past experiences, guided by B1 learners polishing their narration.</p>
               </motion.div>

               <motion.div whileHover={{ y: -5 }} className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] p-[2vw] flex flex-col rounded-[12px] hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                 <div className="flex justify-between items-center mb-[2vh]">
                   <h3 className="h2-text text-[var(--white)]">B1 ⇄ B2 Discourse</h3>
                   <span className="bg-[rgba(255,255,255,0.1)] text-[var(--white)] border border-[rgba(255,255,255,0.2)] px-3 py-1 rounded-[4px] small-text font-bold uppercase tracking-wider">Daily</span>
                 </div>
                 <p className="body-text text-[var(--text-white-soft)] leading-relaxed">Expressing opinions, professional topics, counter-arguments, and complex connectors seamlessly.</p>
               </motion.div>
             </div>

             <div className="mt-[4vh] text-[var(--gold-light)] italic h2-text text-center font-normal px-[5vw]">
               "Senior learners support junior learners while revising and strengthening their own fluency."
             </div>
           </div>
        </motion.div>

        {/* ── HIGHLIGHTED B1/B2 (DESKTOP FLEX) ── */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          className="content-card bg-[var(--white)] border border-[var(--ceramic)] shadow-md mt-[2vh] flex flex-col md:flex-row gap-[4vw] items-center p-[4vw]"
        >
          <div className="flex-1">
            <span className="small-text font-bold text-[var(--house-green)] uppercase tracking-widest bg-[var(--gold)] px-[1vw] py-[0.5vh] rounded-[4px] inline-block mb-[2vh]">Highlighted for B1 & B2</span>
            <h2 className="display-text text-[var(--text-black)] mb-2">Dedicated Speaking Practice</h2>
            <p className="h2-text font-normal text-[var(--text-black-soft)] italic mb-[3vh]">
              "From knowing the language to actually speaking it."
            </p>
            <div className="flex flex-wrap gap-[1vw] mb-[3vh]">
              {[
                { label: 'Everyday Communication', icon: MessageCircle },
                { label: 'Group Discussions', icon: Users },
                { label: 'Course Topic Debates', icon: BookOpen },
                { label: 'Vocabulary Boost', icon: Zap },
                { label: 'Fluency & Confidence', icon: Target },
                { label: 'Real-life Scenarios', icon: Plane }
              ].map((b, i) => (
                 <span key={i} className="body-text text-[var(--text-black)] bg-[var(--neutral-warm)] border border-[var(--ceramic)] px-[1.5vw] py-[1vh] rounded-[50px] flex items-center gap-2">
                   <b.icon className="w-4 h-4 text-[var(--starbucks-green)]" /> {b.label}
                 </span>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-[var(--neutral-warm)] border border-[var(--ceramic)] p-[3vw] rounded-[16px] shadow-sm flex flex-col justify-center items-center text-center gap-[2vh]">
            <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-[80px] h-[80px] bg-[var(--starbucks-green)] rounded-full flex items-center justify-center text-[var(--white)] shadow-inner mb-2">
              <Mic className="w-10 h-10" />
            </motion.div>
            <div>
              <p className="h2-text text-[var(--text-black)] m-0 mb-1">Daily Speaking Room #4</p>
              <p className="body-text text-[var(--text-black-soft)] m-0 bg-[var(--white)] px-4 py-2 rounded-[50px] inline-flex font-medium border border-[var(--ceramic)]">Topic: Berufliche Zukunft in Deutschland</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary !bg-[var(--gold)] !border-[var(--gold)] !text-[var(--house-green)] px-[4vw] mt-2 shadow-lg">Join Live Room Now</motion.button>
          </div>
        </motion.div>

        {/* ── EXAM PREP MASTERCLASS (DESKTOP 4-GRID) ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="mt-[2vh]">
          <div className="flex justify-between items-end mb-2">
             <span className="small-text font-bold text-[var(--gold)] uppercase tracking-widest">Certification Success</span>
             <span className="bg-[var(--green-light)] text-[var(--starbucks-green)] small-text font-bold px-[1vw] py-[0.5vh] rounded-[8px]">Goethe & telc Certified</span>
          </div>
          <h2 className="display-text text-[var(--text-black)] mb-2">Exam Preparation Masterclass</h2>
          <p className="body-text text-[var(--text-black-soft)] mb-[4vh] text-[1.6rem]">Four modular exam pillars engineered for high scores and visa compliance.</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-[2vw] mb-[3vh]">
            <motion.div whileHover={{ y: -10 }} className="content-card shadow-sm border border-[var(--ceramic)]">
              <div className="flex justify-between items-start mb-[2vh]">
                <BookOpen className="w-10 h-10 text-[var(--starbucks-green)]" />
                <span className="small-text font-bold bg-[var(--neutral-warm)] px-3 py-1 rounded-[4px] text-[var(--text-black-soft)] border border-[var(--ceramic)]">Teil 1-5</span>
              </div>
              <h3 className="h2-text text-[var(--text-black)] mb-2">Lesen</h3>
              <p className="body-text text-[var(--text-black-soft)] m-0 leading-relaxed">Speed comprehension & text inference traps designed for test environments.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="content-card shadow-sm border border-[var(--ceramic)]">
              <div className="flex justify-between items-start mb-[2vh]">
                <Headphones className="w-10 h-10 text-[var(--gold)]" />
                <span className="small-text font-bold bg-[var(--gold-lightest)] px-3 py-1 rounded-[4px] text-[var(--gold)] border border-[var(--gold-light)]">Audio Drills</span>
              </div>
              <h3 className="h2-text text-[var(--text-black)] mb-2">Hören</h3>
              <p className="body-text text-[var(--text-black-soft)] m-0 leading-relaxed">Dialects, accents, and selective listening tips mapping exact exam audio profiles.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="content-card shadow-sm border border-[var(--ceramic)]">
              <div className="flex justify-between items-start mb-[2vh]">
                <PenTool className="w-10 h-10 text-[var(--text-black)]" />
                <span className="small-text font-bold bg-[var(--neutral-warm)] px-3 py-1 rounded-[4px] text-[var(--text-black-soft)] border border-[var(--ceramic)]">Templates</span>
              </div>
              <h3 className="h2-text text-[var(--text-black)] mb-2">Schreiben</h3>
              <p className="body-text text-[var(--text-black-soft)] m-0 leading-relaxed">Formal emails, argumentative essays & vocabulary review blueprints.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -10 }} className="content-card shadow-sm border border-[var(--ceramic)]">
              <div className="flex justify-between items-start mb-[2vh]">
                <Users className="w-10 h-10 text-[var(--starbucks-green)]" />
                <span className="small-text font-bold bg-[var(--green-light)] px-3 py-1 rounded-[4px] text-[var(--starbucks-green)] border border-[var(--green-accent)]">Pair Drills</span>
              </div>
              <h3 className="h2-text text-[var(--text-black)] mb-2">Sprechen</h3>
              <p className="body-text text-[var(--text-black-soft)] m-0 leading-relaxed">Presentations, planning sessions & rebuttals timed with examiners.</p>
            </motion.div>
          </div>

          <div className="bg-[var(--neutral-warm)] border border-[var(--ceramic)] rounded-[16px] p-[3vw] flex flex-col md:flex-row justify-between items-center gap-[2vw] shadow-inner">
             <div className="flex items-center gap-[2vw]">
               <div className="bg-[var(--white)] p-4 rounded-full shadow-sm border border-[var(--ceramic)]">
                 <Timer className="w-12 h-12 text-[var(--text-black)]" />
               </div>
               <div>
                 <h4 className="h2-text text-[var(--text-black)] mb-1">Simulated Full-length Mock Exams</h4>
                 <p className="body-text text-[var(--text-black-soft)] m-0">Timed test conditions with certified Goethe evaluator grading.</p>
               </div>
             </div>
             <motion.button whileHover={{ scale: 1.05 }} className="btn-outline !bg-[var(--white)] w-full md:w-auto px-[3vw]">View Schedule</motion.button>
          </div>
        </motion.div>

        {/* ── OUR PHILOSOPHY / FOOTER (DESKTOP) ── */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={popIn}
          className="feature-band rounded-[16px] p-[6vw] mt-[4vh] mb-[8vh] !w-full !ml-0 flex flex-col md:flex-row gap-[6vw] items-center text-center md:text-left shadow-2xl relative overflow-hidden"
        >
           {/* Liquid Morphing Background Array */}
           <GooeyBackground />
           
           <div className="flex-1 relative z-10 pointer-events-none">
             <span className="small-text font-bold text-[var(--gold-light)] uppercase tracking-widest mb-2 block">Our Philosophy</span>
             <h2 className="display-text text-[var(--white)] text-[4.8rem] line-height-[1.1] leading-none mb-6 drop-shadow-md">Structured.<br/>Practical.<br/>Accessible.</h2>
             <p className="body-text text-[var(--text-white-soft)] text-[1.6rem] m-0 max-w-xl backdrop-blur-sm bg-[rgba(0,0,0,0.1)] p-2 rounded-lg">
               Whether preparing for studies in Munich, an engineering transfer, or vocational training (Ausbildung), master German with unshakeable confidence.
             </p>
           </div>
           
           <div className="flex-[0.8] w-full bg-[rgba(255,255,255,0.05)] p-[3vw] rounded-[16px] border border-[rgba(255,255,255,0.1)] backdrop-blur-md relative z-10">
             <div className="space-y-[2vh] w-full">
               <motion.button whileHover={{ scale: 1.05 }} className="btn-primary !w-full !bg-[var(--gold)] !border-[var(--gold)] !text-[var(--house-green)] flex justify-between items-center px-[2vw] py-[2vh] text-[1.8rem] shadow-lg">
                 <span>Book Free Trial & Placement</span>
                 <span className="text-[2rem]">→</span>
               </motion.button>
               <motion.button whileHover={{ scale: 1.05 }} className="btn-outline !w-full !text-[var(--white)] !border-[var(--white)] flex justify-center items-center gap-3 py-[2vh] text-[1.8rem] hover:bg-[rgba(255,255,255,0.1)]">
                 <MessageCircle className="w-6 h-6" /> Chat with Academic Mentor
               </motion.button>
             </div>

             <div className="flex flex-wrap justify-between mt-[4vh] pt-[3vh] border-t border-[rgba(255,255,255,0.1)]">
               <span className="body-text font-bold text-[var(--green-light)] flex items-center gap-2"><Check className="w-4 h-4" /> No Obligation</span>
               <span className="body-text font-bold text-[var(--green-light)] flex items-center gap-2"><Check className="w-4 h-4" /> Level Assessment Included</span>
             </div>
           </div>
        </motion.div>

      </div>

    </main>
  );
}
