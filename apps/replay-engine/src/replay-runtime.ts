export interface ReplayRuntimeInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ReplayRuntime {
  execute(input: ReplayRuntimeInput): ReplayRuntimeInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ReplayRuntime' } };
  }
}
