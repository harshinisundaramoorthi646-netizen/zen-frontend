import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lead, RequirementCategory } from '../../types';
import { requirementService } from '../../services';
import { toast } from 'sonner';

interface RequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSuccess?: () => void;
}

export const RequirementsModal: React.FC<RequirementsModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [category, setCategory] = useState<RequirementCategory>('Website Development');
  const [detailedRequirement, setDetailedRequirement] = useState('');
  const [budget, setBudget] = useState<number | ''>(250000);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('2026-11-30');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setClientName(lead.name);
      setCompanyName(lead.company);
      if (lead.notes) setDetailedRequirement(lead.notes);
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    setIsSubmitting(true);
    try {
      const clientId = `CLI-${lead.id.replace('LD-', '')}`;
      await requirementService.saveRequirement({
        leadId: lead.id,
        clientId,
        clientName,
        companyName,
        category,
        detailedRequirement,
        budget: budget === '' ? undefined : Number(budget),
        expectedDeliveryDate,
        additionalNotes,
      });

      toast.success(`Requirements saved for ${clientName}`, {
        description: `Project created in Team C execution queue! Lead status set to Selected.`,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Failed to save requirements.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📝 Client Scope & Requirements — ${lead.name}`}
      description="Collect project scope requirements. Saving will automatically mark client as SELECTED and create a project in Team C."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Client Name *"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
          <Input
            label="Company Name *"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Requirement Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RequirementCategory)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none font-semibold"
            >
              <option value="Website Development">Website Development</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Advertisement / Ad Management">Advertisement / Ad Management</option>
              <option value="Testing">Testing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Input
            label="Target Budget (₹)"
            type="number"
            placeholder="250000"
            value={budget}
            onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <Input
            label="Expected Delivery Date *"
            type="date"
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Detailed Requirements Specification *
          </label>
          <textarea
            rows={4}
            value={detailedRequirement}
            onChange={(e) => setDetailedRequirement(e.target.value)}
            placeholder="Detailed features, stack preferences, API integrations, deliverable list..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Additional Contract Notes
          </label>
          <textarea
            rows={2}
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="SLA agreements, milestone payment terms, host access..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Scope & Forward to Team C
          </Button>
        </div>
      </form>
    </Modal>
  );
};
