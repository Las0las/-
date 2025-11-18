/**
 * AI Gateway - Core Type Definitions
 * Aberdeen AI-ATS
 *
 * Comprehensive type system for AI skill, tool, and agent orchestration
 * Integrates with Master Search, Excel AI, Multi-AI Shell, and Advanced Skills
 */

import { z } from 'zod';
import {
  SearchMode,
  SearchEntity,
  SearchRequest,
  SearchResponse
} from '../../src/types/search.types';

// ============================================================================
// AI PROVIDER TYPES
// ============================================================================

export enum AIProvider {
  ANTHROPIC_CLAUDE = 'anthropic_claude',
  OPENAI_GPT = 'openai_gpt',
  PERPLEXITY = 'perplexity',
  COHERE = 'cohere',
  GOOGLE_GEMINI = 'google_gemini',
  META_LLAMA = 'meta_llama',
  MISTRAL = 'mistral',
  CUSTOM = 'custom'
}

export enum AIModel {
  // Anthropic
  CLAUDE_SONNET_4 = 'claude-sonnet-4-20250514',
  CLAUDE_OPUS_4 = 'claude-opus-4-20250514',
  CLAUDE_HAIKU_4 = 'claude-haiku-4-20250514',

  // OpenAI
  GPT_4_TURBO = 'gpt-4-turbo-preview',
  GPT_4 = 'gpt-4',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',

  // Perplexity
  PERPLEXITY_SONAR = 'llama-3.1-sonar-large-128k-online',

  // Google
  GEMINI_PRO = 'gemini-pro',
  GEMINI_ULTRA = 'gemini-ultra',

  // Meta
  LLAMA_3_70B = 'llama-3-70b',

  // Mistral
  MISTRAL_LARGE = 'mistral-large-latest'
}

export interface AIProviderConfig {
  provider: AIProvider;
  model: AIModel;
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;

  // Request configuration
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;

  // Advanced
  streaming?: boolean;
  timeout?: number;
  retryAttempts?: number;
  rateLimitPerMinute?: number;
}

// ============================================================================
// SKILL TYPES
// ============================================================================

export enum SkillType {
  RESUME_XRAY = 'resume_xray',
  MARKET_INTELLIGENCE = 'market_intelligence',
  DIVERSITY_INCLUSION = 'diversity_inclusion',
  REVENUE_INTELLIGENCE = 'revenue_intelligence',
  CANDIDATE_MATCHING = 'candidate_matching',
  JOB_PARSING = 'job_parsing',
  INTERVIEW_ANALYSIS = 'interview_analysis',
  SALARY_BENCHMARKING = 'salary_benchmarking',
  SKILL_EXTRACTION = 'skill_extraction',
  CULTURE_FIT = 'culture_fit',
  CUSTOM = 'custom'
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  description: string;
  version: string;

  // Execution
  handler: SkillHandler;
  requiredInputs: SkillInput[];
  outputs: SkillOutput[];

  // AI Configuration
  preferredProvider?: AIProvider;
  preferredModel?: AIModel;
  fallbackProviders?: AIProvider[];

  // Performance
  averageExecutionTime?: number; // ms
  maxExecutionTime?: number; // ms
  cacheResults?: boolean;
  cacheTTL?: number; // seconds

  // Dependencies
  dependencies?: string[]; // Other skill IDs
  requiredTools?: string[]; // Tool IDs

  // Metadata
  author: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  tags: string[];
}

export interface SkillInput {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'file';
  description: string;
  required: boolean;
  validation?: z.ZodSchema;
  default?: any;
  examples?: any[];
}

export interface SkillOutput {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'file';
  description: string;
  schema?: z.ZodSchema;
}

export type SkillHandler = (
  inputs: Record<string, any>,
  context: SkillExecutionContext
) => Promise<SkillResult>;

export interface SkillExecutionContext {
  skillId: string;
  userId?: string;
  requestId: string;

  // AI Access
  aiProvider: AIProviderConfig;
  alternativeProviders: AIProviderConfig[];

  // Tool Access
  tools: ToolRegistry;

  // Data Access
  database: DatabaseAccess;
  storage: StorageAccess;

