import { useEffect, useState } from 'react';
import { MessageSquare, Circle, Check, Clock, Send } from 'lucide-react';

type Issue = {
  id: string;
  title: string;
  description?: string;
};

type Topic = {
  id: string;
  title: string;
  issues: Issue[];
};

type Message = {
  id: string;
  from: 'vendor' | 'admin';
  text: string;
  time: string;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
};

const SUPPORT_TOPICS: Topic[] = [
  {
    id: 'tech',
    title: 'Technical & Integration Support',
    issues: [
      { id: 'api-docs', title: 'API Documentation (Clear & Updated)' },
      { id: 'sample-req', title: 'Sample API Requests & Responses' },
      { id: 'auth', title: 'API Authentication Methods' },
      { id: 'integration', title: 'SMPP / HTTP / REST integration support' },
      { id: 'retry', title: 'Retry logic & throttling guidance' },
    ],
  },
  {
    id: 'delivery',
    title: 'Message Delivery Support',
    issues: [
      { id: 'routes', title: 'Delivery Routes (Transactional & Promotional)' },
      { id: 'dlt', title: 'DLT compliant delivery support' },
      { id: 'sla', title: 'Delivery SLA & performance' },
      { id: 'reports', title: 'Delivery report / realtime status' },
    ],
  },
  {
    id: 'security',
    title: 'Security & Compliance Support',
    issues: [
      { id: 'encryption', title: 'Data encryption & compliance' },
      { id: 'gdpr', title: 'ISO / TRAI / GDPR documentation' },
      { id: 'ip', title: 'IP Whitelisting' },
    ],
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Performance',
    issues: [
      { id: 'dashboard', title: 'Live traffic monitoring dashboard' },
      { id: 'reports', title: 'Delivery performance reports' },
      { id: 'alerts', title: 'Auto-alerting for failures' },
    ],
  },
  {
    id: 'payments',
    title: 'Payment & Commercial Support',
    issues: [
      { id: 'rates', title: 'Rate sheet and billing details' },
      { id: 'wallet', title: 'Wallet / Balance alerts' },
      { id: 'invoices', title: 'Invoice cycle & credit facility' },
    ],
  },
];

const STORAGE_KEY = 'support_conversations_v1';
const UNREAD_KEY = 'support_unread_v1';

function readConversations(): Record<string, { topic?: string; issueId?: string; messages: any[]; resolved?: boolean; resolvedBy?: string; resolvedAt?: string }> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeConversations(obj: Record<string, any>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch {}
}

function readUnreadMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(UNREAD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUnreadMap(m: Record<string, number>) {
  try {
    localStorage.setItem(UNREAD_KEY, JSON.stringify(m));
  } catch {}
}

export default function Support() {
  const [activeTopic, setActiveTopic] = useState<string>(SUPPORT_TOPICS[0].id);
  // require explicit issue click to open the chat panel
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [convResolved, setConvResolved] = useState(false);

  useEffect(() => {
    // load messages from storage for the selected issue
    if (!activeIssue) {
      setMessages([]);
      setConvResolved(false);
      return;
    }
    const convs = readConversations();
    const key = activeIssue.id;
    if (convs[key] && convs[key].messages) {
      setMessages(convs[key].messages);
      setConvResolved(!!convs[key].resolved);
    } else {
      const welcome = { id: 'm1', from: 'admin' as Message['from'], text: `Topic: ${activeTopic} — open conversation for ${activeIssue?.title}`, time: new Date().toLocaleTimeString(), status: 'delivered' as Message['status'] };
      setMessages([welcome]);
      // persist initial welcome so admin can see it
      convs[key] = { topic: activeTopic, issueId: key, messages: [welcome] };
      writeConversations(convs);
      setConvResolved(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIssue]);

  function sendMessage() {
    if (!input.trim()) return;
    // prevent sending to resolved conversation
    if (activeIssue) {
      const conv = readConversations()[activeIssue.id];
      if (conv && conv.resolved) return;
    }
    const id = 'm_' + Math.random().toString(36).slice(2, 9);
    const msg: Message = { id, from: 'vendor' as Message['from'], text: input.trim(), time: new Date().toLocaleTimeString(), status: 'sending' as Message['status'] };
    setMessages((m) => {
      const next = [...m, msg];
      // persist (preserve metadata)
      if (activeIssue) {
        const convs = readConversations();
        convs[activeIssue.id] = { ...(convs[activeIssue.id] || {}), topic: activeTopic, issueId: activeIssue.id, messages: next };
        writeConversations(convs);
          // increment unread counter for admin
          try {
            const raw = localStorage.getItem(UNREAD_KEY);
            const unread = raw ? JSON.parse(raw) : {};
            unread[activeIssue.id] = (unread[activeIssue.id] || 0) + 1;
            localStorage.setItem(UNREAD_KEY, JSON.stringify(unread));
            // attempt to notify via Notification API
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification('New vendor support message', { body: `${activeIssue.title}: ${msg.text.slice(0, 100)}` });
            }
          } catch {}
      }
              // notify other parts of the app
              try { window.dispatchEvent(new CustomEvent('support-updated')); } catch {}
          return next;
    });
    setInput('');

    // simulate sending progress then delivered
    setTimeout(() => {
      setMessages((m) => {
        const next = m.map((mm) => (mm.id === id ? { ...mm, status: 'sent' as Message['status'] } : mm));
        if (activeIssue) {
          const convs = readConversations();
          convs[activeIssue.id] = { ...(convs[activeIssue.id] || {}), topic: activeTopic, issueId: activeIssue.id, messages: next };
          writeConversations(convs);
            try { window.dispatchEvent(new CustomEvent('support-updated')); } catch {}
        }
        return next;
      });
    }, 800);
    setTimeout(() => {
      setMessages((m) => {
        const next = m.map((mm) => (mm.id === id ? { ...mm, status: 'delivered' as Message['status'] } : mm));
        if (activeIssue) {
          const convs = readConversations();
          convs[activeIssue.id] = { ...(convs[activeIssue.id] || {}), topic: activeTopic, issueId: activeIssue.id, messages: next };
          writeConversations(convs);
            try { window.dispatchEvent(new CustomEvent('support-updated')); } catch {}
        }
        return next;
      });
    }, 1800);
    // admin auto-reply mock
    setTimeout(() => {
      const aid = 'a_' + Math.random().toString(36).slice(2, 9);
      setMessages((m) => {
        const next = [...m, { id: aid, from: 'admin' as Message['from'], text: 'Thanks — we are looking into this and will update you shortly.', time: new Date().toLocaleTimeString(), status: 'delivered' as Message['status'] }];
        if (activeIssue) {
          const convs = readConversations();
          convs[activeIssue.id] = { topic: activeTopic, issueId: activeIssue.id, messages: next };
          writeConversations(convs);
            try { window.dispatchEvent(new CustomEvent('support-updated')); } catch {}
        }
        return next;
      });
    }, 2400);
  }

  function resolveIssue() {
    if (!activeIssue) return;
    try {
      const convs = readConversations();
      const key = activeIssue.id;
      const cur = convs[key] || { topic: activeTopic, issueId: key, messages: messages };
      cur.resolved = true;
      cur.resolvedBy = 'vendor';
      cur.resolvedAt = new Date().toISOString();
      convs[key] = cur;
      writeConversations(convs);
    } catch {}
    try {
      const unread = readUnreadMap();
      if (unread[activeIssue.id]) {
        delete unread[activeIssue.id];
        writeUnreadMap(unread);
      }
    } catch {}
    try { window.dispatchEvent(new CustomEvent('support-updated')); } catch {}
    // mark local UI resolved state
    setConvResolved(true);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support</h1>
          <p className="text-sm text-slate-600">Choose a topic and open an issue to start a conversation with Admin support.</p>
        </div>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <span>Live support</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: topic list */}
        <aside className="col-span-1 bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Support Topics</h3>
          <div className="space-y-2">
            {SUPPORT_TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setActiveTopic(t.id); setActiveIssue(t.issues[0]); }}
                className={`w-full text-left px-3 py-2 rounded ${t.id === activeTopic ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50'}`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Middle: issues list */}
        <div className="col-span-1 lg:col-span-1 bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Issues</h3>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {SUPPORT_TOPICS.find((s) => s.id === activeTopic)?.issues.map((iss) => (
              <div key={iss.id} className={`p-3 rounded border ${activeIssue?.id === iss.id ? 'border-slate-300 bg-slate-50' : 'border-transparent hover:border-slate-100'}`}>
                <button className="w-full text-left" onClick={() => setActiveIssue(iss)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{iss.title}</div>
                      {iss.description && <div className="text-xs text-slate-500">{iss.description}</div>}
                    </div>
                    <div className="text-xs text-slate-400">{iss.id}</div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: conversation panel (wide) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-semibold">{activeIssue?.title}</div>
                <div className="text-xs text-slate-500">{activeIssue?.id} • {SUPPORT_TOPICS.find(t => t.id === activeTopic)?.title}</div>
            </div>
                      <div className="flex items-center gap-3">
                        {activeIssue && readConversations()[activeIssue.id]?.resolved ? (
                          <div className="text-xs text-emerald-700">Resolved</div>
                        ) : (
                          <div className="text-xs text-slate-500">Status: <span className="font-medium text-slate-700">Open</span></div>
                        )}
                        <button onClick={() => resolveIssue()} className="text-xs px-3 py-1 bg-rose-600 text-white rounded">Resolve</button>
                      </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[56vh] pr-2">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`${m.from === 'vendor' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'} rounded-lg p-3 max-w-[70%]`}> 
                  <div className="text-sm">{m.text}</div>
                  <div className="mt-2 flex items-center gap-2 text-[11px] opacity-80">
                    <span>{m.time}</span>
                    {m.from === 'vendor' && (
                      <span className="flex items-center gap-1">
                        {m.status === 'sending' && <Clock className="w-3 h-3" />}
                        {m.status === 'sent' && <Check className="w-3 h-3" />}
                        {m.status === 'delivered' && <Circle className="w-3 h-3" />}
                        {m.status === 'failed' && <span className="text-red-500">!</span>}
                        <span className="ml-1">{m.status}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Write a message to support..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button onClick={sendMessage} aria-label="Send message" className="p-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
