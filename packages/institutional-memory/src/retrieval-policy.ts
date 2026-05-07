export interface RetrievalPolicyInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class RetrievalPolicy {
  execute(input: RetrievalPolicyInput): RetrievalPolicyInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'RetrievalPolicy' } };
  }
}
