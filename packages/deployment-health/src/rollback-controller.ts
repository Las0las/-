export interface RollbackControllerInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class RollbackController {
  execute(input: RollbackControllerInput): RollbackControllerInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'RollbackController' } };
  }
}
