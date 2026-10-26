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
  shapeName: string;
  sidesLabel: string;
  title: string;
  italicTitle: string;
  desc: string;
}

const LEVELS: LevelConfig[] = [
  {
    num: '01',
    level: 'A1',
    shapeName: 'Square',
    sidesLabel: '4 Sides',
    title: 'Discovery',
    italicTitle: '& Phonetics',
    desc: 'We map the rigid angles before we smooth them out. Master phonetics, alphabet, sentence order, and initial survival dialogues.',
  },
  {
    num: '02',
    level: 'A2',
    shapeName: 'Octagon',
    sidesLabel: '6–8 Sides',
    title: 'Connected',
    italicTitle: '& Dialogues',
    desc: 'Angles begin rounding out into rhythm. Form past tense (Perfekt), navigate everyday social settings, and ask questions without freezing.',
  },
  {
    num: '03',
    level: 'B1',
    shapeName: 'Dodecagon',
    sidesLabel: '12 Sides',
    title: 'Spontaneous',
    italicTitle: '& Debate',
    desc: 'Rapid momentum and complex sentence flow. Defend opinions, master Konjunktiv II, and prepare for official Goethe & telc visa exams.',
  },
  {
    num: '04',
    level: 'B2',
    shapeName: 'Circle',
    sidesLabel: 'Smooth Circle',
    title: 'Effortless',
    italicTitle: '& Fluency',
    desc: 'The perfect circle: complete linguistic velocity. Lead workplace presentations, participate in technical debates, and speak instinctively.',
  },
];

const FULL_HEIGHT = 560;
const BALL_RADIUS = 38; // 76px diameter
const TRACK_Y = 220;    // ROCK-SOLID FIXED Y position of track crests
const BALL_CENTER_Y = TRACK_Y - BALL_RADIUS; // 182px

