import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  onView,
}: DataTableProps<T>) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((column) => (
              <TableHead
                key={column.key as string}
                className={cn('font-semibold', column.className)}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-10 text-muted-foreground"
              >
                No data available
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${column.key as string}`} className={column.className}>
                    {column.key === 'actions' ? (
                      <div className="flex items-center gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onView && (
                              <DropdownMenuItem onClick={() => onView(item)}>
                                <Eye size={14} className="mr-2" />
                                View
                              </DropdownMenuItem>
                            )}
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(item)}>
                                <Pencil size={14} className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {onDelete && (
                              <DropdownMenuItem
                                onClick={() => onDelete(item)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : column.render ? (
                      column.render(item)
                    ) : (
                      String(item[column.key as keyof T] ?? '')
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { className: string; label: string }> = {
    new: { className: 'bg-info/20 text-info border-info/30', label: 'New' },
    contacted: { className: 'bg-warning/20 text-warning border-warning/30', label: 'Contacted' },
    quoted: { className: 'bg-primary/20 text-primary border-primary/30', label: 'Quoted' },
    closed: { className: 'bg-success/20 text-success border-success/30', label: 'Closed' },
    read: { className: 'bg-muted text-muted-foreground border-border', label: 'Read' },
    replied: { className: 'bg-success/20 text-success border-success/30', label: 'Replied' },
    completed: { className: 'bg-success/20 text-success border-success/30', label: 'Completed' },
    ongoing: { className: 'bg-info/20 text-info border-info/30', label: 'Ongoing' },
    upcoming: { className: 'bg-warning/20 text-warning border-warning/30', label: 'Upcoming' },
    published: { className: 'bg-success/20 text-success border-success/30', label: 'Published' },
    draft: { className: 'bg-muted text-muted-foreground border-border', label: 'Draft' },
  };

  const variant = variants[status] || { className: 'bg-muted text-muted-foreground', label: status };

  return (
    <Badge variant="outline" className={cn('font-medium', variant.className)}>
      {variant.label}
    </Badge>
  );
}
