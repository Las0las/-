export interface EventReconstructorInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class EventReconstructor {
  execute(input: EventReconstructorInput): EventReconstructorInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'EventReconstructor' } };
  }
}