  // Search Access
  search: SearchAccess;

  // Monitoring
  logger: Logger;
  metrics: MetricsCollector;

  // Context
  metadata: Record<string, any>;
}

export interface SkillResult {
  success: boolean;
  data?: any;
  error?: SkillError;

  // Execution metadata
  executionTime: number; // ms
  tokensUsed?: number;
  provider?: AIProvider;
  model?: AIModel;

  // Quality metrics
  confidence?: number; // 0-1
  qualityScore?: number; // 0-100

  // Tracing
  traceId: string;
  timestamp: Date;
}

export interface SkillError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  suggestions?: string[];
}

// ============================================================================
// TOOL TYPES
// ============================================================================

export enum ToolType {
  SEARCH = 'search',
  DATABASE = 'database',
  API_CALL = 'api_call',
  FILE_OPERATION = 'file_operation',
  CALCULATION = 'calculation',
  TRANSFORMATION = 'transformation',
  VALIDATION = 'validation',
  INTEGRATION = 'integration',
  SCRAPING = 'scraping',
  NOTIFICATION = 'notification',
  CUSTOM = 'custom'
}

export interface Tool {
  id: string;
  name: string;
  type: ToolType;
  description: string;
  version: string;

  // Execution
  handler: ToolHandler;
  parameters: ToolParameter[];
  returns: ToolReturn;

  // Configuration
  requiresAuth?: boolean;
  rateLimits?: RateLimit;
  timeout?: number; // ms

  // Capabilities
  capabilities: ToolCapability[];

  // Metadata
  author: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  tags: string[];
}

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  schema?: z.ZodSchema;
  default?: any;
}

export interface ToolReturn {
  type: string;
  description: string;
  schema?: z.ZodSchema;
}

export type ToolHandler = (
  params: Record<string, any>,
  context: ToolExecutionContext
) => Promise<ToolResult>;

export interface ToolExecutionContext {
  toolId: string;
  userId?: string;
  requestId: string;

  // Access
  credentials?: Record<string, string>;
  permissions: string[];

  // Monitoring
  logger: Logger;
  metrics: MetricsCollector;

  // Context
  metadata: Record<string, any>;
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: ToolError;
  executionTime: number; // ms

  // Caching
  cacheable?: boolean;
  cacheKey?: string;

  timestamp: Date;
}

export interface ToolError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
}

export interface ToolCapability {
  name: string;
  description: string;
  enabled: boolean;
}

export interface RateLimit {
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstSize?: number;
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export enum AgentType {
  SOURCING = 'sourcing',
  INTERVIEW = 'interview',
  SCREENING = 'screening',
  MATCHING = 'matching',
  OUTREACH = 'outreach',
  NEGOTIATION = 'negotiation',
  ANALYTICS = 'analytics',
  RESEARCH = 'research',
  WORKFLOW = 'workflow',
  CUSTOM = 'custom'
}

export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  PAUSED = 'paused',
  STOPPED = 'stopped',
  ERROR = 'error',
  COMPLETED = 'completed'
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  version: string;

  // Configuration
  config: AgentConfig;

  // Capabilities
  skills: string[]; // Skill IDs
  tools: string[]; // Tool IDs

  // Execution
  handler: AgentHandler;
  workflow?: AgentWorkflow;

  // State
  status: AgentStatus;
  currentTask?: AgentTask;

  // Performance
  totalTasksCompleted: number;
  successRate: number; // 0-100
  averageExecutionTime: number; // ms

  // Metadata
  author: string;
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
  isActive: boolean;
  tags: string[];
}

export interface AgentConfig {
  // AI Configuration
  aiProvider: AIProvider;
  aiModel: AIModel;
  systemPrompt?: string;

  // Behavior
  autonomousMode: boolean;
  requiresApproval: boolean;
  maxIterations?: number;

  // Schedule
  schedule?: AgentSchedule;

  // Resources
  maxConcurrentTasks?: number;
  timeout?: number; // ms

  // Monitoring
  notifyOnCompletion?: boolean;
  notifyOnError?: boolean;

  // Custom
  customConfig?: Record<string, any>;
}

