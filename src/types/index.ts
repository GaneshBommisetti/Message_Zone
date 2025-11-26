export type UserRole = 'admin' | 'vendor' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  balance: number;
  paymentMethod: string;
  status: 'active' | 'inactive' | 'suspended';
  lastActive: string;
  apiKey: string;
  realTimeUpdates: boolean;
  bitmapSelection?: string;
  senderIds: string[];
}

export interface Customer {
  id: string;
  name: string;
  subscription: string;
  messagesSent: number;
  status: 'active' | 'inactive' | 'expired';
  apiKey: string;
  webhookUrl?: string;
}

export interface Subscription {
  id: string;
  bundleName: string;
  price: number;
  duration: number;
  features: string[];
  messageLimit: number;
}

export interface Message {
  id: string;
  customerId: string;
  vendorId: string;
  status: 'success' | 'failed' | 'pending';
  channel?: 'inapp' | 'whatsapp' | 'viber' | 'sms';
  content: string;
  recipient: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface ActivityLog {
  id: string;
  action: string;
  entityType: string;
  timestamp: string;
}


 {/* New NotificationPage Start*/}
export interface Notification {
  id: string;
  mobileNumber: string;
  receivedDate: string; // ISO date string
  subscriber: string;
  country: string;
  category: string;
  status: 'delivered' | 'failed' | 'pending' | 'queued';
  details?: string;
  
  // Additional fields for notification details drawer
  guid?: string;
  sentDate?: string;
  segments?: number;
  messageCode?: string;
  content?: string;
  channel?: 'inapp' | 'whatsapp' | 'viber' | 'sms' | 'mms' | 'other';
}

 {/* New NotificationPage End*/}
