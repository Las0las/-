export interface WorkloadPolicyInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class WorkloadPolicy {
  execute(input: WorkloadPolicyInput): WorkloadPolicyInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'WorkloadPolicy' } };
  }
}