export interface AgentSchedule {
  type: 'cron' | 'interval' | 'manual';
  expression?: string; // Cron expression
  intervalSeconds?: number;
  enabled: boolean;
}

export type AgentHandler = (
  task: AgentTask,
  context: AgentExecutionContext
) => Promise<AgentResult>;

export interface AgentTask {
  id: string;
  agentId: string;
  type: string;

  // Input
  input: Record<string, any>;
  priority: TaskPriority;

  // Context
  userId?: string;
  metadata?: Record<string, any>;

  // State
  status: TaskStatus;
  progress?: number; // 0-100

  // Execution
  startedAt?: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;

  // Results
  result?: AgentResult;

  // Retry
  retryCount: number;
  maxRetries: number;
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface AgentExecutionContext {
  agentId: string;
  taskId: string;
  userId?: string;
  requestId: string;

  // Capabilities
  skills: SkillRegistry;
  tools: ToolRegistry;

  // AI Access
  aiProvider: AIProviderConfig;

  // Data Access
  database: DatabaseAccess;
  storage: StorageAccess;
  search: SearchAccess;

  // Communication
  notify: NotificationService;

  // Monitoring
  logger: Logger;
  metrics: MetricsCollector;

  // Control
  shouldStop: () => boolean;
  reportProgress: (progress: number, message?: string) => void;

  // Context
  metadata: Record<string, any>;
}

export interface AgentResult {
  success: boolean;
  data?: any;
  error?: AgentError;

  // Execution metadata
  executionTime: number; // ms
  iterationCount?: number;
  skillsUsed: string[];
  toolsUsed: string[];

  // Quality
  confidence?: number; // 0-1
  qualityScore?: number; // 0-100

  // Artifacts
  artifacts?: AgentArtifact[];

  // Recommendations
  recommendations?: AgentRecommendation[];

  timestamp: Date;
}

export interface AgentError {
  code: string;
  message: string;
  details?: any;
  retryable: boolean;
  suggestions?: string[];
}

export interface AgentArtifact {
  id: string;
  type: 'file' | 'data' | 'report' | 'visualization';
  name: string;
  description?: string;
  content: any;
  mimeType?: string;
  url?: string;
  metadata?: Record<string, any>;
}

export interface AgentRecommendation {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  actions?: RecommendedAction[];
}

export interface RecommendedAction {
  id: string;
  label: string;
  description: string;
  handler: string; // Function name or endpoint
  parameters?: Record<string, any>;
}

export interface AgentWorkflow {
  steps: WorkflowStep[];
  errorHandling?: ErrorHandlingStrategy;
  rollbackStrategy?: RollbackStrategy;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'skill' | 'tool' | 'decision' | 'parallel' | 'wait';

  // Execution
  skillId?: string;
  toolId?: string;

  // Flow control
  condition?: string; // Expression
  nextStep?: string; // Step ID
  nextStepOnSuccess?: string;
  nextStepOnFailure?: string;

  // Parallel execution
  parallelSteps?: string[]; // Step IDs to run in parallel

  // Wait
  waitDuration?: number; // ms

  // Retry
  retryOnFailure?: boolean;
  maxRetries?: number;

  // Timeout
  timeout?: number; // ms
}

export enum ErrorHandlingStrategy {
  STOP = 'stop',
  CONTINUE = 'continue',
  RETRY = 'retry',
  ROLLBACK = 'rollback',
  ESCALATE = 'escalate'
}

export enum RollbackStrategy {
  NONE = 'none',
  COMPENSATE = 'compensate', // Execute compensating actions
  RESTORE = 'restore' // Restore previous state
}

// ============================================================================
// ORCHESTRATION TYPES
// ============================================================================

export interface OrchestrationRequest {
  type: OrchestrationType;

  // Target
  skillId?: string;
  toolId?: string;
  agentId?: string;

  // Input
  input: Record<string, any>;

  // Configuration
  config?: OrchestrationConfig;

  // Context
  userId?: string;
  requestId?: string;
  metadata?: Record<string, any>;
}

export enum OrchestrationType {
  SKILL_EXECUTION = 'skill_execution',
  TOOL_EXECUTION = 'tool_execution',
  AGENT_TASK = 'agent_task',
  WORKFLOW = 'workflow',
  MULTI_SKILL = 'multi_skill',
  MULTI_AGENT = 'multi_agent'
}

export interface OrchestrationConfig {
  // Execution
  async?: boolean;
  timeout?: number; // ms
  priority?: TaskPriority;

