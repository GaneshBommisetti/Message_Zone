import { NavLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface SidebarProps {
  navItems: NavItem[];
  title: React.ReactNode;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ navItems, title, isMobileOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      const raw = localStorage.getItem('sidebar-collapsed');
      return raw === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
    } catch {}
  }, [collapsed]);

  // Responsive: show as overlay drawer on mobile
  const mobileDrawer = isMobileOpen !== undefined;

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-slate-900 text-white min-h-screen flex flex-col transition-all duration-200`}>
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        {!collapsed ? (
          <h1 className="text-2xl font-bold">{title}</h1>
        ) : (
          typeof title === 'string' ? (
            <div className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded" title={title} aria-label={title}>
              <span className="font-bold text-white">{title.charAt(0)}</span>
            </div>
          ) : (
            <div className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded" aria-label="Sidebar">
              <span className="font-bold text-white">A</span>
            </div>
          )
        )}
        <div className="flex gap-1">
          {/* Collapse button (desktop only) */}
          <button
            type="button"
            onClick={() => setCollapsed((s) => !s)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="bg-slate-900 border border-slate-700 rounded-full shadow-lg p-2 md:inline hidden focus:outline-none focus:ring-2 focus:ring-teal-500"
            aria-pressed={collapsed}
          >
            <span className="sr-only">{collapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
            {collapsed ? (
              <ChevronRight size={12} />
            ) : (
              <ChevronLeft size={12} />
            )}
          </button>
          {/* Close button (mobile only) */}
          {mobileDrawer && onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1 ml-2 rounded hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <span aria-hidden className="text-lg">×</span>
            </button>
          )}
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            // treat single-segment paths (e.g. '/admin', '/vendor', '/customer') as index links
            const isIndex = item.path.split('/').filter(Boolean).length === 1;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={isIndex}
                  title={item.label}
                  aria-label={item.label}
                  className={({ isActive }) => {
                    const base = `${collapsed ? 'justify-center px-0' : 'gap-3 px-4'} py-3 rounded-lg transition-colors flex items-center`;
                    const state = isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white';
                    return `${base} ${state}`;
                  }}
                  onClick={() => {
                    if (mobileDrawer && onClose) onClose();
                  }}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="font-medium ml-2 whitespace-nowrap overflow-hidden">{item.label}</span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
