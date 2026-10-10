'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { Mail, Loader2, Search, ChevronLeft, ChevronRight, X, CheckCircle, AlertCircle, Clock, UserCheck, Phone, Tag, FileText, Bot, Eye, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  _id: string;
  tenant_id: string;
  name: string;
  phone?: string;
  email?: string;
  service_type?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'dropped' | 'closed';
  lead_source?: string;
  notes?: string;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface LeadsResponse {
  leads: Lead[];
  pagination: Pagination;
}

interface Stats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  dropped: number;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'New', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock },
  qualified: { label: 'Qualified', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: UserCheck },
  converted: { label: 'Converted', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle },
  dropped: { label: 'Dropped', color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: X },
  closed: { label: 'Closed', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: X },
};

export default function LeadsDashboardPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, contacted: 0, qualified: 0, converted: 0, dropped: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, [pagination.page, search, statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await api.get<LeadsResponse>('/leads', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: statusFilter !== 'all' ? statusFilter : undefined,
        },
      });
      setLeads(res.data.leads || []);
      setPagination(res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 });
    } catch (err: any) {
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get<Stats>('/leads/stats');
      setStats(res.data);
    } catch (err) {
      // ignore
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleStatusChange = async (lead: Lead, newStatus: string) => {
    setUpdatingId(lead._id);
    try {
      await api.put(`/leads/${lead._id}/status`, { status: newStatus });
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      fetchLeads();
      fetchStats();
      if (selectedLead && selectedLead._id === lead._id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }
    } catch (err: any) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted');
      if (selectedLead?._id === id) setSelectedLead(null);
      fetchLeads();
      fetchStats();
    } catch (err: any) {
      toast.error('Failed to delete lead');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-4" />
        <p className="text-gray-400">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-emerald-400" />
            Lead Management & Automation
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time WhatsApp bot leads enriched automatically by n8n workflow notes.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="text-xs text-gray-400">Total Leads</div>
          <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="text-xs text-blue-400">New</div>
          <div className="text-2xl font-bold text-blue-300 mt-1">{stats.new}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="text-xs text-yellow-400">Contacted</div>
          <div className="text-2xl font-bold text-yellow-300 mt-1">{stats.contacted}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="text-xs text-emerald-400">Qualified</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.qualified}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="text-xs text-emerald-400">Converted</div>
          <div className="text-2xl font-bold text-emerald-300 mt-1">{stats.converted}</div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-white/10">
          <div className="text-xs text-red-400">Dropped</div>
          <div className="text-2xl font-bold text-red-300 mt-1">{stats.dropped || 0}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden">
        <form onSubmit={handleSearch} className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, service..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPagination(p => ({ ...p, page: 1 })); }}
            className="px-4 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="dropped">Dropped</option>
            <option value="closed">Closed</option>
          </select>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white/5">
                <th className="p-4">Customer</th>
                <th className="p-4">Service Required</th>
                <th className="p-4">n8n Auto-Notes</th>
                <th className="p-4">Source</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-400" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No leads captured yet.</td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG['new'];
                  const Icon = cfg.icon;
                  return (
                    <tr key={lead._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-white">{lead.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                          {lead.phone && (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <Phone className="w-3 h-3" /> {lead.phone}
                            </span>
                          )}
                          {lead.email && <span>{lead.email}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          <Tag className="w-3 h-3" />
                          {lead.service_type || 'General Query'}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs">
                        {lead.notes ? (
                          <div className="flex items-start gap-1.5 text-xs text-gray-300 bg-white/5 p-2 rounded-lg border border-white/10">
                            <Bot className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2" title={lead.notes}>{lead.notes}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500 italic">No notes generated</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-400 capitalize">
                        <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">
                          {lead.lead_source || 'whatsapp_bot'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead, e.target.value)}
                            disabled={updatingId === lead._id}
                            className="px-2 py-1 text-xs rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="qualified">Qualified</option>
                            <option value="converted">Converted</option>
                            <option value="dropped">Dropped</option>
                            <option value="closed">Closed</option>
                          </select>
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-gray-400">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} leads total)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedLead(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              Lead Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                <div className="text-xs text-gray-400">Customer Name</div>
                <div className="font-semibold text-white text-base mt-0.5">{selectedLead.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400">Phone Number</div>
                  <div className="font-medium text-emerald-400 mt-0.5">{selectedLead.phone || 'N/A'}</div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400">Email Address</div>
                  <div className="font-medium text-white mt-0.5">{selectedLead.email || 'N/A'}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400">Service Type</div>
                  <div className="font-medium text-emerald-300 mt-0.5">{selectedLead.service_type || 'General Query'}</div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400">Source</div>
                  <div className="font-medium text-white mt-0.5 capitalize">{selectedLead.lead_source || 'whatsapp_bot'}</div>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                <div className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                  <Bot className="w-4 h-4" /> n8n Automated Notes
                </div>
                <p className="text-gray-300 mt-1 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedLead.notes || 'No automated notes generated yet.'}
                </p>
              </div>

              {selectedLead.message && (
                <div className="bg-black/40 p-3 rounded-xl border border-white/10">
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <FileText className="w-4 h-4" /> User Initial Message
                  </div>
                  <p className="text-gray-300 mt-1 text-xs">{selectedLead.message}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}