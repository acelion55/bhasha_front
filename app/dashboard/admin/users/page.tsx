'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  Users, 
  Trash2, 
  Edit, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  GraduationCap, 
  IdCard,
  UserPlus,
  RefreshCw,
  Phone,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: 'admin' | 'student' | 'mentor' | 'teacher' | 'user';
  category?: string;
  language?: string;
  studentId?: string;
  isActive?: boolean;
  isSubscribed?: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UsersResponse {
  users: User[];
  pagination: Pagination;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'student',
    category: 'A1',
    language: 'German',
    studentId: '',
    isActive: true,
    isSubscribed: false,
  });

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'student',
    category: 'A1',
    language: 'German',
    studentId: '',
    isSubscribed: false,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get<UsersResponse>('/admin/users', {
        params: { page: pagination.page, limit: pagination.limit, search },
      });
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err: any) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const generateNewStudentUuid = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `bs-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  };

  const formatStudentUuid = (u: User, idx: number): string => {
    if (u.studentId && u.studentId.trim() !== '') {
      return u.studentId;
    }
    const d = u.createdAt ? new Date(u.createdAt) : new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const num = String(idx + 1).padStart(3, '0');
    return `bs-${num}-${yyyy}${mm}${dd}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleOpenCreateModal = () => {
    const autogenUuid = generateNewStudentUuid();
    setCreateForm({
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      role: 'student',
      category: 'A1',
      language: 'German',
      studentId: autogenUuid,
      isSubscribed: false,
    });
    setShowCreateModal(true);
  };

  const handleOpenEdit = (u: User, idx: number) => {
    setEditingUser(u);
    const defaultUuid = formatStudentUuid(u, idx);
    const digits = (u.phoneNumber || '').replace(/\D/g, '');
    setEditForm({
      name: u.name,
      email: u.email || '',
      phoneNumber: digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.slice(-10),
      role: u.role || 'student',
      category: ['A1', 'A2', 'B1', 'B2', 'All'].includes(u.category || '') ? u.category! : (u.category || 'A1'),
      language: u.language || 'German',
      studentId: u.studentId || defaultUuid,
      isActive: u.isActive !== false,
      isSubscribed: u.isSubscribed === true,
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    const trimmedName = editForm.name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      toast.error('Name must be between 2 and 50 characters');
      return;
    }
    const trimmedEmail = editForm.email.trim();
    if (trimmedEmail && (!trimmedEmail.includes('@') || trimmedEmail.length > 80)) {
      toast.error('Enter a valid email address (max 80 characters)');
      return;
    }
    if (editForm.phoneNumber && editForm.phoneNumber.length !== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    const payload: Record<string, unknown> = {
      name: trimmedName,
      email: trimmedEmail,
      role: editForm.role,
      category: editForm.category,
      language: editForm.language,
      studentId: editForm.studentId,
      isActive: editForm.isActive,
      isSubscribed: editForm.isSubscribed,
    };
    if (editForm.phoneNumber) payload.phoneNumber = editForm.phoneNumber;

    setSaving(true);
    try {
      await api.put(`/admin/users/${editingUser._id}`, payload);
      toast.success('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSubscription = async (u: User) => {
    const nextSubscribed = u.isSubscribed !== true;
    try {
      await api.put(`/admin/users/${u._id}`, { isSubscribed: nextSubscribed });
      setUsers((prev) =>
        prev.map((item) => (item._id === u._id ? { ...item, isSubscribed: nextSubscribed } : item)),
      );
      toast.success(nextSubscribed ? 'Course subscription activated' : 'Course subscription deactivated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update subscription status');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Input Limit & Required Validations
    const trimmedName = createForm.name.trim();
    if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 50) {
      toast.error('Name is required (2 to 50 characters)');
      return;
    }

    const trimmedEmail = createForm.email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@') || trimmedEmail.length > 80) {
      toast.error('A valid email address is required (Max 80 characters)');
      return;
    }

    const phoneDigits = createForm.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      toast.error('A valid 10-digit phone number is required for login');
      return;
    }

    if (!createForm.password || createForm.password.length < 4 || createForm.password.length > 32) {
      toast.error('Password is required (4 to 32 characters)');
      return;
    }

    const studentIdToSend = createForm.studentId?.trim() || generateNewStudentUuid();

    setCreating(true);
    try {
      await api.post('/admin/users', {
        ...createForm,
        name: trimmedName,
        email: trimmedEmail,
        phoneNumber: phoneDigits,
        studentId: studentIdToSend,
        isSubscribed: createForm.isSubscribed,
      });
      toast.success('New user created successfully!');
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'student',
        category: 'A1',
        language: 'German',
        studentId: '',
        isSubscribed: false,
      });
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleActive = async (u: User) => {
    const nextActive = u.isActive === false;
    try {
      await api.put(`/admin/users/${u._id}`, { isActive: nextActive });
      setUsers((prev) =>
        prev.map((item) => (item._id === u._id ? { ...item, isActive: nextActive } : item)),
      );
      toast.success(nextActive ? 'User activated' : 'User deactivated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'Recently';
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredUsers = users;

  const hasActiveFilters = Boolean(search);

  const resetFilters = () => {
    setSearch('');
    setPagination((p) => ({ ...p, page: 1 }));
  };

  return (
    <div className="w-full max-w-[1536px] mx-auto space-y-3 font-[Plus_Jakarta_Sans]">
      
      {/* Unified Search & Filter Toolbar */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl p-3 shadow-xs flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, email, or Student UUID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={50}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-50/70 border border-gray-200 text-gray-900 placeholder-gray-400 text-xs font-semibold focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={fetchUsers}
            disabled={loading}
            title="Refresh user list"
            className="p-2 rounded-xl border border-emerald-200/80 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Add User button */}
          <button
            onClick={handleOpenCreateModal}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm shadow-emerald-200 flex items-center gap-1.5 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-emerald-100/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-emerald-50/50 text-emerald-950/80 border-b border-emerald-100 uppercase text-[11px] font-extrabold tracking-wider">
              <tr>
                <th className="px-4 py-3 w-[180px]">Student UUID</th>
                <th className="px-4 py-3 min-w-[240px]">User Details</th>
                <th className="px-4 py-3 w-[160px]">Phone Number</th>
                <th className="px-4 py-3 w-[130px]">Role</th>
                <th className="px-4 py-3 w-[120px]">Language</th>
                <th className="px-4 py-3 w-[140px]">CEFR Level</th>
                <th className="px-4 py-3 w-[145px]">Course Access</th>
                <th className="px-4 py-3 w-[140px]">Joined Date</th>
                <th className="px-4 py-3 w-[210px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-xs font-bold text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
                      <span>Loading user records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <div className="max-w-xs mx-auto text-center space-y-2">
                      <p className="text-sm font-bold text-gray-800">No users found</p>
                      <p className="text-xs text-gray-400">
                        {hasActiveFilters
                          ? 'Try clearing active filters or search terms.'
                          : 'Click "Add New User" to register a new student or admin.'}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-2 text-xs font-bold text-emerald-700 underline"
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => {
                  const studentUuid = formatStudentUuid(u, idx);
                  return (
                    <tr key={u._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-mono text-xs font-bold border border-emerald-200/70">
                          <IdCard className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{studentUuid}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 text-xs sm:text-sm truncate">{u.name}</div>
                          <div className="text-xs text-gray-400 truncate">
                            {u.email || 'No email'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {u.phoneNumber ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            +{u.phoneNumber}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-gray-400">No phone</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wide border ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : u.role === 'mentor' || u.role === 'teacher'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {u.role || 'student'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-sky-50 text-sky-900 font-bold text-xs border border-sky-200">
                          <Languages className="w-3.5 h-3.5 text-sky-700" />
                          <span>{u.language || 'German'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold text-xs ${
                            u.role === 'mentor' || u.role === 'teacher'
                              ? 'bg-amber-100/90 text-amber-900 border border-amber-200'
                              : 'bg-emerald-100/70 text-emerald-900'
                          }`}
                        >
                          <GraduationCap
                            className={`w-3.5 h-3.5 ${
                              u.role === 'mentor' || u.role === 'teacher'
                                ? 'text-amber-700'
                                : 'text-emerald-700'
                            }`}
                          />
                          <span>
                            {u.role === 'mentor' || u.role === 'teacher'
                              ? `${u.role === 'mentor' ? 'Mentor' : 'Teacher'}: ${
                                  u.category === 'All' ? 'All Levels' : u.category || 'A1'
                                }`
                              : u.category || 'A1'}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={u.isSubscribed === true}
                            onClick={() => handleToggleSubscription(u)}
                            title={u.isSubscribed ? 'Deactivate course subscription' : 'Activate course subscription'}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                              u.isSubscribed ? 'bg-emerald-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                u.isSubscribed ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <span
                            className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                              u.isSubscribed
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}
                          >
                            {u.isSubscribed ? 'Paid Access' : 'Locked'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium text-gray-600">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              role="switch"
                              aria-checked={u.isActive !== false}
                              onClick={() => handleToggleActive(u)}
                              title={u.isActive === false ? 'Activate user' : 'Deactivate user'}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                                u.isActive === false ? 'bg-gray-300' : 'bg-emerald-500'
                              }`}
                            >
                              <span
                                className={`absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                  u.isActive === false ? 'translate-x-0' : 'translate-x-4'
                                }`}
                              />
                            </button>
                            <span
                              className={`w-11 text-left text-[11px] font-bold ${
                                u.isActive === false ? 'text-gray-400' : 'text-emerald-700'
                              }`}
                            >
                              {u.isActive === false ? 'Inactive' : 'Active'}
                            </span>
                          </div>
                          <span className="h-4 w-px bg-gray-200" />
                          <button
                            onClick={() => handleOpenEdit(u, idx)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u._id)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete User"
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

        {/* Table Footer / Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 text-xs">
          <div className="font-semibold text-gray-500">
            Showing <span className="text-gray-900 font-bold">{filteredUsers.length}</span> of{' '}
            <span className="text-gray-900 font-bold">{pagination.total || users.length}</span> users
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 mr-1">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                disabled={pagination.page === 1}
                className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CREATE NEW USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-white border border-emerald-100 rounded-2xl w-full max-w-md p-6 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" /> Add New User
              </h3>
              <button 
                type="button" 
                onClick={() => setShowCreateModal(false)} 
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="Rahul Sharma"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  maxLength={80}
                  placeholder="name@example.com"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              {/* Phone Number (login) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-500 font-bold text-xs">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={createForm.phoneNumber}
                    onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">Used by the user to log in with a password.</p>
              </div>

              {/* Account Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={4}
                  maxLength={32}
                  placeholder="••••••••"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              {/* Role & Level */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                    <span>
                      {createForm.role === 'mentor' || createForm.role === 'teacher'
                        ? `${createForm.role === 'mentor' ? 'Mentor' : 'Teacher'} Level`
                        : 'Level'}{' '}
                      <span className="text-red-500">*</span>
                    </span>
                    {(createForm.role === 'mentor' || createForm.role === 'teacher') && (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        Target Cohort
                      </span>
                    )}
                  </label>
                  <select
                    required
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className={`w-full px-3 py-2.5 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-1 ${
                      createForm.role === 'mentor' || createForm.role === 'teacher'
                        ? 'border-amber-300 bg-amber-50/50 text-amber-950 focus:border-amber-600 focus:ring-amber-200'
                        : 'border-gray-200 bg-white text-emerald-900 focus:border-emerald-600 focus:ring-emerald-200'
                    }`}
                  >
                    <option value="A1">A1 Beginner (Baustein & Basics)</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate (Exam Prep)</option>
                    <option value="B2">B2 Upper Intermediate</option>
                    <option value="All">All Levels (All Students)</option>
                  </select>
                </div>
              </div>
              {(createForm.role === 'mentor' || createForm.role === 'teacher') && (
                <p className="-mt-2 text-[11px] text-amber-800 font-semibold bg-amber-50/80 p-2 rounded-lg border border-amber-200/60">
                  ⚡ Assigned to guide and mentor <strong>{createForm.category === 'All' ? 'All' : createForm.category} Level</strong> {createForm.language} students.
                </p>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Course Language <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={createForm.language}
                  onChange={(e) => setCreateForm({ ...createForm, language: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                >
                  <option value="German">German</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                </select>
              </div>

              {/* Subscription Paid Access Toggle */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/40 px-3.5 py-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-800">Paid Subscription</p>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        createForm.isSubscribed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {createForm.isSubscribed ? 'Active Access' : 'Locked'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    If enabled, user can view and join all live cohort batches immediately.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={createForm.isSubscribed}
                  onClick={() => setCreateForm({ ...createForm, isSubscribed: !createForm.isSubscribed })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    createForm.isSubscribed ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      createForm.isSubscribed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 disabled:opacity-50 transition-all"
              >
                {creating ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="bg-white border border-emerald-100 rounded-2xl w-full max-w-2xl p-6 sm:p-7 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3.5">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Edit className="w-4 h-4 text-emerald-600" /> Edit User
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                  {editingUser.studentId || editForm.studentId}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={50}
                    placeholder="Rahul Sharma"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    maxLength={80}
                    placeholder="name@example.com"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-500 font-bold text-xs">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                      })
                    }
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">Used to log in.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Role
                  </label>
                  <select
                    required
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                    <span>
                      {editForm.role === 'mentor' || editForm.role === 'teacher'
                        ? `${editForm.role === 'mentor' ? 'Mentor' : 'Teacher'} Level`
                        : 'CEFR Level'}
                    </span>
                    {(editForm.role === 'mentor' || editForm.role === 'teacher') && (
                      <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        Target Cohort
                      </span>
                    )}
                  </label>
                  <select
                    required
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-1 ${
                      editForm.role === 'mentor' || editForm.role === 'teacher'
                        ? 'border-amber-300 bg-amber-50/50 text-amber-950 focus:border-amber-600 focus:ring-amber-200'
                        : 'border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-emerald-200'
                    }`}
                  >
                    <option value="A1">A1 Beginner (Baustein & Basics)</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate (Exam Prep)</option>
                    <option value="B2">B2 Upper Intermediate</option>
                    <option value="All">All Levels (All Students & Cohorts)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Course Language
                  </label>
                  <select
                    required
                    value={editForm.language}
                    onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                  >
                    <option value="German">German</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </div>
              </div>

              {(editForm.role === 'mentor' || editForm.role === 'teacher') && (
                <div className="bg-amber-50/80 border border-amber-200/70 rounded-xl p-3 text-xs text-amber-900 font-medium">
                  <span className="font-extrabold text-amber-950">Level Assignment:</span> This {editForm.role} is configured for <strong>{editForm.category === 'All' ? 'All' : editForm.category} Level</strong> {editForm.language} students. In their mentor studio, they will see and manage classes designated for this student level.
                </div>
              )}

              {/* Subscription Paid Access On/Off Button */}
              <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/40 px-3.5 py-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-gray-800">Paid Course Subscription</p>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        editForm.isSubscribed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gray-100 text-gray-500 border border-gray-200'
                      }`}
                    >
                      {editForm.isSubscribed ? 'Paid Access Active' : 'Locked / Unpaid'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    When turned ON, classes in Classes Studio will unlock and show up for this user.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editForm.isSubscribed}
                  onClick={() => setEditForm({ ...editForm, isSubscribed: !editForm.isSubscribed })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    editForm.isSubscribed ? 'bg-emerald-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      editForm.isSubscribed ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-3.5 py-3">
                <div>
                  <p className="text-xs font-bold text-gray-800">Account Active</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Inactive users cannot log in until reactivated.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editForm.isActive}
                  onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                    editForm.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      editForm.isActive ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
