import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Member,
  Lead,
  Call,
  FollowUp,
  Requirement,
  Payment,
  Project,
  Activity,
  UserRole,
  LeadStatus,
  ProjectStatus,
  PaymentStatus,
  FollowUpStatus,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_LEADS,
  INITIAL_CALLS,
  INITIAL_FOLLOWUPS,
  INITIAL_REQUIREMENTS,
  INITIAL_PAYMENTS,
  INITIAL_PROJECTS,
  INITIAL_ACTIVITIES,
} from '../mock/seedData';

interface PlatformStore {
  // Auth state
  currentUser: Member;
  role: UserRole;
  setCurrentUser: (user: Member) => void;
  setRole: (role: UserRole) => void;

  // Data collections
  members: Member[];
  leads: Lead[];
  calls: Call[];
  followUps: FollowUp[];
  requirements: Requirement[];
  payments: Payment[];
  projects: Project[];
  activities: Activity[];

  // Activity Logger Helper
  addActivity: (action: string, targetType: Activity['targetType'], targetId: string, details?: string) => void;

  // Member Management (Admin only)
  addMember: (member: Omit<Member, 'id' | 'joinedDate'>) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deactivateMember: (id: string) => void;

  // Team A Actions
  addLead: (lead: Omit<Lead, 'id' | 'generatedByMemberId' | 'generatedByName' | 'date' | 'status'>) => Lead;
  forwardLeadToTeamB: (leadId: string) => void;

  // Team B Actions
  recordCall: (callData: Omit<Call, 'id'>) => Call;
  addFollowUp: (followUp: Omit<FollowUp, 'id' | 'status'>) => FollowUp;
  completeFollowUp: (followUpId: string) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus, notes?: string) => void;
  saveRequirement: (req: Omit<Requirement, 'id'>) => Requirement;
  recordPayment: (payment: Omit<Payment, 'id'>) => Payment;

  // Team C Actions
  updateProjectStatus: (projectId: string, status: ProjectStatus, notes?: string) => void;
  updateProjectProgress: (projectId: string, progress: number) => void;
  assignProjectMember: (projectId: string, memberId: string, memberName: string) => void;

  // Helper getters & reset
  resetToDefaultData: () => void;
}

