export interface PiiPolicyInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class PiiPolicy {
  execute(input: PiiPolicyInput): PiiPolicyInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'PiiPolicy' } };
  }
}
