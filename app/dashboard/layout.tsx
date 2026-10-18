'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  GraduationCap,
  Users,
  FileText,
  User,
  LogOut,
  Home,
  Calendar,
  Layers,
  BarChart3,
  CheckCircle2,
  CreditCard
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#f8faf9] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/logos/logowithouttext.png"
            alt="BhashaSchool Logo"
            className="w-20 h-20 object-contain animate-pulse"
          />
          <p className="text-base sm:text-lg font-bold text-emerald-800">Loading BhashaSchool...</p>
        </div>
      </div>
    );
  }

  // Navigation tabs based on user role
  const studentNav = [
    { name: 'My Classes & Cohorts', shortName: 'Classes', path: '/dashboard/student', icon: GraduationCap },
    { name: 'Completed Classes', shortName: 'Completed', path: '/dashboard/student/completed', icon: CheckCircle2 },
    { name: 'Payments & Plans', shortName: 'Payments', path: '/dashboard/student/payments', icon: CreditCard },
    { name: 'Profile & Category', shortName: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const mentorNav = [
    { name: 'Classes & Cohorts', shortName: 'Classes', path: '/dashboard/student', icon: GraduationCap },
    { name: 'Payments & Plans', shortName: 'Payments', path: '/dashboard/student/payments', icon: CreditCard },
    { name: 'Profile & Settings', shortName: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Users Engine', shortName: 'Users', path: '/dashboard/admin/users', icon: Users },
    { name: 'Analytics', shortName: 'Analytics', path: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Classes Studio', shortName: 'Classes', path: '/dashboard/admin/classes', icon: Layers },
    { name: 'Blog Posts', shortName: 'Blogs', path: '/dashboard/admin/blogs', icon: FileText },
  ];

  let navItems = studentNav;
  if (user.role === 'admin') {
    navItems = adminNav;
  } else if (user.role === 'mentor') {
    navItems = mentorNav;
  }

  return (
    <div className={`h-screen w-full flex bg-[#f8faf9] text-gray-800 overflow-hidden font-[Plus_Jakarta_Sans] ${user.role === 'admin' ? 'admin-panel' : ''}`}>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 flex-shrink-0 bg-[#0c1913] border-r border-[#152a20] shadow-xl flex-col h-screen overflow-hidden text-gray-200">

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-4 p-4">

          {/* Brand Header */}
          <div className="flex items-center justify-between pt-1 pb-2 px-1">
            <Link href="/" className="flex items-center">
              <img src="/logos/whitelogo.png" alt="BhashaSchool Logo" className="h-8 w-auto object-contain" />
            </Link>
            <Link
              href="/"
              title="Back to Main Website"
              className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-base font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="truncate tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="flex-shrink-0 p-4 border-t border-white/10 bg-[#0c1913]">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-base font-bold transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">

        {/* Mobile Header (Slightly larger, prominent branding) */}
        <header className="md:hidden flex items-center justify-between px-6 py-4.5 bg-[#0c1913] border-b border-[#152a20] text-gray-200 shrink-0 shadow-sm">
          <Link href="/" className="flex items-center">
            <img src="/logos/whitelogo.png" alt="BhashaSchool Logo" className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            {user?.category && (
              <span className="text-sm font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shadow-xs">
                Level {user.category}
              </span>
            )}
            <button
              onClick={() => logout()}
              title="Sign Out"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs sm:text-sm font-black transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f8faf9] p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation (Larger icons, reduced padding) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0c1913] border-t border-[#152a20] px-2 py-1.5 shadow-2xl flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-400 font-black'
                  : 'text-gray-400 hover:text-gray-200 font-bold'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40 shadow-xs' : 'text-gray-400'}`}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight font-black">{item.shortName || item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}