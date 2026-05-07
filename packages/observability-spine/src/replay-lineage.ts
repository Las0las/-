export interface ReplayLineageInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ReplayLineage {
  execute(input: ReplayLineageInput): ReplayLineageInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ReplayLineage' } };
  }
}
