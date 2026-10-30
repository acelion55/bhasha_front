'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navLinks = [
  { href: '/courses', label: 'Courses' },
  { href: '/classes', label: 'Classes' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const dashboardHref =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'mentor' || user?.role === 'teacher'
      ? '/dashboard/mentor'
      : '/dashboard/student';

  return (
    <>
      <nav
        style={{ height: '70px' }}
        className="fixed top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-b border-[var(--ceramic)] z-50 shadow-xs flex items-center"
      >
        <div className="w-full mx-auto flex items-center justify-between h-full px-4 md:px-8 lg:px-12">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0" onClick={() => setOpen(false)}>
          <img src="/logos/logowithtext.png" alt="Bhasha School Logo" className="h-[45px] md:h-[55px] w-auto object-contain cursor-pointer" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-[1.5vw]">
          {navLinks.map((l) => {
            const isActive = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[1.5rem] font-semibold transition-all tracking-wide ${
                  isActive
                    ? 'bg-[#FEE2E2] text-[#E02B3A] font-bold px-4 py-1.5 rounded-full shadow-2xs'
                    : 'text-gray-600 hover:text-[#E02B3A] px-2 py-1'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-[1.5vw]">
          {user ? (
            <Link
              href={dashboardHref}
              className="btn-primary !bg-[var(--starbucks-green)] !border-[var(--starbucks-green)] hover:!scale-105 rounded-[40px] px-[2vw] py-[0.8vh] text-[1.4rem] font-bold shadow-md flex items-center gap-2"
            >
              <LayoutDashboard className="w-[1.8rem] h-[1.8rem]" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[1.4rem] font-bold text-[var(--starbucks-green)] hover:text-emerald-800 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="btn-primary !bg-[var(--starbucks-green)] !border-[var(--starbucks-green)] hover:!scale-105 rounded-[40px] px-[2vw] py-[0.8vh] text-[1.4rem] font-bold shadow-md"
              >
                Start Free Trial
              </Link>
            </>
          )}
        </div>

        {/* Mobile login + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {user ? (
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="px-3.5 py-1.5 rounded-full bg-[var(--starbucks-green)] text-white text-[1.3rem] font-bold flex items-center gap-1.5 shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-3 py-1.5 rounded-full border border-[var(--starbucks-green)] text-[1.3rem] font-bold text-[var(--starbucks-green)] hover:bg-emerald-50 transition-colors"
            >
              Log In
            </Link>
          )}
          <button
            className="p-[0.8vh] rounded-[6px] hover:bg-emerald-50 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-[24px] h-[24px] text-gray-700" /> : <Menu className="w-[24px] h-[24px] text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-[var(--ceramic)] shadow-lg absolute top-[70px] left-0 w-full z-50">
          <div className="flex flex-col px-[4vw] py-[2vh] gap-2">
            {navLinks.map((l) => {
              const isActive = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`py-[1.5vh] text-[1.6rem] font-semibold border-b border-gray-100 last:border-0 transition-colors ${
                    isActive ? 'text-amber-800 font-bold bg-amber-50 px-3 rounded-lg' : 'text-gray-700 hover:text-[var(--starbucks-green)]'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-[1.5vh] pt-[1.5vh]">
              {user ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="py-[1.5vh] btn-primary rounded-[10px] text-[1.6rem] font-bold text-center !bg-[var(--starbucks-green)] flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </Link>
              ) : (
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="py-[1.5vh] btn-primary rounded-[10px] text-[1.6rem] font-bold text-center !bg-[var(--starbucks-green)]"
                >
                  Start Free Trial
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      </nav>
      {/* Spacer to offset fixed navbar height across all pages */}
      <div className="h-[70px] w-full flex-shrink-0" aria-hidden="true" />
    </>
  );
}
