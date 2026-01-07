import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import { format } from 'date-fns';
import type { Vendor } from '@/lib/api';

// Mock data
const mockVendors: Vendor[] = [
  { id: '1', name: 'ABC Supplies Co.', email: 'contact@abcsupplies.com', status: 'approved', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'XYZ Trading Ltd', email: 'info@xyztrading.com', status: 'pending', createdAt: '2024-01-18T14:20:00Z' },
  { id: '3', name: 'Global Parts Inc', email: 'sales@globalparts.com', status: 'approved', createdAt: '2024-01-10T09:15:00Z' },
  { id: '4', name: 'Tech Wholesale', email: 'hello@techwholesale.com', status: 'rejected', createdAt: '2024-01-12T16:45:00Z' },
  { id: '5', name: 'Fresh Goods Market', email: 'vendor@freshgoods.com', status: 'pending', createdAt: '2024-01-20T11:00:00Z' },
  { id: '6', name: 'Premium Distributors', email: 'contact@premiumdist.com', status: 'approved', createdAt: '2024-01-08T08:30:00Z' },
  { id: '7', name: 'QuickShip Supplies', email: 'info@quickship.com', status: 'pending', createdAt: '2024-01-21T13:15:00Z' },
];

export default function Vendors() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVendors = mockVendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Vendor Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (vendor: Vendor) => <StatusBadge status={vendor.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (vendor: Vendor) => format(new Date(vendor.createdAt), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vendor: Vendor) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/vendors/${vendor.id}`);
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
        <h1 className="page-title">Vendors</h1>
        <p className="page-description">Manage vendor accounts and approvals</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredVendors}
        keyExtractor={(vendor) => vendor.id}
        onRowClick={(vendor) => navigate(`/vendors/${vendor.id}`)}
        emptyMessage="No vendors found"
      />
    </div>
  );
}
