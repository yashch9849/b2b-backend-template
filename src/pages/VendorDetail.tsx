import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { ArrowLeft, Check, X, Package, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { VendorDetail as VendorDetailType } from '@/lib/api';

// Mock data
const mockVendorDetail: VendorDetailType = {
  id: '1',
  name: 'ABC Supplies Co.',
  email: 'contact@abcsupplies.com',
  status: 'pending',
  createdAt: '2024-01-15T10:30:00Z',
  phone: '+1 (555) 123-4567',
  address: '123 Business Ave, Suite 100, New York, NY 10001',
  productsCount: 45,
  user: {
    id: 'u1',
    email: 'john@abcsupplies.com',
    name: 'John Smith',
  },
};

export default function VendorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<VendorDetailType>(mockVendorDetail);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // await vendorsApi.approve(id!);
      setVendor({ ...vendor, status: 'approved' });
      toast({
        title: 'Vendor Approved',
        description: `${vendor.name} has been approved successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve vendor. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      // await vendorsApi.reject(id!);
      setVendor({ ...vendor, status: 'rejected' });
      toast({
        title: 'Vendor Rejected',
        description: `${vendor.name} has been rejected.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject vendor. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate('/vendors')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Vendors
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold">{vendor.name}</h1>
                <p className="text-muted-foreground mt-1">Vendor ID: {vendor.id}</p>
              </div>
              <StatusBadge status={vendor.status} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{vendor.email}</span>
              </div>
              {vendor.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              {vendor.address && (
                <div className="flex items-center gap-3 text-sm md:col-span-2">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span>{vendor.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined {format(new Date(vendor.createdAt), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>{vendor.productsCount} products</span>
              </div>
            </div>
          </div>

          {/* Linked User */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Linked User Account</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{vendor.user.name}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{vendor.user.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-sm">{vendor.user.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Actions</h2>
            {vendor.status === 'pending' ? (
              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={handleApprove}
                  disabled={isLoading}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve Vendor
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleReject}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Reject Vendor
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                This vendor has already been {vendor.status}. No actions available.
              </p>
            )}
          </div>

          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Products</span>
                <span className="text-xl font-semibold">{vendor.productsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
