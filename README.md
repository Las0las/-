# Power Automation Workflow Builder

A powerful drag-and-drop workflow automation application with visual boolean expression builder and advanced operator functions.

## Features

### 🎯 Core Features
- **Drag-and-Drop Workflow Canvas**: Intuitive visual workflow builder with zoom and pan capabilities
- **Boolean Expression Builder**: Visual interface for creating complex boolean logic
- **Advanced Operators**: Comprehensive library of operators including:
  - Boolean/Logic: AND, OR, NOT, NAND, NOR, XOR, XNOR
  - Comparison: ==, !=, >, <, >=, <=
  - Mathematical: +, -, *, /, %, power, abs, round, floor, ceil
  - String: concat, contains, startsWith, endsWith, uppercase, lowercase, trim, length, replace, regex
  - Array: map, filter, reduce, find, every, some
  - Utility: if-then-else, coalesce, typeof, type conversions
- **Workflow Execution Engine**: Execute your workflows with detailed logging
- **Import/Export**: Save and load workflows as JSON files

### 📦 Node Types

1. **Trigger Nodes** (Green)
   - Start points for workflows
   - Can set initial variables
   - No input ports, one output port

2. **Action Nodes** (Blue)
   - Perform operations
   - Actions include: log, setVariable, httpRequest, delay, transform, custom code
   - One input port, one output port

3. **Condition Nodes** (Orange)
   - Branch workflow based on conditions
   - Support simple expressions and boolean builder
   - One input port, two output ports (true/false)

4. **Operator Nodes** (Purple)
   - Apply mathematical, logical, or string operations
   - Support all operator categories
   - Multiple input ports, one output port

5. **Boolean Nodes** (Red)
   - Evaluate complex boolean expressions
   - Integrated with boolean builder
   - One input port, one output port

## Getting Started

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd power-automation-workflow
   ```

2. No dependencies needed! This is a pure HTML/CSS/JavaScript application.

### Running the Application

#### Option 1: Python HTTP Server
```bash
npm start
# or
python3 -m http.server 8080
```

Then open your browser to `http://localhost:8080`

#### Option 2: Any HTTP Server
You can use any static file server:
```bash
# Using Node.js http-server
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

#### Option 3: Direct File
Simply open `index.html` in your browser (some features may be limited)

## Usage Guide

### Creating a Workflow

1. **Add Nodes**
   - Click the toolbar buttons to add different node types
   - Nodes appear on the canvas at default positions
   - Drag nodes to reposition them

2. **Connect Nodes**
   - Click on an output port (bottom of node)
   - Drag to an input port (top of target node)
   - Release to create connection
   - Connections appear as curved lines

3. **Edit Nodes**
   - Double-click a node to open the property editor
   - Configure node-specific settings
   - Click "Save" to apply changes

4. **Delete Nodes**
   - Select a node by clicking it
   - Click "Delete" in the property editor
   - Or use the keyboard shortcut (Del key)

### Canvas Controls

- **Pan**: Middle-click and drag, or Ctrl+Left-click and drag
- **Zoom**: Mouse wheel up/down
- **Select**: Left-click on a node
- **Edit**: Double-click on a node
- **Connect**: Click output port, drag to input port

### Using the Boolean Builder

1. Click the "Boolean" tab in the sidebar
2. Click "+ Add Variable" to define variables
3. Click "+ Condition" to add simple conditions
4. Click "+ Group" to create nested logic groups
5. Select operators (AND, OR, NAND, NOR, XOR, XNOR)
6. Build complex expressions visually
7. Save expression to a node

### Running Workflows

1. Create your workflow with connected nodes
2. Click "▶ Run" in the toolbar
3. View execution log in the "Output" tab
4. Check the final context (variables) after execution

### Import/Export

**Export:**
- Click "⬇ Export" to download workflow as JSON
- File is saved as `workflow.json`

**Import:**
- Click "⬆ Import" and select a JSON file
- Workflow loads onto the canvas

## Architecture

### Project Structure
```
power-automation-workflow/
├── index.html              # Main HTML entry point
├── package.json            # Project metadata
├── README.md              # Documentation
└── src/
    ├── css/
    │   └── styles.css     # Application styles
    └── js/
        ├── app.js         # Main application controller
        ├── boolean-builder.js  # Boolean expression builder
        ├── operators.js   # Operator library
        ├── workflow-canvas.js  # Canvas rendering & interaction
        └── workflow-engine.js  # Workflow execution engine
