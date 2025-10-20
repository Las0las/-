# Power Automation Workflow Builder

A powerful drag-and-drop workflow automation app with advanced boolean logic builder and comprehensive operator functions.

![Workflow Builder](https://img.shields.io/badge/React-18.2-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue) ![React Flow](https://img.shields.io/badge/React_Flow-11.10-green)

## Features

### Core Functionality

- **Drag & Drop Workflow Canvas**: Build complex workflows visually using an intuitive drag-and-drop interface
- **Boolean Logic Builder**: Create sophisticated conditional logic with AND, OR, NOT, and XOR operators
- **Advanced Operators**: Extensive library of operators for data manipulation
- **Real-time Execution**: Execute workflows and view results in real-time
- **Save/Load Workflows**: Export and import workflow configurations as JSON

### Node Types

1. **Trigger** - Start point for workflows
2. **Action** - Execute operations (log, set variable, transform)
3. **Condition** - Single conditional branching
4. **Boolean Logic** - Complex multi-condition logic with nested operators
5. **Operator** - Advanced data operations (Math, String, Array, Date)

### Advanced Operators

#### Math Operations
- Basic: `add`, `subtract`, `multiply`, `divide`, `modulo`, `power`
- Functions: `sqrt`, `abs`, `round`, `floor`, `ceil`
- Statistical: `min`, `max`, `random`

#### String Operations
- Manipulation: `concat`, `substring`, `slice`, `replace`
- Transformation: `toUpperCase`, `toLowerCase`, `trim`
- Analysis: `length`, `indexOf`, `split`, `join`

#### Array Operations
- Modification: `push`, `pop`, `shift`, `unshift`, `splice`
- Transformation: `map`, `filter`, `reduce`, `sort`, `reverse`
- Analysis: `find`, `includes`, `indexOf`, `length`, `join`

#### Date Operations
- Creation: `now`, `parse`
- Manipulation: `addDays`, `subtractDays`
- Extraction: `getDay`, `getMonth`, `getYear`, `getHour`, `getMinute`
- Comparison: `diff`, `format`

### Boolean Logic System

Build complex conditional expressions with:
- **Operators**: AND, OR, NOT, XOR
- **Nested Logic**: Create groups within groups for advanced logic
- **Conditions**: Support for all comparison operators
- **Values**: Direct boolean values

#### Comparison Operators
- `equals`, `notEquals`
- `greaterThan`, `lessThan`, `greaterOrEqual`, `lessOrEqual`
- `contains`, `startsWith`, `endsWith`
- `matches` (regex support)

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Creating a Workflow

1. **Add Nodes**: Drag nodes from the sidebar or click to add them to the canvas
2. **Connect Nodes**: Click and drag from one node's output handle to another's input handle
3. **Configure Nodes**: Click on any node to open the configuration panel
4. **Execute**: Click "Run Workflow" to execute and view results

### Node Configuration

#### Trigger Node
- Set initial variables in JSON format
- Example:
  ```json
  {
    "user": "John",
    "count": 5,
    "active": true
  }
  ```

#### Action Node
- **Log**: Output messages to execution log
- **Set Variable**: Create or update workflow variables
- **Transform**: Apply custom transformations

#### Condition Node
- Set left operand, comparison operator, and right operand
- Use `$variableName` to reference workflow variables
- Example: `$count` > `10`

#### Boolean Logic Node
- Choose main operator (AND, OR, NOT, XOR)
- Add multiple operands:
  - **Value**: Direct true/false
  - **Condition**: Comparison expression
  - **Group**: Nested boolean logic
- Build complex expressions like: `(A AND B) OR (C AND NOT D)`

#### Operator Node
- Select operation category (Math, String, Array, Date)
- Choose specific operation
- Configure inputs (supports variable references with `$`)
- Set output variable name to store results

### Variable System

- Reference variables using `$variableName` syntax
- Variables are available throughout workflow execution
- Each node can create or modify variables
- View variable values in execution logs

### Execution Flow

1. Workflow starts from trigger nodes (nodes with no incoming connections)
2. Executes nodes in connected order
3. Conditional nodes branch based on evaluation results
4. Results and logs are displayed in the execution panel
5. Variables are maintained throughout execution

### Saving and Loading

- **Save**: Click "Save Workflow" to export as JSON file
- **Load**: Click "Load Workflow" to import from JSON file
- Workflows include all nodes, connections, and configurations

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── BooleanBuilder.tsx      # Boolean logic builder UI
│   │   ├── ConditionConfig.tsx     # Condition configuration
│   │   ├── CustomNode.tsx          # Custom node component
│   │   ├── ExecutionPanel.tsx      # Execution logs panel
│   │   ├── NodeEditor.tsx          # Node configuration editor
│   │   ├── OperatorConfig.tsx      # Operator configuration
│   │   └── Sidebar.tsx             # Node palette sidebar
│   ├── App.tsx                     # Main application
│   ├── engine.ts                   # Workflow execution engine
│   ├── operators.ts                # Operator implementations
│   ├── store.ts                    # Zustand state management
│   ├── types.ts                    # TypeScript type definitions
│   └── main.tsx                    # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Technology Stack

- **React 18.2** - UI framework
- **TypeScript 5.3** - Type safety
- **React Flow 11.10** - Flow diagram library
- **Zustand 4.5** - State management
- **Vite 5.0** - Build tool and dev server
- **Lucide React** - Icon library

## Examples

### Example 1: Simple Math Workflow

1. Add Trigger node with variables: `{"a": 10, "b": 5}`
2. Add Operator node (Math > Add)
   - Input a: `$a`
   - Input b: `$b`
   - Output: `sum`
3. Add Action node (Log)
   - Message: `Result is $sum`
4. Connect: Trigger → Operator → Action
5. Run workflow

### Example 2: Conditional Logic

1. Add Trigger with `{"temperature": 75}`
2. Add Condition node: `$temperature` > `70`
3. Add two Action nodes for true/false paths
4. Connect condition to both actions
5. Run to see conditional execution

### Example 3: Complex Boolean Logic

1. Add Trigger with `{"age": 25, "country": "USA", "verified": true}`
2. Add Boolean Logic node
   - Operator: AND
   - Add condition: `$age` >= `18`
   - Add condition: `$country` equals `USA`
   - Add condition: `$verified` equals `true`
3. Add Action nodes for result
4. Execute to verify all conditions

## Development

### Hot Module Replacement
The development server supports HMR for instant updates during development.

### TypeScript
Full TypeScript support with strict type checking enabled.

### Code Style
- Follow React best practices
- Use functional components with hooks
- Maintain type safety throughout

## Future Enhancements

- [ ] Custom node types
- [ ] Loop/iteration nodes
- [ ] API integration nodes
- [ ] Database connectors
- [ ] Scheduling and triggers
- [ ] Workflow templates
- [ ] Collaborative editing
- [ ] Version control
- [ ] Testing framework
- [ ] Performance monitoring

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## License

MIT License - Feel free to use this project for any purpose.

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

Built with React, TypeScript, and React Flow
