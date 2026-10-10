'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, Phone, MapPin, Clock, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';

const campuses = [
  { name: '🇩🇪 Berlin Schöneberg Campus', type: 'German + English', addr: 'Schöneberg, Berlin 10785', hours: 'Mon–Fri 08:00–20:00 CET', tag: 'Flagship', tagColor: 'bg-emerald-100 text-emerald-700' },
  { name: '🇩🇪 Laufen Hub (Chiemsee)', type: 'Intensive German', addr: 'Laufen, Bavaria 83410', hours: 'Mon–Sat 07:30–19:00 CET', tag: 'Immersive', tagColor: 'bg-blue-100 text-blue-700' },
  { name: '🇦🇹 Kufstein Advisory Studio', type: 'Business German', addr: 'Kufstein, Tirol 6330', hours: 'Tue–Sat 09:00–18:00 CET', tag: 'Advisory', tagColor: 'bg-emerald-100 text-emerald-700' },
];

const faqs = [
  { q: "How do I take the free spoken assessment?", a: "Click 'Schedule Free Assessment' — pick a 25-minute slot. You'll speak with a live tutor who completes a CEFR diagnostic on a video platform. Results arrive within 2 hours." },
  { q: "Can my company sponsor my German and English study dually?", a: "Yes. Over 63 of our corporate business partners are already sending bilingual team members. We provide formal invoicing with all FRAP and GDPR-compliant records." },
  { q: "How fast will cohort sessions actually get me speaking fluently?", a: "Students in our Accelerated track (3 classes/week) reach the next CEFR sub-level in an average of 11 weeks, verified through milestone tests at weeks 4, 8 and 12." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', track: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-[#fdf8f3] overflow-x-hidden">

      {/* HERO */}
      <section style={{ minHeight: '38vh' }} className="hero-gradient flex items-center py-14 md:py-20">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3">Get in Touch</p>
              <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] leading-tight mb-4">
                Get in Touch with the<br />BhashaSchool Academic Team
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                Our admissions and academic advisors in Berlin, London and Zürich are ready to assist your language learning journey.
              </p>
            </div>
            <div className="hidden md:flex flex-col gap-3">
              {[
                { icon: '📞', label: 'Call / WhatsApp Helpline', val: '+91 91053 26128' },
                { icon: '💬', label: 'Student Admissions', val: '+91 91053 26128' },
                { icon: '📬', label: 'Email Support', val: 'hello@bhashaschool.com' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 bg-white/70 backdrop-blur rounded-xl border border-emerald-100 px-4 py-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-gray-400">{item.label}</p>
                    <p className="text-xs font-semibold text-gray-800">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM + LIVE SUPPORT */}
      <section style={{ minHeight: '65vh' }} className="bg-white py-14 md:py-20">
        <div style={{ maxWidth: '90vw' }} className="mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form — 3 cols */}
          <div className="lg:col-span-3">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-3">Leave a Message</p>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.2vw, 2rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans] mb-6">Send us a Message</h2>
            {sent ? (
              <div className="card-soft p-10 text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="font-extrabold text-gray-900 text-lg font-[Plus_Jakarta_Sans] mb-2">Message Sent!</h3>
                <p className="text-sm text-gray-500">An academic advisor will contact you within 2 business hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 btn-outline px-5 py-2.5 rounded-xl text-sm font-bold">Send Another Message</button>
              </div>
            ) : (
              <form className="space-y-4 card-soft p-7" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Full Name *</label>
                    <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Email Address *</label>
                    <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">WhatsApp Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+49 (or your country code)"
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Target Language</label>
                    <select value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition">
                      <option value="">Select track…</option>
                      <option>German (A1–C1)</option>
                      <option>English (Business)</option>
                      <option>Both German & English</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Subject / Topic</label>
                  <select value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition">
                    <option value="">Select a topic…</option>
                    <option>General Enquiry</option>
                    <option>Course & Pricing Questions</option>
                    <option>Corporate / B2B Inquiry</option>
                    <option>Visa & Immigration German</option>
                    <option>Tutor Partnership</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1.5 tracking-wider">Message *</label>
                  <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your goals and current language level…"
                    className="w-full px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 transition resize-none" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 rounded-xl btn-primary text-sm font-bold">
                  Send Message to Academic Advisor <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Right sidebar — 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            {/* Live Support */}
            <div className="bg-emerald-700 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-200">Live Support Online · Now</span>
              </div>
              <p className="font-extrabold text-lg font-[Plus_Jakarta_Sans] mb-1">Academic Advisor Available</p>
              <p className="text-emerald-100 text-xs mb-5">Avg. response time: under 3 minutes during working hours.</p>
              <div className="space-y-2.5 mb-5">
                {[
                  { icon: '💬', label: 'WhatsApp', val: '+91 91053 26128' },
                  { icon: '📧', label: 'Email', val: 'hello@bhashaschool.com' },
                  { icon: '📞', label: 'Phone', val: '+91 91053 26128' },
                ].map((c) => (
                  <div key={c.label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                    <span className="text-lg">{c.icon}</span>
                    <div>
                      <p className="text-[10px] font-bold text-emerald-200 uppercase">{c.label}</p>
                      <p className="text-xs text-white font-semibold">{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-emerald-700 text-sm font-bold hover:bg-emerald-50 transition">
                <MessageSquare className="w-4 h-4" /> Start Live Chat
              </button>
            </div>

            {/* Campus locations */}
            <div className="card-soft p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-4">Campus & Study Surveys</p>
              <div className="space-y-4">
                {campuses.map((c) => (
                  <div key={c.name} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-xs font-extrabold text-gray-900 font-[Plus_Jakarta_Sans]">{c.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${c.tagColor}`}>{c.tag}</span>
                    </div>
                    <p className="text-[10px] text-emerald-600 font-semibold mb-1">{c.type}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
                      <MapPin className="w-3 h-3 text-gray-300" />{c.addr}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3 text-gray-300" />{c.hours}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section style={{ minHeight: '45vh' }} className="cream-bg py-14 md:py-20">
        <div style={{ maxWidth: '72vw' }} className="mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-2">Common Questions</p>
            <h2 style={{ fontSize: 'clamp(1.3rem, 2.4vw, 2rem)' }} className="font-extrabold text-gray-900 font-[Plus_Jakarta_Sans]">
              Frequently Explored <span className="gradient-text">Inquiries</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="card-soft overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-emerald-50/50 transition-colors">
                  <span className="font-semibold text-gray-900 text-sm">{f.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-6 pb-5 text-xs text-gray-600 leading-relaxed border-t border-emerald-100 pt-4">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="bg-white py-10">
        <div style={{ maxWidth: '88vw' }} className="mx-auto px-4">
          <p className="text-center text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">Governed by Rigorous Institutional Standards</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {[['📜', 'CEFR Validated'], ['✓', 'ISO Certified'], ['🏅', 'TELC Partner'], ['🇩🇪', 'Goethe Institut'], ['💼', 'Corporate Clients'], ['🎓', 'DELTA Certified']].map(([icon, label]) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-xl mx-auto mb-1.5">{icon}</div>
                <p className="text-[10px] font-bold text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
