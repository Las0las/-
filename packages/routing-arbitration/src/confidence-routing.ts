export interface ConfidenceRoutingInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ConfidenceRouting {
  execute(input: ConfidenceRoutingInput): ConfidenceRoutingInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ConfidenceRouting' } };
  }
}
