import { LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Hamburger menu for mobile */}
      {onMenuClick && (
        <button
          className="md:hidden mr-2 p-2 rounded hover:bg-slate-100 focus:outline-none"
          onClick={onMenuClick}
          aria-label="Open sidebar menu"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
      )}

      {/* Logo or left space */}
      <div className="flex-1" />

      {/* User Info + Logout */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* User Info */}
        <div className="hidden sm:flex items-center gap-2 text-slate-700">
          <User className="w-5 h-5" />
          <span className="font-medium truncate max-w-[100px] sm:max-w-none">{user?.name}</span>
          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full uppercase font-semibold">
            {user?.role}
          </span>
        </div>

        {/* Mobile user icon (instead of full name) */}
        <div className="flex sm:hidden items-center justify-center p-2 bg-slate-100 rounded-full">
          <User className="w-4 h-4 text-slate-600" />
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            navigate('/', { replace: true });
          }}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
