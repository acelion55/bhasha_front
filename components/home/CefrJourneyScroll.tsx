'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { ArrowRight, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ProcessCardItem {
  num: string;
  badge?: string;
  title: string;
  italicTitle: string;
  desc: string;
  shapeName: string;
}

const DEFAULT_CARDS: ProcessCardItem[] = [
  {
    num: '01',
    badge: 'A1 • Foundation',
    title: 'Discovery',
    italicTitle: '& Strategy',
    desc: 'We map the angles before we smooth them out. Where you are, where you’re going, and what’s standing in between.',
    shapeName: 'Square (4 Sides)',
  },
  {
    num: '02',
    badge: 'A2 • Building',
    title: 'Design',
    italicTitle: 'Iterations',
    desc: 'Brand, visual systems, and structured flow — crafted into something credible, bespoke, and built to last. No templates.',
    shapeName: 'Hexagon (6 Sides)',
  },
  {
    num: '03',
    badge: 'B1 • Momentum',
    title: 'Precision',
    italicTitle: 'Build',
    desc: 'We build with the precision of a designer and the velocity of developers who have solved it a hundred times.',
    shapeName: 'Octagon (8 Sides)',
  },
  {
    num: '04',
    badge: 'B2 • Fluency',
    title: 'Post-launch',
    italicTitle: 'Support',
    desc: 'We don’t force you to fit our process. It is the process that bends to keep you comfortable and rolling regardless.',
    shapeName: 'Circle (Smooth)',
  },
];

/* ── Mathematical Catenary & Ideal Vertices Helpers ────────── */
const idealCache: Record<number, Float64Array> = {};

function idealVerts(n: number, r: number): Float64Array {
  let base = idealCache[n];
  if (!base) {
    base = new Float64Array(n * 2);
    for (let i = 0; i < n; i++) {
      const a = Math.PI / 2 + (2 * Math.PI * i) / n;
      base[i * 2] = Math.cos(a);
      base[i * 2 + 1] = Math.sin(a);
    }
    idealCache[n] = base;
  }
  const v = new Float64Array(n * 2);
  for (let i = 0; i < n * 2; i++) v[i] = base[i] * r;
  return v;
}

function alignedIdealVerts(n: number, r: number, refx: number, refy: number): Float64Array {
  const raw = idealVerts(n, r);
  const refAngle = Math.atan2(refy, refx);
  let best = 0;
  let bestDiff = Infinity;
  for (let o = 0; o < n; o++) {
    const a = Math.atan2(raw[o * 2 + 1], raw[o * 2]);
    let d = Math.abs(a - refAngle);
    if (d > Math.PI) d = 2 * Math.PI - d;
    if (d < bestDiff) {
      bestDiff = d;
      best = o;
    }
  }
  const out = new Float64Array(n * 2);
  for (let i = 0; i < n; i++) {
    const s = ((i + best) % n) * 2;
    out[i * 2] = raw[s];
    out[i * 2 + 1] = raw[s + 1];
  }
  return out;
}

function continuousVerts(nf: number, r: number): Float64Array {
  const nLo = Math.floor(nf);
  const frac = nf - nLo;
  if (frac < 1e-9) return idealVerts(nLo, r);

  const nHi = nLo + 1;
  const base = idealVerts(nLo, r);
  const start = new Float64Array(nHi * 2);
  start[0] = base[0];
  start[1] = base[1];
  start[2] = (base[0] + base[2]) / 2;
  start[3] = (base[1] + base[3]) / 2;
  for (let i = 2; i < nHi; i++) {
    start[i * 2] = base[(i - 1) * 2];
    start[i * 2 + 1] = base[(i - 1) * 2 + 1];
  }
  const target = alignedIdealVerts(nHi, r, base[0], base[1]);
  const out = new Float64Array(nHi * 2);
  for (let i = 0; i < nHi * 2; i++) {
    out[i] = start[i] + (target[i] - start[i]) * frac;
  }
  return out;
}

