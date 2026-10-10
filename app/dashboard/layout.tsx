'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  FileText, 
  Search, 
  User, 
  LogOut, 
  Home, 
  Sparkles,
  Calendar,
  Layers,
  Settings
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
      <div className="h-screen flex items-center justify-center bg-[#fdf8f3]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-violet-500 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-300">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm font-semibold text-emerald-700">Loading BhashaSchool...</p>
        </div>
      </div>
    );
  }

  // Navigation tabs based on user role
  const studentNav = [
    { name: 'My Classes & Cohorts', path: '/dashboard/student', icon: GraduationCap, badge: user.category || 'A1' },
    { name: 'Profile & Category', path: '/dashboard/profile', icon: User, badge: 'Student' },
  ];

  const mentorNav = [
    { name: 'Mentor Class Studio', path: '/dashboard/mentor', icon: Calendar, badge: 'Mentor' },
    { name: 'Profile & Settings', path: '/dashboard/profile', icon: User, badge: 'Settings' },
  ];

  const adminNav = [
    { name: 'Classes Engine', path: '/dashboard/admin/classes', icon: Layers, badge: 'Live' },
    { name: 'Students & Roles', path: '/dashboard/admin', icon: Users, badge: 'Admin' },
    { name: 'Blog Posts', path: '/dashboard/admin/blogs', icon: FileText, badge: 'CMS' },
    { name: 'SEO Meta Manager', path: '/dashboard/admin/seo', icon: Search, badge: 'SEO' },
  ];

  let navItems = studentNav;
  if (user.role === 'admin') {
    navItems = adminNav;
  } else if (user.role === 'mentor') {
    navItems = mentorNav;
  }

  return (
    <div className="h-screen flex bg-[#fdf8f3] text-gray-800 overflow-hidden font-[Plus_Jakarta_Sans]">

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-emerald-100/80 shadow-sm flex flex-col h-full overflow-hidden">

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 p-5">

          {/* Brand Logo */}
          <div className="flex items-center justify-between pt-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-violet-600 flex items-center justify-center shadow-md shadow-emerald-200">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-base text-gray-900 tracking-tight">
                Bhasha<span className="text-emerald-600">School</span>
              </span>
            </Link>
            <Link href="/" title="Back to Main Website" className="p-2 text-gray-400 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors">
              <Home className="w-4 h-4" />
            </Link>
          </div>

          {/* User Role Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-100 rounded-2xl p-3.5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-200/50 px-2 py-0.5 rounded-full">
                {user.role}
              </span>
              {user.category && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Level {user.category}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-gray-900 truncate">{user.name || 'User'}</p>
            <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Main Navigation */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 px-2 mb-2">
              Dashboard Navigation
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300/50 scale-[1.01]'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-emerald-100/60 text-emerald-700'
                  }`}>
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Quick Support Phone Box */}
          <div className="pt-2">
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
              <p className="text-[11px] font-bold text-emerald-900">Student Helpline</p>
              <p className="text-xs font-extrabold text-emerald-600 mt-0.5">+91 91053 26128</p>
            </div>
          </div>

        </div>

        {/* Bottom User Controls */}
        <div className="flex-shrink-0 p-4 border-t border-emerald-100/80 space-y-2 bg-white">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#fdf8f3] p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
