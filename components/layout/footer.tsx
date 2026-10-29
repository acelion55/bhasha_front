import React from 'react';
import Link from 'next/link';
import { Heart, Languages, Mail, MapPin, Phone, ExternalLink, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--ceramic)] bg-[#fdf8f3] py-[6vh] mt-[4vh]">
      <div className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[6vh] md:gap-[4vw]">

        {/* Brand */}
        <div className="space-y-[2vh]">
          <Link href="/" className="flex items-center flex-shrink-0">
             <img src="/logos/logowithtext.png" alt="Bhasha School Logo" className="h-[45px] md:h-[55px] w-auto object-contain cursor-pointer" />
          </Link>
          <p className="text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] leading-relaxed mt-4">
            Expert-led German &amp; English language tutoring — live lessons, peer language exchange, AI practice, and certified CEFR programs.
          </p>
          <div className="flex items-center gap-2 text-[1.4rem] font-bold text-[var(--starbucks-green)] bg-[var(--green-light)] border border-emerald-200 px-[1.5vw] py-[0.5vh] rounded-full w-fit mt-4">
            <span className="w-2 h-2 rounded-full bg-[var(--green-accent)] animate-pulse inline-block" />
            Admissions Open
          </div>
          {/* Language flags */}
          <div className="flex items-center gap-3 pt-2">
            <span className="text-[1.3rem] font-bold bg-[var(--white)] border border-[var(--ceramic)] px-3 py-1 rounded-[4px] shadow-xs flex items-center gap-1.5 text-gray-700">
              <Languages className="w-4 h-4 text-emerald-700" /> Deutsch
            </span>
            <span className="text-[1.3rem] font-bold bg-[var(--white)] border border-[var(--ceramic)] px-3 py-1 rounded-[4px] shadow-xs flex items-center gap-1.5 text-gray-700">
              <Languages className="w-4 h-4 text-emerald-700" /> English
            </span>
          </div>
        </div>

        {/* Courses & Programs */}
        <div>
          <h4 className="font-bold text-[1.8rem] md:text-[1.6rem] text-[var(--text-black)] mb-4 tracking-wide uppercase">
            Courses
          </h4>
          <ul className="space-y-[1.3vh] text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] font-medium">
            <li>
              <Link href="/german-for-beginners" className="hover:text-[var(--starbucks-green)] transition-colors">
                German for Beginners (A1–A2)
              </Link>
            </li>
            <li>
              <Link href="/english-conversational" className="hover:text-[var(--starbucks-green)] transition-colors">
                English Conversational
              </Link>
            </li>
            <li>
              <Link href="/german-language-for-business-professionals" className="hover:text-[var(--starbucks-green)] transition-colors">
                Business German
              </Link>
            </li>
            <li>
              <Link href="/exam-preparation" className="hover:text-[var(--starbucks-green)] transition-colors">
                Exam Preparation (Goethe / Telc / IELTS)
              </Link>
            </li>
            <li>
              <Link href="/public-masterclasses-for-german-language" className="hover:text-[var(--starbucks-green)] transition-colors">
                Public Masterclasses
              </Link>
            </li>
            <li>
              <Link href="/courses" className="inline-flex items-center gap-1 text-[var(--starbucks-green)] font-bold hover:underline">
                View All Courses &amp; Fees →
              </Link>
            </li>
          </ul>
        </div>

        {/* Learn & Explore */}
        <div>
          <h4 className="font-bold text-[1.8rem] md:text-[1.6rem] text-[var(--text-black)] mb-4 tracking-wide uppercase">
            Explore
          </h4>
          <ul className="space-y-[1.3vh] text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] font-medium">
            <li>
              <Link href="/classes" className="hover:text-[var(--starbucks-green)] transition-colors">
                Live Batches &amp; Cohorts
              </Link>
            </li>
            <li>
              <Link href="/features" className="hover:text-[var(--starbucks-green)] transition-colors">
                Learning Method &amp; AI Practice
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-[var(--starbucks-green)] transition-colors">
                Language Learning Blog
              </Link>
            </li>
            <li>
              <Link href="/blog/what-is-cefr" className="hover:text-[var(--starbucks-green)] transition-colors">
                What is CEFR? (A1 to C2)
              </Link>
            </li>
            <li>
              <Link href="/blog/german-a1-vs-a2" className="hover:text-[var(--starbucks-green)] transition-colors">
                German A1 vs A2 Roadmap
              </Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[var(--starbucks-green)] transition-colors">
                Book a Free Trial Class
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div>
          <h4 className="font-bold text-[1.8rem] md:text-[1.6rem] text-[var(--text-black)] mb-4 tracking-wide uppercase">
            Company &amp; Contact
          </h4>
          <ul className="space-y-[1.3vh] text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] font-medium mb-6">
            <li>
              <Link href="/about" className="hover:text-[var(--starbucks-green)] transition-colors">
                About BhashaSchool
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-[var(--starbucks-green)] transition-colors">
                Contact &amp; Support
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-[var(--starbucks-green)] transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[var(--starbucks-green)] transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>

          <div className="space-y-3 text-[1.4rem] text-[var(--text-black-soft)] font-medium pt-3 border-t border-[var(--ceramic)]">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
              <span>skoolbhasa11@gmail.com</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
              <span>91053 26128</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
              <span>Agra (India) &amp; Online Worldwide</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-none mx-auto px-[4vw] md:px-8 lg:px-12 mt-[6vh] pt-[3vh] border-t border-[var(--ceramic)] text-[1.4rem] text-[var(--text-black-soft)] font-medium flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <span>© {new Date().getFullYear()} BhashaSchool. All rights reserved.</span>
        
        <span className="inline-flex items-center gap-2 text-[1.35rem]">
          <span>Developed by</span>
          <a
            href="https://www.linkedin.com/in/harsh-vardhan-479b50318/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-[#173B63] hover:text-[#CF1E2C] bg-white border border-[rgba(32,37,42,0.14)] hover:border-[#173B63]/40 px-3 py-1 rounded-full shadow-2xs hover:shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Harshvardhan</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>
        </span>

        <span className="flex items-center gap-2">Made with <Heart className="w-4 h-4 fill-red-500 text-red-500" /> for language learners worldwide</span>
      </div>
    </footer>
  );
}
