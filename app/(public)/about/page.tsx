'use client';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Quote } from 'lucide-react';

const stats = [
  { value: '14,000+', label: 'Active Learners', sub: 'across Europe & South Asia' },
  { value: '72%', label: 'Student Talk Time', sub: 'per 55-min session' },
  { value: '98.4%', label: 'Course Completion', sub: 'average across all tracks' },
  { value: '4.9/5', label: 'Tutor Rating', sub: 'from 12,000+ verified reviews' },
];

const pillars = [
  { n: '01', icon: '👥', title: 'Micro-Cohorts (Max 5 Learners)', desc: 'UCL & Columbia research proved cohort sizes beyond 5 drop effective speaking time by 50%. Minimum 38 minutes of active oral production per session guaranteed.', badge: 'Exceeding 72% Active Practice' },
  { n: '02', icon: '🎓', title: 'Native Certified Linguists', desc: 'Every tutor holds a DELTA/CELTA certificate or native-speaker C2 credential with 800+ documented teaching hours across the CEFR framework.', badge: 'C2 + DELTA Minimum Standard' },
  { n: '03', icon: '🤫', title: 'Silent & Co-Pilot Feedback™', desc: "Our proprietary Silent Feedback Protocol™ means instructors never interrupt your flow. Corrections queue in a side dashboard reviewed after each speaking sprint.", badge: 'Zero Mid-Sentence Interruptions' },
];

const principles = [
  { n: '01', icon: '🗣️', title: 'Radical Speaking Time', desc: 'Total class minutes are engineered so students produce minimum 3 minutes of actual speech output per session. Every activity is tracked.' },
  { n: '02', icon: '🌍', title: 'Cultural Pragmatics', desc: 'The curriculum teaches conversation strategies, discourse structures, humour, formality, and cultural references across both German and English.' },
  { n: '03', icon: '🧘', title: 'Psychological Safety', desc: 'Anonymous correction queues and vulnerability-building exercises protect the emotional environment of every live lesson within our cohorts.' },
  { n: '04', icon: '📐', title: 'Conscious Rigor', desc: 'Fluency without accuracy plateaus at intermediate level. We balance free production tasks with targeted form-focus using spaced-repetition methods.' },
];

