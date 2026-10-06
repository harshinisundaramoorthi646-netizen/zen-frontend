import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, UserCheck, Calendar, FileText, CreditCard, Clock, Sliders, Layers } from 'lucide-react';
import { usePlatformStore } from '../../store/usePlatformStore';
import { projectService } from '../../services';
import { StatusBadge } from '../../components/common/StatusBadge';
import { JourneyStepper } from '../../components/common/JourneyStepper';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { UpdateProgressModal } from '../../components/projects/UpdateProgressModal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { projects, leads, calls, followUps, requirements, payments, activities } = usePlatformStore();

  const [isUpdateProgressOpen, setIsUpdateProgressOpen] = useState(false);
  const [isConfirmCompleteOpen, setIsConfirmCompleteOpen] = useState(false);

  const project = projects.find((p) => p.id === id) || projects[0];
  const lead = leads.find((l) => l.id === project?.leadId);
  const leadCalls = calls.filter((c) => c.leadId === project?.leadId);
  const leadFollowUps = followUps.filter((f) => f.leadId === project?.leadId);
  const req = requirements.find((r) => r.leadId === project?.leadId);
  const pay = payments.find((p) => p.leadId === project?.leadId);

  const projectActivities = activities.filter(
    (a) => a.targetId === project?.id || a.targetId === project?.leadId
  );

  const handleConfirmCompletion = async () => {
    if (!project) return;
    try {
      await projectService.updateProjectStatus(project.id, 'Completed');
      toast.success(`Project ${project.id} marked as Completed!`);
      setIsConfirmCompleteOpen(false);
    } catch {
      toast.error('Failed to complete project.');
    }
  };

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold text-slate-900">Project Not Found</h2>
        <Button className="mt-4" onClick={() => navigate('/team-c/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{project.name}</h1>
              <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                {project.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Client: <span className="font-bold text-slate-800">{project.clientName}</span> ({project.company})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {project.projectStatus !== 'Completed' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => setIsUpdateProgressOpen(true)}>
                <Sliders className="h-4 w-4 mr-1" /> Update Progress
              </Button>
              <Button
                size="sm"
                variant="success"
                onClick={() => setIsConfirmCompleteOpen(true)}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" /> Mark Complete
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 9-Step Journey Stepper Timeline */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
          Client End-to-End Lifecycle Stepper
        </h3>
        <JourneyStepper
          lead={lead}
          calls={leadCalls}
          followUps={leadFollowUps}
          requirement={req}
          payment={pay}
          project={project}
        />
      </div>

      {/* VERTICAL ORDER:
          1. Client Information
          2. Client Requirements
          3. Payment Status
          4. Project Details
          5. Project Progress
          6. Team C Activity
          7. Completion
      */}
      <div className="space-y-6">
        {/* SECTION 1: Client Information */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">1</span>
            <h3 className="text-sm font-bold text-slate-900">Client Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-slate-500 font-semibold">Client Name:</p>
              <p className="font-bold text-slate-900">{project.clientName}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Company Name:</p>
              <p className="font-bold text-slate-900">{project.company}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Location Area:</p>
              <p className="font-bold text-slate-900">{lead?.area || 'Chennai / Bengaluru'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Contact Phone:</p>
              <p className="font-medium text-slate-800">{lead?.phone || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Contact Email:</p>
              <p className="font-medium text-slate-800">{lead?.email || '—'}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Lead ID:</p>
              <p className="font-bold text-brand-700">{project.leadId}</p>
            </div>
          </div>
        </Card>

        {/* SECTION 2: Client Requirements */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs font-bold">2</span>
            <h3 className="text-sm font-bold text-slate-900">Client Requirements Scope</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-2">
            <div>
              <p className="text-slate-500 font-semibold">Category:</p>
              <p className="font-bold text-brand-700">{req?.category || project.category}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Expected Delivery:</p>
              <p className="font-bold text-slate-900">{req?.expectedDeliveryDate ? formatDate(req.expectedDeliveryDate) : project.deadline}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap">
            {req?.detailedRequirement || 'Detailed software requirements specification captured during Team B discovery calls.'}
          </div>
        </Card>

        {/* SECTION 3: Payment Status */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">3</span>
            <h3 className="text-sm font-bold text-slate-900">Payment Status</h3>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Contract Billing Amount</p>
              <p className="text-xl font-extrabold text-emerald-400 mt-0.5">
                {pay ? `${formatCurrency(pay.paidAmount)} / ${formatCurrency(pay.amount)}` : '₹2,50,000'}
              </p>
              {pay?.referenceId && <p className="text-[11px] text-slate-400 mt-1">Transaction Ref: {pay.referenceId}</p>}
            </div>
            <StatusBadge status={pay?.status || project.paymentStatus} />
          </div>
        </Card>

        {/* SECTION 4: Project Details */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-purple-700 text-xs font-bold">4</span>
            <h3 className="text-sm font-bold text-slate-900">Project Details</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-slate-500 font-semibold">Assigned Engineer:</p>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <UserCheck className="h-4 w-4 text-brand-600" />
                {project.assignedMemberName}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Start Date:</p>
              <p className="font-bold text-slate-900 mt-0.5">{formatDate(project.startDate)}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Deadline:</p>
              <p className="font-bold text-slate-900 mt-0.5">{formatDate(project.deadline)}</p>
            </div>
          </div>
        </Card>

        {/* SECTION 5: Project Progress */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">5</span>
              <h3 className="text-sm font-bold text-slate-900">Project Progress</h3>
            </div>
            <StatusBadge status={project.projectStatus} />
          </div>
          <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700">Completion Status</span>
              <span className="text-lg text-brand-600 font-mono font-black">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all rounded-full ${
                  project.progress === 100 ? 'bg-emerald-500' : 'bg-brand-600'
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </Card>

        {/* SECTION 6: Team C Activity History */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-800 text-xs font-bold">6</span>
            <h3 className="text-sm font-bold text-slate-900">Team C Activity History</h3>
          </div>
          <div className="space-y-3">
            {projectActivities.length > 0 ? (
              projectActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <Clock className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      <span className="font-bold text-slate-900">{act.actorName}</span> ({act.actorRole}) {act.action}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{act.timestamp}</p>
                    {act.details && <p className="text-slate-600 mt-1">{act.details}</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No activity logs recorded for this project yet.</p>
            )}
          </div>
        </Card>

        {/* SECTION 7: Completion */}
        <Card className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">7</span>
            <h3 className="text-sm font-bold text-slate-900">Project Completion</h3>
          </div>
          {project.projectStatus === 'Completed' ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                <div>
                  <h4 className="font-bold text-sm">Project Officially Completed</h4>
                  <p className="text-emerald-700">100% production deliverables handed over to client.</p>
                </div>
              </div>
              <StatusBadge status="Completed" />
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
              <div>
                <h4 className="font-bold">Project In Progress ({project.progress}%)</h4>
                <p className="text-amber-800">Complete remaining deliverables to trigger final sign-off.</p>
              </div>
              <Button size="sm" variant="success" onClick={() => setIsConfirmCompleteOpen(true)}>
                Mark Completed
              </Button>
            </div>
          )}
        </Card>
      </div>

      <UpdateProgressModal
        isOpen={isUpdateProgressOpen}
        onClose={() => setIsUpdateProgressOpen(false)}
        project={project}
      />

      <ConfirmDialog
        isOpen={isConfirmCompleteOpen}
        onClose={() => setIsConfirmCompleteOpen(false)}
        onConfirm={handleConfirmCompletion}
        title="Confirm Project Completion?"
        message={`This will set ${project.name} status to Completed and record final completion in the system timeline.`}
        confirmText="Confirm Completion"
        variant="success"
      />
    </div>
  );
};
