'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, User, Video, IndianRupee, Search, Filter, ArrowRight } from 'lucide-react';

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

const themes = [
  { theme: 'bg-emerald-50/50 border-emerald-200', tag: 'text-emerald-800 bg-emerald-100' },
  { theme: 'bg-blue-50/50 border-blue-200', tag: 'text-blue-800 bg-blue-100' },
  { theme: 'bg-purple-50/50 border-purple-200', tag: 'text-purple-800 bg-purple-100' },
  { theme: 'bg-amber-50/50 border-amber-200', tag: 'text-amber-800 bg-amber-100' },
];

export default function PublicClassesPage() {
  const [classes, setClasses] = useState<PublicClass[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<PublicClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

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
    // Filter classes based on search and category
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
    <div className="min-h-screen bg-[#fdf8f3] pb-[10vh]">
      {/* Hero */}
      <section className="py-[10vh] text-center bg-gradient-to-b from-white to-[#fdf8f3]">
        <div className="max-w-none mx-auto px-[5vw] md:px-[3vw] lg:px-[4vw]">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[1.4rem] font-bold mb-[3vh] shadow-sm">
            <Video className="w-5 h-5" />
            Free Public Classes
          </div>
          <h1 className="text-[3.5rem] md:text-[4rem] font-bold text-gray-800 mb-[2vh]">
            Upcoming <span className="text-emerald-600">Public Classes</span>
          </h1>
          <p className="text-[1.6rem] md:text-[1.8rem] text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join free live classes hosted by expert trainers. Learn from industry professionals and get a taste of BhashaSchool's teaching methodology.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="max-w-none mx-auto px-[5vw] md:px-8 lg:px-12 py-[4vh]">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search classes by title, instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-[1.4rem]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-[1.4rem]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="max-w-none mx-auto px-[5vw] md:px-8 lg:px-12 py-[4vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse h-96" />
          ))
        ) : filteredClasses.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg border border-gray-200 text-center py-12">
            <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No classes found</h3>
            <p className="text-gray-600">Check back soon — new classes are added regularly.</p>
          </div>
        ) : (
          filteredClasses.map((cls, idx) => {
            const t = themes[idx % themes.length];
            const capacity = parseInt(cls.capacity) || 0;
            const remaining = capacity > 0 ? capacity : 0;
            const categoryShort = cls.category.split(' ')[0];

            return (
              <div key={cls.id} className={`bg-white rounded-lg border-2 ${t.theme} shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 p-6 overflow-hidden`}>
                {cls.imageUrl && (
                  <div className="-mx-6 -mt-6 mb-4 h-36 overflow-hidden">
                    <img src={cls.imageUrl} alt={cls.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[1.2rem] font-bold px-3 py-1 rounded-lg uppercase tracking-wider ${t.tag}`}>
                    {categoryShort}
                  </span>
                  {remaining > 0 && remaining <= 3 && (
                    <span className="text-[1rem] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-lg animate-pulse">
                      Filling Fast
                    </span>
                  )}
                </div>

                <h2 className="text-[1.8rem] font-bold text-gray-800 mb-2 line-clamp-2">{cls.title}</h2>

                <p className="text-gray-600 mb-4 line-clamp-2 text-[1.4rem]">{cls.description}</p>

                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 text-gray-700 font-medium text-[1.4rem]">
                    <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{cls.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 font-medium text-[1.4rem]">
                    <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{cls.time} IST • {cls.duration} min</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700 font-medium text-[1.4rem]">
                    <User className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{cls.instructor}</span>
                  </div>
                  {remaining > 0 && (
                    <div className="flex items-center gap-3 text-gray-700 font-medium text-[1.4rem] pt-2 border-t border-gray-300">
                      <Users className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>{remaining} Spots Available</span>
                    </div>
                  )}
                </div>

                <Link
                  href="/public-masterclasses"
                  className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors text-[1.4rem] flex items-center justify-center gap-2"
                >
                  Register Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })
        )}
      </section>

      {/* Admin Section */}
      <section className="max-w-2xl mx-auto px-[5vw] py-[8vh] mt-[5vh] text-center border-t border-gray-200">
        <h3 className="text-[2.5rem] font-bold text-gray-800 mb-4">Are you an Admin?</h3>
        <p className="text-[1.6rem] text-gray-600 mb-6">
          Manage and publish public classes from your admin dashboard. Upload masterclass details and track all registrations.
        </p>
        <div className="flex gap-4 justify-center flex-col sm:flex-row">
          <Link href="/dashboard/admin/masterclasses" className="px-8 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors text-[1.4rem] inline-flex items-center justify-center gap-2">
            Manage Classes <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/admin/leads" className="px-8 py-3 border-2 border-emerald-600 text-emerald-600 rounded-lg font-bold hover:bg-emerald-50 transition-colors text-[1.4rem] inline-flex items-center justify-center gap-2">
            View Registrations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
