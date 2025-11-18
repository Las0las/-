# AI Gateway for Aberdeen AI-ATS

**Comprehensive AI orchestration system for skill, tool, type management, and multi-agent coordination**

## 🎯 Overview

The AI Gateway is a central orchestration hub that provides:

- **Skill Management**: Register, discover, and execute AI-powered skills
- **Tool Registry**: Manage reusable tools across the platform
- **Agent Orchestration**: Coordinate autonomous AI agents
- **Multi-AI Routing**: Intelligent routing across Claude, GPT, Perplexity, and more
- **Search Integration**: Deep integration with Master Search Bar
- **Type Safety**: Comprehensive TypeScript types for all operations

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
│  (Multi-AI Shell, Master Search, Excel Modules, etc.)       │
└───────────────────────┬─────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                     AI Gateway API                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │Orchestration │  │   Routing    │  │   Caching    │      │
│  │   Engine     │  │   Strategy   │  │   Manager    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────┬──────────────┬──────────────┬──────────────────────┘
         │              │              │
┌────────▼──────┐ ┌────▼──────┐ ┌────▼──────────┐
│   Skills      │ │   Tools    │ │    Agents     │
│   Registry    │ │   Registry │ │    Registry   │
└────┬──────────┘ └────┬───────┘ └────┬──────────┘
     │                 │              │
┌────▼─────────────────▼──────────────▼────────────────┐
│              AI Provider Layer                        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │
│  │Claude│ │ GPT  │ │Perplex│ │Gemini│ │Custom│      │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘      │
└───────────────────────────────────────────────────────┘
         │              │              │
┌────────▼──────────────▼──────────────▼────────────────┐
│            Data & Service Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐             │
│  │ Database │ │  Storage │ │  Search  │             │
│  └──────────┘ └──────────┘ └──────────┘             │
└────────────────────────────────────────────────────────┘
```

## 📦 Components

### Core (`/core`)

**AIGateway.ts** - Main orchestration engine
- Request routing and validation
- Provider selection and fallback
- Caching and performance optimization
- Metrics collection and monitoring

### Types (`/types`)

**gateway.types.ts** - Complete type system (1,300+ lines)
- AI provider configurations
- Skill, tool, and agent definitions
- Orchestration request/response types
- Registry interfaces
- Monitoring and metrics types

### Skills (`/skills`)

**examples.ts** - Pre-built skills
- Resume X-Ray Vision skill
- Market Intelligence skill
- Diversity & Inclusion skill
- Semantic Search skill
- Candidate Matching agent

### Integrations (`/integrations`)

**search/SearchAIIntegration.ts** - Master Search integration
- Semantic search
- Natural language query parsing
- X-Ray search generation
- AI-powered autocomplete
- Result enhancement and personalization

## 🚀 Quick Start

### 1. Installation

```bash
cd ai-gateway
npm install
```

### 2. Configuration

Create `config.json`:

```json
{
  "host": "localhost",
  "port": 8080,
  "environment": "development",
  "providers": [
    {
      "provider": "anthropic_claude",
      "model": "claude-sonnet-4-20250514",
      "apiKey": "your-anthropic-key",
      "maxTokens": 4096,
      "temperature": 0.7
    },
    {
      "provider": "openai_gpt",
      "model": "gpt-4-turbo-preview",
      "apiKey": "your-openai-key"
    },
    {
      "provider": "perplexity",
      "model": "llama-3.1-sonar-large-128k-online",
      "apiKey": "your-perplexity-key"
    }
  ],
  "defaultProvider": "anthropic_claude",
  "features": {
    "skills": true,
    "tools": true,
    "agents": true,
    "orchestration": true,
    "caching": true,
    "monitoring": true,
    "rateLimit": true
  }
}
```

### 3. Basic Usage

```typescript
import { AIGateway } from './core/AIGateway';
import { exampleSkills, exampleAgents } from './skills/examples';
import { SearchAIIntegration } from './integrations/search/SearchAIIntegration';

// Initialize gateway
const gateway = new AIGateway(config);

// Register skills
exampleSkills.forEach(skill => {
  gateway.getSkillRegistry().register(skill);
});

// Register agents
exampleAgents.forEach(agent => {
  gateway.getAgentRegistry().register(agent);
});

// Execute a skill
const result = await gateway.orchestrate({
  type: 'skill_execution',
  skillId: 'resume-xray-vision',
  input: {
    resumeText: 'John Smith\nSenior Software Engineer...',
  },
  config: {
    preferredProvider: 'anthropic_claude',
    cacheResults: true,
    timeout: 10000,
  },
});

console.log('Resume Analysis:', result.data);
```

## 💡 Use Cases

### 1. Resume Analysis with X-Ray Vision

```typescript
const result = await gateway.orchestrate({
  type: 'skill_execution',
  skillId: 'resume-xray-vision',
  input: {
    resumeText: resumeContent,
  },
});

