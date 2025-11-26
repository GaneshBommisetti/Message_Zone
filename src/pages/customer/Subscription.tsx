import { useState } from 'react';


import { useNavigate } from 'react-router-dom';



import { mockSubscriptions } from '../../data/mockData';
import { Check, Calendar, DollarSign, Zap } from 'lucide-react';

export function Subscription() {

  const navigate = useNavigate();
  
  const currentPlan = mockSubscriptions[1];
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 15);

  

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Subscription Management</h1>
        <p className="text-slate-600">Manage your subscription plan and billing</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm mb-1">Current Plan</p>
            <h2 className="text-3xl font-bold mb-2">{currentPlan.bundleName}</h2>
            <p className="text-blue-100">Active subscription</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">${currentPlan.price}</p>
            <p className="text-blue-100 text-sm">per month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-blue-500">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            <div>
              <p className="text-sm text-blue-100">Expires</p>
              <p className="font-semibold">{expiryDate.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5" />
            <div>
              <p className="text-sm text-blue-100">Next Payment</p>
              <p className="font-semibold">${currentPlan.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5" />
            <div>
              <p className="text-sm text-blue-100">Message Limit</p>
              <p className="font-semibold">{currentPlan.messageLimit.toLocaleString()}/month</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate('/customer/payment', { state: { planId: currentPlan.id, price: currentPlan.price, bundleName: currentPlan.bundleName, expires: expiryDate.toISOString().slice(0,10), messageLimit: currentPlan.messageLimit } })}
            className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
          >
            Renew Now
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Available Plans</h2>
        <p className="text-slate-600 mb-6">Choose the plan that best fits your needs</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockSubscriptions.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 transition-all cursor-pointer ${
                plan.id === currentPlan.id
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : selectedPlan === plan.id
                  ? 'border-blue-400'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.id === currentPlan.id && (
                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Current Plan
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.bundleName}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                <span className="text-slate-600">/month</span>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/customer/payment', { state: { planId: plan.id, price: plan.price, bundleName: plan.bundleName, expires: '', messageLimit: plan.messageLimit } })}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  plan.id === currentPlan.id
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={plan.id === currentPlan.id}
              >
                {plan.id === currentPlan.id ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Payment History</h2>
        <DataTable columns={paymentColumns} data={recentPayments} />
      </div> */}
    </div>
  );
}
