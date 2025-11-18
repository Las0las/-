/**
 * AI Gateway - Core Orchestration System
 * Aberdeen AI-ATS
 *
 * Central orchestration hub for skills, tools, agents, and AI providers
 * Integrates with Master Search, Excel AI, Multi-AI Shell, and Advanced Skills
 */

import {
  AIProvider,
  AIModel,
  AIProviderConfig,
  Skill,
  SkillRegistry,
  SkillResult,
  Tool,
  ToolRegistry,
  ToolResult,
  Agent,
  AgentRegistry,
  AgentTask,
  AgentResult,
  OrchestrationRequest,
  OrchestrationResponse,
  OrchestrationType,
  OrchestrationError,
  GatewayConfig,
  GatewayMetrics,
  Logger,
  MetricsCollector,
  DatabaseAccess,
  StorageAccess,
  SearchAccess,
} from '../types/gateway.types';

import { SearchRequest, SearchResponse } from '../../src/types/search.types';

/**
 * Main AI Gateway Class
 *
 * Orchestrates all AI operations, routes requests to appropriate
 * skills/tools/agents, manages AI providers, and monitors performance
 */
export class AIGateway {
  private config: GatewayConfig;
  private skillRegistry: SkillRegistryImpl;
  private toolRegistry: ToolRegistryImpl;
  private agentRegistry: AgentRegistryImpl;
  private providerManager: AIProviderManager;
  private cacheManager: CacheManager;
  private logger: Logger;
  private metrics: MetricsCollector;

  // Access services
  private database: DatabaseAccess;
  private storage: StorageAccess;
  private search: SearchAccess;

