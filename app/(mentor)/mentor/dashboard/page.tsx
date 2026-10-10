'use client';

import Link from 'next/link';
import { LogOut, Inbox, Bell, Check, X, Calendar, FileText, ClipboardList } from 'lucide-react';

export default function MentorDashboard() {
  return (
    <main className="min-h-vh w-[100vw] bg-[var(--neutral-warm)] flex flex-col items-center pb-[10vh]">
      
      {/* ── HEADER ── */}
      <header className="w-full h-[12vh] bg-[var(--white)] shadow-md flex items-center justify-between px-[4vw]">
        <div className="flex items-center gap-4">
          <Link href="/">
            <img src="/logos/logowithouttext.png" alt="Bhasha School Logo" className="w-[45px] h-[45px] object-contain cursor-pointer transition-transform hover:scale-105" />
          </Link>
          <div>
            <h1 className="h1-text m-0">Welcome, Mentor</h1>
            <p className="small-text text-[var(--text-black-soft)] m-0">Guide. Support. Instruct.</p>
          </div>
        </div>
        <Link href="/" className="btn-outline flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </Link>
      </header>

      {/* ── SCHEDULE & ASSIGNMENTS ── */}
      <section className="w-[90vw] mt-[4vh] flex flex-col md:flex-row gap-[3vw]">
        
        {/* Left Col - Mentorship Sessions */}
        <div className="w-full md:w-[60vw] space-y-[2.5vh]">
          <h2 className="h2-text text-[var(--starbucks-green)] mb-[1vh] flex items-center gap-2">
            <Inbox className="w-5 h-5" /> Mentorship Overview
          </h2>
          
          <div className="content-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="h2-text mb-0 flex items-center gap-2"><Bell className="w-5 h-5 text-[var(--error-red)]" /> Incoming Practice Requests</h3>
              <span className="bg-[var(--error-red)] text-white px-3 py-1 rounded-[50px] small-text font-bold">3 Pending</span>
            </div>
            
            <div className="space-y-3">
              {['Sarah (A1)', 'Ahmed (B1)', 'Maria (A2)'].map((learner, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-[var(--ceramic)] rounded-[12px] bg-[var(--neutral-cool)] hover:shadow-sm transition-shadow">
                  <div>
                    <h4 className="body-text font-bold mb-0.5">{learner}</h4>
                    <p className="small-text text-[var(--text-black-soft)]">Requesting 30 min speaking practice</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-primary !px-3 !py-1.5 !text-[1.2rem] flex flex-row items-center gap-1"><Check className="w-3 h-3" /> Accept</button>
                    <button className="btn-outline !border-gray-300 !text-gray-500 !px-3 !py-1.5 !text-[1.2rem] flex flex-row items-center gap-1"><X className="w-3 h-3" /> Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - My Schedule */}
        <div className="w-full md:w-[30vw] space-y-[2.5vh]">
          <div className="feature-band !w-full !m-0 !py-[2.5vh] !px-[2vw] rounded-[12px]">
            <h2 className="h2-text text-[var(--white)] mb-1 flex items-center gap-2"><Calendar className="w-5 h-5 text-[var(--gold)]" /> My Schedule</h2>
            <p className="small-text text-[var(--text-white-soft)] mb-3">Your synced upcoming sessions for the week.</p>
            <div className="space-y-2">
              <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-[8px] body-text">
                <strong className="block text-[var(--gold)] mb-0.5">Today, 15:00</strong>
                <span className="text-white flex items-center gap-2"><FileText className="w-4 h-4 opacity-50" /> Speaking Practice with Tom (B2)</span>
              </div>
              <div className="bg-[rgba(255,255,255,0.1)] p-2 rounded-[8px] body-text">
                <strong className="block text-[var(--gold)] mb-0.5">Tomorrow, 10:00</strong>
                <span className="text-white flex items-center gap-2"><FileText className="w-4 h-4 opacity-50" /> Exam Prep with Anna (B1)</span>
              </div>
            </div>
          </div>
          
          <div className="content-card">
            <h3 className="h2-text mb-1 flex items-center gap-2"><ClipboardList className="w-5 h-5" /> Submit Feedback</h3>
            <p className="small-text text-[var(--text-black-soft)] mb-3">Assess learner progress based on 'Practice. Progress. Achieve'.</p>
            <button className="btn-outline w-full flex items-center justify-center gap-2"><ClipboardList className="w-4 h-4" /> Open Assessment Form</button>
          </div>
        </div>

      </section>
      
    </main>
  );
}
