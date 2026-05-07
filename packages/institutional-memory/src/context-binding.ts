export interface ContextBindingInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ContextBinding {
  execute(input: ContextBindingInput): ContextBindingInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ContextBinding' } };
  }
}
