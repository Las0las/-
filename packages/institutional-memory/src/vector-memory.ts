export interface VectorMemoryInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class VectorMemory {
  execute(input: VectorMemoryInput): VectorMemoryInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'VectorMemory' } };
  }
}
