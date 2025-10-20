import React, { useState, useEffect } from 'react';
import { Condition, ComparisonOperator } from '../types';
import './ConditionConfig.css';

interface ConditionConfigProps {
  condition?: Condition;
  onChange: (condition: Condition) => void;
}

export const ConditionConfig: React.FC<ConditionConfigProps> = ({ condition, onChange }) => {
  const [leftOperand, setLeftOperand] = useState<string>(
    condition?.leftOperand?.toString() || ''
  );
  const [operator, setOperator] = useState<ComparisonOperator>(condition?.operator || 'equals');
  const [rightOperand, setRightOperand] = useState<string>(
    condition?.rightOperand?.toString() || ''
  );

  useEffect(() => {
    if (condition) {
      setLeftOperand(condition.leftOperand?.toString() || '');
      setOperator(condition.operator);
      setRightOperand(condition.rightOperand?.toString() || '');
    }
  }, [condition]);

  const handleUpdate = (
    left: string,
    op: ComparisonOperator,
    right: string
  ) => {
    onChange({
      leftOperand: left,
      operator: op,
      rightOperand: right,
    });
  };

  return (
    <div className="condition-config">
      <div className="form-group">
        <label>Left Operand</label>
        <input
          type="text"
          value={leftOperand}
          onChange={(e) => {
            setLeftOperand(e.target.value);
            handleUpdate(e.target.value, operator, rightOperand);
          }}
          placeholder="Variable name or value (use $ for variables)"
        />
      </div>

      <div className="form-group">
        <label>Operator</label>
        <select
          value={operator}
          onChange={(e) => {
            const newOp = e.target.value as ComparisonOperator;
            setOperator(newOp);
            handleUpdate(leftOperand, newOp, rightOperand);
          }}
        >
          <option value="equals">Equals (=)</option>
          <option value="notEquals">Not Equals (!=)</option>
          <option value="greaterThan">Greater Than (&gt;)</option>
          <option value="lessThan">Less Than (&lt;)</option>
          <option value="greaterOrEqual">Greater or Equal (&gt;=)</option>
          <option value="lessOrEqual">Less or Equal (&lt;=)</option>
          <option value="contains">Contains</option>
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
          <option value="matches">Matches (regex)</option>
        </select>
      </div>

      <div className="form-group">
        <label>Right Operand</label>
        <input
          type="text"
          value={rightOperand}
          onChange={(e) => {
            setRightOperand(e.target.value);
            handleUpdate(leftOperand, operator, e.target.value);
          }}
          placeholder="Variable name or value (use $ for variables)"
        />
      </div>

      <div className="condition-preview">
        <strong>Preview:</strong> {leftOperand || '...'} {operator} {rightOperand || '...'}
      </div>
    </div>
  );
};
