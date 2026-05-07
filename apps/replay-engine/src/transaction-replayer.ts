export interface TransactionReplayerInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class TransactionReplayer {
  execute(input: TransactionReplayerInput): TransactionReplayerInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'TransactionReplayer' } };
  }
}
