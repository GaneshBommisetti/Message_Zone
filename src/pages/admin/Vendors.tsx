import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Drawer } from '../../components/Drawer';
import { StatusBadge } from '../../components/StatusBadge';
import { mockVendors } from '../../data/mockData';
import { Vendor } from '../../types';
import { Search, DollarSign, CreditCard, Key } from 'lucide-react';

export function Vendors() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredVendors = mockVendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredVendors.length / pageSize));
  const pagedVendors = filteredVendors.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    { key: 'name', header: 'Name' },
    {
      key: 'balance',
      header: 'Balance',
      render: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
    { key: 'paymentMethod', header: 'Payment Method' },
    {
      key: 'status',
      header: 'Status',
      render: (val: string) => <StatusBadge status={val} />
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      render: (val: string) => new Date(val).toLocaleDateString()
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vendors</h1>
        <p className="text-slate-600">Manage vendor accounts and configurations</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Responsive table scroll wrapper for mobile/tablet */}
      <div className="w-full max-w-full overflow-x-auto data-table-scroll" style={{ WebkitOverflowScrolling: 'touch', marginBottom: 0, paddingBottom: 0 }}>
        <DataTable
          columns={columns}
          data={pagedVendors}
          onRowClick={(vendor) => setSelectedVendor(vendor)}
        />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-slate-600">
          Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredVendors.length)} of {filteredVendors.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-slate-100 text-slate-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <div className="px-3 text-sm text-slate-700">Page {page} of {totalPages}</div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-slate-100 text-slate-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <Drawer
        isOpen={selectedVendor !== null}
        onClose={() => setSelectedVendor(null)}
        title="Vendor Details"
      >
        {selectedVendor && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{selectedVendor.name}</h3>
              <StatusBadge status={selectedVendor.status} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Balance</p>
                  <p className="text-lg font-semibold text-slate-900">
                    ${selectedVendor.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-600">Payment Method</p>
                  <p className="text-lg font-semibold text-slate-900">{selectedVendor.paymentMethod}</p>
                </div>
              </div>

              {/* <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Activity className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="text-sm text-slate-600">Last Active</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {new Date(selectedVendor.lastActive).toLocaleString()}
                  </p>
                </div>
              </div> */}

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Key className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-1">API Key</p>
                  <p className="text-sm font-mono text-slate-900 bg-white px-3 py-2 rounded border border-slate-200">
                    {selectedVendor.apiKey}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Configuration</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Real-time Updates</span>
                  <span className="font-medium">{selectedVendor.realTimeUpdates ? 'Enabled' : 'Disabled'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200">
                  <span className="text-slate-600">Bitmap Selection</span>
                  <span className="font-medium">{selectedVendor.bitmapSelection || 'Not set'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Sender IDs</h4>
              <div className="flex flex-wrap gap-2">
                {selectedVendor.senderIds.map((id, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
