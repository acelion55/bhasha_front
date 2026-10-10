import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Share2, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';

// Static article data (can be replaced with CMS/API fetch)
const getArticle = (slug: string) => {
  const articles: Record<string, any> = {
    'escape-b1-b2-plateau': {
      tag: 'Study Methods', tagColor: 'bg-emerald-100 text-emerald-700',
      emoji: '🧱',
      title: 'How to Finally Escape the B1–B2 Intermediate Plateau in German',
      author: 'Dr. Roberta Garcia', authorRole: 'Applied Linguistics · Imperial College London', authorEmoji: '👩‍🏫',
      date: 'September 28, 2026', readTime: '8 min read',
      intro: 'Most German learners hit a wall at B1. They can order coffee, describe their day — but freeze the moment a native speaker replies at full speed. Here is the method that actually works, backed by 14,000+ learners.',
      sections: [
        {
          heading: 'Why the Plateau Exists',
          content: 'The B1–B2 plateau is not a failure of motivation or intelligence. It is a structural failure of the learning method. At A1 and A2, progress is visible and fast — every new word is a win. But at B1, learners have enough passive vocabulary to "get by", and the brain stops urgently processing new input.\n\nResearch from UCL\'s language acquisition department found that 54% of adult learners who used traditional coursebooks stalled at B1 for more than 6 months. The reason? Passive exposure without forced production output.',
        },
        {
          heading: 'The Output-First Method',
          content: 'The single most effective intervention we found across 14,000 BhashaSchool learners was shifting from passive to active output as the primary learning activity. Instead of watching German TV (input), learners were asked to describe a scene from memory using only what they knew (output).\n\nThis "retrieval-based production" forces the brain to access grammar structures under realistic communicative pressure — exactly what happens in real conversation.',
        },
        {
          heading: 'The 3 Patterns That Unlock B2',
          body: [
            { n: '01', title: 'Subordinate Clause Practice', text: 'German subordinate clauses (Nebensätze) push the verb to the end. Most B1 learners know this rule but cannot apply it in real-time speech. Dedicated speaking drills — 10 minutes daily — close this gap within 3 weeks.' },
            { n: '02', title: 'Dative Case Automaticity', text: 'The Dativ case requires a different set of article endings and is triggered by specific prepositions (mit, bei, seit, von, nach, aus, gegenüber, außer, zu). Drilling these 9 prepositions with sentence stems builds automaticity, not just rule-awareness.' },
            { n: '03', title: 'Connective Vocabulary', text: 'B2 speech sounds fluent not because of complex vocabulary, but because of "linking language" — allerdings, dennoch, zwar...aber, einerseits...andererseits. Learning 20 connective expressions and drilling them in spoken output transforms perceived fluency overnight.' },
          ],
        },
        {
          heading: 'What Our Data Shows',
          content: 'Across BhashaSchool\'s Accelerated track (3 live sessions/week, max 5 learners), the average learner moves from B1 to B2 in 11 weeks. The key differentiator compared to self-study groups? 38 minutes of forced speaking output per session, compared to under 5 minutes in most classroom environments.',
        },
        {
          heading: 'Practical Steps to Start Today',
          list: [
            'Record a 2-minute voice memo in German every morning — no script, just talk about your day',
            'Spend 10 minutes on subordinate clause drilling using sentence starters (Ich denke, dass… / Obwohl… / Nachdem…)',
            'Join a live cohort where you are required to speak, not just listen',
            'Track your errors — not to feel bad, but to identify the 3 patterns you repeat most',
            'Use the "Berliner Café Method": simulate realistic service encounters daily for 5 minutes',
          ],
        },
      ],
      related: [
        { slug: 'dative-case-mastery', emoji: '📐', tag: 'Grammar', tagColor: 'bg-blue-100 text-blue-700', title: 'Mastering the German Dative Case in 5 Simple Patterns', readTime: '6 min' },
        { slug: 'spaced-repetition-german', emoji: '🧠', tag: 'Study Methods', tagColor: 'bg-emerald-100 text-emerald-700', title: 'Why Most Flashcard Apps Fail German Learners', readTime: '10 min' },
        { slug: 'priya-story-b2-to-c1', emoji: '🚀', tag: 'Student Stories', tagColor: 'bg-rose-100 text-rose-700', title: "From B2 to C1 in 11 Weeks: Priya's Story", readTime: '7 min' },
      ],
    },
  };
  return articles[slug] || articles['escape-b1-b2-plateau'];
};

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);

  return (
    <div className="bg-[#fdf8f3] overflow-x-hidden">

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-emerald-100">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
          <Link href="/blog" className="hover:text-emerald-700 font-medium transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3 h-3" /> BhashaSchool Blog
          </Link>
          <span>/</span>
          <span className="text-gray-400 truncate max-w-[200px] md:max-w-none">{article.tag}</span>
        </div>
      </div>

      {/* HERO */}
      <section style={{ minHeight: '38vh' }} className="bg-gradient-to-br from-emerald-50 via-[#fdf8f3] to-violet-50 flex items-center py-12 md:py-20">
        <div style={{ maxWidth: '76vw' }} className="mx-auto px-4 w-full">
          <div className="flex items-center gap-3 mb-5">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full ${article.tagColor}`}>{article.tag}</span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
            <span className="text-[11px] text-gray-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-3xl">{article.intro}</p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-xl">{article.authorEmoji}</div>
              <div>
                <p className="text-sm font-bold text-gray-900">{article.author}</p>
                <p className="text-xs text-gray-400">{article.authorRole}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors border border-gray-200 hover:border-emerald-300 rounded-xl px-4 py-2">
              <Share2 className="w-3.5 h-3.5" /> Share Article
            </button>
          </div>
        </div>
      </section>

      {/* BIG EMOJI BANNER */}
      <div style={{ height: '220px' }} className="bg-gradient-to-br from-emerald-600 to-violet-800 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-white" />
          <div className="absolute bottom-0 right-1/4 w-28 h-28 rounded-full bg-white" />
        </div>
        <span style={{ fontSize: 'clamp(4rem, 12vw, 8rem)' }} className="relative">{article.emoji}</span>
      </div>

      {/* ARTICLE BODY + SIDEBAR */}
      <section style={{ minHeight: '70vh' }} className="bg-white py-12 md:py-16">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* MAIN CONTENT */}
          <article className="lg:col-span-3 prose-custom">
            {article.sections.map((sec: any, i: number) => (
              <div key={i} className="mb-10">
                <h2 style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] mb-4 mt-8 first:mt-0">
                  {sec.heading}
                </h2>
                {sec.content && (
                  <div className="space-y-4">
                    {sec.content.split('\n\n').map((para: string, pi: number) => (
                      <p key={pi} className="text-sm text-gray-600 leading-[1.8]">{para}</p>
                    ))}
                  </div>
                )}
                {sec.body && (
                  <div className="space-y-5 mt-4">
                    {sec.body.map((item: any) => (
                      <div key={item.n} className="flex gap-4 card-soft p-6">
                        <span style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)' }} className="font-extrabold text-emerald-100 font-[Plus_Jakarta_Sans] flex-shrink-0 leading-none">{item.n}</span>
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-sm mb-2 font-[Plus_Jakarta_Sans]">{item.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {sec.list && (
                  <ul className="space-y-3 mt-4">
                    {sec.list.map((item: string, li: number) => (
                      <li key={li} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* CTA within article */}
            <div className="bg-emerald-700 rounded-3xl p-8 text-white mt-10">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-200 mb-2">Ready to apply what you just read?</p>
              <h3 style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.4rem)' }} className="font-extrabold font-[Plus_Jakarta_Sans] mb-3">
                Join a live BhashaSchool cohort and practice with a native instructor
              </h3>
              <p className="text-emerald-100 text-sm mb-5">Max 5 learners per class · 38 min average speaking time · Free spoken assessment</p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-bold text-sm px-6 py-3.5 rounded-2xl hover:bg-emerald-50 transition-colors">
                Schedule Free Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="space-y-6">
            {/* Author card */}
            <div className="card-soft p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Written by</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">{article.authorEmoji}</div>
                <div>
                  <p className="text-sm font-extrabold text-gray-900 font-[Plus_Jakarta_Sans]">{article.author}</p>
                  <p className="text-[10px] text-gray-400">{article.authorRole}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">CEFR language acquisition researcher and BhashaSchool lead academic advisor with 15+ years of applied linguistics teaching.</p>
            </div>

            {/* Quick takeaways */}
            <div className="card-soft p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-4">Key Takeaways</p>
              <ul className="space-y-2.5">
                {['Plateau happens due to passive learning habits', 'Output-first practice breaks the B1 wall', 'Subordinate clauses & Dativ need daily drilling', '11 weeks avg to reach B2 in BhashaSchool'].map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-emerald-500 font-bold flex-shrink-0">→</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Read time */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
              <BookOpen className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-emerald-700 font-[Plus_Jakarta_Sans]">{article.readTime}</p>
              <p className="text-xs text-gray-500">Average reading time</p>
            </div>
          </aside>

        </div>
      </section>

      {/* RELATED ARTICLES */}
      <section style={{ minHeight: '35vh' }} className="cream-bg py-12 md:py-16">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans]">Related Articles</h2>
            <Link href="/blog" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {article.related.map((r: any) => (
              <Link key={r.slug} href={`/blog/${r.slug}`}>
                <div className="card-soft p-6 group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-4">{r.emoji}</div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${r.tagColor}`}>{r.tag}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{r.readTime}</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] group-hover:text-emerald-700 transition-colors leading-snug">{r.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
