import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  Node,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useWorkflowStore } from './store';
import { WorkflowEngine } from './engine';
import { CustomNode } from './components/CustomNode';
import { Sidebar } from './components/Sidebar';
import { NodeEditor } from './components/NodeEditor';
import { ExecutionPanel } from './components/ExecutionPanel';

import './App.css';

const nodeTypes: NodeTypes = {
  trigger: CustomNode,
  action: CustomNode,
  condition: CustomNode,
  boolean: CustomNode,
  operator: CustomNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const AppContent: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    selectedNode,
    executionContext,
    isExecuting,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNode,
    setSelectedNode,
    clearWorkflow,
    loadWorkflow,
    addLog,
    setIsExecuting,
    clearLogs,
  } = useWorkflowStore();

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');

      if (!data || !reactFlowBounds) return;

      const { type, label } = JSON.parse(data);
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const handleAddNode = useCallback(
    (type: string, label: string) => {
      const position = {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      };

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const handleSaveWorkflow = useCallback(() => {
    const workflow = {
      nodes,
      edges,
    };
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleLoadWorkflow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string);
            loadWorkflow(workflow.nodes, workflow.edges);
          } catch (error) {
            console.error('Failed to load workflow:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [loadWorkflow]);

  const handleExecute = useCallback(async () => {
    clearLogs();
    setIsExecuting(true);

    try {
      const engine = new WorkflowEngine(nodes, edges, addLog);
      await engine.execute();
    } catch (error: any) {
      addLog('system', `Execution failed: ${error.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, addLog, setIsExecuting, clearLogs]);

  return (
    <div className="app">
      <Sidebar
        onAddNode={handleAddNode}
        onClear={clearWorkflow}
        onSave={handleSaveWorkflow}
        onLoad={handleLoadWorkflow}
      />

      <div className="flow-container" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const colors: Record<string, string> = {
                trigger: '#10b981',
                action: '#3b82f6',
                condition: '#f59e0b',
                boolean: '#8b5cf6',
                operator: '#ec4899',
              };
              return colors[node.type || 'action'] || '#3b82f6';
            }}
          />
        </ReactFlow>
      </div>

      {selectedNode ? (
        <NodeEditor
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onUpdate={updateNode}
        />
      ) : (
        <ExecutionPanel
          logs={executionContext.logs}
          isExecuting={isExecuting}
          onExecute={handleExecute}
          onClearLogs={clearLogs}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
};

export default App;
