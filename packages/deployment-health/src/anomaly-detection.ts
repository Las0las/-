export interface AnomalyDetectionInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class AnomalyDetection {
  execute(input: AnomalyDetectionInput): AnomalyDetectionInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'AnomalyDetection' } };
  }
}
