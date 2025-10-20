import React, { useState, useEffect } from 'react';
import { OperatorConfig as OperatorConfigType } from '../types';
import './OperatorConfig.css';

interface OperatorConfigProps {
  config?: OperatorConfigType;
  onChange: (config: OperatorConfigType) => void;
}

const operatorCategories = {
  math: ['add', 'subtract', 'multiply', 'divide', 'modulo', 'power', 'sqrt', 'abs', 'round', 'floor', 'ceil', 'min', 'max', 'random'],
  string: ['concat', 'substring', 'replace', 'split', 'join', 'toUpperCase', 'toLowerCase', 'trim', 'length', 'indexOf', 'slice'],
  array: ['push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'filter', 'map', 'reduce', 'find', 'sort', 'reverse', 'length', 'includes', 'indexOf', 'join'],
  date: ['now', 'addDays', 'subtractDays', 'format', 'parse', 'getDay', 'getMonth', 'getYear', 'getHour', 'getMinute', 'diff'],
};

const operationInputs: Record<string, string[]> = {
  add: ['a', 'b'],
  subtract: ['a', 'b'],
  multiply: ['a', 'b'],
  divide: ['a', 'b'],
  modulo: ['a', 'b'],
  power: ['a', 'b'],
  sqrt: ['value'],
  abs: ['value'],
  round: ['value'],
  floor: ['value'],
  ceil: ['value'],
  min: ['values (comma-separated)'],
  max: ['values (comma-separated)'],
  random: ['a (min)', 'b (max)'],
  concat: ['str1', 'str2'],
  substring: ['str', 'start', 'end'],
  replace: ['str', 'searchValue', 'replaceValue'],
  split: ['str', 'separator'],
  join: ['array', 'separator'],
  toUpperCase: ['str'],
  toLowerCase: ['str'],
  trim: ['str'],
  length: ['str'],
  indexOf: ['str', 'searchValue'],
  slice: ['str', 'start', 'end'],
  now: [],
  addDays: ['date', 'days'],
  subtractDays: ['date', 'days'],
  format: ['date', 'format'],
  parse: ['date'],
  getDay: ['date'],
  getMonth: ['date'],
  getYear: ['date'],
  getHour: ['date'],
  getMinute: ['date'],
  diff: ['date1', 'date2'],
};

export const OperatorConfig: React.FC<OperatorConfigProps> = ({ config, onChange }) => {
  const [category, setCategory] = useState<string>('math');
  const [operation, setOperation] = useState<string>(config?.operation || 'add');
  const [inputs, setInputs] = useState<Record<string, any>>(config?.inputs || {});
  const [output, setOutput] = useState<string>(config?.output || '');

  useEffect(() => {
    if (config) {
      setOperation(config.operation);
      setInputs(config.inputs);
      setOutput(config.output || '');
    }
  }, [config]);

  const handleOperationChange = (newOperation: string) => {
    setOperation(newOperation);
    setInputs({});
    updateConfig(newOperation, {}, output);
  };

  const handleInputChange = (key: string, value: any) => {
    const newInputs = { ...inputs, [key]: value };
    setInputs(newInputs);
    updateConfig(operation, newInputs, output);
  };

  const handleOutputChange = (value: string) => {
    setOutput(value);
    updateConfig(operation, inputs, value);
  };

  const updateConfig = (op: string, inp: Record<string, any>, out: string) => {
    onChange({
      operation: op,
      inputs: inp,
      output: out,
    });
  };

  const inputFields = operationInputs[operation] || [];

  return (
    <div className="operator-config">
      <div className="form-group">
        <label>Operation Category</label>
        <div className="category-buttons">
          {Object.keys(operatorCategories).map((cat) => (
            <button
              key={cat}
              className={`category-button ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Operation</label>
        <select value={operation} onChange={(e) => handleOperationChange(e.target.value)}>
          {operatorCategories[category as keyof typeof operatorCategories].map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Inputs</label>
        {inputFields.length === 0 ? (
          <div className="no-inputs">No inputs required</div>
        ) : (
          <div className="inputs-list">
            {inputFields.map((field) => (
              <div key={field} className="input-field">
                <label>{field}</label>
                <input
                  type="text"
                  value={inputs[field.split(' ')[0]] || ''}
                  onChange={(e) => handleInputChange(field.split(' ')[0], e.target.value)}
                  placeholder={`Enter ${field}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label>Output Variable (optional)</label>
        <input
          type="text"
          value={output}
          onChange={(e) => handleOutputChange(e.target.value)}
          placeholder="result"
        />
        <small>Store result in this variable</small>
      </div>
    </div>
  );
};
