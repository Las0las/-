import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import {
  Search, Grid3x3, Table, Plus, X, ChevronRight,
  Mail, Phone, MapPin, Briefcase, Calendar, Archive, Edit,
  Users, FileText, Star, Send, AlertCircle, Loader2,
  Download, Upload, Eye, MoreVertical, Trash2, CheckCircle,
  ExternalLink, Clock, Building, DollarSign, Linkedin,
  CalendarDays, UserCheck, FileCheck, Shield, AlertTriangle
} from 'lucide-react';

// Types & Interfaces
interface Candidate {
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

interface Job {
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

interface Submission {
  id: string;
  candidateId: string;
  jobId: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'interview' | 'offer';
  notes: string;
}

// LocalStorage Keys
const STORAGE_KEYS = {
  CANDIDATES: 'aberdeen_candidates',
  JOBS: 'aberdeen_jobs',
  SUBMISSIONS: 'aberdeen_submissions',
  INTERVIEWS: 'aberdeen_interviews',
  PREFERENCES: 'aberdeen_preferences'
};

// Constants
const ITEMS_PER_PAGE = 20;
const VIRTUAL_SCROLL_OVERSCAN = 3;
const DEBOUNCE_DELAY = 300;
const ROW_HEIGHT = 80;

// Utility Functions
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  const re = /^\+?[\d\s-()]+$/;
  return phone.length >= 10 && re.test(phone);
};

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<[^>]*>/g, '');
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
              <p className="text-gray-400 mb-4">An error occurred while loading this component.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Reload Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

// Virtual Scroll Component
const VirtualScroll: React.FC<{
  items: any[];
  rowHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  containerHeight: number;
}> = memo(({ items, rowHeight, renderItem, containerHeight }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * rowHeight;
  const visibleItems = Math.ceil(containerHeight / rowHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - VIRTUAL_SCROLL_OVERSCAN);
  const endIndex = Math.min(items.length, startIndex + visibleItems + VIRTUAL_SCROLL_OVERSCAN * 2);
  const offsetY = startIndex * rowHeight;

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      setScrollTop(scrollContainerRef.current.scrollTop);
    }
  }, []);

  const visibleData = items.slice(startIndex, endIndex);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleData.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  );
});

// Mock Data Generator
const generateMockCandidates = (): Candidate[] => {
  const skills = ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS', 'Python', 'Docker', 'Kubernetes'];
  const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];
  const titles = ['Senior Software Engineer', 'Full Stack Developer', 'DevOps Engineer', 'Product Manager', 'Data Scientist'];
  const employmentTypes: Array<'w2' | '1099' | 'c2c' | 'flexible'> = ['w2', '1099', 'c2c', 'flexible'];

  const summaries = [
    'Experienced full-stack developer with expertise in modern web technologies and cloud platforms.',
    'Results-driven engineer passionate about building scalable systems and mentoring junior developers.',
    'Creative problem solver with strong background in microservices architecture and DevOps practices.',
    'Technical leader with proven track record of delivering complex projects on time and within budget.'
  ];

  return Array.from({ length: 30 }, (_, i) => ({
    id: `candidate-${i + 1}`,
    firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa'][i % 8],
    lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
    email: `candidate${i + 1}@example.com`,
    phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    location: locations[i % locations.length],
    title: titles[i % titles.length],
    experience: Math.floor(Math.random() * 15) + 1,
    skills: skills.slice(0, Math.floor(Math.random() * 5) + 3),
    status: ['new', 'screening', 'interviewing', 'offer', 'hired', 'rejected'][i % 6] as Candidate['status'],
    rating: Math.floor(Math.random() * 5) + 1,
    notes: 'Sample candidate notes',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    source: ['website', 'referral', 'linkedin', 'indeed', 'agency'][i % 5] as Candidate['source'],
    salary: {
      min: 80000 + Math.floor(Math.random() * 50000),
      max: 120000 + Math.floor(Math.random() * 80000),
      currency: 'USD'
    },
    linkedin: `https://linkedin.com/in/candidate${i + 1}`,
    employmentType: employmentTypes[i % 4],
    candidateSummary: summaries[i % 4],
    availabilityToInterview: i % 2 === 0 ? 'Immediate' : 'Within 1-2 weeks',
    availabilityToStart: i % 3 === 0 ? 'Immediate' : i % 3 === 1 ? '2 weeks notice' : '30 days notice',
    submittedJobs: [],
    interviews: []
  }));
};

