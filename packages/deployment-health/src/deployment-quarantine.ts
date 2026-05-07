export interface DeploymentQuarantineInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class DeploymentQuarantine {
  execute(input: DeploymentQuarantineInput): DeploymentQuarantineInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'DeploymentQuarantine' } };
  }
}
