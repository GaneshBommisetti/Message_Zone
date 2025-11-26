import { useState } from 'react';
import { Copy, Check, Key, RefreshCw, Webhook, Code } from 'lucide-react';
import { mockCustomers } from '../../data/mockData';

export function APIIntegration() {
  const [copied, setCopied] = useState(false);
  const customer = mockCustomers[0];
  const [apiKey, setApiKey] = useState(customer.apiKey);
  const [webhookUrl, setWebhookUrl] = useState(customer.webhookUrl || '');
  const [endpointUrl, setEndpointUrl] = useState('https://api.messagingplatform.com/v1/send');
  const [integrationStatus /* , setIntegrationStatus */] = useState<'active' | 'inactive'>('active');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerateKey = () => {
    if (confirm('Are you sure you want to regenerate your API key? Your old key will stop working immediately.')) {
      const newKey = `cst_pk_live_${Math.random().toString(36).substring(2, 15)}`;
      setApiKey(newKey);
      alert('API key regenerated successfully!');
    }
  };

  const codeExample = `// Example: Send SMS using your API key
const response = await fetch('${endpointUrl}', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Hello from our platform!',
    senderId: 'MYCOMPANY'
  })
});

const data = await response.json();
console.log(data);`;

  return (
    <div className="p-2 sm:p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">API Integration</h1>
        <p className="text-slate-600 text-sm sm:text-base">Configure your API settings and integration</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Key className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900">API Key</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-slate-600">Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              integrationStatus === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
            }`}>
              {integrationStatus === 'active' ? '● Active' : '○ Inactive'}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-">Your API Key</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={apiKey}
                readOnly
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs sm:text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(apiKey)}
                  className="flex items-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleRegenerateKey}
                  className="flex items-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Keep your API key secure. Never share it publicly or commit it to version control.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-green-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Endpoint Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">API Endpoint URL</label>
            <input
              type="text"
              value={endpointUrl}
              onChange={(e) => setEndpointUrl(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">Request Method</label>
            <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm">
              <option value="POST">POST</option>
              <option value="GET">GET</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Webhook className="w-6 h-6 text-orange-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Webhook Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">Webhook URL</label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-domain.com/api/webhook"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
            />
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              We'll send delivery status updates to this URL
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <p className="text-xs sm:text-sm font-medium text-slate-700 mb-2">Webhook Payload Example:</p>
            <pre className="text-xs font-mono text-slate-600 overflow-x-auto">
{`{
  "messageId": "msg_123456",
  "status": "delivered",
  "recipient": "+1234567890",
  "timestamp": "2025-10-06T10:30:00Z"
}`}
            </pre>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code className="w-6 h-6 text-slate-600" />
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Code Example</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => handleCopy(codeExample)}
            className="absolute top-3 right-3 p-2 bg-slate-700 text-white rounded hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-xs sm:text-sm max-w-xs sm:max-w-full" style={{ WebkitOverflowScrolling: 'touch' }}>
            <code>{codeExample}</code>
          </pre>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
          Save Configuration
        </button>
      </div>
    </div>
  );
}
