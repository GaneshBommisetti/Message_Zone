import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import { RoleSelector } from './pages/RoleSelector';
import { AuthPage } from './pages/AuthPage';

import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Vendors } from './pages/admin/Vendors';
import { Settings } from './pages/admin/Settings';



import { Notifications } from './pages/admin/Notifications';
import VendorSupportAdmin from './pages/admin/VendorSupport';




import { Customers } from './pages/admin/Customers';
import { Users } from './pages/admin/Users';
import { Subscriptions } from './pages/admin/Subscriptions';

import { VendorLayout } from './layouts/VendorLayout';
import { VendorDashboard } from './pages/vendor/VendorDashboard';
import { Integration } from './pages/vendor/Integration';
import { PaymentHistory } from './pages/vendor/PaymentHistory';
import { Payment } from './pages/vendor/Payment';
import Support from './pages/vendor/Support';

import { CustomerLayout } from './layouts/CustomerLayout';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { Subscription } from './pages/customer/Subscription';
import { APIIntegration } from './pages/customer/APIIntegration';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<AuthPage />} />
          <Route path="role_selector" element={<RoleSelector />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="vendors" element={<Vendors />} />

            <Route path="notifications" element={<Notifications />} />

            
            <Route path="customers" element={<Customers />} />
            <Route path="users" element={<Users />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="vendor-support" element={<VendorSupportAdmin />} />
          </Route>

          <Route path="/vendor" element={<VendorLayout />}>
            <Route index element={<VendorDashboard />} />
            <Route path="integration" element={<Integration />} />
            <Route path="payments" element={<PaymentHistory />} />

            <Route path="payment" element={<Payment />} />
            <Route path="support" element={<Support />} />
            
          </Route>

          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<CustomerDashboard />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="api" element={<APIIntegration />} />

            <Route path="payment" element={<Payment />} />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
