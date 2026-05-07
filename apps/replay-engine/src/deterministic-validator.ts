export interface DeterministicValidatorInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class DeterministicValidator {
  execute(input: DeterministicValidatorInput): DeterministicValidatorInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'DeterministicValidator' } };
  }
}
