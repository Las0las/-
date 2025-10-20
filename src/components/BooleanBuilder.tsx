import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BooleanExpression, BooleanOperator, Condition } from '../types';
import './BooleanBuilder.css';

interface BooleanBuilderProps {
  expression?: BooleanExpression;
  onChange: (expression: BooleanExpression) => void;
}

export const BooleanBuilder: React.FC<BooleanBuilderProps> = ({ expression, onChange }) => {
  const [currentExpression, setCurrentExpression] = useState<BooleanExpression>(
    expression || {
      type: 'operator',
      operator: 'AND',
      operands: [],
    }
  );

  const handleOperatorChange = (operator: BooleanOperator) => {
    const updated = { ...currentExpression, operator };
    setCurrentExpression(updated);
    onChange(updated);
  };

  const addOperand = (type: 'value' | 'condition' | 'operator') => {
    const newOperand: BooleanExpression = type === 'value'
      ? { type: 'value', value: true }
      : type === 'condition'
      ? {
          type: 'condition',
          condition: {
            leftOperand: '',
            operator: 'equals',
            rightOperand: '',
          },
        }
      : {
          type: 'operator',
          operator: 'AND',
          operands: [],
        };

    const updated = {
      ...currentExpression,
      operands: [...(currentExpression.operands || []), newOperand],
    };
    setCurrentExpression(updated);
    onChange(updated);
  };

  const removeOperand = (index: number) => {
    const updated = {
      ...currentExpression,
      operands: currentExpression.operands?.filter((_, i) => i !== index) || [],
    };
    setCurrentExpression(updated);
    onChange(updated);
  };

  const updateOperand = (index: number, operand: BooleanExpression) => {
    const updated = {
      ...currentExpression,
      operands: currentExpression.operands?.map((op, i) => (i === index ? operand : op)) || [],
    };
    setCurrentExpression(updated);
    onChange(updated);
  };

  return (
    <div className="boolean-builder">
      <div className="form-group">
        <label>Boolean Operator</label>
        <div className="operator-buttons">
          {(['AND', 'OR', 'NOT', 'XOR'] as BooleanOperator[]).map((op) => (
            <button
              key={op}
              className={`operator-button ${currentExpression.operator === op ? 'active' : ''}`}
              onClick={() => handleOperatorChange(op)}
            >
              {op}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Operands</label>
        <div className="operands-list">
          {currentExpression.operands?.map((operand, index) => (
            <div key={index} className="operand-item">
              <div className="operand-header">
                <span className="operand-type">{operand.type}</span>
                <button
                  className="remove-operand"
                  onClick={() => removeOperand(index)}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {operand.type === 'value' && (
                <input
                  type="checkbox"
                  checked={operand.value || false}
                  onChange={(e) =>
                    updateOperand(index, { ...operand, value: e.target.checked })
                  }
                />
              )}

              {operand.type === 'condition' && operand.condition && (
                <div className="condition-inputs">
                  <input
                    type="text"
                    value={operand.condition.leftOperand}
                    onChange={(e) =>
                      updateOperand(index, {
                        ...operand,
                        condition: { ...operand.condition!, leftOperand: e.target.value },
                      })
                    }
                    placeholder="Left value"
                  />
                  <select
                    value={operand.condition.operator}
                    onChange={(e) =>
                      updateOperand(index, {
                        ...operand,
                        condition: { ...operand.condition!, operator: e.target.value as any },
                      })
                    }
                  >
                    <option value="equals">=</option>
                    <option value="notEquals">!=</option>
                    <option value="greaterThan">&gt;</option>
                    <option value="lessThan">&lt;</option>
                    <option value="greaterOrEqual">&gt;=</option>
                    <option value="lessOrEqual">&lt;=</option>
                    <option value="contains">contains</option>
                    <option value="startsWith">starts with</option>
                    <option value="endsWith">ends with</option>
                  </select>
                  <input
                    type="text"
                    value={operand.condition.rightOperand}
                    onChange={(e) =>
                      updateOperand(index, {
                        ...operand,
                        condition: { ...operand.condition!, rightOperand: e.target.value },
                      })
                    }
                    placeholder="Right value"
                  />
                </div>
              )}

              {operand.type === 'operator' && (
                <div className="nested-operator">
                  <BooleanBuilder
                    expression={operand}
                    onChange={(updated) => updateOperand(index, updated)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="add-operand-buttons">
          <button className="add-button" onClick={() => addOperand('value')}>
            <Plus size={14} />
            Add Value
          </button>
          <button className="add-button" onClick={() => addOperand('condition')}>
            <Plus size={14} />
            Add Condition
          </button>
          <button className="add-button" onClick={() => addOperand('operator')}>
            <Plus size={14} />
            Add Group
          </button>
        </div>
      </div>
    </div>
  );
};
