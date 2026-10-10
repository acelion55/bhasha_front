import Link from 'next/link';
import { Calendar, Clock, Users, ArrowRight, User, Play, Video } from 'lucide-react';

export const metadata = {
  title: 'Public Classes & Masterclasses — BhashaSchool',
  description: 'Join our free and public masterclasses to experience our teaching methodology.',
};

const publicClasses = [
  {
    title: 'A1 German: Master Basic Greetings',
    date: 'Saturday, Oct 15',
    time: '18:00 CET',
    level: 'A1 Beginner',
    duration: '45 mins',
    spots: 12,
    instructor: 'Laura Müller',
    theme: 'bg-emerald-50/50 border-[var(--green-light)]',
    tag: 'text-[var(--starbucks-green)] bg-[var(--green-light)]',
  },
  {
    title: 'B1 English: Professional Email Writing',
    date: 'Sunday, Oct 16',
    time: '14:00 GMT',
    level: 'B1 Intermediate',
    duration: '60 mins',
    spots: 8,
    instructor: 'James Carter',
    theme: 'bg-amber-50/50 border-amber-200',
    tag: 'text-amber-800 bg-amber-100',
  },
  {
    title: 'A2 German: Essential Grammar Structures',
    date: 'Wednesday, Oct 19',
    time: '19:00 CET',
    level: 'A2 Elementary',
    duration: '60 mins',
    spots: 3,
    instructor: 'Laura Müller',
    theme: 'bg-emerald-50/50 border-[var(--green-light)]',
    tag: 'text-[var(--starbucks-green)] bg-[var(--green-light)]',
    fillingFast: true,
  }
];

export default function PublicClassesPage() {
  return (
    <div className="min-h-screen bg-[var(--neutral-warm)] pb-[10vh]">

      {/* Hero */}
      <section className="py-[10vh] text-center bg-gradient-to-b from-white to-[var(--neutral-warm)]">
        <div className="max-w-[1000px] mx-auto px-[5vw] md:px-[2vw]">
          <div className="inline-flex items-center gap-2 px-[1.5vw] py-[0.5vh] rounded-[50px] bg-[var(--gold-lightest)] border border-[var(--ceramic)] text-[var(--gold)] text-[1.4rem] font-bold mb-[3vh] shadow-sm tracking-wide">
            <Video className="w-5 h-5" />
            Live Masterclasses
          </div>
          <h1 className="display-text text-[var(--text-black)] mb-[2vh]">
            Upcoming <span className="text-[var(--starbucks-green)]">Public Classes</span>
          </h1>
          <p className="body-text text-[1.8rem] text-[var(--text-black-soft)] max-w-2xl mx-auto leading-relaxed">
            Experience the BhashaSchool methodology firsthand. Join our open sessions hosted by expert mentors and see why thousands choose our immersive ecosystem.
          </p>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="max-w-[1200px] mx-auto px-[5vw] md:px-[2vw] py-[4vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[4vw] md:gap-[2vw]">
        {publicClasses.map((cls, idx) => (
          <div key={idx} className={`content-card border ${cls.theme} shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1`}>
            <div className="flex justify-between items-start mb-[2vh]">
              <span className={`text-[1.2rem] font-bold px-[1vw] py-[0.3vh] rounded-[4px] uppercase tracking-wider ${cls.tag}`}>
                {cls.level}
              </span>
              {cls.fillingFast && (
                <span className="text-[1.1rem] font-bold text-[var(--gold)] bg-[var(--gold-lightest)] px-[1vw] py-[0.3vh] rounded-[4px] animate-pulse">
                  Filling Fast
                </span>
              )}
            </div>
            
            <h2 className="h2-text text-[var(--text-black)] mb-[2vh] leading-snug">{cls.title}</h2>
            
            <div className="space-y-[1.5vh] mb-[4vh] p-[2vw] md:p-[1vw] bg-white rounded-[12px] border border-[var(--ceramic)]">
              <div className="flex items-center gap-[1vw] body-text text-[var(--text-black-soft)] font-medium">
                <Calendar className="w-5 h-5 text-[var(--starbucks-green)]" />
                {cls.date}
              </div>
              <div className="flex items-center gap-[1vw] body-text text-[var(--text-black-soft)] font-medium">
                <Clock className="w-5 h-5 text-[var(--starbucks-green)]" />
                {cls.time} ({cls.duration})
              </div>
              <div className="flex items-center gap-[1vw] body-text text-[var(--text-black-soft)] font-medium">
                <User className="w-5 h-5 text-[var(--starbucks-green)]" />
                Host: {cls.instructor}
              </div>
              <div className="flex items-center gap-[1vw] body-text text-[var(--text-black-soft)] font-medium">
                <Users className="w-5 h-5 text-[var(--starbucks-green)]" />
                {cls.spots} Spots Remaining
              </div>
            </div>

            <Link href="/register" className="btn-primary w-full flex justify-center items-center gap-[1vw] py-[2vh] text-[1.6rem] !rounded-[12px]">
              <Play className="w-5 h-5" /> Reserve Spot
            </Link>
          </div>
        ))}
      </section>

      {/* Admin Notice (For the User) */}
      <section className="max-w-[800px] mx-auto px-[5vw] py-[8vh] mt-[5vh] text-center border-t border-[var(--ceramic)]">
        <h3 className="h2-text text-[var(--text-black)] mb-[2vh]">Are you an Admin?</h3>
        <p className="body-text text-[var(--text-black-soft)] mb-[3vh]">
          Once authenticated in the backend pane, you will be able to dynamically publish and manage these public taster sessions mapped directly to your internal Live Classes engine.
        </p>
        <Link href="/login" className="btn-outline w-max mx-auto text-[1.4rem]">Login to Admin Panel →</Link>
      </section>

    </div>
  );
}
