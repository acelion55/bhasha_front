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
  Filter,
  RefreshCw,
  UserCheck,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';

interface User {
  _id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  role: 'admin' | 'student' | 'mentor' | 'user';
  category?: string;
  studentId?: string;
  isActive?: boolean;
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
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: 'student',
    category: 'A1',
    studentId: '',
    isActive: true,
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
    studentId: '',
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
      studentId: autogenUuid,
    });
    setShowCreateModal(true);
  };

  const handleRegenerateCreateUuid = () => {
    const autogenUuid = generateNewStudentUuid();
    setCreateForm((prev) => ({ ...prev, studentId: autogenUuid }));
    toast.success('Generated new Student UUID: ' + autogenUuid);
  };

  const handleOpenEdit = (u: User, idx: number) => {
    setEditingUser(u);
    const defaultUuid = formatStudentUuid(u, idx);
    setEditForm({
      name: u.name,
      email: u.email || '',
      phoneNumber: u.phoneNumber || '',
      role: u.role || 'student',
      category: u.category || 'A1',
      studentId: u.studentId || defaultUuid,
      isActive: u.isActive !== false,
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    if (!editForm.name.trim() || editForm.name.trim().length < 2 || editForm.name.trim().length > 50) {
      toast.error('Name must be between 2 and 50 characters');
      return;
    }
    try {
      await api.put(`/admin/users/${editingUser._id}`, editForm);
      toast.success('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user');
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
        studentId: '',
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

  const getInitials = (name?: string, email?: string) => {
    if (name && name.trim()) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'U';
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (levelFilter !== 'all' && (u.category || 'A1') !== levelFilter) return false;
    if (statusFilter === 'active' && u.isActive === false) return false;
    if (statusFilter === 'inactive' && u.isActive !== false) return false;
    return true;
  });

  const hasActiveFilters = search || roleFilter !== 'all' || levelFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setLevelFilter('all');
    setStatusFilter('all');
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

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-200/80">
            <span className="text-[11px] font-bold text-gray-500 uppercase px-2">Role:</span>
            {['all', 'student', 'mentor', 'admin'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                  roleFilter === r
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* CEFR Level Filter */}
          <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-200/80">
            <span className="text-[11px] font-bold text-gray-500 uppercase px-2">Level:</span>
            {['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === lvl
                    ? 'bg-amber-400 text-emerald-950 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-200/80">
            <span className="text-[11px] font-bold text-gray-500 uppercase px-2">Status:</span>
            {[
              { key: 'all', label: 'All' },
              { key: 'active', label: 'Active' },
              { key: 'inactive', label: 'Inactive' },
            ].map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === s.key
                    ? s.key === 'inactive'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200/60 transition-colors"
            >
              Clear Filters
            </button>
          )}

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
                <th className="px-4 py-3 w-[130px]">Role</th>
                <th className="px-4 py-3 w-[140px]">CEFR Level</th>
                <th className="px-4 py-3 w-[140px]">Joined Date</th>
                <th className="px-4 py-3 w-[210px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs font-bold text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
                      <span>Loading user records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
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
                  const initials = getInitials(u.name, u.email);
                  return (
                    <tr key={u._id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 font-mono text-xs font-bold border border-emerald-200/70">
                          <IdCard className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{studentUuid}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-xs sm:text-sm truncate">{u.name}</div>
                            <div className="text-xs text-gray-400 truncate">
                              {u.email || (u.phoneNumber ? `+${u.phoneNumber}` : 'No email')}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-extrabold uppercase tracking-wide border ${
                            u.role === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : u.role === 'mentor'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {u.role || 'student'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100/70 text-emerald-900 font-bold text-xs">
                          <GraduationCap className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{u.category || 'A1'}</span>
                        </span>
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

              {/* Auto-generated Student UUID */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Student UUID <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    readOnly
                    value={createForm.studentId}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={handleRegenerateCreateUuid}
                    className="shrink-0 px-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    title="Generate a new UUID"
                    aria-label="Generate a new UUID"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-gray-400">Generated automatically. Admin cannot type this field.</p>
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
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={createForm.category}
                    onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-emerald-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-bold transition-all"
                  >
                    <option value="A1">A1 Beginner</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate</option>
                    <option value="B2">B2 Upper Intermediate</option>
                    <option value="C1">C1 Advanced</option>
                    <option value="C2">C2 Mastery</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
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
          <div className="bg-white border border-emerald-100 rounded-2xl w-full max-w-md p-6 sm:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
              <h3 className="text-base font-extrabold text-gray-900">Edit User</h3>
              <button 
                onClick={() => setEditingUser(null)} 
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
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  minLength={2}
                  maxLength={50}
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                />
              </div>

              {/* Phone Number (login) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-500 font-bold text-xs">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="98765 43210"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 text-xs font-medium transition-all"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">Leave blank to keep the current number.</p>
              </div>

              {/* Role & Level */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Role
                  </label>
                  <select
                    required
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-semibold transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="mentor">Mentor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Level
                  </label>
                  <select
                    required
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-emerald-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200 bg-white text-xs font-bold transition-all"
                  >
                    <option value="A1">A1 Beginner</option>
                    <option value="A2">A2 Elementary</option>
                    <option value="B1">B1 Intermediate</option>
                    <option value="B2">B2 Upper Intermediate</option>
                    <option value="C1">C1 Advanced</option>
                    <option value="C2">C2 Mastery</option>
                  </select>
                </div>
              </div>

              {/* Account Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Account Status
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, isActive: true })}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      editForm.isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm({ ...editForm, isActive: false })}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      !editForm.isActive
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm shadow-rose-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5" /> Inactive
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-gray-400">
                  Inactive users cannot log in until reactivated.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3.5 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdate}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
