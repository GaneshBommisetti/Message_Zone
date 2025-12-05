import { useEffect, useState, useRef } from 'react';
import { Circle, Check, Clock, Send, X, Search } from 'lucide-react';
import { Drawer } from '../../components/Drawer';

type Issue = {
  id: string;
  title: string;
  description?: string;
};

type Topic = {
  id: string;
  title: string;
  issues: Issue[];
  description?: string;
  priority?: 'Low' | 'Medium' | 'High';
  sla?: string;
};

type Message = {
  id: string;
  from: 'vendor' | 'admin';
  text: string;
  time: string;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
  attachments?: string[];
};

const SUPPORT_TOPICS: Topic[] = [
  {
    id: 'tech',
    title: 'Technical & Integration Support',
    description: 'Issues related to APIs, integration, and developer setup.',
    priority: 'High',
    sla: 'Response: 4 hrs',
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
    description: 'Delivery routes, reporting and SLA questions.',
    priority: 'Medium',
    sla: 'Response: 12 hrs',
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
    description: 'Security, compliance and access control questions.',
    priority: 'High',
    sla: 'Response: 6 hrs',
    issues: [
      { id: 'encryption', title: 'Data encryption & compliance' },
      { id: 'gdpr', title: 'ISO / TRAI / GDPR documentation' },
      { id: 'ip', title: 'IP Whitelisting' },
    ],
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Performance',
    description: 'Monitoring, dashboards and alerting related topics.',
    priority: 'Low',
    sla: 'Response: 24 hrs',
    issues: [
      { id: 'dashboard', title: 'Live traffic monitoring dashboard' },
      { id: 'reports', title: 'Delivery performance reports' },
      { id: 'alerts', title: 'Auto-alerting for failures' },
    ],
  },
  {
    id: 'payments',
    title: 'Payment & Commercial Support',
    description: 'Billing, invoices and payment related questions.',
    priority: 'Medium',
    sla: 'Response: 24 hrs',
    issues: [
      { id: 'rates', title: 'Rate sheet and billing details' },
      { id: 'wallet', title: 'Wallet / Balance alerts' },
      { id: 'invoices', title: 'Invoice cycle & credit facility' },
    ],
  },
  {
    id: 'onboarding',
    title: 'Onboarding & Setup',
    description: 'Getting started guides and account setup help.',
    priority: 'Low',
    sla: 'Response: 48 hrs',
    issues: [
      { id: 'getting-started', title: 'Getting started checklist' },
      { id: 'credentials', title: 'API credentials & access' },
    ],
  },
  {
    id: 'account',
    title: 'Account & Billing',
    description: 'Plan changes, invoices and account-level settings.',
    priority: 'Medium',
    sla: 'Response: 24 hrs',
    issues: [
      { id: 'invoices', title: 'Invoices and billing cycles' },
      { id: 'plan', title: 'Upgrade / Downgrade plans' },
    ],
  },
];

const STORAGE_KEY = 'support_conversations_v1';
const UNREAD_KEY = 'support_unread_v1';

