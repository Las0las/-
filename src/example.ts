/**
 * Aberdeen Master Shell - Example Usage
 * 
 * This file demonstrates various usage patterns of the Aberdeen AI-ATS Master Shell
 */

import AberdeenMasterShell, { AGENT_REGISTRY, SKILLS_REGISTRY, MODULE_REGISTRY } from './index';

// Example 1: Basic Resume Screening
async function exampleResumeScreening() {
  console.log('=== Example 1: Resume Screening ===\n');

  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY || 'demo-key');

  // Initialize context for candidate screening
  shell.initializeContext(
    'req-001',
    'recruiter-123',
    'CANDIDATES',
    'candidate-screener'
  );

  const resumeText = `
    Jane Smith
    Senior Software Engineer
    jane.smith@email.com | (555) 123-4567
    
    EXPERIENCE:
    - 7 years of full-stack development
    - Expert in React, Node.js, TypeScript, Python
    - Led team of 5 engineers on cloud migration project
    - AWS Certified Solutions Architect
    
    EDUCATION:
    B.S. Computer Science, MIT, 2016
  `;

  const result = await shell.executeAgent(
    `Analyze this candidate's resume and provide a qualification score:\n${resumeText}`,
    `You are an expert candidate screener for a tech recruiting firm. 
     Analyze the resume and provide:
     1. Overall qualification score (0-100)
     2. Key strengths
     3. Potential concerns
     4. Recommended next steps`,
    10
  );

  console.log('Screening Result:', result);
  console.log('\nAudit Trail:', shell.getAuditTrail().slice(-3));
}

// Example 2: Job Matching Workflow
async function exampleJobMatching() {
  console.log('\n=== Example 2: Job Matching ===\n');

  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY || 'demo-key');

  shell.initializeContext(
    'req-002',
    'recruiter-123',
    'JOBS',
    'job-matcher'
  );

  // Store candidate profile in memory
  shell.updateMemory('candidate_skills', ['React', 'Node.js', 'TypeScript', 'AWS']);
  shell.updateMemory('candidate_experience_years', 7);

  const jobDescription = `
    Senior Full-Stack Engineer
    Requirements:
    - 5+ years experience
    - Strong React and TypeScript skills
    - Backend experience with Node.js
    - Cloud platform experience (AWS/Azure/GCP)
    - Team leadership experience
  `;

  const result = await shell.executeAgent(
    `Match this candidate to the job posting and calculate match score:\n${jobDescription}`,
    `You are a job matching expert. Calculate a semantic match score between 
     the candidate and job requirements. Consider skills, experience level, 
     and qualifications. Use the match-score-calculation and skill-gap-analysis tools.`,
    10
  );

  console.log('Match Result:', result);
}

// Example 3: Email Generation
async function exampleEmailGeneration() {
  console.log('\n=== Example 3: Personalized Email Generation ===\n');

  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY || 'demo-key');

  shell.initializeContext(
    'req-003',
    'recruiter-123',
    'LEAD_MANAGEMENT',
    'email-composer'
  );

  const candidateProfile = {
    name: 'Jane Smith',
    current_role: 'Senior Software Engineer',
    skills: ['React', 'Node.js', 'TypeScript'],
    interest: 'cloud architecture',
  };

  shell.updateMemory('candidate_profile', candidateProfile);

  const result = await shell.executeAgent(
    `Generate a personalized outreach email for this candidate about our Senior Cloud Engineer position`,
    `You are an expert email composer for technical recruiting. Generate a 
     personalized, engaging outreach email. Use the email-generation and 
     message-personalization tools. The tone should be professional but warm.`,
    10
  );

  console.log('Generated Email:', result);
}

// Example 4: Pipeline Analytics
async function examplePipelineAnalytics() {
  console.log('\n=== Example 4: Pipeline Analytics ===\n');

  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY || 'demo-key');

  shell.initializeContext(
    'req-004',
    'manager-456',
    'ANALYTICS',
    'placement-analytics'
  );

  const pipelineData = {
    total_candidates: 150,
    screening: 45,
    interview: 12,
    offer: 3,
    hired: 1,
    avg_time_to_hire_days: 21,
  };

  shell.updateMemory('pipeline_data', pipelineData);

  const result = await shell.executeAgent(
    `Analyze our recruitment pipeline and provide insights on bottlenecks and optimization opportunities`,
    `You are a pipeline analytics expert. Analyze the recruitment funnel, 
     identify bottlenecks, and suggest improvements. Use placement-success-prediction 
     and revenue-forecasting tools when available.`,
    10
  );

  console.log('Analytics Result:', result);
}

