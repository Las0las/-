export interface ReplaySafeRuntimeInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ReplaySafeRuntime {
  execute(input: ReplaySafeRuntimeInput): ReplaySafeRuntimeInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ReplaySafeRuntime' } };
  }
}
