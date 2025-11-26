import { useEffect, useState } from 'react';
import { MessageSquare, Check, Circle } from 'lucide-react';

type Message = {
  id: string;
  from: 'vendor' | 'admin';
  text: string;
  time: string;
  status?: 'sending' | 'sent' | 'delivered' | 'failed';
};

const STORAGE_KEY = 'support_conversations_v1';
const UNREAD_KEY = 'support_unread_v1';

function readConversations(): Record<string, { topic?: string; issueId?: string; messages: Message[] }> {
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

function readUnread(): Record<string, number> {
  try {
    const raw = localStorage.getItem(UNREAD_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeUnread(u: Record<string, number>) {
  try { localStorage.setItem(UNREAD_KEY, JSON.stringify(u)); } catch {}
}

export function VendorSupportAdmin() {
  const [convs, setConvs] = useState<Record<string, { topic?: string; issueId?: string; messages: Message[] }>>(() => readConversations());
  const [selected, setSelected] = useState<string | null>(null);
  const [input, setInput] = useState('');

  // keep unread map in state so UI can show badges
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>(() => readUnread());

  useEffect(() => {
    setConvs(readConversations());
    setUnreadMap(readUnread());
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY || e.key === UNREAD_KEY) {
        setConvs(readConversations());
        setUnreadMap(readUnread());
      }
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // cleanup listener for custom event
  useEffect(() => {
    function onSupportUpdated() { setConvs(readConversations()); setUnreadMap(readUnread()); }
    window.addEventListener('support-updated', onSupportUpdated as EventListener);
    return () => window.removeEventListener('support-updated', onSupportUpdated as EventListener);
  }, []);

  function selectConv(key: string) {
    setSelected(key);
    // reload to get latest
    setConvs(readConversations());
    // clear unread for this convo
    const u = readUnread();
    if (u[key]) { delete u[key]; writeUnread(u); }
  }

  function resolveConv(key: string) {
    const all = { ...readConversations() };
    if (all[key]) {
      delete all[key];
      writeConversations(all);
      setConvs(all);
    }
    const u = readUnread();
    if (u[key]) { delete u[key]; writeUnread(u); setUnreadMap(readUnread()); }
    if (selected === key) setSelected(null);
  }

  function sendReply() {
    if (!selected || !input.trim()) return;
    const convsLocal = readConversations();
    const conv = convsLocal[selected] || { topic: '', issueId: selected, messages: [] };
    const id = 'a_' + Math.random().toString(36).slice(2, 9);
    const msg: Message = { id, from: 'admin' as Message['from'], text: input.trim(), time: new Date().toISOString(), status: 'delivered' as Message['status'] };
    conv.messages.push(msg);
    convsLocal[selected] = conv;
    writeConversations(convsLocal);
    setConvs(convsLocal);
    setInput('');
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vendor Support (Admin)</h1>
          <p className="text-sm text-slate-600">View vendor-submitted issues and reply directly.</p>
        </div>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-500" />
          <span>Conversations</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="col-span-1 bg-white rounded-lg border p-4 shadow-sm">
          <h3 className="text-sm font-semibold mb-3">Open Conversations</h3>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {Object.keys(convs).length === 0 && <div className="text-sm text-slate-500">No conversations yet</div>}
            {Object.entries(convs)
              .filter(([, c]) => (c.messages || []).some((m) => m.from === 'vendor'))
              .map(([k, c]) => {
                const lastVendor = (c.messages || []).slice().reverse().find((m) => m.from === 'vendor');
                return (
                  <div key={k} className={`w-full p-0`}> 
                    <button onClick={() => selectConv(k)} className={`w-full text-left p-3 rounded ${selected === k ? 'bg-slate-100' : 'hover:bg-slate-50'} flex items-center justify-between`}>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium text-slate-900">{lastVendor ? lastVendor.text.slice(0, 60) : c.topic || k}</div>
                        <div className="text-xs text-slate-500 mt-1">{c.topic}</div>
                      </div>
                      <div className="flex flex-col items-end ml-3">
                        <div className="text-xs text-slate-400">{lastVendor ? new Date(lastVendor.time).toLocaleString() : ''}</div>
                        {unreadMap[k] ? <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs">{unreadMap[k]}</div> : null}
                      </div>
                    </button>
                    <div className="flex justify-end -mt-3 mb-2 pr-2">
                      <button onClick={(e) => { e.stopPropagation(); resolveConv(k); }} className="text-xs px-2 py-0.5 bg-rose-50 text-rose-700 rounded">Clear</button>
                    </div>
                  </div>
                );
              })}
          </div>
        </aside>

        <div className="col-span-1 lg:col-span-3 bg-white rounded-lg border p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-semibold">{selected ?? 'Select a conversation'}</div>
            </div>
            <div className="text-xs text-slate-500">Admin panel</div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[64vh] pr-2">
            {selected ? (
              (convs[selected]?.messages ?? []).map((m) => (
                <div key={m.id} className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.from === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-900'} rounded-lg p-3 max-w-[70%]`}>
                    <div className="text-sm">{m.text}</div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] opacity-80">
                      <span>{new Date(m.time).toLocaleString()}</span>
                      {m.from === 'vendor' && (
                        <span className="flex items-center gap-1">
                          {m.status === 'sent' && <Check className="w-3 h-3" />}
                          {m.status === 'delivered' && <Circle className="w-3 h-3" />}
                          <span className="ml-1">{m.status}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500">No conversation selected</div>
            )}
          </div>

          <div className="pt-3 border-t flex items-center gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Reply to vendor..." className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
            <button onClick={sendReply} className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorSupportAdmin;
