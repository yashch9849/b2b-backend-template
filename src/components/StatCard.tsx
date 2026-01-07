import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  className?: string;
  accentColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
}

export function StatCard({ title, value, icon: Icon, description, className, accentColor = 'primary' }: StatCardProps) {
  const colorMap = {
    primary: {
      bg: 'bg-primary/10',
      text: 'text-primary',
      glow: 'hsl(180 100% 50% / 0.3)',
      border: 'border-primary/20',
    },
    secondary: {
      bg: 'bg-secondary/10',
      text: 'text-secondary',
      glow: 'hsl(270 100% 65% / 0.3)',
      border: 'border-secondary/20',
    },
    accent: {
      bg: 'bg-accent/10',
      text: 'text-accent',
      glow: 'hsl(320 100% 60% / 0.3)',
      border: 'border-accent/20',
    },
    success: {
      bg: 'bg-success/10',
      text: 'text-success',
      glow: 'hsl(150 100% 45% / 0.3)',
      border: 'border-success/20',
    },
    warning: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      glow: 'hsl(45 100% 55% / 0.3)',
      border: 'border-warning/20',
    },
  };

  const colors = colorMap[accentColor];

  return (
    <div className={cn('stat-card group', colors.border, className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-display font-medium text-muted-foreground tracking-widest uppercase">
            {title}
          </p>
          <p className={cn('mt-2 text-4xl font-display font-bold', colors.text)}
            style={{ textShadow: `0 0 20px ${colors.glow}` }}
          >
            {value}
          </p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground tracking-wide">{description}</p>
          )}
        </div>
        <div 
          className={cn('p-3 rounded-lg transition-all duration-300', colors.bg, colors.border, 'border group-hover:scale-110')}
          style={{ boxShadow: `0 0 15px ${colors.glow}` }}
        >
          <Icon className={cn('w-6 h-6', colors.text)} 
            style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
          />
        </div>
      </div>
    </div>
  );
}
