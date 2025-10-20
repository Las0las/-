import {
  MathOperation,
  StringOperation,
  ArrayOperation,
  DateOperation,
  OperatorConfig,
  BooleanExpression,
  BooleanOperator,
  Condition,
  ComparisonOperator,
} from './types';

// Math Operations
export const executeMathOperation = (operation: MathOperation, inputs: Record<string, any>): number => {
  const { a, b, value, values } = inputs;

  switch (operation) {
    case 'add':
      return Number(a) + Number(b);
    case 'subtract':
      return Number(a) - Number(b);
    case 'multiply':
      return Number(a) * Number(b);
    case 'divide':
      return Number(a) / Number(b);
    case 'modulo':
      return Number(a) % Number(b);
    case 'power':
      return Math.pow(Number(a), Number(b));
    case 'sqrt':
      return Math.sqrt(Number(value));
    case 'abs':
      return Math.abs(Number(value));
    case 'round':
      return Math.round(Number(value));
    case 'floor':
      return Math.floor(Number(value));
    case 'ceil':
      return Math.ceil(Number(value));
    case 'min':
      return Math.min(...(values || [a, b]).map(Number));
    case 'max':
      return Math.max(...(values || [a, b]).map(Number));
    case 'random':
      return Math.random() * (Number(b) - Number(a)) + Number(a);
    default:
      throw new Error(`Unknown math operation: ${operation}`);
  }
};

// String Operations
export const executeStringOperation = (operation: StringOperation, inputs: Record<string, any>): any => {
  const { str, str1, str2, separator, start, end, searchValue, replaceValue, array } = inputs;

  switch (operation) {
    case 'concat':
      return String(str1) + String(str2);
    case 'substring':
      return String(str).substring(Number(start), end ? Number(end) : undefined);
    case 'replace':
      return String(str).replace(searchValue, replaceValue);
    case 'split':
      return String(str).split(separator || '');
    case 'join':
      return Array.isArray(array) ? array.join(separator || ',') : '';
    case 'toUpperCase':
      return String(str).toUpperCase();
    case 'toLowerCase':
      return String(str).toLowerCase();
    case 'trim':
      return String(str).trim();
    case 'length':
      return String(str).length;
    case 'indexOf':
      return String(str).indexOf(searchValue);
    case 'slice':
      return String(str).slice(Number(start), end ? Number(end) : undefined);
    default:
      throw new Error(`Unknown string operation: ${operation}`);
  }
};

// Array Operations
export const executeArrayOperation = (operation: ArrayOperation, inputs: Record<string, any>): any => {
  const { array, value, index, start, end, callback, predicate, deleteCount } = inputs;

  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }

  const arr = [...array];

  switch (operation) {
    case 'push':
      arr.push(value);
      return arr;
    case 'pop':
      arr.pop();
      return arr;
    case 'shift':
      arr.shift();
      return arr;
    case 'unshift':
      arr.unshift(value);
      return arr;
    case 'slice':
      return arr.slice(Number(start), end ? Number(end) : undefined);
    case 'splice':
      arr.splice(Number(start), Number(deleteCount || 0), value);
      return arr;
    case 'filter':
      return arr.filter((item) => {
        if (typeof predicate === 'function') return predicate(item);
        return item !== value;
      });
    case 'map':
      return arr.map((item) => {
        if (typeof callback === 'function') return callback(item);
        return item;
      });
    case 'reduce':
      return arr.reduce((acc, item) => {
        if (typeof callback === 'function') return callback(acc, item);
        return acc + item;
      }, value || 0);
    case 'find':
      return arr.find((item) => {
        if (typeof predicate === 'function') return predicate(item);
        return item === value;
      });
    case 'sort':
      return arr.sort();
    case 'reverse':
      return arr.reverse();
    case 'length':
      return arr.length;
    case 'includes':
      return arr.includes(value);
    case 'indexOf':
      return arr.indexOf(value);
    case 'join':
      return arr.join(value || ',');
    default:
      throw new Error(`Unknown array operation: ${operation}`);
  }
};

