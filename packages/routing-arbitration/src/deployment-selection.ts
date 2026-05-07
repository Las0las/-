export interface DeploymentSelectionInput {
  id: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
}

export class DeploymentSelection {
  execute(input: DeploymentSelectionInput): DeploymentSelectionInput {
    return { ...input, metadata: { ...(input.metadata ?? {}), component: 'DeploymentSelection' } };
  }
}
