'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { ArrowRight, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LevelData {
  num: string;
  level: string;
  title: string;
  italicTitle: string;
  desc: string;
  heightDesktop: number;
}

const LEVELS: LevelData[] = [
  {
    num: '01',
    level: 'A1',
    title: 'Discovery',
    italicTitle: '& Phonetics',
    desc: 'We map the rigid angles before we smooth them out. Master phonetics, alphabet, sentence order, and initial survival dialogues.',
    heightDesktop: 560,
  },
  {
    num: '02',
    level: 'A2',
    title: 'Connected',
    italicTitle: '& Dialogues',
    desc: 'Angles begin rounding out into rhythm. Form past tense (Perfekt), navigate everyday social settings, and ask questions without freezing.',
    heightDesktop: 480,
  },
  {
    num: '03',
    level: 'B1',
    title: 'Spontaneous',
    italicTitle: '& Debate',
    desc: 'Rapid momentum and complex sentence flow. Defend opinions, master Konjunktiv II, and prepare for official Goethe & telc visa exams.',
    heightDesktop: 410,
  },
  {
    num: '04',
    level: 'B2',
    title: 'Effortless',
    italicTitle: '& Fluency',
    desc: 'The perfect circle: complete linguistic velocity. Lead workplace presentations, participate in technical debates, and speak instinctively.',
    heightDesktop: 340,
  },
];

const CONTAINER_HEIGHT = 560;
const BASELINE_Y = 265;
const SHAPE_RADIUS = 46;

