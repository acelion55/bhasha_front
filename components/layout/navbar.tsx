'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/classes', label: 'Classes' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ height: '70px' }} className="bg-white/95 backdrop-blur-md border-b border-[var(--ceramic)] sticky top-0 z-50 shadow-sm flex items-center">
        <div className="w-full mx-auto flex items-center justify-between h-full px-4 md:px-8 lg:px-12">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0" onClick={() => setOpen(false)}>
          <img src="/logos/logowithtext.png" alt="Bhasha School Logo" className="h-[45px] md:h-[55px] w-auto object-contain cursor-pointer" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-[2vw]">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-[1.6rem] font-semibold text-gray-600 hover:text-[var(--starbucks-green)] transition-colors tracking-wide">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-[1.5vw]">
          <Link href="/login" className="text-[1.4rem] font-bold text-[var(--starbucks-green)] hover:text-emerald-800 transition-colors">Log In</Link>
          <Link href="/register" className="btn-primary !bg-[var(--starbucks-green)] !border-[var(--starbucks-green)] hover:!scale-105 rounded-[40px] px-[2vw] py-[0.8vh] text-[1.4rem] font-bold shadow-md">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile login + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Link href="/login" onClick={() => setOpen(false)}
            className="px-3 py-1.5 rounded-full border border-[var(--starbucks-green)] text-[1.3rem] font-bold text-[var(--starbucks-green)] hover:bg-emerald-50 transition-colors">
            Log In
          </Link>
          <button className="p-[0.8vh] rounded-[6px] hover:bg-emerald-50 transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="w-[24px] h-[24px] text-gray-700" /> : <Menu className="w-[24px] h-[24px] text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[var(--ceramic)] shadow-lg absolute top-[70px] left-0 w-full z-50">
          <div className="flex flex-col px-[4vw] py-[2vh] gap-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="py-[2vh] text-[1.8rem] font-semibold text-gray-700 hover:text-[var(--starbucks-green)] border-b border-gray-100 last:border-0 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-[1.5vh] pt-[1.5vh]">
              <Link href="/register" onClick={() => setOpen(false)} className="py-[1.5vh] btn-primary rounded-[10px] text-[1.6rem] font-bold text-center !bg-[var(--starbucks-green)]">Start Free Trial</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