export const usePlatformStore = create<PlatformStore>()(
  persist(
    (set, get) => ({
      currentUser: INITIAL_MEMBERS[0],
      role: 'Admin',

      setCurrentUser: (user) => set({ currentUser: user, role: user.role }),
      setRole: (role) => set({ role }),

      members: INITIAL_MEMBERS,
      leads: INITIAL_LEADS,
      calls: INITIAL_CALLS,
      followUps: INITIAL_FOLLOWUPS,
      requirements: INITIAL_REQUIREMENTS,
      payments: INITIAL_PAYMENTS,
      projects: INITIAL_PROJECTS,
      activities: INITIAL_ACTIVITIES,

      addActivity: (action, targetType, targetId, details) => {
        const { currentUser, activities } = get();
        const now = new Date();
        const formattedTimestamp = now.toISOString().replace('T', ' ').substring(0, 16);
        const newActivity: Activity = {
          id: `ACT-${Date.now()}`,
          timestamp: formattedTimestamp,
          actorName: currentUser?.name || 'System User',
          actorRole: currentUser?.role || 'Admin',
          action,
          targetType,
          targetId,
          details,
        };
        set({ activities: [newActivity, ...activities] });
      },

      // Admin Member Actions
      addMember: (memberData) => {
        const { members, addActivity } = get();
        const id = `MEM-${(members.length + 1).toString().padStart(3, '0')}`;
        const newMember: Member = {
          ...memberData,
          id,
          joinedDate: new Date().toISOString().split('T')[0],
        };
        set({ members: [newMember, ...members] });
        addActivity(`added new member ${newMember.name} to ${newMember.team}`, 'member', id);
        return newMember;
      },

      updateMember: (id, updates) => {
        const { members, addActivity } = get();
        set({
          members: members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        });
        const updated = members.find((m) => m.id === id);
        if (updated) {
          addActivity(`updated profile for ${updated.name}`, 'member', id);
        }
      },

      deactivateMember: (id) => {
        const { members, addActivity } = get();
        set({
          members: members.map((m) => (m.id === id ? { ...m, status: 'inactive' } : m)),
        });
        const updated = members.find((m) => m.id === id);
        if (updated) {
          addActivity(`deactivated member ${updated.name}`, 'member', id);
        }
      },

      // Team A Lead Actions
      addLead: (leadData) => {
        const { leads, currentUser, addActivity } = get();
        const nextIdNumber = Math.max(1000, ...leads.map((l) => parseInt(l.id.replace('LD-', ''), 10) || 0)) + 1;
        const leadId = `LD-${nextIdNumber}`;
        const newLead: Lead = {
          ...leadData,
          id: leadId,
          generatedByMemberId: currentUser.id,
          generatedByName: currentUser.name,
          date: new Date().toISOString().split('T')[0],
          status: 'New',
        };
        set({ leads: [newLead, ...leads] });
        addActivity(`created Lead ${leadId} (${newLead.company})`, 'lead', leadId);
        return newLead;
      },

      forwardLeadToTeamB: (leadId) => {
        const { leads, addActivity } = get();
        set({
          leads: leads.map((l) =>
            l.id === leadId ? { ...l, status: 'Forwarded to Team B' } : l
          ),
        });
        const targetLead = leads.find((l) => l.id === leadId);
        addActivity(`forwarded Lead ${leadId} (${targetLead?.company || ''}) to Team B`, 'lead', leadId);
      },

      // Team B Actions
      recordCall: (callData) => {
        const { calls, leads, addActivity } = get();
        const newCallId = `CAL-${Date.now().toString().slice(-4)}`;
        const newCall: Call = {
          ...callData,
          id: newCallId,
        };
        set({ calls: [newCall, ...calls] });

        // Auto update lead status if outcome maps to selected/rejected/waiting
        let statusUpdate: LeadStatus | undefined;
        if (callData.outcome === 'Selected') statusUpdate = 'Selected';
        else if (callData.outcome === 'Rejected') statusUpdate = 'Rejected';
        else if (callData.outcome === 'Waiting') statusUpdate = 'Waiting';

        if (statusUpdate) {
          set({
            leads: get().leads.map((l) =>
              l.id === callData.leadId ? { ...l, status: statusUpdate } : l
            ),
          });
        }

        const lead = leads.find((l) => l.id === callData.leadId);
        addActivity(
          `completed a call with ${lead?.name || callData.leadId} (Outcome: ${callData.outcome})`,
          'call',
          newCallId
        );
        return newCall;
      },

      addFollowUp: (followUpData) => {
        const { followUps, addActivity } = get();
        const newId = `FLP-${Date.now().toString().slice(-4)}`;
        const newFollowUp: FollowUp = {
          ...followUpData,
          id: newId,
          status: 'Pending',
        };
        set({ followUps: [newFollowUp, ...followUps] });
        addActivity(`scheduled follow-up for Lead ${followUpData.leadId} on ${followUpData.date}`, 'followup', newId);
        return newFollowUp;
      },

      completeFollowUp: (followUpId) => {
        const { followUps, addActivity } = get();
        set({
          followUps: followUps.map((f) =>
            f.id === followUpId ? { ...f, status: 'Completed' } : f
          ),
        });
        const flp = followUps.find((f) => f.id === followUpId);
        addActivity(`completed follow-up for Lead ${flp?.leadId || followUpId}`, 'followup', followUpId);
      },

      updateLeadStatus: (leadId, status, notes) => {
        const { leads, addActivity } = get();
        set({
          leads: leads.map((l) =>
            l.id === leadId
              ? { ...l, status, notes: notes ? `${l.notes ? l.notes + ' | ' : ''}${notes}` : l.notes }
              : l
          ),
        });
        const lead = leads.find((l) => l.id === leadId);
        addActivity(`updated Lead ${leadId} status to ${status}`, 'lead', leadId);
      },

      saveRequirement: (reqData) => {
        const { requirements, leads, projects, members, addActivity } = get();
        const existingReqIndex = requirements.findIndex((r) => r.leadId === reqData.leadId);
        const reqId = existingReqIndex >= 0 ? requirements[existingReqIndex].id : `REQ-${Date.now().toString().slice(-4)}`;

        const newRequirement: Requirement = {
          ...reqData,
          id: reqId,
        };

        let updatedRequirements = [...requirements];
        if (existingReqIndex >= 0) {
          updatedRequirements[existingReqIndex] = newRequirement;
        } else {
          updatedRequirements.unshift(newRequirement);
        }

        // Update lead status to Selected
        const targetLead = leads.find((l) => l.id === reqData.leadId);
        const updatedLeads = leads.map((l) =>
          l.id === reqData.leadId ? { ...l, status: 'Selected' as LeadStatus } : l
        );

        // Auto-create or sync Project in Team C
        let updatedProjects = [...projects];
        const existingProjIndex = projects.findIndex((p) => p.leadId === reqData.leadId);
        const teamCMembers = members.filter((m) => m.team === 'Team C' && m.status === 'active');
        const assignedDev = teamCMembers.length > 0 ? teamCMembers[projects.length % teamCMembers.length] : { id: 'MEM-010', name: 'Vikramaditya Roy' };

        const projId = existingProjIndex >= 0 ? projects[existingProjIndex].id : `PRJ-${Math.max(1000, ...projects.map((p) => parseInt(p.id.replace('PRJ-', ''), 10) || 0)) + 1}`;
        const projCategory = (['Website Development', 'E-commerce', 'Advertisement / Ad Management', 'Testing'].includes(reqData.category)
          ? reqData.category
          : 'Website Development') as Project['category'];

        const projectData: Project = {
          id: projId,
          clientId: reqData.clientId || `CLI-${reqData.leadId.replace('LD-', '')}`,
          leadId: reqData.leadId,
          name: `${reqData.companyName || targetLead?.company || 'Client'} - ${reqData.category}`,
          clientName: reqData.clientName || targetLead?.name || 'Client',
          company: reqData.companyName || targetLead?.company || 'Company',
          category: projCategory,
          assignedMemberId: existingProjIndex >= 0 ? projects[existingProjIndex].assignedMemberId : assignedDev.id,
          assignedMemberName: existingProjIndex >= 0 ? projects[existingProjIndex].assignedMemberName : assignedDev.name,
          startDate: new Date().toISOString().split('T')[0],
          deadline: reqData.expectedDeliveryDate || '2026-11-30',
          paymentStatus: existingProjIndex >= 0 ? projects[existingProjIndex].paymentStatus : 'Pending',
          projectStatus: existingProjIndex >= 0 ? projects[existingProjIndex].projectStatus : 'Not Started',
          progress: existingProjIndex >= 0 ? projects[existingProjIndex].progress : 0,
          requirementsId: reqId,
        };

        if (existingProjIndex >= 0) {
          updatedProjects[existingProjIndex] = projectData;
        } else {
          updatedProjects.unshift(projectData);
        }

        set({
          requirements: updatedRequirements,
          leads: updatedLeads,
          projects: updatedProjects,
        });

        addActivity(
          `saved requirements for ${reqData.clientName || targetLead?.name || 'Client'} (Project ${projId} created/synced for Team C)`,
          'requirement',
          reqId
        );

        return newRequirement;
      },

      recordPayment: (paymentData) => {
        const { payments, projects, addActivity } = get();
        const existingPaymentIndex = payments.findIndex((p) => p.leadId === paymentData.leadId);
        const payId = existingPaymentIndex >= 0 ? payments[existingPaymentIndex].id : `PAY-${Date.now().toString().slice(-4)}`;

        const newPayment: Payment = {
          ...paymentData,
          id: payId,
        };

        let updatedPayments = [...payments];
        if (existingPaymentIndex >= 0) {
          updatedPayments[existingPaymentIndex] = newPayment;
        } else {
          updatedPayments.unshift(newPayment);
        }

        // Sync payment status with corresponding project in Team C
        const updatedProjects = projects.map((p) =>
          p.leadId === paymentData.leadId ? { ...p, paymentStatus: paymentData.status, paymentId: payId } : p
        );

        set({
          payments: updatedPayments,
          projects: updatedProjects,
        });

        addActivity(
          `marked payment for Lead ${paymentData.leadId} as ${paymentData.status} (₹${paymentData.amount.toLocaleString('en-IN')})`,
          'payment',
          payId
        );

        return newPayment;
      },

      // Team C Actions
      updateProjectStatus: (projectId, status, notes) => {
        const { projects, addActivity } = get();
        set({
          projects: projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  projectStatus: status,
                  progress: status === 'Completed' ? 100 : p.progress,
                  notes: notes ? `${p.notes ? p.notes + ' | ' : ''}${notes}` : p.notes,
                }
              : p
          ),
        });
        const proj = projects.find((p) => p.id === projectId);
        addActivity(`updated Project ${projectId} (${proj?.name || ''}) status to ${status}`, 'project', projectId);
      },

      updateProjectProgress: (projectId, progress) => {
        const { projects, addActivity } = get();
        const safeProgress = Math.min(100, Math.max(0, progress));
        const newStatus: ProjectStatus = safeProgress === 100 ? 'Completed' : safeProgress > 0 ? 'Active' : 'Not Started';

        set({
          projects: projects.map((p) =>
            p.id === projectId ? { ...p, progress: safeProgress, projectStatus: newStatus } : p
          ),
        });
        const proj = projects.find((p) => p.id === projectId);
        addActivity(`updated Project ${projectId} progress to ${safeProgress}%`, 'project', projectId);
      },

      assignProjectMember: (projectId, memberId, memberName) => {
        const { projects, addActivity } = get();
        set({
          projects: projects.map((p) =>
            p.id === projectId ? { ...p, assignedMemberId: memberId, assignedMemberName: memberName } : p
          ),
        });
        addActivity(`reassigned Project ${projectId} to ${memberName}`, 'project', projectId);
      },

      resetToDefaultData: () => {
        set({
          currentUser: INITIAL_MEMBERS[0],
          role: 'Admin',
          members: INITIAL_MEMBERS,
          leads: INITIAL_LEADS,
          calls: INITIAL_CALLS,
          followUps: INITIAL_FOLLOWUPS,
          requirements: INITIAL_REQUIREMENTS,
          payments: INITIAL_PAYMENTS,
          projects: INITIAL_PROJECTS,
          activities: INITIAL_ACTIVITIES,
        });
      },
    }),
    {
      name: 'freelancer-platform-store-v1',
    }
  )
);
