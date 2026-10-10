'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import {
  Plus, Trash2, Upload, CheckCircle2, MessageSquare,
  Users, Loader2, Send, Database, LayoutTemplate, Zap
} from 'lucide-react';
import TemplatesTab from './TemplatesTab';
import ChatInbox from './ChatInbox';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItem { question: string; answer: string }

interface User { _id: string; name: string; email: string; tenantId: string }

interface FormValues {
  companyName: string;
  industry: string;
  supportEmail: string;
  phone: string;
  brandVoice: string;
  description: string;
  offerings: string;
  faqs: FAQItem[];
}

type TabId = 'inbox' | 'knowledge' | 'templates';

const TABS: { id: TabId; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'inbox', label: 'Live Chat Inbox', icon: <MessageSquare className="w-4 h-4" />, badge: 'Realtime' },
  { id: 'knowledge', label: 'Knowledge Base', icon: <Database className="w-4 h-4" />, badge: 'AI Config' },
  { id: 'templates', label: 'Templates', icon: <LayoutTemplate className="w-4 h-4" />, badge: 'Meta API' },
];

// ─── Knowledge Base & Dynamic Onboarding Tab ──────────────────────────────

interface QABlockItem {
  category: string;
  key: string;
  question: string;
  answer: string;
}

const CATEGORY_PRESETS = [
  { id: 'overview', name: 'Company Overview' },
  { id: 'services', name: 'Products & Services' },
  { id: 'pricing', name: 'Pricing & Eligibility' },
  { id: 'policies', name: 'Policies & Support' },
];

interface KnowledgeBaseTabProps {
  selectedUserId: string;
}

