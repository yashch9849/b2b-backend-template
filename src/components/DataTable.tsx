import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data found',
  className,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="w-16 h-16 rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center mb-4">
          <span className="text-2xl opacity-50">∅</span>
        </div>
        <span className="font-display tracking-wider text-sm">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border/30 bg-card/40 backdrop-blur-sm', className)}>
      <table className="data-table">
        <thead>
          <tr className="border-b border-primary/20">
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick?.(item)}
              className={cn(
                onRowClick && 'cursor-pointer',
                'transition-all duration-200 hover:bg-primary/5',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {columns.map((column) => (
                <td key={column.key} className={cn('border-b border-border/20', column.className)}>
                  {column.render
                    ? column.render(item)
                    : (item as Record<string, unknown>)[column.key]?.toString() ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