// Example 5: Compliance Check
async function exampleComplianceCheck() {
  console.log('\n=== Example 5: Compliance Verification ===\n');

  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY || 'demo-key');

  shell.initializeContext(
    'req-005',
    'compliance-officer-789',
    'CANDIDATES',
    'compliance-checker'
  );

  const candidateData = {
    name: 'John Doe',
    location: 'California, USA',
    work_authorization: 'H1B',
    background_check: 'pending',
  };

  const result = await shell.executeAgent(
    `Verify compliance requirements for this candidate:\n${JSON.stringify(candidateData, null, 2)}`,
    `You are a compliance expert specializing in US hiring regulations. 
     Check OFCCP, I-9, and visa sponsorship requirements. Use the 
     compliance-verification tool to assess the candidate's status.`,
    10
  );

  console.log('Compliance Result:', result);
}

// Example 6: System Status Check
function exampleSystemStatus() {
  console.log('\n=== Example 6: System Status ===\n');

  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY || 'demo-key');

  const status = shell.getSystemStatus();
  console.log('System Status:', status);

  console.log('\nAvailable Agents:');
  Object.entries(AGENT_REGISTRY).forEach(([key, agent]) => {
    console.log(`  - ${agent.id}: ${agent.description}`);
  });

  console.log('\nAvailable Modules:');
  Object.entries(MODULE_REGISTRY).forEach(([key, module]) => {
    console.log(`  - ${module.id} v${module.version}: ${module.agents.length} agents, ${module.skills.length} skills`);
  });
}

// Example 7: Multi-Step Workflow
async function exampleMultiStepWorkflow() {
  console.log('\n=== Example 7: Multi-Step Candidate Processing ===\n');

  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY || 'demo-key');

  // Step 1: Parse Resume
  console.log('Step 1: Parsing resume...');
  shell.initializeContext('req-101', 'recruiter-123', 'CANDIDATES', 'resume-parser');
  
  const resumeResult = await shell.executeAgent(
    'Parse resume and extract structured data',
    'You are a resume parser. Extract contact info, skills, and experience.',
    5
  );
  
  shell.updateMemory('parsed_resume', resumeResult);

  // Step 2: Extract Skills
  console.log('Step 2: Extracting skills...');
  shell.initializeContext('req-102', 'recruiter-123', 'CANDIDATES', 'skill-extractor');
  
  const skillsResult = await shell.executeAgent(
    'Extract and normalize skills from the parsed resume',
    'You are a skill extraction expert. Identify and normalize all technical and soft skills.',
    5
  );
  
  shell.updateMemory('extracted_skills', skillsResult);

  // Step 3: Calculate Quality Score
  console.log('Step 3: Calculating quality score...');
  shell.initializeContext('req-103', 'recruiter-123', 'CANDIDATES', 'candidate-screener');
  
  const qualityResult = await shell.executeAgent(
    'Calculate overall candidate quality score',
    'You are a candidate quality scorer. Rate the candidate on a 0-100 scale.',
    5
  );

  console.log('\nWorkflow Complete!');
  console.log('Final Quality Score:', qualityResult);
  
  // Show audit trail for the workflow
  console.log('\nWorkflow Audit Trail:');
  shell.getAuditTrail().forEach(entry => {
    console.log(`  ${entry.timestamp.toISOString()} - ${entry.action}`);
  });
}

// Main execution
async function main() {
  console.log('Aberdeen AI-ATS Master Shell - Examples\n');
  console.log('========================================\n');

  try {
    // Run examples
    await exampleResumeScreening();
    await exampleJobMatching();
    await exampleEmailGeneration();
    await examplePipelineAnalytics();
    await exampleComplianceCheck();
    exampleSystemStatus();
    await exampleMultiStepWorkflow();

    console.log('\n========================================');
    console.log('All examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export {
  exampleResumeScreening,
  exampleJobMatching,
  exampleEmailGeneration,
  examplePipelineAnalytics,
  exampleComplianceCheck,
  exampleSystemStatus,
  exampleMultiStepWorkflow,
};
