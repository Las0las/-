// Node Types
export type NodeType = 'trigger' | 'action' | 'condition' | 'boolean' | 'operator';

export interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

export interface NodeData {
  label: string;
  config?: any;
  // For operator nodes
  operatorType?: OperatorType;
  operatorConfig?: OperatorConfig;
  // For boolean nodes
  booleanExpression?: BooleanExpression;
  // For condition nodes
  condition?: Condition;
  // For action nodes
  actionType?: string;
  actionConfig?: any;
}

// Boolean Logic Types
export type BooleanOperator = 'AND' | 'OR' | 'NOT' | 'XOR';

export interface BooleanExpression {
  type: 'operator' | 'condition' | 'value';
  operator?: BooleanOperator;
  operands?: BooleanExpression[];
  condition?: Condition;
  value?: boolean;
}

// Condition Types
export type ComparisonOperator =
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterOrEqual'
  | 'lessOrEqual'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'matches';

export interface Condition {
  leftOperand: string | number | boolean;
  operator: ComparisonOperator;
  rightOperand: string | number | boolean;
}

// Advanced Operator Types
export type OperatorType =
  | 'math'
  | 'string'
  | 'array'
  | 'date'
  | 'logic'
  | 'transform';

export interface OperatorConfig {
  operation: string;
  inputs: Record<string, any>;
  output?: string;
}

// Math Operations
export type MathOperation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'modulo'
  | 'power'
  | 'sqrt'
  | 'abs'
  | 'round'
  | 'floor'
  | 'ceil'
  | 'min'
  | 'max'
  | 'random';

// String Operations
export type StringOperation =
  | 'concat'
  | 'substring'
  | 'replace'
  | 'split'
  | 'join'
  | 'toUpperCase'
  | 'toLowerCase'
  | 'trim'
  | 'length'
  | 'indexOf'
  | 'slice';

// Array Operations
export type ArrayOperation =
  | 'push'
  | 'pop'
  | 'shift'
  | 'unshift'
  | 'slice'
  | 'splice'
  | 'filter'
  | 'map'
  | 'reduce'
  | 'find'
  | 'sort'
  | 'reverse'
  | 'length'
  | 'includes'
  | 'indexOf'
  | 'join';

// Date Operations
export type DateOperation =
  | 'now'
  | 'addDays'
  | 'subtractDays'
  | 'format'
  | 'parse'
  | 'getDay'
  | 'getMonth'
  | 'getYear'
  | 'getHour'
  | 'getMinute'
  | 'diff';

// Workflow Edge
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
}

// Workflow
export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

// Execution Context
export interface ExecutionContext {
  variables: Record<string, any>;
  results: Record<string, any>;
  logs: ExecutionLog[];
}

export interface ExecutionLog {
  timestamp: Date;
  nodeId: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  data?: any;
}
