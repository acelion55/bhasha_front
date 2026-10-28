'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';
import { Sparkles } from 'lucide-react';

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
  bgColor?: string;
  accentColor?: string;
  fillColor?: string;
  rgbaAccent?: string;
}

export const FALLBACK_PALETTE = [
  {
    bgColor: '#FDF2ED',      // Light Warm Peach
    accentColor: '#C25E3E',  // Soft Terracotta
    fillColor: '#D96B4F',    // Light Coral Peach
    rgbaAccent: 'rgba(194, 94, 62, 0.35)',
  },
  {
    bgColor: '#EEF4F8',      // Light Cloud Blue
    accentColor: '#2A5987',  // Soft Ocean Blue
    fillColor: '#3A6D9B',    // Light Slate Blue
    rgbaAccent: 'rgba(42, 89, 135, 0.35)',
  },
  {
    bgColor: '#F2EFFB',      // Light Lavender Mist
    accentColor: '#6E51A2',  // Soft Iris
    fillColor: '#7F62B8',    // Light Royal Violet
    rgbaAccent: 'rgba(110, 81, 162, 0.35)',
  },
  {
    bgColor: '#EDF5EF',      // Light Sage Tint
    accentColor: '#2F7552',  // Soft Meadow Pine
    fillColor: '#418763',    // Light Eucalyptus Sage
    rgbaAccent: 'rgba(47, 117, 82, 0.35)',
  },
];

export function getCardPalette(idx: number, card?: ProcessCardItem) {
  const fb = FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];
  return {
    bgColor: card?.bgColor || fb.bgColor,
    accentColor: card?.accentColor || fb.accentColor,
    fillColor: card?.fillColor || fb.fillColor,
    rgbaAccent: card?.rgbaAccent || fb.rgbaAccent,
  };
}

