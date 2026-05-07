export interface ExecutionPolicyInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ExecutionPolicy {
  execute(input: ExecutionPolicyInput): ExecutionPolicyInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ExecutionPolicy' } };
  }
}
