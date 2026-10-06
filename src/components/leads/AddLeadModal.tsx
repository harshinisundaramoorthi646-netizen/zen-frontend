import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { leadService } from '../../services';

const leadSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    company: z.string().min(2, 'Company name is required'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    area: z.string().min(2, 'Area/City location is required'),
    notes: z.string().optional(),
  })
  .refine((data) => (data.phone && data.phone.trim().length >= 8) || (data.email && data.email.trim().length > 0), {
    message: 'Either Contact Number or Email is required',
    path: ['phone'],
  });

type LeadFormData = z.infer<typeof leadSchema>;

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      company: '',
      phone: '+91 ',
      email: '',
      area: 'T. Nagar, Chennai',
      notes: '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      const newLead = await leadService.addLead({
        name: data.name,
        company: data.company,
        phone: data.phone || '',
        email: data.email || '',
        area: data.area,
        notes: data.notes,
      });

      toast.success(`Lead ${newLead.id} created successfully!`, {
        description: `${newLead.company} has been added to your lead register.`,
      });

      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to create lead. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="+ Add New Prospect Lead"
      description="Enter prospect details to generate a new lead entry for Team A."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        <Input
          label="Lead Contact Name *"
          placeholder="e.g. Ramesh Krishnan"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Company / Enterprise Name *"
          placeholder="e.g. Apex Tech Solutions"
          error={errors.company?.message}
          {...register('company')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contact Number (+91)"
            placeholder="+91 98401 23456"
            error={errors.phone?.message}
            {...register('phone')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="ramesh@apextech.in"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Location / Area *
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            {...register('area')}
          >
            <option value="T. Nagar, Chennai">T. Nagar, Chennai</option>
            <option value="Velachery, Chennai">Velachery, Chennai</option>
            <option value="Adyar, Chennai">Adyar, Chennai</option>
            <option value="Koramangala, Bengaluru">Koramangala, Bengaluru</option>
            <option value="HSR Layout, Bengaluru">HSR Layout, Bengaluru</option>
            <option value="Whitefield, Bengaluru">Whitefield, Bengaluru</option>
            <option value="Banjara Hills, Hyderabad">Banjara Hills, Hyderabad</option>
            <option value="HITEC City, Hyderabad">HITEC City, Hyderabad</option>
            <option value="Jubilee Hills, Hyderabad">Jubilee Hills, Hyderabad</option>
          </select>
          {errors.area && <p className="text-xs text-red-600">{errors.area.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Initial Requirements / Notes
          </label>
          <textarea
            rows={3}
            placeholder="Key notes captured during outreach..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            {...register('notes')}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Generate Lead
          </Button>
        </div>
      </form>
    </Modal>
  );
};
