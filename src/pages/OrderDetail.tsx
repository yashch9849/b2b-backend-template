import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowLeft, Package, User, Store, Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { OrderDetail as OrderDetailType } from '@/lib/api';

// Mock data
const mockOrderDetail: OrderDetailType = {
  id: 'ORD-001',
  customerName: 'John Doe',
  vendorName: 'ABC Supplies',
  totalItems: 5,
  status: 'shipped',
  createdAt: '2024-01-20T10:30:00Z',
  items: [
    {
      id: 'item1',
      productName: 'Industrial Steel Pipes',
      variantAttributes: { Diameter: '2 inch', Length: '6 ft', Thickness: '3mm' },
      quantity: 100,
      price: 65.99,
    },
    {
      id: 'item2',
      productName: 'Safety Helmets',
      variantAttributes: { Color: 'Yellow', Size: 'L' },
      quantity: 50,
      price: 24.99,
    },
    {
      id: 'item3',
      productName: 'Work Gloves',
      variantAttributes: { Material: 'Leather', Size: 'XL' },
      quantity: 200,
      price: 12.50,
    },
  ],
  statusTimeline: [
    { status: 'pending', timestamp: '2024-01-20T10:30:00Z' },
    { status: 'confirmed', timestamp: '2024-01-20T11:15:00Z' },
    { status: 'processing', timestamp: '2024-01-20T14:00:00Z' },
    { status: 'shipped', timestamp: '2024-01-21T09:30:00Z' },
  ],
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = mockOrderDetail;

  const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate('/orders')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Orders
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Header */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold font-mono">{order.id}</h1>
                <p className="text-muted-foreground mt-1">
                  Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy \'at\' h:mm a')}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Vendor</p>
                  <p className="font-medium">{order.vendorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                  <p className="font-medium">{order.totalItems} items</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Attributes</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium">{item.productName}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(item.variantAttributes).map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-center px-2 py-0.5 rounded bg-muted text-xs"
                            >
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td className="font-medium">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/50">
                    <td colSpan={4} className="text-right font-semibold">Total Amount:</td>
                    <td className="font-bold text-lg">${totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Status Timeline
            </h2>
            <div className="space-y-4">
              {order.statusTimeline.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CheckCircle className="w-4 h-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium capitalize">{event.status}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Quantity</span>
                <span className="font-medium">
                  {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Amount</span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
