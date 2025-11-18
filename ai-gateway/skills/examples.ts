/**
 * Example Skills for AI Gateway
 * Aberdeen AI-ATS
 *
 * Pre-built skills demonstrating integration with:
 * - Resume X-Ray Vision
 * - Market Intelligence
 * - Diversity & Inclusion
 * - Search capabilities
 * - Multi-AI routing
 */

import {
  Skill,
  SkillType,
  SkillHandler,
  Tool,
  ToolType,
  ToolHandler,
  Agent,
  AgentType,
  AgentHandler,
} from '../types/gateway.types';

// ============================================================================
// RESUME X-RAY SKILL
// ============================================================================

const resumeXRayHandler: SkillHandler = async (inputs, context) => {
  const startTime = Date.now();

  context.logger.info('Executing Resume X-Ray Vision', {
    resumeLength: inputs.resumeText?.length,
  });

  // Call Aberdeen Resume X-Ray Python service
  try {
    const response = await fetch('http://localhost:8001/api/resume-xray/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume_text: inputs.resumeText,
        include_hidden_skills: true,
        include_trajectory: true,
        include_authenticity: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Resume X-Ray service error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: {
        candidateName: data.candidate_name,
        qualityScore: data.overall_quality_score,
        hiddenSkills: data.hidden_skills,
        careerTrajectory: data.career_trajectory,
        stabilityScore: data.stability_score,
        authenticityCheck: data.authenticity_check,
        culturalMarkers: data.cultural_markers,
        redFlags: data.red_flags,
        competitiveIntel: data.competitive_intel,
        experienceLevel: data.experience_level,
        technicalDepth: data.technical_depth_score,
        leadershipScore: data.leadership_score,
      },
      executionTime: Date.now() - startTime,
      confidence: data.confidence_score / 100,
      qualityScore: data.overall_quality_score,
      traceId: context.requestId,
      timestamp: new Date(),
    };

  } catch (error: any) {
    context.logger.error('Resume X-Ray failed', error);

    return {
      success: false,
      error: {
        code: 'XRAY_ERROR',
        message: error.message,
        retryable: true,
        suggestions: [
          'Check if Resume X-Ray service is running on port 8001',
          'Verify resume text is not empty',
          'Ensure API key is configured',
        ],
      },
      executionTime: Date.now() - startTime,
      traceId: context.requestId,
      timestamp: new Date(),
    };
  }
};

export const resumeXRaySkill: Skill = {
  id: 'resume-xray-vision',
  name: 'Resume X-Ray Vision',
  type: SkillType.RESUME_XRAY,
  description: 'Advanced resume analysis with hidden skills detection, career trajectory, and authenticity verification',
  version: '1.0.0',
  handler: resumeXRayHandler,
  requiredInputs: [
    {
      name: 'resumeText',
      type: 'string',
      description: 'Full resume text content',
      required: true,
      examples: ['John Doe\nSenior Software Engineer...'],
    },
  ],
  outputs: [
    {
      name: 'analysis',
      type: 'object',
      description: 'Complete resume analysis with all insights',
    },
  ],
  preferredProvider: 'anthropic_claude',
  fallbackProviders: ['openai_gpt'],
  averageExecutionTime: 3000,
  maxExecutionTime: 10000,
  cacheResults: true,
  cacheTTL: 3600,
  author: 'Aberdeen AI Team',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  tags: ['resume', 'analysis', 'screening', 'xray'],
};

// ============================================================================
// MARKET INTELLIGENCE SKILL
// ============================================================================

