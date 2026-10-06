import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { leadService } from '../../services';

const leadSchema = z
  .object({
    name: z.string().min(2, 'Lead name is required'),
    company: z.string().min(2, 'Company name is required'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address').optional().or(z.literal('')),
    area: z.string().min(2, 'Area location is required'),
    notes: z.string().optional(),
  })
  .refine((data) => (data.phone && data.phone.trim().length >= 8) || (data.email && data.email.trim().length > 0), {
    message: 'Either Contact Number or Email is required',
    path: ['phone'],
  });

type LeadFormData = z.infer<typeof leadSchema>;

export const AddLeadPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
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
        description: 'New lead added and ready for forwarding to Team B.',
      });

      navigate('/team-a/leads');
    } catch {
      toast.error('Failed to create lead.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/team-a')}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Add New Lead</h1>
          <p className="text-xs text-slate-500">Capture fresh client prospect information</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Lead Contact Full Name *"
            placeholder="e.g. Anand Mahindra"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Company / Business Name *"
            placeholder="e.g. Mahindra Digital Services"
            error={errors.company?.message}
            {...register('company')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Number (+91)"
              placeholder="+91 98401 99887"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="anand@mahindradigital.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              City / Location Area *
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
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Prospect Notes & Requirements
            </label>
            <textarea
              rows={4}
              placeholder="Captured requirements, initial budget, timeline..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => navigate('/team-a')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <UserPlus className="h-4 w-4 mr-1.5" /> Save Lead
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
