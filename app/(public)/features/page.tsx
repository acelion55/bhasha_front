import Link from 'next/link';
import { ArrowRight, CheckCircle, Zap, Globe2, BookOpen, Mic, Trophy } from 'lucide-react';

const courses = [
  {
    flag: 'DE',
    lang: 'German',
    levels: ['A1 Beginner', 'A2 Elementary', 'B1 Intermediate', 'B2 Upper-Intermediate', 'C1 Advanced', 'C2 Mastery'],
    color: 'border-emerald-200 bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-700',
    badge: 'Most Enrolled',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    desc: 'From everyday conversation to professional business German — our CEFR-aligned German courses take you from zero to fluent.',
    features: ['Native German tutors', 'Grammar deep-dives', 'Culture & idioms', 'Exam prep (TestDaF, Goethe)', 'Weekly speaking sessions'],
  },
  {
    flag: 'GB',
    lang: 'English',
    levels: ['A1 Starter', 'A2 Basic', 'B1 Pre-Intermediate', 'B2 Intermediate', 'C1 Expert', 'C2 Proficiency'],
    color: 'border-amber-200 bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-700',
    badge: 'Business Focus',
    badgeColor: 'bg-amber-100 text-amber-700',
    desc: 'From everyday conversation to business English — sharpen your writing, speaking, and listening skills with expert British & American tutors.',
    features: ['British & American tutors', 'Business writing', 'IELTS / TOEFL prep', 'Accent reduction', 'Interview coaching'],
  },
];

const specializations = [
  { icon: Mic, title: 'Conversational Fluency', desc: 'Daily speaking challenges and live conversation practice.' },
  { icon: Trophy, title: 'Exam Preparation', desc: 'Dedicated prep for TestDaF, Goethe, IELTS, TOEFL, and more.' },
  { icon: Globe2, title: 'Business Language', desc: 'Industry-specific vocabulary for finance, tech, medicine, and law.' },
  { icon: Zap, title: 'Crash Courses', desc: 'Intensive 4-week programmes for fast learners with a deadline.' },
];

export const metadata = {
  title: 'Courses — BhashaSchool | German & English Language Courses',
  description: 'Explore CEFR-aligned German and English courses, from A1 beginner to C2 mastery. Live tutors, AI practice, exam prep.',
};

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-[var(--neutral-warm)] pb-[10vh]">

      {/* Hero */}
      <section className="pt-[6vh] pb-[3vh] md:py-[8vh] text-center bg-gradient-to-b from-[var(--white)] to-[var(--neutral-warm)]">
        <div className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw]">
          <div className="inline-flex items-center gap-2 px-[1.5vw] py-[0.5vh] rounded-[50px] bg-[var(--green-light)] border border-[var(--ceramic)] text-[var(--starbucks-green)] text-[1.4rem] font-bold mb-[3vh] shadow-sm">
            <BookOpen className="w-5 h-5" />
            CEFR-Aligned Language Courses
          </div>
          <h1 className="display-text text-[var(--text-black)] mb-[2vh]">
            Our <span className="text-[var(--starbucks-green)]">Courses</span>
          </h1>
          <p className="body-text text-[1.8rem] text-[var(--text-black-soft)] max-w-3xl mx-auto leading-relaxed">
            Structured, expert-designed curricula for every level. Whether you're a complete beginner or aiming for mastery — we have the right path for you.
          </p>
        </div>
      </section>

      {/* Course Cards */}
      <section className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw] pb-[6vh] grid grid-cols-1 md:grid-cols-2 gap-[4vw]">
        {courses.map((c) => (
          <div key={c.lang} className={`content-card border border-[var(--ceramic)] shadow-md ${c.lang === 'German' ? 'bg-emerald-50/30' : 'bg-amber-50/30'}`}>
            <div className="flex items-start justify-between mb-[3vh]">
              <div className={`w-[60px] h-[60px] rounded-[16px] flex items-center justify-center h2-text font-bold shadow-sm ${c.lang === 'German' ? 'bg-[var(--green-light)] text-[var(--starbucks-green)] border-2 border-[var(--green-accent)]' : 'bg-amber-100 text-amber-700 border-2 border-amber-300'}`}>
                {c.flag}
              </div>
              <span className={`text-[1.4rem] font-bold px-[1.5vw] py-[0.5vh] rounded-[4px] shadow-sm ${c.lang === 'German' ? 'bg-[var(--green-light)] text-[var(--starbucks-green)]' : 'bg-amber-100 text-amber-800'}`}>{c.badge}</span>
            </div>
            
            <h2 className="display-text text-[4rem] text-[var(--text-black)] mb-[1vh]">{c.lang}</h2>
            <p className="body-text text-[var(--text-black-soft)] leading-relaxed mb-[4vh]">{c.desc}</p>

            {/* Levels */}
            <div className="flex flex-wrap gap-[1vw] mb-[4vh]">
              {c.levels.map((lv) => (
                <span key={lv} className="text-[1.3rem] font-bold px-[1.5vw] py-[0.5vh] rounded-[8px] bg-[var(--white)] border border-[var(--ceramic)] text-[var(--text-black-soft)] shadow-sm">{lv}</span>
              ))}
            </div>

            {/* Features */}
            <ul className="space-y-[1.5vh] mb-[4vh]">
              {c.features.map((f) => (
                <li key={f} className="flex items-center gap-[1vw] body-text text-[var(--text-black-soft)] font-medium">
                  <CheckCircle className="w-5 h-5 text-[var(--starbucks-green)] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/register" className={`btn-primary w-full flex justify-center items-center gap-[1vw] py-[2vh] text-[1.8rem] !rounded-[12px] shadow-lg ${c.lang === 'German' ? '!bg-[var(--starbucks-green)] !border-[var(--starbucks-green)]' : '!bg-amber-600 !border-amber-600 !text-white'}`}>
              Start {c.lang} Course <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ))}
      </section>

      {/* Specializations */}
      <section className="bg-[var(--white)] py-[8vh] mt-[5vh] border-y border-[var(--ceramic)]">
        <div className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw]">
          <div className="text-center mb-[6vh]">
            <h2 className="display-text text-[var(--text-black)]">
              Specialised <span className="text-[var(--gold)]">Programmes</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[2vw]">
            {specializations.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="content-card flex flex-col justify-between items-center text-center shadow-sm border border-[var(--ceramic)] hover:shadow-lg transition-transform hover:-translate-y-2 cursor-default">
                  <div className="w-[80px] h-[80px] rounded-full bg-[var(--green-light)] text-[var(--starbucks-green)] flex items-center justify-center mb-[2vh]">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="h1-text mb-[1vh] text-[var(--text-black)]">{s.title}</h3>
                  <p className="body-text text-[var(--text-black-soft)]">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-[10vh] text-center bg-[var(--neutral-warm)]">
        <div className="max-w-xl mx-auto px-[5vw] md:px-[2vw]">
          <h2 className="display-text text-[var(--text-black)] mb-[2vh] text-[4rem]">
            Not Sure Where to <span className="text-[var(--starbucks-green)]">Start?</span>
          </h2>
          <p className="body-text text-[var(--text-black-soft)] mb-[5vh] text-[1.8rem]">Take our free 5-minute placement test and we'll recommend the perfect course for your level.</p>
          <Link href="/register" className="btn-primary flex justify-center items-center gap-[1vw] py-[2vh] px-[4vw] text-[1.8rem] !bg-[var(--gold)] !border-[var(--gold)] !text-[var(--house-green)] mx-auto w-max shadow-xl">
            Take Free Placement Test <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
