export interface CapabilityResolverInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class CapabilityResolver {
  execute(input: CapabilityResolverInput): CapabilityResolverInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'CapabilityResolver' } };
  }
}
