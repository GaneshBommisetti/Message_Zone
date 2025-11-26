import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { mockSubscriptions } from '../../data/mockData';
import { Subscription } from '../../types';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';

export function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const handleAddSubscription = () => {
    setEditingSubscription(null);
    setIsModalOpen(true);
  };

  const handleEditSubscription = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDeleteSubscription = (subscriptionId: string) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      setSubscriptions(subscriptions.filter(s => s.id !== subscriptionId));
    }
  };

  const columns = [
    { key: 'bundleName', header: 'Bundle Name' },
    {
      key: 'price',
      header: 'Price',
      render: (val: number) => `$${val.toFixed(2)}`
    },
    {
      key: 'duration',
      header: 'Duration',
      render: (val: number) => `${val} days`
    },
    {
      key: 'messageLimit',
      header: 'Message Limit',
      render: (val: number) => val === -1 ? 'Unlimited' : val.toLocaleString()
    },
    {
      key: 'features',
      header: 'Features',
      render: (val: string[]) => `${val.length} features`
    },
    {
      key: 'id',
      header: 'Actions',
      render: (_: string, row: Subscription) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditSubscription(row);
            }}
            className="p-1 hover:bg-slate-100 rounded"
          >
            <Pencil className="w-4 h-4 text-slate-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSubscription(row.id);
            }}
            className="p-1 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Subscription Management</h1>
          <p className="text-slate-600">Manage subscription plans and pricing</p>
        </div>
        <button
          onClick={handleAddSubscription}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{sub.bundleName}</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">${sub.price}<span className="text-sm text-slate-600">/month</span></p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEditSubscription(sub)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <Pencil className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => handleDeleteSubscription(sub.id)}
                  className="p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {sub.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={subscriptions} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Bundle Name</label>
            <input
              type="text"
              defaultValue={editingSubscription?.bundleName}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Enterprise Plan"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
              <input
                type="number"
                defaultValue={editingSubscription?.price}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="49.99"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Duration (days)</label>
              <input
                type="number"
                defaultValue={editingSubscription?.duration}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message Limit</label>
            <input
              type="number"
              defaultValue={editingSubscription?.messageLimit}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10000 (or -1 for unlimited)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Features (one per line)</label>
            <textarea
              defaultValue={editingSubscription?.features.join('\n')}
              rows={4}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email support&#10;API access&#10;Webhooks"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingSubscription ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
