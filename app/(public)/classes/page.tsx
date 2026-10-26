'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, User, Video, Search, ArrowRight, Sparkles, Check, BookOpen } from 'lucide-react';
import TrialBookingForm from '@/components/TrialBookingForm';

interface PublicClass {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  instructor: string;
  category: string;
  capacity: string;
  imageUrl?: string;
  registrations?: number;
}

interface ApiPublicClass extends Omit<PublicClass, 'id' | 'capacity'> {
  _id: string;
  capacity: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function PublicClassesPage() {
  const [classes, setClasses] = useState<PublicClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<PublicClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [trialModalOpen, setTrialModalOpen] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/masterclasses`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Request failed');
        const data: ApiPublicClass[] = await res.json();
        const upcoming = data
          .map((mc) => ({
            ...mc,
            id: mc._id,
            capacity: String(mc.capacity ?? 0),
          }))
          .filter((mc) => new Date(`${mc.date} ${mc.time}`) > new Date());

        setClasses(upcoming);
        const uniqueCategories = [...new Set(upcoming.map((mc) => mc.category).filter(Boolean))];
        setCategories(uniqueCategories as string[]);
      } catch {
        setClasses([]);
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(cls => cls.category === filterCategory);
    }

    setFilteredClasses(filtered);
  }, [classes, searchTerm, filterCategory]);

  return (
    <div className="min-h-screen bg-[var(--neutral-warm)] pb-24 overflow-x-hidden">
      
      {/* ── HERO ── */}
      <section className="pt-16 pb-12 md:py-20 text-center bg-gradient-to-b from-white to-[var(--neutral-warm)] border-b border-[var(--ceramic)]">
        <div className="w-full max-w-none px-4 md:px-8 lg:px-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--gold-lightest)] border border-[var(--gold-light)] text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            Interactive Live Sessions
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-black)] tracking-tight mb-4">
            Upcoming <span className="text-[var(--gold)]">Live Classes &amp; Masterclasses</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-black-soft)] max-w-2xl mx-auto leading-relaxed">
            Experience BhashaSchool&apos;s active speaking methodology. Join interactive sessions hosted by Goethe-certified educators and senior peer mentors.
          </p>
        </div>
      </section>

      {/* ── SEARCH & FILTER ── */}
      <section className="w-full max-w-none px-4 md:px-8 lg:px-12 py-8">
        <div className="flex gap-4 flex-col md:flex-row max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search classes by topic, instructor, level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-[var(--ceramic)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none shadow-sm text-[var(--text-black)]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-5 py-3.5 bg-white border border-[var(--ceramic)] rounded-xl text-sm focus:ring-2 focus:ring-[var(--house-green)] focus:outline-none shadow-sm text-[var(--text-black)] font-medium cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      {/* ── CLASSES GRID ── */}
      <section className="w-full max-w-none px-4 md:px-8 lg:px-12 py-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[var(--ceramic)] rounded-2xl p-8 animate-pulse h-96 shadow-sm" />
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[var(--ceramic)] text-center py-16 px-6 max-w-2xl mx-auto shadow-sm">
            <Video className="w-14 h-14 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-[var(--text-black)] mb-2">No Scheduled Classes Found</h3>
            <p className="text-sm text-[var(--text-black-soft)] mb-6 max-w-md mx-auto">
              New masterclasses and live taster cohorts are announced every Monday. You can also book a personalized 1-on-1 level placement right now.
            </p>
            <button
              onClick={() => setTrialModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--gold)] hover:bg-[#b45309] text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer"
            >
              Book Free 1-on-1 Placement <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => {
              const capacity = parseInt(cls.capacity) || 0;
              const remaining = capacity > 0 ? capacity : 0;
              const categoryShort = cls.category.split(' ')[0] || 'Language';

              return (
                <div 
                  key={cls.id} 
                  className="bg-white rounded-2xl border border-[var(--ceramic)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 sm:p-7 flex flex-col justify-between"
                >
                  <div>
                    {cls.imageUrl && (
                      <div className="-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 h-44 overflow-hidden rounded-t-2xl">
                        <img src={cls.imageUrl} alt={cls.title} className="h-full w-full object-cover" />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-[var(--green-light)] text-[var(--house-green)]">
                        {categoryShort}
                      </span>
                      {remaining > 0 && remaining <= 4 && (
                        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full animate-pulse">
                          {remaining} Spots Left
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-[var(--text-black)] mb-2 line-clamp-2 leading-snug">
                      {cls.title}
                    </h2>

                    <p className="text-sm text-[var(--text-black-soft)] mb-6 line-clamp-2 leading-relaxed">
                      {cls.description}
                    </p>

                    {/* Metadata details */}
                    <div className="space-y-2.5 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm">
                      <div className="flex items-center gap-3 text-[var(--text-black)] font-medium">
                        <Calendar className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                        <span>{cls.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[var(--text-black)] font-medium">
                        <Clock className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                        <span>{cls.time} IST ({cls.duration} min)</span>
                      </div>
                      <div className="flex items-center gap-3 text-[var(--text-black)] font-medium">
                        <User className="w-4 h-4 text-[var(--house-green)] flex-shrink-0" />
                        <span>Mentor: {cls.instructor}</span>
                      </div>
                      {remaining > 0 && (
                        <div className="flex items-center gap-3 text-[var(--text-black)] font-medium pt-2 border-t border-slate-200">
                          <Users className="w-4 h-4 text-[var(--house-green)] flex-shrink-0" />
                          <span>Cohort Capacity: {capacity} Students</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href="/public-masterclasses-for-german-language"
                    className="w-full py-3.5 px-6 bg-[var(--house-green)] hover:bg-[#132c4d] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Register Free Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── BOTTOM BANNER ── */}
      <section className="w-full max-w-none px-4 md:px-8 lg:px-12 pt-12">
        <div className="bg-[var(--house-green)] rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-light)] mb-2 block">
              Personalized Guidance
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Need a full CEFR certification roadmap?
            </h3>
            <p className="text-sm sm:text-base text-[var(--text-white-soft)] leading-relaxed">
              Explore our structured A1–B2 cohorts with Goethe exam preparation, daily mentor speaking drills, and proven visa approval training.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-shrink-0">
            <button
              onClick={() => setTrialModalOpen(true)}
              className="px-6 py-3.5 bg-[var(--gold)] hover:bg-[#b45309] text-white font-bold text-sm rounded-xl transition shadow-lg cursor-pointer"
            >
              Book Free Trial Demo
            </button>
            <Link
              href="/courses"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition text-center"
            >
              View Full Course Syllabus
            </Link>
          </div>
        </div>
      </section>

      <TrialBookingForm type="trial" isOpen={trialModalOpen} onClose={() => setTrialModalOpen(false)} />
    </div>
  );
}
