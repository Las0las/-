export interface MemoryRuntimeInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class MemoryRuntime {
  execute(input: MemoryRuntimeInput): MemoryRuntimeInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'MemoryRuntime' } };
  }
}
