/**
 * Search AI Integration
 * Aberdeen AI-ATS
 *
 * Integrates Master Search Bar with AI Gateway for intelligent search capabilities
 * Provides semantic search, natural language queries, and AI-enhanced results
 */

import {
  AIGateway
} from '../../core/AIGateway';

import {
  SearchRequest,
  SearchResponse,
  SearchMode,
  SearchEntity,
  SearchResult,
  AutocompleteRequest,
  AutocompleteResponse,
  NaturalLanguageQuery,
  ParsedNLQuery,
  SemanticSearchRequest,
  XRaySearchRequest,
  XRaySearchResponse,
} from '../../../src/types/search.types';

import {
  OrchestrationRequest,
  OrchestrationType,
  SkillType,
} from '../../types/gateway.types';

/**
 * Search AI Integration Class
 *
 * Bridges Master Search Bar with AI Gateway to provide:
 * - Semantic search using AI embeddings
 * - Natural language query parsing
 * - X-Ray search generation
 * - Intelligent autocomplete
 * - Result ranking and personalization
 */
export class SearchAIIntegration {
  private gateway: AIGateway;

  constructor(gateway: AIGateway) {
    this.gateway = gateway;
  }

  // ============================================================================
  // SEMANTIC SEARCH
  // ============================================================================

  /**
   * Perform semantic search using AI embeddings
   */
  async semanticSearch(request: SemanticSearchRequest): Promise<SearchResponse> {
    console.log('🔍 Performing semantic search...', {
      query: request.query,
      entities: request.entities,
    });

    // Use AI Gateway to generate embeddings and search
    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'semantic-search-skill',
      input: {
        query: request.query,
        entities: request.entities,
        topK: request.topK || 10,
        minSimilarity: request.minSimilarity || 0.7,
        hybridAlpha: request.hybridAlpha || 0.5,
        contextFields: request.contextFields || [],
        filters: request.filters || [],
      },
      config: {
        preferredProvider: 'anthropic_claude',
        cacheResults: true,
        cacheTTL: 300, // 5 minutes
      },
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      throw new Error(`Semantic search failed: ${result.error?.message}`);
    }

