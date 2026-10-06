import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import { usePlatformStore } from '../../store/usePlatformStore';
import { StatCard } from '../../components/common/StatCard';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { FileBarChart2, Users, PhoneCall, CheckCircle2, CreditCard, Layers } from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { members, leads, calls, followUps, payments, projects } = usePlatformStore();

  const teamAMembers = members.filter((m) => m.team === 'Team A');
  const teamBMembers = members.filter((m) => m.team === 'Team B');

  // Chart 1: Leads per Team A member
  const teamALeadsChartData = teamAMembers.map((m) => {
    const mLeads = leads.filter((l) => l.generatedByMemberId === m.id);
    return {
      name: m.name.split(' ')[0],
      total: mLeads.length,
      selected: mLeads.filter((l) => l.status === 'Selected').length,
    };
  });

  // Chart 2: Lead Status Distribution (Pie / Donut)
  const leadStatusPieData = [
    { name: 'Selected', value: leads.filter((l) => l.status === 'Selected').length, color: '#10b981' },
    { name: 'Forwarded', value: leads.filter((l) => l.status === 'Forwarded to Team B').length, color: '#3b82f6' },
    { name: 'Waiting', value: leads.filter((l) => l.status === 'Waiting').length, color: '#f59e0b' },
    { name: 'New', value: leads.filter((l) => l.status === 'New').length, color: '#6366f1' },
    { name: 'Rejected', value: leads.filter((l) => l.status === 'Rejected').length, color: '#ef4444' },
  ];

  // Chart 3: Team B Call Performance & Talk Time
  const teamBCallChartData = teamBMembers.map((m) => {
    const mCalls = calls.filter((c) => c.memberId === m.id);
    const totalSec = mCalls.reduce((sum, c) => sum + c.durationSeconds, 0);
    return {
      name: m.name.split(' ')[0],
      callsCount: mCalls.length,
      talkTimeMinutes: Math.round(totalSec / 60),
    };
  });

  // Chart 4: Payment Status Breakdown
  const paymentStatusPieData = [
    { name: 'Paid Full', value: payments.filter((p) => p.status === 'Paid').length, color: '#10b981' },
    { name: 'Partially Paid', value: payments.filter((p) => p.status === 'Partially Paid').length, color: '#3b82f6' },
    { name: 'Pending', value: payments.filter((p) => p.status === 'Pending').length, color: '#f59e0b' },
  ];

  // Chart 5: Team C Project Status Breakdown
  const projectStatusData = [
    { name: 'Active', value: projects.filter((p) => p.projectStatus === 'Active').length, color: '#3b82f6' },
    { name: 'Completed', value: projects.filter((p) => p.projectStatus === 'Completed').length, color: '#10b981' },
    { name: 'Pending', value: projects.filter((p) => p.projectStatus === 'Pending' || p.projectStatus === 'Not Started').length, color: '#f59e0b' },
    { name: 'On Hold', value: projects.filter((p) => p.projectStatus === 'On Hold').length, color: '#64748b' },
  ];

  const totalRevenueCollected = payments
    .filter((p) => p.status === 'Paid' || p.status === 'Partially Paid')
    .reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileBarChart2 className="h-5 w-5 text-brand-600" />
            <h1 className="text-xl font-bold text-slate-900">Analytics & Performance Reports</h1>
          </div>
          <p className="text-xs text-slate-500">
            Cross-team pipeline analytics, conversion funnels, call metrics, and financial reports.
          </p>
        </div>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Leads" value={leads.length} icon={<Users className="h-5 w-5" />} variant="brand" />
        <StatCard title="Calls Completed" value={calls.length} icon={<PhoneCall className="h-5 w-5" />} variant="blue" />
        <StatCard title="Selected Leads" value={leads.filter((l) => l.status === 'Selected').length} icon={<CheckCircle2 className="h-5 w-5" />} variant="emerald" />
        <StatCard title="Projects Delivered" value={projects.filter((p) => p.projectStatus === 'Completed').length} icon={<Layers className="h-5 w-5" />} variant="purple" />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenueCollected)} icon={<CreditCard className="h-5 w-5" />} variant="emerald" />
      </div>

      {/* Grid of Recharts Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: Leads Generated per Team A Member */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Leads Generated per Team A Member</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamALeadsChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="total" fill="#0074ca" radius={[4, 4, 0, 0]} name="Total Generated" />
                <Bar dataKey="selected" fill="#10b981" radius={[4, 4, 0, 0]} name="Converted / Selected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Lead Status Distribution (Donut Chart) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Lead Status Pipeline Breakdown</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadStatusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {leadStatusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: Team B Call Volume & Talk Time (Minutes) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Team B Call Volume & Talk Time (Minutes)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamBCallChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="callsCount" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Calls Completed" />
                <Bar dataKey="talkTimeMinutes" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Talk Time (Mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 4: Team C Project Deliverables Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Team C Project Status Breakdown</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-proj-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