function KnowledgeBaseTab({ selectedUserId }: KnowledgeBaseTabProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('overview');

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      companyName: '',
      industry: 'Technology',
      supportEmail: '',
      phone: '',
      brandVoice: 'friendly',
      description: '',
      offerings: '',
      faqs: [{ question: '', answer: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'faqs' });

  // Pre-filled Recommended Questions by Category (Solves Empty State Problem)
  const RECOMMENDED_QUESTIONS: Record<string, { key: string; question: string; defaultAnswerPlaceholder: string }[]> = {
    overview: [
      { key: 'company_summary', question: 'What does your company do?', defaultAnswerPlaceholder: 'e.g. We provide hassle-free financial consultancy, personal and business loans.' },
      { key: 'established_year', question: 'When was the company established and where is it located?', defaultAnswerPlaceholder: 'e.g. Established in 2018 with offices in Mumbai and Delhi.' },
      { key: 'employee_count', question: 'How many employees work in your company?', defaultAnswerPlaceholder: 'e.g. 25-30 full time advisors across sales and tech.' },
    ],
    services: [
      { key: 'core_services', question: 'What core services or products do you offer?', defaultAnswerPlaceholder: 'e.g. Personal Loans, Business Growth Capital, Car Loans, Credit Repair.' },
      { key: 'service_turnaround', question: 'How long does service processing or loan disbursement take?', defaultAnswerPlaceholder: 'e.g. Disbursement takes 24 to 48 hours after document verification.' },
      { key: 'specialization', question: 'What makes your services unique compared to competitors?', defaultAnswerPlaceholder: 'e.g. 100% online process, minimal paperwork, transparent fees.' },
    ],
    pricing: [
      { key: 'interest_rates', question: 'What are your starting interest rates or service charges?', defaultAnswerPlaceholder: 'e.g. Personal loans start at 10.49% p.a., business loans at 12.99% p.a.' },
      { key: 'eligibility_documents', question: 'What are the required eligibility documents?', defaultAnswerPlaceholder: 'e.g. Last 6 months bank statement, 3 months salary slips/ITR, PAN & Aadhaar.' },
      { key: 'minimum_pricing', question: 'What is your consultation fee or initial charge?', defaultAnswerPlaceholder: 'e.g. Initial consultation is 100% free. 1% processing fee applies on disbursement.' },
    ],
    policies: [
      { key: 'contact_timings', question: 'What are your business working hours?', defaultAnswerPlaceholder: 'e.g. We are open Monday to Saturday from 9:30 AM to 6:30 PM.' },
      { key: 'customer_support', question: 'How can clients contact your support team?', defaultAnswerPlaceholder: 'e.g. Call or WhatsApp at +91 9876543210 or email support@finonest.in.' },
      { key: 'cancellation_refund', question: 'What is your refund or cancellation policy?', defaultAnswerPlaceholder: 'e.g. Full refund within 7 days if service initiation has not begun.' },
    ],
  };

  // Categorized Dynamic Onboarding QA Blocks state pre-seeded with defaults for all categories
  const [qaBlocks, setQaBlocks] = useState<QABlockItem[]>([
    { category: 'overview', key: 'company_summary', question: 'What does your company do?', answer: '' },
    { category: 'overview', key: 'established_year', question: 'When was the company established and where is it located?', answer: '' },
    { category: 'services', key: 'core_services', question: 'What core services or products do you offer?', answer: '' },
    { category: 'services', key: 'service_turnaround', question: 'How long does service processing or loan disbursement take?', answer: '' },
    { category: 'pricing', key: 'interest_rates', question: 'What are your starting interest rates or service charges?', answer: '' },
    { category: 'pricing', key: 'eligibility_documents', question: 'What are the required eligibility documents?', answer: '' },
    { category: 'policies', key: 'contact_timings', question: 'What are your business working hours?', answer: '' },
    { category: 'policies', key: 'customer_support', question: 'How can clients contact your support team?', answer: '' },
  ]);

  const effectiveTenantId = selectedUserId || user?.tenantId;

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get('/company/profile', { params: { tenantId: effectiveTenantId } });
        if (res.data?.companyName) {
          reset({
            companyName: res.data.companyName || '',
            industry: res.data.industry || 'Technology',
            supportEmail: res.data.supportEmail || '',
            phone: res.data.phone || '',
            brandVoice: res.data.brandVoice || 'friendly',
            description: res.data.description || '',
            offerings: res.data.offerings || '',
            faqs: res.data.faqs?.length > 0 ? res.data.faqs : [{ question: '', answer: '' }],
          });
        }
        if (res.data?.qa_blocks && res.data.qa_blocks.length > 0) {
          setQaBlocks(res.data.qa_blocks);
        }
      } catch {
        reset({
          companyName: '', industry: 'Technology', supportEmail: '', phone: '',
          brandVoice: 'friendly', description: '', offerings: '',
          faqs: [{ question: '', answer: '' }],
        });
      }
    }
    loadProfile();
  }, [reset, effectiveTenantId]);

  const handleQABlockChange = (index: number, field: 'question' | 'answer' | 'category', value: string) => {
    const updated = [...qaBlocks];
    updated[index][field] = value;
    setQaBlocks(updated);
  };

  const addQABlock = () => {
    const categoryDefaults = RECOMMENDED_QUESTIONS[activeCategory] || [];
    const existingCount = qaBlocks.filter(b => b.category === activeCategory).length;
    const recommended = categoryDefaults[existingCount % categoryDefaults.length];

    setQaBlocks([
      ...qaBlocks,
      {
        category: activeCategory,
        key: recommended ? `${recommended.key}_${Date.now()}` : `custom_${Date.now()}`,
        question: recommended ? recommended.question : '',
        answer: '',
      },
    ]);
  };

  const removeQABlock = (index: number) => {
    setQaBlocks(qaBlocks.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      // 1. Save company profile
      await api.post('/company/profile', { ...data, tenantId: effectiveTenantId });

      // 2. Upload document & legacy faqs ingest
      const formData = new FormData();
      formData.append('companyName', data.companyName);
      formData.append('description', data.description);
      formData.append('offerings', data.offerings);
      formData.append('faqs', JSON.stringify(data.faqs.filter(f => f.question && f.answer)));
      if (selectedFile) formData.append('document', selectedFile);

      await api.post('/whatsapp/ingest', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { tenantId: effectiveTenantId },
      });

      // 3. Sync Dynamic Onboarding QA Blocks to MongoDB & Qdrant RAG
      const validQABlocks = qaBlocks.filter(b => b.question.trim() && b.answer.trim());
      if (validQABlocks.length > 0) {
        await api.post('/whatsapp/onboarding/qa', { tenantId: effectiveTenantId, qaBlocks: validQABlocks });
      }

      toast.success(`Knowledge Base & ${validQABlocks.length} Categorized QA RAG vectors successfully synced to Qdrant!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit company knowledge base');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 2 Column Layout (Left / Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT COLUMN: Business Profile, AI Persona & Documents */}
          <div className="space-y-8">
            {/* Business Profile */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">1. Business Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Company Name *</label>
                  <input {...register('companyName', { required: true })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Industry Category *</label>
                  <input {...register('industry', { required: true })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. Technology, Finance, E-Commerce, Healthcare..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Support Email *</label>
                  <input type="email" {...register('supportEmail', { required: true })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="support@acme.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Phone Number *</label>
                  <input {...register('phone', { required: true })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>

            {/* AI Persona */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">2. AI Persona & Context</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Brand Voice / Tone *</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['friendly', 'formal', 'sales-oriented'].map(tone => (
                      <label key={tone} className="cursor-pointer">
                        <input type="radio" value={tone} {...register('brandVoice')} className="peer sr-only" />
                        <div className="p-4 rounded-xl border border-white/10 bg-black/30 text-center capitalize text-sm font-medium peer-checked:border-emerald-500 peer-checked:bg-emerald-600/20 peer-checked:text-white text-gray-400 hover:border-white/20 transition-all">
                          {tone}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Business Description & Core Message *</label>
                  <textarea rows={3} {...register('description', { required: true })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="Describe your primary business activity, target customers, and key value propositions..." />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Offerings & Services</label>
                  <textarea rows={2} {...register('offerings')}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="List products, pricing tiers, or service packages..." />
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-3">5. Document Upload (PDF / TXT)</h2>
              <div className="border-2 border-dashed border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 text-center space-y-3 transition-colors bg-black/20">
                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                <div className="text-sm text-gray-300">
                  {selectedFile
                    ? <span className="text-emerald-400 font-medium">{selectedFile.name}</span>
                    : 'Upload company manuals, FAQs, or policy documents'}
                </div>
                <input type="file" accept=".pdf,.txt" onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden" id="file-upload" />
                <label htmlFor="file-upload"
                  className="inline-block px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium cursor-pointer transition-colors">
                  Select File
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={submitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-indigo-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-semibold text-base shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              {submitting ? 'Processing & Vectorizing Context...' : (
                <><CheckCircle2 className="w-5 h-5" /> Save Configuration & Ingest to Qdrant</>
              )}
            </button>
          </div>

          {/* RIGHT COLUMN: Categorized Onboarding QA Blocks & General FAQs */}
          <div className="space-y-8">
            {/* Categorized Onboarding QA Blocks (Lightning Fast RAG) */}
            <div className="glass-panel p-6 rounded-2xl space-y-6 border border-emerald-500/20 bg-gradient-to-b from-emerald-950/10 to-transparent">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-400" />
                    3. Categorized Onboarding QA Blocks
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    Instant RAG Retrieval by the WhatsApp AI Agent.
                  </p>
                </div>
                <button type="button" onClick={addQABlock}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-md shadow-emerald-600/30 transition-all">
                  <Plus className="w-3.5 h-3.5" /> Add QA Block
                </button>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                {CATEGORY_PRESETS.map(cat => {
                  const count = qaBlocks.filter(b => b.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${activeCategory === cat.id
                        ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-200'
                        : 'bg-black/30 border border-white/10 text-gray-400 hover:text-white'
                        }`}
                    >
                      {cat.name}
                      <span className="bg-white/10 px-1.5 py-0.2 rounded-full text-[10px]">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* QA Blocks for Active Category */}
              <div className="space-y-4">
                {qaBlocks
                  .map((block, originalIdx) => ({ block, originalIdx }))
                  .filter(({ block }) => block.category === activeCategory)
                  .map(({ block, originalIdx }) => (
                    <div key={originalIdx} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                          QA Block #{originalIdx + 1} ({block.category})
                        </span>
                        <button type="button" onClick={() => removeQABlock(originalIdx)} className="text-gray-500 hover:text-red-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Question</label>
                        <input
                          type="text"
                          value={block.question}
                          onChange={e => handleQABlockChange(originalIdx, 'question', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="e.g. What are your company working hours?"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-gray-400 uppercase mb-1">Answer</label>
                        <textarea
                          rows={2}
                          value={block.answer}
                          onChange={e => handleQABlockChange(originalIdx, 'answer', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                          placeholder={
                            RECOMMENDED_QUESTIONS[block.category]?.find(q => q.question === block.question)?.defaultAnswerPlaceholder ||
                            "Type your company's detailed answer here..."
                          }
                        />
                      </div>
                    </div>
                  ))}

                {qaBlocks.filter(b => b.category === activeCategory).length === 0 && (
                  <div className="p-6 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-xl">
                    No QA blocks in this category yet. Click &quot;Add QA Block&quot; above to create one.
                  </div>
                )}
              </div>
            </div>

            {/* FAQs */}
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-lg font-semibold text-white">4. Additional FAQs (General)</h2>
                <button type="button" onClick={() => append({ question: '', answer: '' })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-medium transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Question
                </button>
              </div>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">FAQ #{index + 1}</span>
                      {fields.length > 1 && (
                        <button type="button" onClick={() => remove(index)} className="text-gray-500 hover:text-red-400 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input {...register(`faqs.${index}.question` as const)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Question (e.g. What are your refund policies?)" />
                    <textarea rows={2} {...register(`faqs.${index}.answer` as const)}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Answer (e.g. We offer a full 30-day money-back guarantee...)" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}

// ─── Main Page with Tabs ──────────────────────────────────────────────────────

export default function WhatsappPage() {
  const [activeTab, setActiveTab] = useState<TabId>('inbox');
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch users for admin dropdown
  useEffect(() => {
    if (user?.role === 'admin') {
      async function fetchUsers() {
        setLoadingUsers(true);
        try {
          const res = await api.get('/admin/users?limit=100');
          setUsers(res.data.users || []);
        } catch { console.error('Failed to fetch users'); }
        finally { setLoadingUsers(false); }
      }
      fetchUsers();
    }
  }, [user?.role]);

  return (
    <div className="space-y-6">
      {/* Top Bar with Tab Bar & View as User Selector Inline */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Tab Bar */}
        <div className="flex gap-2 p-1 bg-black/30 rounded-xl border border-white/10 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {tab.icon}
              {tab.label}
              {tab.badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-white/10 text-gray-500'
                  }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* View as User Selector Inline in Header */}
        {user?.role === 'admin' && (
          <div className="flex items-center gap-3 bg-black/30 p-1.5 px-3 rounded-xl border border-white/10">
            <Users className="w-4 h-4 text-emerald-400 shrink-0" />
            <label className="text-xs font-medium text-gray-300 shrink-0">View as User:</label>
            <select
              value={selectedUserId}
              onChange={e => setSelectedUserId(e.target.value)}
              disabled={loadingUsers}
              className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500 min-w-[220px]"
            >
              <option value="">-- Your Account (Admin) --</option>
              {users.map(u => (
                <option key={u._id} value={u.tenantId}>
                  {u.name} ({u.email}) - {u.tenantId}
                </option>
              ))}
            </select>
            {loadingUsers && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'inbox' && <ChatInbox />}
        {activeTab === 'knowledge' && (
          <KnowledgeBaseTab selectedUserId={selectedUserId} />
        )}
        {activeTab === 'templates' && <TemplatesTab />}
      </div>
    </div>
  );
}