export default function CefrJourneyScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Sync GSAP ScrollTrigger with Lenis
  useLenis(() => {
    ScrollTrigger.update();
  });

  // Track container width for responsive SVG path generation
  useEffect(() => {
    const updateWidth = () => {
      if (trackContainerRef.current) {
        setContainerWidth(trackContainerRef.current.clientWidth || 1200);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let triggerInstance: ScrollTrigger | null = null;

    const timer = setTimeout(() => {
      triggerInstance = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=2200',
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

  const p = Math.max(0, Math.min(1, scrollProgress));

  // ── 1. PARALLAX STAGGERED RISE (CARDS GLIDE UP ONE AFTER ANOTHER) ──
  // Track does NOT move with the cards; it stays completely fixed in place!
  const getCardTranslateY = (idx: number, progress: number) => {
    const startOffsets = [45, 105, 165, 225];
    const settlePoints = [0.10, 0.22, 0.35, 0.48];

    const settle = settlePoints[idx];
    const t = Math.max(0, Math.min(1, progress / settle));
    const easeOut = 1 - Math.pow(1 - t, 3);
    return Math.round((1 - easeOut) * startOffsets[idx]);
  };

  // ── 2. CONTINUOUS SMOOTH TRACK (FROM CYLINDRICAL ARCHES TO STRAIGHT LINE) ──
  // Arches curve UP to touch TRACK_Y at their crests, smoothly decaying to a flat line!
  const smoothTrackPath = useMemo(() => {
    const W = containerWidth || 1200;
    const wavePeriod = 36; // Scallop wave width
    const numWaves = Math.ceil(W / wavePeriod);
    const segments: string[] = [];

    // Leftmost point starts at first cusp
    const startAmp = 16 * (1 - p * 0.4);
    segments.push(`M 0,${(TRACK_Y + startAmp).toFixed(1)}`);

    for (let i = 0; i < numWaves; i++) {
      const x0 = i * wavePeriod;
      const x1 = Math.min(W, (i + 1) * wavePeriod);
      const xMid = (x0 + x1) / 2;
      const u = xMid / W; // 0 (left) to 1 (right)

      // Continuous decay from 16px at Square down to 0px at Circle
      // Also flattens dynamically as the shape rolls forward!
      const spatialDecay = Math.pow(Math.max(0, 1 - u), 1.5);
      const temporalDecay = 1 - p * 0.5;
      const amp = 16 * spatialDecay * temporalDecay;

      if (amp < 0.4) {
        // Pure flat straight line towards B2 Circle
        segments.push(`L ${x1.toFixed(1)},${TRACK_Y}`);
      } else {
        // Arch curves UPWARD: crest reaches TRACK_Y, cusps dip down to TRACK_Y + amp
        const yCtrl = TRACK_Y - amp;
        const yEnd = TRACK_Y + amp;
        segments.push(`Q ${xMid.toFixed(1)},${yCtrl.toFixed(1)} ${x1.toFixed(1)},${yEnd.toFixed(1)}`);
      }
    }

    return segments.join(' ');
  }, [containerWidth, p]);

  // ── 3. DYNAMIC SIDES: SQUARE -> HEXAGON -> OCTAGON -> DODECAGON -> CIRCLE ──
  const shapeData = useMemo(() => {
    let sides = 4;
    let isCircle = false;

    if (p < 0.20) {
      sides = 4; // Square
    } else if (p < 0.38) {
      sides = 6; // Hexagon
    } else if (p < 0.58) {
      sides = 8; // Octagon
    } else if (p < 0.76) {
      sides = 12; // Dodecagon
    } else if (p < 0.88) {
      sides = 16; // Hexadecagon
    } else {
      sides = 36; // Pure Circle
      isCircle = true;
    }

    // 720 deg rotation rolling forward
    const rotation = p * Math.PI * 4;

    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides + rotation;
      const x = BALL_RADIUS * Math.cos(angle);
      const y = BALL_RADIUS * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return {
      sides,
      isCircle,
      points: points.join(' '),
    };
  }, [p]);

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
              Square to Octagon to Circle:{' '}
              <span className="italic font-serif text-[#CF1E2C] font-normal">
                {LEVELS[activeIndex].shapeName} ({LEVELS[activeIndex].sidesLabel})
              </span>
            </p>
            <p className="text-[1.25rem] text-[#626B73]">
              The track stays fixed as the wavy bumps flatten into a smooth line for effortless rolling.
            </p>
          </div>
        </div>

        {/* ── 4 RED EDITORIAL CARDS CONTAINER (PARALLAX RISE) ── */}
        <div 
          ref={trackContainerRef}
          className="relative w-full grid grid-cols-1 md:grid-cols-4 gap-[2vw] md:gap-[1.2vw] items-end"
          style={{ height: `${FULL_HEIGHT}px` }}
        >
          {LEVELS.map((lvl, idx) => {
            const translateY = getCardTranslateY(idx, p);
            const isActive = activeIndex === idx;

            return (
              <div
                key={lvl.num}
                style={{ 
                  height: `${FULL_HEIGHT}px`,
                  transform: `translateY(${translateY}px)`,
                  transition: 'box-shadow 0.2s ease',
                }}
                className={`relative w-full bg-[#CF1E2C] text-white rounded-[10px] p-[2.5vw] md:p-[1.8vw] flex flex-col justify-between overflow-hidden shadow-md ${
                  isActive ? 'ring-2 ring-white/80 shadow-2xl' : 'opacity-95'
                }`}
              >
                {/* ── TOP BADGE / STEP NUMBER ── */}
                <div className="flex justify-between items-start z-10">
                  <span className="text-[1.4rem] font-mono font-bold tracking-wider text-white/90">
                    {lvl.num}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[1.1rem] font-mono text-white/80 hidden lg:inline">
                      {lvl.sidesLabel}
                    </span>
                    <span className="text-[1.2rem] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                      {lvl.level}
                    </span>
                  </div>
                </div>

                {/* ── BOTTOM EDITORIAL TYPOGRAPHY (WELL BELOW FIXED TRACK) ── */}
                <div className="z-10 mt-auto pt-[2vh]">
                  <div className="mb-[1vh]">
                    <div className="text-[1.2rem] font-mono uppercase tracking-wider text-white/70 mb-1">
                      {lvl.shapeName}
                    </div>
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

          {/* ── FIXED TRACK & BASELINE OVERLAY (100% FIXED IN PLACE) ── */}
          {/* Does NOT move with card translateY; rock-solid stationary position */}
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none z-10 hidden md:block" 
            style={{ height: `${FULL_HEIGHT}px` }}
          >
            {/* Dashed baseline running straight through the center dot of the shape */}
            <div 
              className="absolute left-[1.5vw] right-[1.5vw] border-t border-dashed border-white/40 h-0"
              style={{ top: `${BALL_CENTER_Y}px` }}
            />

            {/* Continuous SVG track line spanning all 4 cards: smoothly flattens from waves to straight line */}
            <svg 
              className="absolute inset-0 w-full h-full overflow-visible text-white/85 stroke-current fill-none stroke-[2.2]"
              style={{ pointerEvents: 'none' }}
            >
              <path d={smoothTrackPath} />
            </svg>
          </div>

          {/* ── CONTINUOUS SCROLL-TRIGGERED ROLLING SHAPE OVERLAY ── */}
          {/* Sits EXACTLY on the track crests at TRACK_Y = 220px across all cards */}
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
              <svg width="76" height="76" viewBox="-38 -38 76 76" className="overflow-visible drop-shadow-md">
                {shapeData.isCircle ? (
                  <circle
                    cx="0"
                    cy="0"
                    r={BALL_RADIUS}
                    fill="rgba(255,255,255,0.12)"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                ) : (
                  <polygon
                    points={shapeData.points}
                    fill="rgba(255,255,255,0.12)"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
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
            <span>A1 ({LEVELS[0].shapeName})</span>
            <span>B2 ({LEVELS[3].shapeName})</span>
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
