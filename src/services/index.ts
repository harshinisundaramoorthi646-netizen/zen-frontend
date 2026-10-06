import { usePlatformStore } from '../store/usePlatformStore';
import { Member, Lead, Call, FollowUp, Requirement, Payment, Project, Activity, LeadStatus, ProjectStatus } from '../types';

// Helper to simulate asynchronous API delay if needed, returning resolved Promises
const delay = <T>(data: T, ms = 50): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const memberService = {
  async getMembers(): Promise<Member[]> {
    return delay(usePlatformStore.getState().members);
  },
  async getMemberById(id: string): Promise<Member | undefined> {
    const member = usePlatformStore.getState().members.find((m) => m.id === id);
    return delay(member);
  },
  async addMember(data: Omit<Member, 'id' | 'joinedDate'>): Promise<Member> {
    const newMember = usePlatformStore.getState().addMember(data);
    return delay(newMember);
  },
  async updateMember(id: string, updates: Partial<Member>): Promise<void> {
    usePlatformStore.getState().updateMember(id, updates);
    return delay(undefined);
  },
  async deactivateMember(id: string): Promise<void> {
    usePlatformStore.getState().deactivateMember(id);
    return delay(undefined);
  },
};

export const leadService = {
  async getLeads(): Promise<Lead[]> {
    return delay(usePlatformStore.getState().leads);
  },
  async getLeadById(id: string): Promise<Lead | undefined> {
    const lead = usePlatformStore.getState().leads.find((l) => l.id === id);
    return delay(lead);
  },
  async addLead(data: Omit<Lead, 'id' | 'generatedByMemberId' | 'generatedByName' | 'date' | 'status'>): Promise<Lead> {
    const lead = usePlatformStore.getState().addLead(data);
    return delay(lead);
  },
  async forwardLead(leadId: string): Promise<void> {
    usePlatformStore.getState().forwardLeadToTeamB(leadId);
    return delay(undefined);
  },
  async updateLeadStatus(leadId: string, status: LeadStatus, notes?: string): Promise<void> {
    usePlatformStore.getState().updateLeadStatus(leadId, status, notes);
    return delay(undefined);
  },
};

export const callService = {
  async getCalls(): Promise<Call[]> {
    return delay(usePlatformStore.getState().calls);
  },
  async getCallsByLeadId(leadId: string): Promise<Call[]> {
    const calls = usePlatformStore.getState().calls.filter((c) => c.leadId === leadId);
    return delay(calls);
  },
  async recordCall(data: Omit<Call, 'id'>): Promise<Call> {
    const call = usePlatformStore.getState().recordCall(data);
    return delay(call);
  },
};

export const followUpService = {
  async getFollowUps(): Promise<FollowUp[]> {
    return delay(usePlatformStore.getState().followUps);
  },
  async addFollowUp(data: Omit<FollowUp, 'id' | 'status'>): Promise<FollowUp> {
    const followUp = usePlatformStore.getState().addFollowUp(data);
    return delay(followUp);
  },
  async completeFollowUp(id: string): Promise<void> {
    usePlatformStore.getState().completeFollowUp(id);
    return delay(undefined);
  },
};

export const requirementService = {
  async getRequirements(): Promise<Requirement[]> {
    return delay(usePlatformStore.getState().requirements);
  },
  async getRequirementByLeadId(leadId: string): Promise<Requirement | undefined> {
    const req = usePlatformStore.getState().requirements.find((r) => r.leadId === leadId);
    return delay(req);
  },
  async saveRequirement(data: Omit<Requirement, 'id'>): Promise<Requirement> {
    const req = usePlatformStore.getState().saveRequirement(data);
    return delay(req);
  },
};

export const paymentService = {
  async getPayments(): Promise<Payment[]> {
    return delay(usePlatformStore.getState().payments);
  },
  async getPaymentByLeadId(leadId: string): Promise<Payment | undefined> {
    const pay = usePlatformStore.getState().payments.find((p) => p.leadId === leadId);
    return delay(pay);
  },
  async recordPayment(data: Omit<Payment, 'id'>): Promise<Payment> {
    const pay = usePlatformStore.getState().recordPayment(data);
    return delay(pay);
  },
};

export const projectService = {
  async getProjects(): Promise<Project[]> {
    return delay(usePlatformStore.getState().projects);
  },
  async getProjectById(id: string): Promise<Project | undefined> {
    const project = usePlatformStore.getState().projects.find((p) => p.id === id);
    return delay(project);
  },
  async getProjectByLeadId(leadId: string): Promise<Project | undefined> {
    const project = usePlatformStore.getState().projects.find((p) => p.leadId === leadId);
    return delay(project);
  },
  async updateProjectStatus(id: string, status: ProjectStatus, notes?: string): Promise<void> {
    usePlatformStore.getState().updateProjectStatus(id, status, notes);
    return delay(undefined);
  },
  async updateProjectProgress(id: string, progress: number): Promise<void> {
    usePlatformStore.getState().updateProjectProgress(id, progress);
    return delay(undefined);
  },
  async assignProjectMember(id: string, memberId: string, memberName: string): Promise<void> {
    usePlatformStore.getState().assignProjectMember(id, memberId, memberName);
    return delay(undefined);
  },
};

export const activityService = {
  async getActivities(): Promise<Activity[]> {
    return delay(usePlatformStore.getState().activities);
  },
};