console.log('Quality Score:', result.data.qualityScore);
console.log('Hidden Skills:', result.data.hiddenSkills);
console.log('Red Flags:', result.data.redFlags);
```

### 2. Market Intelligence

```typescript
const result = await gateway.orchestrate({
  type: 'skill_execution',
  skillId: 'market-intelligence',
  input: {
    role: 'Senior Software Engineer',
    location: 'San Francisco, CA',
  },
});

console.log('Salary Range:', result.data.salaryTrends);
console.log('Market Tightness:', result.data.marketTightness);
console.log('Emerging Skills:', result.data.emergingSkills);
```

### 3. Semantic Search

```typescript
const searchAI = new SearchAIIntegration(gateway);

const results = await searchAI.semanticSearch({
  query: 'experienced React developers with leadership skills',
  entities: ['candidates'],
  topK: 10,
  minSimilarity: 0.7,
});

console.log('Search Results:', results.results);
```

### 4. Natural Language Search

```typescript
const results = await searchAI.naturalLanguageSearch(
  'Find Java developers in Austin with 5+ years experience'
);

console.log('Matched Candidates:', results.results);
```

### 5. Candidate Matching Agent

```typescript
const result = await gateway.orchestrate({
  type: 'agent_task',
  agentId: 'candidate-matching-agent',
  input: {
    jobId: 'job-12345',
    topN: 10,
  },
});

console.log('Top Matches:', result.data.topMatches);
```

### 6. Multi-Skill Workflow

```typescript
const result = await gateway.orchestrate({
  type: 'workflow',
  input: {
    workflow: {
      steps: [
        {
          id: 'step1',
          type: 'skill',
          skillId: 'resume-xray-vision',
          nextStep: 'step2',
        },
        {
          id: 'step2',
          type: 'skill',
          skillId: 'market-intelligence',
          nextStep: 'step3',
        },
        {
          id: 'step3',
          type: 'skill',
          skillId: 'diversity-inclusion',
        },
      ],
    },
  },
});
```

## 🔌 Integration with Aberdeen Systems

### Master Search Bar Integration

```typescript
import { SearchAIIntegration } from './integrations/search/SearchAIIntegration';

const searchAI = new SearchAIIntegration(gateway);

// Semantic search
const semanticResults = await searchAI.semanticSearch({
  query: 'product managers with startup experience',
  entities: ['candidates', 'contacts'],
  hybridAlpha: 0.7, // 70% semantic, 30% keyword
});

// Natural language query
const nlResults = await searchAI.naturalLanguageSearch(
  'Show me submissions from last week with status interview'
);

// AI autocomplete
const suggestions = await searchAI.autocomplete({
  query: 'software eng',
  entities: ['candidates'],
  includeRecent: true,
  includePopular: true,
});

// X-Ray search generation
const xraySearch = await searchAI.generateXRaySearch({
  platform: 'linkedin',
  keywords: ['React', 'TypeScript'],
  location: 'San Francisco',
  company: 'Google',
  yearsExperience: { min: 5 },
});

console.log('LinkedIn Search URL:', xraySearch.searchUrl);
```

### Excel AI Integration

```typescript
// Enhance Excel data with AI analysis
const candidates = loadFromExcel('candidates.xlsx');

for (const candidate of candidates) {
  const analysis = await gateway.orchestrate({
    type: 'skill_execution',
    skillId: 'resume-xray-vision',
    input: {
      resumeText: candidate.resume,
    },
  });

  candidate.aiQualityScore = analysis.data.qualityScore;
  candidate.aiHiddenSkills = analysis.data.hiddenSkills.slice(0, 5);
  candidate.aiMatchScore = calculateMatchScore(candidate, jobReq);
}

saveToExcel(candidates, 'candidates_ai_enhanced.xlsx');
```

### Multi-AI Shell Integration

```typescript
// Route chat requests to appropriate AI provider
const result = await gateway.orchestrate({
  type: 'skill_execution',
  skillId: 'chat-completion-skill',
  input: {
    messages: chatHistory,
    userQuery: 'Analyze this candidate profile...',
  },
  config: {
    preferredProvider: 'anthropic_claude', // Best for analysis
    fallbackProviders: ['openai_gpt'], // Fallback if needed
  },
});
```

## 📊 Monitoring & Metrics

### Get Gateway Metrics

```typescript
const metrics = await gateway.getMetrics();

console.log('Total Requests:', metrics.totalRequests);
console.log('Success Rate:', metrics.successRate);
console.log('Average Latency:', metrics.averageLatency);
console.log('Total Tokens Used:', metrics.totalTokensUsed);
console.log('Total Cost:', metrics.totalCost);

