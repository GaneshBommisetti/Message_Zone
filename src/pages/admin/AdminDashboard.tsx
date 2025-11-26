import { Users, Building2, MessageSquare, AlertCircle } from 'lucide-react';
import { KPICard } from '../../components/KPICard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { messageStatsData, vendorTrafficData, channelStats, customersTrafficData } from '../../data/mockData';
import { ChannelDeliveryChart } from '../../components/ChannelDeliveryChart';

export function AdminDashboard() {
  // const totalCustomers = mockCustomers.length;
  // const totalVendors = mockVendors.length;

   const totalCustomers = 152367;
  const totalVendors = 1500;
  // const successfulMessages = mockMessages.filter(m => m.status === 'success').length;
  // const failedMessages = mockMessages.filter(m => m.status === 'failed').length;

   const successfulMessages = 9523;
  const failedMessages = 77;

  // compact formatter: millions (M), thousands (K), or raw
  const formatCompact = (n: number) => {
    if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${+(n / 1_000).toFixed(2)}K`;
    return `${n}`;
  };

  const totalCustomersDisplay = formatCompact(totalCustomers);
  const totalVendorsDisplay = formatCompact(totalVendors);
  const successfulMessagesDisplay = formatCompact(successfulMessages);
  const failedMessagesDisplay = formatCompact(failedMessages);

  // recent activity table intentionally omitted on this view

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">Platform overview and key metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Customers"
          value={totalCustomersDisplay}
          icon={Users}
          color="blue"
          trend={{ value: 12.5, isPositive: true }}
        />
        <KPICard
          title="Total Vendors"
          value={totalVendorsDisplay}
          icon={Building2}
          color="green"
          trend={{ value: 8.3, isPositive: true }}
        />
        <KPICard
          title="Successful Messages"
          value={successfulMessagesDisplay}
          icon={MessageSquare}
          color="green"
        />
        <KPICard
          title="Failed Messages"
          value={failedMessagesDisplay}
          icon={AlertCircle}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Message Success Rate</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={messageStatsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} name="Success" />
              <Line type="monotone" dataKey="failed" stroke="#ef4444" strokeWidth={2} name="Failed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ChannelDeliveryChart data={channelStats} />
      </div>




      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Vendor Traffic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="messages" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Traffic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={customersTrafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey="messages" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>



      {/* <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
        <DataTable columns={activityColumns} data={mockActivityLogs} />
      </div> */}
    </div>
  );
}
