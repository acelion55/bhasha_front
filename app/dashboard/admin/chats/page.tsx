'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import {
  MessagesSquare,
  Search,
  RefreshCw,
  Trash2,
  ExternalLink,
  Video,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  User,
  Mail,
  GraduationCap,
  MessageCircle,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

interface Participant {
  id: string;
  name: string;
  email: string;
  level: string;
  role: string;
  studentId?: string;
  phoneNumber?: string;
}

interface ConversationItem {
  id: string;
  participants: Participant[];
  pairKey: string;
  lastMessage: string;
  lastMessageAt: string | null;
  messageCount: number;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderLevel: string;
  senderRole: string;
  body: string;
  kind: string;
  meetingUrl: string;
  createdAt?: string;
}

const levelColorMap: Record<string, { bg: string; text: string; border: string }> = {
  A1: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  A2: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  B1: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  B2: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  C1: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  C2: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

function LevelBadge({ level }: { level?: string }) {
  const norm = (level || 'A1').toUpperCase();
  const c = levelColorMap[norm] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
  return (
    <span
      className={`inline-flex items-center text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${c.bg} ${c.text} ${c.border}`}
    >
      {norm}
    </span>
  );
}

function formatRelativeTime(dateStr?: string | null) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatMessageTime(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatMessageDateHeader(dateStr?: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminChatsPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Active chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeMeta, setActiveMeta] = useState<ConversationItem | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Fetch all conversations
  const fetchConversations = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setLoading(true);
      const res = await api.get('/chat/admin/conversations', {
        params: { limit: 100 },
      });
      const list = res.data?.conversations || [];
      setConversations(list);

      // Keep active conversation synced if exists
      if (selectedId) {
        const found = list.find((c: ConversationItem) => c.id === selectedId);
        if (found) setActiveMeta(found);
      }
    } catch (err: any) {
      console.error('Error fetching admin conversations:', err);
      toast.error('Failed to load student conversations');
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load messages when selected conversation changes
  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/admin/conversations/${convId}/messages`);
      setMessages(res.data?.messages || []);
      if (res.data?.conversation) {
        setActiveMeta(res.data.conversation);
      }
    } catch (err) {
      console.error('Error loading conversation messages:', err);
      toast.error('Could not load message history');
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const handleSelectConversation = (conv: ConversationItem) => {
    setSelectedId(conv.id);
    setActiveMeta(conv);
    loadMessages(conv.id);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!loadingMessages) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingMessages]);

  // Delete message handler
  const handleDeleteMessage = async (msgId: string) => {
    if (!confirm('Are you sure you want to delete this message? It will be permanently removed for both students.')) {
      return;
    }
    try {
      await api.delete(`/chat/admin/messages/${msgId}`);
      setMessages((prev) => prev.filter((m) => m.id !== msgId));
      toast.success('Message deleted');
      // Refresh list to update snippet
      fetchConversations();
    } catch (err) {
      console.error('Failed to delete message:', err);
      toast.error('Could not delete message');
    }
  };

  // Delete entire conversation handler
  const handleDeleteConversation = async (convId: string) => {
    if (!confirm('Are you sure you want to delete this entire conversation and all its messages? This action cannot be undone.')) {
      return;
    }
    setDeletingId(convId);
    try {
      await api.delete(`/chat/admin/conversations/${convId}`);
      toast.success('Conversation removed');
      if (selectedId === convId) {
        setSelectedId(null);
        setActiveMeta(null);
        setMessages([]);
      }
      setConversations((prev) => prev.filter((c) => c.id !== convId));
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      toast.error('Could not delete conversation');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const p1 = c.participants?.[0];
      const p2 = c.participants?.[1];

      // Level filter
      if (levelFilter !== 'all') {
        const matchesLevel = (p1?.level?.toUpperCase() === levelFilter) || (p2?.level?.toUpperCase() === levelFilter);
        if (!matchesLevel) return false;
      }

      // Search term
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const p1Match = p1?.name?.toLowerCase().includes(q) || p1?.email?.toLowerCase().includes(q);
        const p2Match = p2?.name?.toLowerCase().includes(q) || p2?.email?.toLowerCase().includes(q);
        const msgMatch = (c.lastMessage || '').toLowerCase().includes(q);
        return p1Match || p2Match || msgMatch;
      }

      return true;
    });
  }, [conversations, search, levelFilter]);

  // Stats calculation
  const totalMessagesCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.messageCount || 0), 0);
  }, [conversations]);

  // Group messages by date for visual elegance
  const groupedMessages = useMemo(() => {
    const groups: { dateHeader: string; items: ChatMessage[] }[] = [];
    let currentHeader = '';

    messages.forEach((msg) => {
      const header = formatMessageDateHeader(msg.createdAt);
      if (header !== currentHeader) {
        currentHeader = header;
        groups.push({ dateHeader: header, items: [msg] });
      } else {
        groups[groups.length - 1].items.push(msg);
      }
    });

    return groups;
  }, [messages]);

  // Determine participant colors
  const p1 = activeMeta?.participants?.[0];
  const p2 = activeMeta?.participants?.[1];

  return (
    <div className="h-full flex flex-col bg-[#F9FBFA] text-gray-800">
      {/* Top Admin Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold">
                <MessagesSquare className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                Student Chats Monitor
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Admin View
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Supervise student-to-student language exchange conversations, inspect practice meetings, and manage chat history.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-3 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Pairs</span>
                <span className="text-sm font-black text-gray-800">{conversations.length}</span>
              </div>
              <div className="w-px h-6 bg-gray-200" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">Total Messages</span>
                <span className="text-sm font-black text-emerald-700">{totalMessagesCount}</span>
              </div>
            </div>

            <button
              onClick={() => fetchConversations(true)}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all shadow-sm"
              title="Refresh conversations list"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Split Layout: Left List + Right Conversation Transcript */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Sidebar: Conversations list */}
        <aside className="w-full md:w-96 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
          {/* Search & Level Filter */}
          <div className="p-3.5 border-b border-gray-100 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400 font-medium"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Level Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-gray-400 mr-1">Level:</span>
              {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevelFilter(lvl)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                    levelFilter === lvl
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lvl.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="dashboard-scroll-panel flex-1 overflow-y-auto overscroll-y-contain touch-pan-y divide-y divide-gray-100">
            {loading && conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2 text-emerald-600" />
                Loading student chats...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageCircle className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-bold text-gray-600">No student conversations found</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {search ? 'Try adjusting your search query' : 'When students start language exchange, they will appear here'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const student1 = conv.participants?.[0] || { name: 'Unknown Student', level: 'A1', email: '' };
                const student2 = conv.participants?.[1] || { name: 'Unknown Student', level: 'A1', email: '' };
                const isSelected = selectedId === conv.id;

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv)}
                    className={`p-3.5 transition-colors cursor-pointer text-left relative group ${
                      isSelected
                        ? 'bg-emerald-50/80 border-l-4 border-l-emerald-700'
                        : 'hover:bg-gray-50/80'
                    }`}
                  >
                    {/* Header: Student 1 ⇄ Student 2 */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex-1 min-w-0">
                        {/* Student 1 */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 truncate">
                          <span className="truncate">{student1.name}</span>
                          <LevelBadge level={student1.level} />
                        </div>
                        {/* Exchange indicator */}
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 font-medium py-0.5">
                          <span className="inline-block w-2.5 border-t border-gray-300" />
                          <span>chats with</span>
                          <span className="inline-block w-2.5 border-t border-gray-300" />
                        </div>
                        {/* Student 2 */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 truncate">
                          <span className="truncate">{student2.name}</span>
                          <LevelBadge level={student2.level} />
                        </div>
                      </div>

                      {/* Right: Timestamp and message count */}
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className="text-[10px] text-gray-400 font-medium">
                          {formatRelativeTime(conv.lastMessageAt || conv.createdAt)}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                          {conv.messageCount || 0} msgs
                        </span>
                      </div>
                    </div>

                    {/* Last message snippet */}
                    <p className="text-[11px] text-gray-500 line-clamp-1 italic mt-1 font-normal">
                      {conv.lastMessage ? `"${conv.lastMessage}"` : 'No messages yet'}
                    </p>

                    {/* Action on hover */}
                    <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-gray-100">
                      <span className="text-gray-400 text-[10px]">
                        ID: {conv.id.slice(-6)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conv.id);
                        }}
                        disabled={deletingId === conv.id}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 transition-opacity"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Section: Conversation Transcript */}
        <main className="flex-1 flex flex-col h-full bg-[#fcfdfd] overflow-hidden">
          {!selectedId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
                <MessagesSquare className="w-8 h-8" />
              </div>
              <h2 className="text-base font-black text-gray-800">No Student Conversation Selected</h2>
              <p className="text-xs text-gray-500 max-w-sm mt-1.5 leading-relaxed">
                Choose a student pair from the left panel to inspect their live message transcript, meeting links, and participant details.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-4 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Administrative live monitoring mode
              </div>
            </div>
          ) : (
            <>
              {/* Active Conversation Top Banner: Participant Dossier */}
              <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Both Students Info */}
                  <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                    {/* Student 1 */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center border border-sky-200 flex-shrink-0">
                        {p1?.name ? p1.name.slice(0, 2).toUpperCase() : 'S1'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-gray-900">{p1?.name || 'Student 1'}</span>
                          <LevelBadge level={p1?.level} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[150px]">{p1?.email || 'No email'}</span>
                          {p1?.id && (
                            <Link
                              href={`/dashboard/admin/users?search=${encodeURIComponent(p1.email || p1.name)}`}
                              className="text-[10px] text-emerald-700 hover:underline inline-flex items-center ml-1"
                              title="View in Users Engine"
                            >
                              Profile <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Divider Icon */}
                    <div className="hidden sm:flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    {/* Student 2 */}
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center border border-emerald-200 flex-shrink-0">
                        {p2?.name ? p2.name.slice(0, 2).toUpperCase() : 'S2'}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-gray-900">{p2?.name || 'Student 2'}</span>
                          <LevelBadge level={p2?.level} />
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[150px]">{p2?.email || 'No email'}</span>
                          {p2?.id && (
                            <Link
                              href={`/dashboard/admin/users?search=${encodeURIComponent(p2.email || p2.name)}`}
                              className="text-[10px] text-emerald-700 hover:underline inline-flex items-center ml-1"
                              title="View in Users Engine"
                            >
                              Profile <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Meta */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => selectedId && loadMessages(selectedId)}
                      disabled={loadingMessages}
                      className="px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg inline-flex items-center gap-1"
                      title="Reload transcript"
                    >
                      <RefreshCw className={`w-3 h-3 ${loadingMessages ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                    <button
                      onClick={() => selectedId && handleDeleteConversation(selectedId)}
                      className="px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg inline-flex items-center gap-1"
                      title="Delete entire conversation"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete Chat
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Transcript Feed */}
              <div className="dashboard-scroll-panel flex-1 overflow-y-auto overscroll-y-contain touch-pan-y p-4 sm:p-6 space-y-6">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2 text-emerald-600" />
                    Fetching message history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                    <MessageCircle className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs font-semibold text-gray-600">No messages sent yet between these students.</p>
                    <p className="text-[11px] text-gray-400 mt-1">Conversation is open and ready for language practice.</p>
                  </div>
                ) : (
                  groupedMessages.map((group, gIdx) => (
                    <div key={gIdx} className="space-y-4">
                      {/* Date Divider */}
                      <div className="flex items-center justify-center my-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                          {group.dateHeader}
                        </span>
                      </div>

                      {/* Messages in Group */}
                      {group.items.map((msg) => {
                        // Is this student 1 or student 2?
                        const isStudent1 = p1 ? msg.senderId === p1.id : false;
                        const bubbleTheme = isStudent1
                          ? {
                              align: 'items-start',
                              wrapper: 'flex-row',
                              card: 'bg-white border-sky-100 text-gray-900',
                              senderTag: 'text-sky-800',
                              badgeColor: 'sky',
                            }
                          : {
                              align: 'items-end',
                              wrapper: 'flex-row-reverse',
                              card: 'bg-emerald-50/70 border-emerald-100 text-emerald-950',
                              senderTag: 'text-emerald-900',
                              badgeColor: 'emerald',
                            };

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${bubbleTheme.wrapper} items-start gap-2.5 group/msg`}
                          >
                            {/* Sender Mini Avatar */}
                            <div
                              className={`w-7 h-7 rounded-lg text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                                isStudent1
                                  ? 'bg-sky-100 text-sky-800 border-sky-200'
                                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              }`}
                              title={msg.senderName}
                            >
                              {msg.senderName ? msg.senderName.slice(0, 1).toUpperCase() : '?'}
                            </div>

                            {/* Message Container */}
                            <div className={`flex flex-col ${bubbleTheme.align} max-w-[85%] sm:max-w-[70%]`}>
                              {/* Sender Header */}
                              <div className="flex items-center gap-1.5 mb-1 px-1">
                                <span className={`text-[11px] font-bold ${bubbleTheme.senderTag}`}>
                                  {msg.senderName}
                                </span>
                                <LevelBadge level={msg.senderLevel} />
                                <span className="text-[10px] text-gray-400 font-normal">
                                  {formatMessageTime(msg.createdAt)}
                                </span>
                              </div>

                              {/* Message Card */}
                              <div
                                className={`rounded-2xl p-3.5 border shadow-xs relative text-xs leading-relaxed break-words ${bubbleTheme.card}`}
                              >
                                {msg.body}

                                {/* If meeting link detected */}
                                {msg.meetingUrl && (
                                  <div className="mt-2.5 pt-2.5 border-t border-gray-200/60 flex items-center justify-between gap-2 bg-white/60 p-2 rounded-xl">
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Practice Call Link</span>
                                    </div>
                                    <a
                                      href={msg.meetingUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
                                    >
                                      Join <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                  </div>
                                )}

                                {/* Admin Delete Message Button on Hover */}
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="opacity-0 group-hover/msg:opacity-100 absolute -top-2 -right-2 p-1 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-600 shadow-xs transition-opacity"
                                  title="Delete message as admin"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Admin Notice Bar (Read-only status) */}
              <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-2.5 flex items-center justify-between text-[11px] text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Admin View: Read-only transcript of student conversation. Deleted messages are purged for all users.
                  </span>
                </div>
                <span className="font-semibold text-gray-600">
                  {messages.length} message{messages.length === 1 ? '' : 's'} logged
                </span>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
