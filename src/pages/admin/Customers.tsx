import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Drawer } from '../../components/Drawer';
import { StatusBadge } from '../../components/StatusBadge';
import { mockCustomers } from '../../data/mockData';
import { Customer } from '../../types';
import { Search, MessageSquare, Key, Webhook } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'subscription', header: 'Subscription' },
    {
      key: 'messagesSent',
      header: 'Messages Sent',
      render: (val: number) => val.toLocaleString()
    },
    {
      key: 'status',
      header: 'Status',
      render: (val: string) => <StatusBadge status={val} />
    },
  ];

  const usageData = [
    { day: 'Mon', messages: 450 },
    { day: 'Tue', messages: 680 },
    { day: 'Wed', messages: 520 },
    { day: 'Thu', messages: 790 },
    { day: 'Fri', messages: 610 },
    { day: 'Sat', messages: 340 },
    { day: 'Sun', messages: 280 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Customers</h1>
        <p className="text-slate-600">Manage customer accounts and subscriptions</p>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        onRowClick={(customer) => setSelectedCustomer(customer)}
      />

      <Drawer
        isOpen={selectedCustomer !== null}
        onClose={() => setSelectedCustomer(null)}
        title="Customer Details"
      >
        {selectedCustomer && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{selectedCustomer.name}</h3>
              <StatusBadge status={selectedCustomer.status} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">Messages Sent</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {selectedCustomer.messagesSent.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600 mb-1">Subscription</p>
                <p className="text-lg font-semibold text-slate-900">{selectedCustomer.subscription}</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                <Key className="w-5 h-5 text-slate-600" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-1">API Key</p>
                  <p className="text-sm font-mono text-slate-900 bg-white px-3 py-2 rounded border border-slate-200">
                    {selectedCustomer.apiKey}
                  </p>
                </div>
              </div>

              {selectedCustomer.webhookUrl && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <Webhook className="w-5 h-5 text-slate-600" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-1">Webhook URL</p>
                    <p className="text-sm text-slate-900 break-all">{selectedCustomer.webhookUrl}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Usage Statistics (Last 7 Days)</h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