const DEFAULT_CARDS: ProcessCardItem[] = [
  {
    num: '01',
    badge: 'A1 • Beginner',
    title: 'Foundation',
    italicTitle: '& Alphabet',
    desc: 'Master phonetics, core sentence architecture, pronunciation, and everyday survival phrases.',
    shapeName: 'Square (4 Sides)',
    ...FALLBACK_PALETTE[0],
  },
  {
    num: '02',
    badge: 'A2 • Elementary',
    title: 'Conversational',
    italicTitle: 'Flow',
    desc: 'Past tense (Perfekt), daily routines, social dialogues, and practical workplace communication.',
    shapeName: 'Hexagon (6 Sides)',
    ...FALLBACK_PALETTE[1],
  },
  {
    num: '03',
    badge: 'B1 • Intermediate',
    title: 'Independent',
    italicTitle: 'Fluency',
    desc: 'Spontaneous discussions, complex grammar, opinions, plus 10 days Goethe & telc exam preparation.',
    shapeName: 'Octagon (8 Sides)',
    ...FALLBACK_PALETTE[2],
  },
  {
    num: '04',
    badge: 'B2 • Professional',
    title: 'Effortless',
    italicTitle: 'Mastery',
    desc: 'Advanced career vocabulary, academic debate, native-speed listening, and smooth speaking reflexes.',
    shapeName: 'Circle (Smooth)',
    ...FALLBACK_PALETTE[3],
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

  // Dedicated Desktop Refs
  const desktopCardsWrapRef = useRef<HTMLDivElement>(null);
  const desktopCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopCoverRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Dedicated Mobile Refs
  const mobileCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCoverRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeStep, setActiveStep] = useState(0);

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
    if (!pinTarget) return;

    let st: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 640;
      // Generous scroll distance on mobile so cards advance comfortably and deliberately
      const scrollDistance = isMobile ? '+=4800' : '+=3000';

      st = ScrollTrigger.create({
        trigger: pinTarget,
        start: 'top top',
        end: scrollDistance,
        pin: true,
        pinSpacing: true,
        scrub: isMobile ? 0.8 : 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          targetProgressRef.current = p;

          const curIsMobile = window.innerWidth < 640;

          if (curIsMobile) {
            /* ──────────────────────────────────────────────────────────
               MOBILE VIEW: SECTIONS SCROLL UP ONE BY ONE WITH REST TIME
               ────────────────────────────────────────────────────────── */
            const stepIdx = Math.min(3, Math.floor(p * 4));
            setActiveStep(stepIdx);

            const phases = [
              { enterStart: 0.00, enterEnd: 0.00, recedeStart: 0.20, recedeEnd: 0.28 },
              { enterStart: 0.20, enterEnd: 0.28, recedeStart: 0.45, recedeEnd: 0.53 },
              { enterStart: 0.45, enterEnd: 0.53, recedeStart: 0.70, recedeEnd: 0.78 },
              { enterStart: 0.70, enterEnd: 0.78, recedeStart: 1.00, recedeEnd: 1.00 },
            ];

            cards.forEach((_, idx) => {
              const el = mobileCardRefs.current[idx];
              if (!el) return;

              const ph = phases[idx];

              if (idx === 0) {
                if (p < ph.recedeStart) {
                  el.style.transform = 'translate3d(0, 0%, 0) scale(1)';
                  el.style.opacity = '1';
                  el.style.zIndex = '1';
                } else {
                  const tOver = Math.min(1, (p - ph.recedeStart) / (ph.recedeEnd - ph.recedeStart));
                  const scale = 1 - tOver * 0.06;
                  const yOff = -tOver * 14;
                  const op = 1 - tOver * 0.45;
                  el.style.transform = `translate3d(0, ${yOff}px, 0) scale(${scale})`;
                  el.style.opacity = `${op}`;
                  el.style.zIndex = '1';
                }
              } else {
                if (p < ph.enterStart) {
                  el.style.transform = 'translate3d(0, 115%, 0)';
                  el.style.opacity = '0';
                  el.style.zIndex = `${idx + 2}`;
                } else if (p <= ph.enterEnd) {
                  const tIn = (p - ph.enterStart) / (ph.enterEnd - ph.enterStart);
                  const easeIn = 1 - Math.pow(1 - tIn, 3);
                  const yTrans = (1 - easeIn) * 115;
                  el.style.transform = `translate3d(0, ${yTrans}%, 0) scale(1)`;
                  el.style.opacity = '1';
                  el.style.zIndex = `${idx + 2}`;
                } else if (p < ph.recedeStart) {
                  el.style.transform = 'translate3d(0, 0%, 0) scale(1)';
                  el.style.opacity = '1';
                  el.style.zIndex = `${idx + 2}`;
                } else {
                  const tOver = Math.min(1, (p - ph.recedeStart) / (ph.recedeEnd - ph.recedeStart));
                  const scale = 1 - tOver * 0.06;
                  const yOff = -tOver * 14;
                  const op = 1 - tOver * 0.45;
                  el.style.transform = `translate3d(0, ${yOff}px, 0) scale(${scale})`;
                  el.style.opacity = `${op}`;
                  el.style.zIndex = `${idx + 2}`;
                }
              }
            });

            // Liquid fills on mobile
            const fillWindows = [
              { start: 0.00, end: 0.18 },
              { start: 0.22, end: 0.40 },
              { start: 0.47, end: 0.65 },
              { start: 0.72, end: 0.90 },
            ];

            cards.forEach((_, idx) => {
              const fw = fillWindows[idx];
              const fillProg = Math.max(0, Math.min(1, (p - fw.start) / (fw.end - fw.start)));
              if (mobileCoverRefs.current[idx]) {
                mobileCoverRefs.current[idx]!.style.height = `${fillProg * 100}%`;
              }
            });

          } else {
            /* ──────────────────────────────────────────────────────────
               DESKTOP VIEW: HORIZONTAL 4-CARD SPREAD WITH PARALLAX
               ────────────────────────────────────────────────────────── */
            // 1. Staggered Parallax Rise of the 4 desktop sections
            const PARALLAX_DIST = [140, 210, 280, 350];
            cards.forEach((_, idx) => {
              const el = desktopCardRefs.current[idx];
              if (!el) return;
              const pStart = idx * 0.025;
              const pEnd = 0.10 + idx * 0.04;
              const tCard = Math.max(0, Math.min(1, (p - pStart) / (pEnd - pStart)));
              const eased = 1 - Math.pow(1 - tCard, 3);
              const yOffset = PARALLAX_DIST[idx] * (1 - eased);
              el.style.transform = `translate3d(0, ${yOffset}px, 0)`;
              el.style.opacity = '1';
              el.style.zIndex = '1';
            });

            // 2. Liquid rising fill starts when Card 0 crosses track (p >= 0.10)
            const P_CROSS = 0.10;
            const pRoll = Math.max(0, Math.min(1, (p - P_CROSS) / (1 - P_CROSS)));

            // Card 0: 0.00 -> 0.25
            const c1 = Math.max(0, Math.min(1, pRoll / 0.25));
            if (desktopCoverRefs.current[0]) desktopCoverRefs.current[0]!.style.height = `${c1 * 100}%`;

            // Card 1: 0.25 -> 0.50
            const c2 = Math.max(0, Math.min(1, (pRoll - 0.25) / 0.25));
            if (desktopCoverRefs.current[1]) desktopCoverRefs.current[1]!.style.height = `${c2 * 100}%`;

            // Card 2: 0.50 -> 0.75
            const c3 = Math.max(0, Math.min(1, (pRoll - 0.50) / 0.25));
            if (desktopCoverRefs.current[2]) desktopCoverRefs.current[2]!.style.height = `${c3 * 100}%`;

            // Card 3: 0.75 -> 1.00
            const c4 = Math.max(0, Math.min(1, (pRoll - 0.75) / 0.25));
            if (desktopCoverRefs.current[3]) desktopCoverRefs.current[3]!.style.height = `${c4 * 100}%`;

            // Update active card index based on wheel progression
            if (pRoll < 0.25) setActiveStep(0);
            else if (pRoll < 0.50) setActiveStep(1);
            else if (pRoll < 0.75) setActiveStep(2);
            else setActiveStep(3);
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
    const C_WHITE = '#FFFFFF';
    const C_AXLE_WHITE = 'rgba(255, 255, 255, 0.75)';
    const MOBILE_BP = 639;
    const PHASE2 = 0.35;
    const SMOOTHING = 0.18;
    const STOP_EPSILON = 0.0005;

    let W = 0;
    let H = 0;
    let R = 0;
    let dpr = 1;
    let isMobile = false;
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

      // In mobile view: Shape is proportioned larger and placed safely inside margins
      if (isMobile) {
        R = Math.max(46, Math.min(56, W * 0.135));
        xLeft = R + 24;
        xRight = W - (R + 24);
      } else {
        const RADIUS_SCALE = 0.07;
        R = Math.max(34, Math.min(W, H) * RADIUS_SCALE);

        if (desktopCardsWrapRef.current && pinTarget) {
          const cRect = desktopCardsWrapRef.current.getBoundingClientRect();
          const pRect = pinTarget.getBoundingClientRect();
          if (cRect.width > 0) {
            const pad = R + 12;
            xLeft = Math.max(pad, cRect.left - pRect.left + pad);
            xRight = Math.min(W - pad, cRect.right - pRect.left - pad);
          } else {
            xLeft = R + 20;
            xRight = W - (R + 20);
          }
        } else {
          xLeft = R + 20;
          xRight = W - (R + 20);
        }
      }

      render(progressRef.current);
    }

    function render(p: number) {
      if (!ctx) return;

      const c = ctx;
      const curIsMobile = W <= MOBILE_BP;

      // On desktop, wheel starts rolling after card entry (P_CROSS = 0.10)
      // On mobile, wheel rolls smoothly across the entire scroll sequence
      const tRoll = curIsMobile
        ? Math.max(0, Math.min(1, p))
        : Math.max(0, Math.min(1, (p - 0.10) / 0.90));

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

      /* ── Track Positioning ── */
      let roadPeakY = 0;
      let axleY = 0;
      let cardsLeft = 0;
      let cardsRight = W;

      if (curIsMobile) {
        // MOBILE VIEW: Shape & road placed in middle of screen (elevated slightly higher up)
        roadPeakY = Math.round(H * 0.36) + a;
        axleY = roadPeakY - (a + (R - a) * circT);
        cardsLeft = 16;
        cardsRight = W - 16;
      } else {
        // DESKTOP VIEW: Road sits across the cards
        let cardTop = H * 0.32;
        let cardH = 480;

        if (desktopCardsWrapRef.current && pinTarget) {
          const cRect = desktopCardsWrapRef.current.getBoundingClientRect();
          const pRect = pinTarget.getBoundingClientRect();
          if (cRect.width > 0) {
            cardsLeft = Math.max(0, cRect.left - pRect.left);
            cardsRight = Math.min(W, cRect.right - pRect.left);
            cardTop = cRect.top - pRect.top;
            cardH = cRect.height;
          }
        }

        roadPeakY = cardTop + cardH * 0.35 + a;
        axleY = roadPeakY - (a + (R - a) * circT);
      }

      // Wheel X position (Fixed in the exact center on mobile!)
      const xStart = curIsMobile ? xLeft : (cardsLeft - R * 1.6);
      const xEnd = curIsMobile ? xRight : (cardsRight - R - 12);
      const span = xEnd - xStart;
      const wheelX = curIsMobile ? (W / 2) : lerp(xStart, xEnd, tRoll);

      c.clearRect(0, 0, W, H);

      /* ── Shared Physics Drawing Function ── */
      const firstPeakX = cardsLeft + Math.ceil((-cardsLeft - s) / s) * s;
      const numArches = Math.ceil((cardsRight - cardsLeft + s * 2) / s) + 2;
      const steps = Math.max(48, Math.round(s));
      const invA = 1 / a;
      const oneMinusCirc = 1 - circT;

      // On mobile: shape is fixed at center, rotates in place, track moves under it by distance d
      const mobileTotalRoll = s * 14;
      const d = curIsMobile ? tRoll * mobileTotalRoll : tRoll * span;
      // In mobile view: zero phase offset so vertex aligns with catenary valley with exact contact
      const rotation = curIsMobile 
        ? (d / s) * (2 * Math.PI / nf) 
        : (d / s) * (2 * Math.PI / nf) - Math.PI / nf;
      const verts = continuousVerts(nf, R);
      const vCount = verts.length / 2;

      function drawScene(lineColor: string, axleColor: string, shadow: string) {
        /* 1. Inverted Catenary Arches Road (Moves horizontally on mobile!) */
        c.beginPath();
        if (curIsMobile) {
          const archCount = Math.ceil(W / s) + 6;
          const minArch = -Math.ceil(archCount / 2) - 1;
          const maxArch = Math.ceil(archCount / 2) + 2;
          const shiftX = d % s;
          for (let ai = minArch; ai <= maxArch; ai++) {
            const peakX = (W / 2 - s / 2) + ai * s - shiftX;
            const archLeft = peakX - s / 2;
            for (let si = 0; si <= steps; si++) {
              const frac2 = si / steps;
              const lx = archLeft + frac2 * s;
              const localX = lx - peakX;
              const catenaryY = roadPeakY + a * Math.cosh(localX * invA) - a;
              const worldY = catenaryY * oneMinusCirc + roadPeakY * circT;
              if (si === 0 && ai === minArch) c.moveTo(lx, worldY);
              else c.lineTo(lx, worldY);
            }
          }
        } else {
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
        }
        c.save();
        c.strokeStyle = lineColor;
        c.lineWidth = curIsMobile ? 3.0 : 2.4;
        c.shadowColor = shadow;
        c.shadowBlur = curIsMobile ? 6 : 4;
        c.stroke();
        c.restore();

        /* 2. Axle Guide (Constant Flat Horizontal Line - Stops Outside Wheel) */
        c.save();
        c.strokeStyle = axleColor;
        c.lineWidth = curIsMobile ? 2.0 : 1.6;
        c.setLineDash([7, 8]);
        if (curIsMobile) {
          c.lineDashOffset = -(d % 15);
        }
        c.shadowColor = shadow;
        c.shadowBlur = 3;
        c.beginPath();
        const leftEnd = Math.max(cardsLeft, wheelX - R - 6);
        if (leftEnd > cardsLeft) {
          c.moveTo(cardsLeft, axleY);
          c.lineTo(leftEnd, axleY);
        }
        const rightStart = Math.min(cardsRight, wheelX + R + 6);
        if (rightStart < cardsRight) {
          c.moveTo(rightStart, axleY);
          c.lineTo(cardsRight, axleY);
        }
        c.stroke();
        c.restore();

        /* 3. Rolling Shape Outline (Clean, without spokes) */
        c.save();
        c.translate(wheelX, axleY);
        c.rotate(rotation);
        c.beginPath();

        if (circT < 0.999) {
          const STEPS = curIsMobile ? 90 : 360;
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

        // Inner polygon fill on mobile for prominent visibility
        c.fillStyle = curIsMobile ? 'rgba(23, 59, 99, 0.08)' : 'transparent';
        c.fill();

        c.strokeStyle = lineColor;
        c.lineWidth = curIsMobile ? 3.0 : 2.6;
        c.shadowColor = shadow;
        c.shadowBlur = 5;
        c.stroke();

        // Center Axle Pin Dot
        c.beginPath();
        c.arc(0, 0, curIsMobile ? 6 : 4.5, 0, Math.PI * 2);
        c.fillStyle = lineColor;
        c.shadowColor = shadow;
        c.shadowBlur = 4;
        c.fill();
        c.restore();
      }

      if (curIsMobile) {
        // ── MOBILE: Direct draw with current active step color ──
        const curStep = Math.min(3, Math.floor(tRoll * 4));
        const activePal = getCardPalette(curStep, cards[curStep]);
        drawScene(activePal.accentColor, activePal.rgbaAccent, 'rgba(0, 0, 0, 0.15)');
      } else {
        // ── DESKTOP: Dual-pass clipped rendering ──
        if (pinTarget) {
          const pRect = pinTarget.getBoundingClientRect();
          let drawnAny = false;

          cards.forEach((cItem, i) => {
            const cardEl = desktopCardRefs.current[i];
            if (!cardEl) return;
            const cr = cardEl.getBoundingClientRect();
            if (cr.width <= 0) return;

            drawnAny = true;
            const cl = cr.left - pRect.left;
            const crRight = cr.right - pRect.left;

            const prevEl = i > 0 ? desktopCardRefs.current[i - 1] : null;
            const nextEl = i < cards.length - 1 ? desktopCardRefs.current[i + 1] : null;

            const segLeft = prevEl
              ? ((prevEl.getBoundingClientRect().right - pRect.left) + cl) / 2
              : cardsLeft;

            const segRight = nextEl
              ? (crRight + (nextEl.getBoundingClientRect().left - pRect.left)) / 2
              : cardsRight;

            if (segRight <= segLeft) return;

            const pal = getCardPalette(i, cItem);

            c.save();
            c.beginPath();
            c.rect(segLeft, 0, segRight - segLeft, H);
            c.clip();
            drawScene(pal.accentColor, pal.rgbaAccent, pal.rgbaAccent.replace('0.45', '0.2'));
            c.restore();
          });

          // Fallback if cards not yet laid out: draw complete scene with brandColor
          if (!drawnAny) {
            drawScene(brandColor, 'rgba(23, 59, 99, 0.35)', 'rgba(0, 0, 0, 0.1)');
          }
        }

        // White pass inside liquid fill
        if (pinTarget) {
          const pRect = pinTarget.getBoundingClientRect();
          const hasAnyActiveCover = desktopCoverRefs.current.some((cv) => cv && cv.clientHeight > 0);
          if (hasAnyActiveCover) {
            c.save();
            c.beginPath();
            desktopCoverRefs.current.forEach((coverEl) => {
              if (!coverEl) return;
              const cr = coverEl.getBoundingClientRect();
              if (cr.height > 0 && cr.width > 0) {
                const rx = cr.left - pRect.left;
                const ry = cr.top - pRect.top;
                c.rect(rx, ry, cr.width, cr.height);
              }
            });
            c.clip();
            drawScene(C_WHITE, C_AXLE_WHITE, 'rgba(0, 0, 0, 0.3)');
            c.restore();
          }
        }
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
        className="w-full h-screen max-h-screen bg-[#FAF9F6] text-[#20252A] flex flex-col justify-between pt-[74px] sm:pt-[76px] md:pt-[80px] pb-3 sm:pb-4 md:pb-6 px-3 sm:px-4 md:px-6 overflow-hidden select-none"
      >
        {/* Top Header Row */}
        <div className="relative z-10 w-full max-w-full px-1 sm:px-2 mx-auto flex items-start sm:items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Design + Strategy Row */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[0.95rem] sm:text-[1.05rem] md:text-[1.15rem] font-mono tracking-widest text-[#173B63] uppercase mb-1">
              <span>A1 Foundation</span>
              <span className="opacity-50">+</span>
              <span>A2 Practice</span>
              <span className="opacity-50">+</span>
              <span>B1 Fluency</span>
              <span className="opacity-50">+</span>
              <span>B2 Mastery</span>
              <span className="opacity-50">=</span>
              <span className="font-bold underline decoration-2">Fluency</span>
            </div>

            <p className="text-[1.35rem] sm:text-[1.7rem] md:text-[2.1rem] lg:text-[2.5rem] font-extrabold text-[#20252A] tracking-tight leading-snug">
              The road to fluency can get <span className="font-serif italic text-[#173B63] font-normal">bumpy</span>. We keep you{' '}
              <span className="font-serif italic text-[#173B63] font-normal">rolling</span> regardless.
            </p>
          </div>

          {/* Right: Oval Pill Badge */}
          <div className="border border-[#173B63] rounded-full px-3.5 py-1 sm:px-6 sm:py-2 text-[#173B63] font-serif italic text-[1.2rem] sm:text-[1.5rem] tracking-wide shadow-xs bg-white/80 backdrop-blur-xs flex-none">
            CEFR Journey
          </div>
        </div>

        {/* ── Canvas Simulation Overlay ── */}
        <canvas
          id="pw-canvas"
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        />

        {/* ── Cards Area: Desktop Flex Row OR Mobile Stacking Cards ── */}
        <div className="relative z-10 w-full max-w-full px-1 sm:px-2 mx-auto flex-1 min-h-0 flex flex-col justify-end sm:justify-center pb-7 sm:pb-4 md:pb-6">
          
          {/* ──────── DESKTOP & TABLET CARDS LAYOUT (Visible on Tablet & Desktop) ──────── */}
          <div
            ref={desktopCardsWrapRef}
            className="hidden sm:flex flex-nowrap gap-2 md:gap-3 items-end transition-transform duration-75 ease-out w-full"
          >
            {cards.map((card, idx) => {
              const isActive = activeStep === idx;
              const palette = getCardPalette(idx, card);

              return (
                <div
                  key={`desktop-${card.num}`}
                  ref={(el) => {
                    desktopCardRefs.current[idx] = el;
                  }}
                  className="relative flex-1 h-[62vh] sm:h-[68vh] md:h-[68vh] min-h-[440px] max-h-[660px] rounded-[16px] overflow-hidden backdrop-blur-xs shadow-md border border-[rgba(32,37,42,0.08)]"
                  style={{
                    transformOrigin: '50% 100%',
                    backgroundColor: palette.bgColor,
                  }}
                >
                  {/* Layer 1: Base Layer */}
                  <div
                    className="relative z-0 h-full p-5 md:p-6 flex flex-col justify-between select-none"
                    style={{ color: palette.accentColor }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[1.5rem] md:text-[1.7rem] font-bold">
                        {card.num}
                      </span>
                      {card.badge && (
                        <span className="font-mono text-[0.95rem] md:text-[1.05rem] px-2.5 py-0.5 rounded-full font-semibold bg-white/70 backdrop-blur-xs border border-black/5 shadow-2xs">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <h3 className="text-[1.6rem] md:text-[1.9rem] font-extrabold leading-[1.15]">
                        {card.title} <br />
                        <span className="font-serif italic font-normal">
                          {card.italicTitle}
                        </span>
                      </h3>
                      <p className="mt-1.5 text-[1.15rem] leading-relaxed line-clamp-2 opacity-90">
                        {card.desc}
                      </p>

                      <div className="mt-2.5 pt-2 flex items-center justify-between text-[0.95rem] font-mono opacity-80">
                        <span>PHASE {idx + 1} OF 4</span>
                      </div>
                    </div>
                  </div>

                  {/* Layer 2: Liquid Rising Cover */}
                  <div
                    ref={(el) => {
                      desktopCoverRefs.current[idx] = el;
                    }}
                    className="absolute inset-x-0 bottom-0 z-10 overflow-hidden pointer-events-none"
                    style={{
                      height: '0%',
                      backgroundColor: palette.fillColor,
                    }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-[62vh] sm:h-[68vh] md:h-[68vh] min-h-[440px] max-h-[660px] p-5 md:p-6 flex flex-col justify-between text-white select-none">
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

                      <div className="mt-auto">
                        <h3 className="text-[1.6rem] md:text-[1.9rem] font-extrabold leading-[1.15] text-white">
                          {card.title} <br />
                          <span className="font-serif italic font-normal text-white/95">
                            {card.italicTitle}
                          </span>
                        </h3>
                        <p className="mt-1.5 text-[1.15rem] leading-relaxed line-clamp-2 text-white/90">
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

          {/* ──────── MOBILE PHONE CARDS LAYOUT (Visible on Mobile Phone) ──────── */}
          <div className="sm:hidden relative w-full h-[275px] sm:h-[310px] mb-5 sm:mb-2 md:mb-0">
            {cards.map((card, idx) => {
              const isActive = activeStep === idx;
              const palette = getCardPalette(idx, card);

              return (
                <div
                  key={`mobile-${card.num}`}
                  ref={(el) => {
                    mobileCardRefs.current[idx] = el;
                  }}
                  className="absolute inset-0 w-full h-full rounded-[18px] overflow-hidden shadow-xl border border-[rgba(32,37,42,0.1)] transition-all duration-150 ease-out"
                  style={{
                    backgroundColor: palette.bgColor,
                    zIndex: idx + 1,
                  }}
                >
                  {/* Layer 1: Base Pastel Content */}
                  <div
                    className="relative z-0 h-full p-5 flex flex-col justify-between select-none"
                    style={{ color: palette.accentColor }}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-mono text-[1.6rem] font-extrabold">
                        {card.num}
                      </span>
                      {card.badge && (
                        <span className="font-mono text-[1.05rem] px-3 py-1 rounded-full font-bold bg-white/80 backdrop-blur-xs border border-black/5 shadow-xs">
                          {card.badge}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <h3 className="text-[1.8rem] sm:text-[2rem] font-extrabold leading-[1.15]">
                        {card.title}{' '}
                        <span className="font-serif italic font-normal">
                          {card.italicTitle}
                        </span>
                      </h3>
                      <p className="mt-2 text-[1.2rem] leading-relaxed line-clamp-2 opacity-90">
                        {card.desc}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-black/10 flex items-center justify-between text-[1rem] font-mono opacity-80">
                        <span>STAGE {idx + 1} OF 4</span>
                        <span>{card.shapeName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Layer 2: Liquid Fill Overlay with 100% Crisp White Text */}
                  <div
                    ref={(el) => {
                      mobileCoverRefs.current[idx] = el;
                    }}
                    className="absolute inset-x-0 bottom-0 z-10 overflow-hidden pointer-events-none"
                    style={{
                      height: '0%',
                      backgroundColor: palette.fillColor,
                    }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-[270px] sm:h-[300px] p-5 flex flex-col justify-between text-white select-none">
                      <div className="flex items-start justify-between">
                        <span className="font-mono text-[1.6rem] font-extrabold text-white">
                          {card.num}
                        </span>
                        {card.badge && (
                          <span className="font-mono text-[1.05rem] px-3 py-1 rounded-full text-white bg-white/25 font-bold backdrop-blur-xs">
                            {card.badge}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto">
                        <h3 className="text-[1.8rem] sm:text-[2rem] font-extrabold leading-[1.15] text-white">
                          {card.title}{' '}
                          <span className="font-serif italic font-normal text-white/95">
                            {card.italicTitle}
                          </span>
                        </h3>
                        <p className="mt-2 text-[1.2rem] leading-relaxed line-clamp-2 text-white/90">
                          {card.desc}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-[1rem] font-mono text-white/85">
                          <span>STAGE {idx + 1} OF 4</span>
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

          {/* Mobile Scroll Indicator Bar */}
          <div className="mt-2 md:hidden flex justify-between items-center text-[1.05rem] font-mono text-[#718096]">
            <span>Scroll to advance stages</span>
            <span className="font-bold text-[#173B63]">Phase {activeStep + 1} / 4</span>
          </div>

        </div>
      </section>
    </div>
  );
}