const marketIntelligenceHandler: SkillHandler = async (inputs, context) => {
  const startTime = Date.now();

  context.logger.info('Executing Market Intelligence', {
    role: inputs.role,
    location: inputs.location,
  });

  try {
    const response = await fetch('http://localhost:8001/api/market-intelligence/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: inputs.role,
        location: inputs.location,
      }),
    });

    if (!response.ok) {
      throw new Error(`Market Intelligence service error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: {
        supplyDemandRatio: data.supply_demand_ratio,
        salaryTrends: data.salary_trends,
        emergingSkills: data.skill_emergence,
        competitorActivity: data.competitor_activity,
        sourcingChannels: data.optimal_sourcing_channels,
        negotiationLeverage: data.negotiation_leverage,
        marketTightness: data.market_tightness,
        recommendations: data.recommendations,
      },
      executionTime: Date.now() - startTime,
      confidence: data.confidence_score / 100,
      traceId: context.requestId,
      timestamp: new Date(),
    };

  } catch (error: any) {
    context.logger.error('Market Intelligence failed', error);

    return {
      success: false,
      error: {
        code: 'MARKET_INTEL_ERROR',
        message: error.message,
        retryable: true,
      },
      executionTime: Date.now() - startTime,
      traceId: context.requestId,
      timestamp: new Date(),
    };
  }
};

export const marketIntelligenceSkill: Skill = {
  id: 'market-intelligence',
  name: 'Market Intelligence',
  type: SkillType.MARKET_INTELLIGENCE,
  description: 'Real-time market analysis with salary trends, emerging skills, and sourcing insights',
  version: '1.0.0',
  handler: marketIntelligenceHandler,
  requiredInputs: [
    {
      name: 'role',
      type: 'string',
      description: 'Job title or role',
      required: true,
      examples: ['Senior Software Engineer', 'Product Manager'],
    },
    {
      name: 'location',
      type: 'string',
      description: 'Geographic location',
      required: true,
      examples: ['San Francisco, CA', 'New York, NY', 'Remote'],
    },
  ],
  outputs: [
    {
      name: 'insights',
      type: 'object',
      description: 'Comprehensive market intelligence data',
    },
  ],
  preferredProvider: 'anthropic_claude',
  averageExecutionTime: 2000,
  maxExecutionTime: 8000,
  cacheResults: true,
  cacheTTL: 1800, // 30 minutes
  author: 'Aberdeen AI Team',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  tags: ['market', 'intelligence', 'salary', 'trends'],
};

// ============================================================================
// DIVERSITY & INCLUSION SKILL
// ============================================================================

const deibHandler: SkillHandler = async (inputs, context) => {
  const startTime = Date.now();

  context.logger.info('Executing DEIB Analysis', {
    type: inputs.analysisType,
  });

  try {
    const endpoint = inputs.analysisType === 'job_posting'
      ? '/api/deib/analyze-posting'
      : '/api/deib/blind-resume';

    const response = await fetch(`http://localhost:8001${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      throw new Error(`DEIB service error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      success: true,
      data,
      executionTime: Date.now() - startTime,
      confidence: 0.95,
      traceId: context.requestId,
      timestamp: new Date(),
    };

  } catch (error: any) {
    context.logger.error('DEIB analysis failed', error);

    return {
      success: false,
      error: {
        code: 'DEIB_ERROR',
        message: error.message,
        retryable: true,
      },
      executionTime: Date.now() - startTime,
      traceId: context.requestId,
      timestamp: new Date(),
    };
  }
};

export const deibSkill: Skill = {
  id: 'diversity-inclusion',
  name: 'Diversity & Inclusion Optimizer',
  type: SkillType.DIVERSITY_INCLUSION,
  description: 'Bias detection, blind resume creation, and DEIB metrics tracking',
  version: '1.0.0',
  handler: deibHandler,
  requiredInputs: [
    {
      name: 'analysisType',
      type: 'string',
      description: 'Type of analysis: job_posting or blind_resume',
      required: true,
      examples: ['job_posting', 'blind_resume'],
    },
    {
      name: 'text',
      type: 'string',
      description: 'Text to analyze',
      required: true,
    },
  ],
  outputs: [
    {
      name: 'analysis',
      type: 'object',
      description: 'DEIB analysis results',
    },
  ],
  preferredProvider: 'anthropic_claude',
  averageExecutionTime: 1500,
  maxExecutionTime: 5000,
  cacheResults: true,
  cacheTTL: 600,
  author: 'Aberdeen AI Team',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  tags: ['diversity', 'inclusion', 'bias', 'deib'],
};

