export interface PolicyGateInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class PolicyGate {
  execute(input: PolicyGateInput): PolicyGateInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'PolicyGate' } };
  }
}
