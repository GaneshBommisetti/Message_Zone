import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import logo from '../images/logo.png';
import { Topbar } from '../components/Topbar';
import { LayoutDashboard, Settings, CreditCard } from 'lucide-react';

export function VendorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = [
    { label: 'Dashboard', path: '/vendor', icon: LayoutDashboard },
    { label: 'Integration', path: '/vendor/integration', icon: Settings },
    { label: 'Payment History', path: '/vendor/payments', icon: CreditCard },
    { label: 'Support', path: '/vendor/support', icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for desktop - fixed, non-scrollable */}
      <div className="hidden md:block md:fixed md:top-0 md:left-0 md:h-full md:w-64 z-40">
        <Sidebar navItems={navItems} title={<img src={logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow" />} />
      </div>
      {/* Sidebar drawer for mobile/tablet */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-4/5 max-w-xs">
            <Sidebar navItems={navItems} title={<img src={logo} alt="Logo" className="h-10 w-auto object-contain drop-shadow" />} isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      {/* Main content area - scrollable, with left margin for fixed sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
