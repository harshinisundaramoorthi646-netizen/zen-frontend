import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, CheckCircle2, Clock, PlayCircle, Eye, Sliders, ArrowUpRight, UserCheck } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { projectService } from '../../services';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Button } from '../../components/ui/Button';
import { UpdateProgressModal } from '../../components/projects/UpdateProgressModal';
import { ViewRequirementsModal } from '../../components/projects/ViewRequirementsModal';
import { Project } from '../../types';
import { formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export const TeamCDashboard: React.FC = () => {
  const { projects, currentUser } = usePlatformStore();
  const navigate = useNavigate();

  const [activeProgressProject, setActiveProgressProject] = useState<Project | null>(null);
  const [activeReqProject, setActiveReqProject] = useState<Project | null>(null);
  const [completeConfirmProject, setCompleteConfirmProject] = useState<Project | null>(null);

  // Metrics
  const totalClients = new Set(projects.map((p) => p.clientId)).size;
  const activeProjects = projects.filter((p) => p.projectStatus === 'Active').length;
  const pendingProjects = projects.filter((p) => p.projectStatus === 'Pending' || p.projectStatus === 'Not Started').length;
  const completedProjects = projects.filter((p) => p.projectStatus === 'Completed').length;
  const myAssignedProjects = projects.filter((p) => p.assignedMemberId === currentUser.id).length;

  const handleStartProject = async (projectId: string) => {
    try {
      await projectService.updateProjectStatus(projectId, 'Active');
      toast.success(`Project ${projectId} started!`, {
        description: 'Status updated to Active.',
      });
    } catch {
      toast.error('Failed to start project.');
    }
  };

  const handleConfirmCompletion = async () => {
    if (!completeConfirmProject) return;
    try {
      await projectService.updateProjectStatus(completeConfirmProject.id, 'Completed');
      toast.success(`Project ${completeConfirmProject.id} marked as Completed!`, {
        description: 'Production sign-off recorded in activity timeline.',
      });
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
      header: 'Project Name & Client',
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
      header: 'Assigned Lead',
      accessorKey: 'assignedMemberName',
      sortable: true,
      cell: (row) => (
        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
          <UserCheck className="h-3.5 w-3.5 text-brand-600" />
          {row.assignedMemberName}
        </span>
      ),
    },
    {
      header: 'Dates',
      accessorKey: 'startDate',
      cell: (row) => (
        <div className="text-xs">
          <p className="text-slate-800">Start: {formatDate(row.startDate)}</p>
          <p className="text-slate-500">Due: {formatDate(row.deadline)}</p>
        </div>
      ),
    },
    {
      header: 'Payment',
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
            title="View Requirements & Financial Scope"
            className="text-xs py-1 px-2 gap-1"
          >
            <Eye className="h-3.5 w-3.5" /> Reqs
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
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-xs font-bold uppercase tracking-wider mb-2">
            Team C Workstation
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Project Execution Hub</h1>
          <p className="text-xs text-purple-200 mt-1">
            Build, test, track milestones, update completion progress, and deliver projects to clients.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/team-c/projects')}
          className="bg-white text-purple-900 hover:bg-purple-50 font-bold text-xs shrink-0"
        >
          <FolderKanban className="h-4 w-4 mr-1 text-purple-700" /> View All Projects
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Clients"
          value={totalClients}
          icon={<FolderKanban className="h-5 w-5" />}
          variant="purple"
        />
        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon={<PlayCircle className="h-5 w-5" />}
          variant="brand"
        />
        <StatCard
          title="Pending / Unstarted"
          value={pendingProjects}
          icon={<Clock className="h-5 w-5" />}
          variant="amber"
        />
        <StatCard
          title="Completed"
          value={completedProjects}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="emerald"
        />
        <StatCard
          title="Assigned to Me"
          value={myAssignedProjects}
          subtext={currentUser.name}
          icon={<UserCheck className="h-5 w-5" />}
          variant="blue"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active & Assigned Projects</h3>
            <p className="text-xs text-slate-500">Auto-created when Team B saves scope requirements</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/team-c/projects')}
            className="text-xs text-brand-600"
          >
            All Projects Table <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        <DataTable
          data={projects}
          columns={columns}
          pageSize={8}
          searchPlaceholder="Search projects by ID, name, company, dev..."
          searchFields={['id', 'name', 'company', 'category', 'assignedMemberName']}
        />
      </div>

      {/* Modals & Dialogs */}
      <UpdateProgressModal
        isOpen={!!activeProgressProject}
        onClose={() => setActiveProgressProject(null)}
        project={activeProgressProject}
      />

      <ViewRequirementsModal
        isOpen={!!activeReqProject}
        onClose={() => setActiveReqProject(null)}
        project={activeReqProject}
      />

      <ConfirmDialog
        isOpen={!!completeConfirmProject}
        onClose={() => setCompleteConfirmProject(null)}
        onConfirm={handleConfirmCompletion}
        title="Mark Project as Completed?"
        message={`Are you sure you want to mark ${completeConfirmProject?.name} (${completeConfirmProject?.id}) as 100% completed? This will set final completion status across Admin dashboards.`}
        confirmText="Confirm Completion"
        variant="success"
      />
    </div>
  );
};
