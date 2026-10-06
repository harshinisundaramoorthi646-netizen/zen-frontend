import React, { useState } from 'react';
import { CheckCircle2, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { followUpService } from '../../services';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { FollowUp } from '../../types';
import { formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export const TeamBFollowUps: React.FC = () => {
  const { followUps, leads } = usePlatformStore();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed' | 'Overdue'>('All');

  const filteredFollowUps = followUps.filter((f) => {
    if (filter !== 'All' && f.status !== filter) return false;
    return true;
  });

  const handleMarkCompleted = async (id: string) => {
    try {
      await followUpService.completeFollowUp(id);
      toast.success('Follow-up marked as Completed!');
    } catch {
      toast.error('Failed to complete follow-up.');
    }
  };

  const columns: Column<FollowUp>[] = [
    {
      header: 'Follow-up ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-700">{row.id}</span>,
    },
    {
      header: 'Lead / Prospect',
      accessorKey: 'leadId',
      cell: (row) => {
        const lead = leads.find((l) => l.id === row.leadId);
        return (
          <div>
            <p className="font-bold text-slate-900">{lead?.name || row.leadId}</p>
            <p className="text-xs text-slate-500">{lead?.company || 'Company'}</p>
          </div>
        );
      },
    },
    {
      header: 'Date & Time',
      accessorKey: 'date',
      sortable: true,
      cell: (row) => (
        <div className="text-xs">
          <p className="font-bold text-slate-800">{formatDate(row.date)}</p>
          <p className="text-slate-500 font-medium">{row.time}</p>
        </div>
      ),
    },
    {
      header: 'Assigned Member',
      accessorKey: 'memberName',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.memberName}
        </span>
      ),
    },
    {
      header: 'Agenda / Notes',
      accessorKey: 'notes',
      cell: (row) => <p className="text-xs text-slate-600 max-w-xs truncate">{row.notes}</p>,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      cell: (row) =>
        row.status !== 'Completed' ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMarkCompleted(row.id)}
            className="text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mark Complete
          </Button>
        ) : (
          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Done
          </span>
        ),
    },
  ];

  const pendingCount = followUps.filter((f) => f.status === 'Pending').length;
  const overdueCount = followUps.filter((f) => f.status === 'Overdue').length;
  const completedCount = followUps.filter((f) => f.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Follow-up Calendar & Schedule</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track upcoming prospect follow-ups and complete scheduled calls.
          </p>
        </div>
      </div>

      {/* Metric Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter('All')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filter === 'All' ? 'border-brand-500 bg-brand-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-semibold text-slate-500">Total Scheduled</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{followUps.length}</h3>
        </button>

        <button
          onClick={() => setFilter('Pending')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filter === 'Pending' ? 'border-blue-500 bg-blue-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Pending
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</h3>
        </button>

        <button
          onClick={() => setFilter('Overdue')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filter === 'Overdue' ? 'border-red-500 bg-red-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-semibold text-red-600 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Overdue
          </p>
          <h3 className="text-2xl font-bold text-red-600 mt-1">{overdueCount}</h3>
        </button>

        <button
          onClick={() => setFilter('Completed')}
          className={`p-4 rounded-xl border text-left transition-all ${
            filter === 'Completed' ? 'border-emerald-500 bg-emerald-50/50 shadow-xs' : 'border-slate-200 bg-white hover:bg-slate-50'
          }`}
        >
          <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedCount}</h3>
        </button>
      </div>

      <DataTable
        data={filteredFollowUps}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search follow-ups..."
      />
    </div>
  );
};