  constructor(config: GatewayConfig) {
    this.config = config;

    // Initialize registries
    this.skillRegistry = new SkillRegistryImpl(this);
    this.toolRegistry = new ToolRegistryImpl(this);
    this.agentRegistry = new AgentRegistryImpl(this);

    // Initialize managers
    this.providerManager = new AIProviderManager(config.providers);
    this.cacheManager = new CacheManager(config.cache);

    // Initialize monitoring
    this.logger = this.createLogger();
    this.metrics = this.createMetricsCollector();

    // Initialize access services
    this.database = this.createDatabaseAccess();
    this.storage = this.createStorageAccess();
    this.search = this.createSearchAccess();

    this.logger.info('AI Gateway initialized', {
      environment: config.environment,
      providers: config.providers.length,
      features: config.features,
    });
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  /**
   * Main orchestration method - routes requests to appropriate handlers
   */
  async orchestrate(request: OrchestrationRequest): Promise<OrchestrationResponse> {
    const startTime = Date.now();
    const requestId = request.requestId || this.generateRequestId();
    const traceId = this.generateTraceId();

    this.logger.info('Orchestration request received', {
      requestId,
      type: request.type,
      skillId: request.skillId,
      toolId: request.toolId,
      agentId: request.agentId,
    });

    try {
      // Validate request
      await this.validateRequest(request);

      // Check cache
      if (request.config?.cacheResults !== false) {
        const cached = await this.cacheManager.get(request);
        if (cached) {
          this.logger.debug('Cache hit', { requestId });
          this.metrics.increment('gateway.cache.hit');
          return this.buildResponse(cached, requestId, traceId, Date.now() - startTime);
        }
      }

      this.metrics.increment('gateway.cache.miss');

      // Route to appropriate handler
      let result: any;

      switch (request.type) {
        case OrchestrationType.SKILL_EXECUTION:
          result = await this.executeSkill(request, requestId, traceId);
          break;

        case OrchestrationType.TOOL_EXECUTION:
          result = await this.executeTool(request, requestId, traceId);
          break;

        case OrchestrationType.AGENT_TASK:
          result = await this.executeAgentTask(request, requestId, traceId);
          break;

        case OrchestrationType.WORKFLOW:
          result = await this.executeWorkflow(request, requestId, traceId);
          break;

        case OrchestrationType.MULTI_SKILL:
          result = await this.executeMultiSkill(request, requestId, traceId);
          break;

        case OrchestrationType.MULTI_AGENT:
          result = await this.executeMultiAgent(request, requestId, traceId);
          break;

        default:
          throw new Error(`Unknown orchestration type: ${request.type}`);
      }

      const executionTime = Date.now() - startTime;

      // Build response
      const response = this.buildResponse(result, requestId, traceId, executionTime);

      // Cache result
      if (request.config?.cacheResults !== false && result.success) {
        await this.cacheManager.set(request, response, request.config?.cacheTTL);
      }

      // Record metrics
      this.recordMetrics(request, response, executionTime);

      this.logger.info('Orchestration completed', {
        requestId,
        success: response.success,
        executionTime,
      });

      return response;

    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      this.logger.error('Orchestration failed', {
        requestId,
        error: error.message,
        stack: error.stack,
      });

      this.metrics.increment('gateway.error', 1, {
        type: request.type,
        error: error.code || 'unknown',
      });

      return {
        success: false,
        error: this.buildError(error),
        requestId,
        executionTime,
        executedBy: {
          type: 'skill',
          id: 'unknown',
          name: 'unknown',
        },
        traceId,
        spanId: this.generateSpanId(),
        timestamp: new Date(),
      };
    }
  }

  /**
   * Execute a skill
   */
  async executeSkill(
    request: OrchestrationRequest,
    requestId: string,
    traceId: string
  ): Promise<SkillResult> {
    if (!request.skillId) {
      throw new Error('skillId is required for skill execution');
    }

    const skill = this.skillRegistry.get(request.skillId);
    if (!skill) {
      throw new Error(`Skill not found: ${request.skillId}`);
    }

    this.logger.debug('Executing skill', {
      requestId,
      skillId: skill.id,
      skillName: skill.name,
    });

    // Select AI provider
    const aiProvider = await this.selectAIProvider(
      request.config?.preferredProvider || skill.preferredProvider,
      request.config?.fallbackProviders || skill.fallbackProviders
    );

    // Build execution context
    const context = {
      skillId: skill.id,
      userId: request.userId,
      requestId,
      aiProvider,
      alternativeProviders: this.providerManager.getAll().filter(p => p !== aiProvider),
      tools: this.toolRegistry,
      database: this.database,
      storage: this.storage,
      search: this.search,
      logger: this.logger,
      metrics: this.metrics,
      metadata: request.metadata || {},
    };

    // Execute skill
    const result = await this.skillRegistry.execute(skill.id, request.input, context);

    this.metrics.timing('skill.execution', result.executionTime, {
      skillId: skill.id,
      skillType: skill.type,
    });

    return result;
  }

  /**
   * Execute a tool
   */
  async executeTool(
    request: OrchestrationRequest,
    requestId: string,
    traceId: string
  ): Promise<ToolResult> {
    if (!request.toolId) {
      throw new Error('toolId is required for tool execution');
    }

    const tool = this.toolRegistry.get(request.toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${request.toolId}`);
    }

    this.logger.debug('Executing tool', {
      requestId,
      toolId: tool.id,
      toolName: tool.name,
    });

    // Build execution context
    const context = {
      toolId: tool.id,
      userId: request.userId,
      requestId,
      credentials: {}, // Load from vault
      permissions: [], // Load from auth
      logger: this.logger,
      metrics: this.metrics,
      metadata: request.metadata || {},
    };

    // Execute tool
    const result = await this.toolRegistry.execute(tool.id, request.input, context);

    this.metrics.timing('tool.execution', result.executionTime, {
      toolId: tool.id,
      toolType: tool.type,
    });

    return result;
  }

  /**
   * Execute an agent task
   */
  async executeAgentTask(
    request: OrchestrationRequest,
    requestId: string,
    traceId: string
  ): Promise<AgentResult> {
    if (!request.agentId) {
      throw new Error('agentId is required for agent task execution');
    }

    const agent = this.agentRegistry.get(request.agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${request.agentId}`);
    }

    this.logger.debug('Starting agent task', {
      requestId,
      agentId: agent.id,
      agentName: agent.name,
    });

    // Create task
    const task: AgentTask = {
      id: this.generateTaskId(),
      agentId: agent.id,
      type: request.input.type || 'generic',
      input: request.input,
      priority: request.config?.priority || 'medium',
      userId: request.userId,
      metadata: request.metadata,
      status: 'pending',
      progress: 0,
      retryCount: 0,
      maxRetries: request.config?.maxRetries || 3,
    };

    // Execute task
    const result = await this.agentRegistry.startTask(agent.id, task);

    this.metrics.timing('agent.execution', result.executionTime, {
      agentId: agent.id,
      agentType: agent.type,
    });

    return result;
  }