const generateMockJobs = (): Job[] => {
  return Array.from({ length: 15 }, (_, i) => ({
    id: `job-${i + 1}`,
    title: ['Senior React Developer', 'DevOps Engineer', 'Product Designer', 'Data Analyst', 'Cloud Architect'][i % 5],
    client: ['Fortune 500 Financial', 'Healthcare Tech Startup', 'E-commerce Giant', 'AI Research Lab'][i % 4],
    department: ['Engineering', 'Product', 'Design', 'Data'][i % 4],
    location: ['Remote', 'New York', 'San Francisco', 'Austin'][i % 4],
    type: ['full-time', 'contract'][i % 2] as Job['type'],
    status: 'open',
    payRateRange: '$100-150/hr',
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }));
};

// Table Row Component - Memoized for performance
const TableRow = memo(({
  candidate,
  jobs,
  submissions,
  onView,
  onSubmit,
  onEdit,
  onArchive,
  onRestore,
  onDelete
}: {
  candidate: Candidate;
  jobs: Job[];
  submissions: Submission[];
  onView: () => void;
  onSubmit: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onRestore: () => void;
  onDelete: () => void;
}) => (
  <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors" style={{ height: ROW_HEIGHT }}>
    <td className="p-4">
      <button
        onClick={onView}
        className="flex items-center space-x-3 hover:text-purple-400 transition-colors"
      >
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
          {candidate.firstName[0]}{candidate.lastName[0]}
        </div>
        <div className="text-left">
          <div className="text-white font-medium">{candidate.firstName} {candidate.lastName}</div>
          <div className="text-gray-400 text-sm">{candidate.email}</div>
        </div>
      </button>
    </td>
    <td className="p-4 text-gray-300">{candidate.title}</td>
    <td className="p-4 text-gray-300">{candidate.location}</td>
    <td className="p-4 text-gray-300">{candidate.experience} years</td>
    <td className="p-4">
      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium uppercase">
        {candidate.employmentType || 'Any'}
      </span>
    </td>
    <td className="p-4 text-gray-300 text-sm">
      {candidate.availabilityToStart || 'TBD'}
    </td>
    <td className="p-4">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        candidate.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
        candidate.status === 'screening' ? 'bg-yellow-500/20 text-yellow-400' :
        candidate.status === 'interviewing' ? 'bg-purple-500/20 text-purple-400' :
        candidate.status === 'offer' ? 'bg-green-500/20 text-green-400' :
        candidate.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400' :
        candidate.status === 'archived' ? 'bg-gray-500/20 text-gray-400' :
        'bg-red-500/20 text-red-400'
      }`}>
        {candidate.status}
      </span>
    </td>
    <td className="p-4">
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < candidate.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
          />
        ))}
      </div>
    </td>
    <td className="p-4">
      <div className="flex items-center space-x-2">
        {candidate.linkedin && (
          <a
            href={candidate.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="View LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-gray-400" />
          </a>
        )}
        {candidate.status !== 'archived' ? (
          <>
            <button
              onClick={onSubmit}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Submit to Job"
            >
              <Send className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onEdit}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Edit Candidate"
            >
              <Edit className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onArchive}
              className="p-1 hover:bg-red-700 rounded transition-colors"
              title="Archive Candidate"
            >
              <Archive className="w-4 h-4 text-red-400" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onRestore}
              className="p-1 hover:bg-green-700 rounded transition-colors"
              title="Restore Candidate"
            >
              <CheckCircle className="w-4 h-4 text-green-400" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 hover:bg-red-700 rounded transition-colors"
              title="Delete Permanently"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </>
        )}
      </div>
    </td>
  </tr>
));

// Main Component
const CandidatesModule: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<'profile' | 'submit' | 'interview' | 'newCandidate' | 'editCandidate'>('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'candidate' | 'job', item: any } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize data from localStorage with error handling
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedCandidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES);
        const storedJobs = localStorage.getItem(STORAGE_KEYS.JOBS);
        const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);

        if (storedCandidates) {
          const parsed = JSON.parse(storedCandidates);
          if (Array.isArray(parsed)) {
            setCandidates(parsed);
          } else {
            throw new Error('Invalid candidates data');
          }
        } else {
          const mockCandidates = generateMockCandidates();
          setCandidates(mockCandidates);
          localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(mockCandidates));
        }

        if (storedJobs) {
          const parsed = JSON.parse(storedJobs);
          if (Array.isArray(parsed)) {
            setJobs(parsed);
          } else {
            throw new Error('Invalid jobs data');
          }
        } else {
          const mockJobs = generateMockJobs();
          setJobs(mockJobs);
          localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(mockJobs));
        }

        if (storedSubmissions) {
          const parsed = JSON.parse(storedSubmissions);
          if (Array.isArray(parsed)) {
            setSubmissions(parsed);
          } else {
            setSubmissions([]);
          }
        } else {
          setSubmissions([]);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadData, 100);
    return () => clearTimeout(timer);
  }, []);

  // Save to localStorage with error handling and batching
  useEffect(() => {
    if (!loading && !saving) {
      const saveData = async () => {
        try {
          setSaving(true);
          localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
          localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
          localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
        } catch (err) {
          console.error('Error saving data:', err);
          setError('Failed to save data. Storage might be full.');
        } finally {
          setSaving(false);
        }
      };

      const timer = setTimeout(saveData, 500);
      return () => clearTimeout(timer);
    }
  }, [candidates, jobs, submissions, loading, saving]);

  // Click outside handler for sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [sidebarOpen]);

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term: string) => setSearchTerm(term), DEBOUNCE_DELAY),
    []
  );

  // CRUD Operations with optimistic updates
  const handleCreateCandidate = useCallback((candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCandidate: Candidate = {
        ...candidateData,
        id: `candidate-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCandidates(prev => [...prev, newCandidate]);
      setSidebarOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to create candidate');
    }
  }, []);

  const handleUpdateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    try {
      setCandidates(prev => prev.map(c =>
        c.id === id
          ? { ...c, ...updates, updatedAt: new Date().toISOString() }
          : c
      ));
      setSidebarOpen(false);
      setSelectedCandidate(null);
      setError(null);
    } catch (err) {
      setError('Failed to update candidate');
    }
  }, []);

  const handleArchiveCandidate = useCallback((id: string) => {
    try {
      setCandidates(prev => prev.map(c =>
        c.id === id
          ? { ...c, status: 'archived', updatedAt: new Date().toISOString() }
          : c
      ));
      setDeleteConfirm(null);
      setError(null);
    } catch (err) {
      setError('Failed to archive candidate');
    }
  }, []);

  const handleRestoreCandidate = useCallback((id: string) => {
    try {
      setCandidates(prev => prev.map(c =>
        c.id === id
          ? { ...c, status: 'new', updatedAt: new Date().toISOString() }
          : c
      ));
      setError(null);
    } catch (err) {
      setError('Failed to restore candidate');
    }
  }, []);

  const handleDeleteCandidate = useCallback((id: string) => {
    try {
      setCandidates(prev => prev.filter(c => c.id !== id));
      setSubmissions(prev => prev.filter(s => s.candidateId !== id));
      setDeleteConfirm(null);
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(null);
        setSidebarOpen(false);
      }
      setError(null);
    } catch (err) {
      setError('Failed to delete candidate');
    }
  }, [selectedCandidate]);

  const handleSubmitToJob = useCallback((candidateId: string, jobId: string, notes: string) => {
    try {
      setCandidates(prev => prev.map(c => {
        if (c.id === candidateId) {
          return {
            ...c,
            submittedJobs: [...(c.submittedJobs || []), jobId],
            updatedAt: new Date().toISOString()
          };
        }
        return c;
      }));

      const newSubmission: Submission = {
        id: `submission-${Date.now()}`,
        candidateId,
        jobId,
        submittedAt: new Date().toISOString(),
        status: 'pending',
        notes
      };
      setSubmissions(prev => [...prev, newSubmission]);
      setSidebarOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to submit candidate');
    }
  }, []);

  // Filter candidates with memoization
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const isArchived = candidate.status === 'archived';
      if (!showArchived && isArchived) return false;
      if (showArchived && !isArchived) return false;

      const matchesSearch =
        candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidate.candidateSummary?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      const matchesFilter = filterStatus === 'all' || candidate.status === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [candidates, searchTerm, filterStatus, showArchived]);

  // Paginated candidates
  const paginatedCandidates = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredCandidates.slice(startIndex, endIndex);
  }, [filteredCandidates, currentPage]);

  const totalPages = Math.ceil(filteredCandidates.length / ITEMS_PER_PAGE);

  // Stats with memoization
  const stats = useMemo(() => ({
    total: candidates.filter(c => c.status !== 'archived').length,
    active: candidates.filter(c => c.status !== 'rejected' && c.status !== 'archived').length,
    thisWeek: candidates.filter(c => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.createdAt) > weekAgo && c.status !== 'archived';
    }).length,
    archived: candidates.filter(c => c.status === 'archived').length
  }), [candidates]);

  // Header Component
  const Header = () => (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-1">
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {showArchived ? 'Archived Candidates' : 'Candidates'}
            </h1>
            <p className="text-gray-400 mt-1">Manage and track all candidates</p>
          </div>
          <div className="flex items-center space-x-4">
            {error && (
              <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                showArchived
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Archive className="w-5 h-5" />
              <span>{showArchived ? 'Show Active' : `View Archived (${stats.archived})`}</span>
            </button>
            <button
              onClick={() => {
                setSelectedCandidate(null);
                setSidebarContent('newCandidate');
                setSidebarOpen(true);
              }}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Candidate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Toolbar Component
  const Toolbar = () => {
    const [localSearch, setLocalSearch] = useState(searchTerm);

    useEffect(() => {
      debouncedSearch(localSearch);
    }, [localSearch, debouncedSearch]);

    return (
      <div className="bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="screening">Screening</option>
              <option value="interviewing">Interviewing</option>
              <option value="offer">Offer</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
            {saving && (
              <div className="flex items-center text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded ${view === 'table' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
            >
              <Table className="w-5 h-5" />
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded ${view === 'kanban' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Table View Component with virtualization
  const TableView = () => (
    <div className="relative">
      <div ref={tableContainerRef} className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
            <tr>
              <th className="text-left p-4 text-gray-300">Name</th>
              <th className="text-left p-4 text-gray-300">Title</th>
              <th className="text-left p-4 text-gray-300">Location</th>
              <th className="text-left p-4 text-gray-300">Experience</th>
              <th className="text-left p-4 text-gray-300">Employment</th>
              <th className="text-left p-4 text-gray-300">Availability</th>
              <th className="text-left p-4 text-gray-300">Status</th>
              <th className="text-left p-4 text-gray-300">Rating</th>
              <th className="text-left p-4 text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCandidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                candidate={candidate}
                jobs={jobs}
                submissions={submissions}
                onView={() => {
                  setSelectedCandidate(candidate);
                  setSidebarContent('profile');
                  setSidebarOpen(true);
                }}
                onSubmit={() => {
                  setSelectedCandidate(candidate);
                  setSidebarContent('submit');
                  setSidebarOpen(true);
                }}
                onEdit={() => {
                  setSelectedCandidate(candidate);
                  setSidebarContent('editCandidate');
                  setSidebarOpen(true);
                }}
                onArchive={() => setDeleteConfirm({ type: 'candidate', item: candidate })}
                onRestore={() => handleRestoreCandidate(candidate.id)}
                onDelete={() => setDeleteConfirm({ type: 'candidate', item: candidate })}
              />
            ))}
          </tbody>
        </table>
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">
              {showArchived ? 'No archived candidates found' : 'No candidates found'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="text-gray-400 text-sm">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCandidates.length)} of {filteredCandidates.length} candidates
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
              if (pageNum > totalPages) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Kanban View Component
  const KanbanView = () => {
    const columns = showArchived
      ? ['archived']
      : ['new', 'screening', 'interviewing', 'offer', 'hired', 'rejected'];

    return (
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {columns.map((status) => {
          const columnCandidates = filteredCandidates.filter(c => c.status === status);

          return (
            <div key={status} className="flex-shrink-0 w-80">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium capitalize">{status}</h3>
                  <span className="text-gray-400 text-sm">{columnCandidates.length}</span>
                </div>
                <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {columnCandidates.slice(0, 20).map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setSidebarContent('profile');
                        setSidebarOpen(true);
                      }}
                      className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {candidate.firstName[0]}{candidate.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{candidate.firstName} {candidate.lastName}</div>
                          <div className="text-gray-400 text-sm">{candidate.title}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-400 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {candidate.location}
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {candidate.experience} years
                        </div>
                        {candidate.employmentType && (
                          <div className="flex items-center text-gray-400 text-sm">
                            <FileCheck className="w-4 h-4 mr-1" />
                            {candidate.employmentType.toUpperCase()}
                          </div>
                        )}
                        {candidate.availabilityToStart && (
                          <div className="flex items-center text-gray-400 text-sm">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            {candidate.availabilityToStart}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < candidate.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-1">
                          {candidate.linkedin && (
                            <a
                              href={candidate.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1 hover:bg-gray-800 rounded transition-colors"
                            >
                              <Linkedin className="w-4 h-4 text-gray-400" />
                            </a>
                          )}
                          {status !== 'archived' ? (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCandidate(candidate);
                                  setSidebarContent('submit');
                                  setSidebarOpen(true);
                                }}
                                className="p-1 hover:bg-gray-800 rounded transition-colors"
                              >
                                <Send className="w-4 h-4 text-gray-400" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCandidate(candidate);
                                  setSidebarContent('editCandidate');
                                  setSidebarOpen(true);
                                }}
                                className="p-1 hover:bg-gray-800 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4 text-gray-400" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestoreCandidate(candidate.id);
                              }}
                              className="p-1 hover:bg-green-800 rounded transition-colors"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnCandidates.length > 20 && (
                    <div className="text-center py-2 text-gray-500 text-sm">
                      +{columnCandidates.length - 20} more
                    </div>
                  )}
                  {columnCandidates.length === 0 && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No candidates
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Sidebar Component with validation
  const Sidebar = () => {
    const [formData, setFormData] = useState<any>({});
    const [submitJobId, setSubmitJobId] = useState('');
    const [submitNotes, setSubmitNotes] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
      if (sidebarContent === 'editCandidate' && selectedCandidate) {
        setFormData({
          ...selectedCandidate,
          skills: selectedCandidate.skills.join(', ')
        });
      } else if (sidebarContent === 'newCandidate') {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          title: '',
          location: '',
          experience: 0,
          skills: '',
          source: 'website',
          status: 'new',
          rating: 3,
          notes: '',
          salary: { min: 0, max: 0, currency: 'USD' },
          linkedin: '',
          employmentType: 'flexible',
          candidateSummary: '',
          availabilityToInterview: '',
          availabilityToStart: ''
        });
      }
      setFormErrors({});
    }, [sidebarContent, selectedCandidate]);

    const validateForm = (): boolean => {
      const errors: Record<string, string> = {};

      if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
      if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';

      if (!formData.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Invalid email format';
      }

      if (formData.phone && !validatePhone(formData.phone)) {
        errors.phone = 'Invalid phone format';
      }

      if (!formData.title?.trim()) errors.title = 'Title is required';

      if (formData.linkedin && !formData.linkedin.startsWith('http')) {
        errors.linkedin = 'LinkedIn URL must start with http:// or https://';
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSaveCandidate = () => {
      if (!validateForm()) {
        return;
      }

      const skillsArray = typeof formData.skills === 'string'
        ? formData.skills.split(',').map((s: string) => sanitizeInput(s).trim()).filter(Boolean)
        : formData.skills;

      const sanitizedData = {
        ...formData,
        firstName: sanitizeInput(formData.firstName),
        lastName: sanitizeInput(formData.lastName),
        email: sanitizeInput(formData.email),
        title: sanitizeInput(formData.title),
        notes: sanitizeInput(formData.notes || ''),
        candidateSummary: sanitizeInput(formData.candidateSummary || ''),
        skills: skillsArray,
        submittedJobs: formData.submittedJobs || [],
        interviews: formData.interviews || []
      };

      if (sidebarContent === 'newCandidate') {
        handleCreateCandidate(sanitizedData);
      } else if (sidebarContent === 'editCandidate' && selectedCandidate) {
        handleUpdateCandidate(selectedCandidate.id, sanitizedData);
      }
    };

    const handleSubmitJob = () => {
      if (selectedCandidate && submitJobId) {
        handleSubmitToJob(selectedCandidate.id, submitJobId, sanitizeInput(submitNotes));
        setSubmitJobId('');
        setSubmitNotes('');
      } else {
        setFormErrors({ submit: 'Please select a job' });
      }
    };

    const renderContent = () => {
      switch (sidebarContent) {
        case 'profile':
          return selectedCandidate ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h2>
                  <p className="text-gray-400">{selectedCandidate.title}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < selectedCandidate.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {selectedCandidate.candidateSummary && (
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Summary</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{selectedCandidate.candidateSummary}</p>
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <span>{selectedCandidate.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span>{selectedCandidate.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{selectedCandidate.location}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <span>{selectedCandidate.experience} years experience</span>
                </div>
                {selectedCandidate.linkedin && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Linkedin className="w-5 h-5 text-gray-500" />
                    <a
                      href={selectedCandidate.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {selectedCandidate.salary && (
                  <div className="flex items-center space-x-3 text-gray-300">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <span>
                      ${selectedCandidate.salary.min.toLocaleString()} - ${selectedCandidate.salary.max.toLocaleString()} {selectedCandidate.salary.currency}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-white font-medium mb-2">Employment Type</h3>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm uppercase">
                    {selectedCandidate.employmentType || 'Flexible'}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCandidate.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                    selectedCandidate.status === 'screening' ? 'bg-yellow-500/20 text-yellow-400' :
                    selectedCandidate.status === 'interviewing' ? 'bg-purple-500/20 text-purple-400' :
                    selectedCandidate.status === 'offer' ? 'bg-green-500/20 text-green-400' :
                    selectedCandidate.status === 'hired' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedCandidate.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedCandidate.availabilityToInterview && (
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <UserCheck className="w-4 h-4 mr-1" /> Interview Availability
                    </h3>
                    <p className="text-gray-400 text-sm">{selectedCandidate.availabilityToInterview}</p>
                  </div>
                )}
                {selectedCandidate.availabilityToStart && (
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <CalendarDays className="w-4 h-4 mr-1" /> Start Availability
                    </h3>
                    <p className="text-gray-400 text-sm">{selectedCandidate.availabilityToStart}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCandidate.notes && (
                <div>
                  <h3 className="text-white font-medium mb-2">Notes</h3>
                  <p className="text-gray-400 text-sm">{selectedCandidate.notes}</p>
                </div>
              )}

              {selectedCandidate.submittedJobs && selectedCandidate.submittedJobs.length > 0 && (
                <div>
                  <h3 className="text-white font-medium mb-2">Submitted to Jobs</h3>
                  <div className="space-y-2">
                    {selectedCandidate.submittedJobs.map(jobId => {
                      const job = jobs.find(j => j.id === jobId);
                      const submission = submissions.find(s => s.candidateId === selectedCandidate.id && s.jobId === jobId);
                      return job ? (
                        <div key={jobId} className="bg-gray-800 rounded p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium">{job.title}</div>
                              <div className="text-gray-400 text-sm">{job.client}</div>
                            </div>
                            {submission && (
                              <span className={`px-2 py-1 rounded text-xs ${
                                submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                submission.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                submission.status === 'interview' ? 'bg-purple-500/20 text-purple-400' :
                                submission.status === 'offer' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {submission.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => setSidebarContent('submit')}
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit to Job
                </button>
                <button
                  onClick={() => setSidebarContent('editCandidate')}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : null;

        case 'submit':
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Submit Candidate to Job</h2>
              {selectedCandidate && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        {selectedCandidate.firstName} {selectedCandidate.lastName}
                      </div>
                      <div className="text-gray-400 text-sm">{selectedCandidate.title}</div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-gray-300 mb-2">Select Job *</label>
                <select
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={submitJobId}
                  onChange={(e) => setSubmitJobId(e.target.value)}
                >
                  <option value="">Choose a job...</option>
                  {jobs.filter(j => j.status === 'open').map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.client} ({job.type})
                    </option>
                  ))}
                </select>
                {formErrors.submit && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.submit}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Cover Letter / Notes</label>
                <textarea
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={6}
                  placeholder="Add any relevant notes or cover letter..."
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmitJob}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                Submit Candidate
              </button>
            </div>
          );

        case 'newCandidate':
        case 'editCandidate':
          return (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">
                {sidebarContent === 'newCandidate' ? 'Add New Candidate' : 'Edit Candidate'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">First Name *</label>
                  <input
                    type="text"
                    className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.firstName ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                    }`}
                    placeholder="John"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  {formErrors.firstName && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Last Name *</label>
                  <input
                    type="text"
                    className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                      formErrors.lastName ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                    }`}
                    placeholder="Doe"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                  {formErrors.lastName && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.email ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  placeholder="john.doe@example.com"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {formErrors.email && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.phone ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                {formErrors.phone && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.linkedin ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  placeholder="https://linkedin.com/in/johndoe"
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                />
                {formErrors.linkedin && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.linkedin}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Current Title *</label>
                <input
                  type="text"
                  className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.title ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  placeholder="Senior Software Engineer"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
                {formErrors.title && (
                  <p className="text-red-400 text-sm mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Candidate Summary</label>
                <textarea
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  placeholder="Brief summary of the candidate's background and strengths..."
                  value={formData.candidateSummary || ''}
                  onChange={(e) => setFormData({...formData, candidateSummary: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="New York, NY"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Experience (years)</label>
                <input
                  type="number"
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="5"
                  value={formData.experience || 0}
                  onChange={(e) => setFormData({...formData, experience: parseInt(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="React, TypeScript, Node.js"
                  value={formData.skills || ''}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Employment Type</label>
                  <select
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.employmentType || 'flexible'}
                    onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                  >
                    <option value="flexible">Flexible</option>
                    <option value="w2">W2</option>
                    <option value="1099">1099</option>
                    <option value="c2c">C2C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Source</label>
                  <select
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.source || 'website'}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="indeed">Indeed</option>
                    <option value="agency">Agency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Interview Availability</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Immediate, 1 week notice, etc."
                    value={formData.availabilityToInterview || ''}
                    onChange={(e) => setFormData({...formData, availabilityToInterview: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Start Availability</label>
                  <input
                    type="text"
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="2 weeks notice, 30 days, etc."
                    value={formData.availabilityToStart || ''}
                    onChange={(e) => setFormData({...formData, availabilityToStart: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">Status</label>
                  <select
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.status || 'new'}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="new">New</option>
                    <option value="screening">Screening</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offer">Offer</option>
                    <option value="hired">Hired</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Rating</label>
                  <select
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={formData.rating || 3}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Salary Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Min salary"
                    value={formData.salary?.min || 0}
                    onChange={(e) => setFormData({...formData, salary: {...(formData.salary || {}), min: parseInt(e.target.value) || 0, currency: 'USD'}})}
                  />
                  <input
                    type="number"
                    className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Max salary"
                    value={formData.salary?.max || 0}
                    onChange={(e) => setFormData({...formData, salary: {...(formData.salary || {}), max: parseInt(e.target.value) || 0, currency: 'USD'}})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Notes</label>
                <textarea
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={4}
                  placeholder="Add any relevant notes..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <button
                onClick={handleSaveCandidate}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
              >
                {sidebarContent === 'newCandidate' ? 'Add Candidate' : 'Update Candidate'}
              </button>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <>
        {/* Overlay for click-away */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 z-50 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-white font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                {sidebarContent === 'profile' ? 'Candidate Profile' :
                 sidebarContent === 'submit' ? 'Submit to Job' :
                 sidebarContent === 'editCandidate' ? 'Edit Candidate' :
                 sidebarContent === 'newCandidate' ? 'New Candidate' : ''}
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-800 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {renderContent()}
            </div>
          </div>
        </div>
      </>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => {
    if (!deleteConfirm) return null;

    const { type, item } = deleteConfirm;
    const isArchived = item.status === 'archived';

    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/20 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isArchived ? 'Permanently Delete Candidate' : 'Archive Candidate'}
              </h3>
              <p className="text-sm text-gray-400">
                {isArchived ? 'This action cannot be undone' : 'This can be reversed later'}
              </p>
            </div>
          </div>

          <div className="mb-6">
            {isArchived ? (
              <p className="text-gray-300">
                Are you sure you want to <strong className="text-red-400">permanently delete</strong>{' '}
                <strong>{item.firstName} {item.lastName}</strong>? All associated data will be removed.
              </p>
            ) : (
              <p className="text-gray-300">
                Are you sure you want to archive <strong>{item.firstName} {item.lastName}</strong>?
                The candidate will be moved to archived but can be restored later.
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isArchived) {
                  handleDeleteCandidate(item.id);
                } else {
                  handleArchiveCandidate(item.id);
                }
              }}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              {isArchived ? 'Permanently Delete' : 'Archive Candidate'}
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          <span className="text-white text-lg">Loading candidates...</span>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <Toolbar />
        <div className="relative">
          {view === 'table' ? <TableView /> : <KanbanView />}
        </div>
        <Sidebar />
        <DeleteConfirmModal />

        {/* Stats Footer */}
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div>
                <span className="text-gray-400 text-sm">Total Candidates</span>
                <p className="text-white font-semibold">{stats.total}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Active</span>
                <p className="text-white font-semibold">{stats.active}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">This Week</span>
                <p className="text-white font-semibold">{stats.thisWeek}</p>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Archived</span>
                <p className="text-white font-semibold">{stats.archived}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify({
                    candidates,
                    jobs,
                    submissions,
                    exportDate: new Date().toISOString(),
                    version: '2.0'
                  }, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `aberdeen_data_${new Date().toISOString().split('T')[0]}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title="Export All Data"
              >
                <Download className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default CandidatesModule;
