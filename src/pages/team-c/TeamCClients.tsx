import React, { useState } from 'react';
import { Eye, Briefcase } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { ViewRequirementsModal } from '../../components/projects/ViewRequirementsModal';
import { Project } from '../../types';

export const TeamCClients: React.FC = () => {
  const { projects } = usePlatformStore();
  const [activeReqProject, setActiveReqProject] = useState<Project | null>(null);

  const columns: Column<Project>[] = [
    {
      header: 'Client ID',
      accessorKey: 'clientId',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-700">{row.clientId}</span>,
    },
    {
      header: 'Client Name & Company',
      accessorKey: 'clientName',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.clientName}</p>
          <p className="text-xs text-slate-500">{row.company}</p>
        </div>
      ),
    },
    {
      header: 'Associated Project',
      accessorKey: 'name',
      cell: (row) => <span className="font-medium text-slate-800 text-xs">{row.name}</span>,
    },
    {
      header: 'Category',
      accessorKey: 'category',
      cell: (row) => (
        <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
          {row.category}
        </span>
      ),
    },
    {
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      cell: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      header: 'Project Status',
      accessorKey: 'projectStatus',
      cell: (row) => <StatusBadge status={row.projectStatus} />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setActiveReqProject(row)}
          className="text-xs py-1 px-2.5"
        >
          <Eye className="h-3.5 w-3.5 mr-1" /> View Scope & Specs
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Team C Client Register</h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse clients with active project deliverables and inspect technical specifications.
          </p>
        </div>
      </div>

      <DataTable
        data={projects}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search clients by name, company, category..."
      />

      <ViewRequirementsModal
        isOpen={!!activeReqProject}
        onClose={() => setActiveReqProject(null)}
        project={activeReqProject}
      />
    </div>
  );
};
