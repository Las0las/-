export interface FallbackOrchestrationInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class FallbackOrchestration {
  execute(input: FallbackOrchestrationInput): FallbackOrchestrationInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'FallbackOrchestration' } };
  }
}
