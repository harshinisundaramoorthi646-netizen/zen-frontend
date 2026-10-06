import React, { useState } from 'react';
import { FileText, CreditCard, CheckCircle2 } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/ui/Button';
import { RequirementsModal } from '../../components/clients/RequirementsModal';
import { PaymentModal } from '../../components/clients/PaymentModal';
import { Lead } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const TeamBClients: React.FC = () => {
  const { leads, requirements, payments } = usePlatformStore();
  const [activeReqLead, setActiveReqLead] = useState<Lead | null>(null);
  const [activePayLead, setActivePayLead] = useState<Lead | null>(null);

  // Selected leads become clients
  const clientLeads = leads.filter((l) => l.status === 'Selected' || requirements.some((r) => r.leadId === l.id));

  const columns: Column<Lead>[] = [
    {
      header: 'Client ID',
      accessorKey: 'id',
      sortable: true,
      cell: (row) => <span className="font-bold text-brand-700">CLI-{row.id.replace('LD-', '')}</span>,
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
      header: 'Requirement Category',
      cell: (row) => {
        const req = requirements.find((r) => r.leadId === row.id);
        return req ? (
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
            {req.category}
          </span>
        ) : (
          <span className="text-xs text-slate-400 italic">No scope saved</span>
        );
      },
    },
    {
      header: 'Payment Status',
      cell: (row) => {
        const pay = payments.find((p) => p.leadId === row.id);
        return pay ? (
          <div className="flex items-center gap-2">
            <StatusBadge status={pay.status} />
            <span className="text-xs font-bold text-slate-800">{formatCurrency(pay.paidAmount)}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Payment Pending</span>
        );
      },
    },
    {
      header: 'Area',
      accessorKey: 'area',
      sortable: true,
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActiveReqLead(row)}
            className="text-xs py-1 px-2.5"
          >
            <FileText className="h-3.5 w-3.5 mr-1" /> Edit Scope
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActivePayLead(row)}
            className="text-xs py-1 px-2.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          >
            <CreditCard className="h-3.5 w-3.5 mr-1" /> Record Payment
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Converted Clients & Requirements</h1>
          <p className="text-xs text-slate-500 mt-1">
            View selected clients, update contract scope requirements, and record financial transactions.
          </p>
        </div>
      </div>

      <DataTable
        data={clientLeads}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search clients by name, company, area..."
      />

      <RequirementsModal isOpen={!!activeReqLead} onClose={() => setActiveReqLead(null)} lead={activeReqLead} />
      <PaymentModal isOpen={!!activePayLead} onClose={() => setActivePayLead(null)} lead={activePayLead} />
    </div>
  );
};
