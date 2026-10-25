'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  AlertCircle,
  ArrowLeft,
  Loader2,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Video,
} from 'lucide-react';

type Partner = {
  id: string;
  name: string;
  level: string;
  conversationId: string | null;
};

type Conversation = {
  id: string;
  partner: { id: string; name: string; level: string };
  lastMessage: string;
  lastMessageAt: string | null;
};

type ChatMessage = {
  id: string;
  senderId: string;
  body: string;
  kind: string;
  meetingUrl: string;
  createdAt?: string;
  mine: boolean;
};

const levelStyles: Record<string, string> = {
  A1: 'bg-sky-50 text-sky-700 border-sky-200',
  A2: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  B1: 'bg-amber-50 text-amber-700 border-amber-200',
  B2: 'bg-orange-50 text-orange-700 border-orange-200',
};

function LevelBadge({ level }: { level: string }) {
  if (!level) return null;
  return (
    <span
      className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${levelStyles[level] || 'bg-gray-50 text-gray-600 border-gray-200'
        }`}
    >
      {level}
    </span>
  );
}

function renderText(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return parts.map((part, index) =>
    /^https?:\/\//i.test(part) ? (
      <a
        key={index}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline break-all"
      >
        {part}
      </a>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function formatTime(value?: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function LearnerChatPage() {
  const { user } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<{ id: string; partner: Conversation['partner'] } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'chats' | 'partners'>('chats');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const loadLists = useCallback(async () => {
    try {
      const [partnersRes, conversationsRes] = await Promise.all([
        api.get<Partner[]>('/chat/partners'),
        api.get<Conversation[]>('/chat/conversations'),
      ]);
      setPartners(partnersRes.data);
      setConversations(conversationsRes.data);
      setError('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not load chats.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  useEffect(() => {
    if (!active?.id) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const res = await api.get<ChatMessage[]>(`/chat/conversations/${active.id}/messages`);
        if (!cancelled) setMessages(res.data);
      } catch (err: any) {
        if (!cancelled) setError(err?.response?.data?.message || 'Could not load messages.');
      }
    };
    load();
    const timer = setInterval(load, 4000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [active?.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, active?.id]);

  const selectConversation = (conversation: Conversation) => {
    setActive({ id: conversation.id, partner: conversation.partner });
    setError('');
  };

  const startWithPartner = async (partner: Partner) => {
    setError('');
    if (partner.conversationId) {
      setActive({
        id: partner.conversationId,
        partner: { id: partner.id, name: partner.name, level: partner.level },
      });
      return;
    }
    try {
      const res = await api.post<Conversation>('/chat/conversations', { userId: partner.id });
      setActive({ id: res.data.id, partner: res.data.partner });
      setConversations((prev) => [res.data, ...prev.filter((item) => item.id !== res.data.id)]);
      setPartners((prev) =>
        prev.map((item) =>
          item.id === partner.id ? { ...item, conversationId: res.data.id } : item,
        ),
      );
      setTab('chats');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not start this chat.');
    }
  };

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !active || sending) return;
    setSending(true);
    setError('');
    try {
      const res = await api.post<ChatMessage>(
        `/chat/conversations/${active.id}/messages`,
        { body },
      );
      setMessages((prev) => (prev.some((item) => item.id === res.data.id) ? prev : [...prev, res.data]));
      setDraft('');
      setConversations((prev) =>
        prev.map((item) =>
          item.id === active.id
            ? {
              ...item,
              lastMessage: res.data.kind === 'meeting_link' ? 'Meeting link shared' : body,
              lastMessageAt: new Date().toISOString(),
            }
            : item,
        ),
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not send this message.');
    } finally {
      setSending(false);
    }
  };

  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="w-full max-w-none font-[Plus_Jakarta_Sans]">

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-4 mb-24 grid h-[62vh] min-h-[420px] overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-xs md:mb-0 md:h-[70vh] md:min-h-[520px] md:grid-cols-[320px_1fr]">
        <div
          className={`${active ? 'hidden md:flex' : 'flex'} min-h-0 flex-col border-r border-emerald-100`}
        >
          <div className="flex gap-1 border-b border-emerald-100 p-2">
            <button
              type="button"
              onClick={() => setTab('chats')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-black transition-colors ${tab === 'chats' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-emerald-50'
                }`}
            >
              Chats
            </button>
            <button
              type="button"
              onClick={() => setTab('partners')}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-black transition-colors ${tab === 'partners' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-emerald-50'
                }`}
            >
              Find partner
            </button>
          </div>

          {tab === 'partners' && (
            <div className="border-b border-emerald-100 p-2">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-[#f8faf9] px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search learners"
                  className="w-full bg-transparent text-sm font-semibold text-gray-700 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : tab === 'chats' ? (
              conversations.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                  <MessageCircle className="w-8 h-8 text-emerald-300" />
                  <p className="text-sm font-semibold text-gray-500">
                    No chats yet. Find a higher level learner to start.
                  </p>
                  <button
                    type="button"
                    onClick={() => setTab('partners')}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-black text-white hover:bg-emerald-700"
                  >
                    Find a partner
                  </button>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => selectConversation(conversation)}
                    className={`mb-1 flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors ${active?.id === conversation.id ? 'bg-emerald-50' : 'hover:bg-[#f8faf9]'
                      }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                      {conversation.partner.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-black text-gray-800">
                          {conversation.partner.name}
                        </span>
                        <LevelBadge level={conversation.partner.level} />
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-medium text-gray-500">
                        {conversation.lastMessage || 'Say hello'}
                      </span>
                    </span>
                  </button>
                ))
              )
            ) : filteredPartners.length === 0 ? (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm font-semibold text-gray-500">
                No higher level learners found yet.
              </div>
            ) : (
              filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="mb-1 flex items-center gap-3 rounded-2xl p-2.5 hover:bg-[#f8faf9]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">
                    {partner.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-black text-gray-800">
                        {partner.name}
                      </span>
                      <LevelBadge level={partner.level} />
                    </span>
                    <span className="mt-0.5 block text-xs font-medium text-gray-500">
                      Higher level partner
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => startWithPartner(partner)}
                    className="shrink-0 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white hover:bg-emerald-700"
                  >
                    Chat
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${active ? 'flex' : 'hidden md:flex'} min-h-0 flex-col`}>
          {active ? (
            <>
              <div className="flex items-center gap-3 border-b border-emerald-100 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-xl p-1.5 text-gray-500 hover:bg-emerald-50 md:hidden"
                  aria-label="Back to chats"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-black text-white">
                  {active.partner.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm sm:text-base font-black text-gray-800">
                    {active.partner.name}
                  </p>
                  <p className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    Level <LevelBadge level={active.partner.level} />
                  </p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto bg-[#f8faf9] p-3 sm:p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                    <MessageCircle className="w-8 h-8 text-emerald-300" />
                    <p className="text-sm font-semibold text-gray-500">
                      Start the conversation. Share a meeting link when you want to practise live.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.mine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm font-medium shadow-xs sm:max-w-[70%] ${message.mine
                          ? 'rounded-br-md bg-emerald-600 text-white'
                          : 'rounded-bl-md border border-emerald-100 bg-white text-gray-800'
                          }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{renderText(message.body)}</p>
                        {message.kind === 'meeting_link' && message.meetingUrl && (
                          <a
                            href={message.meetingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-black underline-offset-2 hover:underline"
                          >
                            <Video className="w-4 h-4" />
                            Join meeting
                          </a>
                        )}
                        <p
                          className={`mt-1 text-[10px] font-bold ${message.mine ? 'text-emerald-100/80' : 'text-gray-400'
                            }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="border-t border-emerald-100 p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    maxLength={1000}
                    placeholder="Write a message or paste a Google Meet / Zoom / Teams link"
                    className="w-full rounded-xl border border-emerald-100 bg-[#f8faf9] px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>

              </form>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <MessageCircle className="w-7 h-7 text-emerald-600" />
              </span>
              <p className="text-base font-black text-gray-700">Pick a learner to start chatting</p>
              <p className="max-w-sm text-sm font-medium text-gray-500">
                You can chat with learners who are at a higher level. Share a meeting link to
                practise together live.
              </p>
              <button
                type="button"
                onClick={() => setTab('partners')}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white hover:bg-emerald-700 md:hidden"
              >
                Find a partner
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
