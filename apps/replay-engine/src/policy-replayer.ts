export interface PolicyReplayerInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class PolicyReplayer {
  execute(input: PolicyReplayerInput): PolicyReplayerInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'PolicyReplayer' } };
  }
}
