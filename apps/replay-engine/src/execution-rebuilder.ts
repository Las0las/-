export interface ExecutionRebuilderInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ExecutionRebuilder {
  execute(input: ExecutionRebuilderInput): ExecutionRebuilderInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ExecutionRebuilder' } };
  }
}
