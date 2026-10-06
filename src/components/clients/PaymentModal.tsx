import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lead, PaymentStatus } from '../../types';
import { paymentService } from '../../services';
import { formatCurrency } from '../../utils/formatters';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  lead,
  onSuccess,
}) => {
  const [status, setStatus] = useState<PaymentStatus>('Paid');
  const [amount, setAmount] = useState<number>(250000);
  const [paidAmount, setPaidAmount] = useState<number>(250000);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceId, setReferenceId] = useState(`UPI/${Math.floor(10000000000 + Math.random() * 90000000000)}`);
  const [notes, setNotes] = useState('Full payment advance cleared via IMPS.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;

    setIsSubmitting(true);
    try {
      const clientId = `CLI-${lead.id.replace('LD-', '')}`;
      await paymentService.recordPayment({
        leadId: lead.id,
        clientId,
        amount: Number(amount),
        paidAmount: Number(paidAmount),
        paymentDate,
        status,
        referenceId,
        notes,
      });

      toast.success(`Payment recorded: ${formatCurrency(Number(paidAmount))} (${status})`, {
        description: `Reference ID: ${referenceId}`,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Failed to record payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`💳 Payment Confirmation — ${lead.name}`}
      description={`Lead ID: ${lead.id} | Company: ${lead.company}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Payment Status *
            </label>
            <select
              value={status}
              onChange={(e) => {
                const newStatus = e.target.value as PaymentStatus;
                setStatus(newStatus);
                if (newStatus === 'Paid') setPaidAmount(amount);
                else if (newStatus === 'Pending') setPaidAmount(0);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none font-semibold"
            >
              <option value="Paid">Paid (Full Settlement)</option>
              <option value="Partially Paid">Partially Paid (Advance Deposit)</option>
              <option value="Pending">Pending (Invoice Sent)</option>
            </select>
          </div>

          <Input
            label="Transaction Date *"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Contract Amount (₹) *"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
          <Input
            label="Received Amount (₹) *"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            required
          />
        </div>

        <Input
          label="Transaction Reference / UPI ID *"
          placeholder="e.g. UPI/98472910401 or NEFT/129482019"
          value={referenceId}
          onChange={(e) => setReferenceId(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Payment Notes / Remarks
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Receipt notes, bank details, tax invoice number..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Record Payment
          </Button>
        </div>
      </form>
    </Modal>
  );
};
