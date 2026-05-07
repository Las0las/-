export interface TransactionLineageInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class TransactionLineage {
  execute(input: TransactionLineageInput): TransactionLineageInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'TransactionLineage' } };
  }
}
