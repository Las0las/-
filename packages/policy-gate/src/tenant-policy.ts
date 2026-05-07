export interface TenantPolicyInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class TenantPolicy {
  execute(input: TenantPolicyInput): TenantPolicyInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'TenantPolicy' } };
  }
}
