# Aberdeen Master Shell - Quick Start Guide

Get started with the Aberdeen AI-ATS Master Shell in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- An Anthropic API key (get one at https://console.anthropic.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## Configuration

Set your Anthropic API key as an environment variable:

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

Or create a `.env` file:
```
ANTHROPIC_API_KEY=your-api-key-here
```

## Your First Agent Execution

Create a file `demo.js`:

```javascript
const AberdeenMasterShell = require('./dist/index').default;

async function main() {
  // 1. Initialize the shell
  const shell = new AberdeenMasterShell(process.env.ANTHROPIC_API_KEY);

  // 2. Set up execution context
  shell.initializeContext(
    'demo-request-001',      // Unique request ID
    'demo-user',             // User ID
    'CANDIDATES',            // Module (Candidates module)
    'candidate-screener'     // Agent (Candidate Screener agent)
  );

  // 3. Execute the agent
  const result = await shell.executeAgent(
    "Analyze this resume: John Doe, 5 years Python experience, AWS certified",
    "You are a candidate screener. Analyze resumes and score candidates.",
    5  // Max steps
  );

  // 4. View results
  console.log('Result:', result);
  console.log('\nSystem Status:', shell.getSystemStatus());
}

main().catch(console.error);
```

Run it:
```bash
node demo.js
```

## Available Modules

Quick reference of the 19 modules you can use:

| Module ID | Purpose | Key Agents |
|-----------|---------|------------|
| CANDIDATES | Candidate management | candidate-screener, resume-parser, skill-extractor |
| JOBS | Job matching | job-matcher |
| INTERVIEWS | Interview management | interview-prep-agent, sentiment-analyzer |
| OFFERS | Offer generation | revenue-forecaster, email-composer |
| PIPELINE | Pipeline optimization | pipeline-optimizer, sentiment-analyzer |
| ANALYTICS | Analytics & reporting | placement-analytics, predictive-analytics |
| SEARCH | Candidate sourcing | boolean-search-builder, xray-search-agent |
| AUTOMATION | Workflow automation | automation-suggester |
| ... | (15 more modules) | ... |

## Available Skills

Your agents can use 25+ skills including:

- **Data Processing**: resume-parsing, skill-extraction, data-normalization
- **Matching**: match-score-calculation, skill-gap-analysis, quality-scoring
- **Communication**: email-generation, message-personalization
- **Compliance**: compliance-verification, background-check-validation
- **Analytics**: placement-success-prediction, revenue-forecasting
- **Integrations**: ats-sync, linkedin-search, github-search
- **Automation**: workflow-automation, status-management

## Common Patterns

### Pattern 1: Resume Processing Pipeline

```javascript
// Step 1: Parse resume
shell.initializeContext('req-1', 'user-1', 'CANDIDATES', 'resume-parser');
const parsed = await shell.executeAgent(
  "Parse this resume: ...",
  "Extract structured data from resume",
  5
);

// Step 2: Extract skills
shell.initializeContext('req-2', 'user-1', 'CANDIDATES', 'skill-extractor');
const skills = await shell.executeAgent(
  "Extract skills from parsed resume",
  "Identify and normalize technical skills",
  5
);

// Step 3: Calculate match score
shell.initializeContext('req-3', 'user-1', 'JOBS', 'job-matcher');
const match = await shell.executeAgent(
  "Match candidate to job: Senior Developer",
  "Calculate semantic match score",
  5
);
```

### Pattern 2: Using Memory

```javascript
// Store data in memory (persists across requests)
shell.updateMemory('candidate_id', 'CAND-12345');
shell.updateMemory('screening_score', 87);

// Retrieve from memory
const candidateId = shell.getMemory('candidate_id');
console.log(`Processing candidate: ${candidateId}`);
```

### Pattern 3: Audit Trail

```javascript
// Execute some operations
await shell.executeAgent(...);
await shell.executeAgent(...);

// Get complete audit trail
const audit = shell.getAuditTrail();
audit.forEach(entry => {
  console.log(`${entry.timestamp}: ${entry.action}`, entry.details);
});
```

## Running Examples

We've included 7 comprehensive examples:

```bash
# Build first
npm run build

# Run all examples (requires API key)
node dist/example.js
```

Examples included:
1. Resume Screening
2. Job Matching
3. Email Generation
4. Pipeline Analytics
5. Compliance Check
6. System Status
7. Multi-Step Workflow

## Production Considerations

When deploying to production:

1. **API Key Security**: Never commit API keys. Use environment variables or secret management.

2. **Error Handling**: Wrap agent executions in try-catch blocks:
   ```javascript
   try {
     const result = await shell.executeAgent(...);
   } catch (error) {
     console.error('Agent execution failed:', error);
   }
   ```

3. **Rate Limiting**: Implement rate limiting for API calls to Anthropic.

4. **Monitoring**: Use the audit trail for monitoring and debugging:
   ```javascript
   const status = shell.getSystemStatus();
   console.log(`Active: ${status.modulesActive} modules, ${status.agentsAvailable} agents`);
   ```

5. **Tool Implementation**: Replace `simulateToolExecution` with real implementations for production use.

## Next Steps

- Read the full [README-MASTER-SHELL.md](./README-MASTER-SHELL.md) for detailed documentation
- Explore the [src/example.ts](./src/example.ts) for more usage patterns
- Check the [src/index.ts](./src/index.ts) source code for implementation details

## Troubleshooting

**Issue**: "Cannot find module '@anthropic-ai/sdk'"
- **Solution**: Run `npm install` to install dependencies

**Issue**: "API key not found"
- **Solution**: Set the `ANTHROPIC_API_KEY` environment variable

**Issue**: TypeScript errors
- **Solution**: Run `npm run build` to compile the TypeScript code

**Issue**: Max steps exceeded
- **Solution**: Increase the `maxSteps` parameter in `executeAgent()`

## Support

For more help:
- Review the comprehensive documentation in README-MASTER-SHELL.md
- Check example implementations in src/example.ts
- Review source code comments in src/index.ts

---

**Version**: 4.1.0  
**Last Updated**: November 2025  
**License**: MIT