// ============================================================================
// SEMANTIC SEARCH SKILL
// ============================================================================

const semanticSearchHandler: SkillHandler = async (inputs, context) => {
  const startTime = Date.now();

  context.logger.info('Executing Semantic Search', {
    query: inputs.query,
    entities: inputs.entities,
  });

  try {
    // Generate query embedding using AI provider
    const embeddingPrompt = `Generate a semantic embedding for this search query: "${inputs.query}"`;

    // Use Claude to understand query intent
    // Then use OpenAI for actual embedding
    // This is simplified - real implementation would use proper embedding models

    // Simulated semantic search
    const results = await context.database.query(`
      SELECT * FROM search_vectors
      WHERE entity_type = ANY($1)
      ORDER BY vector <=> $2
      LIMIT $3
    `, [inputs.entities, [] /* embedding vector */, inputs.topK || 10]);

    return {
      success: true,
      data: {
        results: results.map((r: any) => ({
          id: r.id,
          entity: r.entity_type,
          score: r.similarity_score,
          title: r.title,
          description: r.description,
          metadata: r.metadata,
        })),
        totalCount: results.length,
      },
      executionTime: Date.now() - startTime,
      confidence: 0.88,
      traceId: context.requestId,
      timestamp: new Date(),
    };

  } catch (error: any) {
    context.logger.error('Semantic search failed', error);

    return {
      success: false,
      error: {
        code: 'SEMANTIC_SEARCH_ERROR',
        message: error.message,
        retryable: true,
      },
      executionTime: Date.now() - startTime,
      traceId: context.requestId,
      timestamp: new Date(),
    };
  }
};

export const semanticSearchSkill: Skill = {
  id: 'semantic-search-skill',
  name: 'Semantic Search',
  type: SkillType.CUSTOM,
  description: 'AI-powered semantic search using embeddings',
  version: '1.0.0',
  handler: semanticSearchHandler,
  requiredInputs: [
    {
      name: 'query',
      type: 'string',
      description: 'Search query',
      required: true,
    },
    {
      name: 'entities',
      type: 'array',
      description: 'Entity types to search',
      required: true,
    },
    {
      name: 'topK',
      type: 'number',
      description: 'Number of results to return',
      required: false,
    },
  ],
  outputs: [
    {
      name: 'results',
      type: 'array',
      description: 'Semantically ranked search results',
    },
  ],
  preferredProvider: 'openai_gpt',
  fallbackProviders: ['anthropic_claude'],
  averageExecutionTime: 800,
  maxExecutionTime: 3000,
  cacheResults: true,
  cacheTTL: 300,
  author: 'Aberdeen AI Team',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  tags: ['search', 'semantic', 'embedding', 'ai'],
};

// ============================================================================
// CANDIDATE MATCHING AGENT
// ============================================================================

