import React from 'react';
import { cn } from '../../utils/formatters';

export type BadgeStatus =
  | 'New'
  | 'Forwarded to Team B'
  | 'Selected'
  | 'Rejected'
  | 'Waiting'
  | 'Interested'
  | 'Not Interested'
  | 'Call Later'
  | 'No Response'
  | 'Pending'
  | 'Completed'
  | 'Overdue'
  | 'Partially Paid'
  | 'Paid'
  | 'Not Started'
  | 'Active'
  | 'On Hold'
  | 'active'
  | 'inactive';

export const StatusBadge: React.FC<{ status: BadgeStatus; className?: string }> = ({
  status,
  className,
}) => {
  const getBadgeStyle = (st: BadgeStatus) => {
    switch (st) {
      case 'Selected':
      case 'Paid':
      case 'Completed':
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'Forwarded to Team B':
      case 'Active':
      case 'Interested':
      case 'Partially Paid':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'New':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';

      case 'Waiting':
      case 'Pending':
      case 'Call Later':
        return 'bg-amber-50 text-amber-800 border-amber-200';

      case 'Rejected':
      case 'Overdue':
      case 'Not Interested':
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200';

      case 'On Hold':
      case 'Not Started':
      case 'No Response':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors select-none',
        getBadgeStyle(status),
        className
      )}
    >
      <span
        className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', {
          'bg-emerald-500': ['Selected', 'Paid', 'Completed', 'active'].includes(status),
          'bg-blue-500': ['Forwarded to Team B', 'Active', 'Interested', 'Partially Paid'].includes(status),
          'bg-indigo-500': status === 'New',
          'bg-amber-500': ['Waiting', 'Pending', 'Call Later'].includes(status),
          'bg-red-500': ['Rejected', 'Overdue', 'Not Interested', 'inactive'].includes(status),
          'bg-slate-400': ['On Hold', 'Not Started', 'No Response'].includes(status),
        })}
      />
      {status}
    </span>
  );
};
