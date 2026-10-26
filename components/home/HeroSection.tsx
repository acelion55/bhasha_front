'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useAnimation } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  GraduationCap, 
  Video, 
  MessageCircle, 
  Users2
} from 'lucide-react';

interface HeroSectionProps {
  onOpenTrial: () => void;
  onOpenVideo?: () => void;
}

export default function HeroSection({ onOpenTrial, onOpenVideo }: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[calc(100vh-70px)] flex flex-col justify-between overflow-hidden bg-transparent pt-6 md:pt-10 pb-6 px-4 md:px-8 lg:px-12 select-none">
      
      {/* ── BACKGROUND AMBIENT GLOWS & ORBITAL LIGHT ARC ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Soft Radial Ambient Aura */}
        <div className="absolute top-1/4 right-[5%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute bottom-1/3 right-[15%] w-[450px] h-[450px] rounded-full bg-purple-400/10 blur-[130px]" />
        <div className="absolute top-1/3 left-[-100px] w-[400px] h-[400px] rounded-full bg-indigo-400/10 blur-[120px]" />

        {/* Dynamic Curved Orbital Horizon / Arc SVG */}
        <svg
          viewBox="0 0 1440 700"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 left-0 w-full h-[650px] object-cover md:object-contain opacity-80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="orbitalGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="35%" stopColor="#2563EB" stopOpacity="0.4" />
              <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="85%" stopColor="#6366F1" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.1" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="16" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="arcCoreGlow" cx="68%" cy="60%" r="25%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.25" />
              <stop offset="60%" stopColor="#2563EB" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Broad Core Atmosphere behind the right arc */}
          <ellipse cx="1020" cy="400" rx="360" ry="220" fill="url(#arcCoreGlow)" />

          {/* Secondary Soft Horizon Arc */}
          <path
            d="M -100 640 Q 600 560 1100 320 T 1540 180"
            stroke="url(#orbitalGradient)"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* Primary Sharp Luminous Sweeping Arc */}
          <motion.path
            d="M -50 620 Q 580 540 1060 330 T 1500 200"
            stroke="url(#orbitalGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#glowFilter)"
            initial={{ pathLength: 0.2, opacity: 0.6 }}
            animate={{ 
              pathLength: [0.95, 1, 0.95], 
              opacity: [0.75, 1, 0.75] 
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* High-intensity Bright Edge Beam */}
          <path
            d="M 680 500 Q 940 400 1160 300"
            stroke="#BAE6FD"
            strokeWidth="2"
            filter="url(#glowFilter)"
            strokeOpacity="0.9"
          />
        </svg>
      </div>

      {/* ── MAIN CONTENT (SPLIT VIEW) ── */}
      <div className="w-full flex-1 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 my-auto relative z-10">
        
        {/* Left Column: Typography & CTAs */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 max-w-2xl text-left"
        >
          {/* Language selector chips */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-wide text-slate-500 mb-5"
          >
            <span className="hover:text-slate-800 transition-colors">German</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="hover:text-slate-800 transition-colors">English</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="hover:text-slate-800 transition-colors">Spanish</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08] mb-6">
            Learn Languages <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 bg-clip-text text-transparent">
              Without Limits
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-xl leading-relaxed mb-8">
            CEFR-based online classes, live speaking practice, and a connected learning community.
          </p>

          {/* Buttons matching image exactly */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={onOpenTrial}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 font-bold text-sm sm:text-base shadow-xs backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full border border-slate-400 flex items-center justify-center">
                <Play className="w-3 h-3 text-slate-700 fill-slate-700 ml-0.5" />
              </div>
              <span>Watch How It Works</span>
            </button>
          </div>
        </motion.div>

        {/* Right Column: Floating 3D Isometric Glass Language Cards */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
          <div 
            className="relative w-full max-w-md sm:max-w-lg lg:max-w-md xl:max-w-lg py-4 flex flex-col items-center lg:items-end gap-3.5 sm:gap-4"
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            
            {/* Card 1: German (Hallo!) */}
            <motion.div
              initial={{ opacity: 0, y: 20, rotateX: 6, rotateY: -12, rotateZ: -2 }}
              animate={{ 
                opacity: 1, 
                y: [0, -6, 0], 
                rotateX: 6, 
                rotateY: -12, 
                rotateZ: -2 
              }}
              transition={{ 
                opacity: { duration: 0.6 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.04, rotateZ: 0, transition: { duration: 0.2 } }}
              className="w-64 sm:w-72 lg:w-80 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_12px_32px_rgba(15,23,42,0.08)] flex items-center gap-4 cursor-default transform hover:border-slate-300 transition-colors"
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs">🇩🇪</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Hallo!</span>
            </motion.div>

            {/* Card 2: English (Hello! - Glowing Active Featured Card) */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateX: 6, rotateY: -12, rotateZ: -2 }}
              animate={{ 
                opacity: 1, 
                y: [0, 8, 0], 
                rotateX: 6, 
                rotateY: -12, 
                rotateZ: -2 
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.15 },
                y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
              }}
              whileHover={{ scale: 1.05, rotateZ: 0, transition: { duration: 0.2 } }}
              className="w-72 sm:w-80 lg:w-92 px-7 py-5 rounded-2xl bg-gradient-to-r from-blue-50/90 via-sky-50/80 to-indigo-50/90 backdrop-blur-xl border-2 border-blue-400/80 shadow-[0_16px_40px_rgba(37,99,235,0.22)] flex items-center gap-4 cursor-default relative overflow-hidden"
            >
              {/* Internal Accent Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-400/20 blur-2xl -mr-10 -mt-10 pointer-events-none" />
              
              <span className="text-3xl sm:text-4xl filter drop-shadow-xs">🇬🇧</span>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight flex items-center gap-2">
                  Hello!
                </span>
              </div>
            </motion.div>

            {/* Card 3: Spanish (¡Hola!) */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 6, rotateY: -12, rotateZ: -2 }}
              animate={{ 
                opacity: 1, 
                y: [0, -7, 0], 
                rotateX: 6, 
                rotateY: -12, 
                rotateZ: -2 
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.3 },
                y: { duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
              }}
              whileHover={{ scale: 1.04, rotateZ: 0, transition: { duration: 0.2 } }}
              className="w-64 sm:w-72 lg:w-80 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_12px_32px_rgba(15,23,42,0.08)] flex items-center gap-4 cursor-default transform hover:border-slate-300 transition-colors"
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs">🇪🇸</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">¡Hola!</span>
            </motion.div>

            {/* Card 4: Hindi (नमस्ते!) */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 6, rotateY: -12, rotateZ: -2 }}
              animate={{ 
                opacity: 1, 
                y: [0, 6, 0], 
                rotateX: 6, 
                rotateY: -12, 
                rotateZ: -2 
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.45 },
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }
              }}
              whileHover={{ scale: 1.04, rotateZ: 0, transition: { duration: 0.2 } }}
              className="w-64 sm:w-72 lg:w-80 px-6 py-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_12px_32px_rgba(15,23,42,0.08)] flex items-center gap-4 cursor-default transform hover:border-slate-300 transition-colors"
            >
              <span className="text-2xl sm:text-3xl filter drop-shadow-xs">🇮🇳</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">नमस्ते!</span>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── BOTTOM PILLARS BAR (EXACT 4 PILLARS FROM MOCKUP) ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="w-full pt-8 pb-2 border-t border-slate-200/80 relative z-10"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80">
          
          {/* Pillar 1 */}
          <div className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 text-slate-700">
            <GraduationCap className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800">
              CEFR-Based Learning
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="flex items-center justify-center gap-3 px-3 py-2 text-slate-700">
            <Video className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800">
              Live Classes
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="flex items-center justify-center gap-3 px-3 py-2 text-slate-700">
            <MessageCircle className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800">
              Speaking Practice
            </span>
          </div>

          {/* Pillar 4 */}
          <div className="flex items-center justify-center lg:justify-end gap-3 px-3 py-2 text-slate-700">
            <Users2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-slate-800">
              Connected Learners
            </span>
          </div>

        </div>
      </motion.div>

    </section>
  );
}
