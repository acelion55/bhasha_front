'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Clock,
  BookOpen,
  Search,
  Brain,
  Coffee,
  Languages,
  Rocket,
  Target,
  UserRound,
  SearchX,
  PartyPopper,
  Loader2,
  Info,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const categoryIcons: Record<string, LucideIcon> = {
  'Study Methods': Brain,
  Grammar: BookOpen,
  'English Learning': Languages,
  Culture: Coffee,
  'Student Stories': Rocket,
  'German Tips': Target,
  'Goethe Exam Prep': Target,
  'Peer Ladder Tips': Rocket,
  'Vocabulary Drills': Languages,
  About: Info,
};

function CategoryIcon({ tag, className }: { tag: string; className?: string }) {
  const Icon = categoryIcons[tag] ?? BookOpen;
  return <Icon className={className} />;
}

interface ApiBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl?: string;
  tag?: string;
  tagColor?: string;
  author?: string;
  authorRole?: string;
  readTime?: string;
  createdAt?: string;
}

interface BlogCard {
  slug: string;
  tag: string;
  tagColor: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}

const fallbackTagColor = 'bg-[var(--green-light)] text-[var(--house-green)]';

const formatDate = (value?: string) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const toCard = (blog: ApiBlog): BlogCard => ({
  slug: blog.slug,
  tag: blog.tag || 'German Tips',
  tagColor: blog.tagColor || fallbackTagColor,
  title: blog.title,
  excerpt: blog.excerpt || '',
  author: blog.author || 'BhashaSchool Academic Team',
  authorRole: blog.authorRole || 'Senior Tutor',
  date: formatDate(blog.createdAt),
  readTime: blog.readTime || '5 min read',
  imageUrl: blog.imageUrl || '',
});

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const loadBlogs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/blogs`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Request failed');
      const data: ApiBlog[] = await res.json();
      setBlogs(Array.isArray(data) ? data.map(toCard) : []);
    } catch {
      setError('Could not load articles right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(blogs.map((b) => b.tag)))],
    [blogs],
  );

  const featured = blogs[0];
  const articles = blogs.slice(1);

  const filtered = articles.filter((article) => {
    const matchesCategory = activeCategory === 'All' || article.tag === activeCategory;
    const term = search.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(term) || article.excerpt.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[var(--neutral-warm)] min-h-screen overflow-x-hidden pb-20">
      
      {/* ── HERO ── */}
      <section className="pt-16 pb-12 md:py-20 text-center bg-gradient-to-b from-white to-[var(--neutral-warm)] border-b border-[var(--ceramic)]">
        <div className="w-full max-w-none px-4 md:px-8 lg:px-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--gold-lightest)] border border-[var(--gold-light)] text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            BhashaSchool Journal &amp; Guides
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--text-black)] tracking-tight mb-4">
            Insights for <span className="text-[var(--gold)]">Language Learners</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-black-soft)] max-w-2xl mx-auto leading-relaxed mb-8">
            Expert guides, CEFR exam strategies, grammar breakdowns, and cultural blueprints to help you speak German and English with genuine confidence.
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles by topic, keyword, CEFR level..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white border border-[var(--ceramic)] text-sm text-[var(--text-black)] focus:outline-none focus:ring-2 focus:ring-[var(--house-green)] shadow-sm font-medium"
            />
          </div>
        </div>
      </section>

      {loading ? (
        <section className="py-20">
          <div className="mx-auto flex items-center justify-center gap-3 px-4 text-sm font-bold text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--gold)]" />
            Loading articles…
          </div>
        </section>
      ) : error ? (
        <section className="py-20">
          <div className="mx-auto max-w-md px-4 text-center">
            <p className="text-sm font-bold text-rose-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={loadBlogs}
              className="rounded-xl bg-[var(--house-green)] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#132c4d] transition"
            >
              Try Again
            </button>
          </div>
        </section>
      ) : blogs.length === 0 ? (
        <section className="py-20">
          <div className="mx-auto max-w-md px-4 text-center">
            <BookOpen className="mx-auto mb-3 h-12 w-12 text-slate-300" />
            <p className="text-base font-bold text-slate-700">No articles published yet</p>
            <p className="mt-1 text-sm text-slate-500">New language guides and exam blueprints will appear here shortly.</p>
          </div>
        </section>
      ) : (
        <div className="w-full max-w-none px-4 md:px-8 lg:px-12 py-10">
          
          {/* ── FEATURED POST ── */}
          {featured && (
            <div className="mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold)] mb-4 block">
                Featured Guide
              </span>
              <Link href={`/blog/${featured.slug}`}>
                <div className="bg-white rounded-3xl border border-[var(--ceramic)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                    <div className="lg:col-span-2 min-h-[260px] lg:min-h-[320px] bg-[var(--house-green)] flex items-center justify-center relative overflow-hidden text-white">
                      {featured.imageUrl ? (
                        <img src={featured.imageUrl} alt={featured.title} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <CategoryIcon tag={featured.tag} className="w-20 h-20 text-[var(--gold-light)] mb-3 opacity-90" />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">CEFR Academic Guide</span>
                        </div>
                      )}
                    </div>

                    <div className="lg:col-span-3 p-8 sm:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[var(--green-light)] text-[var(--house-green)]">
                          {featured.tag}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5" />{featured.readTime}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{featured.date}</span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-black)] mb-3 group-hover:text-[var(--gold)] transition-colors leading-snug">
                        {featured.title}
                      </h2>

                      <p className="text-sm sm:text-base text-[var(--text-black-soft)] leading-relaxed mb-6 line-clamp-3">
                        {featured.excerpt}
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[var(--ceramic)]">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[var(--house-green)] font-bold">
                            <UserRound className="w-5 h-5 text-[var(--house-green)]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-black)]">{featured.author}</p>
                            <p className="text-[11px] text-slate-400">{featured.authorRole}</p>
                          </div>
                        </div>

                        <span className="flex items-center gap-1.5 text-sm font-bold text-[var(--gold)] group-hover:gap-2.5 transition-all">
                          Read Full Guide <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ── CATEGORY FILTER BUTTONS ── */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === category
                    ? 'bg-[var(--house-green)] text-white shadow-md'
                    : 'bg-white border border-[var(--ceramic)] text-[var(--text-black-soft)] hover:bg-slate-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* ── ARTICLES GRID ── */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[var(--ceramic)] p-8">
              <div className="mb-4 flex justify-center"><SearchX className="w-12 h-12 text-slate-300" /></div>
              <p className="font-bold text-slate-700 text-lg">
                {articles.length === 0 ? 'More articles are coming soon.' : `No articles found for "${search}"`}
              </p>
              {articles.length > 0 && (
                <button 
                  onClick={() => { setSearch(''); setActiveCategory('All'); }} 
                  className="mt-4 text-sm text-[var(--gold)] font-bold hover:underline cursor-pointer"
                >
                  Clear search filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`}>
                  <div className="bg-white rounded-2xl border border-[var(--ceramic)] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col group cursor-pointer">
                    <div className="h-44 bg-[var(--house-green)] flex items-center justify-center relative overflow-hidden">
                      {article.imageUrl ? (
                        <img src={article.imageUrl} alt={article.title} className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <CategoryIcon tag={article.tag} className="relative w-14 h-14 text-[var(--gold-light)] opacity-70" />
                      )}
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--green-light)] text-[var(--house-green)]">
                            {article.tag}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />{article.readTime}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--text-black)] mb-2.5 group-hover:text-[var(--gold)] transition-colors leading-snug line-clamp-2">
                          {article.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[var(--text-black-soft)] leading-relaxed mb-6 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[var(--ceramic)]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                            <UserRound className="w-4 h-4 text-[var(--house-green)]" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-black)]">{article.author}</p>
                            <p className="text-[10px] text-slate-400">{article.date}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── NEWSLETTER CALLOUT ── */}
          <section className="bg-[var(--house-green)] rounded-3xl p-8 sm:p-12 mt-16 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="relative mx-auto max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--gold-light)] mb-2 block">
                Stay Ahead in Languages
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                Weekly CEFR exam tips &amp; speaking drills
              </h2>
              <p className="text-sm text-[var(--text-white-soft)] mb-8 leading-relaxed">
                Join 6,200+ students who get our weekly digest on Goethe exam questions, grammar blueprints, and conversation habits.
              </p>

              {subscribed ? (
                <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-6 py-3.5">
                  <PartyPopper className="w-5 h-5 text-[var(--gold)] flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-white text-sm">You&apos;re subscribed!</p>
                    <p className="text-slate-300 text-xs">Watch your inbox for weekly fluency tips.</p>
                  </div>
                </div>
              ) : (
                <form 
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" 
                  onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}
                >
                  <input
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
                  />
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-[var(--gold)] hover:bg-[#b45309] text-white font-bold text-sm rounded-xl transition shadow-md cursor-pointer flex-shrink-0"
                  >
                    Subscribe Free
                  </button>
                </form>
              )}
              <p className="text-slate-400 text-xs mt-4">Zero spam. Unsubscribe anytime with 1 click.</p>
            </div>
          </section>

        </div>
      )}

    </div>
  );
}
