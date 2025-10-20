import { Node, Edge } from 'reactflow';
import { ExecutionContext } from './types';
import { executeOperator, evaluateBooleanExpression, evaluateCondition } from './operators';

export class WorkflowEngine {
  private nodes: Node[];
  private edges: Edge[];
  private context: ExecutionContext;
  private onLog: (nodeId: string, message: string, level?: 'info' | 'warning' | 'error', data?: any) => void;

  constructor(
    nodes: Node[],
    edges: Edge[],
    onLog: (nodeId: string, message: string, level?: 'info' | 'warning' | 'error', data?: any) => void
  ) {
    this.nodes = nodes;
    this.edges = edges;
    this.onLog = onLog;
    this.context = {
      variables: {},
      results: {},
      logs: [],
    };
  }

  async execute(): Promise<ExecutionContext> {
    this.log('workflow', 'Starting workflow execution', 'info');

    // Find trigger nodes (nodes with no incoming edges)
    const triggerNodes = this.nodes.filter(
      (node) => !this.edges.some((edge) => edge.target === node.id)
    );

    if (triggerNodes.length === 0) {
      this.log('workflow', 'No trigger nodes found', 'error');
      throw new Error('Workflow must have at least one trigger node');
    }

    // Execute from each trigger
    for (const trigger of triggerNodes) {
      await this.executeNode(trigger);
    }

    this.log('workflow', 'Workflow execution completed', 'info');
    return this.context;
  }

  private async executeNode(node: Node): Promise<any> {
    this.log(node.id, `Executing node: ${node.data.label}`, 'info');

    let result: any;

    try {
      switch (node.type) {
        case 'trigger':
          result = await this.executeTrigger(node);
          break;
        case 'action':
          result = await this.executeAction(node);
          break;
        case 'condition':
          result = await this.executeCondition(node);
          break;
        case 'boolean':
          result = await this.executeBoolean(node);
          break;
        case 'operator':
          result = await this.executeOperatorNode(node);
          break;
        default:
          this.log(node.id, `Unknown node type: ${node.type}`, 'warning');
          result = null;
      }

      // Store result
      this.context.results[node.id] = result;
      this.context.variables[node.data.label] = result;

      this.log(node.id, `Node completed with result: ${JSON.stringify(result)}`, 'info', result);

      // Execute next nodes
      await this.executeNextNodes(node, result);

      return result;
    } catch (error: any) {
      this.log(node.id, `Error executing node: ${error.message}`, 'error', error);
      throw error;
    }
  }

  private async executeTrigger(node: Node): Promise<any> {
    // Trigger nodes start the workflow
    // Initialize variables from trigger config
    if (node.data.config && node.data.config.variables) {
      Object.assign(this.context.variables, node.data.config.variables);
    }
    return { triggered: true, timestamp: new Date() };
  }

  private async executeAction(node: Node): Promise<any> {
    // Execute action based on actionType
    const { actionType, actionConfig } = node.data;

    this.log(node.id, `Executing action: ${actionType}`, 'info');

    // Simulate action execution
    switch (actionType) {
      case 'log':
        console.log('Action Log:', actionConfig?.message || 'No message');
        return { logged: true, message: actionConfig?.message };

      case 'setVariable':
        this.context.variables[actionConfig?.name] = actionConfig?.value;
        return { set: true, name: actionConfig?.name, value: actionConfig?.value };

      case 'transform':
        return actionConfig?.transform || null;

      default:
        return { actionType, config: actionConfig };
    }
  }

  private async executeCondition(node: Node): Promise<boolean> {
    const { condition } = node.data;

    if (!condition) {
      this.log(node.id, 'No condition configured', 'warning');
      return false;
    }

    const result = evaluateCondition(condition, this.context.variables);
    this.log(node.id, `Condition evaluated to: ${result}`, 'info');
    return result;
  }

  private async executeBoolean(node: Node): Promise<boolean> {
    const { booleanExpression } = node.data;

    if (!booleanExpression) {
      this.log(node.id, 'No boolean expression configured', 'warning');
      return false;
    }

    const result = evaluateBooleanExpression(booleanExpression, this.context.variables);
    this.log(node.id, `Boolean expression evaluated to: ${result}`, 'info');
    return result;
  }

  private async executeOperatorNode(node: Node): Promise<any> {
    const { operatorConfig } = node.data;

    if (!operatorConfig) {
      this.log(node.id, 'No operator configuration found', 'warning');
      return null;
    }

    const result = executeOperator(operatorConfig, this.context.variables);

    // Store in output variable if specified
    if (operatorConfig.output) {
      this.context.variables[operatorConfig.output] = result;
    }

    return result;
  }

  private async executeNextNodes(currentNode: Node, currentResult: any): Promise<void> {
    // Find outgoing edges
    const outgoingEdges = this.edges.filter((edge) => edge.source === currentNode.id);

    for (const edge of outgoingEdges) {
      // Check edge conditions (for conditional branching)
      let shouldExecute = true;

      // If current node is a condition or boolean, check the result
      if (currentNode.type === 'condition' || currentNode.type === 'boolean') {
        // If edge has a label like "true" or "false", check against result
        if (edge.label === 'true' && !currentResult) {
          shouldExecute = false;
        } else if (edge.label === 'false' && currentResult) {
          shouldExecute = false;
        }
      }

      if (shouldExecute) {
        const nextNode = this.nodes.find((n) => n.id === edge.target);
        if (nextNode) {
          await this.executeNode(nextNode);
        }
      }
    }
  }

  private log(
    nodeId: string,
    message: string,
    level: 'info' | 'warning' | 'error' = 'info',
    data?: any
  ): void {
    this.onLog(nodeId, message, level, data);
  }

  getContext(): ExecutionContext {
    return this.context;
  }
}
