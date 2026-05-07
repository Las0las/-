export interface RegistryServiceInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class RegistryService {
  execute(input: RegistryServiceInput): RegistryServiceInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'RegistryService' } };
  }
}
