export interface ManifestValidatorInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class ManifestValidator {
  execute(input: ManifestValidatorInput): ManifestValidatorInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'ManifestValidator' } };
  }
}
