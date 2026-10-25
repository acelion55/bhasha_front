'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  FileText,
  Plus,
  Trash2,
  Edit,
  X,
  ImagePlus,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tag?: string;
  category?: string;
  imageUrl?: string;
  published?: boolean;
  isPublished?: boolean;
  readTime?: string;
  createdAt: string;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    category: 'German Grammar',
    readTime: '5 min read',
    isPublished: true,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get<BlogPost[]>('/blogs?all=true');
      setBlogs(res.data);
    } catch (err: any) {
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      title: val,
      slug: editingId ? f.slug : slugify(val),
    }));
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      category: 'German Grammar',
      readTime: '5 min read',
      isPublished: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingId(post._id);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content || '',
      imageUrl: post.imageUrl || '',
      category: post.tag || post.category || 'German Grammar',
      readTime: post.readTime || '5 min read',
      isPublished: post.published ?? post.isPublished ?? true,
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller');
      return;
    }
    setImageUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.post<{ url: string }>('/blogs/upload', data);
      setForm((f) => ({ ...f, imageUrl: res.data.url }));
      toast.success('Image uploaded to Cloudinary');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title) || `post-${Date.now()}`,
        excerpt: form.excerpt,
        content: form.content,
        imageUrl: form.imageUrl,
        tag: form.category,
        published: form.isPublished,
        readTime: form.readTime,
      };
      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload);
        toast.success('Blog post updated!');
      } else {
        await api.post('/blogs', payload);
        toast.success('New blog post published!');
      }
      setShowModal(false);
      fetchBlogs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save blog post');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Blog post deleted');
      fetchBlogs();
    } catch (err: any) {
      toast.error('Failed to delete blog post');
    }
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-4 font-[Plus_Jakarta_Sans]">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 bg-white border border-emerald-100/90 px-4 py-3 rounded-2xl shadow-xs">
        <h1 className="text-sm font-extrabold text-gray-900 tracking-tight">
          Blog Posts CMS
        </h1>

        <button
          onClick={handleOpenCreate}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-200 flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Article
        </button>
      </div>

      {/* Blogs Table */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-emerald-50/50 text-emerald-950/80 border-b border-emerald-100 uppercase text-[11px] font-extrabold tracking-wider">
              <tr>
                <th className="px-4 py-3">Article Title</th>
                <th className="px-4 py-3 w-[150px]">Category</th>
                <th className="px-4 py-3 w-[120px]">Status</th>
                <th className="px-4 py-3 w-[110px]">Read Time</th>
                <th className="px-4 py-3 w-[130px]">Date Published</th>
                <th className="px-4 py-3 w-[120px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs font-bold text-gray-400">
                    Loading articles...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs font-bold text-gray-400">
                    No articles published yet. Click "Create New Article" above!
                  </td>
                </tr>
              ) : (
                blogs.map((b) => {
                  const published = b.published ?? b.isPublished ?? true;
                  return (
                    <tr key={b._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          {b.imageUrl ? (
                            <img
                              src={b.imageUrl}
                              alt=""
                              className="h-10 w-10 rounded-lg object-cover border border-gray-100"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                              <FileText className="h-4 w-4" />
                            </span>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-xs sm:text-sm">{b.title}</div>
                            <div className="text-[11px] text-gray-400 font-mono">/blogs/{b.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          {b.tag || b.category || 'General'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                            published
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500 font-medium">{b.readTime || '5 min'}</td>
                      <td className="px-4 py-3.5 text-xs text-gray-500 font-medium">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(b)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b._id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
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
      </div>

      {/* CREATE / EDIT BLOG MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-emerald-100 rounded-2xl w-full max-w-2xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <h3 className="text-base font-extrabold text-gray-900">
                {editingId ? 'Edit Article' : 'Create Article'}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Master German Nominative & Accusative Cases"
                  value={form.title}
                  onChange={handleTitleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                >
                  <option value="German Grammar">German Grammar</option>
                  <option value="Goethe Exam Prep">Goethe Exam Prep</option>
                  <option value="Peer Ladder Tips">Peer Ladder Tips</option>
                  <option value="Vocabulary Drills">Vocabulary Drills</option>
                  <option value="About">About</option>
                </select>
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Cover Image
                </label>
                {form.imageUrl ? (
                  <div className="relative overflow-hidden rounded-xl border border-gray-200">
                    <img src={form.imageUrl} alt="Cover preview" className="h-44 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: '' })}
                      className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1.5 text-[11px] font-bold text-white hover:bg-black/75"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-4 py-7 text-center transition-colors hover:border-emerald-400 hover:bg-emerald-50/40">
                    {imageUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    ) : (
                      <ImagePlus className="h-6 w-6 text-emerald-600" />
                    )}
                    <span className="text-xs font-bold text-gray-700">
                      {imageUploading ? 'Uploading…' : 'Click to upload an image'}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400">JPG, PNG or WebP · max 5 MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Excerpt
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Short overview for search engines and cards..."
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
                <p className="mt-1 text-[11px] font-medium text-gray-400">
                  A short 1–2 sentence summary shown on blog cards, previews and search results.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Content (Markdown)
                </label>
                <textarea
                  rows={7}
                  required
                  placeholder="Write article content here..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 font-mono text-xs leading-relaxed transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <label htmlFor="isPublished" className="text-xs font-semibold text-gray-700 cursor-pointer select-none">
                  Publish article immediately
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-all"
              >
                {editingId ? 'Save Article' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
