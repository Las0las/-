/**
 * Main Application - Power Automation Workflow App
 * Coordinates all components and manages the application state
 */

class WorkflowApp {
    constructor() {
        this.canvas = null;
        this.booleanBuilder = null;
        this.engine = null;
        this.currentNode = null;
        this.operators = new OperatorLibrary();

        this.init();
    }

    init() {
        // Initialize components
        this.canvas = new WorkflowCanvas('canvas-container');
        this.booleanBuilder = new BooleanBuilder('boolean-builder-container');
        this.engine = new WorkflowEngine();

        // Setup event listeners
        this.setupEventListeners();

        // Initialize UI
        this.initializeUI();

        // Load sample workflow
        this.loadSampleWorkflow();
    }

    setupEventListeners() {
        // Node edit event
        document.getElementById('canvas-container').addEventListener('nodeEdit', (e) => {
            this.editNode(e.detail);
        });

        // Toolbar buttons
        document.getElementById('btn-add-trigger').addEventListener('click', () => {
            this.canvas.addNode('trigger', 100, 100, { label: 'Start' });
        });

        document.getElementById('btn-add-action').addEventListener('click', () => {
            this.canvas.addNode('action', 200, 100, { label: 'Action', action: 'log' });
        });

        document.getElementById('btn-add-condition').addEventListener('click', () => {
            this.canvas.addNode('condition', 300, 100, { label: 'Condition', condition: 'true' });
        });

        document.getElementById('btn-add-operator').addEventListener('click', () => {
            this.showOperatorSelector();
        });

        document.getElementById('btn-add-boolean').addEventListener('click', () => {
            this.canvas.addNode('boolean', 400, 100, { label: 'Boolean' });
        });

        document.getElementById('btn-run').addEventListener('click', () => {
            this.runWorkflow();
        });

        document.getElementById('btn-stop').addEventListener('click', () => {
            this.engine.stop();
        });

        document.getElementById('btn-clear').addEventListener('click', () => {
            if (confirm('Clear entire workflow?')) {
                this.canvas.clear();
            }
        });

        document.getElementById('btn-export').addEventListener('click', () => {
            this.exportWorkflow();
        });

        document.getElementById('btn-import').addEventListener('click', () => {
            this.importWorkflow();
        });

        document.getElementById('btn-delete-node').addEventListener('click', () => {
            if (this.canvas.selectedNode) {
                this.canvas.deleteNode(this.canvas.selectedNode);
                this.hideNodeEditor();
            }
        });

        document.getElementById('btn-save-node').addEventListener('click', () => {
            this.saveNodeProperties();
        });

        // Close node editor
        document.getElementById('btn-close-editor').addEventListener('click', () => {
            this.hideNodeEditor();
        });
    }

