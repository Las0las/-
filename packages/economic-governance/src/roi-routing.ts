export interface RoiRoutingInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class RoiRouting {
  execute(input: RoiRoutingInput): RoiRoutingInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'RoiRouting' } };
  }
}
