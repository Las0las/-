export interface RuntimeAdmissionInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class RuntimeAdmission {
  execute(input: RuntimeAdmissionInput): RuntimeAdmissionInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'RuntimeAdmission' } };
  }
}
