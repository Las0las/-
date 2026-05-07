export interface HealthBindingInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class HealthBinding {
  execute(input: HealthBindingInput): HealthBindingInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'HealthBinding' } };
  }
}
