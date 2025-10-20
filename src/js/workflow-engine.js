/**
 * Workflow Execution Engine
 * Executes workflows created in the workflow canvas
 */

class WorkflowEngine {
    constructor() {
        this.operators = new OperatorLibrary();
        this.context = {};
        this.executionLog = [];
        this.isRunning = false;
        this.nodeHandlers = this.initializeNodeHandlers();
    }

    initializeNodeHandlers() {
        return {
            trigger: this.executeTrigger.bind(this),
            action: this.executeAction.bind(this),
            condition: this.executeCondition.bind(this),
            operator: this.executeOperator.bind(this),
            boolean: this.executeBoolean.bind(this)
        };
    }

    async execute(workflow, initialContext = {}) {
        this.context = { ...initialContext };
        this.executionLog = [];
        this.isRunning = true;

        try {
            this.log('Workflow execution started');

            // Find trigger nodes
            const triggers = workflow.nodes.filter(n => n.type === 'trigger');

            if (triggers.length === 0) {
                throw new Error('No trigger node found in workflow');
            }

            // Execute from each trigger
            for (const trigger of triggers) {
                await this.executeNode(trigger, workflow);
            }

            this.log('Workflow execution completed');
            this.isRunning = false;

            return {
                success: true,
                context: this.context,
                log: this.executionLog
            };
        } catch (error) {
            this.log(`Error: ${error.message}`, 'error');
            this.isRunning = false;

            return {
                success: false,
                error: error.message,
                context: this.context,
                log: this.executionLog
            };
        }
    }

    async executeNode(node, workflow) {
        this.log(`Executing node: ${node.id} (${node.type})`);

        const handler = this.nodeHandlers[node.type];
        if (!handler) {
            throw new Error(`Unknown node type: ${node.type}`);
        }

        const result = await handler(node, workflow);

        // Find connected nodes and execute them
        const connections = workflow.connections.filter(conn => conn.from.node === node);

        for (const connection of connections) {
            // For condition nodes, check which branch to follow
            if (node.type === 'condition') {
                if ((result && connection.from.output === 'true') ||
                    (!result && connection.from.output === 'false')) {
                    await this.executeNode(connection.to.node, workflow);
                }
            } else {
                await this.executeNode(connection.to.node, workflow);
            }
        }

        return result;
    }

    async executeTrigger(node, workflow) {
        this.log(`Trigger: ${node.data.label || 'Start'}`);

        // Set trigger data to context if any
        if (node.data.variables) {
            Object.assign(this.context, node.data.variables);
        }

        return true;
    }

    async executeAction(node, workflow) {
        const action = node.data.action || 'log';
        this.log(`Action: ${action}`);

        switch (action) {
            case 'log':
                console.log('Workflow Log:', node.data.message || 'Action executed');
                this.log(`Log: ${node.data.message || 'Action executed'}`);
                break;

            case 'setVariable':
                const varName = node.data.variableName;
                const varValue = this.evaluateExpression(node.data.variableValue);
                this.context[varName] = varValue;
                this.log(`Set variable ${varName} = ${varValue}`);
                break;

            case 'httpRequest':
                // Simulate HTTP request
                this.log(`HTTP Request to ${node.data.url}`);
                // In real implementation, you would make actual HTTP request
                break;

            case 'delay':
                const delay = node.data.delay || 1000;
                this.log(`Delay for ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                break;

            case 'transform':
                const transformedValue = this.evaluateExpression(node.data.expression);
                this.context[node.data.outputVariable] = transformedValue;
                this.log(`Transform: ${node.data.outputVariable} = ${transformedValue}`);
                break;

            case 'custom':
                // Custom JavaScript code execution
                if (node.data.code) {
                    try {
                        const func = new Function('context', node.data.code);
                        func(this.context);
                        this.log(`Executed custom code`);
                    } catch (error) {
                        this.log(`Error in custom code: ${error.message}`, 'error');
                    }
                }
                break;

            default:
                this.log(`Unknown action: ${action}`, 'warning');
        }

        return true;
    }

    async executeCondition(node, workflow) {
        const condition = node.data.condition || 'true';
        this.log(`Evaluating condition: ${condition}`);

        // If node has a boolean expression builder attached
        if (node.data.booleanExpression) {
            const booleanBuilder = new BooleanBuilder('temp');
            booleanBuilder.setExpression(node.data.booleanExpression);
            const result = booleanBuilder.evaluate(this.context);
            this.log(`Condition result: ${result}`);
            return result;
        }

        // Otherwise evaluate simple expression
        const result = this.evaluateExpression(condition);
        this.log(`Condition result: ${result}`);

        return Boolean(result);
    }

    async executeOperator(node, workflow) {
        const category = node.data.category || 'boolean';
        const operatorName = node.data.operator || 'AND';

        this.log(`Operator: ${category}.${operatorName}`);

        // Get inputs from connected nodes or node data
        const inputs = this.getNodeInputs(node, workflow);
        const operator = this.operators.getOperator(category, operatorName);

        if (!operator) {
            throw new Error(`Operator ${category}.${operatorName} not found`);
        }

        const result = operator.execute(...inputs);
        this.log(`Operator result: ${result}`);

        // Store result in context
        if (node.data.outputVariable) {
            this.context[node.data.outputVariable] = result;
        }

        return result;
    }

    async executeBoolean(node, workflow) {
        this.log(`Boolean expression evaluation`);

        if (!node.data.booleanExpression) {
            return true;
        }

        const booleanBuilder = new BooleanBuilder('temp');
        booleanBuilder.setExpression(node.data.booleanExpression);
        const result = booleanBuilder.evaluate(this.context);

        this.log(`Boolean result: ${result}`);

        if (node.data.outputVariable) {
            this.context[node.data.outputVariable] = result;
        }

        return result;
    }

    getNodeInputs(node, workflow) {
        const inputs = [];

        // Find incoming connections
        const incomingConnections = workflow.connections.filter(
            conn => conn.to.node === node
        );

        // For each input port, get the value
        for (const inputPort of node.inputs) {
            const connection = incomingConnections.find(
                conn => conn.to.input === inputPort
            );

            if (connection) {
                // Get value from connected node's output
                const sourceNode = connection.from.node;
                const outputVariable = sourceNode.data.outputVariable;

                if (outputVariable && this.context[outputVariable] !== undefined) {
                    inputs.push(this.context[outputVariable]);
                } else {
                    inputs.push(null);
                }
            } else {
                // Use default value from node data
                const defaultValue = node.data[`input_${inputPort}`];
                inputs.push(this.evaluateExpression(defaultValue));
            }
        }

        return inputs;
    }

    evaluateExpression(expression) {
        if (expression === undefined || expression === null) {
            return null;
        }

        // If it's already a primitive value, return it
        if (typeof expression !== 'string') {
            return expression;
        }

        // Check if it's a variable reference (starts with $)
        if (expression.startsWith('$')) {
            const varName = expression.substring(1);
            return this.context[varName];
        }

        // Try to parse as JSON
        try {
            return JSON.parse(expression);
        } catch (e) {
            // Return as string if not valid JSON
            return expression;
        }
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = { timestamp, level, message };
        this.executionLog.push(logEntry);

        // Also log to console
        console.log(`[${level.toUpperCase()}] ${message}`);
    }

    getContext() {
        return this.context;
    }

    getLog() {
        return this.executionLog;
    }

    stop() {
        this.isRunning = false;
        this.log('Workflow execution stopped');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkflowEngine;
}
