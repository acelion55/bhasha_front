'use client';

import React, { useEffect, useState } from 'react';
import { Download, Mail, Phone, Search, Trash2, Loader2, CreditCard } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Registration {
  _id: string;
  name: string;
  email: string;
  phone: string;
  masterclassId: string;
  masterclassTitle?: string;
  masterclassDate?: string;
  masterclassTime?: string;
  createdAt: string;
}

interface ContactLead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  notes?: string;
  message?: string;
  lead_source?: string;
  createdAt: string;
}

interface Subscription {
  _id: string;
  name: string;
  email: string;
  phone: string;
  courseTitle: string;
  amount: number;
  currency: string;
  status: string;
  paymentId?: string;
  orderId?: string;
  createdAt: string;
}

interface PublicClass {
  _id: string;
  title: string;
  date: string;
  time: string;
  capacity: number;
}

type Tab = 'contact' | 'masterclass' | 'subscribed';

const formatAmount = (amount: number, currency = 'INR') =>
  `${currency === 'INR' ? '₹' : currency + ' '}${(amount || 0).toLocaleString('en-IN')}`;

const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function LeadsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contact');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [contactLeads, setContactLeads] = useState<ContactLead[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [masterclasses, setMasterclasses] = useState<PublicClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMasterclass, setFilterMasterclass] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [regRes, clsRes, contactRes, subRes] = await Promise.all([
          api.get<Registration[]>('/masterclasses/registrations'),
          api.get<PublicClass[]>('/masterclasses?all=true'),
          api.get<{ leads: ContactLead[] }>('/leads', { params: { limit: 1000 } }),
          api.get<Subscription[]>('/subscriptions'),
        ]);
        setRegistrations(regRes.data);
        setMasterclasses(clsRes.data);
        setContactLeads(
          (contactRes.data.leads || []).filter((lead) => lead.lead_source === 'contact_us'),
        );
        setSubscriptions(subRes.data);
      } catch {
        toast.error('Failed to load leads');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const term = searchTerm.toLowerCase();

  const filteredContacts = contactLeads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.phone.includes(searchTerm) ||
      (lead.service_type || '').toLowerCase().includes(term) ||
      (lead.message || '').toLowerCase().includes(term),
  );

  const filteredRegistrations = registrations.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(term) ||
      lead.email.toLowerCase().includes(term) ||
      lead.phone.includes(searchTerm);
    const matchesClass = !filterMasterclass || lead.masterclassId === filterMasterclass;
    return matchesSearch && matchesClass;
  });

  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.name.toLowerCase().includes(term) ||
      sub.email.toLowerCase().includes(term) ||
      sub.phone.includes(searchTerm) ||
      (sub.courseTitle || '').toLowerCase().includes(term),
  );

  const deleteContactLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      setContactLeads((prev) => prev.filter((lead) => lead._id !== id));
      toast.success('Lead deleted');
    } catch {
      toast.error('Failed to delete lead');
    }
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm('Delete this registration?')) return;
    try {
      await api.delete(`/masterclasses/registrations/${id}`);
      setRegistrations((prev) => prev.filter((lead) => lead._id !== id));
      toast.success('Registration deleted');
    } catch {
      toast.error('Failed to delete registration');
    }
  };

  const handleDownloadCSV = () => {
    const date = new Date().toISOString().split('T')[0];

    if (activeTab === 'contact') {
      if (filteredContacts.length === 0) {
        toast.error('No leads to download');
        return;
      }
      downloadCSV(
        `contact-leads-${date}.csv`,
        ['Name', 'Email', 'Phone', 'Topic', 'Message', 'Received On'],
        filteredContacts.map((lead) => [
          lead.name,
          lead.email,
          lead.phone,
          lead.service_type || '',
          lead.message || '',
          new Date(lead.createdAt).toLocaleDateString('en-IN'),
        ]),
      );
      return;
    }

    if (activeTab === 'masterclass') {
      if (filteredRegistrations.length === 0) {
        toast.error('No registrations to download');
        return;
      }
      downloadCSV(
        `masterclass-leads-${date}.csv`,
        ['Name', 'Email', 'Phone', 'Public Class', 'Date', 'Registered On'],
        filteredRegistrations.map((lead) => {
          const cls = masterclasses.find((mc) => mc._id === lead.masterclassId);
          return [
            lead.name,
            lead.email,
            lead.phone,
            lead.masterclassTitle || cls?.title || 'Unknown',
            lead.masterclassDate || cls?.date || '',
            new Date(lead.createdAt).toLocaleDateString('en-IN'),
          ];
        }),
      );
      return;
    }

    if (filteredSubscriptions.length === 0) {
      toast.error('No subscribed students to download');
      return;
    }
    downloadCSV(
      `subscribed-leads-${date}.csv`,
      ['Name', 'Email', 'Phone', 'Plan', 'Amount', 'Status', 'Purchased On'],
      filteredSubscriptions.map((sub) => [
        sub.name,
        sub.email,
        sub.phone,
        sub.courseTitle,
        formatAmount(sub.amount, sub.currency),
        sub.status,
        new Date(sub.createdAt).toLocaleDateString('en-IN'),
      ]),
    );
  };

  const tabClass = (tab: Tab) =>
    `px-5 py-3 text-xs font-bold transition-colors border-b-2 -mb-px ${
      activeTab === tab
        ? 'border-emerald-600 text-emerald-700'
        : 'border-transparent text-gray-500 hover:text-gray-800'
    }`;

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-4 font-[Plus_Jakarta_Sans]">
      <div className="flex items-center justify-between gap-3 bg-white border border-emerald-100/90 px-4 py-3 rounded-2xl shadow-xs">
        <h1 className="text-sm font-extrabold text-gray-900 tracking-tight">Leads</h1>
        <button
          onClick={handleDownloadCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
        >
          <Download className="w-4 h-4" /> Download CSV
        </button>
      </div>

      <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden">
        <div className="flex flex-wrap border-b border-emerald-100">
          <button onClick={() => setActiveTab('contact')} className={tabClass('contact')}>
            Contact Us Leads ({contactLeads.length})
          </button>
          <button onClick={() => setActiveTab('masterclass')} className={tabClass('masterclass')}>
            Masterclass Leads ({registrations.length})
          </button>
          <button onClick={() => setActiveTab('subscribed')} className={tabClass('subscribed')}>
            Subscribed Leads ({subscriptions.length})
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={
                  activeTab === 'contact'
                    ? 'Search by name, email, phone, or message...'
                    : activeTab === 'masterclass'
                      ? 'Search by name, email, or phone...'
                      : 'Search by name, email, phone, or plan...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs"
              />
            </div>
            {activeTab === 'masterclass' && (
              <select
                value={filterMasterclass}
                onChange={(e) => setFilterMasterclass(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-xs"
              >
                <option value="">All Public Classes</option>
                {masterclasses.map((mc) => (
                  <option key={mc._id} value={mc._id}>{mc.title}</option>
                ))}
              </select>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading leads...
            </div>
          ) : activeTab === 'contact' ? (
            filteredContacts.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-bold">
                No contact us leads found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50/50 border-y border-emerald-100">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Name</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Contact</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Topic</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Message</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Received</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredContacts.map((lead) => (
                      <tr key={lead._id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3 text-xs font-medium text-gray-800">{lead.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-400" />
                              <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                                {lead.email}
                              </a>
                            </div>
                            {lead.phone && (
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                                  {lead.phone}
                                </a>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          <div className="font-medium">{lead.service_type || 'General Enquiry'}</div>
                          {lead.notes && <div className="text-[11px] text-gray-500">{lead.notes}</div>}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600 max-w-[280px]">
                          <p className="line-clamp-2">{lead.message || '—'}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">
                          {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <button
                            onClick={() => deleteContactLead(lead._id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : activeTab === 'masterclass' ? (
            filteredRegistrations.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-bold">
                No masterclass leads found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-emerald-50/50 border-y border-emerald-100">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Name</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Contact</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Public Class</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Registered</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRegistrations.map((lead) => {
                      const cls = masterclasses.find((mc) => mc._id === lead.masterclassId);
                      return (
                        <tr key={lead._id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-4 py-3 text-xs font-medium text-gray-800">{lead.name}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-gray-400" />
                                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                                  {lead.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-gray-400" />
                                <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                                  {lead.phone}
                                </a>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            <div className="font-medium">
                              {lead.masterclassTitle || cls?.title || 'Unknown'}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {lead.masterclassDate || cls?.date} • {lead.masterclassTime || cls?.time}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600">
                            {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-4 py-3 text-xs">
                            <button
                              onClick={() => deleteRegistration(lead._id)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : filteredSubscriptions.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs font-bold">
              No subscribed leads found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-50/50 border-y border-emerald-100">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Student</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Contact</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Plan</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-emerald-950/80">Purchased</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-4 py-3 text-xs font-medium text-gray-800">{sub.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <div className="flex flex-col gap-1">
                          {sub.email && (
                            <div className="flex items-center gap-2">
                              <Mail size={14} className="text-gray-400" />
                              <a href={`mailto:${sub.email}`} className="text-blue-600 hover:underline">
                                {sub.email}
                              </a>
                            </div>
                          )}
                          {sub.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-gray-400" />
                              <a href={`tel:${sub.phone}`} className="text-blue-600 hover:underline">
                                {sub.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 font-medium text-gray-800">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                          {sub.courseTitle || 'Plan'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-800">
                        {formatAmount(sub.amount, sub.currency)}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold capitalize text-emerald-800">
                          {sub.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">
                        {new Date(sub.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
