import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Sliders, CheckCircle2, Eye } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { projectService } from '../../services';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { UpdateProgressModal } from '../../components/projects/UpdateProgressModal';
import { ViewRequirementsModal } from '../../components/projects/ViewRequirementsModal';
import { Project } from '../../types';
import { formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export const TeamCProjects: React.FC = () => {
  const { projects, members } = usePlatformStore();
  const navigate = useNavigate();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [memberFilter, setMemberFilter] = useState('All');

  const [activeProgressProject, setActiveProgressProject] = useState<Project | null>(null);
  const [activeReqProject, setActiveReqProject] = useState<Project | null>(null);
  const [completeConfirmProject, setCompleteConfirmProject] = useState<Project | null>(null);

  const teamCMembers = members.filter((m) => m.team === 'Team C');

  const filteredProjects = projects.filter((p) => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.projectStatus !== statusFilter) return false;
    if (memberFilter !== 'All' && p.assignedMemberId !== memberFilter) return false;
    return true;
  });

  const handleStartProject = async (projectId: string) => {
    try {
      await projectService.updateProjectStatus(projectId, 'Active');
      toast.success(`Project ${projectId} started!`);
    } catch {
      toast.error('Failed to start project.');
    }
  };

  const handleConfirmCompletion = async () => {
    if (!completeConfirmProject) return;
    try {
      await projectService.updateProjectStatus(completeConfirmProject.id, 'Completed');
      toast.success(`Project ${completeConfirmProject.id} marked as Completed!`);
      setCompleteConfirmProject(null);
    } catch {
      toast.error('Failed to complete project.');
    }
  };

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
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-800">{row.assignedMemberName}</span>
      ),
    },
    {
      header: 'Deadline',
      accessorKey: 'deadline',
      sortable: true,
      cell: (row) => <span className="text-xs font-medium text-slate-700">{formatDate(row.deadline)}</span>,
    },
    {
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      header: 'Progress',
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
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveReqProject(row)}
            className="text-xs py-1 px-2 gap-1"
          >
            <Eye className="h-3.5 w-3.5" /> Specs
          </Button>

          {row.projectStatus === 'Not Started' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleStartProject(row.id)}
              className="text-xs py-1 px-2 gap-1 bg-brand-600"
            >
              <PlayCircle className="h-3.5 w-3.5" /> Start
            </Button>
          )}

          {row.projectStatus !== 'Completed' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setActiveProgressProject(row)}
              className="text-xs py-1 px-2 gap-1"
            >
              <Sliders className="h-3.5 w-3.5" /> Progress
            </Button>
          )}

          {row.projectStatus !== 'Completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCompleteConfirmProject(row)}
              className="text-xs py-1 px-2 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Team C Projects Register</h1>
          <p className="text-xs text-slate-500 mt-1">
            Filter by project categories, monitor engineering progress, and deliver projects.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
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

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase text-slate-600">Engineer:</label>
          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold py-1.5 px-3 focus:outline-none"
          >
            <option value="All">All Engineers</option>
            {teamCMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        data={filteredProjects}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search projects..."
      />

      <UpdateProgressModal isOpen={!!activeProgressProject} onClose={() => setActiveProgressProject(null)} project={activeProgressProject} />
      <ViewRequirementsModal isOpen={!!activeReqProject} onClose={() => setActiveReqProject(null)} project={activeReqProject} />
      <ConfirmDialog
        isOpen={!!completeConfirmProject}
        onClose={() => setCompleteConfirmProject(null)}
        onConfirm={handleConfirmCompletion}
        title="Mark Project Completed?"
        message={`Confirm final sign-off for ${completeConfirmProject?.name}?`}
        confirmText="Mark Completed"
        variant="success"
      />
    </div>
  );
};
