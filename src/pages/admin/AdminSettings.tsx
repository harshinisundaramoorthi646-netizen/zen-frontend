import React from 'react';
import { Settings, RefreshCw, Download, Database, Server, ShieldCheck } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'sonner';

export const AdminSettings: React.FC = () => {
  const { resetToDefaultData, leads, projects, members } = usePlatformStore();

  const handleExportCSV = () => {
    const jsonString = JSON.stringify(leads, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zen_platform_leads_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    toast.success('Platform state exported successfully!');
  };

  const handleResetData = () => {
    resetToDefaultData();
    toast.success('Seed data restored to default demo state.');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">System Settings & Data Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure demo preferences, reset Zustand store state, and inspect API integration layer details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reset Store Card */}
        <Card className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reset Demo State</h3>
              <p className="text-xs text-slate-500">Restore all seed data back to initial state</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Resets all leads, calls, follow-ups, requirements, payments, projects, and activities back to initial seed state.
          </p>
          <div className="pt-2">
            <Button variant="outline" onClick={handleResetData} className="w-full text-amber-700 border-amber-300 hover:bg-amber-50">
              <RefreshCw className="h-4 w-4 mr-1.5" /> Restore Default Mock Data
            </Button>
          </div>
        </Card>

        {/* Data Export Card */}
        <Card className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-lg">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Export State Backup</h3>
              <p className="text-xs text-slate-500">Download active store JSON file</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Export active store containing {leads.length} leads, {projects.length} projects, and {members.length} member profiles.
          </p>
          <div className="pt-2">
            <Button variant="primary" onClick={handleExportCSV} className="w-full">
              <Download className="h-4 w-4 mr-1.5" /> Export Data Backup (JSON)
            </Button>
          </div>
        </Card>
      </div>

      {/* Backend Integration Note Card */}
      <Card className="space-y-3 bg-slate-900 text-white">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Server className="h-5 w-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Service Layer Integration Architecture</h3>
            <p className="text-xs text-slate-400">Pluggable backend service abstraction layer (`src/services/*`)</p>
          </div>
        </div>

        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            All UI components in this application communicate exclusively through the service layer modules in <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">src/services/index.ts</code> (<code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">leadService</code>, <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">callService</code>, <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">projectService</code>, etc.).
          </p>
          <p>
            To connect a real REST API or GraphQL backend (Node.js/Express, Python/Django, Spring Boot, Firebase, etc.), simply update the async functions in <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">src/services/index.ts</code> to execute <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">fetch()</code> or <code className="text-brand-300 bg-slate-800 px-1.5 py-0.5 rounded">axios</code> calls without needing to modify any component or page implementation.
          </p>
        </div>
      </Card>
    </div>
  );
};
