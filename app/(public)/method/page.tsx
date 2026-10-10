'use client';
import { motion } from 'framer-motion';
import { Target, Users, Zap, Award, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-[var(--neutral-warm)] pb-[10vh]">

      {/* Hero */}
      <section className="py-[12vh] text-center bg-gradient-to-b from-white to-[var(--neutral-warm)]">
        <div className="max-w-[1000px] mx-auto px-[5vw] md:px-[2vw]">
          <div className="inline-flex items-center gap-2 px-[1.5vw] py-[0.5vh] rounded-[50px] bg-[var(--green-light)] border border-[var(--ceramic)] text-[var(--starbucks-green)] text-[1.4rem] font-bold mb-[3vh] shadow-sm tracking-wide">
            <Target className="w-5 h-5" />
            Empirically Proven Pedagogy
          </div>
          <h1 className="display-text text-[var(--text-black)] mb-[3vh] leading-tight text-[4rem] md:text-[5.5rem]">
            How We Teach You To <br/>
            <span className="text-[var(--starbucks-green)]">Think Automatically.</span>
          </h1>
          <p className="body-text text-[1.8rem] text-[var(--text-black-soft)] max-w-3xl mx-auto leading-relaxed">
            The traditional school format fails because it separates theory from interaction. We bridge that gap using the <b>BhashaSchool Peer Ladder</b> — an interconnected system of theory, immediate application, and peer mentorship.
          </p>
        </div>
      </section>

      {/* The Three Pillars */}
      <section className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw] py-[8vh]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[4vw] md:gap-[2vw]">
          <div className="content-card bg-white border border-[var(--ceramic)] shadow-md p-[4vw] md:p-[2vw] hover:-translate-y-2 transition-transform">
            <div className="w-[60px] h-[60px] rounded-full bg-[var(--green-light)] text-[var(--starbucks-green)] flex items-center justify-center mb-[3vh]">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="h1-text mb-[2vh] text-[var(--text-black)]">1. Structural Deep Dives</h3>
            <p className="body-text text-[var(--text-black-soft)] leading-relaxed">
              Every week, you absorb core grammar, vocabulary, and phonetic concepts through expert-led structured masterclasses synced exactly to your CEFR proficiency level.
            </p>
          </div>
          <div className="content-card bg-[var(--house-green)] text-white shadow-xl p-[4vw] md:p-[2vw] hover:-translate-y-2 transition-transform transform scale-[1.05] relative z-10">
            <div className="w-[60px] h-[60px] rounded-full bg-[rgba(255,255,255,0.1)] text-[var(--gold)] flex items-center justify-center mb-[3vh]">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="h1-text mb-[2vh] text-white">2. The Peer Ladder</h3>
            <p className="body-text text-[rgba(255,255,255,0.8)] leading-relaxed">
              This is our signature innovation. You don't just practice with your direct classmates. You're paired with <b>seniors exactly one level above you</b>, eliminating anxiety while pulling your skills forward natively.
            </p>
          </div>
          <div className="content-card bg-white border border-[var(--ceramic)] shadow-md p-[4vw] md:p-[2vw] hover:-translate-y-2 transition-transform">
            <div className="w-[60px] h-[60px] rounded-full bg-[var(--gold-lightest)] text-[var(--gold)] flex items-center justify-center mb-[3vh]">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="h1-text mb-[2vh] text-[var(--text-black)]">3. Become The Mentor</h3>
            <p className="body-text text-[var(--text-black-soft)] leading-relaxed">
              As you graduate to new levels (e.g., A2), you consolidate your knowledge by guiding A1 juniors. The act of teaching permanently burns grammatical structures into your own memory.
            </p>
          </div>
        </div>
      </section>

      {/* The Peer Ladder Visual */}
      <section className="bg-[var(--white)] py-[10vh] border-y border-[var(--ceramic)]">
        <div className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw]">
          <div className="text-center mb-[8vh]">
            <h2 className="display-text text-[var(--text-black)]">The Signature <span className="text-[var(--gold)]">Peer Ladder</span></h2>
            <p className="body-text text-[1.8rem] text-[var(--text-black-soft)] max-w-2xl mx-auto mt-[2vh]">
              How it works inside the ecosystem.
            </p>
          </div>

          <div className="flex flex-col mb-[6vh] bg-[var(--house-green)] p-[5vw] md:p-[4vw] rounded-[24px] items-center shadow-2xl">
             {/* Flow chart visually structured: A1->A2 on top, B1->B2 below */}
             <div className="flex flex-row items-center gap-[4vw] md:gap-[8vw]">
               <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                 <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--white)] text-[var(--house-green)]">A1</div>
                 <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Junior</span>
               </motion.div>
               <span className="text-[var(--gold)] font-bold text-[2.5rem] md:text-[4rem] leading-none">→</span>
               <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                 <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--white)] text-[var(--house-green)]">A2</div>
                 <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Partner</span>
               </motion.div>
             </div>

             <div className="py-[3vh]">
               <span className="text-[var(--white)] opacity-30 font-bold text-[3rem] leading-none">↓</span>
             </div>

             <div className="flex flex-row items-center gap-[4vw] md:gap-[8vw]">
               <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                 <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--white)] text-[var(--house-green)]">B1</div>
                 <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Mentor</span>
               </motion.div>
               <span className="text-[var(--gold)] font-bold text-[2.5rem] md:text-[4rem] leading-none">→</span>
               <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-[3vw] md:gap-[1.5vw] cursor-default">
                 <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center h2-text md:h1-text m-0 shadow-lg bg-[var(--gold)] text-[var(--house-green)]">B2</div>
                 <span className="body-text font-bold text-[var(--white)] uppercase tracking-widest whitespace-nowrap">Fluent</span>
               </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[12vh] text-center bg-[var(--neutral-warm)]">
        <div className="max-w-xl mx-auto px-[5vw] md:px-[2vw]">
          <h2 className="display-text text-[var(--text-black)] mb-[2vh] text-[4rem]">
            Ready to Trust the <span className="text-[var(--starbucks-green)]">Process?</span>
          </h2>
          <p className="body-text text-[var(--text-black-soft)] mb-[5vh] text-[1.8rem]">Step into an ecosystem built entirely around getting you communicative from day one.</p>
          <Link href="/classes" className="btn-primary flex justify-center items-center gap-[1vw] py-[2vh] px-[4vw] text-[1.8rem] !bg-[var(--gold)] !border-[var(--gold)] !text-[var(--house-green)] mx-auto w-max shadow-xl">
            Book a Free Taster Class <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