    initializeUI() {
        // Populate operator categories
        this.populateOperatorCategories();

        // Setup tabs
        this.setupTabs();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const panels = document.querySelectorAll('.panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));

                tab.classList.add('active');
                const panelId = tab.dataset.panel;
                document.getElementById(panelId).classList.add('active');
            });
        });
    }

    showOperatorSelector() {
        const category = prompt('Select operator category:\n1. boolean\n2. comparison\n3. math\n4. string\n5. array\n6. utility', 'boolean');

        if (category) {
            const operators = this.operators.getOperatorsByCategory(category);
            const operatorNames = Object.keys(operators);

            if (operatorNames.length === 0) {
                alert('No operators found in this category');
                return;
            }

            const operatorList = operatorNames.map((name, i) => `${i + 1}. ${name}`).join('\n');
            const selection = prompt(`Select operator:\n${operatorList}`, operatorNames[0]);

            if (selection) {
                const operatorName = operatorNames.includes(selection) ? selection : operatorNames[0];
                this.canvas.addNode('operator', 300, 100, {
                    label: operatorName,
                    category: category,
                    operator: operatorName
                });
            }
        }
    }

    populateOperatorCategories() {
        const categories = this.operators.getCategories();
        const container = document.getElementById('operator-categories');

        if (!container) return;

        container.innerHTML = '<h4>Available Operators</h4>';

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'operator-category';

            const title = document.createElement('h5');
            title.textContent = category.toUpperCase();
            categoryDiv.appendChild(title);

            const operators = this.operators.getOperatorsByCategory(category);
            const list = document.createElement('ul');

            Object.keys(operators).forEach(opName => {
                const op = operators[opName];
                const item = document.createElement('li');
                item.textContent = `${opName} - ${op.description}`;
                item.title = `Inputs: ${op.inputs.join(', ')}`;
                list.appendChild(item);
            });

            categoryDiv.appendChild(list);
            container.appendChild(categoryDiv);
        });
    }

    editNode(node) {
        this.currentNode = node;
        this.showNodeEditor(node);
    }

    showNodeEditor(node) {
        const editor = document.getElementById('node-editor');
        const form = document.getElementById('node-properties-form');

        form.innerHTML = '';

        // Node type
        this.addFormField(form, 'Type', node.type, 'text', 'type', true);

        // Common properties
        this.addFormField(form, 'Label', node.data.label || '', 'text', 'label');

        // Type-specific properties
        switch (node.type) {
            case 'trigger':
                this.addFormField(form, 'Variables (JSON)', JSON.stringify(node.data.variables || {}), 'textarea', 'variables');
                break;

            case 'action':
                this.addFormSelect(form, 'Action Type', node.data.action || 'log', 'action',
                    ['log', 'setVariable', 'httpRequest', 'delay', 'transform', 'custom']);

                if (node.data.action === 'setVariable') {
                    this.addFormField(form, 'Variable Name', node.data.variableName || '', 'text', 'variableName');
                    this.addFormField(form, 'Variable Value', node.data.variableValue || '', 'text', 'variableValue');
                } else if (node.data.action === 'log') {
                    this.addFormField(form, 'Message', node.data.message || '', 'text', 'message');
                } else if (node.data.action === 'httpRequest') {
                    this.addFormField(form, 'URL', node.data.url || '', 'text', 'url');
                } else if (node.data.action === 'delay') {
                    this.addFormField(form, 'Delay (ms)', node.data.delay || 1000, 'number', 'delay');
                } else if (node.data.action === 'transform') {
                    this.addFormField(form, 'Expression', node.data.expression || '', 'text', 'expression');
                    this.addFormField(form, 'Output Variable', node.data.outputVariable || '', 'text', 'outputVariable');
                } else if (node.data.action === 'custom') {
                    this.addFormField(form, 'Code', node.data.code || '', 'textarea', 'code');
                }
                break;

            case 'condition':
                this.addFormField(form, 'Condition', node.data.condition || 'true', 'text', 'condition');

                const booleanBtn = document.createElement('button');
                booleanBtn.textContent = 'Edit Boolean Expression';
                booleanBtn.className = 'btn btn-secondary';
                booleanBtn.type = 'button';
                booleanBtn.onclick = () => {
                    this.editBooleanExpression(node);
                };
                form.appendChild(booleanBtn);
                break;

            case 'operator':
                this.addFormSelect(form, 'Category', node.data.category || 'boolean', 'category',
                    this.operators.getCategories());

                const category = node.data.category || 'boolean';
                const operators = Object.keys(this.operators.getOperatorsByCategory(category));
                this.addFormSelect(form, 'Operator', node.data.operator || operators[0], 'operator', operators);

                this.addFormField(form, 'Output Variable', node.data.outputVariable || '', 'text', 'outputVariable');
                break;

            case 'boolean':
                this.addFormField(form, 'Output Variable', node.data.outputVariable || '', 'text', 'outputVariable');

                const editBooleanBtn = document.createElement('button');
                editBooleanBtn.textContent = 'Edit Boolean Expression';
                editBooleanBtn.className = 'btn btn-secondary';
                editBooleanBtn.type = 'button';
                editBooleanBtn.onclick = () => {
                    this.editBooleanExpression(node);
                };
                form.appendChild(editBooleanBtn);
                break;
        }

        editor.style.display = 'block';
    }

    addFormField(form, label, value, type, name, readonly = false) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        group.appendChild(labelElem);

        let input;
        if (type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 4;
        } else {
            input = document.createElement('input');
            input.type = type;
        }

        input.name = name;
        input.value = value;
        input.readOnly = readonly;
        group.appendChild(input);

        form.appendChild(group);
    }

    addFormSelect(form, label, value, name, options) {
        const group = document.createElement('div');
        group.className = 'form-group';

        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        group.appendChild(labelElem);

        const select = document.createElement('select');
        select.name = name;

        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            option.selected = opt === value;
            select.appendChild(option);
        });

        group.appendChild(select);
        form.appendChild(group);
    }

    saveNodeProperties() {
        if (!this.currentNode) return;

        const form = document.getElementById('node-properties-form');
        const formData = new FormData(form);

        for (const [key, value] of formData.entries()) {
            if (key === 'type') continue;

            if (key === 'variables') {
                try {
                    this.currentNode.data[key] = JSON.parse(value);
                } catch (e) {
                    alert('Invalid JSON for variables');
                    return;
                }
            } else {
                this.currentNode.data[key] = value;
            }
        }

        this.canvas.render();
        this.hideNodeEditor();
    }

    hideNodeEditor() {
        document.getElementById('node-editor').style.display = 'none';
        this.currentNode = null;
    }

    editBooleanExpression(node) {
        // Switch to boolean builder tab
        document.querySelector('[data-panel="boolean-builder-panel"]').click();

        // Load expression into builder
        if (node.data.booleanExpression) {
            this.booleanBuilder.setExpression(node.data.booleanExpression);
        } else {
            this.booleanBuilder.clear();
        }

        // Save reference
        this.currentBooleanNode = node;

        // Add save button to boolean builder
        const container = document.getElementById('boolean-builder-container');
        let saveBtn = document.getElementById('save-boolean-expression');

        if (!saveBtn) {
            saveBtn = document.createElement('button');
            saveBtn.id = 'save-boolean-expression';
            saveBtn.textContent = 'Save to Node';
            saveBtn.className = 'btn btn-primary';
            saveBtn.onclick = () => {
                if (this.currentBooleanNode) {
                    this.currentBooleanNode.data.booleanExpression = this.booleanBuilder.getExpression();
                    alert('Boolean expression saved to node!');
                    document.querySelector('[data-panel="canvas-panel"]').click();
                }
            };
            container.appendChild(saveBtn);
        }
    }

    async runWorkflow() {
        const workflow = this.canvas.exportWorkflow();

        // Clear previous log
        document.getElementById('execution-log').innerHTML = '';

        // Run workflow
        const result = await this.engine.execute(workflow, {});

        // Display results
        this.displayExecutionResults(result);
    }

    displayExecutionResults(result) {
        const logContainer = document.getElementById('execution-log');
        logContainer.innerHTML = '<h3>Execution Log</h3>';

        if (result.success) {
            const successMsg = document.createElement('div');
            successMsg.className = 'log-entry log-success';
            successMsg.textContent = 'Workflow completed successfully!';
            logContainer.appendChild(successMsg);
        } else {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'log-entry log-error';
            errorMsg.textContent = `Error: ${result.error}`;
            logContainer.appendChild(errorMsg);
        }

        // Display log entries
        result.log.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${entry.level}`;
            logEntry.textContent = `[${entry.timestamp}] ${entry.message}`;
            logContainer.appendChild(logEntry);
        });

        // Display context
        const contextDiv = document.createElement('div');
        contextDiv.className = 'context-display';
        contextDiv.innerHTML = `<h4>Final Context</h4><pre>${JSON.stringify(result.context, null, 2)}</pre>`;
        logContainer.appendChild(contextDiv);

        // Switch to output tab
        document.querySelector('[data-panel="output-panel"]').click();
    }

    exportWorkflow() {
        const workflow = this.canvas.exportWorkflow();
        const json = JSON.stringify(workflow, null, 2);

        // Download as file
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workflow.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    importWorkflow() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const workflow = JSON.parse(event.target.result);
                    this.canvas.importWorkflow(workflow);
                } catch (error) {
                    alert('Error importing workflow: ' + error.message);
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    loadSampleWorkflow() {
        // Load a simple sample workflow
        const sampleWorkflow = {
            nodes: [
                {
                    id: 'node_0',
                    type: 'trigger',
                    x: 100,
                    y: 100,
                    width: 180,
                    height: 80,
                    inputs: [],
                    outputs: ['start'],
                    data: { label: 'Start', variables: { value: 10 } },
                    color: '#4CAF50'
                },
                {
                    id: 'node_1',
                    type: 'condition',
                    x: 350,
                    y: 100,
                    width: 180,
                    height: 80,
                    inputs: ['input'],
                    outputs: ['true', 'false'],
                    data: { label: 'Check Value', condition: '$value > 5' },
                    color: '#FF9800'
                },
                {
                    id: 'node_2',
                    type: 'action',
                    x: 350,
                    y: 250,
                    width: 180,
                    height: 80,
                    inputs: ['input'],
                    outputs: ['output'],
                    data: { label: 'Log True', action: 'log', message: 'Value is greater than 5' },
                    color: '#2196F3'
                }
            ],
            connections: [
                {
                    from: { node: { id: 'node_0' }, output: 'start' },
                    to: { node: { id: 'node_1' }, input: 'input' }
                },
                {
                    from: { node: { id: 'node_1' }, output: 'true' },
                    to: { node: { id: 'node_2' }, input: 'input' }
                }
            ]
        };

        // Convert node references back to actual objects
        const nodeMap = new Map(sampleWorkflow.nodes.map(n => [n.id, n]));
        sampleWorkflow.connections = sampleWorkflow.connections.map(conn => ({
            from: {
                node: nodeMap.get(conn.from.node.id),
                output: conn.from.output
            },
            to: {
                node: nodeMap.get(conn.to.node.id),
                input: conn.to.input
            }
        }));

        this.canvas.importWorkflow(sampleWorkflow);
        this.canvas.nodeIdCounter = 3;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorkflowApp();
});
