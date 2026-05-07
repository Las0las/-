export interface SafetyPolicyInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class SafetyPolicy {
  execute(input: SafetyPolicyInput): SafetyPolicyInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'SafetyPolicy' } };
  }
}
