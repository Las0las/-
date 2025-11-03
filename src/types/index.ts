/**
 * Core type definitions for the recruitment dashboard
 */

// Candidate Types
export type CandidateStatus = 'new' | 'screening' | 'interviewing' | 'offer' | 'hired' | 'rejected' | 'archived';
export type CandidateSource = 'website' | 'referral' | 'linkedin' | 'indeed' | 'agency';
export type EmploymentType = 'w2' | '1099' | 'c2c' | 'flexible';

export interface Salary {
  min: number;
  max: number;
  currency: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  experience: number;
  skills: string[];
  status: CandidateStatus;
  rating: number;
  resume?: string;
  linkedin?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  source: CandidateSource;
  salary?: Salary;
  submittedJobs?: string[];
  interviews?: string[];
  employmentType?: EmploymentType;
  candidateSummary?: string;
  availabilityToInterview?: string;
  availabilityToStart?: string;
}

// Form-specific type for creating/editing candidates
export type CandidateFormData = Omit<Candidate, 'id' | 'createdAt' | 'updatedAt' | 'skills'> & {
  skills: string | string[]; // Allow both formats for form handling
};

// Job Types
export type JobType = 'full-time' | 'part-time' | 'contract';
export type JobStatus = 'open' | 'closed' | 'paused';

export interface Job {
  id: string;
  title: string;
  client: string;
  department: string;
  location: string;
  type: JobType;
  status: JobStatus;
  payRateRange: string;
  createdAt?: string;
  updatedAt?: string;
}

// Submission Types
export type SubmissionStatus = 'pending' | 'accepted' | 'rejected' | 'interview' | 'offer';

export interface Submission {
  id: string;
  candidateId: string;
  jobId: string;
  submittedAt: string;
  status: SubmissionStatus;
  notes: string;
}

// UI State Types
export type ViewMode = 'table' | 'kanban';
export type SidebarContent = 'profile' | 'submit' | 'interview' | 'newCandidate' | 'editCandidate';

export interface FilterState {
  searchTerm: string;
  status: string;
  showArchived: boolean;
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export interface UIState {
  loading: boolean;
  error: string | null;
  saving: boolean;
  sidebarOpen: boolean;
  sidebarContent: SidebarContent;
}

// Form Validation
export interface ValidationErrors {
  [key: string]: string;
}

// Delete Confirmation
export interface DeleteConfirmation {
  type: 'candidate' | 'job';
  item: Candidate | Job;
}

// Statistics
export interface DashboardStats {
  total: number;
  active: number;
  thisWeek: number;
  archived: number;
}

// Component Props Types
export interface TableRowProps {
  candidate: Candidate;
  jobs: Job[];
  submissions: Submission[];
  onView: () => void;
  onSubmit: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}

export interface CandidateCardProps {
  candidate: Candidate;
  onClick: () => void;
  onSubmit: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onArchive?: (e: React.MouseEvent) => void;
  onRestore?: (e: React.MouseEvent) => void;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
