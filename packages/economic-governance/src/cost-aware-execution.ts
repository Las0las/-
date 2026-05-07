export interface CostAwareExecutionInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class CostAwareExecution {
  execute(input: CostAwareExecutionInput): CostAwareExecutionInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'CostAwareExecution' } };
  }
}
