import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowLeft, ChevronRight, Package } from 'lucide-react';
import type { ProductDetail as ProductDetailType } from '@/lib/api';

// Mock data
const mockProductDetail: ProductDetailType = {
  id: '1',
  name: 'Industrial Steel Pipes',
  vendorName: 'ABC Supplies',
  categoryName: 'Building Materials',
  moq: 100,
  status: 'active',
  description: 'High-quality industrial steel pipes suitable for construction, plumbing, and manufacturing applications. Available in various sizes and thicknesses.',
  categoryPath: ['Home', 'Construction', 'Building Materials', 'Steel Products'],
  variants: [
    { id: 'v1', sku: 'ISP-001-S', price: 45.99, stock: 500, attributes: { 'Diameter': '1 inch', 'Length': '6 ft', 'Thickness': '2mm' } },
    { id: 'v2', sku: 'ISP-001-M', price: 65.99, stock: 350, attributes: { 'Diameter': '2 inch', 'Length': '6 ft', 'Thickness': '3mm' } },
    { id: 'v3', sku: 'ISP-001-L', price: 89.99, stock: 200, attributes: { 'Diameter': '3 inch', 'Length': '6 ft', 'Thickness': '4mm' } },
    { id: 'v4', sku: 'ISP-002-S', price: 75.99, stock: 150, attributes: { 'Diameter': '1 inch', 'Length': '12 ft', 'Thickness': '2mm' } },
  ],
  totalStock: 1200,
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = mockProductDetail;

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate('/products')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </Button>

      <div className="space-y-6">
        {/* Product Header */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">{product.name}</h1>
              <p className="text-muted-foreground mt-1">by {product.vendorName}</p>
            </div>
            <StatusBadge status={product.status} />
          </div>

          {/* Category Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4 flex-wrap">
            {product.categoryPath.map((cat, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
                <span className={index === product.categoryPath.length - 1 ? 'text-foreground font-medium' : ''}>
                  {cat}
                </span>
              </span>
            ))}
          </div>

          <p className="text-sm">{product.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-muted-foreground">MOQ</p>
              <p className="text-lg font-semibold">{product.moq} units</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stock</p>
              <p className="text-lg font-semibold">{product.totalStock.toLocaleString()} units</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Variants</p>
              <p className="text-lg font-semibold">{product.variants.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="text-lg font-semibold">{product.categoryName}</p>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Variants
          </h2>

          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Attributes</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="font-mono text-sm">{variant.sku}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(variant.attributes).map(([key, value]) => (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-1 rounded bg-muted text-xs"
                          >
                            <span className="text-muted-foreground">{key}:</span>
                            <span className="ml-1 font-medium">{value}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="font-medium">${variant.price.toFixed(2)}</td>
                    <td>
                      <span className={variant.stock < 100 ? 'text-warning' : ''}>
                        {variant.stock.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
