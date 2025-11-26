import { Vendor, Customer, Subscription, Message, Payment, ActivityLog, User, Notification } from '../types';

export const mockVendors: Vendor[] = [
  { id: '1', name: 'TechCom Solutions', balance: 15420.5, paymentMethod: 'Bank Transfer', status: 'active', lastActive: '2025-10-06T10:30:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_a', senderIds: ['TECHCOM', 'TECH-INFO'] },
  { id: '2', name: 'MessageHub Pro', balance: 8750.0, paymentMethod: 'Credit Card', status: 'active', lastActive: '2025-10-05T15:20:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_b', senderIds: ['MSGHUB'] },
  { id: '3', name: 'CloudSMS Inc', balance: 3200.75, paymentMethod: 'PayPal', status: 'suspended', lastActive: '2025-09-28T08:15:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_c', senderIds: ['CLOUDSMS', 'CLOUD-ALERT'] },
  { id: '4', name: 'SMSPro', balance: 9500.25, paymentMethod: 'Credit Card', status: 'active', lastActive: '2025-10-04T11:22:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_d', senderIds: ['SMSPRO'] },
  { id: '5', name: 'Notifyly', balance: 4320.0, paymentMethod: 'PayPal', status: 'active', lastActive: '2025-10-03T09:10:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_e', senderIds: ['NOTIFYLY'] },
  { id: '6', name: 'AlertWave', balance: 2100.5, paymentMethod: 'Bank Transfer', status: 'active', lastActive: '2025-10-02T14:05:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_f', senderIds: ['ALERTW'] },
  { id: '7', name: 'CommsCloud', balance: 12500.0, paymentMethod: 'Credit Card', status: 'active', lastActive: '2025-10-01T16:30:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_g', senderIds: ['COMMCLD'] },
  { id: '8', name: 'ReachHub', balance: 6400.75, paymentMethod: 'PayPal', status: 'active', lastActive: '2025-09-30T07:45:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_h', senderIds: ['REACH'] },
  { id: '9', name: 'PulseSMS', balance: 3050.0, paymentMethod: 'Credit Card', status: 'suspended', lastActive: '2025-09-25T12:00:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_i', senderIds: ['PULSE'] },
  { id: '10', name: 'MsgStream', balance: 8800.2, paymentMethod: 'Bank Transfer', status: 'active', lastActive: '2025-09-29T18:20:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_j', senderIds: ['MSGSTR'] },
  { id: '11', name: 'BroadCastify', balance: 4700.6, paymentMethod: 'PayPal', status: 'active', lastActive: '2025-09-27T10:10:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_k', senderIds: ['BCAST'] },
  { id: '12', name: 'SignalWorks', balance: 2300.0, paymentMethod: 'Credit Card', status: 'active', lastActive: '2025-09-26T09:00:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_l', senderIds: ['SIGNL'] },
  { id: '13', name: 'ZapSMS', balance: 1500.25, paymentMethod: 'Bank Transfer', status: 'active', lastActive: '2025-09-24T13:12:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_m', senderIds: ['ZAP'] },
  { id: '14', name: 'Messengerly', balance: 7600.9, paymentMethod: 'Credit Card', status: 'active', lastActive: '2025-09-23T11:11:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_n', senderIds: ['MSGRLY'] },
  { id: '15', name: 'NotifyFlow', balance: 980.0, paymentMethod: 'PayPal', status: 'inactive', lastActive: '2025-09-20T08:08:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_o', senderIds: ['NTFYFL'] },
  { id: '16', name: 'EchoSend', balance: 11200.4, paymentMethod: 'Credit Card', status: 'active', lastActive: '2025-09-19T17:17:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_p', senderIds: ['ECHOS'] },
  { id: '17', name: 'WaveNotify', balance: 6750.3, paymentMethod: 'Bank Transfer', status: 'active', lastActive: '2025-09-18T19:19:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_q', senderIds: ['WAVEN'] },
  { id: '18', name: 'Commlink', balance: 420.0, paymentMethod: 'PayPal', status: 'suspended', lastActive: '2025-09-15T06:06:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_r', senderIds: ['CMLNK'] },
  { id: '19', name: 'TextRanger', balance: 5580.75, paymentMethod: 'Credit Card', status: 'active', lastActive: '2025-09-14T20:20:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: true, bitmapSelection: 'bitmap_s', senderIds: ['TXTRN'] },
  { id: '20', name: 'NimbusSMS', balance: 300.0, paymentMethod: 'Bank Transfer', status: 'inactive', lastActive: '2025-09-10T05:05:00Z', apiKey: '79704ec9-5a5a-4d13-a66e-c1c020583efc', realTimeUpdates: false, bitmapSelection: 'bitmap_t', senderIds: ['NIMBUS'] },
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    subscription: 'Enterprise Plan',
    messagesSent: 45230,
    status: 'active',
    apiKey: 'cst_pk_live_abc123def456',
    webhookUrl: 'https://acme.com/webhooks/sms',
  },
  {
    id: '2',
    name: 'StartupX',
    subscription: 'Growth Plan',
    messagesSent: 12450,
    status: 'active',
    apiKey: 'cst_pk_live_ghi789jkl012',
    webhookUrl: 'https://startupx.io/api/sms-callback',
  },
  {
    id: '3',
    name: 'RetailPro Ltd',
    subscription: 'Basic Plan',
    messagesSent: 5680,
    status: 'expired',
    apiKey: 'cst_pk_live_mno345pqr678',
  },
  {
    id: '4',
    name: 'FinanceApp Inc',
    subscription: 'Enterprise Plan',
    messagesSent: 78920,
    status: 'active',
    apiKey: 'cst_pk_live_stu901vwx234',
    webhookUrl: 'https://financeapp.com/hooks/messaging',
  },
];

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    bundleName: 'Basic Plan',
    price: 49.99,
    duration: 30,
    features: ['5,000 messages/month', 'Email support', '1 API key'],
    messageLimit: 5000,
  },
  {
    id: '2',
    bundleName: 'Growth Plan',
    price: 149.99,
    duration: 30,
    features: ['25,000 messages/month', 'Priority support', '3 API keys', 'Webhooks'],
    messageLimit: 25000,
  },
  {
    id: '3',
    bundleName: 'Enterprise Plan',
    price: 499.99,
    duration: 30,
    features: ['Unlimited messages', '24/7 support', 'Unlimited API keys', 'Webhooks', 'Custom sender IDs', 'Dedicated account manager'],
    messageLimit: -1,
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    customerId: '1',
    vendorId: '1',
    status: 'success',
    channel: 'whatsapp',
    content: 'Your order #12345 has been shipped',
    recipient: '+1234567890',
    createdAt: '2025-10-06T09:15:00Z',
  },
  {
    id: '2',
    customerId: '2',
    vendorId: '1',
    status: 'success',
    channel: 'sms',
    content: 'Your verification code is 123456',
    recipient: '+1987654321',
    createdAt: '2025-10-06T09:10:00Z',
  },
  {
    id: '3',
    customerId: '1',
    vendorId: '2',
    status: 'failed',
    channel: 'viber',
    content: 'Payment reminder for invoice #9876',
    recipient: '+1122334455',
    createdAt: '2025-10-06T08:45:00Z',
  },
  {
    id: '4',
    customerId: '4',
    vendorId: '1',
    status: 'success',
    channel: 'inapp',
    content: 'Your account balance is $1,234.56',
    recipient: '+1555666777',
    createdAt: '2025-10-06T08:30:00Z',
  },
];

