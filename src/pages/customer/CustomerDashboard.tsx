import { MessageSquare, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { KPICard } from '../../components/KPICard';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockCustomers, mockMessages, channelStats } from '../../data/mockData';
import { ChannelDeliveryChart } from '../../components/ChannelDeliveryChart';

export function CustomerDashboard() {
  const customer = mockCustomers[0];
  const customerMessages = mockMessages.filter(m => m.customerId === customer.id);
  const successCount = customerMessages.filter(m => m.status === 'success').length;
  const failedCount = customerMessages.filter(m => m.status === 'failed').length;
  const successRate = ((successCount / customerMessages.length) * 100).toFixed(1);

  const remainingUsage = 25000 - customer.messagesSent;
  const daysUntilExpiry = 15;

  const usageData = [
    { date: 'Oct 1', messages: 1500 },
    { date: 'Oct 2', messages: 1800 },
    { date: 'Oct 3', messages: 1600 },
    { date: 'Oct 4', messages: 2100 },
    { date: 'Oct 5', messages: 1900 },
    { date: 'Oct 6', messages: 1700 },
  ];

  const statusData = [
    { name: 'Success', value: successCount, color: '#10b981' },
    { name: 'Failed', value: failedCount, color: '#ef4444' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Customer Dashboard</h1>
        <p className="text-slate-600">Monitor your messaging usage and account status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Messages Sent"
          value={customer.messagesSent.toLocaleString()}
          icon={MessageSquare}
          color="blue"
          trend={{ value: 12.3, isPositive: true }}
        />
        <KPICard
          title="Success Rate"
          value={`${successRate}%`}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Days Until Expiry"
          value={daysUntilExpiry}
          icon={Calendar}
          color="orange"
        />
        <KPICard
          title="Remaining Usage"
          value={remainingUsage.toLocaleString()}
          icon={AlertTriangle}
          color="slate"
        />
      </div>

      {daysUntilExpiry <= 15 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-1">Subscription Expiring Soon</h3>
            <p className="text-sm text-orange-800">
              Your subscription will expire in {daysUntilExpiry} days. Renew now to avoid service interruption.
            </p>
            <button className="mt-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors">
              Renew Subscription
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Daily Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="messages" stroke="#3b82f6" strokeWidth={2} name="Messages Sent" />
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
                label={(d: any) => `${d.name}: ${Math.round(d.percent * 100)}%`}
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
      </div>
  );
}
