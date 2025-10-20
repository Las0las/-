/**
 * Workflow Canvas - Drag and Drop Workflow Builder
 * Handles the visual workflow creation with drag-and-drop functionality
 */

class WorkflowCanvas {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.draggingNode = null;
        this.connectingFrom = null;
        this.offset = { x: 0, y: 0 };
        this.scale = 1;
        this.panOffset = { x: 0, y: 0 };
        this.isPanning = false;
        this.nodeIdCounter = 0;

        this.init();
    }

    init() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'workflow-canvas';
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        // Event listeners
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));

        // Handle window resize
        window.addEventListener('resize', () => {
            this.canvas.width = this.container.clientWidth;
            this.canvas.height = this.container.clientHeight;
            this.render();
        });

        // Initial render
        this.render();
    }

    addNode(type, x, y, data = {}) {
        const node = {
            id: `node_${this.nodeIdCounter++}`,
            type: type,
            x: x || 100,
            y: y || 100,
            width: 180,
            height: 80,
            inputs: this.getNodeInputs(type),
            outputs: this.getNodeOutputs(type),
            data: data,
            color: this.getNodeColor(type)
        };

        this.nodes.push(node);
        this.render();
        return node;
    }

    getNodeInputs(type) {
        switch(type) {
            case 'trigger':
                return [];
            case 'action':
                return ['input'];
            case 'condition':
                return ['input'];
            case 'operator':
                return ['A', 'B'];
            case 'boolean':
                return ['input'];
            default:
                return ['input'];
        }
    }

    getNodeOutputs(type) {
        switch(type) {
            case 'trigger':
                return ['start'];
            case 'action':
                return ['output'];
            case 'condition':
                return ['true', 'false'];
            case 'operator':
                return ['result'];
            case 'boolean':
                return ['output'];
            default:
                return ['output'];
        }
    }

    getNodeColor(type) {
        const colors = {
            'trigger': '#4CAF50',
            'action': '#2196F3',
            'condition': '#FF9800',
            'operator': '#9C27B0',
            'boolean': '#F44336'
        };
        return colors[type] || '#607D8B';
    }

    deleteNode(node) {
        // Remove connections
        this.connections = this.connections.filter(conn =>
            conn.from.node !== node && conn.to.node !== node
        );

        // Remove node
        this.nodes = this.nodes.filter(n => n !== node);
        this.selectedNode = null;
        this.render();
    }

    addConnection(fromNode, fromOutput, toNode, toInput) {
        const connection = {
            from: { node: fromNode, output: fromOutput },
            to: { node: toNode, input: toInput }
        };

        this.connections.push(connection);
        this.render();
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.panOffset.x) / this.scale;
        const y = (e.clientY - rect.top - this.panOffset.y) / this.scale;

        // Check if clicking on a node
        const clickedNode = this.getNodeAt(x, y);

        if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
            // Middle click or Ctrl+Click - start panning
            this.isPanning = true;
            this.offset = { x: e.clientX - this.panOffset.x, y: e.clientY - this.panOffset.y };
            this.canvas.style.cursor = 'grabbing';
            return;
        }

        if (clickedNode) {
            // Check if clicking on output port (for connecting)
            const outputPort = this.getOutputPortAt(clickedNode, x, y);
            if (outputPort) {
                this.connectingFrom = { node: clickedNode, output: outputPort };
                return;
            }

            // Start dragging
            this.draggingNode = clickedNode;
            this.selectedNode = clickedNode;
            this.offset = {
                x: x - clickedNode.x,
                y: y - clickedNode.y
            };
        } else {
            this.selectedNode = null;
        }

        this.render();
    }

    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.panOffset.x) / this.scale;
        const y = (e.clientY - rect.top - this.panOffset.y) / this.scale;

        if (this.isPanning) {
            this.panOffset.x = e.clientX - this.offset.x;
            this.panOffset.y = e.clientY - this.offset.y;
            this.render();
            return;
        }

        if (this.draggingNode) {
            this.draggingNode.x = x - this.offset.x;
            this.draggingNode.y = y - this.offset.y;
            this.render();
        }

        if (this.connectingFrom) {
            this.render();
            // Draw temporary connection line
            const fromPort = this.getOutputPortPosition(this.connectingFrom.node, this.connectingFrom.output);
            this.ctx.save();
            this.ctx.setTransform(this.scale, 0, 0, this.scale, this.panOffset.x, this.panOffset.y);
            this.ctx.strokeStyle = '#888';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 5]);
            this.ctx.beginPath();
            this.ctx.moveTo(fromPort.x, fromPort.y);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
            this.ctx.restore();
        }

        // Update cursor
        const hoveredNode = this.getNodeAt(x, y);
        if (hoveredNode || this.connectingFrom) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    handleMouseUp(e) {
        if (this.isPanning) {
            this.isPanning = false;
            this.canvas.style.cursor = 'default';
            return;
        }

        if (this.connectingFrom) {
            const rect = this.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.panOffset.x) / this.scale;
            const y = (e.clientY - rect.top - this.panOffset.y) / this.scale;

            const targetNode = this.getNodeAt(x, y);
            if (targetNode && targetNode !== this.connectingFrom.node) {
                const inputPort = this.getInputPortAt(targetNode, x, y);
                if (inputPort) {
                    this.addConnection(
                        this.connectingFrom.node,
                        this.connectingFrom.output,
                        targetNode,
                        inputPort
                    );
                }
            }
            this.connectingFrom = null;
        }

        this.draggingNode = null;
        this.render();
    }

    handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.scale *= delta;
        this.scale = Math.max(0.1, Math.min(3, this.scale));
        this.render();
    }

    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left - this.panOffset.x) / this.scale;
        const y = (e.clientY - rect.top - this.panOffset.y) / this.scale;

        const node = this.getNodeAt(x, y);
        if (node) {
            this.editNode(node);
        }
    }

    editNode(node) {
        // Dispatch event for external handling
        const event = new CustomEvent('nodeEdit', { detail: node });
        this.container.dispatchEvent(event);
    }

    getNodeAt(x, y) {
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            const node = this.nodes[i];
            if (x >= node.x && x <= node.x + node.width &&
                y >= node.y && y <= node.y + node.height) {
                return node;
            }
        }
        return null;
    }

    getOutputPortAt(node, x, y) {
        const portSize = 12;
        const spacing = node.width / (node.outputs.length + 1);

        for (let i = 0; i < node.outputs.length; i++) {
            const portX = node.x + spacing * (i + 1);
            const portY = node.y + node.height;

            if (Math.abs(x - portX) < portSize && Math.abs(y - portY) < portSize) {
                return node.outputs[i];
            }
        }
        return null;
    }

    getInputPortAt(node, x, y) {
        const portSize = 12;
        const spacing = node.width / (node.inputs.length + 1);

        for (let i = 0; i < node.inputs.length; i++) {
            const portX = node.x + spacing * (i + 1);
            const portY = node.y;

            if (Math.abs(x - portX) < portSize && Math.abs(y - portY) < portSize) {
                return node.inputs[i];
            }
        }
        return null;
    }

    getOutputPortPosition(node, output) {
        const index = node.outputs.indexOf(output);
        const spacing = node.width / (node.outputs.length + 1);
        return {
            x: node.x + spacing * (index + 1),
            y: node.y + node.height
        };
    }

    getInputPortPosition(node, input) {
        const index = node.inputs.indexOf(input);
        const spacing = node.width / (node.inputs.length + 1);
        return {
            x: node.x + spacing * (index + 1),
            y: node.y
        };
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply transformations
        this.ctx.save();
        this.ctx.setTransform(this.scale, 0, 0, this.scale, this.panOffset.x, this.panOffset.y);

        // Draw grid
        this.drawGrid();

        // Draw connections
        this.connections.forEach(conn => this.drawConnection(conn));

        // Draw nodes
        this.nodes.forEach(node => this.drawNode(node));

        this.ctx.restore();
    }

    drawGrid() {
        const gridSize = 20;
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 0.5;

        const startX = Math.floor(-this.panOffset.x / this.scale / gridSize) * gridSize;
        const startY = Math.floor(-this.panOffset.y / this.scale / gridSize) * gridSize;
        const endX = startX + (this.canvas.width / this.scale) + gridSize;
        const endY = startY + (this.canvas.height / this.scale) + gridSize;

        for (let x = startX; x < endX; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, startY);
            this.ctx.lineTo(x, endY);
            this.ctx.stroke();
        }

        for (let y = startY; y < endY; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(startX, y);
            this.ctx.lineTo(endX, y);
            this.ctx.stroke();
        }
    }

    drawNode(node) {
        const isSelected = node === this.selectedNode;

        // Draw node body
        this.ctx.fillStyle = node.color;
        this.ctx.strokeStyle = isSelected ? '#FFD700' : '#333';
        this.ctx.lineWidth = isSelected ? 3 : 2;

        this.roundRect(node.x, node.y, node.width, node.height, 8);
        this.ctx.fill();
        this.ctx.stroke();

        // Draw node header
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.roundRect(node.x, node.y, node.width, 25, 8, true, false);
        this.ctx.fill();

        // Draw node title
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(node.type.toUpperCase(), node.x + node.width / 2, node.y + 17);

        // Draw node data
        if (node.data && node.data.label) {
            this.ctx.font = '11px Arial';
            this.ctx.fillText(node.data.label, node.x + node.width / 2, node.y + 50);
        }

        // Draw input ports
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        const inputSpacing = node.width / (node.inputs.length + 1);
        node.inputs.forEach((input, i) => {
            const x = node.x + inputSpacing * (i + 1);
            const y = node.y;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // Label
            this.ctx.fillStyle = '#333';
            this.ctx.font = '9px Arial';
            this.ctx.fillText(input, x, y - 10);
        });

        // Draw output ports
        this.ctx.fillStyle = '#fff';
        this.ctx.strokeStyle = '#333';
        const outputSpacing = node.width / (node.outputs.length + 1);
        node.outputs.forEach((output, i) => {
            const x = node.x + outputSpacing * (i + 1);
            const y = node.y + node.height;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 6, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();

            // Label
            this.ctx.fillStyle = '#333';
            this.ctx.font = '9px Arial';
            this.ctx.fillText(output, x, y + 15);
        });
    }

    drawConnection(conn) {
        const fromPos = this.getOutputPortPosition(conn.from.node, conn.from.output);
        const toPos = this.getInputPortPosition(conn.to.node, conn.to.input);

        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([]);

        // Draw bezier curve
        this.ctx.beginPath();
        this.ctx.moveTo(fromPos.x, fromPos.y);

        const cp1y = fromPos.y + (toPos.y - fromPos.y) / 2;
        const cp2y = toPos.y - (toPos.y - fromPos.y) / 2;

        this.ctx.bezierCurveTo(
            fromPos.x, cp1y,
            toPos.x, cp2y,
            toPos.x, toPos.y
        );
        this.ctx.stroke();
    }

    roundRect(x, y, width, height, radius, topOnly = false, bottomOnly = false) {
        this.ctx.beginPath();

        if (topOnly) {
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.ctx.lineTo(x + width, y + height);
            this.ctx.lineTo(x, y + height);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
        } else {
            this.ctx.moveTo(x + radius, y);
            this.ctx.lineTo(x + width - radius, y);
            this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            this.ctx.lineTo(x + width, y + height - radius);
            this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            this.ctx.lineTo(x + radius, y + height);
            this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            this.ctx.lineTo(x, y + radius);
            this.ctx.quadraticCurveTo(x, y, x + radius, y);
        }

        this.ctx.closePath();
    }

    exportWorkflow() {
        return {
            nodes: this.nodes,
            connections: this.connections
        };
    }

    importWorkflow(data) {
        this.nodes = data.nodes || [];
        this.connections = data.connections || [];
        this.nodeIdCounter = this.nodes.length;
        this.render();
    }

    clear() {
        this.nodes = [];
        this.connections = [];
        this.selectedNode = null;
        this.render();
    }
}
