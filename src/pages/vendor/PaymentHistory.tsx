import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { mockPayments } from '../../data/mockData';
import { Download, Filter } from 'lucide-react';

export function PaymentHistory() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const filteredPayments = mockPayments.filter(payment => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.date);
      const now = new Date();
      const daysAgo = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === '7' && daysAgo > 7) return false;
      if (dateFilter === '30' && daysAgo > 30) return false;
      if (dateFilter === '90' && daysAgo > 90) return false;
    }
    return true;
  });

  const columns = [
    {
      key: 'date',
      header: 'Date',
      render: (val: string) => new Date(val).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (val: number) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    },
    { key: 'method', header: 'Payment Method' },
    {
      key: 'status',
      header: 'Status',
      render: (val: string) => <StatusBadge status={val} />
    },
  ];

  const totalAmount = filteredPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleExport = () => {
    alert('Exporting payment history as CSV...');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment History</h1>
        <p className="text-slate-600">View and manage your payment transactions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Paid (Filtered)</p>
            <p className="text-3xl font-bold text-slate-900">
              ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-slate-900">{filteredPayments.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600 mb-1">Pending Payments</p>
            <p className="text-3xl font-bold text-orange-600">
              {filteredPayments.filter(p => p.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2 mb-2 sm:mb-0">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Filters:</span>
          </div>
          <div className="flex flex-row gap-2 flex-1 max-w-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-1/2"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-1/2"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button
            onClick={handleExport}
            className="sm:ml-auto flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* <DataTable columns={columns} data={filteredPayments} /> */}
      </div>


<DataTable columns={columns} data={filteredPayments} />

    </div>
  );
}
