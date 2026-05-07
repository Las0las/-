export interface EvidenceMemoryInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class EvidenceMemory {
  execute(input: EvidenceMemoryInput): EvidenceMemoryInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'EvidenceMemory' } };
  }
}
