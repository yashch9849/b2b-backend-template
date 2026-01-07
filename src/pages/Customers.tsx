import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Customer } from '@/lib/api';

// Mock data
const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@company.com', status: 'approved', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Jane Smith', email: 'jane@business.com', status: 'pending', createdAt: '2024-01-18T14:20:00Z' },
  { id: '3', name: 'Bob Wilson', email: 'bob@enterprise.com', status: 'approved', createdAt: '2024-01-10T09:15:00Z' },
  { id: '4', name: 'Alice Brown', email: 'alice@corp.com', status: 'rejected', createdAt: '2024-01-12T16:45:00Z' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@startup.com', status: 'pending', createdAt: '2024-01-20T11:00:00Z' },
  { id: '6', name: 'Diana Miller', email: 'diana@firm.com', status: 'approved', createdAt: '2024-01-08T08:30:00Z' },
  { id: '7', name: 'Edward Lee', email: 'edward@inc.com', status: 'pending', createdAt: '2024-01-21T13:15:00Z' },
];

export default function Customers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState(mockCustomers);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (customerId: string) => {
    try {
      // await customersApi.approve(customerId);
      setCustomers(
        customers.map((c) =>
          c.id === customerId ? { ...c, status: 'approved' as const } : c
        )
      );
      toast({
        title: 'Customer Approved',
        description: 'Customer has been approved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve customer.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (customerId: string) => {
    try {
      // await customersApi.reject(customerId);
      setCustomers(
        customers.map((c) =>
          c.id === customerId ? { ...c, status: 'rejected' as const } : c
        )
      );
      toast({
        title: 'Customer Rejected',
        description: 'Customer has been rejected.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject customer.',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (customer: Customer) => <StatusBadge status={customer.status} />,
    },
    {
      key: 'createdAt',
      header: 'Created At',
      render: (customer: Customer) => format(new Date(customer.createdAt), 'MMM d, yyyy'),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (customer: Customer) =>
        customer.status === 'pending' ? (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(customer.id);
              }}
              className="text-success hover:text-success"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleReject(customer.id);
              }}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <p className="page-description">Manage customer accounts and approvals</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredCustomers}
        keyExtractor={(customer) => customer.id}
        emptyMessage="No customers found"
      />
    </div>
  );
}
