'use client';

import Link from 'next/link';
import { LogOut, Users, BookOpen, Shield, UserPlus, Edit3, ArrowUpCircle } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <main className="min-h-vh w-[100vw] bg-[var(--neutral-warm)] flex flex-col items-center pb-[10vh]">
      
      {/* ── HEADER ── */}
      <header className="w-full h-[12vh] bg-[var(--house-green)] shadow-md flex items-center justify-between px-[4vw]">
        <div className="flex items-center gap-4">
          <Link href="/">
            <img src="/logos/logowithouttext.png" alt="Bhasha School Logo" className="w-[45px] h-[45px] object-contain cursor-pointer transition-transform hover:scale-105" />
          </Link>
          <div>
            <h1 className="h1-text m-0 text-white">Admin Command Center</h1>
            <p className="small-text text-[var(--gold-light)] m-0">Global Overview</p>
          </div>
        </div>
        <Link href="/" className="btn-outline !text-[var(--white)] !border-[var(--white)] flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </Link>
      </header>

      {/* ── DATA DASHBOARD ── */}
      <section className="w-[90vw] mt-[4vh] flex flex-col">
        
        {/* KPI Row */}
        <div className="flex flex-wrap md:flex-nowrap gap-[2vw] mb-[4vh]">
          <div className="content-card flex-1 w-full text-center flex flex-col items-center">
            <Users className="w-6 h-6 text-[var(--starbucks-green)] mb-2" />
            <h3 className="h1-text text-[var(--starbucks-green)] mb-1">1,240</h3>
            <p className="small-text text-[var(--text-black-soft)] font-bold tracking-widest">Active Learners</p>
          </div>
          <div className="content-card flex-1 w-full text-center flex flex-col items-center">
            <Users className="w-6 h-6 text-[var(--green-accent)] mb-2" />
            <h3 className="h1-text text-[var(--green-accent)] mb-1">86</h3>
            <p className="small-text text-[var(--text-black-soft)] font-bold tracking-widest">Active Mentors</p>
          </div>
          <div className="content-card flex-1 w-full text-center flex flex-col items-center">
            <BookOpen className="w-6 h-6 text-[var(--gold)] mb-2" />
            <h3 className="h1-text text-[var(--gold)] mb-1">412</h3>
            <p className="small-text text-[var(--text-black-soft)] font-bold tracking-widest">Exams Prep Slots</p>
          </div>
        </div>

        {/* User Management List */}
        <div className="content-card w-full max-h-[50vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="h2-text text-[var(--starbucks-green)] flex items-center gap-2"><Shield className="w-5 h-5" /> User & Cohort Management</h2>
            <button className="btn-primary !py-1.5 !px-3 !text-[1.2rem] flex items-center gap-2"><UserPlus className="w-3 h-3" /> Add New User</button>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[var(--ceramic)] small-text text-[var(--text-black-soft)] font-bold">
                <th className="py-2">Name</th>
                <th className="py-2">Role</th>
                <th className="py-2">Level</th>
                <th className="py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="body-text">
              {[
                { name: 'John Doe', role: 'Learner', level: 'A1' },
                { name: 'Emma Wilson', role: 'Learner', level: 'A2' },
                { name: 'Dr. Smith', role: 'Mentor', level: 'N/A' },
                { name: 'Lisa V.', role: 'Learner', level: 'B2' },
              ].map((user, idx) => (
                <tr key={idx} className="border-b border-[var(--ceramic)] hover:bg-[var(--neutral-cool)] transition-colors">
                  <td className="py-3 font-bold">{user.name}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-[50px] small-text ${user.role === 'Mentor' ? 'bg-[var(--emerald-100)] text-[var(--emerald-700)]' : 'bg-[var(--green-light)] text-[var(--starbucks-green)]'}`}>{user.role}</span>
                  </td>
                  <td className="py-3 text-[var(--text-black-soft)]">{user.level}</td>
                  <td className="py-3 text-right">
                    <button className="btn-outline !py-1 !px-2 !text-[var(--green-accent)] !border-none mr-2 hover:bg-[var(--emerald-50)]"><Edit3 className="w-4 h-4 inline" /></button>
                    {user.role === 'Learner' && <button className="btn-outline !py-1 !px-2 !text-[var(--gold)] !border-none hover:bg-[var(--gold-lightest)]"><ArrowUpCircle className="w-4 h-4 inline" /></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>
      
    </main>
  );
}
