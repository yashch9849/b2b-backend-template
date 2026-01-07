import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search } from 'lucide-react';
import type { Product } from '@/lib/api';

// Mock data
const mockProducts: Product[] = [
  { id: '1', name: 'Industrial Steel Pipes', vendorName: 'ABC Supplies', categoryName: 'Building Materials', moq: 100, status: 'active' },
  { id: '2', name: 'LED Panel Lights', vendorName: 'Tech Wholesale', categoryName: 'Lighting', moq: 50, status: 'active' },
  { id: '3', name: 'Office Chairs Ergonomic', vendorName: 'Premium Distributors', categoryName: 'Office Furniture', moq: 20, status: 'active' },
  { id: '4', name: 'Packaging Boxes Cardboard', vendorName: 'Global Parts', categoryName: 'Packaging', moq: 500, status: 'active' },
  { id: '5', name: 'Safety Helmets Industrial', vendorName: 'XYZ Trading', categoryName: 'Safety Equipment', moq: 100, status: 'inactive' },
  { id: '6', name: 'Copper Wire 2.5mm', vendorName: 'ABC Supplies', categoryName: 'Electrical', moq: 1000, status: 'active' },
  { id: '7', name: 'Hydraulic Pumps', vendorName: 'Tech Wholesale', categoryName: 'Machinery', moq: 5, status: 'active' },
];

export default function Products() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { key: 'name', header: 'Product Name' },
    { key: 'vendorName', header: 'Vendor' },
    { key: 'categoryName', header: 'Category' },
    { key: 'moq', header: 'MOQ', render: (product: Product) => product.moq.toLocaleString() },
    {
      key: 'status',
      header: 'Status',
      render: (product: Product) => <StatusBadge status={product.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (product: Product) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/products/${product.id}`);
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
        <h1 className="page-title">Products</h1>
        <p className="page-description">View all products in the marketplace</p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredProducts}
        keyExtractor={(product) => product.id}
        onRowClick={(product) => navigate(`/products/${product.id}`)}
        emptyMessage="No products found"
      />
    </div>
  );
}