export const channelStats = [
  { date: 'Oct 1', inapp: 8000, whatsapp: 2500, viber: 800, sms: 300 },
  { date: 'Oct 2', inapp: 4600, whatsapp: 3100, viber: 700, sms: 250 },
  { date: 'Oct 3', inapp: 7400, whatsapp: 2900, viber: 760, sms: 200 },
  { date: 'Oct 4', inapp: 5000, whatsapp: 4200, viber: 900, sms: 150 },
  { date: 'Oct 5', inapp: 4700, whatsapp: 3500, viber: 820, sms: 180 },
  { date: 'Oct 6', inapp: 15500, whatsapp: 3000, viber: 880, sms: 120 },
];

export const channelTotals = channelStats.reduce(
  (acc, row) => {
    acc.inapp += row.inapp;
    acc.whatsapp += row.whatsapp;
    acc.viber += row.viber;
    acc.sms += row.sms;
    return acc;
  },
  { inapp: 0, whatsapp: 0, viber: 0, sms: 0 }
);

export const mockPayments: Payment[] = [
  {
    id: '1',
    date: '2025-10-05',
    amount: 1250.00,
    method: 'Bank Transfer',
    status: 'completed',
  },
  {
    id: '2',
    date: '2025-10-04',
    amount: 850.50,
    method: 'Credit Card',
    status: 'completed',
  },
  {
    id: '3',
    date: '2025-10-03',
    amount: 420.00,
    method: 'PayPal',
    status: 'pending',
  },
  {
    id: '4',
    date: '2025-10-02',
    amount: 2100.75,
    method: 'Bank Transfer',
    status: 'completed',
  },
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'Customer Acme Corporation sent 150 messages',
    entityType: 'message',
    timestamp: '2025-10-06T10:30:00Z',
  },
  {
    id: '2',
    action: 'Vendor TechCom Solutions balance updated',
    entityType: 'vendor',
    timestamp: '2025-10-06T09:45:00Z',
  },
  {
    id: '3',
    action: 'New subscription created for StartupX',
    entityType: 'subscription',
    timestamp: '2025-10-06T08:20:00Z',
  },
  {
    id: '4',
    action: 'Payment received from FinanceApp Inc',
    entityType: 'payment',
    timestamp: '2025-10-06T07:15:00Z',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'john@admin.com',
    role: 'admin',
    permissions: ['all'],
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'sarah@admin.com',
    role: 'admin',
    permissions: ['view_reports', 'manage_users'],
  },
  {
    id: '3',
    name: 'Mike Support',
    email: 'mike@support.com',
    role: 'admin',
    permissions: ['view_reports'],
  },
];

