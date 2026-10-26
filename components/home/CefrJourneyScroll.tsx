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
  stageName: string;
  stageSub: string;
  title: string;
  italicTitle: string;
  desc: string;
  initialHeight: number; // Base height before expanding to full height
}

const LEVELS: LevelConfig[] = [
  {
    num: '01',
    level: 'A1',
    stageName: 'Square',
    stageSub: 'Rigid Angles',
    title: 'Discovery',
    italicTitle: '& Phonetics',
    desc: 'We map the rigid angles before we smooth them out. Master phonetics, alphabet, sentence order, and initial survival dialogues.',
    initialHeight: 560, // Starts at full height
  },
  {
    num: '02',
    level: 'A2',
    stageName: 'Octagon',
    stageSub: 'Softening Edges',
    title: 'Connected',
    italicTitle: '& Dialogues',
    desc: 'Angles begin rounding out into rhythm. Form past tense (Perfekt), navigate everyday social settings, and ask questions without freezing.',
    initialHeight: 360, // Rises to 560px
  },
  {
    num: '03',
    level: 'B1',
    stageName: 'Squircle',
    stageSub: 'Flowing Velocity',
    title: 'Spontaneous',
    italicTitle: '& Debate',
    desc: 'Rapid momentum and complex sentence flow. Defend opinions, master Konjunktiv II, and prepare for official Goethe & telc visa exams.',
    initialHeight: 290, // Rises to 560px
  },
  {
    num: '04',
    level: 'B2',
    stageName: 'Circle',
    stageSub: 'Frictionless Fluency',
    title: 'Effortless',
    italicTitle: '& Fluency',
    desc: 'The perfect circle: complete linguistic velocity. Lead workplace presentations, participate in technical debates, and speak instinctively.',
    initialHeight: 220, // Rises to 560px
  },
];

const FULL_HEIGHT = 560;
const BALL_RADIUS = 46;         // 92px diameter
const TRACK_Y = 266;            // FIXED Y coordinate of track crest line
const BALL_CENTER_Y = TRACK_Y - BALL_RADIUS; // 220px (dashed line position)
const NUM_SHAPE_POINTS = 72;    // High density sampling for continuous smooth morphing

