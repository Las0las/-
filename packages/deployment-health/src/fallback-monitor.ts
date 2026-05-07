export interface FallbackMonitorInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class FallbackMonitor {
  execute(input: FallbackMonitorInput): FallbackMonitorInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'FallbackMonitor' } };
  }
}
