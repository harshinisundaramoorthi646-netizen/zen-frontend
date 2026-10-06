import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Upload, User, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { memberService } from '../../services';
import { TeamName, UserRole } from '../../types';

const memberSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Contact number is required'),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, 'Aadhaar must be exactly 12 numeric digits'),
  team: z.enum(['Team A', 'Team B', 'Team C'] as const),
  avatar: z.string().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [avatarPreview, setAvatarPreview] = useState<string>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '+91 ',
      aadhaarNumber: '',
      team: 'Team A',
      avatar: avatarPreview,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: MemberFormData) => {
    try {
      const role: UserRole = data.team as any;
      await memberService.addMember({
        name: data.name,
        email: data.email,
        phone: data.phone,
        aadhaarNumber: data.aadhaarNumber,
        team: data.team as TeamName,
        role,
        avatar: avatarPreview,
        status: 'active',
      });

      toast.success(`Member ${data.name} added to ${data.team}!`, {
        description: `12-digit Aadhaar verified. Member active in system.`,
      });

      reset();
      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Failed to add member.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="👤 Add Team Member (Admin Only)"
      description="Register a new employee member with 12-digit Aadhaar identity verification."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
        {/* Photo Upload & Preview */}
        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <img
            src={avatarPreview}
            alt="Preview"
            className="h-14 w-14 rounded-full object-cover ring-2 ring-brand-500/40 shrink-0"
          />
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Member Photo / Avatar
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
            />
          </div>
        </div>

        <Input
          label="Full Name *"
          placeholder="e.g. Rahul Dravid"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address *"
            type="email"
            placeholder="rahul.d@zen.io"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Contact Number (+91) *"
            placeholder="+91 98401 55443"
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Aadhaar Number (12 Numeric Digits) *"
            placeholder="987654321098"
            maxLength={12}
            error={errors.aadhaarNumber?.message}
            helperText="12-digit ID for background verification (masked in lists)"
            {...register('aadhaarNumber')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Assigned Team *
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-semibold focus:border-brand-500 focus:outline-none"
              {...register('team')}
            >
              <option value="Team A">Team A (Lead Generation)</option>
              <option value="Team B">Team B (Calling & Follow-up)</option>
              <option value="Team C">Team C (Project Execution)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save & Add Member
          </Button>
        </div>
      </form>
    </Modal>
  );
};
