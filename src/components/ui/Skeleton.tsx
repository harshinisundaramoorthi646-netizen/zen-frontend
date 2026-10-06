import React from 'react';
import { cn } from '../../utils/formatters';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('animate-pulse rounded-md bg-slate-200/80', className)} />;
};
