import React from 'react';
import { Zap, Play, GitBranch, Binary, Calculator, Save, Upload, Trash2 } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  onAddNode: (type: string, label: string) => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: () => void;
}

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: '#10b981', description: 'Start workflow' },
  { type: 'action', label: 'Action', icon: Play, color: '#3b82f6', description: 'Execute action' },
  { type: 'condition', label: 'Condition', icon: GitBranch, color: '#f59e0b', description: 'Conditional branch' },
  { type: 'boolean', label: 'Boolean Logic', icon: Binary, color: '#8b5cf6', description: 'AND/OR/NOT logic' },
  { type: 'operator', label: 'Operator', icon: Calculator, color: '#ec4899', description: 'Math/String/Array ops' },
];

export const Sidebar: React.FC<SidebarProps> = ({ onAddNode, onClear, onSave, onLoad }) => {
  const handleDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Workflow Nodes</h2>
      </div>

      <div className="sidebar-section">
        <h3>Drag to canvas</h3>
        <div className="node-list">
          {nodeTypes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="node-item"
                draggable
                onDragStart={(e) => handleDragStart(e, node.type, node.label)}
                onClick={() => onAddNode(node.type, node.label)}
              >
                <div className="node-item-icon" style={{ background: node.color }}>
                  <Icon size={20} />
                </div>
                <div className="node-item-content">
                  <div className="node-item-label">{node.label}</div>
                  <div className="node-item-description">{node.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Workflow Actions</h3>
        <div className="action-buttons">
          <button className="action-button" onClick={onSave}>
            <Save size={16} />
            Save Workflow
          </button>
          <button className="action-button" onClick={onLoad}>
            <Upload size={16} />
            Load Workflow
          </button>
          <button className="action-button danger" onClick={onClear}>
            <Trash2 size={16} />
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
