export type UserRole = 'Admin' | 'Team A' | 'Team B' | 'Team C';

export type TeamName = 'Team A' | 'Team B' | 'Team C';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaarNumber: string; // 12-digit string, e.g. "987654321098"
  team: TeamName;
  role: UserRole;
  avatar: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export type LeadStatus = 'New' | 'Forwarded to Team B' | 'Selected' | 'Rejected' | 'Waiting';

export interface Lead {
  id: string; // LD-1001
  name: string;
  company: string;
  phone: string;
  email: string;
  area: string; // Chennai/Bengaluru/Hyderabad areas
  generatedByMemberId: string;
  generatedByName: string;
  date: string; // ISO or YYYY-MM-DD
  status: LeadStatus;
  notes?: string;
}

export type CallOutcome =
  | 'Interested'
  | 'Not Interested'
  | 'Call Later'
  | 'No Response'
  | 'Waiting'
  | 'Selected'
  | 'Rejected';

export interface Call {
  id: string; // CAL-1001
  leadId: string;
  memberId: string;
  memberName: string;
  startTime: string; // YYYY-MM-DD HH:mm:ss
  endTime: string;
  durationSeconds: number;
  outcome: CallOutcome;
  notes: string;
  date: string;
}

export type FollowUpStatus = 'Pending' | 'Completed' | 'Overdue';

export interface FollowUp {
  id: string; // FLP-1001
  leadId: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes: string;
  status: FollowUpStatus;
}

export type RequirementCategory =
  | 'Website Development'
  | 'E-commerce'
  | 'Advertisement / Ad Management'
  | 'Testing'
  | 'Other';

export interface Requirement {
  id: string; // REQ-1001
  leadId: string;
  clientId: string;
  clientName: string;
  companyName: string;
  category: RequirementCategory;
  detailedRequirement: string;
  budget?: number;
  expectedDeliveryDate: string;
  additionalNotes?: string;
}

export type PaymentStatus = 'Pending' | 'Partially Paid' | 'Paid';

export interface Payment {
  id: string; // PAY-1001
  leadId: string;
  clientId: string;
  amount: number;
  paidAmount: number;
  paymentDate: string;
  status: PaymentStatus;
  referenceId: string;
  notes?: string;
}

export type ProjectCategory =
  | 'Website Development'
  | 'E-commerce'
  | 'Advertisement / Ad Management'
  | 'Testing';

export type ProjectStatus = 'Not Started' | 'Active' | 'On Hold' | 'Pending' | 'Completed';

export interface Project {
  id: string; // PRJ-1001
  clientId: string;
  leadId: string;
  name: string;
  clientName: string;
  company: string;
  category: ProjectCategory;
  assignedMemberId: string;
  assignedMemberName: string;
  startDate: string;
  deadline: string;
  paymentStatus: PaymentStatus;
  projectStatus: ProjectStatus;
  progress: number; // 0 to 100
  requirementsId?: string;
  paymentId?: string;
  notes?: string;
}

export interface Activity {
  id: string; // ACT-1001
  timestamp: string; // YYYY-MM-DD HH:mm
  actorName: string;
  actorRole: UserRole;
  action: string;
  targetType: 'lead' | 'call' | 'followup' | 'requirement' | 'payment' | 'project' | 'member';
  targetId: string;
  details?: string;
}

export interface AuthState {
  currentUser: Member;
  role: UserRole;
}
