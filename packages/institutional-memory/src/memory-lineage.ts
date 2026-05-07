export interface MemoryLineageInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class MemoryLineage {
  execute(input: MemoryLineageInput): MemoryLineageInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'MemoryLineage' } };
  }
}
