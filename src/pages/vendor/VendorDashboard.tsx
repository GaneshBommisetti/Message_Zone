import { DollarSign, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { KPICard } from '../../components/KPICard';
import { DataTable } from '../../components/DataTable';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockMessages, mockActivityLogs, channelStats } from '../../data/mockData';
import { ChannelDeliveryChart } from '../../components/ChannelDeliveryChart';

export function VendorDashboard() {
  const vendorMessages = mockMessages.filter(m => m.vendorId === '1');
  const successCount = vendorMessages.filter(m => m.status === 'success').length;
  const failedCount = vendorMessages.filter(m => m.status === 'failed').length;
  const successRate = ((successCount / vendorMessages.length) * 100).toFixed(1);

  const usageData = [
    { date: 'Oct 1', messages: 1200 },
    { date: 'Oct 2', messages: 1450 },
    { date: 'Oct 3', messages: 1100 },
    { date: 'Oct 4', messages: 1680 },
    { date: 'Oct 5', messages: 1520 },
    { date: 'Oct 6', messages: 1390 },
  ];

  const statusData = [
    { name: 'Success', value: successCount, color: '#10b981' },
    { name: 'Failed', value: failedCount, color: '#ef4444' },
  ];

  const activityColumns = [
    { key: 'action', header: 'Activity' },
    {
      key: 'timestamp',
      header: 'Time',
      render: (val: string) => new Date(val).toLocaleString()
    },
  ];

  const recentActivity = mockActivityLogs.filter(log => log.entityType === 'vendor' || log.entityType === 'message').slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Vendor Dashboard</h1>
        <p className="text-slate-600">Monitor your messaging performance and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Monthly Usage"
          value="8,340"
          icon={TrendingUp}
          color="blue"
          trend={{ value: 15.3, isPositive: true }}
        />
        <KPICard
          title="Current Cost"
          value="$1,245"
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Success Rate"
          value={`${successRate}%`}
          icon={CheckCircle}
          color="green"
        />
        <KPICard
          title="Failed Messages"
          value={failedCount}
          icon={XCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Usage Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} name="Messages" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Message Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChannelDeliveryChart data={channelStats} />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <DataTable columns={activityColumns} data={recentActivity} />
      </div>
    </div>
  );
}
