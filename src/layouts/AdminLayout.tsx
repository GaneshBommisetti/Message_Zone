import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import logo from '../images/logo.png';
import { Topbar } from '../components/Topbar';
import { LayoutDashboard, Building2, Users as UsersIcon, UserCog, CreditCard, Bell, MessageSquare } from 'lucide-react';

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Vendors', path: '/admin/vendors', icon: Building2 },

    
    { label: 'Notifications', path: '/admin/notifications', icon: Bell },


    
    { label: 'Customers', path: '/admin/customers', icon: UsersIcon },
    { label: 'User Management', path: '/admin/users', icon: UserCog },
      { label: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
      { label: 'Vendor Support', path: '/admin/vendor-support', icon: MessageSquare },
    { label: 'Settings', path: '/admin/settings', icon: UserCog },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for desktop - fixed, non-scrollable */}
      <div className="hidden md:block md:fixed md:top-0 md:left-0 md:h-full md:w-64 z-40">
          <Sidebar
            navItems={navItems}
            title={<img src={logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow" />}
          />
      </div>
      {/* Sidebar drawer for mobile/tablet */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-4/5 max-w-xs"> 
            <Sidebar navItems={navItems} title={<img src={logo} alt="Logo" className="h-12 w-auto object-contain drop-shadow" />} isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
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
