export interface RouterCollapseDetectorInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class RouterCollapseDetector {
  execute(input: RouterCollapseDetectorInput): RouterCollapseDetectorInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'RouterCollapseDetector' } };
  }
}