// Provider metrics
for (const [provider, stats] of Object.entries(metrics.providerMetrics)) {
  console.log(`${provider}:`, stats);
}

// Skill metrics
for (const [skillId, stats] of Object.entries(metrics.skillMetrics)) {
  console.log(`Skill ${skillId}:`, stats);
}
```

## 🔧 Advanced Configuration

### Custom Skill Creation

```typescript
import { Skill, SkillType, SkillHandler } from './types/gateway.types';

const customSkillHandler: SkillHandler = async (inputs, context) => {
  // Your skill logic here
  context.logger.info('Executing custom skill');

  // Access AI provider
  const aiResult = await callAI(context.aiProvider, inputs.prompt);

  // Access database
  const data = await context.database.query('SELECT ...');

  // Access search
  const searchResults = await context.search.search({
    query: inputs.query,
    mode: 'semantic',
    entities: ['candidates'],
  });

  return {
    success: true,
    data: { /* results */ },
    executionTime: 0,
    confidence: 0.9,
    traceId: context.requestId,
    timestamp: new Date(),
  };
};

const customSkill: Skill = {
  id: 'custom-skill-id',
  name: 'My Custom Skill',
  type: SkillType.CUSTOM,
  description: 'Does something amazing',
  version: '1.0.0',
  handler: customSkillHandler,
  requiredInputs: [/* ... */],
  outputs: [/* ... */],
  preferredProvider: 'anthropic_claude',
  isActive: true,
  // ... other config
};

gateway.getSkillRegistry().register(customSkill);
```

### Custom Agent Creation

```typescript
import { Agent, AgentType, AgentHandler } from './types/gateway.types';

const customAgentHandler: AgentHandler = async (task, context) => {
  context.reportProgress(0, 'Starting...');

  // Use skills
  const skillResult = await context.skills.execute('skill-id', inputs);

  context.reportProgress(50, 'Halfway there...');

  // Use tools
  const toolResult = await context.tools.execute('tool-id', params);

  context.reportProgress(100, 'Complete!');

  return {
    success: true,
    data: { /* results */ },
    executionTime: 0,
    skillsUsed: ['skill-id'],
    toolsUsed: ['tool-id'],
    timestamp: new Date(),
  };
};

const customAgent: Agent = {
  id: 'custom-agent-id',
  name: 'My Custom Agent',
  type: AgentType.CUSTOM,
  description: 'Autonomous agent that does X',
  version: '1.0.0',
  config: {
    aiProvider: 'anthropic_claude',
    aiModel: 'claude-sonnet-4-20250514',
    autonomousMode: true,
    requiresApproval: false,
  },
  skills: ['skill1', 'skill2'],
  tools: ['tool1', 'tool2'],
  handler: customAgentHandler,
  status: 'idle',
  // ... other config
};

gateway.getAgentRegistry().register(customAgent);
```

## 📈 Performance Optimization

### Caching

```typescript
// Enable caching for expensive operations
const result = await gateway.orchestrate({
  type: 'skill_execution',
  skillId: 'market-intelligence',
  input: { role: 'Engineer', location: 'SF' },
  config: {
    cacheResults: true,
    cacheTTL: 1800, // 30 minutes
  },
});
```

### Parallel Execution

```typescript
// Execute multiple skills in parallel
const result = await gateway.orchestrate({
  type: 'multi_skill',
  input: {
    skillIds: ['skill1', 'skill2', 'skill3'],
  },
  config: {
    parallelExecution: true,
  },
});
```

### Provider Selection

```typescript
// Automatically select best provider
const result = await gateway.orchestrate({
  type: 'skill_execution',
  skillId: 'resume-xray-vision',
  config: {
    autoSelectBestModel: true, // Selects based on cost, speed, quality
  },
});
```

## 🔒 Security

- API key management
- Rate limiting per provider
- Request validation
- Access control for skills/agents
- Audit logging

## 📝 Type Safety

Full TypeScript support with comprehensive types for:

- ✅ All request/response objects
- ✅ Skill, tool, and agent definitions
- ✅ Orchestration workflows
- ✅ Error handling
- ✅ Monitoring metrics

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

### Environment Variables

```bash
GATEWAY_PORT=8080
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
PERPLEXITY_API_KEY=pplx-...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
```

## 📚 API Documentation

Full API documentation available at:
- Interactive: http://localhost:8080/docs
- OpenAPI spec: http://localhost:8080/openapi.json

## 🤝 Contributing

1. Create a new skill in `/skills`
2. Add tests
3. Update documentation
4. Submit PR

## 📄 License

MIT License - Aberdeen AI-ATS

---

**Built with ❤️ for Aberdeen AI-ATS**
**Integrates seamlessly with Multi-AI Shell, Master Search, Excel AI, and Advanced Skills**
