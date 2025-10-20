import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play, Zap, GitBranch, Binary, Calculator } from 'lucide-react';
import './CustomNode.css';

const nodeIcons = {
  trigger: Zap,
  action: Play,
  condition: GitBranch,
  boolean: Binary,
  operator: Calculator,
};

const nodeColors = {
  trigger: '#10b981',
  action: '#3b82f6',
  condition: '#f59e0b',
  boolean: '#8b5cf6',
  operator: '#ec4899',
};

export const CustomNode: React.FC<NodeProps> = ({ data, type, selected }) => {
  const Icon = nodeIcons[type as keyof typeof nodeIcons] || Play;
  const color = nodeColors[type as keyof typeof nodeColors] || '#3b82f6';

  return (
    <div
      className="custom-node"
      style={{
        borderColor: selected ? color : '#333',
        boxShadow: selected ? `0 0 0 2px ${color}` : 'none'
      }}
    >
      <Handle type="target" position={Position.Top} className="custom-handle" />

      <div className="node-header" style={{ background: color }}>
        <Icon size={16} />
        <span className="node-type">{type}</span>
      </div>

      <div className="node-body">
        <div className="node-label">{data.label}</div>

        {data.operatorType && (
          <div className="node-detail">
            {data.operatorConfig?.operation || data.operatorType}
          </div>
        )}

        {data.actionType && (
          <div className="node-detail">{data.actionType}</div>
        )}

        {data.condition && (
          <div className="node-detail">
            {`${data.condition.leftOperand} ${data.condition.operator} ${data.condition.rightOperand}`}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="custom-handle" />
    </div>
  );
};
