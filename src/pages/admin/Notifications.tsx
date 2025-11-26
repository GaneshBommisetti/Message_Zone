import { useMemo, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Drawer } from '../../components/Drawer';
import { StatusBadge } from '../../components/StatusBadge';
import { mockNotifications } from '../../data/mockData';
import { Notification } from '../../types';
import { Search, Filter, X } from 'lucide-react';

export function Notifications() {
  const [selected, setSelected] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    period: 'this_month',
    from: '',
    to: '',
    subscriber: '',
    country: '',
    category: '',
    status: '',
  });

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const f = filters;
    return mockNotifications.filter((n) => {
      // free text search across some fields
      const textMatch =
        !term ||
        n.mobileNumber.toLowerCase().includes(term) ||
        n.subscriber.toLowerCase().includes(term) ||
        n.country.toLowerCase().includes(term) ||
        n.category.toLowerCase().includes(term);

      if (!textMatch) return false;

      // subscriber filter
      if (f.subscriber && !n.subscriber.toLowerCase().includes(f.subscriber.toLowerCase())) return false;
      // country
      if (f.country && n.country !== f.country) return false;
      // category
      if (f.category && n.category !== f.category) return false;
      // status
      if (f.status && n.status !== f.status) return false;

      // date range
      if (f.from) {
        const fromDate = new Date(f.from);
        const recv = new Date(n.receivedDate);
        if (recv < fromDate) return false;
      }
      if (f.to) {
        const toDate = new Date(f.to);
        const recv = new Date(n.receivedDate);
        // include whole day for 'to'
        toDate.setHours(23, 59, 59, 999);
        if (recv > toDate) return false;
      }

      return true;
    });
  }, [searchTerm, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'mobileNumber', header: 'Mobile Number' },
    { key: 'receivedDate', header: 'Received Date', render: (v: string) => new Date(v).toLocaleString() },
    { key: 'subscriber', header: 'Subscriber' },
    { key: 'country', header: 'Country' },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status', render: (v: string) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="p-0 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
        {/* <p className="text-slate-600">Recent notification events</p> */}
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search mobile number, GUID...."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              aria-label="Open filters"
              onClick={() => setFilterOpen((s) => !s)}
              className="ml-3 p-2 rounded bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
            >
              <Filter className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-full overflow-x-auto data-table-scroll" style={{ WebkitOverflowScrolling: 'touch', marginBottom: 0, paddingBottom: 0 }}>
        <DataTable columns={columns} data={paged} onRowClick={(r) => setSelected(r)} />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-600">
          Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 bg-slate-100 text-slate-700 rounded disabled:opacity-50">Previous</button>
          <div className="px-3 text-sm text-slate-700">Page {page} of {totalPages}</div>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 bg-slate-100 text-slate-700 rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      <Drawer isOpen={selected !== null} onClose={() => setSelected(null)} title="Notification Details">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">{(selected.channel || 'sms').toUpperCase().slice(0,3)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{selected.subscriber}</h3>
                <div className="text-sm text-slate-600">{selected.mobileNumber} • {selected.country}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Category</div>
                <div className="font-medium text-slate-900">{selected.category}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <div className="text-slate-600 text-sm">Received Date</div>
                <div className="font-medium text-slate-900">{new Date(selected.receivedDate).toLocaleString()}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-slate-600 text-sm">GUID</div>
                <div className="font-medium text-slate-900 break-all font-mono text-sm">{selected.guid}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-slate-600 text-sm">Sent Date</div>
                <div className="font-medium text-slate-900">{selected.sentDate ? new Date(selected.sentDate).toLocaleString() : '-'}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-slate-600 text-sm">Mobile</div>
                <div className="font-medium text-slate-900">{selected.mobileNumber}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-slate-600 text-sm">Segments</div>
                <div className="font-medium text-slate-900">{selected.segments ?? '-'}</div>
              </div>

              <div className="flex flex-col">
                <div className="text-slate-600 text-sm">Message Code</div>
                <div className="font-medium text-slate-900">{selected.messageCode ?? '-'}</div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Content</h4>
              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded whitespace-pre-wrap">{selected.content || selected.details}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 text-sm">{(selected.channel || 'sms').toUpperCase()}</span>
              </div>
              <div>
                <StatusBadge status={selected.status} />
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Filter panel (right side) */}
      {filterOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white border-l border-slate-200 shadow-lg p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Filter</h4>
            <button onClick={() => setFilterOpen(false)} className="p-1 rounded hover:bg-slate-100"><X className="w-5 h-5 text-slate-600" /></button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Period</label>
              <select value={filters.period} onChange={(e) => setFilters((s) => ({ ...s, period: e.target.value }))} className="w-full border rounded px-2 py-2">
                <option value="this_month">This Month</option>
                <option value="this_week">This Week</option>
                <option value="today">Today</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">From</label>
              <input type="date" value={filters.from} onChange={(e) => setFilters((s) => ({ ...s, from: e.target.value }))} className="w-full border rounded px-2 py-2" />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">To</label>
              <input type="date" value={filters.to} onChange={(e) => setFilters((s) => ({ ...s, to: e.target.value }))} className="w-full border rounded px-2 py-2" />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Subscriber</label>
              <input type="text" placeholder="Search subscriber" value={filters.subscriber} onChange={(e) => setFilters((s) => ({ ...s, subscriber: e.target.value }))} className="w-full border rounded px-2 py-2" />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Country</label>
              <select value={filters.country} onChange={(e) => setFilters((s) => ({ ...s, country: e.target.value }))} className="w-full border rounded px-2 py-2">
                <option value="">All Countries</option>
                {Array.from(new Set(mockNotifications.map(n => n.country))).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Category</label>
              <select value={filters.category} onChange={(e) => setFilters((s) => ({ ...s, category: e.target.value }))} className="w-full border rounded px-2 py-2">
                <option value="">All Categories</option>
                {Array.from(new Set(mockNotifications.map(n => n.category))).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-1">Status</label>
              <select value={filters.status} onChange={(e) => setFilters((s) => ({ ...s, status: e.target.value }))} className="w-full border rounded px-2 py-2">
                <option value="">All Statuses</option>
                {Array.from(new Set(mockNotifications.map(n => n.status))).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-14">
              <button
                onClick={() => {
                  // apply: close panel and clear selection so details close
                  setFilterOpen(false);
                  setSelected(null);
                  // if period presets are used, set date range
                  const now = new Date();
                  if (filters.period === 'today') {
                    const d = now.toISOString().slice(0,10);
                    setFilters((s) => ({ ...s, from: d, to: d }));
                  } else if (filters.period === 'this_month') {
                    const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0,10);
                    const last = new Date(now.getFullYear(), now.getMonth()+1, 0).toISOString().slice(0,10);
                    setFilters((s) => ({ ...s, from: first, to: last }));
                  } else if (filters.period === 'this_week') {
                    const day = now.getDay();
                    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
                    const monday = new Date(now.setDate(diff));
                    const first = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).toISOString().slice(0,10);
                    const lastDate = new Date();
                    const last = lastDate.toISOString().slice(0,10);
                    setFilters((s) => ({ ...s, from: first, to: last }));
                  }
                }}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Apply
              </button>

              <button
                onClick={() => {
                  setFilters({ period: 'this_month', from: '', to: '', subscriber: '', country: '', category: '', status: '' });
                }}
                className="px-3 py-2 bg-slate-100 text-slate-700 rounded"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
