import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Candidate, Job, Submission } from '../types';

const STORAGE_KEYS = {
  CANDIDATES: 'aberdeen_candidates',
  JOBS: 'aberdeen_jobs',
  SUBMISSIONS: 'aberdeen_submissions',
};

interface UseCandidatesReturn {
  candidates: Candidate[];
  jobs: Job[];
  submissions: Submission[];
  createCandidate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
  deleteCandidate: (id: string) => void;
  archiveCandidate: (id: string) => void;
  restoreCandidate: (id: string) => void;
  submitToJob: (candidateId: string, jobId: string, notes: string) => void;
  error: Error | null;
}

/**
 * Custom hook for managing candidates data and operations
 */
export function useCandidates(
  initialCandidates: Candidate[] = [],
  initialJobs: Job[] = [],
  initialSubmissions: Submission[] = []
): UseCandidatesReturn {
  const [candidates, setCandidates, candidatesError] = useLocalStorage<Candidate[]>(
    STORAGE_KEYS.CANDIDATES,
    initialCandidates
  );

  const [jobs, setJobs, jobsError] = useLocalStorage<Job[]>(
    STORAGE_KEYS.JOBS,
    initialJobs
  );

  const [submissions, setSubmissions, submissionsError] = useLocalStorage<Submission[]>(
    STORAGE_KEYS.SUBMISSIONS,
    initialSubmissions
  );

  // Combine errors
  const error = candidatesError || jobsError || submissionsError;

  /**
   * Create a new candidate
   */
  const createCandidate = useCallback(
    (candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newCandidate: Candidate = {
        ...candidateData,
        id: `candidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setCandidates((prev) => [...prev, newCandidate]);
    },
    [setCandidates]
  );

  /**
   * Update an existing candidate
   */
  const updateCandidate = useCallback(
    (id: string, updates: Partial<Candidate>) => {
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id
            ? { ...candidate, ...updates, updatedAt: new Date().toISOString() }
            : candidate
        )
      );
    },
    [setCandidates]
  );

  /**
   * Delete a candidate permanently
   */
  const deleteCandidate = useCallback(
    (id: string) => {
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
      // Also remove related submissions
      setSubmissions((prev) => prev.filter((submission) => submission.candidateId !== id));
    },
    [setCandidates, setSubmissions]
  );

  /**
   * Archive a candidate
   */
  const archiveCandidate = useCallback(
    (id: string) => {
      updateCandidate(id, { status: 'archived' });
    },
    [updateCandidate]
  );

  /**
   * Restore an archived candidate
   */
  const restoreCandidate = useCallback(
    (id: string) => {
      updateCandidate(id, { status: 'new' });
    },
    [updateCandidate]
  );

  /**
   * Submit a candidate to a job
   */
  const submitToJob = useCallback(
    (candidateId: string, jobId: string, notes: string) => {
      // Update candidate's submitted jobs list
      setCandidates((prev) =>
        prev.map((candidate) => {
          if (candidate.id === candidateId) {
            const submittedJobs = candidate.submittedJobs || [];
            return {
              ...candidate,
              submittedJobs: [...submittedJobs, jobId],
              updatedAt: new Date().toISOString(),
            };
          }
          return candidate;
        })
      );

      // Create new submission record
      const newSubmission: Submission = {
        id: `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        candidateId,
        jobId,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        notes,
      };

      setSubmissions((prev) => [...prev, newSubmission]);
    },
    [setCandidates, setSubmissions]
  );

  return {
    candidates,
    jobs,
    submissions,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    archiveCandidate,
    restoreCandidate,
    submitToJob,
    error,
  };
}
