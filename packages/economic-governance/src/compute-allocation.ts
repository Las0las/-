export interface ComputeAllocationInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ComputeAllocation {
  execute(input: ComputeAllocationInput): ComputeAllocationInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ComputeAllocation' } };
  }
}
