
import { useRef, useState, useEffect, useMemo } from "react";
import { useGraphStore } from "@/store/graphStore";
import { useAlgorithmStore } from "@/store/algorithmStore";
import { NodeId } from "@/types/graph";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const NODE_RADIUS = 20;
const EDGE_HITBOX_WIDTH = 10;

const GraphCanvas: React.FC = () => {
  const {
    graph,
    selectedNode,
    selectedEdge,
    sourceNode,
    targetNode,
    addNode,
    updateNode,
    removeNode,
    selectNode,
    addEdge,
    updateEdge,
    removeEdge,
    selectEdge
  } = useGraphStore();
  
  const { currentAlgorithm, algorithmResults, currentStepIndex } = useAlgorithmStore();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragNode, setDragNode] = useState<NodeId | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [mode, setMode] = useState<'select' | 'addNode' | 'addEdge'>('select');
  const [edgeStartNode, setEdgeStartNode] = useState<NodeId | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // Get current algorithm step information
  const currentStep = useMemo(() => {
    if (!currentAlgorithm || !algorithmResults[currentAlgorithm]) {
      return null;
    }
    return algorithmResults[currentAlgorithm].steps[currentStepIndex];
  }, [currentAlgorithm, algorithmResults, currentStepIndex]);
  
  // Set up canvas resize observer
  useEffect(() => {
    const resizeCanvas = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const { width, height } = canvasRef.current.parentElement.getBoundingClientRect();
        setCanvasSize({ width, height });
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }
    };
    
    resizeCanvas();
    
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }
    
    return () => resizeObserver.disconnect();
  }, []);
  
  // Draw graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(node => node.id === edge.source);
      const targetNode = graph.nodes.find(node => node.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      
      const isSelected = selectedEdge && 
                        selectedEdge.source === edge.source && 
                        selectedEdge.target === edge.target;
      
      // Determine if this edge is part of the path in the current step
      let isHighlighted = false;
      if (currentStep && currentStep.path) {
        const path = currentStep.path;
        for (let i = 0; i < path.length - 1; i++) {
          if (path[i] === edge.source && path[i+1] === edge.target) {
            isHighlighted = true;
            break;
          }
        }
      }
      
      // Determine edge color based on state
      let edgeColor;
      if (isHighlighted) {
        edgeColor = '#14b8a6'; // Highlight color
      } else if (isSelected) {
        edgeColor = '#8b5cf6'; // Selected color
      } else {
        edgeColor = '#94a3b8'; // Default color
      }
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();
      
      // Draw weight
      const midX = (sourceNode.x + targetNode.x) / 2;
      const midY = (sourceNode.y + targetNode.y) / 2;
      
      // Add white background to text
      ctx.font = '14px Arial';
      const textWidth = ctx.measureText(edge.weight.toString()).width;
      ctx.fillStyle = 'white';
      ctx.fillRect(midX - textWidth/2 - 2, midY - 9, textWidth + 4, 18);
      
      // Draw text
      ctx.fillStyle = '#1f2937';
      ctx.textAlign = 'center';
      ctx.fillText(edge.weight.toString(), midX, midY + 5);
      
      // Draw arrow
      const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
      const arrowX = targetNode.x - (NODE_RADIUS + 5) * Math.cos(angle);
      const arrowY = targetNode.y - (NODE_RADIUS + 5) * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - 12 * Math.cos(angle - Math.PI / 6),
        arrowY - 12 * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        arrowX - 12 * Math.cos(angle + Math.PI / 6),
        arrowY - 12 * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = edgeColor;
      ctx.fill();
    });
    
    // Draw nodes
    graph.nodes.forEach(node => {
      // Check node status based on algorithm state
      const isSource = node.id === sourceNode;
      const isTarget = node.id === targetNode;
      const isSelected = node.id === selectedNode;
      const isVisited = currentStep?.visitedNodes?.includes(node.id);
      const isCurrent = currentStep?.currentNode === node.id;
      
      // Determine node color based on state
      let nodeColor;
      if (isCurrent) {
        nodeColor = '#8b5cf6'; // Current node in purple
      } else if (isVisited) {
        nodeColor = '#10b981'; // Visited node in green
      } else if (isSource) {
        nodeColor = '#f59e0b'; // Source node in amber
      } else if (isTarget) {
        nodeColor = '#ef4444'; // Target node in red
      } else if (isSelected) {
        nodeColor = '#3b82f6'; // Selected node in blue
      } else {
        nodeColor = '#64748b'; // Default node in slate
      }
      
      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeStyle = isSelected ? '#1d4ed8' : '#475569';
      ctx.stroke();
      
      // Draw label
      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
      
      // If node has a distance in the current step, show it
      if (currentStep?.distances && currentStep.distances[node.id] !== undefined) {
        const distance = currentStep.distances[node.id];
        const displayValue = distance === Infinity ? '∞' : distance;
        
        // Draw distance with background
        ctx.font = '12px Arial';
        const textWidth = ctx.measureText(displayValue.toString()).width;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillRect(
          node.x + NODE_RADIUS - textWidth/2 - 2,
          node.y - NODE_RADIUS - 20,
          textWidth + 4,
          16
        );
        
        ctx.fillStyle = '#1f2937';
        ctx.textBaseline = 'top';
        ctx.fillText(
          displayValue.toString(),
          node.x + NODE_RADIUS,
          node.y - NODE_RADIUS - 18
        );
      }
    });
    
    // Draw edge being created (if any)
    if (edgeStartNode !== null && mode === 'addEdge') {
      const startNodeObj = graph.nodes.find(n => n.id === edgeStartNode);
      if (startNodeObj) {
        ctx.beginPath();
        ctx.moveTo(startNodeObj.x, startNodeObj.y);
        ctx.lineTo(mousePos.x, mousePos.y);
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [
    graph,
    selectedNode,
    selectedEdge,
    sourceNode,
    targetNode,
    canvasSize,
    edgeStartNode,
    mousePos,
    mode,
    currentStep
  ]);
  
  // Find node under cursor
  const findNodeAtPoint = (x: number, y: number): NodeId | null => {
    for (let i = graph.nodes.length - 1; i >= 0; i--) {
      const node = graph.nodes[i];
      const dx = node.x - x;
      const dy = node.y - y;
      if (dx * dx + dy * dy <= NODE_RADIUS * NODE_RADIUS) {
        return node.id;
      }
    }
    return null;
  };
  
  // Find edge under cursor
  const findEdgeAtPoint = (x: number, y: number): { source: NodeId; target: NodeId } | null => {
    for (const edge of graph.edges) {
      const sourceNode = graph.nodes.find(node => node.id === edge.source);
      const targetNode = graph.nodes.find(node => node.id === edge.target);
      
      if (!sourceNode || !targetNode) continue;
      
      // Calculate distance from point to line
      const A = x - sourceNode.x;
      const B = y - sourceNode.y;
      const C = targetNode.x - sourceNode.x;
      const D = targetNode.y - sourceNode.y;
      
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      
      if (len_sq !== 0) param = dot / len_sq;
      
      let xx, yy;
      
      if (param < 0) {
        xx = sourceNode.x;
        yy = sourceNode.y;
      } else if (param > 1) {
        xx = targetNode.x;
        yy = targetNode.y;
      } else {
        xx = sourceNode.x + param * C;
        yy = sourceNode.y + param * D;
      }
      
      const dx = x - xx;
      const dy = y - yy;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= EDGE_HITBOX_WIDTH) {
        return { source: edge.source, target: edge.target };
      }
    }
    
    return null;
  };
  
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (mode === 'addNode') {
      // Add a new node
      addNode(x, y);
      setMode('select'); // Switch back to select mode after adding
    } else if (mode === 'select') {
      // Try to select a node
      const nodeId = findNodeAtPoint(x, y);
      if (nodeId) {
        setDragNode(nodeId);
        selectNode(nodeId);
        selectEdge(null, null);
      } else {
        // Try to select an edge
        const edge = findEdgeAtPoint(x, y);
        if (edge) {
          selectEdge(edge.source, edge.target);
          selectNode(null);
        } else {
          // Clicked on empty space, deselect everything
          selectNode(null);
          selectEdge(null, null);
        }
      }
    } else if (mode === 'addEdge') {
      // Start creating an edge
      const nodeId = findNodeAtPoint(x, y);
      if (nodeId) {
        setEdgeStartNode(nodeId);
        setMousePos({ x, y });
      }
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });
    
    // If dragging a node, update its position
    if (dragNode) {
      updateNode(dragNode, { x, y });
    }
  };
  
  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // If we were creating an edge, try to finish it
    if (mode === 'addEdge' && edgeStartNode) {
      const endNodeId = findNodeAtPoint(x, y);
      
      if (endNodeId && endNodeId !== edgeStartNode) {
        // Prompt for edge weight
        const weight = parseInt(prompt("Enter edge weight:", "1") || "1");
        if (!isNaN(weight)) {
          addEdge(edgeStartNode, endNodeId, weight);
        }
      }
      
      setEdgeStartNode(null);
      setMode('select');
    }
    
    setDragNode(null);
  };
  
  // Delete selected node or edge
  const handleDelete = () => {
    if (selectedNode) {
      removeNode(selectedNode);
    } else if (selectedEdge) {
      removeEdge(selectedEdge.source, selectedEdge.target);
    }
  };
  
  // Edit selected node or edge
  const handleEdit = () => {
    if (selectedNode) {
      const newLabel = prompt("Enter new node label:", 
        graph.nodes.find(n => n.id === selectedNode)?.label || selectedNode);
      if (newLabel) {
        updateNode(selectedNode, { label: newLabel });
      }
    } else if (selectedEdge) {
      const edge = graph.edges.find(
        e => e.source === selectedEdge.source && e.target === selectedEdge.target
      );
      
      if (edge) {
        const newWeight = parseInt(prompt("Enter new edge weight:", edge.weight.toString()) || edge.weight.toString());
        if (!isNaN(newWeight)) {
          updateEdge(edge.source, edge.target, newWeight);
        }
      }
    }
  };
  
  // Set source or target node
  const handleSetAsSource = () => {
    if (!selectedNode) return;
    useGraphStore.getState().setSourceNode(selectedNode);
    toast.success(`Set ${selectedNode} as source node`);
  };
  
  const handleSetAsTarget = () => {
    if (!selectedNode) return;
    useGraphStore.getState().setTargetNode(selectedNode);
    toast.success(`Set ${selectedNode} as target node`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-2 mb-2">
        <Button 
          onClick={() => setMode('select')}
          variant={mode === 'select' ? 'default' : 'outline'}
          size="sm"
        >
          Select
        </Button>
        <Button 
          onClick={() => setMode('addNode')}
          variant={mode === 'addNode' ? 'default' : 'outline'}
          size="sm"
        >
          Add Node
        </Button>
        <Button 
          onClick={() => setMode('addEdge')}
          variant={mode === 'addEdge' ? 'default' : 'outline'}
          size="sm"
        >
          Add Edge
        </Button>
        
        {selectedNode && (
          <>
            <Button onClick={handleSetAsSource} size="sm" variant="outline">
              Set as Source
            </Button>
            <Button onClick={handleSetAsTarget} size="sm" variant="outline">
              Set as Target
            </Button>
          </>
        )}
        
        {(selectedNode || selectedEdge) && (
          <>
            <Button onClick={handleEdit} size="sm" variant="outline">
              Edit
            </Button>
            <Button onClick={handleDelete} size="sm" variant="destructive">
              Delete
            </Button>
          </>
        )}
      </div>
      
      <div className="flex-grow bg-gray-50 border rounded-md overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setDragNode(null)}
          className="cursor-crosshair"
        />
        
        {mode === 'addNode' && (
          <div className="absolute top-2 left-2 bg-white p-2 rounded shadow text-sm">
            Click anywhere to add a node
          </div>
        )}
        
        {mode === 'addEdge' && (
          <div className="absolute top-2 left-2 bg-white p-2 rounded shadow text-sm">
            Click on a source node, then click on a target node
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphCanvas;
