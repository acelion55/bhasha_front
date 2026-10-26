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
  initialHeight: number; // Base height before expanding to full height
}

const LEVELS: LevelConfig[] = [
  {
    num: '01',
    level: 'A1',
    title: 'Discovery',
    italicTitle: '& Phonetics',
    desc: 'We map the rigid angles before we smooth them out. Master phonetics, alphabet, sentence order, and initial survival dialogues.',
    initialHeight: 560, // Starts at full height
  },
  {
    num: '02',
    level: 'A2',
    title: 'Connected',
    italicTitle: '& Dialogues',
    desc: 'Angles begin rounding out into rhythm. Form past tense (Perfekt), navigate everyday social settings, and ask questions without freezing.',
    initialHeight: 360, // Rises to 560px
  },
  {
    num: '03',
    level: 'B1',
    title: 'Spontaneous',
    italicTitle: '& Debate',
    desc: 'Rapid momentum and complex sentence flow. Defend opinions, master Konjunktiv II, and prepare for official Goethe & telc visa exams.',
    initialHeight: 290, // Rises to 560px
  },
  {
    num: '04',
    level: 'B2',
    title: 'Effortless',
    italicTitle: '& Fluency',
    desc: 'The perfect circle: complete linguistic velocity. Lead workplace presentations, participate in technical debates, and speak instinctively.',
    initialHeight: 220, // Rises to 560px
  },
];

const FULL_HEIGHT = 560;
const HALF_SIDE = 32;                   // Half-length of square side (side length S = 64px)
const BALL_RADIUS = Math.round(HALF_SIDE * Math.SQRT2); // 45px (center to corner of square)
const BUMP_PERIOD = 64;                 // Each bump width matches square side length S = 64px!
const CREST_Y = 254;                    // Fixed Y coordinate of bump crests
const BALL_CENTER_Y = CREST_Y - HALF_SIDE; // 222px (fixed horizontal center baseline)
const MAX_BUMP_AMP = 22;                // Max bump depth (troughs dip by 22px)

// Dynamic shape sides: increases one-by-one
function getShapeInfo(p: number) {
  if (p < 0.12) return { sides: 4, name: 'Square', label: '4 Sides' };
  if (p < 0.22) return { sides: 5, name: 'Pentagon', label: '5 Sides' };
  if (p < 0.32) return { sides: 6, name: 'Hexagon', label: '6 Sides' };
  if (p < 0.42) return { sides: 7, name: 'Heptagon', label: '7 Sides' };
  if (p < 0.52) return { sides: 8, name: 'Octagon', label: '8 Sides' };
  if (p < 0.62) return { sides: 9, name: 'Nonagon', label: '9 Sides' };
  if (p < 0.72) return { sides: 10, name: 'Decagon', label: '10 Sides' };
  if (p < 0.80) return { sides: 11, name: 'Hendecagon', label: '11 Sides' };
  if (p < 0.88) return { sides: 12, name: 'Dodecagon', label: '12 Sides' };
  if (p < 0.95) return { sides: 16, name: 'Hexadecagon', label: '16 Sides' };
  return { sides: 36, name: 'Circle', label: 'Smooth Circle' };
}

