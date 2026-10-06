import React, { useState } from 'react';
import { PhoneCall, Calendar, FileText, CreditCard } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { CallDrawerModal } from '../../components/calls/CallDrawerModal';
import { AddFollowUpModal } from '../../components/calls/AddFollowUpModal';
import { RequirementsModal } from '../../components/clients/RequirementsModal';
import { PaymentModal } from '../../components/clients/PaymentModal';
import { Lead } from '../../types';

export const TeamBLeads: React.FC = () => {
  const { leads } = usePlatformStore();
  const [statusFilter, setStatusFilter] = useState('All');

  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null);
  const [activeFollowUpLead, setActiveFollowUpLead] = useState<Lead | null>(null);
  const [activeReqLead, setActiveReqLead] = useState<Lead | null>(null);
  const [activePayLead, setActivePayLead] = useState<Lead | null>(null);

  const teamBLeads = leads.filter((l) => l.status !== 'New');

  const filteredLeads = teamBLeads.filter((l) => {
    if (statusFilter !== 'All' && l.status !== statusFilter) return false;
    return true;
  });

  const columns: Column<Lead>[] = [
    {
      header: 'Lead ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-700">{row.id}</span>,
    },
    {
      header: 'Name & Company',
      accessorKey: 'name',
      sortable: true,
      cell: (row) => (
        <div>
          <p className="font-bold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.company}</p>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessorKey: 'phone',
      cell: (row) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800">{row.phone || '—'}</p>
          <p className="text-slate-500">{row.email || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Area',
      accessorKey: 'area',
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setActiveCallLead(row)}
            className="text-xs py-1 px-2 gap-1 bg-emerald-600 hover:bg-emerald-700"
          >
            <PhoneCall className="h-3 w-3" /> Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveFollowUpLead(row)}
            className="text-xs py-1 px-2 gap-1"
          >
            <Calendar className="h-3 w-3" /> Follow-up
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setActiveReqLead(row)}
            className="text-xs py-1 px-2 gap-1"
          >
            <FileText className="h-3 w-3" /> Reqs
          </Button>
          {row.status === 'Selected' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActivePayLead(row)}
              className="text-xs py-1 px-2 gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              <CreditCard className="h-3 w-3" /> Payment
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
          <h1 className="text-xl font-bold text-slate-900">Team B Leads Queue</h1>
          <p className="text-xs text-slate-500 mt-1">
            All leads forwarded from Team A available for calling & conversion.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <label className="text-xs font-bold uppercase text-slate-600">Filter Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-slate-50 text-xs font-semibold py-1.5 px-3 focus:outline-none focus:border-brand-500"
        >
          <option value="All">All Leads ({teamBLeads.length})</option>
          <option value="Forwarded to Team B">Forwarded ({teamBLeads.filter((l) => l.status === 'Forwarded to Team B').length})</option>
          <option value="Selected">Selected ({teamBLeads.filter((l) => l.status === 'Selected').length})</option>
          <option value="Waiting">Waiting ({teamBLeads.filter((l) => l.status === 'Waiting').length})</option>
          <option value="Rejected">Rejected ({teamBLeads.filter((l) => l.status === 'Rejected').length})</option>
        </select>
      </div>

      <DataTable
        data={filteredLeads}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search queue..."
      />

      <CallDrawerModal isOpen={!!activeCallLead} onClose={() => setActiveCallLead(null)} lead={activeCallLead} />
      <AddFollowUpModal isOpen={!!activeFollowUpLead} onClose={() => setActiveFollowUpLead(null)} lead={activeFollowUpLead} />
      <RequirementsModal isOpen={!!activeReqLead} onClose={() => setActiveReqLead(null)} lead={activeReqLead} />
      <PaymentModal isOpen={!!activePayLead} onClose={() => setActivePayLead(null)} lead={activePayLead} />
    </div>
  );
};
