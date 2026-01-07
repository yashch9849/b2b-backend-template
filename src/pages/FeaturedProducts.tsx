import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable } from '@/components/DataTable';
import { Plus, Trash2, Star, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { FeaturedProduct, Product } from '@/lib/api';

// Mock data
const mockFeaturedProducts: FeaturedProduct[] = [
  { id: '1', productId: 'p1', productName: 'Industrial Steel Pipes', priority: 1 },
  { id: '2', productId: 'p2', productName: 'LED Panel Lights', priority: 2 },
  { id: '3', productId: 'p3', productName: 'Office Chairs Ergonomic', priority: 3 },
];

const mockProducts: Product[] = [
  { id: 'p1', name: 'Industrial Steel Pipes', vendorName: 'ABC Supplies', categoryName: 'Building Materials', moq: 100, status: 'active' },
  { id: 'p2', name: 'LED Panel Lights', vendorName: 'Tech Wholesale', categoryName: 'Lighting', moq: 50, status: 'active' },
  { id: 'p3', name: 'Office Chairs Ergonomic', vendorName: 'Premium Distributors', categoryName: 'Office Furniture', moq: 20, status: 'active' },
  { id: 'p4', name: 'Packaging Boxes Cardboard', vendorName: 'Global Parts', categoryName: 'Packaging', moq: 500, status: 'active' },
  { id: 'p5', name: 'Safety Helmets Industrial', vendorName: 'XYZ Trading', categoryName: 'Safety Equipment', moq: 100, status: 'active' },
  { id: 'p6', name: 'Copper Wire 2.5mm', vendorName: 'ABC Supplies', categoryName: 'Electrical', moq: 1000, status: 'active' },
];

export default function FeaturedProducts() {
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState(mockFeaturedProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [priority, setPriority] = useState('');
  const [open, setOpen] = useState(false);

  const availableProducts = mockProducts.filter(
    (p) => !featuredProducts.some((fp) => fp.productId === p.id)
  );

  const handleAdd = () => {
    if (!selectedProduct) {
      toast({ title: 'Error', description: 'Please select a product', variant: 'destructive' });
      return;
    }

    if (!priority || isNaN(parseInt(priority))) {
      toast({ title: 'Error', description: 'Please enter a valid priority', variant: 'destructive' });
      return;
    }

    const newFeatured: FeaturedProduct = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      priority: parseInt(priority),
    };

    setFeaturedProducts([...featuredProducts, newFeatured].sort((a, b) => a.priority - b.priority));
    setSelectedProduct(null);
    setPriority('');
    setIsDialogOpen(false);
    toast({ title: 'Product Featured', description: `${selectedProduct.name} is now featured.` });
  };

  const handleRemove = (id: string) => {
    const product = featuredProducts.find((fp) => fp.id === id);
    setFeaturedProducts(featuredProducts.filter((fp) => fp.id !== id));
    toast({ title: 'Product Removed', description: `${product?.productName} is no longer featured.` });
  };

  const columns = [
    {
      key: 'priority',
      header: 'Priority',
      render: (item: FeaturedProduct) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
          {item.priority}
        </span>
      ),
    },
    { key: 'productName', header: 'Product Name' },
    { key: 'productId', header: 'Product ID', render: (item: FeaturedProduct) => <span className="font-mono text-sm">{item.productId}</span> },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: FeaturedProduct) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleRemove(item.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Star className="w-6 h-6 text-warning" />
            Featured Products
          </h1>
          <p className="page-description">Manage featured products on the homepage</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} disabled={availableProducts.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Add Featured Product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={featuredProducts}
        keyExtractor={(item) => item.id}
        emptyMessage="No featured products. Add products to feature them on the homepage."
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Featured Product</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Select Product</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedProduct ? selectedProduct.name : 'Search products...'}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {availableProducts.map((product) => (
                          <CommandItem
                            key={product.id}
                            value={product.name}
                            onSelect={() => {
                              setSelectedProduct(product);
                              setOpen(false);
                            }}
                          >
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {product.vendorName} · {product.categoryName}
                              </p>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Order</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                placeholder="1"
              />
              <p className="text-xs text-muted-foreground">
                Lower numbers appear first on the homepage
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd}>Add to Featured</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
