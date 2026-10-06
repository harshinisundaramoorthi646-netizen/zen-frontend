import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformStore } from '../../store/usePlatformStore';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Project } from '../../types';
import { formatDate } from '../../utils/formatters';

export const AdminProjects: React.FC = () => {
  const { projects } = usePlatformStore();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = projects.filter((p) => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.projectStatus !== statusFilter) return false;
    return true;
  });

  const columns: Column<Project>[] = [
    {
      header: 'Project ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => (
        <button
          onClick={() => navigate(`/projects/${row.id}`)}
          className="font-bold text-brand-600 hover:underline"
        >
          {row.id}
        </button>
      ),
    },
    {
      header: 'Name & Company',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <button
            onClick={() => navigate(`/projects/${row.id}`)}
            className="font-bold text-slate-900 hover:text-brand-600 text-left block"
          >
            {row.name}
          </button>
          <p className="text-xs text-slate-500">{row.company}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Assigned Engineer',
      accessorKey: 'assignedMemberName',
      sortable: true,
    },
    {
      header: 'Deadline',
      accessorKey: 'deadline',
      sortable: true,
      cell: (row) => <span className="text-xs font-medium text-slate-700">{formatDate(row.deadline)}</span>,
    },
    {
      header: 'Payment',
      accessorKey: 'paymentStatus',
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      header: 'Status & Progress',
      accessorKey: 'progress',
      cell: (row) => (
        <div className="w-28 space-y-1">
          <div className="flex justify-between text-[11px] font-bold">
            <StatusBadge status={row.projectStatus} className="py-0 px-1.5 text-[9px]" />
            <span>{row.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all rounded-full ${
                row.progress === 100 ? 'bg-emerald-500' : 'bg-brand-600'
              }`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Action',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/projects/${row.id}`)}
          className="text-xs py-1 px-2.5"
        >
          View Stepper Journey
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Master Projects</h1>
          <p className="text-xs text-slate-500 mt-1">
            Global monitoring of engineering deliverables, categories, and payment statuses.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-slate-600">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold py-1.5 px-3 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Website Development">Website Development</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Advertisement / Ad Management">Advertisement / Ad Management</option>
            <option value="Testing">Testing</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-slate-600">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold py-1.5 px-3 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Not Started">Not Started</option>
            <option value="Pending">Pending</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <DataTable data={filteredProjects} columns={columns} pageSize={10} searchPlaceholder="Search projects..." />
    </div>
  );
};