export const messageStatsData = [
  { date: 'Oct 1', success: 4500, failed: 120 },
  { date: 'Oct 2', success: 5200, failed: 98 },
  { date: 'Oct 3', success: 4800, failed: 145 },
  { date: 'Oct 4', success: 6100, failed: 87 },
  { date: 'Oct 5', success: 5500, failed: 110 },
  { date: 'Oct 6', success: 4900, failed: 95 },
];

export const vendorTrafficData = [
  { name: 'AsiaCell', messages: 25400 },
  { name: 'Zain', messages: 18200 },
  { name: 'Korek', messages: 12800 },
  { name: 'SMSPro', messages: 9500 },
  { name: 'Others', messages: 15600 },
];

export const customersTrafficData = [
  { name: 'Acme Corporation', messages: 45230 },
  { name: 'StartupX', messages: 12450 },
  { name: 'RetailPro Ltd', messages: 5680 },
  { name: 'FinanceApp Inc', messages: 78920 },
  { name: 'SMB Co', messages: 8200 },
];


 {/* New NotificationPage Start*/}

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    mobileNumber: '+1234567890',
    receivedDate: '2025-11-05T10:15:00Z',
    subscriber: 'Acme Corporation',
    country: 'USA',
    category: 'transactional',
    status: 'delivered',
    details: 'Order #12345 shipped to customer',
    guid: 'c217b01d-6009-4182-8429-f716b4e69eac',
    sentDate: '2025-11-05T10:14:58Z',
    segments: 2,
    messageCode: '00',
    content: 'Your order #12345 has been shipped. Track here: ...',
    channel: 'sms',
  },
  {
    id: 'n2',
    mobileNumber: '+1987654321',
    receivedDate: '2025-11-05T09:45:00Z',
    subscriber: 'StartupX',
    country: 'Canada',
    category: 'otp',
    status: 'delivered',
    details: 'Verification code 654321',
    guid: 'd317b01d-6009-4182-8429-f716b4e69ead',
    sentDate: '2025-11-05T09:45:00Z',
    segments: 1,
    messageCode: '00',
    content: 'Your verification code is 654321',
    channel: 'sms',
  },
  {
    id: 'n3',
    mobileNumber: '+447700900123',
    receivedDate: '2025-11-04T18:20:00Z',
    subscriber: 'RetailPro Ltd',
    country: 'UK',
    category: 'marketing',
    status: 'failed',
    details: 'Campaign SMS failed due to carrier error',
    guid: 'e417b01d-6009-4182-8429-f716b4e69eae',
    sentDate: '2025-11-04T18:19:58Z',
    segments: 3,
    messageCode: '01',
    content: 'Big sale! Get 50% off today only.',
    channel: 'sms',
  },
  {
    id: 'n4',
    mobileNumber: '+971501234567',
    receivedDate: '2025-11-03T14:05:00Z',
    subscriber: 'FinanceApp Inc',
    country: 'UAE',
    category: 'alert',
    status: 'pending',
    details: 'Balance alert queued',
    guid: 'f517b01d-6009-4182-8429-f716b4e69eaf',
    sentDate: '2025-11-03T14:05:00Z',
    segments: 1,
    messageCode: '00',
    content: 'Your account balance is $1,234.56',
    channel: 'inapp',
  },
  {
    id: 'n5',
    mobileNumber: '+919876543210',
    receivedDate: '2025-11-02T11:30:00Z',
    subscriber: 'NotifyFlow',
    country: 'India',
    category: 'otp',
    status: 'queued',
    details: 'OTP queued for delivery',
    guid: 'g617b01d-6009-4182-8429-f716b4e69eb0',
    sentDate: '2025-11-02T11:29:58Z',
    segments: 1,
    messageCode: '00',
    content: 'Your verification code is 123456',
    channel: 'sms',
  },
  {
    id: 'n6',
    mobileNumber: '+0707070707',
    receivedDate: '2025-11-02T11:30:00Z',
    subscriber: 'NotifyFlow',
    country: 'India',
    category: 'SMS',
    status: 'queued',
    details: 'OTP queued for delivery',
  },
   {
    id: 'n7',
    mobileNumber: '+0707070707',
    receivedDate: '2025-11-02T11:30:00Z',
    subscriber: 'NotifyFlow',
    country: 'India',
    category: 'SMS',
    status: 'queued',
    details: 'OTP queued for delivery',
  },
   {
    id: 'n8',
    mobileNumber: '+0707070707',
    receivedDate: '2025-11-02T11:30:00Z',
    subscriber: 'NotifyFlow',
    country: 'India',
    category: 'SMS',
    status: 'queued',
    details: 'OTP queued for delivery',
  },
   {
    id: 'n9',
    mobileNumber: '+0707070707',
    receivedDate: '2025-11-02T11:30:00Z',
    subscriber: 'NotifyFlow',
    country: 'India',
    category: 'SMS',
    status: 'queued',
    details: 'OTP queued for delivery',
  },
   {
    id: 'n10',
    mobileNumber: '+0707070707',
    receivedDate: '2025-11-02T11:30:00Z',
    subscriber: 'NotifyFlow',
    country: 'India',
    category: 'SMS',
    status: 'queued',
    details: 'OTP queued for delivery',
  },
];
 {/* New NotificationPage END*/}