export default function CefrJourneyScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Sync GSAP ScrollTrigger with Lenis
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let triggerInstance: ScrollTrigger | null = null;

    const timer = setTimeout(() => {
      triggerInstance = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=1800',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      if (triggerInstance) triggerInstance.kill();
    };
  }, []);

  // Compute the rolling shape geometry based on scrollProgress (0 to 1)
  const shapeGeometry = useMemo(() => {
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Rotation: rolls forward 2 full rotations (720 deg)
    const rotation = p * Math.PI * 4;

    // Number of sides:
    // 0.00 - 0.22: 4 sides (Square)
    // 0.22 - 0.50: 7 sides (Heptagon)
    // 0.50 - 0.78: 12 sides (Dodecagon)
    // 0.78 - 1.00: 36 sides (Circle)
    let sides = 4;
    let isCircle = false;

    if (p < 0.22) {
      sides = 4;
    } else if (p < 0.50) {
      sides = 7;
    } else if (p < 0.78) {
      sides = 12;
    } else {
      isCircle = true;
      sides = 36;
    }

    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides + rotation;
      const x = SHAPE_RADIUS * Math.cos(angle);
      const y = SHAPE_RADIUS * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return {
      points: points.join(' '),
      isCircle,
      progress: p,
    };
  }, [scrollProgress]);

  // Active level index (0, 1, 2, 3)
  const activeIndex = Math.min(3, Math.floor(scrollProgress * 4));

  return (
    <section 
      ref={sectionRef} 
      className="w-full min-h-screen bg-[#F7F6F2] py-[5vh] px-[2.5vw] md:px-[4vw] flex flex-col justify-center select-none overflow-hidden"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col justify-between">
        
        {/* ── TOP HEADER / TRACK METRIC ROW ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-[3.5vh] border-b border-[rgba(32,37,42,0.1)] pb-[2vh]">
          <div className="flex items-center gap-3">
            <span className="text-[1.3rem] font-black uppercase tracking-widest text-[#CF1E2C] flex items-center gap-1.5">
              <span>A1</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
              <span>B2</span>
            </span>
            <span className="text-[1.2rem] text-[#626B73] font-medium tracking-wide">
              • THE CEFR TRANSFORMATION ROADMAP
            </span>
          </div>

          <div className="text-left md:text-right">
            <p className="text-[1.5rem] sm:text-[1.7rem] font-bold text-[#20252A] leading-snug">
              We smooth every awkward corner until speaking feels like{' '}
              <span className="italic font-serif text-[#CF1E2C] font-normal">rolling downhill.</span>
            </p>
            <p className="text-[1.25rem] text-[#626B73]">
              Scroll to witness how rigid beginner grammar transforms into frictionless fluency.
            </p>
          </div>
        </div>

        {/* ── 4 STAGGERED RED EDITORIAL CARDS WITH CONTINUOUS TRACK ── */}
        <div 
          className="relative w-full grid grid-cols-1 md:grid-cols-4 gap-[2vw] md:gap-[1.2vw] items-end"
          style={{ minHeight: `${CONTAINER_HEIGHT}px` }}
        >
          {LEVELS.map((lvl, idx) => {
            const isActive = activeIndex === idx;
            // Compute the local baseline Y inside this card so all cards align with the container baseline
            const cardTopOffset = CONTAINER_HEIGHT - lvl.heightDesktop;
            const localBaselineY = BASELINE_Y - cardTopOffset;

            return (
              <div
                key={lvl.num}
                style={{ 
                  height: `${lvl.heightDesktop}px`,
                }}
                className={`relative w-full bg-[#CF1E2C] text-white rounded-[10px] p-[2.5vw] md:p-[1.8vw] flex flex-col justify-between transition-all duration-300 overflow-hidden shadow-md ${
                  isActive ? 'ring-2 ring-white/60 shadow-2xl' : 'opacity-95'
                }`}
              >
                {/* ── TOP BADGE / STEP NUMBER ── */}
                <div className="flex justify-between items-start z-10">
                  <span className="text-[1.4rem] font-mono font-bold tracking-wider text-white/90">
                    {lvl.num}
                  </span>
                  <span className="text-[1.2rem] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                    {lvl.level}
                  </span>
                </div>

                {/* ── CARD LOCAL SCALLOPED TRACK (ALIGNED WITH GLOBAL BASELINE) ── */}
                <div 
                  className="absolute left-0 right-0 pointer-events-none z-0"
                  style={{ top: `${localBaselineY}px` }}
                >
                  {/* Dashed baseline through center of shape */}
                  <div className="w-full border-t border-dashed border-white/40 h-0" />
                  
                  {/* Repeating scalloped wave track below the dashed line */}
                  <svg 
                    className="w-full h-[22px] overflow-visible text-white/70 stroke-current fill-none stroke-[1.8]"
                    viewBox="0 0 300 22" 
                    preserveAspectRatio="none"
                    style={{ marginTop: `${SHAPE_RADIUS - 4}px` }}
                  >
                    <path d="M 0,20 Q 25,0 50,20 Q 75,0 100,20 Q 125,0 150,20 Q 175,0 200,20 Q 225,0 250,20 Q 275,0 300,20" />
                  </svg>
                </div>

                {/* ── BOTTOM EDITORIAL TYPOGRAPHY ── */}
                <div className="z-10 pt-[2vh]">
                  <div className="mb-[1.5vh]">
                    <h3 className="text-[2.6rem] sm:text-[3rem] font-extrabold tracking-tight leading-none text-white">
                      {lvl.title}
                    </h3>
                    <div className="text-[2.2rem] sm:text-[2.6rem] font-serif italic text-white/95 leading-tight">
                      {lvl.italicTitle}
                    </div>
                  </div>

                  <p className="text-[1.35rem] text-white/85 leading-relaxed font-normal">
                    {lvl.desc}
                  </p>

                  <div className="mt-[2vh] pt-[1.5vh] border-t border-white/20 flex items-center justify-between text-[1.15rem] font-mono text-white/70">
                    <span>STAGE {idx + 1} OF 4</span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-white font-bold animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" /> ACTIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* ── CONTINUOUS SCROLL-TRIGGERED ROLLING SHAPE OVERLAY ── */}
          <div 
            className="absolute inset-x-0 pointer-events-none hidden md:block z-20"
            style={{ top: `${BASELINE_Y}px` }}
          >
            {/* The single rolling morphing shape pinned along the dashed baseline */}
            <div 
              className="absolute -top-[46px] -ml-[46px] transition-transform duration-75 will-change-transform"
              style={{
                left: `${(shapeGeometry.progress * 0.76 + 0.12) * 100}%`,
              }}
            >
              <svg width="92" height="92" viewBox="-46 -46 92 92" className="overflow-visible">
                {shapeGeometry.isCircle ? (
                  <circle
                    cx="0"
                    cy="0"
                    r={SHAPE_RADIUS}
                    fill="rgba(255,255,255,0.08)"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                  />
                ) : (
                  <polygon
                    points={shapeGeometry.points}
                    fill="rgba(255,255,255,0.08)"
                    stroke="#FFFFFF"
                    strokeWidth="2.2"
                  />
                )}
                {/* Center axis white dot pinned precisely on the dashed baseline */}
                <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

        </div>

        {/* ── MOBILE SCROLL PROGRESS INDICATOR ── */}
        <div className="mt-[3vh] md:hidden flex flex-col gap-2">
          <div className="flex justify-between text-[1.2rem] font-mono text-[#626B73]">
            <span>A1 (Square)</span>
            <span>B2 (Circle)</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#CF1E2C] transition-all duration-150"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