const candidateMatchingHandler: AgentHandler = async (task, context) => {
  const startTime = Date.now();

  context.logger.info('Starting Candidate Matching Agent', {
    jobId: task.input.jobId,
  });

  try {
    // Step 1: Get job requirements
    const job = await context.database.queryOne(
      'SELECT * FROM jobs WHERE id = $1',
      [task.input.jobId]
    );

    if (!job) {
      throw new Error('Job not found');
    }

    context.reportProgress(20, 'Job requirements loaded');

    // Step 2: Search for candidates using semantic search
    const searchResult = await context.skills.execute(
      'semantic-search-skill',
      {
        query: job.title + ' ' + job.skills.join(' '),
        entities: ['candidates'],
        topK: 50,
      }
    );

    context.reportProgress(50, 'Candidate search completed');

    // Step 3: Analyze each candidate with Resume X-Ray
    const candidateAnalyses = [];

    for (const candidate of searchResult.data.results) {
      const xrayResult = await context.skills.execute(
        'resume-xray-vision',
        {
          resumeText: candidate.resume_text,
        }
      );

      candidateAnalyses.push({
        candidate,
        analysis: xrayResult.data,
        matchScore: calculateMatchScore(job, xrayResult.data),
      });
    }

    context.reportProgress(80, 'Resume analysis completed');

    // Step 4: Rank and return top matches
    const topMatches = candidateAnalyses
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, task.input.topN || 10);

    context.reportProgress(100, 'Matching completed');

    return {
      success: true,
      data: {
        jobId: task.input.jobId,
        totalCandidatesAnalyzed: candidateAnalyses.length,
        topMatches: topMatches.map(m => ({
          candidateId: m.candidate.id,
          candidateName: m.analysis.candidateName,
          matchScore: m.matchScore,
          qualityScore: m.analysis.qualityScore,
          hiddenSkills: m.analysis.hiddenSkills.slice(0, 5),
          experienceLevel: m.analysis.experienceLevel,
          recommendation: getRecommendation(m.matchScore),
        })),
      },
      executionTime: Date.now() - startTime,
      skillsUsed: ['semantic-search-skill', 'resume-xray-vision'],
      toolsUsed: [],
      confidence: 0.92,
      qualityScore: 95,
      timestamp: new Date(),
    };

  } catch (error: any) {
    context.logger.error('Candidate matching failed', error);

    return {
      success: false,
      error: {
        code: 'MATCHING_ERROR',
        message: error.message,
        retryable: true,
      },
      executionTime: Date.now() - startTime,
      skillsUsed: [],
      toolsUsed: [],
      timestamp: new Date(),
    };
  }
};

export const candidateMatchingAgent: Agent = {
  id: 'candidate-matching-agent',
  name: 'Candidate Matching Agent',
  type: AgentType.MATCHING,
  description: 'Intelligent candidate matching using semantic search and resume analysis',
  version: '1.0.0',
  config: {
    aiProvider: 'anthropic_claude',
    aiModel: 'claude-sonnet-4-20250514',
    autonomousMode: true,
    requiresApproval: false,
    maxIterations: 50,
    notifyOnCompletion: true,
  },
  skills: ['semantic-search-skill', 'resume-xray-vision', 'market-intelligence'],
  tools: ['database-query-tool', 'email-notification-tool'],
  handler: candidateMatchingHandler,
  status: 'idle',
  totalTasksCompleted: 0,
  successRate: 100,
  averageExecutionTime: 15000,
  author: 'Aberdeen AI Team',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  tags: ['matching', 'candidates', 'ai', 'automated'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateMatchScore(job: any, analysis: any): number {
  let score = 0;

  // Quality score weight (40%)
  score += (analysis.qualityScore / 100) * 40;

  // Skills match weight (30%)
  const jobSkills = job.required_skills || [];
  const candidateSkills = analysis.hiddenSkills.map((s: any) => s.skill.toLowerCase());

  const matchedSkills = jobSkills.filter((skill: string) =>
    candidateSkills.some(cs => cs.includes(skill.toLowerCase()))
  );

  score += (matchedSkills.length / jobSkills.length) * 30;

  // Experience level match (20%)
  if (analysis.experienceLevel === job.experience_level) {
    score += 20;
  } else if (
    (job.experience_level === 'senior' && analysis.experienceLevel === 'executive') ||
    (job.experience_level === 'mid-level' && analysis.experienceLevel === 'senior')
  ) {
    score += 15;
  }

  // Stability bonus (10%)
  score += (analysis.stabilityScore / 100) * 10;

  return Math.min(score, 100);
}

function getRecommendation(matchScore: number): string {
  if (matchScore >= 90) return 'STRONG_FIT';
  if (matchScore >= 75) return 'GOOD_FIT';
  if (matchScore >= 60) return 'POTENTIAL_FIT';
  return 'WEAK_FIT';
}

// ============================================================================
// EXPORT ALL SKILLS AND AGENTS
// ============================================================================

export const exampleSkills = [
  resumeXRaySkill,
  marketIntelligenceSkill,
  deibSkill,
  semanticSearchSkill,
];

export const exampleAgents = [
  candidateMatchingAgent,
];

export default {
  skills: exampleSkills,
  agents: exampleAgents,
};
