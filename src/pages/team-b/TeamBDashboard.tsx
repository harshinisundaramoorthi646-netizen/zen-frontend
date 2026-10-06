import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, Calendar, CheckCircle2, XCircle, Clock, FileText, CreditCard, Users, ArrowUpRight } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { StatCard } from '../../components/common/StatCard';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { CallDrawerModal } from '../../components/calls/CallDrawerModal';
import { AddFollowUpModal } from '../../components/calls/AddFollowUpModal';
import { RequirementsModal } from '../../components/clients/RequirementsModal';
import { PaymentModal } from '../../components/clients/PaymentModal';
import { Lead } from '../../types';
import { formatDuration } from '../../utils/formatters';

export const TeamBDashboard: React.FC = () => {
  const { leads, calls, followUps, payments } = usePlatformStore();
  const navigate = useNavigate();

  const [activeCallLead, setActiveCallLead] = useState<Lead | null>(null);
  const [activeFollowUpLead, setActiveFollowUpLead] = useState<Lead | null>(null);
  const [activeReqLead, setActiveReqLead] = useState<Lead | null>(null);
  const [activePayLead, setActivePayLead] = useState<Lead | null>(null);

  // Calculate metrics
  const leadsReceived = leads.filter((l) => l.status !== 'New').length;
  const selectedCount = leads.filter((l) => l.status === 'Selected').length;
  const rejectedCount = leads.filter((l) => l.status === 'Rejected').length;
  const waitingCount = leads.filter((l) => l.status === 'Waiting').length;
  const completedCallsCount = calls.length;
  const pendingFollowupsCount = followUps.filter((f) => f.status === 'Pending').length;
  const completedFollowupsCount = followUps.filter((f) => f.status === 'Completed').length;
  const totalSeconds = calls.reduce((acc, c) => acc + c.durationSeconds, 0);

  const columns: Column<Lead>[] = [
    {
      header: 'Lead ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-700">{row.id}</span>,
    },
    {
      header: 'Client & Company',
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
      header: 'Actions Workflow',
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

  const teamBLeads = leads.filter((l) => l.status !== 'New');

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-2">
            Team B Workstation
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">Calling & Follow-up Center</h1>
          <p className="text-xs text-blue-200 mt-1">
            Execute prospect calls, log discussion outcomes, manage follow-up calendars, and collect requirements.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => navigate('/team-b/follow-ups')}
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs font-bold"
          >
            <Calendar className="h-4 w-4 mr-1" /> Follow-up Calendar
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/team-b/calls')}
            className="bg-brand-500 text-white hover:bg-brand-600 text-xs font-bold"
          >
            <PhoneCall className="h-4 w-4 mr-1" /> Call Workspace
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard
          title="Received"
          value={leadsReceived}
          icon={<Users className="h-4 w-4" />}
          variant="brand"
        />
        <StatCard
          title="Selected"
          value={selectedCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
          variant="emerald"
        />
        <StatCard
          title="Waiting"
          value={waitingCount}
          icon={<Clock className="h-4 w-4" />}
          variant="amber"
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={<XCircle className="h-4 w-4" />}
          variant="slate"
        />
        <StatCard
          title="Calls Done"
          value={completedCallsCount}
          icon={<PhoneCall className="h-4 w-4" />}
          variant="blue"
        />
        <StatCard
          title="Pending FLP"
          value={pendingFollowupsCount}
          icon={<Calendar className="h-4 w-4" />}
          variant="amber"
        />
        <StatCard
          title="Done FLP"
          value={completedFollowupsCount}
          icon={<CheckCircle2 className="h-4 w-4" />}
          variant="emerald"
        />
        <StatCard
          title="Talk Time"
          value={formatDuration(totalSeconds)}
          icon={<Clock className="h-4 w-4" />}
          variant="purple"
        />
      </div>

      {/* Leads Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Leads Queue (Forwarded from Team A)</h3>
            <p className="text-xs text-slate-500">Click Call to open live timer call logger</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/team-b/leads')}
            className="text-xs text-brand-600"
          >
            View All Leads Queue <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        <DataTable
          data={teamBLeads}
          columns={columns}
          pageSize={8}
          searchPlaceholder="Search leads in queue..."
          searchFields={['name', 'company', 'area', 'phone', 'email']}
        />
      </div>

      {/* Modals */}
      <CallDrawerModal
        isOpen={!!activeCallLead}
        onClose={() => setActiveCallLead(null)}
        lead={activeCallLead}
      />

      <AddFollowUpModal
        isOpen={!!activeFollowUpLead}
        onClose={() => setActiveFollowUpLead(null)}
        lead={activeFollowUpLead}
      />

      <RequirementsModal
        isOpen={!!activeReqLead}
        onClose={() => setActiveReqLead(null)}
        lead={activeReqLead}
      />

      <PaymentModal
        isOpen={!!activePayLead}
        onClose={() => setActivePayLead(null)}
        lead={activePayLead}
      />
    </div>
  );
};