export default function CefrJourneyScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Sync GSAP ScrollTrigger with Lenis
  useLenis(() => {
    ScrollTrigger.update();
  });

  // Track container width
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

  // ── 1. DYNAMIC CARD HEIGHT: EXPANDS UPWARD ONE BY ONE ──
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

  // ── 2. CURRENT SHAPE INFO (SIDES INCREASE ONE BY ONE) ──
  const currentShape = useMemo(() => {
    return getShapeInfo(p);
  }, [p]);

  // ── 3. MATHEMATICAL BUMP AMPLITUDE TIED TO POLYGON SIDES ──
  // For an N-sided polygon, required bump height is proportional to (1 - cos(pi / N)).
  // For Square (N=4), amplitude is max (22px). For Circle, amplitude decays to 0px!
  const currentAmp = useMemo(() => {
    const N = currentShape.sides;
    const denom = 1 - Math.cos(Math.PI / 4); // Square baseline
    const ratio = (1 - Math.cos(Math.PI / N)) / denom;
    return MAX_BUMP_AMP * Math.max(0, Math.min(1, ratio));
  }, [currentShape.sides]);

  // ── 4. CONTINUOUS BUMP TRACK SVG ──
  // Bump width BUMP_PERIOD (64px) matches the square's side length (64px).
  // Cusps (troughs) are at i * BUMP_PERIOD, crests are at (i + 0.5) * BUMP_PERIOD.
  // The square's corner fits right into the trough between bumps!
  const smoothTrackPath = useMemo(() => {
    const W = containerWidth || 1200;
    const numWaves = Math.ceil(W / BUMP_PERIOD);
    const segments: string[] = [];

    // Trough Y: CREST_Y + currentAmp
    const yTrough = CREST_Y + currentAmp;
    segments.push(`M 0,${yTrough.toFixed(1)}`);

    for (let i = 0; i < numWaves; i++) {
      const x0 = i * BUMP_PERIOD;
      const x1 = Math.min(W, (i + 1) * BUMP_PERIOD);
      const xMid = (x0 + x1) / 2;

      if (currentAmp < 0.4) {
        // Flat straight line
        segments.push(`L ${x1.toFixed(1)},${CREST_Y}`);
      } else {
        // Arch curves UP: crest touches CREST_Y (yCtrl = CREST_Y - currentAmp)
        // Cusps dip down to yTrough
        const yCtrl = CREST_Y - currentAmp;
        segments.push(`Q ${xMid.toFixed(1)},${yCtrl.toFixed(1)} ${x1.toFixed(1)},${yTrough.toFixed(1)}`);
      }
    }

    return segments.join(' ');
  }, [containerWidth, currentAmp]);

  // ── 5. ROLLING SHAPE POSITION & PHYSICAL SYNCHRONIZED ROTATION ──
  // Width bounds:
  const W = containerWidth || 1200;
  // Start position X0 is aligned so square corner is centered right between bumps (at a trough):
  const startX = 32;
  const endX = W - 54;
  const currentX = startX + p * (endX - startX);

  // Synchronized rolling rotation:
  // Traveling one bump width (64px) rotates the square by exactly 90 degrees (pi / 2)!
  // At startX (p=0), initial rotation is 45 deg (pi / 4) so bottom corner dips straight into the trough!
  const traveledDistance = currentX - startX;
  const rotation = (Math.PI / 4) + (traveledDistance / BUMP_PERIOD) * (Math.PI / 2);

  const shapeData = useMemo(() => {
    const sides = currentShape.sides;
    const isCircle = sides >= 32;

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
  }, [currentShape.sides, rotation]);

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
              Square on Catenary Road:{' '}
              <span className="italic font-serif text-[#CF1E2C] font-normal">
                {currentShape.name} ({currentShape.label})
              </span>
            </p>
            <p className="text-[1.25rem] text-[#626B73]">
              Square side matches bump surface • Corners dip between bumps • Sides increase step-by-step
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
                        {currentShape.label}
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
                      {idx === activeIndex ? currentShape.name : idx === 0 ? 'Square' : idx === 1 ? 'Octagon' : idx === 2 ? 'Dodecagon' : 'Circle'}
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
          <div 
            className="absolute inset-x-0 top-0 pointer-events-none z-10 hidden md:block" 
            style={{ height: `${FULL_HEIGHT}px` }}
          >
            {/* Dashed baseline running straight through center axis */}
            <div 
              className="absolute left-[0.5vw] right-[0.5vw] border-t border-dashed border-white/40 h-0"
              style={{ top: `${BALL_CENTER_Y}px` }}
            />

            {/* Continuous SVG track line: bumps flatten as polygon gains more sides */}
            <svg 
              className="absolute inset-0 w-full h-full overflow-visible text-white/85 stroke-current fill-none stroke-[2.2]"
              style={{ pointerEvents: 'none' }}
            >
              <path d={smoothTrackPath} />
            </svg>
          </div>

          {/* ── ROLLING SHAPE OVERLAY (PHYSICALLY SYNCHRONIZED ON TRACK) ── */}
          <div 
            className="absolute inset-x-0 pointer-events-none hidden md:block z-20"
            style={{ top: `${BALL_CENTER_Y}px` }}
          >
            <div 
              className="absolute -top-[45px] -ml-[45px] will-change-transform"
              style={{
                left: `${currentX}px`,
              }}
            >
              <svg width="90" height="90" viewBox="-45 -45 90 90" className="overflow-visible drop-shadow-md">
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
            <span>A1 (Square: 4 Sides)</span>
            <span>B2 (Circle: Smooth)</span>
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