    // Convert to SearchResponse format
    return this.buildSearchResponse(result.data, request.query, SearchMode.SEMANTIC);
  }

  /**
   * Generate embeddings for a query
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'embedding-generation-skill',
      input: {
        text,
      },
      config: {
        preferredProvider: 'openai_gpt',
        cacheResults: true,
        cacheTTL: 86400, // 24 hours
      },
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      throw new Error(`Embedding generation failed: ${result.error?.message}`);
    }

    return result.data.embedding;
  }

  // ============================================================================
  // NATURAL LANGUAGE QUERY
  // ============================================================================

  /**
   * Parse natural language query into structured search
   */
  async parseNaturalLanguage(query: string): Promise<ParsedNLQuery> {
    console.log('🗣️ Parsing natural language query:', query);

    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'nl-query-parser-skill',
      input: {
        query,
      },
      config: {
        preferredProvider: 'anthropic_claude',
        cacheResults: true,
        cacheTTL: 300,
      },
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      throw new Error(`NL parsing failed: ${result.error?.message}`);
    }

    return result.data.parsed;
  }

  /**
   * Execute natural language search
   */
  async naturalLanguageSearch(query: string): Promise<SearchResponse> {
    console.log('🗣️ Executing natural language search...', query);

    // Parse natural language query
    const parsed = await this.parseNaturalLanguage(query);

    // Convert to structured search request
    const searchRequest: SearchRequest = {
      query: parsed.entities.map(e => e.value).filter(Boolean).join(' ') || query,
      mode: SearchMode.SEMANTIC,
      entities: parsed.entities.map(e => e.type),
      filters: parsed.filters.map(f => ({
        field: f.field,
        operator: f.operator,
        value: f.value,
        enabled: true,
      })),
      sortBy: parsed.sort ?
        (parsed.sort.order === 'desc' ? 'date_desc' : 'date_asc') :
        'relevance',
      limit: parsed.limit || 20,
    };

    // Execute search using semantic search
    return this.semanticSearch({
      query: searchRequest.query,
      entities: searchRequest.entities,
      filters: searchRequest.filters,
    });
  }

  // ============================================================================
  // X-RAY SEARCH
  // ============================================================================

  /**
   * Generate X-Ray search URL
   */
  async generateXRaySearch(request: XRaySearchRequest): Promise<XRaySearchResponse> {
    console.log('🔬 Generating X-Ray search...', {
      platform: request.platform,
      keywords: request.keywords,
    });

    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'xray-search-skill',
      input: {
        platform: request.platform,
        keywords: request.keywords,
        location: request.location,
        company: request.company,
        title: request.title,
        skills: request.skills,
        excludeCompanies: request.excludeCompanies,
        excludeKeywords: request.excludeKeywords,
        yearsExperience: request.yearsExperience,
        booleanQuery: request.booleanQuery,
      },
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      throw new Error(`X-Ray search generation failed: ${result.error?.message}`);
    }

    return result.data;
  }

  // ============================================================================
  // AUTOCOMPLETE
  // ============================================================================

  /**
   * AI-powered autocomplete suggestions
   */
  async autocomplete(request: AutocompleteRequest): Promise<AutocompleteResponse> {
    console.log('💡 Generating autocomplete...', request.query);

    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.MULTI_SKILL,
      input: {
        skillIds: [
          'query-completion-skill',
          'entity-suggestion-skill',
          'popular-searches-skill',
        ],
        query: request.query,
        entities: request.entities,
        limit: request.limit || 10,
        includeRecent: request.includeRecent !== false,
        includePopular: request.includePopular !== false,
        userId: request.userId,
      },
      config: {
        parallelExecution: true,
        timeout: 1000, // Fast autocomplete
        preferredProvider: 'openai_gpt', // Faster for autocomplete
      },
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      // Return empty suggestions on error (don't break UX)
      return {
        suggestions: [],
        executionTime: 0,
      };
    }

    // Combine and rank suggestions
    const suggestions = this.combineAutocompleteSuggestions(result.data);

    return {
      suggestions,
      executionTime: result.executionTime,
    };
  }

  // ============================================================================
  // RESULT ENHANCEMENT
  // ============================================================================

  /**
   * Enhance search results with AI insights
   */
  async enhanceResults(
    results: SearchResult[],
    query: string
  ): Promise<SearchResult[]> {
    console.log('✨ Enhancing search results...', {
      resultCount: results.length,
      query,
    });

    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'result-enhancement-skill',
      input: {
        results,
        query,
      },
      config: {
        preferredProvider: 'anthropic_claude',
        cacheResults: true,
        cacheTTL: 600,
      },
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      // Return original results if enhancement fails
      return results;
    }

    return result.data.enhancedResults;
  }

  /**
   * Generate match reason explanations
   */
  async explainMatch(
    result: SearchResult,
    query: string
  ): Promise<string> {
    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'match-explanation-skill',
      input: {
        result,
        query,
      },
      config: {
        preferredProvider: 'anthropic_claude',
        timeout: 2000,
      },
    };

    const response = await this.gateway.orchestrate(orchestrationRequest);

    if (!response.success) {
      return 'Matched based on keyword relevance';
    }

    return response.data.explanation;
  }

  // ============================================================================
  // PERSONALIZATION
  // ============================================================================

  /**
   * Personalize search results based on user preferences and history
   */
  async personalizeResults(
    results: SearchResult[],
    userId: string,
    query: string
  ): Promise<SearchResult[]> {
    console.log('👤 Personalizing results...', {
      userId,
      resultCount: results.length,
    });

    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'search-personalization-skill',
      input: {
        results,
        userId,
        query,
      },
      config: {
        preferredProvider: 'anthropic_claude',
        cacheResults: true,
        cacheTTL: 300,
      },
      userId,
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      return results;
    }

    return result.data.personalizedResults;
  }

  // ============================================================================
  // SPELL CHECK & SUGGESTIONS
  // ============================================================================

  /**
   * AI-powered spellcheck and suggestions
   */
  async spellcheck(query: string): Promise<{
    original: string;
    suggestion: string;
    confidence: number;
  } | null> {
    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'spellcheck-skill',
      input: {
        query,
      },
      config: {
        preferredProvider: 'openai_gpt',
        timeout: 1000,
      },
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success || !result.data.hasSuggestion) {
      return null;
    }

    return {
      original: query,
      suggestion: result.data.suggestion,
      confidence: result.data.confidence,
    };
  }

  // ============================================================================
  // SEARCH ANALYTICS
  // ============================================================================

  /**
   * Analyze search query for insights
   */
  async analyzeQuery(query: string, userId?: string): Promise<{
    intent: string;
    entities: string[];
    complexity: 'simple' | 'moderate' | 'complex';
    suggestedFilters: any[];
  }> {
    const orchestrationRequest: OrchestrationRequest = {
      type: OrchestrationType.SKILL_EXECUTION,
      skillId: 'query-analysis-skill',
      input: {
        query,
      },
      userId,
    };

    const result = await this.gateway.orchestrate(orchestrationRequest);

    if (!result.success) {
      return {
        intent: 'search',
        entities: [],
        complexity: 'simple',
        suggestedFilters: [],
      };
    }

    return result.data;
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private buildSearchResponse(
    data: any,
    query: string,
    mode: SearchMode
  ): SearchResponse {
    return {
      results: data.results || [],
      totalCount: data.totalCount || 0,
      query,
      mode,
      executionTime: data.executionTime || 0,
      limit: data.limit || 20,
      offset: data.offset || 0,
      hasMore: data.hasMore || false,
      highlights: data.highlights,
      facets: data.facets,
      suggestions: data.suggestions,
      spellcheck: data.spellcheck,
      searchId: data.searchId || this.generateSearchId(),
      timestamp: new Date(),
    };
  }

  private combineAutocompleteSuggestions(data: any): any[] {
    const allSuggestions: any[] = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach((skillResult: any) => {
        if (skillResult.data && Array.isArray(skillResult.data.suggestions)) {
          allSuggestions.push(...skillResult.data.suggestions);
        }
      });
    }

    // Deduplicate and sort by score
    const uniqueSuggestions = this.deduplicateSuggestions(allSuggestions);

    return uniqueSuggestions
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 10);
  }

  private deduplicateSuggestions(suggestions: any[]): any[] {
    const seen = new Set<string>();
    return suggestions.filter(s => {
      const key = s.text.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private generateSearchId(): string {
    return `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default SearchAIIntegration;