const easeInOut = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CefrJourneyScroll({
  cards = DEFAULT_CARDS,
  brandColor = '#CF1E2C',
}: {
  cards?: ProcessCardItem[];
  brandColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const coverRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStep, setActiveStep] = useState(0);
  const [currentShapeLabel, setCurrentShapeLabel] = useState('Square (4 Sides)');

  // Maintain progress ref so canvas render loop always has latest smooth progress
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);

  // Lenis synchronization
  useLenis(() => {
    ScrollTrigger.update();
  });

  /* ── GSAP ScrollTrigger with Rock-Solid Pinning ───────────── */
  useEffect(() => {
    const pinTarget = pinnedSectionRef.current;
    const cardsWrap = cardsWrapRef.current;
    if (!pinTarget) return;

    let st: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      st = ScrollTrigger.create({
        trigger: pinTarget,
        start: 'top top',
        end: '+=2600',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          targetProgressRef.current = p;

          // 1. Card covers: liquid rising fill 0% -> 100%
          // Card 1: 0.00 -> 0.25
          const c1 = Math.max(0, Math.min(1, p / 0.25));
          if (coverRefs.current[0]) {
            coverRefs.current[0]!.style.height = `${c1 * 100}%`;
          }

          // Card 2: 0.25 -> 0.50
          const c2 = Math.max(0, Math.min(1, (p - 0.25) / 0.25));
          if (coverRefs.current[1]) {
            coverRefs.current[1]!.style.height = `${c2 * 100}%`;
          }

          // Card 3: 0.50 -> 0.75
          const c3 = Math.max(0, Math.min(1, (p - 0.50) / 0.25));
          if (coverRefs.current[2]) {
            coverRefs.current[2]!.style.height = `${c3 * 100}%`;
          }

          // Card 4: 0.75 -> 1.00
          const c4 = Math.max(0, Math.min(1, (p - 0.75) / 0.25));
          if (coverRefs.current[3]) {
            coverRefs.current[3]!.style.height = `${c4 * 100}%`;
          }

          // Update active card index
          if (p < 0.25) setActiveStep(0);
          else if (p < 0.50) setActiveStep(1);
          else if (p < 0.75) setActiveStep(2);
          else setActiveStep(3);

          // 2. Mobile horizontal translation so cards follow wheel
          if (cardsWrap && window.innerWidth <= 991) {
            const isMobile = window.innerWidth <= 767;
            const maxTranslate = isMobile ? -298 : -100;
            const xVal = p * maxTranslate;
            cardsWrap.style.transform = `translate3d(${xVal}%, 0, 0)`;
          } else if (cardsWrap) {
            cardsWrap.style.transform = 'translate3d(0, 0, 0)';
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      if (st) st.kill();
    };
  }, []);

  /* ── Canvas Physics Engine (Inverted Catenary & Polygon) ──── */
  useEffect(() => {
    const pinTarget = pinnedSectionRef.current;
    const canvas = canvasRef.current;
    if (!pinTarget || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const N_MIN = 4;
    const N_MAX = 12;
    const C_LINE = brandColor;
    const C_AXLE = 'rgba(207, 30, 44, 0.45)';
    const MOBILE_BP = 767;
    const TABLET_BP = 991;
    const PHASE2 = 0.35;
    const SMOOTHING = 0.18;
    const STOP_EPSILON = 0.0005;

    let W = 0;
    let H = 0;
    let R = 0;
    let dpr = 1;
    let isMobile = false;
    let isTabletOrMobile = false;
    let rafId: number | null = null;

    let xLeft = 0;
    let xRight = 0;

    function resize() {
      if (!pinTarget || !canvas || !ctx) return;
      dpr = window.devicePixelRatio || 1;
      const cssW = pinTarget.clientWidth || window.innerWidth;
      const cssH = pinTarget.clientHeight || window.innerHeight;

      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      W = cssW;
      H = cssH;
      isMobile = W <= MOBILE_BP;
      isTabletOrMobile = W <= TABLET_BP;

      const RADIUS_SCALE = isMobile ? 0.095 : 0.075;
      R = Math.max(36, Math.min(W, H) * RADIUS_SCALE);

      // Start visible inside the viewport so Square (4 sides) is clearly seen at start!
      xLeft = isMobile ? R + 20 : R + 48;
      xRight = W - (isMobile ? R + 20 : R + 48);

      render(progressRef.current);
    }

    function render(p: number) {
      if (!ctx) return;
      const t = Math.max(0, Math.min(1, p));
      const span = xRight - xLeft;
      const wheelX = lerp(xLeft, xRight, t);

      const tMorph = easeInOut(t);
      const tPoly = Math.min(tMorph / PHASE2, 1);
      const tCirc = Math.max(0, (tMorph - PHASE2) / (1 - PHASE2));
      const circT = easeInOut(tCirc);

      const nf = N_MIN + tPoly * (N_MAX - N_MIN);
      const nLo = Math.floor(nf);
      const nHi = Math.min(N_MAX, nLo + 1);
      const frac = nf - nLo;

      const sLo = 2 * R * Math.sin(Math.PI / nLo);
      const sHi = 2 * R * Math.sin(Math.PI / nHi);
      const s = lerp(sLo, sHi, frac);

      const aLo = R * Math.cos(Math.PI / nLo);
      const aHi = R * Math.cos(Math.PI / nHi);
      const a = lerp(aLo, aHi, frac);

      // Vertical position of the road relative to cards below
      const bottomCardsHeight = isMobile ? 320 : 360;
      const roadPeakY = Math.max(160, (H - bottomCardsHeight) * 0.62 + a);
      const axleY = roadPeakY - (a + (R - a) * circT);

      ctx.clearRect(0, 0, W, H);

      /* ── 1. Inverted Catenary Arches Road ── */
      const firstPeakX = xLeft + Math.ceil((-xLeft - s) / s) * s;
      const numArches = Math.ceil((W + s * 2) / s) + 2;
      const steps = Math.max(48, Math.round(s));
      const invA = 1 / a;
      const oneMinusCirc = 1 - circT;

      ctx.beginPath();
      for (let ai = 0; ai < numArches; ai++) {
        const peakX = firstPeakX + ai * s;
        const archLeft = peakX - s / 2;
        for (let si = 0; si <= steps; si++) {
          const frac2 = si / steps;
          const lx = archLeft + frac2 * s;
          const localX = lx - peakX;
          const catenaryY = roadPeakY + a * Math.cosh(localX * invA) - a;
          const worldY = catenaryY * oneMinusCirc + roadPeakY * circT;
          if (si === 0) ctx.moveTo(lx, worldY);
          else ctx.lineTo(lx, worldY);
        }
      }
      ctx.strokeStyle = C_LINE;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      /* ── 2. Axle Guide (Constant Flat Horizontal Line) ── */
      ctx.save();
      ctx.strokeStyle = C_AXLE;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.moveTo(0, axleY);
      ctx.lineTo(W, axleY);
      ctx.stroke();
      ctx.restore();

      /* ── 3. Rolling Shape with Spokes ── */
      const d = t * span;
      const rotation = (d / s) * (2 * Math.PI / nf) - Math.PI / nf;
      const verts = continuousVerts(nf, R);
      const vCount = verts.length / 2;

      ctx.save();
      ctx.translate(wheelX, axleY);
      ctx.rotate(rotation);
      ctx.beginPath();

      if (circT < 0.999) {
        const STEPS = isMobile ? 90 : 360;
        const per = vCount / STEPS;
        for (let i = 0; i <= STEPS; i++) {
          const vi = i * per;
          const vi0 = Math.floor(vi) % vCount;
          const vi1 = (vi0 + 1) % vCount;
          const vf = vi - Math.floor(vi);
          const px = lerp(verts[vi0 * 2], verts[vi1 * 2], vf);
          const py = lerp(verts[vi0 * 2 + 1], verts[vi1 * 2 + 1], vf);
          const pr = Math.sqrt(px * px + py * py);
          const scale = lerp(pr, R, circT) / pr;
          const bx = px * scale;
          const by = py * scale;
          if (i === 0) ctx.moveTo(bx, by);
          else ctx.lineTo(bx, by);
        }
        ctx.closePath();
      } else {
        ctx.arc(0, 0, R, 0, Math.PI * 2);
      }

      ctx.strokeStyle = C_LINE;
      ctx.lineWidth = 2.4;
      ctx.stroke();

      // Center Axle Pin Dot
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = C_LINE;
      ctx.fill();
      ctx.restore();

      // Update shape name badge
      if (circT > 0.8) {
        setCurrentShapeLabel('Smooth Circle (Effortless)');
      } else {
        const currentSides = Math.round(nf);
        if (currentSides === 4) setCurrentShapeLabel('Square (4 Sides)');
        else if (currentSides <= 6) setCurrentShapeLabel('Hexagon (6 Sides)');
        else if (currentSides <= 8) setCurrentShapeLabel('Octagon (8 Sides)');
        else if (currentSides <= 10) setCurrentShapeLabel('Decagon (10 Sides)');
        else setCurrentShapeLabel('Dodecagon (12 Sides)');
      }
    }

    function loop() {
      const target = targetProgressRef.current;
      progressRef.current = lerp(progressRef.current, target, SMOOTHING);
      if (Math.abs(target - progressRef.current) < STOP_EPSILON) {
        progressRef.current = target;
      }

      render(progressRef.current);
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [brandColor]);

  return (
    <div ref={containerRef} className="w-full relative">
      {/* ── Rock-Solid GSAP-Pinned Section ── */}
      <section
        id="process"
        ref={pinnedSectionRef}
        className="w-full h-screen min-h-[640px] max-h-[1080px] bg-[#FAF9F6] text-[#20252A] flex flex-col justify-between py-6 md:py-8 px-4 md:px-8 overflow-hidden select-none"
      >
        {/* Top Header Row */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto flex items-start sm:items-end justify-between gap-4">
          <div className="max-w-[580px]">
            {/* Design + Strategy Row */}
            <div className="flex items-center gap-2 text-[1.1rem] md:text-[1.25rem] font-mono tracking-widest text-[#CF1E2C] uppercase mb-2">
              <span>Design</span>
              <span className="opacity-50">+</span>
              <span>Strategy</span>
              <span className="opacity-50">+</span>
              <span>Velocity</span>
              <span className="opacity-50">=</span>
              <span className="font-bold underline decoration-2">Full Circle</span>
            </div>

            <p className="text-[1.6rem] sm:text-[2.2rem] md:text-[2.6rem] font-extrabold leading-[1.1] tracking-tight text-[#20252A]">
              The road can get <span className="font-serif italic text-[#CF1E2C] font-normal">bumpy</span>. We keep you{' '}
              <span className="font-serif italic text-[#CF1E2C] font-normal">rolling</span> regardless.
            </p>

            {/* A -> B Badge */}
            <div className="mt-2.5 inline-flex items-center gap-2 text-[#CF1E2C] font-mono text-[1.15rem] md:text-[1.25rem] font-bold">
              <span className="px-2 py-0.5 rounded border border-[#CF1E2C]/30 bg-[#CF1E2C]/5">A</span>
              <span className="flex items-center">
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </span>
              <span className="px-2 py-0.5 rounded border border-[#CF1E2C]/30 bg-[#CF1E2C]/5">B</span>
              <span className="ml-2 text-[#626B73] font-normal text-[1.1rem]">
                • Constant Axle Height ({currentShapeLabel})
              </span>
            </div>
          </div>

          {/* Right: Oval Pill Badge */}
          <div className="border border-[#CF1E2C] rounded-full px-5 py-2 sm:px-7 sm:py-2.5 text-[#CF1E2C] font-serif italic text-[1.4rem] sm:text-[1.7rem] tracking-wide shadow-xs bg-white/80 backdrop-blur-xs flex-none">
            Our Process
          </div>
        </div>

        {/* Catenary Physics Canvas Overlay */}
        <canvas
          id="pw-canvas"
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-1"
        />

        {/* Bottom Cards Flex Wrap */}
        <div className="relative z-10 w-full max-w-[1720px] mx-auto">
          <div
            ref={cardsWrapRef}
            className="flex flex-nowrap gap-3 md:gap-4 items-end transition-transform duration-75 ease-out w-full"
          >
            {cards.map((card, idx) => {
              const isActive = activeStep === idx;

              return (
                <div
                  key={card.num}
                  className="relative flex-none md:flex-1 w-[88vw] sm:w-[48vw] md:w-auto h-[240px] sm:h-[280px] md:h-[300px] rounded-[14px] p-5 md:p-6 flex flex-col justify-between overflow-hidden bg-white/95 backdrop-blur-xs shadow-md"
                  style={{
                    transformOrigin: '50% 100%',
                  }}
                >
                  {/* The Signature Liquid Red Fill: 0% -> 100% */}
                  <div
                    ref={(el) => {
                      coverRefs.current[idx] = el;
                    }}
                    className="absolute inset-x-0 bottom-0 bg-[#CF1E2C] z-0 pointer-events-none"
                    style={{ height: '0%' }}
                  />

                  {/* Header in Card */}
                  <div className="relative z-10 flex items-start justify-between">
                    <span className={`font-mono text-[1.6rem] md:text-[1.8rem] font-bold transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-[#CF1E2C]'
                    }`}>
                      {card.num}
                    </span>
                    {card.badge && (
                      <span className={`font-mono text-[1.05rem] md:text-[1.15rem] px-2.5 py-0.5 rounded-full transition-colors duration-200 ${
                        isActive
                          ? 'text-white bg-white/20'
                          : 'text-[#CF1E2C] bg-[#CF1E2C]/10'
                      }`}>
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Body in Card: Red when red background has not appeared, White when active */}
                  <div className="relative z-10 mt-auto">
                    <h3 className={`text-[1.9rem] sm:text-[2.2rem] md:text-[2.4rem] font-extrabold leading-[1.1] transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-[#CF1E2C]'
                    }`}>
                      {card.title} <br />
                      <span className={`font-serif italic font-normal transition-colors duration-200 ${
                        isActive ? 'text-white/90' : 'text-[#CF1E2C]'
                      }`}>
                        {card.italicTitle}
                      </span>
                    </h3>
                    <p className={`mt-2 text-[1.2rem] sm:text-[1.3rem] leading-relaxed line-clamp-3 transition-colors duration-200 ${
                      isActive ? 'text-white/90' : 'text-[#CF1E2C]/85'
                    }`}>
                      {card.desc}
                    </p>

                    <div className={`mt-3 pt-2.5 flex items-center justify-between text-[1.05rem] font-mono transition-colors duration-200 ${
                      isActive
                        ? 'text-white/80'
                        : 'text-[#CF1E2C]/75'
                    }`}>
                      <span>PHASE {idx + 1} OF 4</span>
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
          </div>

          {/* Mobile / Tablet Step Guide */}
          <div className="mt-2.5 md:hidden flex justify-between items-center text-[1.15rem] font-mono text-[#718096]">
            <span>Scroll to roll shape & progress cards</span>
            <span>Stage {activeStep + 1} / 4</span>
          </div>
        </div>
      </section>
    </div>
  );
}
