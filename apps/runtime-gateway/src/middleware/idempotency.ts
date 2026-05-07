export interface RuntimeContext {
  tenantId: string;
  actorId?: string;
  traceId?: string;
  metadata?: Record<string, unknown>;
}

export function applyIdempotencyKey(context: RuntimeContext): RuntimeContext {
  return { ...context, metadata: { ...(context.metadata ?? {}), component: 'applyIdempotencyKey' } };
}
