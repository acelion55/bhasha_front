'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogOut, Map, BookOpen, Play, FileText, Target, Users, Calendar, UserPlus } from 'lucide-react';

export default function LearnerDashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <main className="min-h-vh w-[100vw] bg-[var(--neutral-warm)] flex items-center justify-center">
        <p className="body-text text-[var(--starbucks-green)] font-bold">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-vh w-[100vw] bg-[var(--neutral-warm)] flex flex-col items-center pb-[10vh]">
      
      {/* ── HEADER ── */}
      <header className="w-full h-[12vh] bg-[var(--white)] shadow-md flex items-center justify-between px-[4vw]">
        <div className="flex items-center gap-4">
          <Link href="/">
            <img src="/logos/logowithouttext.png" alt="Bhasha School Logo" className="w-[45px] h-[45px] object-contain cursor-pointer transition-transform hover:scale-105" />
          </Link>
          <div>
            <h1 className="h1-text m-0">Welcome, Learner</h1>
            <p className="small-text text-[var(--text-black-soft)] m-0">Current Level: A2</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="btn-outline flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </header>

      {/* ── CLASSROOM GRID ── */}
      <section className="w-[90vw] mt-[4vh] flex flex-col md:flex-row gap-[3vw]">
        
        {/* Left Col - Progress */}
        <div className="w-full md:w-[60vw] space-y-[2.5vh]">
          <h2 className="h2-text text-[var(--starbucks-green)] mb-[1vh] flex items-center gap-2">
            <Map className="w-5 h-5" /> Your Learning Path
          </h2>
          
          <div className="content-card">
            <h3 className="h2-text mb-1 flex items-center gap-2"><BookOpen className="w-5 h-5 text-[var(--starbucks-green)]" /> A2 Classroom</h3>
            <p className="body-text mb-3">You are currently taking A2 elementary classes. Your next class is in 2 days.</p>
            <button className="btn-primary w-max flex items-center gap-2"><Play className="w-4 h-4" /> Enter Classroom</button>
          </div>

          <div className="content-card border-l-[4px] border-[var(--gold)]">
             <h3 className="h2-text text-[var(--gold)] mb-1 flex items-center gap-2"><FileText className="w-5 h-5" /> Exam Preparation</h3>
            <p className="small-text text-[var(--text-black-soft)] mb-3">Start your Goethe or telc exam simulation. Tailored for A2 learners.</p>
            <button className="btn-outline w-max border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold-lightest)] flex items-center gap-2">
              <Target className="w-4 h-4" /> Start Mock Exam
            </button>
          </div>
        </div>

        {/* Right Col - Practice */}
        <div className="w-full md:w-[30vw] space-y-[2.5vh]">
          <h2 className="h2-text text-[var(--starbucks-green)] mb-[1vh] flex items-center gap-2">
            <Users className="w-5 h-5" /> Practice & Mentor
          </h2>
          
          <div className="content-card bg-[var(--house-green)] text-[var(--white)] py-[3vh]">
            <h3 className="h2-text text-[var(--white)] mb-1 flex items-center gap-2"><UserPlus className="w-5 h-5 text-[var(--gold)]" /> Book Speaking Practice</h3>
            <p className="small-text text-[var(--text-white-soft)] mb-3">Practice your A2 curriculum with a B1 senior learner or dedicated Mentor.</p>
            <button className="btn-primary w-full bg-[var(--white)] text-[var(--green-accent)] border-[var(--white)] flex justify-center items-center gap-2">
              <Users className="w-4 h-4" /> Find a Practice Partner
            </button>
          </div>

          <div className="content-card">
            <h3 className="h2-text mb-1 flex items-center gap-2"><Calendar className="w-5 h-5" /> Upcoming Sessions</h3>
            <ul className="small-text text-[var(--text-black-soft)] space-y-2 mt-2">
              <li className="flex justify-between border-b border-[var(--ceramic)] pb-1"><span>Tomorrow at 14:00</span> <span>Mentor John</span></li>
              <li className="flex justify-between border-b border-[var(--ceramic)] pb-1"><span>Friday at 09:00</span> <span>A2 Learner Emma</span></li>
            </ul>
          </div>
        </div>

      </section>
      
    </main>
  );
}
