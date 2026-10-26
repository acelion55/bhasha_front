'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, Plus, Save, Globe, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SeoItem {
  _id?: string;
  pagePath: string;
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

const DEFAULT_PAGES = [
  { pagePath: '/', title: 'BhashaSchool - Learn Languages 3x Faster with Peer Ladder Method', description: 'Master German, English, and global languages using the peer-to-peer mentoring ladder. A1 to B2 certification cohorts.' },
  { pagePath: '/classes', title: 'Live Public Masterclasses & Batches | BhashaSchool', description: 'Explore live German and English masterclasses. Interactive live rooms with native mentors and peer speakers.' },
  { pagePath: '/courses', title: 'Courses & Fees | BhashaSchool German & English', description: 'German teaching structure: Baustein + A1, A2, B1 and B2 with fees and durations, plus Intermediate English at ₹400/month.' },
  { pagePath: '/privacy-policy', title: 'Privacy Policy | BhashaSchool Legal Framework', description: 'BhashaSchool data collection, encryption, and student privacy protection guidelines.' },
  { pagePath: '/terms', title: 'Terms of Service | BhashaSchool Platform Terms', description: 'BhashaSchool cohort participation, peer conduct, and service terms.' },
];

export default function AdminSeoPage() {
  const [seoList, setSeoList] = useState<SeoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<SeoItem | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSeoData();
  }, []);

  const fetchSeoData = async () => {
    try {
      setLoading(true);
      const res = await api.get<SeoItem[]>('/seo-metadata');
      if (res.data && res.data.length > 0) {
        setSeoList(res.data);
      } else {
        setSeoList(DEFAULT_PAGES);
      }
    } catch {
      setSeoList(DEFAULT_PAGES);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: SeoItem) => {
    setEditingItem({ ...item });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSaving(true);
    try {
      await api.post('/seo-metadata', editingItem);
      toast.success(`SEO metadata updated for ${editingItem.pagePath}`);
      setEditingItem(null);
      fetchSeoData();
    } catch (err: any) {
      toast.error('Failed to update SEO metadata');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-4 font-[Plus_Jakarta_Sans]">
      
      {/* Top Banner */}
      <div className="bg-white border border-emerald-100/90 p-4 sm:p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold">
            <Search className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
              BhashaSchool SEO Meta Manager
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              Optimize page titles, search meta descriptions, OpenGraph social cards, and Google index tags across BhashaSchool routes.
            </p>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-emerald-50/50 text-emerald-950/80 border-b border-emerald-100 uppercase text-[11px] font-extrabold tracking-wider">
              <tr>
                <th className="px-4 py-3 w-[200px]">Route Path</th>
                <th className="px-4 py-3">Meta Title Tag</th>
                <th className="px-4 py-3">Meta Description</th>
                <th className="px-4 py-3 w-[140px] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-xs font-bold text-gray-400">
                    Loading SEO metadata...
                  </td>
                </tr>
              ) : (
                seoList.map((item, idx) => (
                  <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 inline-block">
                        {item.pagePath}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-gray-900 text-xs sm:text-sm max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500 max-w-sm truncate">
                      {item.description}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Configure Meta
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit SEO Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white border border-emerald-100 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-900">
                SEO Metadata for {editingItem.pagePath}
              </h3>
              <button type="button" onClick={() => setEditingItem(null)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-bold mb-1">Target Page Route Path</label>
                <input
                  type="text"
                  disabled
                  value={editingItem.pagePath}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">SEO Title Tag (&lt;title&gt;)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. German A1 Masterclasses | BhashaSchool"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Meta Description Tag</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summarize the page content for search engines..."
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Meta Keywords (Comma separated)</label>
                <input
                  type="text"
                  placeholder="German learning, A1 speaking, peer ladder..."
                  value={editingItem.keywords || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, keywords: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">OpenGraph Social Share Image URL</label>
                <input
                  type="text"
                  placeholder="https://bhashaschool.com/og-banner.jpg"
                  value={editingItem.ogImage || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, ogImage: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Meta Tag'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