  // AI Selection
  preferredProvider?: AIProvider;
  fallbackProviders?: AIProvider[];
  autoSelectBestModel?: boolean;

  // Retry
  retryOnFailure?: boolean;
  maxRetries?: number;
  retryDelay?: number; // ms

  // Caching
  cacheResults?: boolean;
  cacheTTL?: number; // seconds

  // Monitoring
  notifyOnCompletion?: boolean;
  notifyOnError?: boolean;

  // Advanced
  parallelExecution?: boolean;
  batchSize?: number;
}

export interface OrchestrationResponse {
  success: boolean;
  data?: any;
  error?: OrchestrationError;

  // Execution metadata
  requestId: string;
  executionTime: number; // ms

  // Routing
  executedBy: {
    type: 'skill' | 'tool' | 'agent';
    id: string;
    name: string;
  };

  // AI Usage
  aiProvider?: AIProvider;
  aiModel?: AIModel;
  tokensUsed?: number;
  cost?: number;

  // Quality
  confidence?: number; // 0-1
  qualityScore?: number; // 0-100

  // Tracing
  traceId: string;
  parentTraceId?: string;
  spanId: string;

  timestamp: Date;
}

export interface OrchestrationError {
  code: string;
  message: string;
  type: 'skill_error' | 'tool_error' | 'agent_error' | 'system_error';
  details?: any;
  retryable: boolean;
  suggestions?: string[];
}

// ============================================================================
// REGISTRY TYPES
// ============================================================================

export interface SkillRegistry {
  register(skill: Skill): void;
  unregister(skillId: string): void;
  get(skillId: string): Skill | undefined;
  getByType(type: SkillType): Skill[];
  list(): Skill[];
  execute(skillId: string, inputs: Record<string, any>, context?: any): Promise<SkillResult>;
}

export interface ToolRegistry {
  register(tool: Tool): void;
  unregister(toolId: string): void;
  get(toolId: string): Tool | undefined;
  getByType(type: ToolType): Tool[];
  list(): Tool[];
  execute(toolId: string, params: Record<string, any>, context?: any): Promise<ToolResult>;
}

export interface AgentRegistry {
  register(agent: Agent): void;
  unregister(agentId: string): void;
  get(agentId: string): Agent | undefined;
  getByType(type: AgentType): Agent[];
  list(): Agent[];
  startTask(agentId: string, task: AgentTask): Promise<AgentResult>;
  stopTask(taskId: string): Promise<void>;
  getTaskStatus(taskId: string): TaskStatus;
}

// ============================================================================
// ACCESS INTERFACES
// ============================================================================

export interface DatabaseAccess {
  query<T = any>(sql: string, params?: any[]): Promise<T[]>;
  queryOne<T = any>(sql: string, params?: any[]): Promise<T | null>;
  execute(sql: string, params?: any[]): Promise<{ rowCount: number }>;
  transaction<T>(callback: (tx: DatabaseAccess) => Promise<T>): Promise<T>;
}

export interface StorageAccess {
  upload(file: File | Buffer, path: string, metadata?: Record<string, any>): Promise<string>;
  download(path: string): Promise<Buffer>;
  delete(path: string): Promise<void>;
  exists(path: string): Promise<boolean>;
  getUrl(path: string, expiresIn?: number): Promise<string>;
}

export interface SearchAccess {
  search(request: SearchRequest): Promise<SearchResponse>;
  index(entity: SearchEntity, document: any): Promise<void>;
  update(entity: SearchEntity, documentId: string, document: any): Promise<void>;
  delete(entity: SearchEntity, documentId: string): Promise<void>;
  bulk(operations: BulkSearchOperation[]): Promise<BulkSearchResponse>;
}

export interface BulkSearchOperation {
  action: 'index' | 'update' | 'delete';
  entity: SearchEntity;
  documentId?: string;
  document?: any;
}

export interface BulkSearchResponse {
  success: boolean;
  operations: {
    index: number;
    update: number;
    delete: number;
  };
  errors?: any[];
}

export interface NotificationService {
  send(notification: Notification): Promise<void>;
  sendBulk(notifications: Notification[]): Promise<void>;
}

export interface Notification {
  type: 'email' | 'sms' | 'push' | 'webhook' | 'in_app';
  recipient: string;
  subject?: string;
  message: string;
  metadata?: Record<string, any>;
  priority?: 'low' | 'medium' | 'high';
}

// ============================================================================
// MONITORING TYPES
// ============================================================================

export interface Logger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: any): void;

  // Structured logging
  log(level: LogLevel, message: string, data?: any): void;
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface MetricsCollector {
  increment(metric: string, value?: number, tags?: Record<string, string>): void;
  gauge(metric: string, value: number, tags?: Record<string, string>): void;
  histogram(metric: string, value: number, tags?: Record<string, string>): void;
  timing(metric: string, duration: number, tags?: Record<string, string>): void;
}

