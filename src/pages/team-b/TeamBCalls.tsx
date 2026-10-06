import React from 'react';
import { PhoneCall, Clock, UserCheck } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Call } from '../../types';
import { formatDuration, formatDateTime } from '../../utils/formatters';

export const TeamBCalls: React.FC = () => {
  const { calls, leads, members } = usePlatformStore();

  const teamBMembers = members.filter((m) => m.team === 'Team B');

  // Calculate talk time breakdown per member
  const memberCallStats = teamBMembers.map((m) => {
    const memberCalls = calls.filter((c) => c.memberId === m.id);
    const totalSec = memberCalls.reduce((sum, c) => sum + c.durationSeconds, 0);
    return {
      member: m,
      callsCount: memberCalls.length,
      totalTalkTime: formatDuration(totalSec),
      interestedCount: memberCalls.filter((c) => c.outcome === 'Interested' || c.outcome === 'Selected').length,
    };
  });

  const columns: Column<Call>[] = [
    {
      header: 'Call ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-700">{row.id}</span>,
    },
    {
      header: 'Lead / Company',
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
      header: 'Caller (Team B)',
      accessorKey: 'memberName',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.memberName}
        </span>
      ),
    },
    {
      header: 'Call Time',
      accessorKey: 'startTime',
      sortable: true,
      cell: (row) => <span className="text-xs font-medium text-slate-700">{formatDateTime(row.startTime)}</span>,
    },
    {
      header: 'Duration',
      accessorKey: 'durationSeconds',
      sortable: true,
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
          {formatDuration(row.durationSeconds)}
        </span>
      ),
    },
    {
      header: 'Outcome',
      accessorKey: 'outcome',
      cell: (row) => <StatusBadge status={row.outcome as any} />,
    },
    {
      header: 'Discussion Notes',
      accessorKey: 'notes',
      cell: (row) => <p className="text-xs text-slate-600 max-w-xs truncate">{row.notes}</p>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Call History & Activity Workspace</h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete record of call durations, outcomes, and caller performance metrics.
          </p>
        </div>
      </div>

      {/* Member Talk Time Performance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {memberCallStats.map((stat) => (
          <div key={stat.member.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={stat.member.avatar}
                alt={stat.member.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-brand-500/20"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{stat.member.name}</h4>
                <p className="text-xs text-slate-500">{stat.member.email}</p>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Calls Logged:</span>
              <span className="font-bold text-slate-900">{stat.callsCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total Talk Time:</span>
              <span className="font-bold text-emerald-600">{stat.totalTalkTime}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Calls Table */}
      <DataTable
        data={calls}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search calls by lead, caller, outcome..."
      />
    </div>
  );
};
