import { Candidate, Job } from './domain';

/**
 * Candidate ↔ job match intelligence.
 *
 * This is the "automated candidate matching" capability the README has long
 * listed under Future Enhancements. It is deterministic scoring over the
 * data the recruiter already has on screen — skills, experience, engagement
 * type, location, and availability — not a generative model. Every score
 * ships with the reasons behind it so a recruiter can verify the call in
 * seconds instead of re-deriving it by hand, which is the actual time cost
 * this replaces: manually cross-checking one candidate against a stack of
 * open reqs.
 */

export type MatchTier = 'strong' | 'good' | 'possible' | 'weak';

export interface MatchScore {
  jobId: string;
  score: number;
  tier: MatchTier;
  reasons: string[];
}

export interface RankedJobMatch {
  job: Job;
  match: MatchScore;
}

const SKILL_VOCABULARY = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Python', 'Docker', 'Kubernetes'];

/** Expected skills for a job, inferred from title/department since jobs carry no explicit skill list. */
function inferExpectedSkills(job: Job): string[] {
  const haystack = `${job.title} ${job.department}`.toLowerCase();

  const direct = SKILL_VOCABULARY.filter((skill) => haystack.includes(skill.toLowerCase()));
  if (direct.length > 0) return direct;

  if (/devops|sre|platform|infrastructure/.test(haystack)) return ['AWS', 'Docker', 'Kubernetes'];
  if (/cloud|architect/.test(haystack)) return ['AWS', 'Docker', 'Kubernetes'];
  if (/data/.test(haystack)) return ['Python'];
  if (/full.?stack|backend|back-end/.test(haystack)) return ['Node.js', 'TypeScript'];
  if (/frontend|front-end|ui engineer/.test(haystack)) return ['React', 'TypeScript'];

  return [];
}

type SeniorityLevel = 'junior' | 'mid' | 'senior';

const LEVEL_MIN_YEARS: Record<SeniorityLevel, number> = { junior: 0, mid: 3, senior: 6 };

function expectedLevel(title: string): SeniorityLevel {
  const t = title.toLowerCase();
  if (/senior|lead|principal|staff|architect|manager/.test(t)) return 'senior';
  if (/junior|associate|entry/.test(t)) return 'junior';
  return 'mid';
}

const EMPLOYMENT_FIT: Record<Job['type'], Record<string, number>> = {
  'full-time': { w2: 1, flexible: 0.8, c2c: 0.3, '1099': 0.3 },
  contract: { c2c: 1, '1099': 1, flexible: 0.9, w2: 0.5 },
  'part-time': { flexible: 1, '1099': 0.8, w2: 0.6, c2c: 0.6 },
};

function employmentFit(candidate: Candidate, job: Job): number {
  const table = EMPLOYMENT_FIT[job.type];
  return table[candidate.employmentType ?? 'flexible'] ?? 0.6;
}

function locationFit(candidate: Candidate, job: Job): number {
  if (job.location === 'Remote') return 1;
  if (!candidate.location) return 0.5;
  const jobCity = job.location.toLowerCase();
  const candidateCity = candidate.location.toLowerCase().split(',')[0].trim();
  return candidate.location.toLowerCase().includes(jobCity) || jobCity.includes(candidateCity) ? 1 : 0.35;
}

function availabilityFit(candidate: Candidate): number {
  const availability = (candidate.availabilityToStart || '').toLowerCase();
  if (availability.includes('immediate')) return 1;
  if (availability.includes('2 week')) return 0.75;
  if (availability.includes('30 day')) return 0.5;
  return 0.6;
}

function experienceFit(candidate: Candidate, job: Job): { fit: number; level: SeniorityLevel; minYears: number } {
  const level = expectedLevel(job.title);
  const minYears = LEVEL_MIN_YEARS[level];

  if (candidate.experience >= minYears) {
    const over = candidate.experience - minYears;
    const fit = over <= 8 ? 1 : Math.max(0.6, 1 - (over - 8) * 0.03);
    return { fit, level, minYears };
  }

  const gap = minYears - candidate.experience;
  return { fit: Math.max(0, 1 - gap / Math.max(minYears, 1)), level, minYears };
}

