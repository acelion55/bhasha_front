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
  Inbox,
  CheckCircle2,
  CreditCard,
  BookOpen,
  MessagesSquare,
} from 'lucide-react';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
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
            src="/logos/logowithtext.png"
            alt="BhashaSchool Logo"
            className="w-20 h-20 object-contain animate-pulse"
          />
          <p className="text-base sm:text-lg font-bold text-emerald-800">Loading BhashaSchool...</p>
        </div>
      </div>
    );
  }

  // Navigation tabs based on user role (Req 4: hide chat for non-subscribed students)
  const isSubscribed = Boolean((user as any)?.isSubscribed);

  const studentNav = [
    { name: 'My Classes & Cohorts', shortName: 'Classes', path: '/dashboard/student', icon: GraduationCap },
    ...(isSubscribed ? [{ name: 'Language Exchange', shortName: 'Chat', path: '/dashboard/student/chat', icon: MessagesSquare }] : []),
    { name: 'Completed Classes', shortName: 'Completed', path: '/dashboard/student/completed', icon: CheckCircle2 },
    { name: 'Payments & Plans', shortName: 'Payments', path: '/dashboard/student/payments', icon: CreditCard },
    {
      name: user?.language === 'English' || user?.language === 'Spanish' ? 'Profile & Settings' : 'Profile & Category',
      shortName: 'Profile',
      path: '/dashboard/profile',
      icon: User,
    },
  ];

  const mentorNav = [
    { name: 'Classes & Cohorts', shortName: 'Classes', path: '/dashboard/student', icon: GraduationCap },
    { name: 'Profile & Settings', shortName: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Users Engine', shortName: 'Users', path: '/dashboard/admin/users', icon: Users },
    { name: 'Student Chats', shortName: 'Chats', path: '/dashboard/admin/chats', icon: MessagesSquare },
    { name: 'Analytics', shortName: 'Analytics', path: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Classes Studio', shortName: 'Classes', path: '/dashboard/admin/classes', icon: Layers },
    { name: 'Mentor Classes', shortName: 'Mentor', path: '/dashboard/admin/mentor-classes', icon: GraduationCap },
    { name: 'Public Classes', shortName: 'Public', path: '/dashboard/admin/masterclasses', icon: Calendar },
    { name: 'Leads', shortName: 'Leads', path: '/dashboard/admin/leads', icon: Inbox },
    { name: 'Courses & Fees', shortName: 'Courses', path: '/dashboard/admin/courses', icon: BookOpen },
    { name: 'Blog Posts', shortName: 'Blogs', path: '/dashboard/admin/blogs', icon: FileText },
  ];

  let navItems = studentNav;
  if (user.role === 'admin') {
    navItems = adminNav;
  } else if (user.role === 'mentor' || user.role === 'teacher') {
    navItems = mentorNav;
  }

  return (
    <div 
      data-lenis-prevent="true"
      className={`h-[100dvh] h-screen w-full flex bg-[#f8faf9] text-gray-800 overflow-hidden font-[Plus_Jakarta_Sans] dashboard-mobile-type ${user.role === 'admin' ? 'admin-panel' : user.role === 'mentor' || user.role === 'teacher' ? '' : 'student-panel'}`}
    >

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 lg:w-60 flex-shrink-0 bg-[#0c1913] border-r border-[#152a20] shadow-xl flex-col h-full overflow-hidden text-gray-200">

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-3 p-3">

          {/* Brand Header */}
          <div className="flex items-center justify-between pt-1 pb-1.5 px-1">
            <Link href="/" className="flex items-center">
              <img src="/logos/whitelogo.png" alt="BhashaSchool Logo" className="h-7 w-auto object-contain" />
            </Link>
            <Link
              href="/"
              title="Back to Main Website"
              className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  <span className="truncate tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="flex-shrink-0 p-3 border-t border-white/10 bg-[#0c1913]">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-sm font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full min-h-0 min-w-0 overflow-hidden">

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
        <main 
          data-lenis-prevent="true"
          className="dashboard-main-scroll flex-1 overflow-y-auto min-h-0 bg-[#f8faf9] p-3 sm:p-4 lg:p-5 pb-24 md:pb-5"
        >
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
              className={`flex flex-col items-center justify-center py-1 ${navItems.length > 5 ? 'px-1.5' : 'px-3'} rounded-xl transition-all ${
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
