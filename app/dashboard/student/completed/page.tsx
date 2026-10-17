'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  GraduationCap,
  Users,
  Clock,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowRight,
  RefreshCw,
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { toast } from 'sonner';

interface Mentor {
  _id: string;
  name: string;
  email: string;
}

interface ClassItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  timing: string;
  mentor?: Mentor;
  mentorName?: string;
  mentorId?: any;
  students?: string[];
  enrolledStudents?: string[];
  maxStudents?: number;
  maxCapacity?: number;
  meetingLink?: string;
  status?: string;
  createdAt: string;
}

export default function CompletedClassesPage() {
  const { user } = useAuth();
  const [completedClasses, setCompletedClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompletedClasses();
  }, [user]);

  const fetchCompletedClasses = async () => {
    try {
      setLoading(true);
      const userId = user?.id || (user as any)?._id;

      // 1. Fetch classes from API
      const res = await api.get<ClassItem[]>('/classes');
      const allClasses = res.data || [];

      // 2. Read locally marked completed IDs
      const localCompletedIds: string[] = userId
        ? JSON.parse(localStorage.getItem(`completed_classes_${userId}`) || '[]')
        : [];

      // 3. Filter for classes completed by user (either backend status = completed or marked locally)
      const userCompleted = allClasses.filter((cls) => {
        const studentIds = cls.students || cls.enrolledStudents || [];
        const isEnrolled = userId && studentIds.some((s: any) => (typeof s === 'object' ? s._id : s) === userId);
        const isLocallyCompleted = localCompletedIds.includes(cls._id);
        const isServerCompleted = cls.status === 'completed' && isEnrolled;

        return isLocallyCompleted || isServerCompleted;
      });

      setCompletedClasses(userCompleted);
    } catch {
      toast.error('Failed to load completed classes');
    } finally {
      setLoading(false);
    }
  };

  const handleReenroll = (classId: string) => {
    const userId = user?.id || (user as any)?._id;
    if (userId) {
      const localCompletedIds: string[] = JSON.parse(localStorage.getItem(`completed_classes_${userId}`) || '[]');
      const filtered = localCompletedIds.filter((id) => id !== classId);
      localStorage.setItem(`completed_classes_${userId}`, JSON.stringify(filtered));
      toast.success('Batch moved back to active cohorts!');
      fetchCompletedClasses();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-7 font-[Plus_Jakarta_Sans]">
      {/* Clean Status & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 bg-white border border-emerald-100/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-lg font-bold text-gray-800">
          <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-emerald-950 font-black text-lg sm:text-xl">Completed Batches</strong>
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span className="text-sm sm:text-base font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
            {completedClasses.length} Finished
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/student"
            className="px-4 py-2.5 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base transition-all shadow-xs flex items-center gap-2"
          >
            <span>Active Batches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={fetchCompletedClasses}
            disabled={loading}
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Grid of Completed Classes */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 bg-white border border-emerald-100/90 rounded-3xl p-6 animate-pulse"
            />
          ))}
        </div>
      ) : completedClasses.length === 0 ? (
        <div className="bg-white border border-emerald-100/90 rounded-3xl p-12 sm:p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            No completed classes yet
          </h3>
          <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto font-medium leading-relaxed">
            Once you enroll and finish your language batches, they will appear here with your learning record.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/student"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base sm:text-lg shadow-md shadow-emerald-600/20 transition-all"
            >
              Browse Active Batches <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {completedClasses.map((cls) => {
            const mentorName =
              cls.mentor?.name ||
              (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) ||
              cls.mentorName ||
              'Senior Instructor';

            return (
              <div
                key={cls._id}
                className="bg-white border border-emerald-200/80 rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                {/* Decorative Completion Ribbon */}
                <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-black px-4 py-1 rounded-bl-2xl shadow-xs uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Completed
                </div>

                <div className="space-y-4">
                  {/* Category Pill and Completion Status */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="px-4 py-1.5 rounded-xl text-sm sm:text-base font-black bg-emerald-100 text-emerald-900 shadow-2xs">
                      Level {cls.category}
                    </span>
                    <span className="text-sm font-black text-emerald-700 flex items-center gap-1.5 mr-16">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Finished
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug">
                      {cls.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-700 line-clamp-3 mt-2 font-medium leading-relaxed">
                      {cls.description || 'Completed interactive language session with native exercises.'}
                    </p>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gray-50/90 border border-gray-100 p-4 sm:p-5 rounded-2xl space-y-2.5 text-base text-gray-800">
                    <div className="flex items-center gap-3 font-black text-gray-900">
                      <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-base sm:text-lg">{cls.timing || 'Schedule Completed'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-800 font-bold">
                      <GraduationCap className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-base sm:text-lg">Mentor: {mentorName}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5">
                  <div className="flex items-center justify-center gap-2 text-base font-black text-emerald-900 bg-emerald-50 py-3 rounded-2xl border border-emerald-200">
                    <Award className="w-5 h-5 text-emerald-600" /> Session Completed
                  </div>
                  <button
                    onClick={() => handleReenroll(cls._id)}
                    className="w-full py-3.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm sm:text-base transition-colors text-center"
                  >
                    Move Back to Active Batches
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
