export interface AnomalyContract {
  id: string;
  version: string;
  tenantId?: string;
  traceId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}
