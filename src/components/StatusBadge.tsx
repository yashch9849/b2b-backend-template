import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; className: string; glow: string }> = {
    pending: { 
      label: 'PENDING', 
      className: 'bg-warning/20 text-warning border-warning/40',
      glow: '0 0 10px hsl(45 100% 55% / 0.4)'
    },
    approved: { 
      label: 'APPROVED', 
      className: 'bg-success/20 text-success border-success/40',
      glow: '0 0 10px hsl(150 100% 45% / 0.4)'
    },
    rejected: { 
      label: 'REJECTED', 
      className: 'bg-destructive/20 text-destructive border-destructive/40',
      glow: '0 0 10px hsl(0 90% 55% / 0.4)'
    },
    active: { 
      label: 'ACTIVE', 
      className: 'bg-success/20 text-success border-success/40',
      glow: '0 0 10px hsl(150 100% 45% / 0.4)'
    },
    inactive: { 
      label: 'INACTIVE', 
      className: 'bg-muted text-muted-foreground border-border',
      glow: 'none'
    },
    confirmed: {
      label: 'CONFIRMED',
      className: 'bg-primary/20 text-primary border-primary/40',
      glow: '0 0 10px hsl(180 100% 50% / 0.4)'
    },
    shipped: {
      label: 'SHIPPED',
      className: 'bg-secondary/20 text-secondary border-secondary/40',
      glow: '0 0 10px hsl(270 100% 65% / 0.4)'
    },
    delivered: {
      label: 'DELIVERED',
      className: 'bg-success/20 text-success border-success/40',
      glow: '0 0 10px hsl(150 100% 45% / 0.4)'
    },
    cancelled: {
      label: 'CANCELLED',
      className: 'bg-destructive/20 text-destructive border-destructive/40',
      glow: '0 0 10px hsl(0 90% 55% / 0.4)'
    },
    processing: {
      label: 'PROCESSING',
      className: 'bg-accent/20 text-accent border-accent/40',
      glow: '0 0 10px hsl(320 100% 60% / 0.4)'
    },
  };

  const config = statusConfig[status.toLowerCase()] || {
    label: status.toUpperCase(),
    className: 'bg-muted text-muted-foreground border-border',
    glow: 'none',
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center px-3 py-1 rounded text-[10px] font-display font-semibold tracking-widest uppercase border',
        config.className, 
        className
      )}
      style={{ boxShadow: config.glow }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 animate-pulse" />
      {config.label}
    </span>
  );
}
