'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { ArrowRight, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface LevelConfig {
  num: string;
  level: string;
  title: string;
  italicTitle: string;
  desc: string;
  initialHeight: number; // Staggered base height before rising
  waveAmplitude: number; // Scallop wave depth (dips from baseline)
}

const LEVELS: LevelConfig[] = [
  {
    num: '01',
    level: 'A1',
    title: 'Discovery',
    italicTitle: '& Phonetics',
    desc: 'We map the rigid angles before we smooth them out. Master phonetics, alphabet, sentence order, and initial survival dialogues.',
    initialHeight: 560, // Starts at full height
    waveAmplitude: 16,  // Deep cylindrical scalloped humps
  },
  {
    num: '02',
    level: 'A2',
    title: 'Connected',
    italicTitle: '& Dialogues',
    desc: 'Angles begin rounding out into rhythm. Form past tense (Perfekt), navigate everyday social settings, and ask questions without freezing.',
    initialHeight: 340, // Expands to 560px as ball approaches
    waveAmplitude: 10,  // Medium gentle arches
  },
  {
    num: '03',
    level: 'B1',
    title: 'Spontaneous',
    italicTitle: '& Debate',
    desc: 'Rapid momentum and complex sentence flow. Defend opinions, master Konjunktiv II, and prepare for official Goethe & telc visa exams.',
    initialHeight: 270, // Expands to 560px as ball approaches
    waveAmplitude: 4,   // Micro ripples
  },
  {
    num: '04',
    level: 'B2',
    title: 'Effortless',
    italicTitle: '& Fluency',
    desc: 'The perfect circle: complete linguistic velocity. Lead workplace presentations, participate in technical debates, and speak instinctively.',
    initialHeight: 210, // Expands to 560px as ball approaches
    waveAmplitude: 0,   // 100% straight flat line!
  },
];

