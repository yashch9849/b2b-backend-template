import { Store, Users, Package, ShoppingCart, Clock, AlertCircle } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { format } from 'date-fns';

// Mock data - replace with API calls
const mockStats = {
  totalVendors: 124,
  pendingVendors: 8,
  totalCustomers: 1543,
  pendingCustomers: 23,
  totalProducts: 4521,
  totalOrders: 892,
};

const mockRecentOrders = [
  { id: '1', customerName: 'John Doe', vendorName: 'ABC Supplies', totalItems: 5, status: 'pending', createdAt: new Date().toISOString() },
  { id: '2', customerName: 'Jane Smith', vendorName: 'XYZ Trading', totalItems: 3, status: 'approved', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', customerName: 'Bob Wilson', vendorName: 'Global Parts', totalItems: 12, status: 'pending', createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '4', customerName: 'Alice Brown', vendorName: 'Tech Wholesale', totalItems: 2, status: 'approved', createdAt: new Date(Date.now() - 259200000).toISOString() },
  { id: '5', customerName: 'Charlie Davis', vendorName: 'ABC Supplies', totalItems: 8, status: 'rejected', createdAt: new Date(Date.now() - 345600000).toISOString() },
];

const mockRecentVendors = [
  { id: '1', name: 'New Vendor Co', email: 'vendor@newco.com', status: 'pending' as const, createdAt: new Date().toISOString() },
  { id: '2', name: 'Fresh Supplies', email: 'info@fresh.com', status: 'pending' as const, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', name: 'Quality Goods', email: 'sales@quality.com', status: 'approved' as const, createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export default function Dashboard() {
  const orderColumns = [
    { key: 'id', header: 'Order ID', render: (item: typeof mockRecentOrders[0]) => `#${item.id}` },
    { key: 'customerName', header: 'Customer' },
    { key: 'vendorName', header: 'Vendor' },
    { key: 'totalItems', header: 'Items' },
    { key: 'status', header: 'Status', render: (item: typeof mockRecentOrders[0]) => <StatusBadge status={item.status} /> },
    { key: 'createdAt', header: 'Date', render: (item: typeof mockRecentOrders[0]) => format(new Date(item.createdAt), 'MMM d, yyyy') },
  ];

  const vendorColumns = [
    { key: 'name', header: 'Vendor Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (item: typeof mockRecentVendors[0]) => <StatusBadge status={item.status} /> },
    { key: 'createdAt', header: 'Applied', render: (item: typeof mockRecentVendors[0]) => format(new Date(item.createdAt), 'MMM d, yyyy') },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-description">Overview of your marketplace</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Vendors"
          value={mockStats.totalVendors}
          icon={Store}
          description={`${mockStats.pendingVendors} pending approval`}
        />
        <StatCard
          title="Total Customers"
          value={mockStats.totalCustomers}
          icon={Users}
          description={`${mockStats.pendingCustomers} pending approval`}
        />
        <StatCard
          title="Total Products"
          value={mockStats.totalProducts}
          icon={Package}
        />
        <StatCard
          title="Total Orders"
          value={mockStats.totalOrders}
          icon={ShoppingCart}
        />
        <StatCard
          title="Pending Vendors"
          value={mockStats.pendingVendors}
          icon={AlertCircle}
          className="border-warning/50"
        />
        <StatCard
          title="Pending Customers"
          value={mockStats.pendingCustomers}
          icon={Clock}
          className="border-warning/50"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <DataTable
            columns={orderColumns}
            data={mockRecentOrders}
            keyExtractor={(item) => item.id}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Vendor Applications</h2>
          <DataTable
            columns={vendorColumns}
            data={mockRecentVendors}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>
    </div>
  );
}
