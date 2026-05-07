export interface AdmissionControllerInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class AdmissionController {
  execute(input: AdmissionControllerInput): AdmissionControllerInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'AdmissionController' } };
  }
}
