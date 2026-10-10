'use client';
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function GooeyBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const blobs = containerRef.current.querySelectorAll('.gooey-blob');

    blobs.forEach((blob) => {
      // Create continuous wandering animation for each blob
      gsap.to(blob, {
        x: () => gsap.utils.random(-150, 150),
        y: () => gsap.utils.random(-100, 100),
        scale: () => gsap.utils.random(0.8, 1.4),
        duration: () => gsap.utils.random(4, 8),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: () => gsap.utils.random(0, 2),
      });
    });

    return () => {
      gsap.killTweensOf(blobs);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none" style={{ filter: 'url(#goo)' }}>
      {/* SVG Filter Definition */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* GSAP Animated Blobs */}
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center opacity-40">
        <div className="gooey-blob absolute w-[400px] h-[300px] bg-[var(--green-uplift)] rounded-[40%] mix-blend-screen blur-xl"></div>
        <div className="gooey-blob absolute w-[350px] h-[350px] bg-[var(--gold)] rounded-[50%] mix-blend-screen blur-2xl"></div>
        <div className="gooey-blob absolute w-[450px] h-[300px] bg-[var(--starbucks-green)] rounded-[45%] mix-blend-screen blur-xl"></div>
      </div>
    </div>
  );
}