export interface GatewayMetrics {
  // Volume
  totalRequests: number;
  requestsPerMinute: number;
  requestsPerHour: number;

  // Performance
  averageLatency: number; // ms
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;

  // Success rates
  successRate: number; // 0-100
  errorRate: number; // 0-100

  // AI Usage
  totalTokensUsed: number;
  totalCost: number; // USD

  // Breakdown by provider
  providerMetrics: Record<AIProvider, ProviderMetrics>;

  // Breakdown by skill
  skillMetrics: Record<string, SkillMetrics>;

  // Breakdown by agent
  agentMetrics: Record<string, AgentMetrics>;

  // Period
  periodStart: Date;
  periodEnd: Date;
}

export interface ProviderMetrics {
  provider: AIProvider;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  totalTokensUsed: number;
  totalCost: number;
}

export interface SkillMetrics {
  skillId: string;
  skillName: string;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  averageQualityScore: number;
}

export interface AgentMetrics {
  agentId: string;
  agentName: string;
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageExecutionTime: number;
  averageQualityScore: number;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface GatewayConfig {
  // Server
  host: string;
  port: number;
  environment: 'development' | 'staging' | 'production';

  // AI Providers
  providers: AIProviderConfig[];
  defaultProvider: AIProvider;

  // Features
  features: {
    skills: boolean;
    tools: boolean;
    agents: boolean;
    orchestration: boolean;
    caching: boolean;
    monitoring: boolean;
    rateLimit: boolean;
  };

  // Performance
  maxConcurrentRequests: number;
  requestTimeout: number; // ms

  // Caching
  cache: {
    enabled: boolean;
    ttl: number; // seconds
    maxSize: number; // MB
  };

  // Rate limiting
  rateLimit: {
    enabled: boolean;
    requestsPerMinute: number;
    requestsPerHour: number;
  };

  // Monitoring
  monitoring: {
    enabled: boolean;
    metricsInterval: number; // seconds
    logLevel: LogLevel;
  };

  // Security
  security: {
    requireAuth: boolean;
    apiKeys: string[];
    allowedOrigins: string[];
  };
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const OrchestrationRequestSchema = z.object({
  type: z.nativeEnum(OrchestrationType),
  skillId: z.string().uuid().optional(),
  toolId: z.string().uuid().optional(),
  agentId: z.string().uuid().optional(),
  input: z.record(z.any()),
  config: z.object({
    async: z.boolean().optional(),
    timeout: z.number().int().positive().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    retryOnFailure: z.boolean().optional(),
    maxRetries: z.number().int().min(0).max(5).optional(),
  }).optional(),
  userId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

export const AgentTaskSchema = z.object({
  agentId: z.string().uuid(),
  type: z.string(),
  input: z.record(z.any()),
  priority: z.nativeEnum(TaskPriority),
  userId: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional(),
});

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export default {
  AIProvider,
  AIModel,
  SkillType,
  ToolType,
  AgentType,
  AgentStatus,
  TaskPriority,
  TaskStatus,
  OrchestrationType,
  ErrorHandlingStrategy,
  RollbackStrategy,
  LogLevel,
};
