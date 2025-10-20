/**
 * Boolean Builder - Visual Boolean Expression Builder
 * Allows users to create complex boolean expressions with a visual interface
 */

class BooleanBuilder {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.expression = { type: 'group', operator: 'AND', conditions: [] };
        this.conditionIdCounter = 0;
        this.variables = [];

        this.init();
    }

    init() {
        this.render();
    }

    addVariable(name, type = 'boolean') {
        this.variables.push({ name, type });
    }

    addCondition(group, condition = null) {
        if (!condition) {
            condition = {
                id: `condition_${this.conditionIdCounter++}`,
                type: 'simple',
                variable: this.variables[0]?.name || '',
                operator: '==',
                value: ''
            };
        }
        group.conditions.push(condition);
        this.render();
    }

    addGroup(parentGroup, operator = 'AND') {
        const newGroup = {
            id: `group_${this.conditionIdCounter++}`,
            type: 'group',
            operator: operator,
            conditions: []
        };
        parentGroup.conditions.push(newGroup);
        this.render();
    }

    removeCondition(group, condition) {
        group.conditions = group.conditions.filter(c => c !== condition);
        this.render();
    }

    updateCondition(condition, field, value) {
        condition[field] = value;
        this.render();
    }

    updateGroupOperator(group, operator) {
        group.operator = operator;
        this.render();
    }

    render() {
        this.container.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'boolean-builder';

        const title = document.createElement('h3');
        title.textContent = 'Boolean Expression Builder';
        wrapper.appendChild(title);

        const controls = document.createElement('div');
        controls.className = 'builder-controls';

        const addVarBtn = document.createElement('button');
        addVarBtn.textContent = '+ Add Variable';
        addVarBtn.className = 'btn btn-secondary';
        addVarBtn.onclick = () => this.showAddVariableDialog();
        controls.appendChild(addVarBtn);

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear All';
        clearBtn.className = 'btn btn-danger';
        clearBtn.onclick = () => {
            this.expression = { type: 'group', operator: 'AND', conditions: [] };
            this.render();
        };
        controls.appendChild(clearBtn);

        wrapper.appendChild(controls);

        const expressionContainer = document.createElement('div');
        expressionContainer.className = 'expression-container';
        expressionContainer.appendChild(this.renderGroup(this.expression));
        wrapper.appendChild(expressionContainer);

        // Expression preview
        const preview = document.createElement('div');
        preview.className = 'expression-preview';
        preview.innerHTML = `<strong>Expression:</strong> ${this.generateExpressionString(this.expression)}`;
        wrapper.appendChild(preview);

        this.container.appendChild(wrapper);
    }

    renderGroup(group, depth = 0) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'condition-group';
        groupDiv.style.marginLeft = `${depth * 20}px`;

        const header = document.createElement('div');
        header.className = 'group-header';

        // Operator selector
        const operatorSelect = document.createElement('select');
        operatorSelect.className = 'operator-select';
        ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'].forEach(op => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            option.selected = group.operator === op;
            operatorSelect.appendChild(option);
        });
        operatorSelect.onchange = (e) => this.updateGroupOperator(group, e.target.value);
        header.appendChild(operatorSelect);

        // Add condition button
        const addCondBtn = document.createElement('button');
        addCondBtn.textContent = '+ Condition';
        addCondBtn.className = 'btn btn-sm';
        addCondBtn.onclick = () => this.addCondition(group);
        header.appendChild(addCondBtn);

        // Add group button
        const addGroupBtn = document.createElement('button');
        addGroupBtn.textContent = '+ Group';
        addGroupBtn.className = 'btn btn-sm';
        addGroupBtn.onclick = () => this.addGroup(group);
        header.appendChild(addGroupBtn);

        groupDiv.appendChild(header);

        // Render conditions
        const conditionsDiv = document.createElement('div');
        conditionsDiv.className = 'conditions';

        group.conditions.forEach((condition, index) => {
            if (index > 0) {
                const operator = document.createElement('div');
                operator.className = 'operator-divider';
                operator.textContent = group.operator;
                conditionsDiv.appendChild(operator);
            }

            if (condition.type === 'group') {
                conditionsDiv.appendChild(this.renderGroup(condition, depth + 1));
            } else {
                conditionsDiv.appendChild(this.renderCondition(group, condition));
            }
        });

        groupDiv.appendChild(conditionsDiv);

        return groupDiv;
    }

    renderCondition(group, condition) {
        const condDiv = document.createElement('div');
        condDiv.className = 'condition';

        // Variable selector
        const varSelect = document.createElement('select');
        varSelect.className = 'variable-select';
        this.variables.forEach(v => {
            const option = document.createElement('option');
            option.value = v.name;
            option.textContent = v.name;
            option.selected = condition.variable === v.name;
            varSelect.appendChild(option);
        });
        varSelect.onchange = (e) => this.updateCondition(condition, 'variable', e.target.value);
        condDiv.appendChild(varSelect);

        // Operator selector
        const opSelect = document.createElement('select');
        opSelect.className = 'comparison-operator';
        const operators = ['==', '!=', '>', '<', '>=', '<=', 'contains', 'startsWith', 'endsWith', 'matches'];
        operators.forEach(op => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            option.selected = condition.operator === op;
            opSelect.appendChild(option);
        });
        opSelect.onchange = (e) => this.updateCondition(condition, 'operator', e.target.value);
        condDiv.appendChild(opSelect);

        // Value input
        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.className = 'value-input';
        valueInput.value = condition.value;
        valueInput.placeholder = 'value';
        valueInput.oninput = (e) => this.updateCondition(condition, 'value', e.target.value);
        condDiv.appendChild(valueInput);

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.className = 'btn btn-remove';
        removeBtn.onclick = () => this.removeCondition(group, condition);
        condDiv.appendChild(removeBtn);

        return condDiv;
    }

    showAddVariableDialog() {
        const name = prompt('Enter variable name:');
        if (name) {
            const type = prompt('Enter variable type (boolean, number, string):', 'boolean');
            this.addVariable(name, type || 'boolean');
            this.render();
        }
    }

    generateExpressionString(group) {
        if (group.conditions.length === 0) {
            return 'true';
        }

        const parts = group.conditions.map(condition => {
            if (condition.type === 'group') {
                return `(${this.generateExpressionString(condition)})`;
            } else {
                return `${condition.variable} ${condition.operator} ${condition.value}`;
            }
        });

        return parts.join(` ${group.operator} `);
    }

    evaluate(context) {
        return this.evaluateGroup(this.expression, context);
    }

    evaluateGroup(group, context) {
        if (group.conditions.length === 0) {
            return true;
        }

        const results = group.conditions.map(condition => {
            if (condition.type === 'group') {
                return this.evaluateGroup(condition, context);
            } else {
                return this.evaluateCondition(condition, context);
            }
        });

        return this.applyOperator(group.operator, results);
    }

    evaluateCondition(condition, context) {
        const value = context[condition.variable];
        const compareValue = this.parseValue(condition.value);

        switch (condition.operator) {
            case '==':
                return value == compareValue;
            case '!=':
                return value != compareValue;
            case '>':
                return value > compareValue;
            case '<':
                return value < compareValue;
            case '>=':
                return value >= compareValue;
            case '<=':
                return value <= compareValue;
            case 'contains':
                return String(value).includes(compareValue);
            case 'startsWith':
                return String(value).startsWith(compareValue);
            case 'endsWith':
                return String(value).endsWith(compareValue);
            case 'matches':
                return new RegExp(compareValue).test(String(value));
            default:
                return false;
        }
    }

    parseValue(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (!isNaN(value)) return Number(value);
        return value;
    }

    applyOperator(operator, results) {
        switch (operator) {
            case 'AND':
                return results.every(r => r);
            case 'OR':
                return results.some(r => r);
            case 'NAND':
                return !results.every(r => r);
            case 'NOR':
                return !results.some(r => r);
            case 'XOR':
                return results.filter(r => r).length === 1;
            case 'XNOR':
                return results.filter(r => r).length !== 1;
            default:
                return false;
        }
    }

    getExpression() {
        return this.expression;
    }

    setExpression(expression) {
        this.expression = expression;
        this.render();
    }

    clear() {
        this.expression = { type: 'group', operator: 'AND', conditions: [] };
        this.variables = [];
        this.render();
    }
}
