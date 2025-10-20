import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { X } from 'lucide-react';
import { BooleanBuilder } from './BooleanBuilder';
import { OperatorConfig } from './OperatorConfig';
import { ConditionConfig } from './ConditionConfig';
import './NodeEditor.css';

interface NodeEditorProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

export const NodeEditor: React.FC<NodeEditorProps> = ({ node, onClose, onUpdate }) => {
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (node) {
      setLabel(node.data.label || '');
    }
  }, [node]);

  if (!node) return null;

  const handleSave = () => {
    onUpdate(node.id, { ...node.data, label });
  };

  const handleDataUpdate = (updates: any) => {
    onUpdate(node.id, { ...node.data, ...updates });
  };

  return (
    <div className="node-editor">
      <div className="node-editor-header">
        <h3>Edit {node.type} Node</h3>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="node-editor-content">
        <div className="form-group">
          <label>Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSave}
            placeholder="Node label"
          />
        </div>

        {node.type === 'boolean' && (
          <BooleanBuilder
            expression={node.data.booleanExpression}
            onChange={(expression) => handleDataUpdate({ booleanExpression: expression })}
          />
        )}

        {node.type === 'operator' && (
          <OperatorConfig
            config={node.data.operatorConfig}
            onChange={(config) => handleDataUpdate({ operatorConfig: config })}
          />
        )}

        {node.type === 'condition' && (
          <ConditionConfig
            condition={node.data.condition}
            onChange={(condition) => handleDataUpdate({ condition })}
          />
        )}

        {node.type === 'action' && (
          <div className="form-group">
            <label>Action Type</label>
            <select
              value={node.data.actionType || 'log'}
              onChange={(e) => handleDataUpdate({ actionType: e.target.value })}
            >
              <option value="log">Log</option>
              <option value="setVariable">Set Variable</option>
              <option value="transform">Transform</option>
            </select>

            {node.data.actionType === 'log' && (
              <div className="form-group">
                <label>Message</label>
                <input
                  type="text"
                  value={node.data.actionConfig?.message || ''}
                  onChange={(e) =>
                    handleDataUpdate({
                      actionConfig: { ...node.data.actionConfig, message: e.target.value },
                    })
                  }
                  placeholder="Log message"
                />
              </div>
            )}

            {node.data.actionType === 'setVariable' && (
              <>
                <div className="form-group">
                  <label>Variable Name</label>
                  <input
                    type="text"
                    value={node.data.actionConfig?.name || ''}
                    onChange={(e) =>
                      handleDataUpdate({
                        actionConfig: { ...node.data.actionConfig, name: e.target.value },
                      })
                    }
                    placeholder="Variable name"
                  />
                </div>
                <div className="form-group">
                  <label>Value</label>
                  <input
                    type="text"
                    value={node.data.actionConfig?.value || ''}
                    onChange={(e) =>
                      handleDataUpdate({
                        actionConfig: { ...node.data.actionConfig, value: e.target.value },
                      })
                    }
                    placeholder="Value"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {node.type === 'trigger' && (
          <div className="form-group">
            <label>Initial Variables (JSON)</label>
            <textarea
              value={JSON.stringify(node.data.config?.variables || {}, null, 2)}
              onChange={(e) => {
                try {
                  const variables = JSON.parse(e.target.value);
                  handleDataUpdate({ config: { variables } });
                } catch (error) {
                  // Invalid JSON, ignore
                }
              }}
              placeholder='{"variable": "value"}'
              rows={6}
            />
          </div>
        )}
      </div>
    </div>
  );
};
