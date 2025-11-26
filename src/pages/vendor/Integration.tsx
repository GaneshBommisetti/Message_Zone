import { useState } from 'react';
import { Copy, Check, Key, Zap, Radio, MessageSquare } from 'lucide-react';
import { mockVendors } from '../../data/mockData';

export function Integration() {
  const [copied, setCopied] = useState(false);
  const vendor = mockVendors[0];
  const [realTimeUpdates, setRealTimeUpdates] = useState(vendor.realTimeUpdates);
  const [bitmapSelection, setBitmapSelection] = useState(vendor.bitmapSelection || 'bitmap_a');
  const [senderIds, setSenderIds] = useState(vendor.senderIds);
  const [newSenderId, setNewSenderId] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(vendor.apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSenderId = () => {
    if (newSenderId.trim() && !senderIds.includes(newSenderId.trim())) {
      setSenderIds([...senderIds, newSenderId.trim()]);
      setNewSenderId('');
    }
  };

  const handleRemoveSenderId = (id: string) => {
    setSenderIds(senderIds.filter(sid => sid !== id));
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Integration Settings</h1>
        <p className="text-slate-600 text-sm sm:text-base">Configure your API and messaging settings</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">API Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">API Key</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={vendor.apiKey}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-sm text-slate-500 mt-2">Keep your API key secure. Do not share it publicly.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">API Endpoint</label>
            <input
              type="text"
              value="https://api.messagingplatform.com/v1/send"
              readOnly
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-orange-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Real-time Settings</h2>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-slate-600" />
            <div>
              <p className="font-medium text-slate-900">Real-time Updates</p>
              <p className="text-sm text-slate-600">Receive instant delivery status updates</p>
            </div>
          </div>
          <button
            onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              realTimeUpdates ? 'bg-blue-600' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                realTimeUpdates ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-6 h-6 text-green-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Sender ID Management</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bitmap Selection</label>
            <select
              value={bitmapSelection}
              onChange={(e) => setBitmapSelection(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="bitmap_a">Bitmap A</option>
              <option value="bitmap_b">Bitmap B</option>
              <option value="bitmap_c">Bitmap C</option>
              <option value="bitmap_d">Bitmap D</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Sender IDs</label>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                value={newSenderId}
                onChange={(e) => setNewSenderId(e.target.value.toUpperCase())}
                placeholder="Enter sender ID (e.g., MYCOMPANY)"
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={11}
              />
              <button
                onClick={handleAddSenderId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {senderIds.map((id, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg max-w-xs sm:max-w-none">
                  <span className="font-medium truncate">{id}</span>
                  <button
                    onClick={() => handleRemoveSenderId(id)}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">Sender IDs must be 11 characters or less and approved by your administrator.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
          Save Changes
        </button>
      </div>
    </div>
  );
}
