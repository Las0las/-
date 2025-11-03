import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Linkedin,
  DollarSign,
  Star,
  UserCheck,
  CalendarDays,
  Shield,
} from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import type { Candidate, Job, Submission, SidebarContent, CandidateFormData } from '../../types';
import {
  validateCandidateForm,
  sanitizeInput,
  parseSkills,
  formatSkills,
  hasValidationErrors,
} from '../../utils/validation';
import { formatSalaryRange } from '../../utils/formatting';

interface CandidateSidebarProps {
  open: boolean;
  onClose: () => void;
  content: SidebarContent;
  candidate: Candidate | null;
  jobs: Job[];
  submissions: Submission[];
  onCreate: (candidate: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, updates: Partial<Candidate>) => void;
  onSubmit: (candidateId: string, jobId: string, notes: string) => void;
}

/**
 * Sidebar for viewing and editing candidate details
 */
export const CandidateSidebar: React.FC<CandidateSidebarProps> = ({
  open,
  onClose,
  content,
  candidate,
  jobs,
  submissions,
  onCreate,
  onUpdate,
  onSubmit,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<Partial<CandidateFormData>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitJobId, setSubmitJobId] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');

  useClickOutside(sidebarRef, onClose, open);

  // Initialize form data when sidebar content changes
  useEffect(() => {
    if (content === 'editCandidate' && candidate) {
      setFormData({
        ...candidate,
        skills: formatSkills(candidate.skills),
      });
    } else if (content === 'newCandidate') {
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
        availabilityToStart: '',
      });
    }
    setFormErrors({});
  }, [content, candidate]);

  const handleSaveCandidate = () => {
    const errors = validateCandidateForm(formData);

    if (hasValidationErrors(errors)) {
      setFormErrors(errors);
      return;
    }

    const skillsArray = parseSkills(formData.skills || '');

    const sanitizedData = {
      firstName: sanitizeInput(formData.firstName || ''),
      lastName: sanitizeInput(formData.lastName || ''),
      email: sanitizeInput(formData.email || ''),
      phone: formData.phone || '',
      title: sanitizeInput(formData.title || ''),
      location: formData.location || '',
      experience: formData.experience || 0,
      skills: skillsArray,
      source: formData.source || 'website',
      status: formData.status || 'new',
      rating: formData.rating || 3,
      notes: sanitizeInput(formData.notes || ''),
      linkedin: formData.linkedin,
      salary: formData.salary,
      employmentType: formData.employmentType,
      candidateSummary: sanitizeInput(formData.candidateSummary || ''),
      availabilityToInterview: formData.availabilityToInterview,
      availabilityToStart: formData.availabilityToStart,
      submittedJobs: formData.submittedJobs || [],
      interviews: formData.interviews || [],
    } as Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>;

    if (content === 'newCandidate') {
      onCreate(sanitizedData);
    } else if (content === 'editCandidate' && candidate) {
      onUpdate(candidate.id, sanitizedData);
    }

    onClose();
  };

  const handleSubmitJob = () => {
    if (!candidate || !submitJobId) {
      setFormErrors({ submit: 'Please select a job' });
      return;
    }

    onSubmit(candidate.id, submitJobId, sanitizeInput(submitNotes));
    setSubmitJobId('');
    setSubmitNotes('');
    onClose();
  };

  const renderContent = () => {
    switch (content) {
      case 'profile':
        return candidate ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {candidate.firstName[0]}
                {candidate.lastName[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">
                  {candidate.firstName} {candidate.lastName}
                </h2>
                <p className="text-gray-400">{candidate.title}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < candidate.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {candidate.candidateSummary && (
              <div className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-white font-medium mb-2">Summary</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {candidate.candidateSummary}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-5 h-5 text-gray-500" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <span>{candidate.experience} years experience</span>
              </div>
              {candidate.linkedin && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <Linkedin className="w-5 h-5 text-gray-500" />
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
              {candidate.salary && (
                <div className="flex items-center space-x-3 text-gray-300">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <span>
                    {formatSalaryRange(
                      candidate.salary.min,
                      candidate.salary.max,
                      candidate.salary.currency
                    )}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-medium mb-2">Employment Type</h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm uppercase">
                  {candidate.employmentType || 'Flexible'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Status</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    candidate.status === 'new'
                      ? 'bg-blue-500/20 text-blue-400'
                      : candidate.status === 'screening'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : candidate.status === 'interviewing'
                      ? 'bg-purple-500/20 text-purple-400'
                      : candidate.status === 'offer'
                      ? 'bg-green-500/20 text-green-400'
                      : candidate.status === 'hired'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {candidate.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {candidate.availabilityToInterview && (
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <UserCheck className="w-4 h-4 mr-1" /> Interview Availability
                  </h3>
                  <p className="text-gray-400 text-sm">{candidate.availabilityToInterview}</p>
                </div>
              )}
              {candidate.availabilityToStart && (
                <div>
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <CalendarDays className="w-4 h-4 mr-1" /> Start Availability
                  </h3>
                  <p className="text-gray-400 text-sm">{candidate.availabilityToStart}</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-white font-medium mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {candidate.notes && (
              <div>
                <h3 className="text-white font-medium mb-2">Notes</h3>
                <p className="text-gray-400 text-sm">{candidate.notes}</p>
              </div>
            )}

            {candidate.submittedJobs && candidate.submittedJobs.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-2">Submitted to Jobs</h3>
                <div className="space-y-2">
                  {candidate.submittedJobs.map((jobId) => {
                    const job = jobs.find((j) => j.id === jobId);
                    const submission = submissions.find(
                      (s) => s.candidateId === candidate.id && s.jobId === jobId
                    );
                    return job ? (
                      <div key={jobId} className="bg-gray-800 rounded p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{job.title}</div>
                            <div className="text-gray-400 text-sm">{job.client}</div>
                          </div>
                          {submission && (
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                submission.status === 'pending'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : submission.status === 'accepted'
                                  ? 'bg-green-500/20 text-green-400'
                                  : submission.status === 'interview'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : submission.status === 'offer'
                                  ? 'bg-blue-500/20 text-blue-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
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
          </div>
        ) : null;

      case 'submit':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Submit Candidate to Job</h2>
            {candidate && (
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {candidate.firstName[0]}
                    {candidate.lastName[0]}
                  </div>
                  <div>
                    <div className="text-white font-medium">
                      {candidate.firstName} {candidate.lastName}
                    </div>
                    <div className="text-gray-400 text-sm">{candidate.title}</div>
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
                {jobs
                  .filter((j) => j.status === 'open')
                  .map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title} - {job.client} ({job.type})
                    </option>
                  ))}
              </select>
              {formErrors.submit && (
                <p className="text-red-400 text-sm mt-1" role="alert">
                  {formErrors.submit}
                </p>
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
              {content === 'newCandidate' ? 'Add New Candidate' : 'Edit Candidate'}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.firstName ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  placeholder="John"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  aria-invalid={!!formErrors.firstName}
                  aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                />
                {formErrors.firstName && (
                  <p className="text-red-400 text-sm mt-1" id="firstName-error" role="alert">
                    {formErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-gray-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                    formErrors.lastName ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                  }`}
                  placeholder="Doe"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  aria-invalid={!!formErrors.lastName}
                  aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                />
                {formErrors.lastName && (
                  <p className="text-red-400 text-sm mt-1" id="lastName-error" role="alert">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.email ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                }`}
                placeholder="john.doe@example.com"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-invalid={!!formErrors.email}
                aria-describedby={formErrors.email ? 'email-error' : undefined}
              />
              {formErrors.email && (
                <p className="text-red-400 text-sm mt-1" id="email-error" role="alert">
                  {formErrors.email}
                </p>
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
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                aria-invalid={!!formErrors.phone}
                aria-describedby={formErrors.phone ? 'phone-error' : undefined}
              />
              {formErrors.phone && (
                <p className="text-red-400 text-sm mt-1" id="phone-error" role="alert">
                  {formErrors.phone}
                </p>
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
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                aria-invalid={!!formErrors.linkedin}
                aria-describedby={formErrors.linkedin ? 'linkedin-error' : undefined}
              />
              {formErrors.linkedin && (
                <p className="text-red-400 text-sm mt-1" id="linkedin-error" role="alert">
                  {formErrors.linkedin}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Current Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                className={`w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.title ? 'ring-2 ring-red-500' : 'focus:ring-purple-500'
                }`}
                placeholder="Senior Software Engineer"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                aria-invalid={!!formErrors.title}
                aria-describedby={formErrors.title ? 'title-error' : undefined}
              />
              {formErrors.title && (
                <p className="text-red-400 text-sm mt-1" id="title-error" role="alert">
                  {formErrors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Candidate Summary</label>
              <textarea
                className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Brief summary of the candidate's background and strengths..."
                value={formData.candidateSummary || ''}
                onChange={(e) => setFormData({ ...formData, candidateSummary: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Location</label>
              <input
                type="text"
                className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="New York, NY"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Experience (years)</label>
              <input
                type="number"
                className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="5"
                min="0"
                max="70"
                value={formData.experience || 0}
                onChange={(e) =>
                  setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })
                }
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Skills (comma separated)</label>
              <input
                type="text"
                className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="React, TypeScript, Node.js"
                value={
                  typeof formData.skills === 'string'
                    ? formData.skills
                    : Array.isArray(formData.skills)
                    ? formData.skills.join(', ')
                    : ''
                }
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Employment Type</label>
                <select
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.employmentType || 'flexible'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      employmentType: e.target.value as 'w2' | '1099' | 'c2c' | 'flexible',
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      source: e.target.value as Candidate['source'],
                    })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, availabilityToInterview: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Start Availability</label>
                <input
                  type="text"
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="2 weeks notice, 30 days, etc."
                  value={formData.availabilityToStart || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, availabilityToStart: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Status</label>
                <select
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={formData.status || 'new'}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as Candidate['status'] })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, rating: parseInt(e.target.value) })
                  }
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
              <label className="block text-gray-300 mb-2">Salary Range (USD)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Min salary"
                  min="0"
                  value={formData.salary?.min || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: {
                        ...(formData.salary || { currency: 'USD' }),
                        min: parseInt(e.target.value) || 0,
                        max: formData.salary?.max || 0,
                        currency: 'USD',
                      },
                    })
                  }
                />
                <input
                  type="number"
                  className="w-full bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Max salary"
                  min="0"
                  value={formData.salary?.max || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary: {
                        ...(formData.salary || { currency: 'USD' }),
                        min: formData.salary?.min || 0,
                        max: parseInt(e.target.value) || 0,
                        currency: 'USD',
                      },
                    })
                  }
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
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <button
              onClick={handleSaveCandidate}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
            >
              {content === 'newCandidate' ? 'Add Candidate' : 'Update Candidate'}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitleForContent = () => {
    switch (content) {
      case 'profile':
        return 'Candidate Profile';
      case 'submit':
        return 'Submit to Job';
      case 'editCandidate':
        return 'Edit Candidate';
      case 'newCandidate':
        return 'New Candidate';
      default:
        return '';
    }
  };

  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40" />}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed right-0 top-0 h-full w-96 bg-gray-900 border-l border-gray-800 transform transition-transform duration-300 z-50 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <h2 className="text-white font-semibold flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-400" />
              {getTitleForContent()}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-800 rounded transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
        </div>
      </div>
    </>
  );
};
