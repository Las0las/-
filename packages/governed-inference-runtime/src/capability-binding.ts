export interface CapabilityBindingInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class CapabilityBinding {
  execute(input: CapabilityBindingInput): CapabilityBindingInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'CapabilityBinding' } };
  }
}