export default function CefrJourneyScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Sync GSAP ScrollTrigger with Lenis
  useLenis(() => {
    ScrollTrigger.update();
  });

  // Keep track of container width for responsive SVG path generation
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

  // ── 1. DYNAMIC CARD HEIGHT: CARDS RISE TO FULL HEIGHT ONE BY ONE ──
  const cardHeights = useMemo(() => {
    const h1 = FULL_HEIGHT;
    const t2 = Math.max(0, Math.min(1, (p - 0.05) / 0.27));
    const h2 = Math.round(360 + t2 * (FULL_HEIGHT - 360));

    const t3 = Math.max(0, Math.min(1, (p - 0.32) / 0.30));
    const h3 = Math.round(290 + t3 * (FULL_HEIGHT - 290));

    const t4 = Math.max(0, Math.min(1, (p - 0.62) / 0.30));
    const h4 = Math.round(220 + t4 * (FULL_HEIGHT - 220));

    return [h1, h2, h3, h4];
  }, [p]);

  // ── 2. BIGGER INITIAL BUMPS THAT FLATTEN TOGETHER INTO A STRAIGHT LINE ──
  // Starts with big bold cylindrical arches (amplitude = 34px) in the beginning.
  // The entire line transforms and flattens together from 34px down to 0px as p -> 1!
  const smoothTrackPath = useMemo(() => {
    const W = containerWidth || 1200;
    const wavePeriod = 48; // Wide cylindrical arches
    const numWaves = Math.ceil(W / wavePeriod);
    const segments: string[] = [];

    // Initial bump is 34px (tall and prominent) and decays smoothly to 0px across whole line
    const currentAmp = 34 * Math.pow(Math.max(0, 1 - p), 1.2);

    // Leftmost point starts at initial cusp (dipped down by currentAmp)
    segments.push(`M 0,${(TRACK_Y + currentAmp).toFixed(1)}`);

    for (let i = 0; i < numWaves; i++) {
      const x0 = i * wavePeriod;
      const x1 = Math.min(W, (i + 1) * wavePeriod);
      const xMid = (x0 + x1) / 2;

      if (currentAmp < 0.3) {
        // Pure flat straight line across the entire length
        segments.push(`L ${x1.toFixed(1)},${TRACK_Y}`);
      } else {
        // The arch curves UPWARD:
        // Peak reaches TRACK_Y (yCtrl = TRACK_Y - currentAmp)
        // Cusps dip down to TRACK_Y + currentAmp
        const yCtrl = TRACK_Y - currentAmp;
        const yEnd = TRACK_Y + currentAmp;
        segments.push(`Q ${xMid.toFixed(1)},${yCtrl.toFixed(1)} ${x1.toFixed(1)},${yEnd.toFixed(1)}`);
      }
    }

    return segments.join(' ');
  }, [containerWidth, p]);

  // ── 3. CONTINUOUS SMOOTH MORPHING (ZERO DISCRETE POPPING) ──
  // Mathematically interpolates radius from exact Square (at p=0) to exact Circle (at p=1)
  // using 72 points for a 100% fluid, frame-by-frame continuous geometric transformation!
  const shapeData = useMemo(() => {
    // Initial tilt angle so the square corner dips into the wave trough
    const rotation = 0.28 + p * Math.PI * 4;

    const points: string[] = [];

    for (let i = 0; i < NUM_SHAPE_POINTS; i++) {
      const phi = (i * 2 * Math.PI) / NUM_SHAPE_POINTS;

      // Exact radius of a square aligned at angle phi:
      const cosP = Math.abs(Math.cos(phi));
      const sinP = Math.abs(Math.sin(phi));
      const maxProj = Math.max(cosP, sinP);
      const rSquare = maxProj > 0 ? BALL_RADIUS / maxProj : BALL_RADIUS;

      // Exact radius of a circle:
      const rCircle = BALL_RADIUS;

      // Continuous linear interpolation between square and circle:
      const r = (1 - p) * rSquare + p * rCircle;

      // Apply rolling rotation:
      const angle = phi + rotation;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }

    return {
      points: points.join(' '),
      roundnessPercent: Math.round(p * 100),
    };
  }, [p]);

  const activeIndex = Math.min(3, Math.floor(p * 4));

  // Current stage label based on continuous roundness:
  const morphLabel = useMemo(() => {
    if (p < 0.15) return 'Square (0% Round)';
    if (p < 0.45) return `Filleted Square (${shapeData.roundnessPercent}% Round)`;
    if (p < 0.80) return `Smooth Squircle (${shapeData.roundnessPercent}% Round)`;
    return `Flawless Circle (${shapeData.roundnessPercent}% Round)`;
  }, [p, shapeData.roundnessPercent]);

  // Horizontal position of rolling shape:
  // Starts on the left edge (overlapping left border of Card 01) and journeys to Card 04
  const shapeLeftPercent = 2 + p * 86; // 2% (partially outside) to 88%

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
              Continuous smooth transformation:{' '}
              <span className="italic font-serif text-[#CF1E2C] font-normal">
                {morphLabel}
              </span>
            </p>
            <p className="text-[1.25rem] text-[#626B73]">
              The initial big wave bumps flatten together into a straight line as the square continuously becomes a circle.
            </p>
          </div>
        </div>

        {/* ── 4 RED EDITORIAL CARDS CONTAINER (WITH DYNAMIC EXPANSION) ── */}
        <div 
          ref={trackContainerRef}
          className="relative w-full grid grid-cols-1 md:grid-cols-4 gap-[2vw] md:gap-[1.2vw] items-end"
          style={{ height: `${FULL_HEIGHT}px` }}
        >
          {LEVELS.map((lvl, idx) => {
            const currentHeight = cardHeights[idx];
            const isActive = activeIndex === idx;

            return (
              <div
                key={lvl.num}
                style={{ 
                  height: `${currentHeight}px`,
                  transition: 'height 0.12s ease-out, box-shadow 0.2s ease',
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
                    {isActive && (
                      <span className="text-[1.1rem] font-mono text-white/90 font-bold bg-white/20 px-2 py-0.5 rounded-full">
                        {shapeData.roundnessPercent}% Smooth
                      </span>
                    )}
                    <span className="text-[1.2rem] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                      {lvl.level}
                    </span>
                  </div>
                </div>

                {/* ── BOTTOM EDITORIAL TYPOGRAPHY (WELL BELOW FIXED TRACK) ── */}
                <div className="z-10 mt-auto pt-[2vh]">
                  <div className="mb-[1vh]">
                    <div className="text-[1.2rem] font-mono uppercase tracking-wider text-white/70 mb-1">
                      {lvl.stageName} • {lvl.stageSub}
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
          {/* Sits at a stationary Y position; does NOT move when cards expand upward */}
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none z-10 hidden md:block" 
            style={{ height: `${FULL_HEIGHT}px` }}
          >
            {/* Dashed baseline running straight through the center dot of the shape */}
            <div 
              className="absolute left-[0.5vw] right-[0.5vw] border-t border-dashed border-white/40 h-0"
              style={{ top: `${BALL_CENTER_Y}px` }}
            />

            {/* Continuous SVG track line spanning all 4 cards: entire line flattens together */}
            <svg 
              className="absolute inset-0 w-full h-full overflow-visible text-white/85 stroke-current fill-none stroke-[2.2]"
              style={{ pointerEvents: 'none' }}
            >
              <path d={smoothTrackPath} />
            </svg>
          </div>

          {/* ── CONTINUOUS SCROLL-TRIGGERED ROLLING SHAPE OVERLAY ── */}
          {/* Sits EXACTLY on the track crests at TRACK_Y = 266px across all cards */}
          <div 
            className="absolute inset-x-0 pointer-events-none hidden md:block z-20"
            style={{ top: `${BALL_CENTER_Y}px` }}
          >
            {/* The single rolling morphing shape pinned along the dashed baseline */}
            <div 
              className="absolute -top-[46px] -ml-[46px] will-change-transform"
              style={{
                left: `${shapeLeftPercent}%`,
              }}
            >
              <svg width="92" height="92" viewBox="-46 -46 92 92" className="overflow-visible drop-shadow-md">
                <polygon
                  points={shapeData.points}
                  fill="rgba(255,255,255,0.12)"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                {/* Center axis white dot pinned precisely on the dashed baseline */}
                <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
              </svg>
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
              style={{ width: `${shapeData.roundnessPercent}%` }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
