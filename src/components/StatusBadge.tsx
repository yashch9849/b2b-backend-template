import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive' | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'status-pending' },
    approved: { label: 'Approved', className: 'status-approved' },
    rejected: { label: 'Rejected', className: 'status-rejected' },
    active: { label: 'Active', className: 'status-approved' },
    inactive: { label: 'Inactive', className: 'status-rejected' },
  };

  const config = statusConfig[status.toLowerCase()] || {
    label: status,
    className: 'bg-muted text-muted-foreground',
  };

  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
