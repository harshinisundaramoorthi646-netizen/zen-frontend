import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lead } from '../../types';
import { followUpService } from '../../services';
import { usePlatformStore } from '../../store/usePlatformStore';
import { toast } from 'sonner';

interface AddFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSuccess?: () => void;
}

export const AddFollowUpModal: React.FC<AddFollowUpModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const { currentUser } = usePlatformStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    setIsSubmitting(true);
    try {
      await followUpService.addFollowUp({
        leadId: lead.id,
        memberId: currentUser.id,
        memberName: currentUser.name,
        date,
        time,
        notes: notes || 'Follow-up call scheduled.',
      });

      toast.success(`Follow-up scheduled for ${lead.name}`, {
        description: `Date: ${date} at ${time}`,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Failed to schedule follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`📅 Schedule Follow-up — ${lead.name}`}
      description={`Lead ID: ${lead.id} | Company: ${lead.company}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Follow-up Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Time *"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Follow-up Agenda / Notes *
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Key points to cover during the follow-up..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Schedule Follow-up
          </Button>
        </div>
      </form>
    </Modal>
  );
};