const hubs = [
  { city: '🇩🇪 Berlin, Germany', address: 'Schöneberg, Berlin 10785', desc: 'Flagship classroom. German A1–C1 courses, corporate training and TELC exam preparation.', tag: 'Flagship', border: 'border-emerald-400' },
  { city: '🇩🇪 Munich, Germany', address: 'Leopoldstr. 31, Munich', desc: 'Corporate-focused campus serving BMW, Siemens, and Allianz employee language programmes.', tag: 'Corporate', border: 'border-blue-400' },
  { city: '🇨🇭 Zürich, Switzerland', address: 'Bahnhofstrasse 21, Zürich', desc: 'Swiss German & High German programme. Banking, Legal, Medical German specialist tracks.', tag: 'Swiss', border: 'border-emerald-400' },
  { city: '🇬🇧 London, UK', address: 'Aldgate, London EC3A 5DE', desc: 'English for post-immigration professionals, Skilled Worker Visa applicants, and leadership teams.', tag: 'UK Campus', border: 'border-amber-400' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#fdf8f3] overflow-x-hidden">

      {/* HERO */}
      <section style={{ minHeight: '65vh' }} className="hero-gradient flex items-center py-16 md:py-24">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4 w-full text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4">Our Story & Mission</p>
          <h1 style={{ fontSize: 'clamp(1.7rem, 3.8vw, 3.4rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] leading-tight max-w-4xl mx-auto mb-5">
            Democratizing Fluent Speech through<br className="hidden md:block" /> Live Human Connection &amp; Intelligent Feedback
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            We founded BhashaSchool because 80% of language learners never reach real-world conversational fluency. We rebuilt the classroom — not as an app, but as a living community of max 5 students guided by expert linguists.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ minHeight: '18vh' }} className="bg-white flex items-center py-10">
        <div style={{ maxWidth: '88vw' }} className="mx-auto w-full px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <p style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.6rem)' }} className="font-extrabold text-emerald-600 font-[Plus_Jakarta_Sans]">{s.value}</p>
              <p className="text-xs font-bold text-gray-900 mt-1">{s.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section style={{ minHeight: '55vh' }} className="cream-bg py-16 md:py-24">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3">Our Founding Story</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] mb-6">Escaping the B1–B2 Intermediate Plateau</h2>
            <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
              <p>A CEFR and linguistics researcher at Imperial College London uncovered a brutal truth: 54% of adult German and English learners who enrol in traditional courses get stuck at B1–B2 for months, sometimes years.</p>
              <p>Learners weren't failing because they lacked motivation. The system was broken — seventy-student classrooms, no real speaking time, zero contextual immersion. We rebuilt the classroom with maximum 5 students per session, three times a week, guided by linguists who never interrupt a mid-thought sentence.</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="card-soft p-7">
              <Quote className="w-7 h-7 text-emerald-300 mb-4" />
              <p className="text-sm font-semibold text-gray-800 leading-relaxed italic mb-5">
                "Fluency isn't measured in vocabulary quantity — it's the time it takes you to respond spontaneously and naturally in direct conversation."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0">👩‍🏫</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Dr. Roberta Garcia</p>
                  <p className="text-xs text-gray-500">Applied Linguistics · Imperial College London</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-600 rounded-2xl p-6 text-white">
              <p style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2rem)' }} className="font-extrabold mb-2">9 out of 10</p>
              <p className="text-emerald-100 text-xs leading-relaxed">BhashaSchool students report measurable speaking improvement after just 30 days, tracked via video response analysis and CEFR milestone tests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section style={{ minHeight: '50vh' }} className="bg-white py-16 md:py-24">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Our Pedagogical DNA</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans]">
              Engineered for <span className="gradient-text">Reflexive Oral Fluency</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="card-soft p-7 hover:-translate-y-1 transition-all duration-300">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">PILLAR {p.n}</p>
                <p className="text-2xl mb-3">{p.icon}</p>
                <h3 className="text-sm font-extrabold text-gray-900 mb-3 font-[Plus_Jakarta_Sans]">{p.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{p.desc}</p>
                <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">{p.badge}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl px-6 py-3 text-center">
            <p className="text-xs text-emerald-700 font-semibold">Curriculum Benchmarked to the Council of Europe (CEFR)</p>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section style={{ minHeight: '55vh' }} className="cream-bg py-16 md:py-24">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Our Teaching Philosophy</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans]">
              The Principles That <span className="gradient-text">Anchor Us</span>
            </h2>
            <p className="text-sm text-gray-500 mt-3 max-w-xl mx-auto">Language learning is both science and human vulnerability. The culture we've built around language and connection underpins and protects both.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {principles.map((p) => (
              <div key={p.title} className="card-soft p-7">
                <div className="flex items-start gap-4">
                  <span style={{ fontSize: 'clamp(1.5rem, 2vw, 2rem)' }} className="font-extrabold text-emerald-100 font-[Plus_Jakarta_Sans] flex-shrink-0 leading-none">{p.n}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{p.icon}</span>
                      <h3 className="font-extrabold text-gray-900 text-sm font-[Plus_Jakarta_Sans]">{p.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HUBS */}
      <section style={{ minHeight: '50vh' }} className="bg-white py-16 md:py-24">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Our European Hubs</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.4rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans]">
              Four European Hubs. <span className="gradient-text">One Global Mission.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {hubs.map((h) => (
              <div key={h.city} className={`card-soft border-2 ${h.border} p-6 hover:-translate-y-1 transition-all duration-300`}>
                <span className="inline-block text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full mb-3">{h.tag}</span>
                <h3 className="font-extrabold text-gray-900 text-sm mb-1 font-[Plus_Jakarta_Sans]">{h.city}</h3>
                <p className="text-[11px] text-gray-400 mb-3">{h.address}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ minHeight: '45vh' }} className="bg-gray-950 flex items-center py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-800/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-700/15 rounded-full blur-3xl" />
        </div>
        <div style={{ maxWidth: '88vw' }} className="relative mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-3">Start Your Journey</p>
            <h2 style={{ fontSize: 'clamp(1.4rem, 2.4vw, 2.2rem)' }} className="font-extrabold text-white font-[Plus_Jakarta_Sans] mb-4">
              Ready to accelerate your fluency?<br />Start with an assessment.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">Take our free 25-minute Spoken Diagnostic — get placed precisely on the CEFR scale and receive personalised tutor, cohort and schedule recommendations.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl btn-primary text-sm font-bold">
              Schedule Free Assessment <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-gray-800/60 backdrop-blur border border-white/10 rounded-3xl p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4">Live Spoken Assessment</p>
            <div className="space-y-3 mb-6">
              {['Access your personalised learning dashboard', 'Get matched to a cohort starting within 48 hours', 'Receive your CEFR diagnostic report instantly'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-5 grid grid-cols-2 gap-4">
              <div className="text-center"><p className="text-2xl font-extrabold text-white">25 min</p><p className="text-xs text-gray-400">Assessment duration</p></div>
              <div className="text-center"><p className="text-2xl font-extrabold text-white">100%</p><p className="text-xs text-gray-400">Free, no commitment</p></div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