  /**
   * Execute a workflow (sequence of skills/tools)
   */
  async executeWorkflow(
    request: OrchestrationRequest,
    requestId: string,
    traceId: string
  ): Promise<any> {
    const workflow = request.input.workflow;
    if (!workflow || !workflow.steps) {
      throw new Error('Workflow steps are required');
    }

    this.logger.info('Executing workflow', {
      requestId,
      stepCount: workflow.steps.length,
    });

    const results: any[] = [];
    let currentStepId = workflow.steps[0].id;

    while (currentStepId) {
      const step = workflow.steps.find(s => s.id === currentStepId);
      if (!step) break;

      this.logger.debug('Executing workflow step', {
        requestId,
        stepId: step.id,
        stepType: step.type,
      });

      try {
        let stepResult;

        switch (step.type) {
          case 'skill':
            stepResult = await this.executeSkill(
              {
                ...request,
                type: OrchestrationType.SKILL_EXECUTION,
                skillId: step.skillId,
              },
              requestId,
              traceId
            );
            break;

          case 'tool':
            stepResult = await this.executeTool(
              {
                ...request,
                type: OrchestrationType.TOOL_EXECUTION,
                toolId: step.toolId,
              },
              requestId,
              traceId
            );
            break;

          case 'decision':
            // Evaluate condition and choose next step
            currentStepId = this.evaluateCondition(step.condition, results)
              ? step.nextStepOnSuccess
              : step.nextStepOnFailure;
            continue;

          case 'parallel':
            // Execute multiple steps in parallel
            const parallelResults = await Promise.all(
              (step.parallelSteps || []).map(async (stepId) => {
                const parallelStep = workflow.steps.find(s => s.id === stepId);
                if (!parallelStep) return null;

                if (parallelStep.type === 'skill') {
                  return this.executeSkill(
                    {
                      ...request,
                      type: OrchestrationType.SKILL_EXECUTION,
                      skillId: parallelStep.skillId,
                    },
                    requestId,
                    traceId
                  );
                }
                return null;
              })
            );
            stepResult = { parallelResults };
            break;

          case 'wait':
            await this.sleep(step.waitDuration || 1000);
            stepResult = { waited: true };
            break;

          default:
            throw new Error(`Unknown step type: ${step.type}`);
        }

        results.push({
          stepId: step.id,
          result: stepResult,
        });

        // Determine next step
        if (stepResult.success || stepResult.success === undefined) {
          currentStepId = step.nextStepOnSuccess || step.nextStep;
        } else {
          if (step.retryOnFailure && stepResult.retryCount < (step.maxRetries || 3)) {
            // Retry this step
            continue;
          }
          currentStepId = step.nextStepOnFailure || step.nextStep;
        }

      } catch (error: any) {
        this.logger.error('Workflow step failed', {
          requestId,
          stepId: step.id,
          error: error.message,
        });

        if (workflow.errorHandling === 'stop') {
          throw error;
        } else if (workflow.errorHandling === 'rollback') {
          await this.rollbackWorkflow(results);
          throw error;
        }

        // Continue to next step
        currentStepId = step.nextStepOnFailure || step.nextStep;
      }
    }

    return {
      success: true,
      data: results,
      executionTime: 0, // Calculate total
    };
  }

  /**
   * Execute multiple skills in parallel or sequence
   */
  async executeMultiSkill(
    request: OrchestrationRequest,
    requestId: string,
    traceId: string
  ): Promise<any> {
    const skillIds = request.input.skillIds || [];
    const parallel = request.config?.parallelExecution !== false;

    this.logger.info('Executing multi-skill', {
      requestId,
      skillCount: skillIds.length,
      parallel,
    });

    if (parallel) {
      const results = await Promise.all(
        skillIds.map(async (skillId: string) =>
          this.executeSkill(
            {
              ...request,
              type: OrchestrationType.SKILL_EXECUTION,
              skillId,
            },
            requestId,
            traceId
          )
        )
      );

      return {
        success: results.every(r => r.success),
        data: results,
        executionTime: Math.max(...results.map(r => r.executionTime)),
      };
    } else {
      const results: SkillResult[] = [];

      for (const skillId of skillIds) {
        const result = await this.executeSkill(
          {
            ...request,
            type: OrchestrationType.SKILL_EXECUTION,
            skillId,
          },
          requestId,
          traceId
        );

        results.push(result);

        if (!result.success) {
          break; // Stop on first failure in sequence
        }
      }

      return {
        success: results.every(r => r.success),
        data: results,
        executionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
      };
    }
  }

