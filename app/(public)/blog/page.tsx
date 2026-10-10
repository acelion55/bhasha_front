'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, BookOpen, Search, Tag } from 'lucide-react';

const categories = ['All', 'German Tips', 'English Learning', 'Grammar', 'Culture', 'Student Stories', 'Study Methods'];

const featured = {
  slug: 'escape-b1-b2-plateau',
  tag: 'Study Methods',
  tagColor: 'bg-emerald-100 text-emerald-700',
  title: 'How to Finally Escape the B1–B2 Intermediate Plateau in German',
  excerpt: 'Most German learners hit a wall at B1. They can order coffee, describe their day — but freeze the moment a native speaker replies at full speed. Here is the method that actually works, backed by 14,000+ learners.',
  author: 'Dr. Roberta Garcia',
  authorRole: 'Applied Linguistics · Imperial College London',
  authorEmoji: '👩‍🏫',
  date: 'Sep 28, 2026',
  readTime: '8 min read',
  emoji: '🧱',
};

const articles = [
  {
    slug: 'dative-case-mastery',
    tag: 'Grammar',
    tagColor: 'bg-blue-100 text-blue-700',
    title: 'Mastering the German Dative Case in 5 Simple Patterns',
    excerpt: 'The Dativ trips up 73% of intermediate learners. These five recurring sentence patterns will get you using it naturally within two weeks.',
    author: 'Lukas Bauer',
    authorEmoji: '🧑‍🏫',
    date: 'Sep 25, 2026',
    readTime: '6 min read',
    emoji: '📐',
  },
  {
    slug: 'british-vs-american-english',
    tag: 'English Learning',
    tagColor: 'bg-amber-100 text-amber-700',
    title: 'British vs American English: 47 Differences That Actually Matter at Work',
    excerpt: 'Beyond "colour vs color" — the vocabulary, formality norms, and meeting etiquette differences that can make or break a professional impression.',
    author: 'Sarah Mitchell',
    authorEmoji: '👩‍💼',
    date: 'Sep 22, 2026',
    readTime: '9 min read',
    emoji: '🇬🇧',
  },
  {
    slug: 'berliner-cafe-roleplay',
    tag: 'Culture',
    tagColor: 'bg-emerald-100 text-emerald-700',
    title: 'Ordering Like a Local: Berliner Café Culture & the Language of Casual German',
    excerpt: 'What to say, how to say it, and why "Ich hätte gerne" marks you as a respectful speaker — not "Ich will".',
    author: 'Anna Schmidt',
    authorEmoji: '☕',
    date: 'Sep 18, 2026',
    readTime: '5 min read',
    emoji: '☕',
  },
  {
    slug: 'priya-story-b2-to-c1',
    tag: 'Student Stories',
    tagColor: 'bg-rose-100 text-rose-700',
    title: "From B2 to C1 in 11 Weeks: Priya's Story of Speaking German at Work",
    excerpt: 'Software engineer from Bangalore to senior consultant in Frankfurt — the exact cohort schedule, tutor feedback methods, and scenario practice that worked.',
    author: 'Priya Nair',
    authorEmoji: '👩‍💻',
    date: 'Sep 14, 2026',
    readTime: '7 min read',
    emoji: '🚀',
  },
  {
    slug: 'spaced-repetition-german',
    tag: 'Study Methods',
    tagColor: 'bg-emerald-100 text-emerald-700',
    title: 'Why Most Flashcard Apps Fail German Learners (and What to Use Instead)',
    excerpt: 'Spaced repetition alone can not build speaking fluency. Here is the hybrid method — combining vocabulary cards with output practice — that actually produce results.',
    author: 'Dr. Roberta Garcia',
    authorEmoji: '👩‍🏫',
    date: 'Sep 10, 2026',
    readTime: '10 min read',
    emoji: '🧠',
  },
  {
    slug: 'german-articles-trick',
    tag: 'German Tips',
    tagColor: 'bg-violet-100 text-violet-700',
    title: 'The Secret Pattern for Guessing German Articles (Der, Die, Das) with 85% Accuracy',
    excerpt: 'Native speakers never think about articles — but there are 8 suffix rules that let you guess correctly most of the time. No more random guessing.',
    author: 'Lukas Bauer',
    authorEmoji: '🧑‍🏫',
    date: 'Sep 6, 2026',
    readTime: '7 min read',
    emoji: '🎯',
  },
];

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filtered = articles.filter((a) => {
    const matchesCategory = activeCategory === 'All' || a.tag === activeCategory;
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#fdf8f3] overflow-x-hidden">

      {/* HERO */}
      <section style={{ minHeight: '42vh' }} className="hero-gradient flex items-center py-14 md:py-20">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4 w-full text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4">BhashaSchool Journal</p>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 3.4rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] leading-tight mb-4">
            Insights for Language Learners
          </h1>
          <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-8">
            Expert guides, student stories, grammar deep-dives and cultural insights to help you speak German and English with real confidence.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-white border border-emerald-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* FEATURED POST */}
      <section style={{ minHeight: '40vh' }} className="bg-white py-12 md:py-16">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-6">Featured Article</p>
          <Link href={`/blog/${featured.slug}`}>
            <div className="card-soft overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Visual panel */}
                <div style={{ minHeight: '280px' }} className="lg:col-span-2 bg-gradient-to-br from-emerald-600 to-violet-800 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-6 left-6 w-24 h-24 rounded-full bg-white" />
                    <div className="absolute bottom-8 right-4 w-16 h-16 rounded-full bg-white" />
                    <div className="absolute top-1/2 right-12 w-10 h-10 rounded-full bg-white" />
                  </div>
                  <span style={{ fontSize: 'clamp(4rem, 8vw, 6rem)' }} className="relative">{featured.emoji}</span>
                </div>
                {/* Content */}
                <div className="lg:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${featured.tagColor}`}>{featured.tag}</span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{featured.readTime}</span>
                    <span className="text-[11px] text-gray-400">{featured.date}</span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] mb-4 group-hover:text-emerald-700 transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-lg">{featured.authorEmoji}</div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{featured.author}</p>
                        <p className="text-[10px] text-gray-400">{featured.authorRole}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 group-hover:gap-2.5 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ARTICLE GRID */}
      <section style={{ minHeight: '65vh' }} className="cream-bg py-12 md:py-16">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4">

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === c
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300/40'
                    : 'bg-white border border-emerald-100 text-gray-600 hover:border-emerald-300 hover:text-emerald-700'
                }`}>
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-bold text-gray-700">No articles found for "{search}"</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-4 text-sm text-emerald-600 font-bold hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((a) => (
                <Link key={a.slug} href={`/blog/${a.slug}`}>
                  <div className="card-soft overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Card visual */}
                    <div style={{ height: '160px' }} className="bg-gradient-to-br from-emerald-50 to-violet-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-emerald-400" />
                        <div className="absolute bottom-3 right-6 w-10 h-10 rounded-full bg-violet-500" />
                      </div>
                      <span style={{ fontSize: '3.5rem' }} className="relative">{a.emoji}</span>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${a.tagColor}`}>{a.tag}</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{a.readTime}</span>
                      </div>
                      <h3 style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] mb-3 group-hover:text-emerald-700 transition-colors leading-snug flex-1">
                        {a.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-5 line-clamp-2">{a.excerpt}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-sm">{a.authorEmoji}</div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-800">{a.author}</p>
                            <p className="text-[9px] text-gray-400">{a.date}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ minHeight: '35vh' }} className="bg-emerald-700 flex items-center py-14 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-violet-600/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-900/30 rounded-full blur-3xl" />
        </div>
        <div style={{ maxWidth: '72vw' }} className="relative mx-auto px-4 text-center w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-3">Stay Updated</p>
          <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.2rem)' }} className="font-extrabold text-white font-[Plus_Jakarta_Sans] mb-3">
            Weekly language tips, straight to your inbox
          </h2>
          <p className="text-emerald-100 text-sm max-w-md mx-auto mb-8">
            Join 6,200+ learners who get our Tuesday digest — grammar guides, vocabulary challenges, and student success stories every week.
          </p>
          {subscribed ? (
            <div className="inline-flex items-center gap-3 bg-white/20 border border-white/30 rounded-2xl px-8 py-4">
              <span className="text-2xl">🎉</span>
              <div className="text-left">
                <p className="font-bold text-white text-sm">You're subscribed!</p>
                <p className="text-emerald-200 text-xs">Check your inbox for a welcome email.</p>
              </div>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); if(email) setSubscribed(true); }}>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-5 py-3.5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur"
              />
              <button type="submit" className="px-6 py-3.5 bg-white text-emerald-700 font-bold text-sm rounded-2xl hover:bg-emerald-50 transition-colors flex items-center gap-2 justify-center flex-shrink-0">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
          <p className="text-emerald-300 text-[11px] mt-4">No spam. Unsubscribe in one click anytime.</p>
        </div>
      </section>

    </div>
  );
}
