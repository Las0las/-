/**
 * Shared recruiting domain types. Pulled out of `CandidatesModule` so the
 * match intelligence engine (`intelligence.ts`) can score candidates against
 * jobs without importing a component file.
 */
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
  status: 'new' | 'screening' | 'interviewing' | 'offer' | 'hired' | 'rejected' | 'archived';
  rating: number;
  resume?: string;
  linkedin?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  source: 'website' | 'referral' | 'linkedin' | 'indeed' | 'agency';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  submittedJobs?: string[];
  interviews?: string[];
  employmentType?: 'w2' | '1099' | 'c2c' | 'flexible';
  candidateSummary?: string;
  availabilityToInterview?: string;
  availabilityToStart?: string;
}

export interface Job {
  id: string;
  title: string;
  client: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract';
  status: 'open' | 'closed' | 'paused';
  payRateRange: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  id: string;
  candidateId: string;
  jobId: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'offer';
  notes: string;
}