  /**
   * Execute multiple agents in coordination
   */
  async executeMultiAgent(
    request: OrchestrationRequest,
    requestId: string,
    traceId: string
  ): Promise<any> {
    const agentIds = request.input.agentIds || [];
    const coordinationType = request.input.coordinationType || 'parallel';

    this.logger.info('Executing multi-agent', {
      requestId,
      agentCount: agentIds.length,
      coordinationType,
    });

    if (coordinationType === 'parallel') {
      const results = await Promise.all(
        agentIds.map(async (agentId: string) =>
          this.executeAgentTask(
            {
              ...request,
              type: OrchestrationType.AGENT_TASK,
              agentId,
            },
            requestId,
            traceId
          )
        )
      );

      return {
        success: results.every(r => r.success),
        data: results,
        executionTime: Math.max(...results.map(r => r.executionTime)),
      };
    } else {
      // Sequential or coordinated execution
      const results: AgentResult[] = [];

      for (const agentId of agentIds) {
        const result = await this.executeAgentTask(
          {
            ...request,
            type: OrchestrationType.AGENT_TASK,
            agentId,
          },
          requestId,
          traceId
        );

        results.push(result);
      }

      return {
        success: results.every(r => r.success),
        data: results,
        executionTime: results.reduce((sum, r) => sum + r.executionTime, 0),
      };
    }
  }

  // ============================================================================
  // REGISTRY ACCESS
  // ============================================================================

  getSkillRegistry(): SkillRegistry {
    return this.skillRegistry;
  }

  getToolRegistry(): ToolRegistry {
    return this.toolRegistry;
  }

  getAgentRegistry(): AgentRegistry {
    return this.agentRegistry;
  }

  // ============================================================================
  // METRICS & MONITORING
  // ============================================================================

