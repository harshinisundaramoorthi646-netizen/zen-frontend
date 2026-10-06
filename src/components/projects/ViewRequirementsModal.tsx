import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { StatusBadge } from '../common/StatusBadge';
import { Project } from '../../types';
import { usePlatformStore } from '../../store/usePlatformStore';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ViewRequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const ViewRequirementsModal: React.FC<ViewRequirementsModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { requirements, payments } = usePlatformStore();

  if (!project) return null;

  const req = requirements.find((r) => r.leadId === project.leadId);
  const pay = payments.find((p) => p.leadId === project.leadId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📋 Requirement Specifications — ${project.name}`}
      description={`Client: ${project.clientName} | Company: ${project.company}`}
      maxWidth="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Requirement Header Details */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-500 font-semibold">Category:</p>
              <p className="font-bold text-slate-900">{req?.category || project.category}</p>
            </div>
            <div>
              <p className="text-slate-500 font-semibold">Expected Delivery:</p>
              <p className="font-bold text-slate-900">{req?.expectedDeliveryDate ? formatDate(req.expectedDeliveryDate) : project.deadline}</p>
            </div>
          </div>
          {req?.budget && (
            <div>
              <p className="text-slate-500 font-semibold">Budget Scope:</p>
              <p className="font-bold text-emerald-600">{formatCurrency(req.budget)}</p>
            </div>
          )}
        </div>

        {/* Detailed Requirement Specification */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Detailed Scope Specification</h4>
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
            {req?.detailedRequirement || 'Detailed technical specs captured during discovery call.'}
          </div>
        </div>

        {/* Additional Notes */}
        {req?.additionalNotes && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Additional Contract Notes</h4>
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900">
              {req.additionalNotes}
            </div>
          </div>
        )}

        {/* Payment Confirmation Banner */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Financial Payment Status</h4>
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white shadow-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold">Billing Status</p>
              <p className="text-sm font-bold text-white mt-0.5">
                {pay ? `${formatCurrency(pay.paidAmount)} / ${formatCurrency(pay.amount)}` : 'Pending'}
              </p>
              {pay?.referenceId && <p className="text-[10px] text-slate-400 mt-0.5">Ref: {pay.referenceId}</p>}
            </div>
            <StatusBadge status={pay?.status || project.paymentStatus} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
