import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { channelTotals } from '../data/mockData';

interface Props {
  data: Array<Record<string, any>>;
  height?: number;
}

export function ChannelDeliveryChart({ data, height = 260 }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Channel-wise Delivery</h3>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">In-App</div>
            <div className="font-semibold text-slate-900">{channelTotals.inapp.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">WhatsApp</div>
            <div className="font-semibold text-slate-900">{channelTotals.whatsapp.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Viber</div>
            <div className="font-semibold text-slate-900">{channelTotals.viber.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">SMS</div>
            <div className="font-semibold text-slate-900">{channelTotals.sms.toLocaleString()}</div>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6edf3" />
          <XAxis dataKey="date" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip content={({ payload, label }) => {
            if (!payload || payload.length === 0) return null;
            const total = payload.reduce((s: number, p: any) => s + (p.value || 0), 0);
            return (
              <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-sm">
                <div className="font-semibold mb-1">{label}</div>
                {payload.map((p: any) => (
                  <div key={p.dataKey} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span style={{ width: 10, height: 10, background: p.color, display: 'inline-block' }} />
                      <span className="text-slate-700">{p.name}</span>
                    </div>
                    <div className="text-slate-900">{(p.value || 0).toLocaleString()} <span className="text-slate-500">({total ? Math.round(((p.value || 0) / total) * 100) : 0}%)</span></div>
                  </div>
                ))}
              </div>
            );
          }} />
          <Legend />
          <Bar dataKey="inapp" stackId="a" fill="#6366f1" name="In-App" />
          <Bar dataKey="whatsapp" stackId="a" fill="#10b981" name="WhatsApp" />
          <Bar dataKey="viber" stackId="a" fill="#7c3aed" name="Viber" />
          <Bar dataKey="sms" stackId="a" fill="#3b82f6" name="SMS" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
