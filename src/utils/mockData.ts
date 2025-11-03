import type { Candidate, Job } from '../types';

/**
 * Generate mock candidate data for development and testing
 */
export function generateMockCandidates(): Candidate[] {
  const skills = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Python', 'Docker', 'Kubernetes'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
  const titles = [
    'Senior Software Engineer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Product Manager',
    'Data Scientist',
  ];
  const employmentTypes: Array<'w2' | '1099' | 'c2c' | 'flexible'> = ['w2', '1099', 'c2c', 'flexible'];
  const statuses: Array<Candidate['status']> = [
    'new',
    'screening',
    'interviewing',
    'offer',
    'hired',
    'rejected',
  ];

  const summaries = [
    'Experienced full-stack developer with expertise in modern web technologies and cloud platforms.',
    'Results-driven engineer passionate about building scalable systems and mentoring junior developers.',
    'Creative problem solver with strong background in microservices architecture and DevOps practices.',
    'Technical leader with proven track record of delivering complex projects on time and within budget.',
  ];

  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];

  return Array.from({ length: 30 }, (_, i) => ({
    id: `candidate-${i + 1}`,
    firstName: firstNames[i % firstNames.length],
    lastName: lastNames[i % lastNames.length],
    email: `candidate${i + 1}@example.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(
      Math.floor(Math.random() * 9000) + 1000
    )}`,
    location: locations[i % locations.length],
    title: titles[i % titles.length],
    experience: Math.floor(Math.random() * 15) + 1,
    skills: skills.slice(0, Math.floor(Math.random() * 5) + 3),
    status: statuses[i % statuses.length],
    rating: Math.floor(Math.random() * 5) + 1,
    notes: 'Sample candidate notes',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    source: (['website', 'referral', 'linkedin', 'indeed', 'agency'] as const)[i % 5],
    salary: {
      min: 80000 + Math.floor(Math.random() * 50000),
      max: 120000 + Math.floor(Math.random() * 80000),
      currency: 'USD',
    },
    linkedin: `https://linkedin.com/in/candidate${i + 1}`,
    employmentType: employmentTypes[i % 4],
    candidateSummary: summaries[i % 4],
    availabilityToInterview: i % 2 === 0 ? 'Immediate' : 'Within 1-2 weeks',
    availabilityToStart:
      i % 3 === 0 ? 'Immediate' : i % 3 === 1 ? '2 weeks notice' : '30 days notice',
    submittedJobs: [],
    interviews: [],
  }));
}

/**
 * Generate mock job data for development and testing
 */
export function generateMockJobs(): Job[] {
  const titles = [
    'Senior React Developer',
    'DevOps Engineer',
    'Product Designer',
    'Data Analyst',
    'Cloud Architect',
  ];
  const clients = [
    'Fortune 500 Financial',
    'Healthcare Tech Startup',
    'E-commerce Giant',
    'AI Research Lab',
  ];
  const departments = ['Engineering', 'Product', 'Design', 'Data'];
  const locations = ['Remote', 'New York', 'San Francisco', 'Austin'];
  const types: Array<Job['type']> = ['full-time', 'contract'];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `job-${i + 1}`,
    title: titles[i % titles.length],
    client: clients[i % clients.length],
    department: departments[i % departments.length],
    location: locations[i % locations.length],
    type: types[i % types.length],
    status: 'open' as const,
    payRateRange: '$100-150/hr',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}