function readConversations(): Record<string, { topic?: string; issueId?: string; messages: any[]; resolved?: boolean; resolvedBy?: string; resolvedAt?: string; status?: string }> {
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
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  // require explicit issue click to open the chat panel
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [highlightedTicket, setHighlightedTicket] = useState<string | null>(null);
  // derived helpers
  const filteredTopics = SUPPORT_TOPICS.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (t.title.toLowerCase().includes(q)) return true;
    return t.issues.some((iss) => iss.title.toLowerCase().includes(q) || iss.id.toLowerCase().includes(q));
  });

  function handleSearchClick() {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) {
      // focus input if empty
      try { searchRef.current?.focus(); } catch {}
      return;
    }
    // try match topic title or id
    const topicMatch = SUPPORT_TOPICS.find((t) => t.title.toLowerCase().includes(q) || t.id.toLowerCase() === q);
    if (topicMatch) {
      setActiveTopic(topicMatch.id);
      return;
    }
    // try find an issue match across topics
    for (const t of SUPPORT_TOPICS) {
      const iss = t.issues.find((i) => i.title.toLowerCase().includes(q) || i.id.toLowerCase() === q);
      if (iss) {
        setActiveTopic(t.id);
        setActiveIssue(iss);
        // load messages for this issue
        const convs = readConversations();
        const conv = convs[iss.id];
        if (conv && conv.messages) setMessages(conv.messages);
        // dispatch open event so admin can also view
        try { window.dispatchEvent(new CustomEvent('support-open', { detail: { issueId: iss.id, topic: t.id, conversation: conv } })); } catch {}
        return;
      }
    }
    // no match found: keep focus so user can refine
    try { searchRef.current?.focus(); } catch {}
  }
  

  // utility: list stored conversations as an array for table rendering
  function listConversations() {
    const convs = readConversations();
    return Object.keys(convs).map((k) => ({ id: k, ...(convs[k] || {}) }));
  }

  // list only conversations that include vendor messages (i.e. belong to this vendor)
  function listMyConversations() {
    try {
      return listConversations().filter((c) => Array.isArray(c.messages) && c.messages.some((m: any) => m.from === 'vendor'));
    } catch {
      return [];
    }
  }

  // open a ticket from the tickets table -> set UI and dispatch event for admin panel
  function openTicketFromTable(issueId: string) {
    const convs = readConversations();
    const conv = convs[issueId];
    // find the Issue object from SUPPORT_TOPICS
    let foundTopic = conv?.topic || activeTopic;
    const topicObj = SUPPORT_TOPICS.find((t) => t.id === foundTopic) || SUPPORT_TOPICS[0];
    const issueObj = topicObj.issues.find((i) => i.id === issueId) || { id: issueId, title: conv?.issueId || issueId } as Issue;

    setActiveTopic(topicObj.id);
    setActiveIssue(issueObj);

    // set messages into UI
    if (conv && conv.messages) setMessages(conv.messages);

    // dispatch event so admin dashboard/notification menu can open same details
    try {
      // include notification-like metadata so admin drawer can render full details
      const meta = {
        subscriber: issueObj.title,
        mobileNumber: conv && conv.messages && conv.messages.length && conv.messages[0].from === 'vendor' ? 'Vendor' : (conv && (conv as any).mobileNumber) || '-',
        country: (conv as any)?.country || '-',
        category: SUPPORT_TOPICS.find(t => t.id === topicObj.id)?.title || topicObj.id,
        receivedDate: new Date().toISOString(),
        guid: (conv as any)?.guid || `ticket-${issueId}`,
        sentDate: (conv as any)?.sentDate || null,
        segments: (conv as any)?.segments || '-',
        messageCode: (conv as any)?.messageCode || '-',
        content: conv && conv.messages && conv.messages.length ? conv.messages[conv.messages.length - 1].text : issueObj.title,
        status: conv?.resolved ? 'Resolved' : 'Open',
        channel: (conv as any)?.channel || 'sms'
      };
      window.dispatchEvent(new CustomEvent('support-open', { detail: { issueId, topic: topicObj.id, conversation: conv, meta } }));
    } catch {}
  }

  const SAMPLE_FAQS: Record<string, { q: string; a: string }[]> = {
    tech: [
      { q: 'How to get API key?', a: 'Go to Account → API keys and generate a key.' },
      { q: 'Webhook setup?', a: 'Read the webhook section in API docs; ensure callback URL is reachable.' },
    ],
    delivery: [
      { q: 'Why are messages delayed?', a: 'Check routability and any throttling on your account.' },
    ],
    onboarding: [
      { q: 'Getting started steps?', a: 'Follow the onboarding checklist in the docs.' },
    ],
  };

  

  // create a few sample tickets if storage is empty so vendors see example rows
  function ensureSampleTickets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const convs = raw ? JSON.parse(raw) : {};
      if (Object.keys(convs).length === 0) {
        const now = new Date().toISOString();
        const sample: Record<string, any> = {
          'tkt-001': {
            topic: 'tech',
            issueId: 'api-docs',
            resolved: false,
            status: 'In Progress',
            messages: [
              { id: 'm1', from: 'vendor', text: 'API docs missing endpoint for webhook.', time: now },
              { id: 'a1', from: 'admin', text: 'Thanks — we will update the docs.', time: now }
            ],
            meta: { subscriber: 'Acme Corporation', category: 'Technical', customerId: 'cust-1' }
          },
          'tkt-002': {
            topic: 'delivery',
            issueId: 'routes',
            resolved: true,
            status: 'Resolved',
            messages: [
              { id: 'm2', from: 'vendor', text: 'Delivery delay in EU routes.', time: now },
              { id: 'a2', from: 'admin', text: 'We fixed routing for EU; please retry.', time: now }
            ],
            meta: { subscriber: 'StartupX', category: 'Delivery', customerId: 'cust-2' }
          },
          'tkt-003': {
            topic: 'security',
            issueId: 'ip',
            resolved: false,
            status: 'Open',
            messages: [
              { id: 'm3', from: 'vendor', text: 'How do we add IP whitelisting?', time: now }
            ],
            meta: { subscriber: 'RetailPro Ltd', category: 'Security', customerId: 'cust-3' }
          }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
      }
    } catch {}
  }

    function closeTicket(id: string) {
      try {
        const convs = readConversations();
        if (!convs[id]) return;
        convs[id].resolved = true;
        convs[id].resolvedBy = 'vendor';
        convs[id].resolvedAt = new Date().toISOString();
        writeConversations(convs);
        try { window.dispatchEvent(new CustomEvent('support-updated')); } catch {}
        // if the currently opened issue matches, update UI
        if (activeIssue && activeIssue.id === id) {
          // trigger reload of messages (useEffect on activeIssue will fetch persisted messages)
          const conv = convs[id];
          if (conv && conv.messages) setMessages(conv.messages);
        }
      } catch {}
    }

  useEffect(() => {
    // ensure there are sample tickets for demo/testing
    ensureSampleTickets();
    // load messages from storage for the selected issue
    if (!activeIssue) {
      setMessages([]);
      return;
    }
    const convs = readConversations();
    const key = activeIssue.id;
    if (convs[key] && convs[key].messages) {
      setMessages(convs[key].messages);
    } else {
      const welcome = { id: 'm1', from: 'admin' as Message['from'], text: `Topic: ${activeTopic} — open conversation for ${activeIssue?.title}`, time: new Date().toLocaleTimeString(), status: 'delivered' as Message['status'] };
      setMessages([welcome]);
      // persist initial welcome so admin can see it
      convs[key] = { topic: activeTopic || undefined, issueId: key, messages: [welcome] };
      writeConversations(convs);
      
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
      const next = [...m, { ...msg, attachments: attachments.map((f) => f.name) }];
      // persist (preserve metadata)
      if (activeIssue) {
        const convs = readConversations();
        convs[activeIssue.id] = { ...(convs[activeIssue.id] || {}), topic: activeTopic || undefined, issueId: activeIssue.id, messages: next };
        writeConversations(convs);
        // NOTE: do not clear activeTopic here — keep the issue context so sending works reliably
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
          // highlight this ticket in the tickets list briefly
          try { setHighlightedTicket(activeIssue?.id || null); setTimeout(() => setHighlightedTicket(null), 6000); } catch {}
          return next;
    });
    setInput('');
    // clear attachments after send
    try { setAttachments([]); } catch {}
    // do NOT auto-close the issue after send — keep Drawer open until user clicks the top close icon

    // simulate sending progress then delivered
    setTimeout(() => {
      setMessages((m) => {
        const next = m.map((mm) => (mm.id === id ? { ...mm, status: 'sent' as Message['status'] } : mm));
        if (activeIssue) {
          const convs = readConversations();
          convs[activeIssue.id] = { ...(convs[activeIssue.id] || {}), topic: activeTopic || undefined, issueId: activeIssue.id, messages: next };
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
          convs[activeIssue.id] = { ...(convs[activeIssue.id] || {}), topic: activeTopic || undefined, issueId: activeIssue.id, messages: next };
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
          convs[activeIssue.id] = { topic: activeTopic || undefined, issueId: activeIssue.id, messages: next };
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
    // mark local UI resolved state (UI reads persisted conversation resolved flag)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Support</h1>
          <p className="text-sm text-slate-600">Choose a topic and open an issue to start a conversation with Admin support.</p>
        </div>
        {/* <div className="text-sm text-slate-500 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <span>Live support</span>
        </div> */}
      </div>

      {/* Breadcrumb */}
      <div className="text-xs text-slate-500 mb-4">Home &gt; Support{activeTopic ? ` > ${SUPPORT_TOPICS.find(t => t.id === activeTopic)?.title}` : ''}{activeIssue ? ` > ${activeIssue.title}` : ''}</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: topic list */}
        <aside className="col-span-1 bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Support Topics</h3>
          
          <div className="space-y-2">
            {filteredTopics.map((t) => (
              <div key={t.id} className="flex items-center gap-2">
                <button
                  onClick={() => { setActiveTopic(t.id); /* do not auto-open issue */ }}
                  className={`flex-1 text-left px-3 py-2 rounded ${t.id === activeTopic ? 'bg-slate-100 font-medium' : 'hover:bg-slate-50'}`}
                  title={t.description || ''}
                >
                  <div className="flex items-center justify-between">
                    <span>{t.title}</span>
                    <span className="text-[11px] text-slate-400 ml-2">{t.sla ? t.sla : ''}</span>
                  </div>
                </button>
                <div className="text-xs text-slate-400 px-1" title={t.description || ''}>i</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Middle: tickets table + issues list for selected topic */}
        <div className="col-span-1 lg:col-span-2 bg-white rounded-lg border p-4 shadow-sm">
          <div>
            {!activeTopic ? (
              <>
                <h3 className="text-sm font-semibold mb-3">Tickets</h3>
                <div className="max-h-[40vh] overflow-y-auto mb-3">
                  {/* split vendor's tickets into Open and Resolved for clarity */}
                  {(() => {
                    const my = listMyConversations();
                    if (my.length === 0) return <div className="text-xs text-slate-500">No tickets yet</div>;
                    return (
                      <div>
                        <div className="text-xs font-semibold text-slate-700 mb-2">Your Tickets</div>
                        <div className="max-h-[40vh] overflow-y-auto mb-3">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-xs text-slate-500">
                                <th className="py-2">Date</th>
                                <th className="py-2">Support Topic</th>
                                <th className="py-2">Issue</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Close</th>
                              </tr>
                            </thead>
                            <tbody>
                              {my.map((conv) => {
                                const topicTitle = SUPPORT_TOPICS.find((t) => t.id === conv.topic)?.title || conv.topic || 'Unknown';
                                let issueTitle = 'Unknown';
                                const topicObj = SUPPORT_TOPICS.find((t) => t.id === conv.topic);
                                if (topicObj) {
                                  const found = topicObj.issues.find((i) => i.id === conv.issueId || i.id === conv.id);
                                  if (found) issueTitle = found.title;
                                } else {
                                  for (const t of SUPPORT_TOPICS) {
                                    const found = t.issues.find((i) => i.id === conv.issueId || i.id === conv.id);
                                    if (found) { issueTitle = found.title; break; }
                                  }
                                }
                                const dateStr = conv && conv.messages && conv.messages.length ? new Date(conv.messages[0].time).toLocaleString() : '-';
                                const isHighlighted = highlightedTicket === conv.id;
                                return (
                                  <tr key={conv.id} className={`cursor-pointer hover:bg-slate-50 ${isHighlighted ? 'bg-yellow-50 border-l-4 border-yellow-300' : ''}`} onClick={() => openTicketFromTable(conv.id)}>
                                    <td className="py-2 text-xs text-slate-700">{dateStr}</td>
                                    <td className="py-2 text-xs text-slate-600">{topicTitle}</td>
                                    <td className="py-2 text-xs text-slate-700">{issueTitle}</td>
                                    <td className="py-2 text-xs">
                                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${conv.resolved ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{conv.resolved ? 'Resolved' : 'Open'}</span>
                                    </td>
                                    <td className="py-2 text-xs">
                                      {!conv.resolved ? (
                                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Close this ticket?')) closeTicket(conv.id); }} title="Close ticket" className="p-1 rounded hover:bg-slate-100">
                                          <X className="w-4 h-4 text-rose-600" />
                                        </button>
                                      ) : (
                                        <span className="text-xs text-slate-400">&nbsp;</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold mb-3">Issues</h3>
                {/* FAQ suggestions for selected topic */}
                <div className="mb-3">
                  <div className="text-xs text-slate-600 font-medium mb-1">Suggested FAQs</div>
                  <div className="space-y-2">
                    {(SAMPLE_FAQS[activeTopic || ''] || []).map((f, idx) => (
                      <div key={idx} className="p-2 border rounded bg-slate-50">
                        <div className="text-sm font-medium">{f.q}</div>
                        <div className="text-xs text-slate-500">{f.a}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                  {(SUPPORT_TOPICS.find((s) => s.id === activeTopic)?.issues || []).map((iss) => (
                    <div key={iss.id} className={`p-3 rounded border ${activeIssue?.id === iss.id ? 'border-slate-300 bg-slate-50' : 'border-transparent hover:border-slate-100'}`}>
                      <button className="w-full text-left" onClick={() => { setActiveIssue(iss); try { window.dispatchEvent(new CustomEvent('support-open', { detail: { issueId: iss.id, topic: activeTopic, conversation: readConversations()[iss.id] } })); } catch {} }}>
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
              </>
            )}
          </div>
        </div>

        {/* Conversation Drawer: opens when an issue is selected (popup on the right) */}
        {/* Reuse the shared Drawer component so behavior matches admin notification details */}
        <div className="col-span-1 lg:col-span-2" aria-hidden>
          {/* empty placeholder to keep grid layout; actual conversation lives in the Drawer below */}
        </div>

        {/* Popup Drawer */}
        <Drawer isOpen={activeIssue !== null} onClose={() => { setActiveIssue(null); setActiveTopic(null); }} title={activeIssue ? `Conversation - ${activeIssue.title}` : 'Conversation'}>
          {activeIssue ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-lg font-semibold">{activeIssue.title}</div>
                  <div className="text-xs text-slate-500">{activeIssue.id} • {SUPPORT_TOPICS.find(t => t.id === activeTopic)?.title}</div>
                </div>
                <div className="flex items-center gap-3">
                  {(() => {
                    const conv = readConversations()[activeIssue.id] || {};
                    const curStatus = conv.status || (conv.resolved ? 'Resolved' : 'Open');
                    return (
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-slate-500">Status: <span className="font-medium text-slate-700">{curStatus}</span></div>
                        <button onClick={() => { if (window.confirm('Mark this issue as resolved?')) { resolveIssue(); } }} className="text-xs px-3 py-1 bg-rose-600 text-white rounded">Resolve</button>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {/* Status timeline */}
                {/* status timeline removed per request */}

                {/* Previous tickets for this topic */}
                {/* {(() => {
                  const prev = listMyConversations().filter((c) => c.topic === activeTopic && c.id !== activeIssue?.id);
                  if (prev.length > 0) {
                    return (
                      <div className="mb-3">
                        <div className="text-xs font-medium text-slate-700 mb-2">Previous tickets</div>
                        <div className="space-y-2">
                          {prev.map((p) => (
                            <div key={p.id} className="text-xs text-slate-600 p-2 border rounded bg-white">{p.id} • {p.messages && p.messages.length ? new Date(p.messages[0].time).toLocaleString() : '-'} • {p.messages && p.messages[p.messages.length-1] && p.messages[p.messages.length-1].text.slice(0, 80)}</div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()} */}

                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === 'vendor' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${m.from === 'vendor' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'} rounded-lg p-3 max-w-[70%]`}> 
                      <div className="text-sm">{m.text}</div>
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mt-2 text-xs">
                          <div className="font-medium">Attachments</div>
                          <ul className="list-disc ml-4">
                            {m.attachments.map((a, i) => <li key={i} className="text-xs text-slate-200">{a}</li>)}
                          </ul>
                        </div>
                      )}
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
                <div className="flex-1">
                  <div
                    onDrop={(e) => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer?.files || []);
                      if (files.length) setAttachments((s) => [...s, ...files]);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className="mb-2 p-2 border-dashed border rounded text-xs text-slate-500"
                  >
                    Drop files here or <label className="text-blue-600 underline cursor-pointer"><input type="file" className="hidden" onChange={(ev) => { const fs = Array.from((ev.target as HTMLInputElement).files || []); if (fs.length) setAttachments((s) => [...s, ...fs]); }} multiple />Browse</label>
                    {attachments.length > 0 && (
                      <div className="mt-2 text-xs text-slate-700">
                        <div className="font-medium">Attached files</div>
                        <ul className="list-disc ml-5">
                          {attachments.map((f, i) => (
                            <li key={i} className="flex items-center justify-between">
                              <span>{f.name}</span>
                              <button onClick={(e) => { e.stopPropagation(); setAttachments((s) => s.filter((_, idx) => idx !== i)); }} className="text-rose-600 text-xs">Remove</button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
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
          ) : (
            <div className="text-sm text-slate-500">No issue selected</div>
          )}
        </Drawer>
      </div>
    </div>
  );
}
