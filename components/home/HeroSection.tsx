'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

interface HeroSectionProps {
  onOpenTrial: () => void;
  onOpenVideo?: () => void;
}

export default function HeroSection({ onOpenTrial, onOpenVideo }: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF7F2] text-[#1A1A1A] select-none pt-2 sm:pt-4 md:pt-6 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-8 md:px-12 lg:px-16 border-b border-[rgba(32,37,42,0.06)]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-8">
        
        {/* ── LEFT COLUMN: TYPOGRAPHY, CTAS & HIGHLIGHTS ── */}
        <motion.div 
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center z-10"
        >
          {/* Eyebrow with Red Accent Line */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-5">
            <span className="text-[1.15rem] sm:text-[1.3rem] font-bold tracking-[0.22em] text-[#20252A] uppercase">
              GERMAN / ENGLISH / SPANISH
            </span>
            <span className="w-10 sm:w-14 h-[2px] bg-[#CF1E2C] rounded-full inline-block" />
          </div>

          {/* Main Display Headline */}
          <h1 className="font-serif tracking-tight leading-[0.98] mb-4 sm:mb-6 text-[#14171A]">
            <span className="block text-[4.6rem] sm:text-[6.2rem] md:text-[7.4rem] lg:text-[8.2rem] font-bold">
              Learn
            </span>
            <span className="block text-[4.6rem] sm:text-[6.2rem] md:text-[7.4rem] lg:text-[8.2rem] font-bold">
              Languages
            </span>
            <span className="block text-[4.6rem] sm:text-[6.2rem] md:text-[7.4rem] lg:text-[8.2rem] font-bold italic text-[#CF1E2C]">
              Online
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[1.5rem] sm:text-[1.7rem] md:text-[1.85rem] text-[#4A4F54] font-normal leading-relaxed max-w-xl mb-7 sm:mb-9">
            CEFR-based classes, live practice and a connected learning community.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-10 sm:mb-14">
            {/* Primary Action Button */}
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#CF1E2C] hover:bg-[#B51723] text-white font-bold text-[1.4rem] sm:text-[1.55rem] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 group"
            >
              <span>Explore Courses</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Video / Modal Action Button */}
            <button
              type="button"
              onClick={onOpenVideo || onOpenTrial}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#1A1A1A] border border-[#20252A] font-bold text-[1.4rem] sm:text-[1.55rem] shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95"
            >
              <div className="w-5 h-5 rounded-full border-[1.5px] border-[#1A1A1A] flex items-center justify-center">
                <Play className="w-2.5 h-2.5 text-[#1A1A1A] fill-[#1A1A1A] ml-0.5" />
              </div>
              <span>Watch How It Works</span>
            </button>
          </div>

          {/* Bottom 3-Column Stats Row */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-5 sm:gap-6 pt-5 border-t border-[rgba(32,37,42,0.12)]">
            {/* Stat 1 */}
            <div>
              <p className="font-extrabold text-[1.45rem] sm:text-[1.55rem] text-[#1A1A1A] m-0 leading-tight">
                Baustein – B2
              </p>
              <p className="text-[1.2rem] sm:text-[1.3rem] text-[#626B73] font-medium m-0 mt-0.5">
                Structured Levels
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-[1px] h-9 bg-black/15" />

            {/* Stat 2 */}
            <div>
              <p className="font-extrabold text-[1.45rem] sm:text-[1.55rem] text-[#1A1A1A] m-0 leading-tight">
                Live Classes
              </p>
              <p className="text-[1.2rem] sm:text-[1.3rem] text-[#626B73] font-medium m-0 mt-0.5">
                With Experts
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-[1px] h-9 bg-black/15" />

            {/* Stat 3 */}
            <div>
              <p className="font-extrabold text-[1.45rem] sm:text-[1.55rem] text-[#1A1A1A] m-0 leading-tight">
                Speaking Club
              </p>
              <p className="text-[1.2rem] sm:text-[1.3rem] text-[#626B73] font-medium m-0 mt-0.5">
                Practise Daily
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT COLUMN: HERO ARTWORK & FLOATING LANGUAGE CARDS ── */}
        <div className="lg:col-span-6 xl:col-span-6 relative w-full flex items-center justify-center">
          <div className="relative w-full max-w-[580px] sm:max-w-[640px] lg:max-w-[700px] h-[500px] sm:h-[560px] md:h-[630px] lg:h-[670px] flex items-center justify-center">
            
            {/* 1. Red Gradient Circle Background (Enlarged) */}
            <div className="absolute right-[-8%] sm:right-[-6%] lg:right-[-4%] top-[-10%] sm:top-[-8%] lg:top-[-6%] w-[105%] sm:w-[114%] md:w-[122%] aspect-[4/3] pointer-events-none z-0">
              <img
                src="/herosectionimages/Red Gradient Circle with Highlight.png"
                alt=""
                className="w-full h-full object-contain pointer-events-none select-none scale-105 sm:scale-110"
              />
            </div>

            {/* 2. Grayscale Brandenburg Gate Cutout (Shifted Upwards) */}
            <div className="absolute left-[-2%] sm:left-[0%] bottom-[12%] sm:bottom-[15%] md:bottom-[18%] w-[88%] sm:w-[92%] md:w-[96%] pointer-events-none z-10">
              <img
                src="/herosectionimages/Grayscale Brandenburg Gate Cutout.png"
                alt="Brandenburg Gate Berlin"
                className="w-full h-auto object-contain pointer-events-none select-none drop-shadow-lg"
              />
            </div>

            {/* 3. Floating Language Cards (Diagonal Stacking) */}
            
            {/* Card 1: German (Hallo!) */}
            <motion.div
              initial={{ opacity: 0, y: -15, rotate: 6 }}
              animate={{ 
                opacity: 1, 
                y: [0, -6, 0], 
                rotate: [6, 5, 6] 
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.1 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.2 } }}
              className="absolute top-[1%] sm:top-[3%] right-[-2%] sm:right-[0%] w-[210px] sm:w-[260px] md:w-[300px] z-30 cursor-pointer drop-shadow-[0_16px_28px_rgba(0,0,0,0.14)]"
            >
              <div className="relative w-full">
                <img
                  src="/herosectionimages/germensec3.png"
                  alt="German Course"
                  className="w-full h-auto object-contain pointer-events-none"
                />
                <div className="absolute inset-y-0 left-0 w-[58%] flex flex-col justify-center pl-[12%] pr-2 select-none pointer-events-none">
                  <span className="font-serif italic font-extrabold text-[2.2rem] sm:text-[2.7rem] md:text-[3.1rem] text-[#CF1E2C] leading-none">
                    Hallo!
                  </span>
                  <span className="font-sans font-semibold text-[1.2rem] sm:text-[1.4rem] text-[#20252A] mt-1 sm:mt-1.5 tracking-tight">
                    German
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: English (Hello!) */}
            <motion.div
              initial={{ opacity: 0, y: 0, rotate: 5 }}
              animate={{ 
                opacity: 1, 
                y: [0, 7, 0], 
                rotate: [5, 4, 5] 
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.25 },
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.2 } }}
              className="absolute top-[33%] sm:top-[35%] right-[-6%] sm:right-[-3%] w-[210px] sm:w-[260px] md:w-[300px] z-30 cursor-pointer drop-shadow-[0_18px_32px_rgba(0,0,0,0.16)]"
            >
              <div className="relative w-full">
                <img
                  src="/herosectionimages/englishsec1.png"
                  alt="English Course"
                  className="w-full h-auto object-contain pointer-events-none"
                />
                <div className="absolute inset-y-0 left-0 w-[58%] flex flex-col justify-center pl-[12%] pr-2 select-none pointer-events-none">
                  <span className="font-serif italic font-extrabold text-[2.2rem] sm:text-[2.7rem] md:text-[3.1rem] text-[#CF1E2C] leading-none">
                    Hello!
                  </span>
                  <span className="font-sans font-semibold text-[1.2rem] sm:text-[1.4rem] text-[#20252A] mt-1 sm:mt-1.5 tracking-tight">
                    English
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Spanish (¡Hola!) */}
            <motion.div
              initial={{ opacity: 0, y: 15, rotate: 4 }}
              animate={{ 
                opacity: 1, 
                y: [0, -5, 0], 
                rotate: [4, 3, 4] 
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.4 },
                y: { duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
                rotate: { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
              }}
              whileHover={{ scale: 1.05, rotate: 1, transition: { duration: 0.2 } }}
              className="absolute bottom-[4%] sm:bottom-[6%] right-[8%] sm:right-[12%] w-[210px] sm:w-[260px] md:w-[300px] z-30 cursor-pointer drop-shadow-[0_20px_36px_rgba(0,0,0,0.18)]"
            >
              <div className="relative w-full">
                <img
                  src="/herosectionimages/spansec2.png"
                  alt="Spanish Course"
                  className="w-full h-auto object-contain pointer-events-none"
                />
                <div className="absolute inset-y-0 left-0 w-[58%] flex flex-col justify-center pl-[12%] pr-2 select-none pointer-events-none">
                  <span className="font-serif italic font-extrabold text-[2.2rem] sm:text-[2.7rem] md:text-[3.1rem] text-[#CF1E2C] leading-none">
                    ¡Hola!
                  </span>
                  <span className="font-sans font-semibold text-[1.2rem] sm:text-[1.4rem] text-[#20252A] mt-1 sm:mt-1.5 tracking-tight">
                    Spanish
                  </span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
