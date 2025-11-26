import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: 'admin' | 'vendor' | 'customer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Demo Admin',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['all'],
  });

  const login = async (email: string /* password?: string */) => {
    // password intentionally unused in demo login
    setUser({
      id: '1',
      name: 'Demo User',
      email,
      role: 'admin',
      permissions: ['all'],
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: 'admin' | 'vendor' | 'customer') => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
