export interface AnomalyLineageInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class AnomalyLineage {
  execute(input: AnomalyLineageInput): AnomalyLineageInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'AnomalyLineage' } };
  }
}
