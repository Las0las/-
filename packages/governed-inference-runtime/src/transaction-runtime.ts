export interface TransactionRuntimeInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class TransactionRuntime {
  execute(input: TransactionRuntimeInput): TransactionRuntimeInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'TransactionRuntime' } };
  }
}
