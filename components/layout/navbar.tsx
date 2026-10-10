'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/features', label: 'Courses' },
  { href: '/classes', label: 'Classes' },
  { href: '/method', label: 'Our Method' },
  { href: '/about', label: 'About Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav style={{ height: '85px' }} className="bg-white/95 backdrop-blur-md border-b border-[var(--ceramic)] sticky top-0 z-50 shadow-sm flex items-center">
      <div style={{ maxWidth: '92vw' }} className="w-full mx-auto flex items-center justify-between h-full px-4">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0" onClick={() => setOpen(false)}>
          <img src="/logos/logowithtext.png" alt="Bhasha School Logo" className="h-[55px] md:h-[65px] w-auto object-contain cursor-pointer" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-[3vw]">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-[1.6rem] font-semibold text-gray-600 hover:text-[var(--starbucks-green)] transition-colors tracking-wide">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-[2vw]">
          <Link href="/login" className="text-[1.6rem] font-bold text-[var(--starbucks-green)] hover:text-emerald-800 transition-colors">Log In</Link>
          <Link href="/register" className="btn-primary !bg-[var(--starbucks-green)] !border-[var(--starbucks-green)] hover:!scale-105 rounded-[50px] px-[2.5vw] py-[1.2vh] text-[1.6rem] font-bold shadow-md">
            Start Free Trial
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-[1vh] rounded-[8px] hover:bg-emerald-50 transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="w-[30px] h-[30px] text-gray-700" /> : <Menu className="w-[30px] h-[30px] text-gray-700" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[var(--ceramic)] shadow-lg absolute top-[85px] left-0 w-full z-50">
          <div className="flex flex-col px-[5vw] py-[3vh] gap-2">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="py-[2vh] text-[1.8rem] font-semibold text-gray-700 hover:text-[var(--starbucks-green)] border-b border-gray-100 last:border-0 transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-[2vh] pt-[2vh]">
              <Link href="/login" onClick={() => setOpen(false)} className="py-[2vh] text-[1.8rem] font-bold text-[var(--starbucks-green)] text-center border border-[var(--ceramic)] rounded-[12px] hover:bg-emerald-50 transition-colors">Log In</Link>
              <Link href="/register" onClick={() => setOpen(false)} className="py-[2vh] btn-primary rounded-[12px] text-[1.8rem] font-bold text-center !bg-[var(--starbucks-green)]">Start Free Trial</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
