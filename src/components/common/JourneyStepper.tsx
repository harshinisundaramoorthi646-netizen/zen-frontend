import React from 'react';
import { Check, Circle, Clock } from 'lucide-react';
import { Lead, Call, FollowUp, Requirement, Payment, Project } from '../../types';
import { formatDate } from '../../utils/formatters';

interface JourneyStepperProps {
  lead?: Lead;
  calls?: Call[];
  followUps?: FollowUp[];
  requirement?: Requirement;
  payment?: Payment;
  project?: Project;
  orientation?: 'horizontal' | 'vertical';
}

interface StepInfo {
  step: number;
  title: string;
  subtitle: string;
  team: 'Team A' | 'Team B' | 'Team C';
  teamColor: 'indigo' | 'blue' | 'purple' | 'emerald';
  isCompleted: boolean;
  isCurrent: boolean;
  date?: string;
}

export const JourneyStepper: React.FC<JourneyStepperProps> = ({
  lead,
  calls = [],
  followUps = [],
  requirement,
  payment,
  project,
  orientation = 'horizontal',
}) => {
  // Determine completion of steps
  const step1Done = !!lead; // Lead generated
  const step2Done = lead ? lead.status !== 'New' : false; // Forwarded to Team B
  const step3Done = calls.length > 0; // Call completed
  const step4Done = followUps.some((f) => f.status === 'Completed'); // Follow-up completed
  const step5Done = lead ? lead.status === 'Selected' : false; // Client selected
  const step6Done = !!requirement; // Requirements collected
  const step7Done = payment ? payment.status === 'Paid' : false; // Payment confirmed
  const step8Done = !!project && project.projectStatus !== 'Not Started'; // Project assigned & started
  const step9Done = project ? project.projectStatus === 'Completed' : false; // Project completed

  // Calculate current active step index (0 to 8)
  const stepsState = [step1Done, step2Done, step3Done, step4Done, step5Done, step6Done, step7Done, step8Done, step9Done];
  let currentStepIdx = stepsState.lastIndexOf(true);
  if (currentStepIdx < 8 && stepsState[currentStepIdx]) {
    currentStepIdx = currentStepIdx + 1;
  }
  if (currentStepIdx < 0) currentStepIdx = 0;

  const steps: StepInfo[] = [
    {
      step: 1,
      title: 'Lead Generated',
      subtitle: lead ? `By ${lead.generatedByName}` : 'Team A outreach',
      team: 'Team A',
      teamColor: 'indigo',
      isCompleted: step1Done,
      isCurrent: currentStepIdx === 0,
      date: lead?.date ? formatDate(lead.date) : undefined,
    },
    {
      step: 2,
      title: 'Forwarded to Team B',
      subtitle: 'In calling queue',
      team: 'Team A',
      teamColor: 'indigo',
      isCompleted: step2Done,
      isCurrent: currentStepIdx === 1,
      date: lead?.date ? formatDate(lead.date) : undefined,
    },
    {
      step: 3,
      title: 'Call Completed',
      subtitle: calls.length > 0 ? `${calls.length} calls logged` : 'Awaiting outreach',
      team: 'Team B',
      teamColor: 'blue',
      isCompleted: step3Done,
      isCurrent: currentStepIdx === 2,
      date: calls.length > 0 ? formatDate(calls[0].date) : undefined,
    },
    {
      step: 4,
      title: 'Follow-up Completed',
      subtitle: 'Discovery & negotiation',
      team: 'Team B',
      teamColor: 'blue',
      isCompleted: step4Done,
      isCurrent: currentStepIdx === 3,
      date: followUps.length > 0 ? formatDate(followUps[0].date) : undefined,
    },
    {
      step: 5,
      title: 'Client Selected',
      subtitle: 'Proposal accepted',
      team: 'Team B',
      teamColor: 'blue',
      isCompleted: step5Done,
      isCurrent: currentStepIdx === 4,
    },
    {
      step: 6,
      title: 'Requirements Collected',
      subtitle: requirement ? requirement.category : 'Specs documentation',
      team: 'Team B',
      teamColor: 'blue',
      isCompleted: step6Done,
      isCurrent: currentStepIdx === 5,
    },
    {
      step: 7,
      title: 'Payment Confirmed',
      subtitle: payment ? `Status: ${payment.status}` : 'Billing advance',
      team: 'Team B',
      teamColor: 'emerald',
      isCompleted: step7Done,
      isCurrent: currentStepIdx === 6,
      date: payment?.paymentDate ? formatDate(payment.paymentDate) : undefined,
    },
    {
      step: 8,
      title: 'Project Assigned',
      subtitle: project ? `Assigned to ${project.assignedMemberName}` : 'Team C execution',
      team: 'Team C',
      teamColor: 'purple',
      isCompleted: step8Done,
      isCurrent: currentStepIdx === 7,
      date: project?.startDate ? formatDate(project.startDate) : undefined,
    },
    {
      step: 9,
      title: 'Project Completed',
      subtitle: project?.projectStatus === 'Completed' ? 'Delivered' : 'Final sign-off',
      team: 'Team C',
      teamColor: 'emerald',
      isCompleted: step9Done,
      isCurrent: currentStepIdx === 8,
      date: project?.deadline ? formatDate(project.deadline) : undefined,
    },
  ];

  if (orientation === 'vertical') {
    return (
      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {steps.map((st) => (
          <div key={st.step} className="relative flex items-start gap-4">
            <div
              className={`absolute -left-6 top-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                st.isCompleted
                  ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                  : st.isCurrent
                  ? 'bg-brand-600 text-white shadow-md ring-4 ring-brand-100 animate-pulse'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {st.isCompleted ? <Check className="h-3.5 w-3.5" /> : st.step}
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900">{st.title}</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {st.team}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{st.subtitle}</p>
              {st.date && <p className="text-[11px] text-brand-600 font-medium mt-1">{st.date}</p>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Horizontal stepper
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm overflow-x-auto">
      <div className="flex items-center justify-between min-w-[760px] relative">
        {steps.map((st, idx) => {
          const isLast = idx === steps.length - 1;
          return (
            <div key={st.step} className="flex-1 flex items-center relative group">
              <div className="flex flex-col items-center text-center z-10">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    st.isCompleted
                      ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                      : st.isCurrent
                      ? 'bg-brand-600 text-white shadow-md ring-4 ring-brand-100 animate-bounce'
                      : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}
                >
                  {st.isCompleted ? <Check className="h-4 w-4" /> : st.step}
                </div>
                <div className="mt-2 text-center max-w-[90px]">
                  <span
                    className={`block text-[11px] font-bold leading-tight ${
                      st.isCompleted
                        ? 'text-slate-900'
                        : st.isCurrent
                        ? 'text-brand-600 font-extrabold'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.title}
                  </span>
                  <span className="block text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">
                    {st.team}
                  </span>
                  {st.date && (
                    <span className="block text-[10px] text-emerald-600 font-medium mt-0.5">
                      {st.date}
                    </span>
                  )}
                </div>
              </div>

              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-6 ${
                    st.isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
