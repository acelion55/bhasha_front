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
  brandColor = '#173B63',
}: {
  cards?: ProcessCardItem[];
  brandColor?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedSectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsWrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
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

          // 1. Staggered Parallax Rise of the 4 sections
          // Card 0 rises first (0.00 -> 0.10)
          // Card 1 rises next (0.025 -> 0.14)
          // Card 2 rises next (0.05 -> 0.18)
          // Card 3 rises next (0.075 -> 0.22)
          const PARALLAX_DIST = [140, 210, 280, 350];
          cards.forEach((_, idx) => {
            const el = cardRefs.current[idx];
            if (!el) return;
            const pStart = idx * 0.025;
            const pEnd = 0.10 + idx * 0.04;
            const tCard = Math.max(0, Math.min(1, (p - pStart) / (pEnd - pStart)));
            const eased = 1 - Math.pow(1 - tCard, 3);
            const yOffset = PARALLAX_DIST[idx] * (1 - eased);
            el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
          });

          // 2. Liquid rising fill starts when Card 0 crosses track (p >= 0.10)
          const P_CROSS = 0.10;
          const pRoll = Math.max(0, Math.min(1, (p - P_CROSS) / (1 - P_CROSS)));

          // Card 0: 0.00 -> 0.25
          const c1 = Math.max(0, Math.min(1, pRoll / 0.25));
          if (coverRefs.current[0]) {
            coverRefs.current[0]!.style.height = `${c1 * 100}%`;
          }

          // Card 1: 0.25 -> 0.50
          const c2 = Math.max(0, Math.min(1, (pRoll - 0.25) / 0.25));
          if (coverRefs.current[1]) {
            coverRefs.current[1]!.style.height = `${c2 * 100}%`;
          }

          // Card 2: 0.50 -> 0.75
          const c3 = Math.max(0, Math.min(1, (pRoll - 0.50) / 0.25));
          if (coverRefs.current[2]) {
            coverRefs.current[2]!.style.height = `${c3 * 100}%`;
          }

          // Card 3: 0.75 -> 1.00
          const c4 = Math.max(0, Math.min(1, (pRoll - 0.75) / 0.25));
          if (coverRefs.current[3]) {
            coverRefs.current[3]!.style.height = `${c4 * 100}%`;
          }

          // Update active card index based on wheel progression
          if (pRoll < 0.25) setActiveStep(0);
          else if (pRoll < 0.50) setActiveStep(1);
          else if (pRoll < 0.75) setActiveStep(2);
          else setActiveStep(3);

          // 3. Mobile horizontal translation so cards follow wheel
          if (cardsWrap && window.innerWidth <= 991) {
            const isMobile = window.innerWidth <= 767;
            const maxTranslate = isMobile ? -298 : -100;
            const xVal = pRoll * maxTranslate;
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
    const C_BRAND = brandColor || '#173B63';
    const C_AXLE_BRAND = 'rgba(23, 59, 99, 0.45)';
    const C_WHITE = '#FFFFFF';
    const C_AXLE_WHITE = 'rgba(255, 255, 255, 0.75)';
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

      const RADIUS_SCALE = isMobile ? 0.09 : 0.07;
      R = Math.max(34, Math.min(W, H) * RADIUS_SCALE);

      // Align xLeft & xRight to cards container on desktop, or viewport on mobile
      if (!isTabletOrMobile && cardsWrapRef.current && pinTarget) {
        const cRect = cardsWrapRef.current.getBoundingClientRect();
        const pRect = pinTarget.getBoundingClientRect();
        if (cRect.width > 0) {
          const pad = R + 12;
          xLeft = Math.max(pad, cRect.left - pRect.left + pad);
          xRight = Math.min(W - pad, cRect.right - pRect.left - pad);
        } else {
          xLeft = R + 12;
          xRight = W - (R + 12);
        }
      } else {
        xLeft = isMobile ? R + 12 : R + 20;
        xRight = W - (isMobile ? R + 12 : R + 20);
      }

      render(progressRef.current);
    }

    function render(p: number) {
      if (!ctx) return;

      // Wheel starts moving once Card 0 crosses track (P_CROSS = 0.10)
      const P_CROSS = 0.10;
      const tRoll = Math.max(0, Math.min(1, (p - P_CROSS) / (1 - P_CROSS)));

      const tMorph = easeInOut(tRoll);
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

      // Vertical position of the track inside the cards section
      let cardsLeft = 0;
      let cardsRight = W;
      let cardTop = H * 0.32;
      let cardH = isMobile ? 380 : 480;

      if (cardsWrapRef.current && pinTarget) {
        const cRect = cardsWrapRef.current.getBoundingClientRect();
        const pRect = pinTarget.getBoundingClientRect();
        if (cRect.width > 0) {
          cardsLeft = Math.max(0, cRect.left - pRect.left);
          cardsRight = Math.min(W, cRect.right - pRect.left);
          cardTop = cRect.top - pRect.top;
          cardH = cRect.height;
        }
      }

      // Starting position: OUTSIDE Card 01 to the left (hidden by clip until it rolls into the section)
      const xStartOutside = cardsLeft - R * 1.6;
      const xEnd = cardsRight - R - 12;
      const span = xEnd - xStartOutside;
      const wheelX = lerp(xStartOutside, xEnd, tRoll);

      // Track passes inside the cards in the open space between card header and body text
      // Track is completely FIXED at resting height
      const roadPeakY = cardTop + cardH * 0.35 + a;
      const axleY = roadPeakY - (a + (R - a) * circT);

      ctx.clearRect(0, 0, W, H);

      const c = ctx;

      /* ── Shared Physics Drawing Function for Dual Pass (Red & White) ── */
      const firstPeakX = cardsLeft + Math.ceil((-cardsLeft - s) / s) * s;
      const numArches = Math.ceil((cardsRight - cardsLeft + s * 2) / s) + 2;
      const steps = Math.max(48, Math.round(s));
      const invA = 1 / a;
      const oneMinusCirc = 1 - circT;

      const d = tRoll * span;
      const rotation = (d / s) * (2 * Math.PI / nf) - Math.PI / nf;
      const verts = continuousVerts(nf, R);
      const vCount = verts.length / 2;

      function drawScene(lineColor: string, axleColor: string, shadow: string) {
        /* ── 1. Inverted Catenary Arches Road ── */
        c.beginPath();
        for (let ai = 0; ai < numArches; ai++) {
          const peakX = firstPeakX + ai * s;
          const archLeft = peakX - s / 2;
          for (let si = 0; si <= steps; si++) {
            const frac2 = si / steps;
            const lx = archLeft + frac2 * s;
            const localX = lx - peakX;
            const catenaryY = roadPeakY + a * Math.cosh(localX * invA) - a;
            const worldY = catenaryY * oneMinusCirc + roadPeakY * circT;
            if (si === 0) c.moveTo(lx, worldY);
            else c.lineTo(lx, worldY);
          }
        }
        c.save();
        c.strokeStyle = lineColor;
        c.lineWidth = 2.4;
        c.shadowColor = shadow;
        c.shadowBlur = 4;
        c.stroke();
        c.restore();

        /* ── 2. Axle Guide (Constant Flat Horizontal Line - Stops Outside Wheel) ── */
        c.save();
        c.strokeStyle = axleColor;
        c.lineWidth = 1.6;
        c.setLineDash([6, 8]);
        c.shadowColor = shadow;
        c.shadowBlur = 3;
        c.beginPath();
        const leftEnd = Math.max(cardsLeft, wheelX - R);
        if (leftEnd > cardsLeft) {
          c.moveTo(cardsLeft, axleY);
          c.lineTo(leftEnd, axleY);
        }
        const rightStart = Math.min(cardsRight, wheelX + R);
        if (rightStart < cardsRight) {
          c.moveTo(rightStart, axleY);
          c.lineTo(cardsRight, axleY);
        }
        c.stroke();
        c.restore();

        /* ── 3. Rolling Shape ── */
        c.save();
        c.translate(wheelX, axleY);
        c.rotate(rotation);
        c.beginPath();

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
            if (i === 0) c.moveTo(bx, by);
            else c.lineTo(bx, by);
          }
          c.closePath();
        } else {
          c.arc(0, 0, R, 0, Math.PI * 2);
        }

        c.strokeStyle = lineColor;
        c.lineWidth = 2.6;
        c.shadowColor = shadow;
        c.shadowBlur = 5;
        c.stroke();

        // Center Axle Pin Dot
        c.beginPath();
        c.arc(0, 0, 4.5, 0, Math.PI * 2);
        c.fillStyle = lineColor;
        c.shadowColor = shadow;
        c.shadowBlur = 4;
        c.fill();
        c.restore();
      }

      // ── PASS 1: BRAND COLOR PASS (Strictly within the section cards) ──
      c.save();
      c.beginPath();
      c.rect(cardsLeft, cardTop, Math.max(1, cardsRight - cardsLeft), cardH + 100);
      c.clip();
      drawScene(C_BRAND, C_AXLE_BRAND, 'rgba(23, 59, 99, 0.2)');
      c.restore();

      // ── PASS 2: WHITE PASS (Strictly Clipped Inside Active Red Liquid Fill Covers) ──
      if (pinTarget) {
        const pRect = pinTarget.getBoundingClientRect();
        const hasAnyActiveCover = coverRefs.current.some((cv) => cv && cv.clientHeight > 0);
        if (hasAnyActiveCover) {
          c.save();
          c.beginPath();
          coverRefs.current.forEach((coverEl) => {
            if (!coverEl) return;
            const cr = coverEl.getBoundingClientRect();
            if (cr.height > 0 && cr.width > 0) {
              const rx = cr.left - pRect.left;
              const ry = cr.top - pRect.top;
              c.rect(rx, ry, cr.width, cr.height);
            }
          });
          c.clip(); // ONLY inside the liquid navy covers!
          drawScene(C_WHITE, C_AXLE_WHITE, 'rgba(0, 0, 0, 0.3)');
          c.restore();
        }
      }

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
        className="w-full h-screen max-h-screen bg-[#FAF9F6] text-[#20252A] flex flex-col justify-start gap-3 sm:gap-4 md:gap-5 pt-[78px] md:pt-[88px] pb-3 md:pb-5 px-1 sm:px-2 md:px-3 overflow-hidden select-none"
      >
        <div className="relative z-10 w-full max-w-full px-2 mx-auto flex items-start sm:items-end justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Design + Strategy Row */}
            <div className="flex items-center gap-2 text-[1rem] md:text-[1.15rem] font-mono tracking-widest text-[#173B63] uppercase mb-1.5">
              <span>Design</span>
              <span className="opacity-50">+</span>
              <span>Strategy</span>
              <span className="opacity-50">+</span>
              <span>Velocity</span>
              <span className="opacity-50">=</span>
              <span className="font-bold underline decoration-2">Full Circle</span>
            </div>

            <p className="text-[1.3rem] sm:text-[1.7rem] md:text-[2.1rem] lg:text-[2.5rem] font-extrabold text-[#20252A] whitespace-nowrap tracking-tight">
              The road can get <span className="font-serif italic text-[#173B63] font-normal">bumpy</span>. We keep you{' '}
              <span className="font-serif italic text-[#173B63] font-normal">rolling</span> regardless.
            </p>
          </div>

          {/* Right: Oval Pill Badge */}
          <div className="border border-[#173B63] rounded-full px-4 py-1.5 sm:px-6 sm:py-2 text-[#173B63] font-serif italic text-[1.3rem] sm:text-[1.5rem] tracking-wide shadow-xs bg-white/80 backdrop-blur-xs flex-none">
            Our Process
          </div>
        </div>

        {/* Catenary Physics Canvas Overlay (z-20 so it renders inside & over the section cards) */}
        <canvas
          id="pw-canvas"
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* Bottom Cards Flex Wrap */}
        <div className="relative z-10 w-full max-w-full px-2 mx-auto flex-1 min-h-0 flex flex-col justify-end">
          <div
            ref={cardsWrapRef}
            className="flex flex-nowrap gap-2 md:gap-3 items-end transition-transform duration-75 ease-out w-full"
          >
            {cards.map((card, idx) => {
              const isActive = activeStep === idx;

              return (
                <div
                  key={card.num}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className="relative flex-none md:flex-1 w-[88vw] sm:w-[48vw] md:w-auto h-[55vh] sm:h-[58vh] md:h-[62vh] min-h-[380px] max-h-[540px] rounded-[16px] overflow-hidden bg-white/95 backdrop-blur-xs shadow-md"
                  style={{
                    transformOrigin: '50% 100%',
                  }}
                >
                  {/* ── LAYER 1: BASE LAYER (White Background with 100% RED Text) ── */}
                  <div className="relative z-0 h-full p-4 sm:p-5 md:p-6 flex flex-col justify-between text-[#173B63] select-none">
                    {/* Header in Base Layer */}
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[1.5rem] md:text-[1.7rem] font-bold text-[#173B63]">
                        {card.num}
                      </span>
                      {card.badge && (
                        <span className="font-mono text-[0.95rem] md:text-[1.05rem] px-2.5 py-0.5 rounded-full text-[#173B63] bg-[#173B63]/10 font-medium">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    {/* Body in Base Layer */}
                    <div className="mt-auto">
                      <h3 className="text-[1.5rem] sm:text-[1.7rem] md:text-[1.9rem] font-extrabold leading-[1.15] text-[#173B63]">
                        {card.title} <br />
                        <span className="font-serif italic font-normal text-[#173B63]">
                          {card.italicTitle}
                        </span>
                      </h3>
                      <p className="mt-1.5 text-[1.1rem] sm:text-[1.2rem] leading-relaxed line-clamp-2 text-[#173B63]/85">
                        {card.desc}
                      </p>

                      <div className="mt-2.5 pt-2 flex items-center justify-between text-[0.95rem] font-mono text-[#173B63]/75">
                        <span>PHASE {idx + 1} OF 4</span>
                      </div>
                    </div>
                  </div>

                  {/* ── LAYER 2: LIQUID RED FILL OVERLAY (Rising Height with 100% WHITE Text) ── */}
                  {/* As red fill rises, it clips and reveals the identical white text directly over the red */}
                  <div
                    ref={(el) => {
                      coverRefs.current[idx] = el;
                    }}
                    className="absolute inset-x-0 bottom-0 bg-[#173B63] z-10 overflow-hidden pointer-events-none"
                    style={{ height: '0%' }}
                  >
                    {/* Inner content pinned to bottom with matching card height so text aligns pixel-perfect */}
                    <div className="absolute inset-x-0 bottom-0 h-[55vh] sm:h-[58vh] md:h-[62vh] min-h-[380px] max-h-[540px] p-4 sm:p-5 md:p-6 flex flex-col justify-between text-white select-none">
                      {/* Header in Red Overlay */}
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[1.5rem] md:text-[1.7rem] font-bold text-white">
                          {card.num}
                        </span>
                        {card.badge && (
                          <span className="font-mono text-[0.95rem] md:text-[1.05rem] px-2.5 py-0.5 rounded-full text-white bg-white/20 font-medium">
                            {card.badge}
                          </span>
                        )}
                      </div>

                      {/* Body in Red Overlay */}
                      <div className="mt-auto">
                        <h3 className="text-[1.5rem] sm:text-[1.7rem] md:text-[1.9rem] font-extrabold leading-[1.15] text-white">
                          {card.title} <br />
                          <span className="font-serif italic font-normal text-white/95">
                            {card.italicTitle}
                          </span>
                        </h3>
                        <p className="mt-1.5 text-[1.1rem] sm:text-[1.2rem] leading-relaxed line-clamp-2 text-white/90">
                          {card.desc}
                        </p>

                        <div className="mt-2.5 pt-2 flex items-center justify-between text-[0.95rem] font-mono text-white/80">
                          <span>PHASE {idx + 1} OF 4</span>
                          {isActive && (
                            <span className="flex items-center gap-1 text-white font-bold animate-pulse">
                              <Sparkles className="w-3.5 h-3.5" /> ACTIVE
                            </span>
                          )}
                        </div>
                      </div>
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