// Date Operations
export const executeDateOperation = (operation: DateOperation, inputs: Record<string, any>): any => {
  const { date, days, format, date1, date2 } = inputs;

  const d = date ? new Date(date) : new Date();

  switch (operation) {
    case 'now':
      return new Date().toISOString();
    case 'addDays':
      d.setDate(d.getDate() + Number(days));
      return d.toISOString();
    case 'subtractDays':
      d.setDate(d.getDate() - Number(days));
      return d.toISOString();
    case 'format':
      return d.toLocaleString(format || 'en-US');
    case 'parse':
      return new Date(date).toISOString();
    case 'getDay':
      return d.getDay();
    case 'getMonth':
      return d.getMonth() + 1;
    case 'getYear':
      return d.getFullYear();
    case 'getHour':
      return d.getHours();
    case 'getMinute':
      return d.getMinutes();
    case 'diff':
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24);
    default:
      throw new Error(`Unknown date operation: ${operation}`);
  }
};

// Boolean Operations
export const evaluateBooleanExpression = (
  expression: BooleanExpression,
  context: Record<string, any>
): boolean => {
  if (expression.type === 'value') {
    return Boolean(expression.value);
  }

  if (expression.type === 'condition' && expression.condition) {
    return evaluateCondition(expression.condition, context);
  }

  if (expression.type === 'operator' && expression.operator && expression.operands) {
    const operandResults = expression.operands.map((op) =>
      evaluateBooleanExpression(op, context)
    );

    switch (expression.operator) {
      case 'AND':
        return operandResults.every((result) => result);
      case 'OR':
        return operandResults.some((result) => result);
      case 'NOT':
        return !operandResults[0];
      case 'XOR':
        return operandResults.reduce((acc, val) => acc !== val, false);
      default:
        throw new Error(`Unknown boolean operator: ${expression.operator}`);
    }
  }

  return false;
};

// Condition Evaluation
export const evaluateCondition = (
  condition: Condition,
  context: Record<string, any>
): boolean => {
  const left = resolveValue(condition.leftOperand, context);
  const right = resolveValue(condition.rightOperand, context);

  switch (condition.operator) {
    case 'equals':
      return left === right;
    case 'notEquals':
      return left !== right;
    case 'greaterThan':
      return Number(left) > Number(right);
    case 'lessThan':
      return Number(left) < Number(right);
    case 'greaterOrEqual':
      return Number(left) >= Number(right);
    case 'lessOrEqual':
      return Number(left) <= Number(right);
    case 'contains':
      return String(left).includes(String(right));
    case 'startsWith':
      return String(left).startsWith(String(right));
    case 'endsWith':
      return String(left).endsWith(String(right));
    case 'matches':
      return new RegExp(String(right)).test(String(left));
    default:
      throw new Error(`Unknown comparison operator: ${condition.operator}`);
  }
};

// Helper to resolve variable references
const resolveValue = (value: any, context: Record<string, any>): any => {
  if (typeof value === 'string' && value.startsWith('$')) {
    const varName = value.substring(1);
    return context[varName] !== undefined ? context[varName] : value;
  }
  return value;
};

// Execute generic operator
export const executeOperator = (config: OperatorConfig, context: Record<string, any>): any => {
  const resolvedInputs = Object.entries(config.inputs).reduce((acc, [key, value]) => {
    acc[key] = resolveValue(value, context);
    return acc;
  }, {} as Record<string, any>);

  // Determine operation type and execute
  const operation = config.operation;

  // Math operations
  if (['add', 'subtract', 'multiply', 'divide', 'modulo', 'power', 'sqrt', 'abs', 'round', 'floor', 'ceil', 'min', 'max', 'random'].includes(operation)) {
    return executeMathOperation(operation as MathOperation, resolvedInputs);
  }

  // String operations
  if (['concat', 'substring', 'replace', 'split', 'join', 'toUpperCase', 'toLowerCase', 'trim', 'length', 'indexOf', 'slice'].includes(operation)) {
    return executeStringOperation(operation as StringOperation, resolvedInputs);
  }

  // Array operations
  if (['push', 'pop', 'shift', 'unshift', 'slice', 'splice', 'filter', 'map', 'reduce', 'find', 'sort', 'reverse', 'length', 'includes', 'indexOf', 'join'].includes(operation)) {
    return executeArrayOperation(operation as ArrayOperation, resolvedInputs);
  }

  // Date operations
  if (['now', 'addDays', 'subtractDays', 'format', 'parse', 'getDay', 'getMonth', 'getYear', 'getHour', 'getMinute', 'diff'].includes(operation)) {
    return executeDateOperation(operation as DateOperation, resolvedInputs);
  }

  throw new Error(`Unknown operation: ${operation}`);
};
