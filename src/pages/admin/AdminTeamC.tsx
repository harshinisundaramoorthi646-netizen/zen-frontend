import React from 'react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';

export const AdminTeamC: React.FC = () => {
  const { members, projects } = usePlatformStore();

  const teamCMembers = members.filter((m) => m.team === 'Team C');

  const activeProjects = projects.filter((p) => p.projectStatus === 'Active').length;
  const pendingProjects = projects.filter((p) => p.projectStatus === 'Pending' || p.projectStatus === 'Not Started').length;
  const completedProjects = projects.filter((p) => p.projectStatus === 'Completed').length;

  const memberBreakdown = teamCMembers.map((m) => {
    const mProjects = projects.filter((p) => p.assignedMemberId === m.id);
    return {
      ...m,
      totalAssigned: mProjects.length,
      active: mProjects.filter((p) => p.projectStatus === 'Active').length,
      completed: mProjects.filter((p) => p.projectStatus === 'Completed').length,
      avgProgress:
        mProjects.length > 0
          ? Math.round(mProjects.reduce((acc, p) => acc + p.progress, 0) / mProjects.length)
          : 0,
    };
  });

  const memberColumns: Column<typeof memberBreakdown[0]>[] = [
    {
      header: 'Software Engineer',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <img src={row.avatar} alt={row.name} className="h-7 w-7 rounded-full object-cover" />
          <span className="font-bold text-slate-900">{row.name}</span>
        </div>
      ),
    },
    {
      header: 'Total Assigned Projects',
      accessorKey: 'totalAssigned',
      sortable: true,
      cell: (row) => <span className="font-bold text-purple-700">{row.totalAssigned}</span>,
    },
    {
      header: 'Active Development',
      accessorKey: 'active',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-600">{row.active}</span>,
    },
    {
      header: 'Completed',
      accessorKey: 'completed',
      sortable: true,
      cell: (row) => <span className="font-bold text-emerald-600">{row.completed}</span>,
    },
    {
      header: 'Avg Work Progress',
      accessorKey: 'avgProgress',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
            <div className="bg-brand-600 h-full" style={{ width: `${row.avgProgress}%` }} />
          </div>
          <span className="font-mono text-xs font-bold">{row.avgProgress}%</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Admin Overview — Team C (Project Execution)</h1>
        <p className="text-xs text-slate-500 mt-1">
          Per-engineer workload allocation, project completion rates, and active development pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Team C Engineers" value={teamCMembers.length} icon={<span className="font-bold">TC</span>} variant="purple" />
        <StatCard title="Active Projects" value={activeProjects} icon={<span className="font-bold">ACT</span>} variant="brand" />
        <StatCard title="Pending Projects" value={pendingProjects} icon={<span className="font-bold">PND</span>} variant="amber" />
        <StatCard title="Completed Projects" value={completedProjects} icon={<span className="font-bold">CMP</span>} variant="emerald" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Team C Workload & Developer Performance Table</h3>
        <DataTable data={memberBreakdown} columns={memberColumns} pageSize={10} searchPlaceholder="Search Team C engineers..." />
      </div>
    </div>
  );
};