const FULL_HEIGHT = 560;
const BALL_RADIUS = 38; // 76px diameter
const TRACK_Y = 180;    // Y coordinate of the track contact line
const BALL_CENTER_Y = TRACK_Y - BALL_RADIUS; // 142px

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
        end: '+=2000',
        pin: true,
        scrub: 0.5,
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

  // Compute dynamic height for each card as you scroll:
  // Each section rises to full height one by one!
  const cardHeights = useMemo(() => {
    const p = Math.max(0, Math.min(1, scrollProgress));

    // Card 1: always full height (560px)
    const h1 = FULL_HEIGHT;

    // Card 2: grows from 340px to 560px during p in [0.05, 0.33]
    const t2 = Math.max(0, Math.min(1, (p - 0.05) / 0.28));
    const h2 = Math.round(340 + t2 * (FULL_HEIGHT - 340));

    // Card 3: grows from 270px to 560px during p in [0.33, 0.66]
    const t3 = Math.max(0, Math.min(1, (p - 0.33) / 0.33));
    const h3 = Math.round(270 + t3 * (FULL_HEIGHT - 270));

    // Card 4: grows from 210px to 560px during p in [0.66, 0.96]
    const t4 = Math.max(0, Math.min(1, (p - 0.66) / 0.30));
    const h4 = Math.round(210 + t4 * (FULL_HEIGHT - 210));

    return [h1, h2, h3, h4];
  }, [scrollProgress]);

  // Smooth morphing parameters:
  // 4 sides (Square, 0% border-radius) -> Circle (50% border-radius)
  const p = Math.max(0, Math.min(1, scrollProgress));
  const borderRadiusPercent = p * 50; // Smooth 0% -> 50%
  const rotationDeg = p * 720;        // 2 full rolls
  const activeIndex = Math.min(3, Math.floor(p * 4));

  return (
    <section 
      ref={sectionRef} 
      className="w-full min-h-screen bg-[#F7F6F2] py-[4vh] px-[2.5vw] md:px-[4vw] flex flex-col justify-center select-none overflow-hidden"
    >
      <div className="max-w-[1440px] w-full mx-auto flex flex-col justify-between">
        
        {/* ── TOP HEADER / TRACK METRIC ROW ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-[3vh] border-b border-[rgba(32,37,42,0.1)] pb-[2vh]">
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
              <span className="italic font-serif text-[#CF1E2C] font-normal">rolling on a flat road.</span>
            </p>
            <p className="text-[1.25rem] text-[#626B73]">
              Scroll to see cards expand to full height as the square morphs into a frictionless circle.
            </p>
          </div>
        </div>

        {/* ── 4 RED EDITORIAL CARDS (GROWING TO FULL HEIGHT ONE BY ONE) ── */}
        <div 
          className="relative w-full grid grid-cols-1 md:grid-cols-4 gap-[2vw] md:gap-[1.2vw] items-end"
          style={{ height: `${FULL_HEIGHT}px` }}
        >
          {LEVELS.map((lvl, idx) => {
            const currentHeight = cardHeights[idx];
            const isActive = activeIndex === idx;

            // Generate card-specific track path:
            // From cylindrical arches in Card 1 to completely straight line in Card 4!
            const amp = lvl.waveAmplitude;
            let trackPath = '';
            if (amp === 0) {
              // Card 4: Straight flat line
              trackPath = `M 0,${TRACK_Y} L 320,${TRACK_Y}`;
            } else {
              // Cards 1, 2, 3: Scalloped arches whose crests sit exactly at TRACK_Y
              // and dip down by amp px
              trackPath = `
                M 0,${TRACK_Y}
                Q 20,${TRACK_Y + amp} 40,${TRACK_Y}
                Q 60,${TRACK_Y + amp} 80,${TRACK_Y}
                Q 100,${TRACK_Y + amp} 120,${TRACK_Y}
                Q 140,${TRACK_Y + amp} 160,${TRACK_Y}
                Q 180,${TRACK_Y + amp} 200,${TRACK_Y}
                Q 220,${TRACK_Y + amp} 240,${TRACK_Y}
                Q 260,${TRACK_Y + amp} 280,${TRACK_Y}
                Q 300,${TRACK_Y + amp} 320,${TRACK_Y}
              `;
            }

            return (
              <div
                key={lvl.num}
                style={{ 
                  height: `${currentHeight}px`,
                  transition: 'height 0.15s ease-out',
                }}
                className={`relative w-full bg-[#CF1E2C] text-white rounded-[10px] p-[2.5vw] md:p-[1.8vw] flex flex-col justify-between overflow-hidden shadow-md transition-shadow duration-300 ${
                  isActive ? 'ring-2 ring-white/70 shadow-2xl' : 'opacity-95'
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

                {/* ── INDIVIDUAL CARD TRACK: FROM CYLINDRICAL ARCHES TO STRAIGHT LINE ── */}
                {/* Fixed at TRACK_Y from container top; only visible when card is tall enough */}
                {currentHeight >= TRACK_Y + 30 && (
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {/* Dashed baseline through center of ball */}
                    <div 
                      className="absolute left-0 right-0 border-t border-dashed border-white/35 h-0"
                      style={{ top: `${BALL_CENTER_Y}px` }}
                    />
                    
                    {/* The track surface where the ball makes direct contact */}
                    <svg 
                      className="absolute inset-0 w-full h-full overflow-visible text-white/80 stroke-current fill-none stroke-[2]"
                      viewBox="0 0 320 560"
                      preserveAspectRatio="none"
                    >
                      <path d={trackPath} />
                    </svg>
                  </div>
                )}

                {/* ── BOTTOM EDITORIAL TYPOGRAPHY (CLEANLY BELOW TRACK) ── */}
                <div className="z-10 mt-auto pt-[2vh]">
                  <div className="mb-[1vh]">
                    <h3 className="text-[2.4rem] sm:text-[2.8rem] font-extrabold tracking-tight leading-none text-white">
                      {lvl.title}
                    </h3>
                    <div className="text-[2rem] sm:text-[2.3rem] font-serif italic text-white/95 leading-tight">
                      {lvl.italicTitle}
                    </div>
                  </div>

                  <p className="text-[1.3rem] text-white/85 leading-relaxed font-normal line-clamp-3">
                    {lvl.desc}
                  </p>

                  <div className="mt-[1.5vh] pt-[1.2vh] border-t border-white/20 flex items-center justify-between text-[1.1rem] font-mono text-white/70">
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
          {/* Sits EXACTLY on the track at TRACK_Y across the cards */}
          <div 
            className="absolute inset-x-0 pointer-events-none hidden md:block z-20"
            style={{ top: `${BALL_CENTER_Y}px` }}
          >
            {/* The single rolling morphing shape pinned along the dashed baseline */}
            <div 
              className="absolute -top-[38px] -ml-[38px] will-change-transform"
              style={{
                left: `${(p * 0.76 + 0.12) * 100}%`,
              }}
            >
              <div 
                style={{
                  width: `${BALL_RADIUS * 2}px`,
                  height: `${BALL_RADIUS * 2}px`,
                  borderRadius: `${borderRadiusPercent}%`,
                  transform: `rotate(${rotationDeg}deg)`,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: '#FFFFFF',
                  borderWidth: '2.5px',
                  borderStyle: 'solid',
                }}
                className="relative flex items-center justify-center shadow-lg transition-all duration-75"
              >
                {/* Center axis white dot pinned precisely on the dashed baseline */}
                <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
              </div>
            </div>
          </div>

        </div>

        {/* ── MOBILE SCROLL PROGRESS INDICATOR ── */}
        <div className="mt-[3vh] md:hidden flex flex-col gap-2">
          <div className="flex justify-between text-[1.2rem] font-mono text-[#626B73]">
            <span>A1 (Square: 0%)</span>
            <span>B2 (Circle: 100%)</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#CF1E2C] transition-all duration-150"
              style={{ width: `${Math.round(p * 100)}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