const WEIGHTS = { skills: 0.4, experience: 0.2, employment: 0.15, location: 0.15, availability: 0.1 };

function tierFor(score: number): MatchTier {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'good';
  if (score >= 40) return 'possible';
  return 'weak';
}

export function scoreCandidateJob(candidate: Candidate, job: Job): MatchScore {
  const expectedSkills = inferExpectedSkills(job);
  const matchedSkills = expectedSkills.filter((skill) => candidate.skills.includes(skill));
  const skillFit = expectedSkills.length === 0 ? 0.5 : matchedSkills.length / expectedSkills.length;

  const { fit: expFit, level, minYears } = experienceFit(candidate, job);
  const empFit = employmentFit(candidate, job);
  const locFit = locationFit(candidate, job);
  const availFit = availabilityFit(candidate);

  const weighted =
    skillFit * WEIGHTS.skills +
    expFit * WEIGHTS.experience +
    empFit * WEIGHTS.employment +
    locFit * WEIGHTS.location +
    availFit * WEIGHTS.availability;

  const score = Math.round(weighted * 100);

  const reasons: string[] = [];

  if (expectedSkills.length === 0) {
    reasons.push('No clear skill signal from the req title — verify manually.');
  } else if (matchedSkills.length === expectedSkills.length) {
    reasons.push(`All ${expectedSkills.length} inferred skills matched (${matchedSkills.join(', ')}).`);
  } else if (matchedSkills.length > 0) {
    const missing = expectedSkills.filter((skill) => !matchedSkills.includes(skill));
    reasons.push(`${matchedSkills.length}/${expectedSkills.length} skills matched (${matchedSkills.join(', ')}); missing ${missing.join(', ')}.`);
  } else {
    reasons.push(`None of the inferred skills matched (${expectedSkills.join(', ')}).`);
  }

  reasons.push(
    candidate.experience >= minYears
      ? `${candidate.experience} yrs experience covers the ~${minYears}+ expected for a ${level}-level req.`
      : `${candidate.experience} yrs experience is short of the ~${minYears}+ typically expected for a ${level}-level req.`,
  );

  reasons.push(`Engagement type ${candidate.employmentType?.toUpperCase() ?? 'FLEXIBLE'} vs a ${job.type} role.`);
  reasons.push(`Location ${candidate.location || 'unknown'} vs ${job.location}.`);

  if (candidate.availabilityToStart) {
    reasons.push(`Available to start: ${candidate.availabilityToStart}.`);
  }

  return { jobId: job.id, score, tier: tierFor(score), reasons };
}

/** Rank open jobs for one candidate, best fit first. */
export function rankJobsForCandidate(candidate: Candidate, jobs: Job[], limit = 3): RankedJobMatch[] {
  return jobs
    .filter((job) => job.status === 'open')
    .map((job) => ({ job, match: scoreCandidateJob(candidate, job) }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);
}

/** A one-shot Plan-mode answer for a focused candidate: the recommended next move, computed, not fabricated. */
export function summarizePlan(ranked: RankedJobMatch[]): { summary: string; steps: string[] } {
  if (ranked.length === 0) {
    return { summary: 'No open requisitions to match against right now.', steps: [] };
  }

  const [top, ...rest] = ranked;
  const summary = `Best fit: ${top.job.title} at ${top.job.client} — ${top.match.score}% match (${top.match.tier}).`;
  const steps = [
    `Submit to ${top.job.title} (${top.job.client}) — ${top.match.reasons[0]}`,
    ...rest.map((entry) => `Backup: ${entry.job.title} at ${entry.job.client} — ${entry.match.score}% match.`),
  ];

  return { summary, steps };
}
