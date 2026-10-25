'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  GraduationCap, 
  Layers, 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  BookOpen,
  UserCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface RecentActivityItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  category?: string;
  studentId?: string;
  createdAt: string;
}

interface StatsResponse {
  totalUsers: number;
  totalAdmins: number;
  totalMentors?: number;
  totalStudents?: number;
  totalRegularUsers: number;
  recentUsers: number;
  levelCounts?: Record<string, number>;
  recentActivity?: RecentActivityItem[];
}

interface ClassItem {
  _id: string;
  title: string;
  category: string;
  timing?: string;
  mentorId?: string;
  students?: string[];
  maxStudents?: number;
  createdAt?: string;
}

interface BlogItem {
  _id: string;
  title: string;
  category: string;
  isPublished: boolean;
  createdAt?: string;
}

interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  category?: string;
  studentId?: string;
  createdAt?: string;
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, classesRes, blogsRes, usersRes] = await Promise.allSettled([
        api.get<StatsResponse>('/admin/stats'),
        api.get<ClassItem[]>('/classes'),
        api.get<BlogItem[]>('/blogs?all=true'),
        api.get<{ users: UserItem[] }>('/admin/users?limit=100'),
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
      }
      if (classesRes.status === 'fulfilled') {
        setClasses(classesRes.value.data || []);
      }
      if (blogsRes.status === 'fulfilled') {
        setBlogs(blogsRes.value.data || []);
      }
      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value.data?.users || []);
      }
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Compute metrics dynamically
  const userList = users.length > 0 ? users : [];
  const studentsList = userList.filter(u => u.role === 'student');
  const mentorsList = userList.filter(u => u.role === 'mentor' || u.role === 'teacher');

  const totalStudents = stats?.totalStudents ?? (studentsList.length > 0 ? studentsList.length : (stats?.totalRegularUsers || 0));
  const totalClasses = classes.length;
  const totalCapacity = classes.reduce((sum, c) => sum + (c.maxStudents || 20), 0);
  const totalEnrollments = classes.reduce((sum, c) => sum + (c.students?.length || 0), 0);
  const occupancyPercent = totalCapacity > 0 ? Math.round((totalEnrollments / totalCapacity) * 100) : 0;
  const publishedBlogs = blogs.filter(b => b.isPublished).length;

  // Level Distribution Calculation (Dynamic from users or backend stats)
  const levelCounts: Record<string, number> = {
    A1: 0,
    A2: 0,
    B1: 0,
    B2: 0,
  };

  if (stats?.levelCounts) {
    Object.entries(stats.levelCounts).forEach(([lvl, count]) => {
      if (levelCounts[lvl] !== undefined) {
        levelCounts[lvl] = count;
      }
    });
  } else if (studentsList.length > 0) {
    studentsList.forEach(u => {
      const cat = u.category?.toUpperCase() || 'A1';
      if (levelCounts[cat] !== undefined) {
        levelCounts[cat]++;
      }
    });
  }

  const levelCategories = [
    { key: 'A1', label: 'A1 Beginner', color: 'bg-emerald-500', barColor: 'bg-emerald-500' },
    { key: 'A2', label: 'A2 Elementary', color: 'bg-teal-500', barColor: 'bg-teal-500' },
    { key: 'B1', label: 'B1 Intermediate', color: 'bg-amber-500', barColor: 'bg-amber-500' },
    { key: 'B2', label: 'B2 Upper Intermediate', color: 'bg-indigo-500', barColor: 'bg-indigo-500' },
  ];

  const totalAssignedInLevels = Object.values(levelCounts).reduce((a, b) => a + b, 0) || totalStudents || 1;

  // Format Relative Time
  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  // Recent Activity items (from backend or users)
  const recentItems = stats?.recentActivity && stats.recentActivity.length > 0 
    ? stats.recentActivity 
    : userList.slice(0, 6);

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-4 font-[Plus_Jakarta_Sans] pb-8">
      {/* Header bar with Refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Academic Analytics</h2>
          <p className="text-xs text-gray-500">Live platform performance and student engagement data</p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Total Active Learners */}
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Active Learners</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {loading ? '...' : totalStudents}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> 
              {stats?.recentUsers ?? 0} joined in last 7 days
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Scheduled Batches */}
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Scheduled Batches</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {loading ? '...' : totalClasses}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 
              {mentorsList.length > 0 ? `${mentorsList.length} Active Mentors` : 'Live Schedule Active'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Cohort Seats Filled */}
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Cohort Seats Filled</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {loading ? '...' : totalEnrollments}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 
              {occupancyPercent}% Batch Capacity
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        {/* Blog & Resources Published */}
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-4.5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Educational Articles</p>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {loading ? '...' : publishedBlogs}
            </h3>
            <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-500" /> 
              {blogs.length} Total in CMS
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* CEFR Proficiency Level Distribution (100% Dynamic) */}
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">CEFR Proficiency Level Distribution</h3>
              <p className="text-[11px] text-gray-500">Live student breakdown by CEFR framework</p>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200/60 rounded-md text-[11px] font-bold">
              {totalStudents} Learners
            </span>
          </div>

          <div className="space-y-3">
            {levelCategories.map((cat) => {
              const count = levelCounts[cat.key] || 0;
              const percentage = totalAssignedInLevels > 0 ? Math.round((count / totalAssignedInLevels) * 100) : 0;

              return (
                <div key={cat.key} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                      {cat.label}
                    </span>
                    <span className="text-gray-500">
                      {count} {count === 1 ? 'Student' : 'Students'} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${cat.barColor} rounded-full transition-all duration-500`} 
                      style={{ width: `${Math.max(percentage, count > 0 ? 4 : 0)}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Platform Activity (100% Dynamic) */}
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Recent User Registrations & Updates</h3>
              <p className="text-[11px] text-gray-500">Live updates from the student and mentor roster</p>
            </div>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-2.5 text-xs">
            {recentItems.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs">
                No recent activity recorded yet
              </div>
            ) : (
              recentItems.map((act) => (
                <div key={act._id} className="p-2.5 rounded-xl bg-gray-50/70 border border-gray-200/70 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {act.name ? act.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 truncate flex items-center gap-1.5">
                        <span>{act.name}</span>
                        {act.role === 'admin' ? (
                          <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">Admin</span>
                        ) : act.role === 'mentor' || act.role === 'teacher' ? (
                          <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                            {act.role === 'teacher' ? 'Teacher' : 'Mentor'}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                            {act.category || 'A1'}
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-[11px] truncate">{act.email}</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-400 font-semibold shrink-0 text-right">
                    {getRelativeTime(act.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Live Class Batches Overview */}
      {classes.length > 0 && (
        <div className="bg-white border border-emerald-100/90 rounded-2xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">Active Batch Performance & Capacity</h3>
              <p className="text-[11px] text-gray-500">Live cohort metrics and student fill rates</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {totalEnrollments} / {totalCapacity} Seats Booked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {classes.map((cls) => {
              const enrolled = cls.students?.length || 0;
              const max = cls.maxStudents || 20;
              const percent = Math.min(100, Math.round((enrolled / max) * 100));

              return (
                <div key={cls._id} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{cls.title}</h4>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                      {cls.category}
                    </span>
                  </div>
                  
                  {cls.timing && (
                    <p className="text-[11px] text-gray-500 font-medium truncate">{cls.timing}</p>
                  )}

                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-gray-600">
                      <span>Enrollment</span>
                      <span>{enrolled} / {max} seats ({percent}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          percent >= 90 ? 'bg-rose-500' : percent >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
