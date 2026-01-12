import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/lib/api';

// Mock data
const mockOrders: Order[] = [
  { id: 'ORD-001', customerName: 'John Doe', vendorName: 'ABC Supplies', totalItems: 5, status: 'pending', createdAt: '2024-01-20T10:30:00Z' },
  { id: 'ORD-002', customerName: 'Jane Smith', vendorName: 'XYZ Trading', totalItems: 3, status: 'confirmed', createdAt: '2024-01-19T14:20:00Z' },
  { id: 'ORD-003', customerName: 'Bob Wilson', vendorName: 'Global Parts', totalItems: 12, status: 'shipped', createdAt: '2024-01-18T09:15:00Z' },
  { id: 'ORD-004', customerName: 'Alice Brown', vendorName: 'Tech Wholesale', totalItems: 2, status: 'delivered', createdAt: '2024-01-17T16:45:00Z' },
  { id: 'ORD-005', customerName: 'Charlie Davis', vendorName: 'ABC Supplies', totalItems: 8, status: 'cancelled', createdAt: '2024-01-16T11:00:00Z' },
  { id: 'ORD-006', customerName: 'Diana Miller', vendorName: 'Premium Distributors', totalItems: 15, status: 'processing', createdAt: '2024-01-15T08:30:00Z' },
];

export default function Orders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = mockOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'id', header: 'Order ID', render: (order: Order) => <span className="font-mono">{order.id}</span> },
    { key: 'customerName', header: 'Customer' },
    { key: 'vendorName', header: 'Vendor' },
    { key: 'totalItems', header: 'Items' },
    {
      key: 'status',
      header: 'Status',
      render: (order: Order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (order: Order) => format(new Date(order.createdAt), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order: Order) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/orders/${order.id}`);
          }}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <p className="page-description">View all orders in the marketplace</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrders}
        keyExtractor={(order) => order.id}
        onRowClick={(order) => navigate(`/orders/${order.id}`)}
        emptyMessage="No orders found"
      />
    </div>
  );
}