```

### Component Overview

#### WorkflowCanvas (`workflow-canvas.js`)
- Handles canvas rendering using HTML5 Canvas API
- Manages node positioning, dragging, and connections
- Implements zoom and pan functionality
- Provides visual feedback for user interactions

#### BooleanBuilder (`boolean-builder.js`)
- Visual builder for boolean expressions
- Supports nested groups and multiple operators
- Evaluates expressions against context
- Generates readable expression strings

#### OperatorLibrary (`operators.js`)
- Comprehensive operator collection
- Organized by category (boolean, comparison, math, string, array, utility)
- Each operator has description, inputs, and execution function
- Extensible architecture for custom operators

#### WorkflowEngine (`workflow-engine.js`)
- Executes workflows node by node
- Manages execution context (variables)
- Handles different node types with specific handlers
- Provides detailed execution logging
- Supports asynchronous operations

#### WorkflowApp (`app.js`)
- Main application controller
- Coordinates all components
- Manages UI state and interactions
- Handles import/export functionality

## Advanced Features

### Variable References
Use `$variableName` syntax to reference variables in expressions:
```javascript
// In a condition node
$value > 10

// In an action node
$result * 2
```

### Custom Code Actions
Write custom JavaScript code in action nodes:
```javascript
// Custom code example
context.result = context.value1 + context.value2;
context.message = `Sum is ${context.result}`;
```

### Boolean Expression Examples

**Simple AND condition:**
```
(age >= 18) AND (hasLicense == true)
```

**Complex nested logic:**
```
((status == "active") OR (status == "pending")) AND (balance > 0)
```

**XOR example:**
```
(isDaytime XOR isNighttime)
```

## API Documentation

### WorkflowCanvas API

```javascript
// Add a node
canvas.addNode(type, x, y, data)

// Delete a node
canvas.deleteNode(node)

// Add connection
canvas.addConnection(fromNode, fromOutput, toNode, toInput)

// Export workflow
const workflow = canvas.exportWorkflow()

// Import workflow
canvas.importWorkflow(workflowData)

// Clear canvas
canvas.clear()
```

### BooleanBuilder API

```javascript
// Add variable
builder.addVariable(name, type)

// Add condition
builder.addCondition(group, condition)

// Add group
builder.addGroup(parentGroup, operator)

// Evaluate expression
const result = builder.evaluate(context)

// Get expression
const expr = builder.getExpression()

// Set expression
builder.setExpression(expressionData)
```

### WorkflowEngine API

```javascript
// Execute workflow
const result = await engine.execute(workflow, initialContext)

// Get context
const context = engine.getContext()

// Get execution log
const log = engine.getLog()

// Stop execution
engine.stop()
```

## Examples

### Example 1: Simple Value Check
```javascript
// Workflow: Check if value > 5
Trigger (value=10) → Condition ($value > 5) → Action (log "Greater than 5")
```

### Example 2: Mathematical Operation
```javascript
// Workflow: Calculate sum
Trigger (a=10, b=20) → Operator (ADD) → Action (setVariable: result)
```

### Example 3: Complex Boolean Logic
```javascript
// Workflow: User eligibility check
Trigger (age=25, income=50000, credit=700)
  → Boolean ((age >= 18) AND (income > 30000) AND (credit >= 650))
    → Condition (true) → Action (log "Eligible")
    → Condition (false) → Action (log "Not Eligible")
```

## Keyboard Shortcuts

- **Delete**: Delete selected node
- **Ctrl+Scroll**: Zoom in/out
- **Middle-Click+Drag**: Pan canvas

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Opera: ✅ Fully supported

## Performance

- Optimized canvas rendering
- Efficient event handling
- Supports 100+ nodes without performance issues
- Lazy rendering for off-screen elements

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## Future Enhancements

- [ ] Node grouping/collapsing
- [ ] Workflow templates library
- [ ] Real-time collaboration
- [ ] Workflow versioning
- [ ] Custom node types via plugins
- [ ] Database connectors
- [ ] API integrations
- [ ] Workflow scheduling
- [ ] Analytics and monitoring
- [ ] Mobile touch support

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

**Built for AA-Staffing AIA**

Power Automation Workflow Builder v1.0.0
