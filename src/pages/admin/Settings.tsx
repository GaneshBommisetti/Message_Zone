import React, { useState } from 'react';
import { Plus, Edit2, Save, Eye, EyeOff, X } from 'lucide-react';

type Row = { id: string; [key: string]: any };

function useId(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

const Card: React.FC<{
  title: string;
  fields: string[];
  data: Row[];
  onChange: (rows: Row[]) => void;
}> = ({ title, fields, data, onChange }) => {
  const [editingRows, setEditingRows] = useState<Record<string, boolean>>({});
  const [editBuffers, setEditBuffers] = useState<Record<string, Row>>({});
  const [showNewOnly, setShowNewOnly] = useState(false);

  const startAddNew = () => {
    const id = useId('r_');
    const newRow: Row = { id } as Row;
    fields.forEach((f) => (newRow[f] = ''));
    newRow._isNew = true;
    // add to data
    onChange([...data, newRow]);
    // create edit buffer and mark this row as editing so inputs appear immediately
    setEditBuffers((b) => ({ ...b, [id]: { ...newRow } }));
    setEditingRows((s) => ({ ...s, [id]: true }));
    // show new rows so user sees the created row
    setShowNewOnly(true);
  };

  const startEditRow = (id: string) => {
    setEditingRows((s) => ({ ...s, [id]: true }));
    const row = data.find((r) => r.id === id);
    if (row) setEditBuffers((b) => ({ ...b, [id]: { ...row } }));
  };

  const updateEditBuffer = (id: string, key: string, value: any) => {
    setEditBuffers((b) => ({ ...b, [id]: { ...b[id], [key]: value } }));
  };

  const saveRowEdit = (id: string) => {
    const buf = editBuffers[id];
    if (!buf) return;
    const newRows = data.map((r) => (r.id === id ? { ...r, ...buf, _isNew: false } : r));
    onChange(newRows);
    // after saving, show all so saved row appears in existing list
    setShowNewOnly(false);
    setEditingRows((s) => {
      const ns = { ...s };
      delete ns[id];
      return ns;
    });
    setEditBuffers((b) => {
      const nb = { ...b };
      delete nb[id];
      return nb;
    });
  };

  const cancelRowEdit = (id: string) => {
    setEditingRows((s) => {
      const ns = { ...s };
      delete ns[id];
      return ns;
    });
    setEditBuffers((b) => {
      const nb = { ...b };
      delete nb[id];
      return nb;
    });
  };

  return (
    <div className="bg-slate-100 rounded-2xl shadow-md p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>
          {/* total entries count (existing + new) */}
          {(() => {
            const total = data.length;
            return total > 0 ? (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                {total}
              </span>
            ) : null;
          })()}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={startAddNew} className="px-3 py-2 bg-white rounded-md flex items-center gap-2 border h-10">
            <Plus size={14} /> <span className="text-sm">Add New</span>
          </button>

          <button
            onClick={() => setShowNewOnly(!showNewOnly)}
            className="h-10 w-10 bg-white rounded-md border flex items-center justify-center"
            title={showNewOnly ? 'Show All' : 'Show New'}
            aria-label={showNewOnly ? 'Show All' : 'Show New'}
          >
            {showNewOnly ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Add New creates a hidden new row; editing it shows inputs */}

      <div className="mt-5 space-y-4">
        {/* Render existing rows first, then clearly separated new rows when showing All. If showing only New, render only new rows. */}
        {(() => {
          const existingRows = data.filter((r) => !r._isNew);
          const newRows = data.filter((r) => r._isNew);

          const renderRow = (row: Row) => {
            const isEditing = !!editingRows[row.id];
            const buffer = editBuffers[row.id] ?? row;

            return (
              <div key={row.id} className="flex items-start md:items-center gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fields.map((f) => (
                    <div key={f}>
                      <label className="block text-sm text-slate-600 mb-1">{f}</label>
                      {isEditing ? (
                        <input
                          value={buffer[f] ?? ''}
                          onChange={(e) => updateEditBuffer(row.id, f, e.target.value)}
                          className="w-full rounded-md border border-slate-200 px-3 py-2 h-10 bg-white"
                        />
                      ) : (
                        <div className="w-full text-base font-semibold text-slate-900 px-2 py-2">{row[f]}</div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex-shrink-0 flex items-center gap-2">
                      {isEditing ? (
                    <>
                      <button onClick={() => saveRowEdit(row.id)} className="h-10 w-10 bg-emerald-500 text-white rounded-md flex items-center justify-center">
                        <Save size={14} />
                      </button>
                      <button onClick={() => cancelRowEdit(row.id)} className="h-10 w-10 bg-white rounded-md border flex items-center justify-center">
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => startEditRow(row.id)} className="h-10 w-10 bg-blue-600 text-white rounded-md flex items-center justify-center">
                      <Edit2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          };

          if (showNewOnly) {
            return newRows.length ? newRows.map(renderRow) : <div className="text-sm text-slate-500">No new rows</div>;
          }

          return (
            <>
              {existingRows.map(renderRow)}

              {newRows.length > 0 && (
                <div className="pt-4">
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-slate-600">New Entries</h3>
                      <span className="text-xs text-slate-500">Recently added</span>
                    </div>
                    <div className="space-y-4">
                      {newRows.map((r) => (
                        <div key={r.id} className="p-3 bg-white rounded-md border">
                          {renderRow(r)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export const Settings: React.FC = () => {
  const [vendorRows, setVendorRows] = useState<Row[]>([{
    id: useId('v_'),
    'Vendor Name': 'ABC Corp',
    Website: 'www.abc.com',
    'Credit Limit': '10000',
  }]);

  const [channelRows, setChannelRows] = useState<Row[]>([{
    id: useId('c_'),
    'Channel Name': 'Online',
    Currency: 'USD',
    'API Key': 'XYZ123',
  }]);

  const [bankRows, setBankRows] = useState<Row[]>([{
    id: useId('b_'),
    'Bank Name': 'Bank A',
    'Account Type': 'Savings',
    Balance: '5000',
  }]);

  const [contactRows, setContactRows] = useState<Row[]>([{
    id: useId('co_'),
    Phone: '1234567890',
    Email: 'abc@example.com',
    Address: 'Street 1',
    'Contact Type': 'Primary',
  }]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Vendor Details" fields={["Vendor Name", "Website", "Credit Limit"]} data={vendorRows} onChange={setVendorRows} />

        <Card title="Channel Integration" fields={["Channel Name", "Currency", "API Key"]} data={channelRows} onChange={setChannelRows} />

        <Card title="Banks" fields={["Bank Name", "Account Type", "Balance"]} data={bankRows} onChange={setBankRows} />

        <Card title="Contact Details" fields={["Phone", "Email", "Address", "Contact Type"]} data={contactRows} onChange={setContactRows} />
      </div>
    </div>
  );
};

export default Settings;
