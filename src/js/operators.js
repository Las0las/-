/**
 * Advanced Operators - Comprehensive operator library for workflow automation
 * Includes boolean, comparison, mathematical, string, and array operators
 */

class OperatorLibrary {
    constructor() {
        this.operators = this.initializeOperators();
    }

    initializeOperators() {
        return {
            // Boolean/Logic Operators
            boolean: {
                AND: {
                    name: 'AND',
                    description: 'Returns true if all inputs are true',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a && b,
                    symbol: '&&'
                },
                OR: {
                    name: 'OR',
                    description: 'Returns true if any input is true',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a || b,
                    symbol: '||'
                },
                NOT: {
                    name: 'NOT',
                    description: 'Inverts the boolean value',
                    inputs: ['A'],
                    execute: (a) => !a,
                    symbol: '!'
                },
                NAND: {
                    name: 'NAND',
                    description: 'Returns true if not all inputs are true',
                    inputs: ['A', 'B'],
                    execute: (a, b) => !(a && b),
                    symbol: 'NAND'
                },
                NOR: {
                    name: 'NOR',
                    description: 'Returns true if no inputs are true',
                    inputs: ['A', 'B'],
                    execute: (a, b) => !(a || b),
                    symbol: 'NOR'
                },
                XOR: {
                    name: 'XOR',
                    description: 'Returns true if exactly one input is true',
                    inputs: ['A', 'B'],
                    execute: (a, b) => (a || b) && !(a && b),
                    symbol: 'XOR'
                },
                XNOR: {
                    name: 'XNOR',
                    description: 'Returns true if inputs are equal',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a === b,
                    symbol: 'XNOR'
                }
            },

            // Comparison Operators
            comparison: {
                EQUAL: {
                    name: 'EQUAL',
                    description: 'Checks if values are equal',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a === b,
                    symbol: '=='
                },
                NOT_EQUAL: {
                    name: 'NOT_EQUAL',
                    description: 'Checks if values are not equal',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a !== b,
                    symbol: '!='
                },
                GREATER_THAN: {
                    name: 'GREATER_THAN',
                    description: 'Checks if A is greater than B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a > b,
                    symbol: '>'
                },
                LESS_THAN: {
                    name: 'LESS_THAN',
                    description: 'Checks if A is less than B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a < b,
                    symbol: '<'
                },
                GREATER_EQUAL: {
                    name: 'GREATER_EQUAL',
                    description: 'Checks if A is greater than or equal to B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a >= b,
                    symbol: '>='
                },
                LESS_EQUAL: {
                    name: 'LESS_EQUAL',
                    description: 'Checks if A is less than or equal to B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a <= b,
                    symbol: '<='
                }
            },

            // Mathematical Operators
            math: {
                ADD: {
                    name: 'ADD',
                    description: 'Adds two numbers',
                    inputs: ['A', 'B'],
                    execute: (a, b) => Number(a) + Number(b),
                    symbol: '+'
                },
                SUBTRACT: {
                    name: 'SUBTRACT',
                    description: 'Subtracts B from A',
                    inputs: ['A', 'B'],
                    execute: (a, b) => Number(a) - Number(b),
                    symbol: '-'
                },
                MULTIPLY: {
                    name: 'MULTIPLY',
                    description: 'Multiplies two numbers',
                    inputs: ['A', 'B'],
                    execute: (a, b) => Number(a) * Number(b),
                    symbol: '*'
                },
                DIVIDE: {
                    name: 'DIVIDE',
                    description: 'Divides A by B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => Number(a) / Number(b),
                    symbol: '/'
                },
                MODULO: {
                    name: 'MODULO',
                    description: 'Returns remainder of A divided by B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => Number(a) % Number(b),
                    symbol: '%'
                },
                POWER: {
                    name: 'POWER',
                    description: 'Raises A to the power of B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => Math.pow(Number(a), Number(b)),
                    symbol: '**'
                },
                ABS: {
                    name: 'ABS',
                    description: 'Returns absolute value',
                    inputs: ['A'],
                    execute: (a) => Math.abs(Number(a)),
                    symbol: 'abs'
                },
                ROUND: {
                    name: 'ROUND',
                    description: 'Rounds to nearest integer',
                    inputs: ['A'],
                    execute: (a) => Math.round(Number(a)),
                    symbol: 'round'
                },
                FLOOR: {
                    name: 'FLOOR',
                    description: 'Rounds down to integer',
                    inputs: ['A'],
                    execute: (a) => Math.floor(Number(a)),
                    symbol: 'floor'
                },
                CEIL: {
                    name: 'CEIL',
                    description: 'Rounds up to integer',
                    inputs: ['A'],
                    execute: (a) => Math.ceil(Number(a)),
                    symbol: 'ceil'
                }
            },

            // String Operators
            string: {
                CONCAT: {
                    name: 'CONCAT',
                    description: 'Concatenates two strings',
                    inputs: ['A', 'B'],
                    execute: (a, b) => String(a) + String(b),
                    symbol: '+'
                },
                CONTAINS: {
                    name: 'CONTAINS',
                    description: 'Checks if A contains B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => String(a).includes(String(b)),
                    symbol: 'contains'
                },
                STARTS_WITH: {
                    name: 'STARTS_WITH',
                    description: 'Checks if A starts with B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => String(a).startsWith(String(b)),
                    symbol: 'startsWith'
                },
                ENDS_WITH: {
                    name: 'ENDS_WITH',
                    description: 'Checks if A ends with B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => String(a).endsWith(String(b)),
                    symbol: 'endsWith'
                },
                UPPERCASE: {
                    name: 'UPPERCASE',
                    description: 'Converts to uppercase',
                    inputs: ['A'],
                    execute: (a) => String(a).toUpperCase(),
                    symbol: 'upper'
                },
                LOWERCASE: {
                    name: 'LOWERCASE',
                    description: 'Converts to lowercase',
                    inputs: ['A'],
                    execute: (a) => String(a).toLowerCase(),
                    symbol: 'lower'
                },
                TRIM: {
                    name: 'TRIM',
                    description: 'Removes whitespace from both ends',
                    inputs: ['A'],
                    execute: (a) => String(a).trim(),
                    symbol: 'trim'
                },
                LENGTH: {
                    name: 'LENGTH',
                    description: 'Returns string length',
                    inputs: ['A'],
                    execute: (a) => String(a).length,
                    symbol: 'length'
                },
                REPLACE: {
                    name: 'REPLACE',
                    description: 'Replaces first occurrence of B with C in A',
                    inputs: ['A', 'B', 'C'],
                    execute: (a, b, c) => String(a).replace(String(b), String(c)),
                    symbol: 'replace'
                },
                REGEX_MATCH: {
                    name: 'REGEX_MATCH',
                    description: 'Tests if A matches regex pattern B',
                    inputs: ['A', 'B'],
                    execute: (a, b) => new RegExp(String(b)).test(String(a)),
                    symbol: 'matches'
                }
            },

            // Array/Collection Operators
            array: {
                MAP: {
                    name: 'MAP',
                    description: 'Applies function to each element',
                    inputs: ['Array', 'Function'],
                    execute: (arr, fn) => {
                        if (!Array.isArray(arr)) return [];
                        return arr.map(fn);
                    },
                    symbol: 'map'
                },
                FILTER: {
                    name: 'FILTER',
                    description: 'Filters array by condition',
                    inputs: ['Array', 'Function'],
                    execute: (arr, fn) => {
                        if (!Array.isArray(arr)) return [];
                        return arr.filter(fn);
                    },
                    symbol: 'filter'
                },
                REDUCE: {
                    name: 'REDUCE',
                    description: 'Reduces array to single value',
                    inputs: ['Array', 'Function', 'Initial'],
                    execute: (arr, fn, initial) => {
                        if (!Array.isArray(arr)) return initial;
                        return arr.reduce(fn, initial);
                    },
                    symbol: 'reduce'
                },
                FIND: {
                    name: 'FIND',
                    description: 'Finds first matching element',
                    inputs: ['Array', 'Function'],
                    execute: (arr, fn) => {
                        if (!Array.isArray(arr)) return null;
                        return arr.find(fn);
                    },
                    symbol: 'find'
                },
                EVERY: {
                    name: 'EVERY',
                    description: 'Checks if all elements match condition',
                    inputs: ['Array', 'Function'],
                    execute: (arr, fn) => {
                        if (!Array.isArray(arr)) return false;
                        return arr.every(fn);
                    },
                    symbol: 'every'
                },
                SOME: {
                    name: 'SOME',
                    description: 'Checks if any element matches condition',
                    inputs: ['Array', 'Function'],
                    execute: (arr, fn) => {
                        if (!Array.isArray(arr)) return false;
                        return arr.some(fn);
                    },
                    symbol: 'some'
                }
            },

            // Utility Operators
            utility: {
                IF_THEN_ELSE: {
                    name: 'IF_THEN_ELSE',
                    description: 'Returns B if A is true, otherwise C',
                    inputs: ['Condition', 'Then', 'Else'],
                    execute: (condition, thenValue, elseValue) => condition ? thenValue : elseValue,
                    symbol: '?:'
                },
                COALESCE: {
                    name: 'COALESCE',
                    description: 'Returns first non-null value',
                    inputs: ['A', 'B'],
                    execute: (a, b) => a ?? b,
                    symbol: '??'
                },
                TYPE_OF: {
                    name: 'TYPE_OF',
                    description: 'Returns type of value',
                    inputs: ['A'],
                    execute: (a) => typeof a,
                    symbol: 'typeof'
                },
                IS_NULL: {
                    name: 'IS_NULL',
                    description: 'Checks if value is null or undefined',
                    inputs: ['A'],
                    execute: (a) => a == null,
                    symbol: 'isNull'
                },
                TO_NUMBER: {
                    name: 'TO_NUMBER',
                    description: 'Converts to number',
                    inputs: ['A'],
                    execute: (a) => Number(a),
                    symbol: 'toNumber'
                },
                TO_STRING: {
                    name: 'TO_STRING',
                    description: 'Converts to string',
                    inputs: ['A'],
                    execute: (a) => String(a),
                    symbol: 'toString'
                },
                TO_BOOLEAN: {
                    name: 'TO_BOOLEAN',
                    description: 'Converts to boolean',
                    inputs: ['A'],
                    execute: (a) => Boolean(a),
                    symbol: 'toBoolean'
                }
            }
        };
    }

    getOperator(category, name) {
        return this.operators[category]?.[name];
    }

    executeOperator(category, name, ...args) {
        const operator = this.getOperator(category, name);
        if (!operator) {
            throw new Error(`Operator ${category}.${name} not found`);
        }
        return operator.execute(...args);
    }

    getAllOperators() {
        return this.operators;
    }

    getOperatorsByCategory(category) {
        return this.operators[category] || {};
    }

    getCategories() {
        return Object.keys(this.operators);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OperatorLibrary;
}
