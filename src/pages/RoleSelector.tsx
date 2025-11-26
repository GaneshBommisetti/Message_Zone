import { useNavigate } from 'react-router-dom';
import { Shield, Building2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function RoleSelector() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();

  const handleRoleSelect = (role: 'admin' | 'vendor' | 'customer') => {
    switchRole(role);
    navigate(`/${role}`);
    window.scrollTo(0, 0);
  };

  const roles = [
    {
      id: 'admin' as const,
      title: 'Admin Portal',
      description: 'Manage platform, vendors, customers, and subscriptions',
      icon: Shield,
      color: 'blue',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      id: 'vendor' as const,
      title: 'Vendor Portal',
      description: 'Monitor usage, manage integrations, and view payments',
      icon: Building2,
      color: 'green',
      gradient: 'from-green-600 to-green-800',
    },
    {
      id: 'customer' as const,
      title: 'Customer Portal',
      description: 'Track messages, manage subscription, and configure API',
      icon: User,
      color: 'orange',
      gradient: 'from-orange-600 to-orange-800',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Message zone Platform</h1>
          <p className="text-xl text-slate-300">Select your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="p-8">
                <div className={`inline-flex p-4 bg-gradient-to-br ${role.gradient} rounded-xl mb-6`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{role.title}</h3>
                <p className="text-slate-600 leading-relaxed">{role.description}</p>
                <div className="mt-6 flex items-center text-blue-600 font-semibold">
                  <span>Access Portal</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>Click any portal to explore its features</p>
        </div>


      </div>
    </div>
  );
}
