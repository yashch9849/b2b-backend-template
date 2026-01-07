import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Banner } from '@/lib/api';

// Mock data
const mockBanners: Banner[] = [
  { id: '1', imageUrl: 'https://picsum.photos/seed/banner1/800/300', isActive: true, createdAt: '2024-01-20T10:30:00Z' },
  { id: '2', imageUrl: 'https://picsum.photos/seed/banner2/800/300', isActive: true, createdAt: '2024-01-18T14:20:00Z' },
  { id: '3', imageUrl: 'https://picsum.photos/seed/banner3/800/300', isActive: false, createdAt: '2024-01-15T09:15:00Z' },
];

export default function Banners() {
  const { toast } = useToast();
  const [banners, setBanners] = useState(mockBanners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleCreate = () => {
    if (!imageUrl.trim()) {
      toast({ title: 'Error', description: 'Image URL is required', variant: 'destructive' });
      return;
    }

    const newBanner: Banner = {
      id: Date.now().toString(),
      imageUrl,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setBanners([newBanner, ...banners]);
    setImageUrl('');
    setIsDialogOpen(false);
    toast({ title: 'Banner Created', description: 'Banner has been added successfully.' });
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
    toast({ title: 'Banner Deleted', description: 'Banner has been removed.' });
  };

  const toggleActive = (id: string) => {
    setBanners(
      banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    toast({ title: 'Banner Updated', description: 'Banner status has been updated.' });
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Banners</h1>
          <p className="page-description">Manage homepage banners</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="bg-card rounded-lg border p-12 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No banners yet. Add your first banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-card rounded-lg border overflow-hidden">
              <div className="aspect-[8/3] bg-muted">
                <img
                  src={banner.imageUrl}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={banner.isActive ? 'active' : 'inactive'} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Added {format(new Date(banner.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(banner.id)}
                  >
                    {banner.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(banner.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Banner</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/banner.jpg"
              />
            </div>

            {imageUrl && (
              <div className="aspect-[8/3] bg-muted rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x300?text=Invalid+URL';
                  }}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Add Banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
