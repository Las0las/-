import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { WorkflowNode, WorkflowEdge, ExecutionContext } from './types';

interface WorkflowStore {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  executionContext: ExecutionContext;
  isExecuting: boolean;

  // Node operations
  setNodes: (nodes: Node[]) => void;
  onNodesChange: (changes: any) => void;
  addNode: (node: Node) => void;
  updateNode: (nodeId: string, data: any) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (node: Node | null) => void;

  // Edge operations
  setEdges: (edges: Edge[]) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  deleteEdge: (edgeId: string) => void;

  // Workflow operations
  clearWorkflow: () => void;
  loadWorkflow: (nodes: Node[], edges: Edge[]) => void;

  // Execution
  setExecutionContext: (context: ExecutionContext) => void;
  addLog: (nodeId: string, message: string, level?: 'info' | 'warning' | 'error', data?: any) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  clearLogs: () => void;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  executionContext: {
    variables: {},
    results: {},
    logs: [],
  },
  isExecuting: false,

  setNodes: (nodes) => set({ nodes }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  addNode: (node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  updateNode: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    });
  },

  setSelectedNode: (node) => set({ selectedNode: node }),

  setEdges: (edges) => set({ edges }),

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, type: 'smoothstep', animated: true }, get().edges),
    });
  },

  deleteEdge: (edgeId) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
  },

  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
    });
  },

  loadWorkflow: (nodes, edges) => {
    set({ nodes, edges });
  },

  setExecutionContext: (context) => set({ executionContext: context }),

  addLog: (nodeId, message, level = 'info', data) => {
    set({
      executionContext: {
        ...get().executionContext,
        logs: [
          ...get().executionContext.logs,
          {
            timestamp: new Date(),
            nodeId,
            message,
            level,
            data,
          },
        ],
      },
    });
  },

  setIsExecuting: (isExecuting) => set({ isExecuting }),

  clearLogs: () => {
    set({
      executionContext: {
        ...get().executionContext,
        logs: [],
      },
    });
  },
}));
