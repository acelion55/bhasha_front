import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[var(--ceramic)] bg-[#fdf8f3] py-[6vh] mt-[4vh]">
      <div className="max-w-7xl mx-auto px-[4vw] md:px-6 grid grid-cols-1 md:grid-cols-4 gap-[6vh] md:gap-[4vw]">

        {/* Brand */}
        <div className="col-span-1 space-y-[2vh]">
          <Link href="/" className="flex items-center flex-shrink-0">
             <img src="/logos/logowithtext.png" alt="Bhasha School Logo" className="h-[45px] md:h-[55px] w-auto object-contain cursor-pointer" />
          </Link>
          <p className="text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] leading-relaxed mt-4">
            Expert-led German &amp; English language tutoring — live lessons, AI practice, and certified programs.
          </p>
          <div className="flex items-center gap-2 text-[1.4rem] font-bold text-[var(--starbucks-green)] bg-[var(--green-light)] border border-emerald-200 px-[1.5vw] py-[0.5vh] rounded-full w-fit mt-4">
            <span className="w-2 h-2 rounded-full bg-[var(--green-accent)] animate-pulse inline-block" />
            Lessons Available Now
          </div>
        </div>

        {/* Courses */}
        <div>
          <h4 className="font-bold text-[1.8rem] md:text-[1.6rem] text-[var(--text-black)] mb-4 tracking-wide uppercase">Courses</h4>
          <ul className="space-y-[1.5vh] text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] font-medium">
            <li><Link href="/features" className="hover:text-[var(--starbucks-green)] transition-colors">German for Beginners</Link></li>
            <li><Link href="/features" className="hover:text-[var(--starbucks-green)] transition-colors">English Conversational</Link></li>
            <li><Link href="/features" className="hover:text-[var(--starbucks-green)] transition-colors">Business German</Link></li>
            <li><Link href="/features" className="hover:text-[var(--starbucks-green)] transition-colors">Exam Preparation</Link></li>
            <li><Link href="/pricing" className="hover:text-[var(--starbucks-green)] transition-colors">View Pricing</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-bold text-[1.8rem] md:text-[1.6rem] text-[var(--text-black)] mb-4 tracking-wide uppercase">Company</h4>
          <ul className="space-y-[1.5vh] text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] font-medium">
            <li><Link href="/about" className="hover:text-[var(--starbucks-green)] transition-colors">About BhashaSchool</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--starbucks-green)] transition-colors">Contact &amp; Support</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-[var(--starbucks-green)] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[var(--starbucks-green)] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-[1.8rem] md:text-[1.6rem] text-[var(--text-black)] mb-4 tracking-wide uppercase">Get in Touch</h4>
          <ul className="space-y-[1.5vh] text-[1.6rem] md:text-[1.4rem] text-[var(--text-black-soft)] font-medium">
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
              <span>hello@bhashaschool.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
              <span>+49 (0) 123 456 789</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
              <span>Berlin, Germany &amp; Online</span>
            </li>
          </ul>
          {/* Language flags */}
          <div className="flex items-center gap-3 mt-6">
            <span className="text-[1.4rem] font-bold bg-[var(--white)] border border-[var(--ceramic)] px-3 py-1 rounded-[4px] shadow-sm">🇩🇪 Deutsch</span>
            <span className="text-[1.4rem] font-bold bg-[var(--white)] border border-[var(--ceramic)] px-3 py-1 rounded-[4px] shadow-sm">🇬🇧 English</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-[4vw] md:px-6 mt-[6vh] pt-[3vh] border-t border-[var(--ceramic)] text-[1.4rem] text-[var(--text-black-soft)] font-medium flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <span>© {new Date().getFullYear()} BhashaSchool. All rights reserved.</span>
        <span className="flex items-center gap-2">Made with ❤️ for language learners worldwide</span>
      </div>
    </footer>
  );
}
