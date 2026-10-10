'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { 
  GraduationCap, 
  Users, 
  Clock, 
  Video, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Search,
  ChevronRight,
  ShieldCheck,
  AlertCircle
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
  mentor: Mentor;
  students: string[];
  maxStudents: number;
  meetingLink?: string;
  createdAt: string;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(user?.category || 'A1');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.category) {
      setSelectedCategory(user.category);
    }
  }, [user]);

  useEffect(() => {
    fetchClasses();
  }, [selectedCategory]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get<ClassItem[]>('/classes', {
        params: { category: selectedCategory },
      });
      setClasses(res.data);
    } catch (err: any) {
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async (classId: string) => {
    try {
      setJoiningId(classId);
      await api.post(`/classes/${classId}/join`);
      toast.success('Successfully enrolled in class!');
      fetchClasses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to join class');
    } finally {
      setJoiningId(null);
    }
  };

  const categories = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-emerald-600 to-indigo-700 p-8 text-white shadow-xl shadow-emerald-900/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Learning Dashboard</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome back, <span className="text-amber-200">{user?.name}</span>!
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              Browse live interactive language batches, view timing slots, and join classes tailored to your level.
            </p>
          </div>

          {/* Current Category Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-emerald-950 font-black text-xl flex items-center justify-center shadow-inner">
              {user?.category || 'A1'}
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">Assigned Level</div>
              <div className="text-base font-bold text-white">Category {user?.category || 'A1'} Learner</div>
            </div>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">Explore Cohort Classes</h2>
            <p className="text-xs text-gray-500">Showing available live batches for selected proficiency category</p>
          </div>

          <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-emerald-100 shadow-sm">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const isUserCat = user?.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all relative ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  {cat}
                  {isUserCat && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 absolute -top-0.5 -right-0.5 ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Description Note */}
        <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>
              Showing classes in <strong>Category {selectedCategory}</strong>. {selectedCategory === user?.category ? 'This matches your currently enrolled proficiency level.' : 'You can view other levels or request level updates from your mentor.'}
            </span>
          </div>
          <span className="font-extrabold text-emerald-700 bg-white px-3 py-1 rounded-xl shadow-xs border border-emerald-100">
            {classes.length} {classes.length === 1 ? 'Class' : 'Classes'} Available
          </span>
        </div>
      </div>

      {/* Class Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-white border border-emerald-100 p-6 animate-pulse flex flex-col justify-between">
              <div className="space-y-3">
                <div className="h-6 bg-emerald-100 rounded-full w-1/3" />
                <div className="h-8 bg-emerald-100 rounded-xl w-3/4" />
                <div className="h-12 bg-emerald-50 rounded-xl" />
              </div>
              <div className="h-10 bg-emerald-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No classes found in Category {selectedCategory}</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Our academic team is scheduling upcoming live batches for this category. Contact support to register your interest.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => {
            const isEnrolled = user && cls.students?.includes(user.id);
            const isFull = (cls.students?.length || 0) >= (cls.maxStudents || 15);

            return (
              <div 
                key={cls._id} 
                className={`bg-white rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 ${
                  isEnrolled ? 'border-emerald-300 ring-2 ring-emerald-500/20' : 'border-emerald-100 hover:border-emerald-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700">
                      Category {cls.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                      <Users className="w-4 h-4 text-emerald-500" />
                      <span>
                        <strong className="text-gray-900">{cls.students?.length || 0}</strong> / {cls.maxStudents || 15} Students
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900 leading-snug">{cls.title}</h3>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{cls.description || 'Interactive live language sessions with native speaking exercises and grammar drills.'}</p>
                  </div>

                  {/* Class Info Box */}
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{cls.timing || 'Mon-Fri 7:00 PM - 8:00 PM IST'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <GraduationCap className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Mentor: <strong className="text-gray-900">{cls.mentor?.name || 'Senior Instructor'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6 border-t border-emerald-50 mt-6">
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" /> Enrolled in Batch
                      </div>
                      {cls.meetingLink ? (
                        <a
                          href={cls.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-300 transition-all"
                        >
                          <Video className="w-4 h-4" /> Join Live Meeting Room
                        </a>
                      ) : (
                        <p className="text-[11px] text-center text-gray-400">Meeting link will activate 10 mins before class</p>
                      )}
                    </div>
                  ) : isFull ? (
                    <button 
                      disabled 
                      className="w-full py-3 rounded-xl bg-gray-100 text-gray-400 font-bold text-xs cursor-not-allowed text-center"
                    >
                      Batch Capacity Full
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinClass(cls._id)}
                      disabled={joiningId === cls._id}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {joiningId === cls._id ? 'Joining Batch...' : 'Enroll in Live Class'}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
