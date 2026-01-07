import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  FolderTree,
  ShoppingCart,
  Image,
  Star,
  LogOut,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vendors', label: 'Vendors', icon: Store },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/categories', label: 'Categories', icon: FolderTree },
  { path: '/orders', label: 'Orders', icon: ShoppingCart },
  { path: '/banners', label: 'Banners', icon: Image },
  { path: '/featured-products', label: 'Featured Products', icon: Star },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-background scanline">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300',
          'bg-sidebar/80 backdrop-blur-xl border-r border-primary/20',
          sidebarOpen ? 'w-64' : 'w-16'
        )}
        style={{
          boxShadow: '0 0 40px hsl(180 100% 50% / 0.1), inset -1px 0 0 hsl(180 100% 50% / 0.1)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-primary/20">
          {sidebarOpen ? (
            <h1 className="text-xl font-display font-bold text-primary glow-text tracking-wider">
              NEXUS<span className="text-secondary">ADMIN</span>
            </h1>
          ) : (
            <span className="text-xl font-display font-bold text-primary glow-text">N</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200',
                      'relative overflow-hidden group',
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-sidebar-muted hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20'
                    )}
                    style={isActive ? {
                      boxShadow: '0 0 20px hsl(180 100% 50% / 0.15), inset 0 0 20px hsl(180 100% 50% / 0.05)',
                    } : {}}
                  >
                    <Icon className={cn(
                      'w-5 h-5 flex-shrink-0 transition-all duration-200',
                      isActive && 'drop-shadow-[0_0_8px_hsl(180_100%_50%/0.8)]'
                    )} />
                    {sidebarOpen && (
                      <span className="tracking-wide">{item.label}</span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_10px_hsl(180_100%_50%/0.8)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-primary/20">
          {sidebarOpen ? (
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate tracking-wide">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-primary font-display tracking-widest">ADMIN</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-sidebar-muted hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="w-full text-sidebar-muted hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/30"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex items-center h-16 px-6 bg-card/60 backdrop-blur-xl border-b border-primary/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mr-4 text-muted-foreground hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_hsl(150_100%_45%/0.8)]" />
            <span className="text-xs text-muted-foreground font-display tracking-wider">SYSTEM ONLINE</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
