import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/lib/api';
import { cn } from '@/lib/utils';

// Mock data with nested structure
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Construction',
    parentId: null,
    isActive: true,
    productsCount: 150,
    children: [
      { id: '1a', name: 'Building Materials', parentId: '1', isActive: true, productsCount: 80, children: [] },
      { id: '1b', name: 'Tools & Equipment', parentId: '1', isActive: true, productsCount: 45, children: [] },
      { id: '1c', name: 'Safety Gear', parentId: '1', isActive: false, productsCount: 25, children: [] },
    ],
  },
  {
    id: '2',
    name: 'Electrical',
    parentId: null,
    isActive: true,
    productsCount: 200,
    children: [
      { id: '2a', name: 'Wiring', parentId: '2', isActive: true, productsCount: 90, children: [] },
      { id: '2b', name: 'Lighting', parentId: '2', isActive: true, productsCount: 60, children: [] },
      { id: '2c', name: 'Switches & Sockets', parentId: '2', isActive: true, productsCount: 50, children: [] },
    ],
  },
  {
    id: '3',
    name: 'Office Supplies',
    parentId: null,
    isActive: true,
    productsCount: 120,
    children: [
      { id: '3a', name: 'Furniture', parentId: '3', isActive: true, productsCount: 40, children: [] },
      { id: '3b', name: 'Stationery', parentId: '3', isActive: true, productsCount: 80, children: [] },
    ],
  },
];

interface CategoryNodeProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

function CategoryNode({ category, level, onEdit, onDelete }: CategoryNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          'flex items-center justify-between py-2 px-3 hover:bg-muted/50 rounded-md',
          level > 0 && 'ml-6'
        )}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          ) : (
            <span className="w-6" />
          )}
          <FolderTree className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{category.name}</span>
          <StatusBadge status={category.isActive ? 'active' : 'inactive'} />
          {category.productsCount !== undefined && (
            <span className="text-xs text-muted-foreground">
              ({category.productsCount} products)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(category)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category)}
            disabled={hasChildren || (category.productsCount || 0) > 0}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {isExpanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Categories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState(mockCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', parentId: '', isActive: true });

  const flatCategories = categories.flatMap((c) => [c, ...(c.children || [])]);

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        parentId: category.parentId || '',
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', parentId: '', isActive: true });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({ title: 'Error', description: 'Category name is required', variant: 'destructive' });
      return;
    }

    if (editingCategory) {
      toast({ title: 'Category Updated', description: `${formData.name} has been updated.` });
    } else {
      toast({ title: 'Category Created', description: `${formData.name} has been created.` });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (category: Category) => {
    if ((category.children?.length || 0) > 0) {
      toast({
        title: 'Cannot Delete',
        description: 'This category has child categories. Remove them first.',
        variant: 'destructive',
      });
      return;
    }

    if ((category.productsCount || 0) > 0) {
      toast({
        title: 'Cannot Delete',
        description: 'This category has products. Remove them first.',
        variant: 'destructive',
      });
      return;
    }

    toast({ title: 'Category Deleted', description: `${category.name} has been deleted.` });
  };

  return (
    <div>
      <div className="page-header flex items-start justify-between">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-description">Manage product categories</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No categories found. Create your first category.
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category) => (
              <CategoryNode
                key={category.id}
                category={category}
                level={0}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent">Parent Category</Label>
              <Select
                value={formData.parentId || "none"}
                onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Parent (Root Level)</SelectItem>
                  {flatCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
