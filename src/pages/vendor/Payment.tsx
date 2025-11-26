import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DollarSign } from 'lucide-react';

type PaymentGateway = 'stripe' | 'razorpay' | 'paypal' | null;

export function Payment() {
  const location = useLocation();
  const navState = (location.state || {}) as any;

  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(null);
  const [amount, setAmount] = useState(() => {
    // if plan/price passed from subscription, prefill
    if (navState && typeof navState.price !== 'undefined') return String(navState.price);
    return '';
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const gateways = [
    {
      id: 'stripe' as const,
      name: 'Stripe',
      description: 'Fast, secure payments with Stripe',
      icon: '💳',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'razorpay' as const,
      name: 'Razorpay',
      description: 'India\'s trusted payment gateway',
      icon: '💰',
      color: 'from-blue-600 to-purple-600',
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      description: 'Global payments made simple',
      icon: '🅿️',
      color: 'from-purple-600 to-purple-700',
    },
  ];

  const handlePayNow = () => {
    if (!selectedGateway || !amount) {
      alert('Please select a payment gateway and enter an amount');
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      alert(`Processing payment of $${amount} via ${selectedGateway.toUpperCase()}`);
      setIsProcessing(false);
      setAmount('');
      setSelectedGateway(null);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Methods</h1>
        <p className="text-slate-600">Select a payment gateway to proceed with payment</p>
      </div>

      {/* If a plan was passed from Subscription, show plan summary; otherwise show amount input */}
      {navState && navState.bundleName ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Plan Details</label>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Plan</span>
              <span className="font-medium text-slate-900">{navState.bundleName}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Amount</span>
              <span className="font-medium text-slate-900">${String(navState.price ?? '0.00')}</span>
            </div>
            {navState.expires && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Expires</span>
                <span className="font-medium text-slate-900">{navState.expires}</span>
              </div>
            )}
            {typeof navState.messageLimit !== 'undefined' && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Message Limit</span>
                <span className="font-medium text-slate-900">{navState.messageLimit === -1 ? 'Unlimited' : navState.messageLimit}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Enter Payment Amount</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateways */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Choose Payment Gateway</h2>
        <p className="text-sm text-slate-600 mb-4">Select one of the following payment methods:</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gateways.map((gateway) => (
            <div key={gateway.id}>
              <input
                type="radio"
                id={gateway.id}
                name="payment-gateway"
                value={gateway.id}
                checked={selectedGateway === gateway.id}
                onChange={() => setSelectedGateway(gateway.id)}
                className="sr-only"
              />
              <label
                htmlFor={gateway.id}
                className={`block p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedGateway === gateway.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`text-4xl flex-shrink-0`}>{gateway.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-1">{gateway.name}</h3>
                    <p className="text-sm text-slate-600">{gateway.description}</p>
                  </div>
                  {selectedGateway === gateway.id && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Gateway Details */}
      {selectedGateway && (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">Gateway:</span>
              <span className="font-medium text-slate-900 uppercase">{selectedGateway}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Amount:</span>
              <span className="font-medium text-slate-900">${amount || '0.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Pending
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pay Now Button - Only visible when gateway is selected */}
      {selectedGateway && (
        <div className="flex gap-4">
          <button
            onClick={handlePayNow}
            disabled={!amount || isProcessing}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              !amount || isProcessing
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isProcessing ? 'Processing...' : `Pay Now ($${amount || '0.00'})`}
          </button>
          <button
            onClick={() => {
              setSelectedGateway(null);
              setAmount('');
            }}
            className="px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">ℹ️ Note:</span> Select a payment gateway and enter an amount to proceed with payment. The "Pay Now" button will appear once you select a gateway.
        </p>
      </div>
    </div>
  );
}