  async getMetrics(): Promise<GatewayMetrics> {
    // Aggregate metrics from various sources
    const metrics: GatewayMetrics = {
      totalRequests: 0,
      requestsPerMinute: 0,
      requestsPerHour: 0,
      averageLatency: 0,
      p50Latency: 0,
      p95Latency: 0,
      p99Latency: 0,
      successRate: 0,
      errorRate: 0,
      totalTokensUsed: 0,
      totalCost: 0,
      providerMetrics: {} as any,
      skillMetrics: {} as any,
      agentMetrics: {} as any,
      periodStart: new Date(Date.now() - 3600000), // Last hour
      periodEnd: new Date(),
    };

    // TODO: Implement metrics aggregation from database/metrics store

    return metrics;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async validateRequest(request: OrchestrationRequest): Promise<void> {
    // Validate based on type
    switch (request.type) {
      case OrchestrationType.SKILL_EXECUTION:
        if (!request.skillId) {
          throw new Error('skillId is required for skill execution');
        }
        break;

      case OrchestrationType.TOOL_EXECUTION:
        if (!request.toolId) {
          throw new Error('toolId is required for tool execution');
        }
        break;

      case OrchestrationType.AGENT_TASK:
        if (!request.agentId) {
          throw new Error('agentId is required for agent task');
        }
        break;
    }

    // Validate input
    if (!request.input || typeof request.input !== 'object') {
      throw new Error('input must be a valid object');
    }
  }

  private async selectAIProvider(
    preferred?: AIProvider,
    fallbacks?: AIProvider[]
  ): Promise<AIProviderConfig> {
    if (preferred) {
      const provider = this.providerManager.get(preferred);
      if (provider && await this.providerManager.isHealthy(preferred)) {
        return provider;
      }
    }

    // Try fallbacks
    if (fallbacks && fallbacks.length > 0) {
      for (const fallback of fallbacks) {
        const provider = this.providerManager.get(fallback);
        if (provider && await this.providerManager.isHealthy(fallback)) {
          return provider;
        }
      }
    }

    // Use default
    const defaultProvider = this.providerManager.get(this.config.defaultProvider);
    if (!defaultProvider) {
      throw new Error('No available AI provider');
    }

    return defaultProvider;
  }

  private buildResponse(
    result: any,
    requestId: string,
    traceId: string,
    executionTime: number
  ): OrchestrationResponse {
    return {
      success: result.success || false,
      data: result.data,
      error: result.error,
      requestId,
      executionTime,
      executedBy: result.executedBy || {
        type: 'skill',
        id: result.skillId || 'unknown',
        name: result.skillName || 'unknown',
      },
      aiProvider: result.provider,
      aiModel: result.model,
      tokensUsed: result.tokensUsed,
      cost: result.cost,
      confidence: result.confidence,
      qualityScore: result.qualityScore,
      traceId,
      spanId: this.generateSpanId(),
      timestamp: new Date(),
    };
  }

  private buildError(error: any): OrchestrationError {
    return {
      code: error.code || 'INTERNAL_ERROR',
      message: error.message || 'An error occurred',
      type: error.type || 'system_error',
      details: error.details,
      retryable: error.retryable !== false,
      suggestions: error.suggestions || [],
    };
  }

  private recordMetrics(
    request: OrchestrationRequest,
    response: OrchestrationResponse,
    executionTime: number
  ): void {
    this.metrics.increment('gateway.request', 1, {
      type: request.type,
      success: response.success ? 'true' : 'false',
    });

    this.metrics.timing('gateway.latency', executionTime, {
      type: request.type,
    });

    if (response.tokensUsed) {
      this.metrics.increment('gateway.tokens', response.tokensUsed, {
        provider: response.aiProvider || 'unknown',
      });
    }

    if (response.cost) {
      this.metrics.gauge('gateway.cost', response.cost, {
        provider: response.aiProvider || 'unknown',
      });
    }
  }

  private evaluateCondition(condition: string | undefined, results: any[]): boolean {
    if (!condition) return true;

    // Simple condition evaluation
    // TODO: Implement proper expression parser
    try {
      const fn = new Function('results', `return ${condition}`);
      return fn(results);
    } catch {
      return false;
    }
  }

  private async rollbackWorkflow(results: any[]): Promise<void> {
    this.logger.warn('Rolling back workflow', { stepCount: results.length });

    // Execute compensating actions in reverse order
    for (let i = results.length - 1; i >= 0; i--) {
      const step = results[i];
      // TODO: Implement compensating actions
      this.logger.debug('Rolling back step', { stepId: step.stepId });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogger(): Logger {
    return {
      debug: (message: string, data?: any) => console.debug(`[DEBUG] ${message}`, data),
      info: (message: string, data?: any) => console.info(`[INFO] ${message}`, data),
      warn: (message: string, data?: any) => console.warn(`[WARN] ${message}`, data),
      error: (message: string, error?: any) => console.error(`[ERROR] ${message}`, error),
      log: (level: any, message: string, data?: any) => console.log(`[${level}] ${message}`, data),
    };
  }

  private createMetricsCollector(): MetricsCollector {
    return {
      increment: (metric: string, value?: number, tags?: any) => {
        // TODO: Implement metrics collection
      },
      gauge: (metric: string, value: number, tags?: any) => {
        // TODO: Implement metrics collection
      },
      histogram: (metric: string, value: number, tags?: any) => {
        // TODO: Implement metrics collection
      },
      timing: (metric: string, duration: number, tags?: any) => {
        // TODO: Implement metrics collection
      },
    };
  }

  private createDatabaseAccess(): DatabaseAccess {
    return {
      query: async <T = any>(sql: string, params?: any[]) => [] as T[],
      queryOne: async <T = any>(sql: string, params?: any[]) => null as T | null,
      execute: async (sql: string, params?: any[]) => ({ rowCount: 0 }),
      transaction: async <T>(callback: (tx: DatabaseAccess) => Promise<T>) => {
        return callback(this.database);
      },
    };
  }

  private createStorageAccess(): StorageAccess {
    return {
      upload: async (file: any, path: string, metadata?: any) => path,
      download: async (path: string) => Buffer.from(''),
      delete: async (path: string) => {},
      exists: async (path: string) => false,
      getUrl: async (path: string, expiresIn?: number) => '',
    };
  }

  private createSearchAccess(): SearchAccess {
    return {
      search: async (request: SearchRequest) => ({
        results: [],
        totalCount: 0,
        query: request.query,
        mode: request.mode,
        executionTime: 0,
        limit: request.limit || 20,
        offset: request.offset || 0,
        hasMore: false,
        searchId: '',
        timestamp: new Date(),
      }) as SearchResponse,
      index: async (entity: any, document: any) => {},
      update: async (entity: any, documentId: string, document: any) => {},
      delete: async (entity: any, documentId: string) => {},
      bulk: async (operations: any[]) => ({
        success: true,
        operations: { index: 0, update: 0, delete: 0 },
      }),
    };
  }
}

// ============================================================================
// IMPLEMENTATION CLASSES
// ============================================================================

class SkillRegistryImpl implements SkillRegistry {
  private skills: Map<string, Skill> = new Map();
  private gateway: AIGateway;

  constructor(gateway: AIGateway) {
    this.gateway = gateway;
  }

  register(skill: Skill): void {
    this.skills.set(skill.id, skill);
  }

  unregister(skillId: string): void {
    this.skills.delete(skillId);
  }

  get(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getByType(type: any): Skill[] {
    return Array.from(this.skills.values()).filter(s => s.type === type);
  }

  list(): Skill[] {
    return Array.from(this.skills.values());
  }

  async execute(skillId: string, inputs: Record<string, any>, context?: any): Promise<SkillResult> {
    const skill = this.get(skillId);
    if (!skill) {
      throw new Error(`Skill not found: ${skillId}`);
    }

    return skill.handler(inputs, context);
  }
}

class ToolRegistryImpl implements ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private gateway: AIGateway;

  constructor(gateway: AIGateway) {
    this.gateway = gateway;
  }

  register(tool: Tool): void {
    this.tools.set(tool.id, tool);
  }

  unregister(toolId: string): void {
    this.tools.delete(toolId);
  }

  get(toolId: string): Tool | undefined {
    return this.tools.get(toolId);
  }

  getByType(type: any): Tool[] {
    return Array.from(this.tools.values()).filter(t => t.type === type);
  }

  list(): Tool[] {
    return Array.from(this.tools.values());
  }

  async execute(toolId: string, params: Record<string, any>, context?: any): Promise<ToolResult> {
    const tool = this.get(toolId);
    if (!tool) {
      throw new Error(`Tool not found: ${toolId}`);
    }

    return tool.handler(params, context);
  }
}

class AgentRegistryImpl implements AgentRegistry {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, AgentTask> = new Map();
  private gateway: AIGateway;

  constructor(gateway: AIGateway) {
    this.gateway = gateway;
  }

  register(agent: Agent): void {
    this.agents.set(agent.id, agent);
  }

  unregister(agentId: string): void {
    this.agents.delete(agentId);
  }

  get(agentId: string): Agent | undefined {
    return this.agents.get(agentId);
  }

  getByType(type: any): Agent[] {
    return Array.from(this.agents.values()).filter(a => a.type === type);
  }

  list(): Agent[] {
    return Array.from(this.agents.values());
  }

  async startTask(agentId: string, task: AgentTask): Promise<AgentResult> {
    const agent = this.get(agentId);
    if (!agent) {
      throw new Error(`Agent not found: ${agentId}`);
    }

    this.tasks.set(task.id, task);

    // Build context
    const context: any = {
      agentId: agent.id,
      taskId: task.id,
      userId: task.userId,
      requestId: task.id,
      skills: this.gateway.getSkillRegistry(),
      tools: this.gateway.getToolRegistry(),
      shouldStop: () => false,
      reportProgress: (progress: number, message?: string) => {
        task.progress = progress;
      },
    };

    const result = await agent.handler(task, context);

    task.status = result.success ? 'completed' : 'failed';
    task.completedAt = new Date();
    task.result = result;

    return result;
  }

  async stopTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (task) {
      task.status = 'cancelled';
    }
  }

  getTaskStatus(taskId: string): any {
    return this.tasks.get(taskId)?.status || 'pending';
  }
}

class AIProviderManager {
  private providers: Map<AIProvider, AIProviderConfig> = new Map();

  constructor(configs: AIProviderConfig[]) {
    configs.forEach(config => {
      this.providers.set(config.provider, config);
    });
  }

  get(provider: AIProvider): AIProviderConfig | undefined {
    return this.providers.get(provider);
  }

  getAll(): AIProviderConfig[] {
    return Array.from(this.providers.values());
  }

  async isHealthy(provider: AIProvider): Promise<boolean> {
    // TODO: Implement health check
    return true;
  }
}

class CacheManager {
  private cache: Map<string, any> = new Map();
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async get(request: OrchestrationRequest): Promise<any | null> {
    if (!this.config.enabled) return null;

    const key = this.buildKey(request);
    return this.cache.get(key) || null;
  }

  async set(request: OrchestrationRequest, response: any, ttl?: number): Promise<void> {
    if (!this.config.enabled) return;

    const key = this.buildKey(request);
    this.cache.set(key, response);

    // Set TTL
    if (ttl) {
      setTimeout(() => {
        this.cache.delete(key);
      }, ttl * 1000);
    }
  }

  private buildKey(request: OrchestrationRequest): string {
    return JSON.stringify({
      type: request.type,
      skillId: request.skillId,
      toolId: request.toolId,
      agentId: request.agentId,
      input: request.input,
    });
  }
}

export default AIGateway;
