import React from 'react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { DataTable, Column } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Lead } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const AdminClients: React.FC = () => {
  const { leads, requirements, payments } = usePlatformStore();

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
      header: 'Area / Location',
      accessorKey: 'area',
      sortable: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Admin Clients Register</h1>
          <p className="text-xs text-slate-500 mt-1">Master list of converted client accounts, scope categories, and financial status.</p>
        </div>
      </div>

      <DataTable data={clientLeads} columns={columns} pageSize={10} searchPlaceholder="Search clients..." />
    </div>
  );
};
