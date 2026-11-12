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
  Languages,
  Mail,
  Lock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Award,
  KeyRound,
  Check,
  BookOpen
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
  avatar?: string;
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

interface ClassSummary {
  _id: string;
  title: string;
  language?: string;
  category?: string;
  categories?: string[];
  timing?: string;
  mentorId?: any;
  mentorName?: string;
  enrolledStudents?: any[];
  maxCapacity?: number;
  maxStudents?: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [allClasses, setAllClasses] = useState<ClassSummary[]>([]);
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
    assignedClassIds: [] as string[],
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

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get<ClassSummary[]>('/classes');
      setAllClasses(res.data || []);
    } catch {
      // silent fail
    }
  };

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
    const isMentorOrTeacher = u.role === 'mentor' || u.role === 'teacher';

    // Determine currently assigned classes from loaded allClasses (mentors create their own classes)
    const assignedIds =
      u.role === 'mentor' || u.role === 'admin'
        ? []
        : allClasses
            .filter((cls) => {
              if (u.role === 'teacher') {
                const mId = typeof cls.mentorId === 'object' ? cls.mentorId?._id : cls.mentorId;
                return mId && String(mId) === String(u._id);
              }
              return (cls.enrolledStudents || []).some((s: any) => {
                const sId = typeof s === 'object' ? (s._id || s.id) : s;
                return sId && String(sId) === String(u._id);
              });
            })
            .map((cls) => cls._id);

    setEditForm({
      name: u.name,
      email: u.email || '',
      phoneNumber: digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits.slice(-10),
      role: u.role || 'student',
      category:
        u.role === 'mentor'
          ? 'All'
          : (u.role === 'student' || u.role === 'user')
            ? (['A1', 'A2', 'B1', 'B2'].includes(u.category || '') ? u.category! : 'A1')
            : ['A1', 'A2', 'B1', 'B2', 'All'].includes(u.category || '')
              ? u.category!
              : 'All',
      language: u.language || 'German',
      studentId: u.studentId || defaultUuid,
      isActive: u.isActive !== false,
      isSubscribed: u.isSubscribed === true,
      assignedClassIds: assignedIds,
    });
  };

  const toggleAssignedClass = (classId: string) => {
    setEditForm((prev) => {
      const exists = prev.assignedClassIds.includes(classId);
      return {
        ...prev,
        assignedClassIds: exists
          ? prev.assignedClassIds.filter((id) => id !== classId)
          : [...prev.assignedClassIds, classId],
      };
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
      category: editForm.role === 'mentor' ? 'All' : editForm.category,
      language: editForm.language,
      studentId: editForm.studentId,
      isActive: editForm.isActive,
      isSubscribed: editForm.isSubscribed,
    };
    if (editForm.role === 'teacher') {
      payload.assignedClassIds = editForm.assignedClassIds;
    } else if (editForm.role === 'student' || editForm.role === 'user') {
      const targetLvl = (editForm.category || 'A1').trim().toUpperCase();
      const userLang = (editForm.language || 'German').trim().toLowerCase();
      payload.assignedClassIds = editForm.assignedClassIds.filter((cid) => {
        const cls = allClasses.find((c) => c._id === cid);
        if (!cls) return false;
        const clsLang = (cls.language || 'German').trim().toLowerCase();
        if (clsLang !== userLang && clsLang !== 'conversational') return false;
        const clsCats = Array.isArray(cls.categories) && cls.categories.length > 0
          ? cls.categories.map((c) => c.trim().toUpperCase())
          : (cls.category || '').split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
        return clsCats.includes(targetLvl) || clsCats.includes('ALL');
      });
    }
    if (editForm.phoneNumber) payload.phoneNumber = editForm.phoneNumber;

    setSaving(true);
    try {
      await api.put(`/admin/users/${editingUser._id}`, payload);
      toast.success('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
      fetchClasses();
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
                              ? (u.category || 'All')
                              : (u.category || 'A1')}
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
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <form
            onSubmit={handleCreateUser}
            className="bg-white rounded-3xl border border-emerald-100/90 w-full max-w-[780px] p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-sm shadow-emerald-500/20 shrink-0">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                    Create New User
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* SECTION 1: Personal & Account Identity */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-900 tracking-wider">
                  <IdCard className="w-4 h-4 text-emerald-600" />
                  <span>Account &amp; Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder="e.g. Rahul Sharma"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-xs sm:text-sm font-semibold transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700 mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        maxLength={80}
                        placeholder="e.g. rahul@example.com"
                        value={createForm.email}
                        onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-xs sm:text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700 mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3 flex items-center gap-1 text-gray-600 font-bold text-xs pointer-events-none select-none">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={createForm.phoneNumber}
                        onChange={(e) =>
                          setCreateForm({
                            ...createForm,
                            phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                          })
                        }
                        className="w-full pl-14 pr-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-xs sm:text-sm font-semibold transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700 mb-1.5">
                      Initial Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="password"
                        required
                        minLength={4}
                        maxLength={32}
                        placeholder="••••••••"
                        value={createForm.password}
                        onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-xs sm:text-sm font-semibold transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Role & Academic Profile */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-900 tracking-wider">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Role &amp; Language</span>
                </div>

                <div className={`grid grid-cols-1 ${createForm.role !== 'mentor' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3.5`}>
                  {/* Role */}
                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700 mb-1.5">
                      Account Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={createForm.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setCreateForm({
                          ...createForm,
                          role: newRole,
                          category:
                            newRole === 'mentor'
                              ? 'All'
                              : newRole === 'teacher' && createForm.category === 'A1'
                                ? 'All'
                                : (newRole === 'student' && createForm.category === 'All')
                                  ? 'A1'
                                  : createForm.category,
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 bg-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  {/* Course Language */}
                  <div>
                    <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700 mb-1.5">
                      Course Language <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={createForm.language}
                      onChange={(e) => setCreateForm({ ...createForm, language: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 bg-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
                    >
                      <option value="German">German</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>

                  {/* CEFR Level (hidden for mentor role) */}
                  {createForm.role !== 'mentor' && (
                    <div>
                      <label className="block text-xs uppercase font-extrabold tracking-wider text-gray-700 mb-1.5">
                        CEFR Level <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={createForm.category}
                        onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all focus:outline-none focus:ring-4 cursor-pointer ${
                          createForm.role === 'teacher'
                            ? 'border-amber-300 bg-amber-50/50 text-amber-950 focus:border-amber-600 focus:ring-amber-500/10'
                            : 'border-gray-200 bg-white text-emerald-950 focus:border-emerald-600 focus:ring-emerald-500/10'
                        }`}
                      >
                        <option value="A1">Level A1</option>
                        <option value="A2">Level A2</option>
                        <option value="B1">Level B1</option>
                        <option value="B2">Level B2</option>
                        {createForm.role !== 'student' && (
                          <option value="All">All Levels</option>
                        )}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: Course & Live Batch Access */}
              <div className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-900 tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Access</span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 transition-all">
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm font-bold text-emerald-950">
                      Paid Subscription
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        createForm.isSubscribed
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {createForm.isSubscribed ? 'Active' : 'Locked'}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={createForm.isSubscribed}
                    onClick={() => setCreateForm({ ...createForm, isSubscribed: !createForm.isSubscribed })}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none shadow-inner ${
                      createForm.isSubscribed ? 'bg-emerald-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                        createForm.isSubscribed ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {creating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="bg-white rounded-3xl border border-gray-100 w-full max-w-[820px] shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col overflow-hidden"
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-end px-6 sm:px-8 pt-5 pb-0">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2 space-y-6 overflow-y-auto">
              
              {/* Personal Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder="Rahul Sharma"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50/60 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        maxLength={80}
                        placeholder="name@example.com"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50/60 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 flex items-center gap-1 text-gray-500 font-bold text-xs pointer-events-none select-none">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="9876543210"
                        value={editForm.phoneNumber}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                          })
                        }
                        className="w-full pl-15 pr-4 py-3 rounded-xl bg-slate-50/60 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Academic Information */}
              <div className="space-y-4 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Role &amp; Language</span>
                </div>

                <div className={`grid grid-cols-1 ${editForm.role !== 'mentor' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-4`}>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Role <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={editForm.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        setEditForm({
                          ...editForm,
                          role: newRole,
                          category:
                            newRole === 'mentor'
                              ? 'All'
                              : newRole === 'teacher' && editForm.category === 'A1'
                                ? 'All'
                                : (newRole === 'student' && editForm.category === 'All')
                                  ? 'A1'
                                  : editForm.category,
                          assignedClassIds: newRole === 'mentor' || newRole === 'admin' ? [] : editForm.assignedClassIds,
                        });
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50/60 border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all cursor-pointer"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Language <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={editForm.language}
                      onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50/60 border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all cursor-pointer"
                    >
                      <option value="German">German</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>

                  {editForm.role !== 'mentor' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        CEFR Level <span className="text-rose-500">*</span>
                      </label>
                      <select
                        required
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50/60 border border-gray-200 text-gray-900 focus:bg-white focus:outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 text-sm font-semibold transition-all cursor-pointer"
                      >
                        <option value="A1">Level A1</option>
                        <option value="A2">Level A2</option>
                        <option value="B1">Level B1</option>
                        <option value="B2">Level B2</option>
                        {editForm.role !== 'student' && editForm.role !== 'user' && (
                          <option value="All">All Levels</option>
                        )}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Class Assignment (Teacher -> Assign Class, Student -> Enroll in Class matching current level & language) */}
              {editForm.role !== 'admin' && editForm.role !== 'mentor' && (() => {
                const isStudentRole = editForm.role === 'student' || editForm.role === 'user';
                const visibleClasses = allClasses
                  .filter((cls) => {
                    if (isStudentRole) {
                      const clsLang = (cls.language || 'German').trim().toLowerCase();
                      const userLang = (editForm.language || 'German').trim().toLowerCase();
                      if (clsLang !== userLang && clsLang !== 'conversational') return false;
                      const targetLvl = (editForm.category || 'A1').trim().toUpperCase();
                      const clsCats = Array.isArray(cls.categories) && cls.categories.length > 0
                        ? cls.categories.map((c) => c.trim().toUpperCase())
                        : (cls.category || '').split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
                      return clsCats.includes(targetLvl) || clsCats.includes('ALL');
                    }
                    return true;
                  })
                  .sort((a, b) => {
                    const aMatch = (a.language || 'German').toLowerCase() === (editForm.language || 'German').toLowerCase() ? 0 : 1;
                    const bMatch = (b.language || 'German').toLowerCase() === (editForm.language || 'German').toLowerCase() ? 0 : 1;
                    return aMatch - bMatch;
                  });

                return (
                <div className="space-y-3.5 pt-5 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                      <BookOpen className="w-4 h-4 text-emerald-600" />
                      <span>
                        {editForm.role === 'teacher'
                          ? 'Assign Classes'
                          : `Enroll in ${editForm.language} ${editForm.category} Classes`}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      {visibleClasses.filter((c) => editForm.assignedClassIds.includes(c._id)).length} Selected
                    </span>
                  </div>

                  {visibleClasses.length === 0 ? (
                    <p className="text-xs text-gray-400 font-medium py-2">
                      {isStudentRole
                        ? `No batches available for ${editForm.language} ${editForm.category}.`
                        : 'No classes found.'}
                    </p>
                  ) : (
                    <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                      {visibleClasses.map((cls) => {
                          const isChecked = editForm.assignedClassIds.includes(cls._id);
                          const teacherLabel =
                            (typeof cls.mentorId === 'object' ? cls.mentorId?.name : null) ||
                            (cls.mentorName && cls.mentorName !== 'Instructor' ? cls.mentorName : 'Unassigned');
                          const enrolledLen = (cls.enrolledStudents || []).length;
                          const maxCap = cls.maxCapacity || cls.maxStudents || 25;

                          return (
                            <label
                              key={cls._id}
                              className={`flex items-center justify-between gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-emerald-50/80 border-emerald-500 ring-1 ring-emerald-500/20'
                                  : 'bg-slate-50/60 border-gray-200 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleAssignedClass(cls._id)}
                                  className="w-4 h-4 rounded accent-emerald-600 cursor-pointer shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs sm:text-sm font-extrabold text-gray-900 truncate">
                                      {cls.title}
                                    </span>
                                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                      {cls.language || 'German'} {cls.category || ''}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-500 font-medium truncate">
                                    {cls.timing || 'Schedule TBA'} • {teacherLabel}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-gray-500 shrink-0">
                                {enrolledLen}/{maxCap}
                              </span>
                            </label>
                          );
                        })}
                    </div>
                  )}
                </div>
                );
              })()}

              {/* Status & Access Toggles */}
              <div className="space-y-3.5 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-black text-gray-900 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Access &amp; Status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Subscription Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-slate-50/40 hover:bg-slate-50/80 transition-all">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">
                        Paid Subscription
                      </p>
                      <p className={`text-[11px] font-bold mt-0.5 ${editForm.isSubscribed ? 'text-emerald-700' : 'text-gray-500'}`}>
                        {editForm.isSubscribed ? 'Active Access' : 'Locked'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={editForm.isSubscribed}
                      onClick={() => setEditForm({ ...editForm, isSubscribed: !editForm.isSubscribed })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none shadow-inner ${
                        editForm.isSubscribed ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          editForm.isSubscribed ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Account Active Toggle */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-200 bg-slate-50/40 hover:bg-slate-50/80 transition-all">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Account Active</p>
                      <p className={`text-[11px] font-bold mt-0.5 ${editForm.isActive ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {editForm.isActive ? 'Active' : 'Suspended'}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={editForm.isActive}
                      onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none shadow-inner ${
                        editForm.isActive ? 'bg-emerald-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          editForm.isActive ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2.5 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
