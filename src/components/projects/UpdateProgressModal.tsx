import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Project, ProjectStatus } from '../../types';
import { projectService } from '../../services';
import { toast } from 'sonner';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess?: () => void;
}

export const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<ProjectStatus>('Active');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setProgress(project.progress);
      setStatus(project.projectStatus);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setIsSubmitting(true);
    try {
      await projectService.updateProjectProgress(project.id, progress);
      await projectService.updateProjectStatus(project.id, status, notes);

      toast.success(`Updated Project ${project.id}!`, {
        description: `Progress set to ${progress}% | Status: ${status}`,
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Failed to update project progress.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`🚀 Update Project Progress — ${project.id}`}
      description={`${project.name} | Client: ${project.clientName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Slider & Percentage */}
        <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-700">
            <span>Project Completion Percentage</span>
            <span className="text-base text-brand-600 font-mono font-black">{progress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            onChange={(e) => {
              const val = Number(e.target.value);
              setProgress(val);
              if (val === 100) setStatus('Completed');
              else if (val > 0 && status === 'Not Started') setStatus('Active');
            }}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold">
            <span>0% (Not Started)</span>
            <span>50% (In Development)</span>
            <span>100% (Completed)</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Project Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 font-semibold focus:border-brand-500 focus:outline-none"
          >
            <option value="Not Started">Not Started</option>
            <option value="Active">Active (In Development)</option>
            <option value="On Hold">On Hold</option>
            <option value="Pending">Pending Review</option>
            <option value="Completed">Completed (Production Delivered)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Activity Work Log Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Work completed in this iteration, build deployment details, bug fixes..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Save Progress Update
          </Button>
        </div>
      </form>
    </Modal>
  );
};
