
import { create } from "zustand";
import { NodeId, Node, Edge, Graph } from "@/types/graph";

interface GraphState {
  graph: Graph;
  selectedNode: NodeId | null;
  selectedEdge: { source: NodeId; target: NodeId } | null;
  sourceNode: NodeId | null;
  targetNode: NodeId | null;
  
  // Node actions
  addNode: (x: number, y: number) => void;
  updateNode: (id: NodeId, updates: Partial<Node>) => void;
  removeNode: (id: NodeId) => void;
  selectNode: (id: NodeId | null) => void;
  
  // Edge actions
  addEdge: (source: NodeId, target: NodeId, weight: number) => void;
  updateEdge: (source: NodeId, target: NodeId, weight: number) => void;
  removeEdge: (source: NodeId, target: NodeId) => void;
  selectEdge: (source: NodeId | null, target: NodeId | null) => void;
  
  // Graph actions
  clearGraph: () => void;
  loadGraph: (graph: Graph) => void;
  setSourceNode: (id: NodeId | null) => void;
  setTargetNode: (id: NodeId | null) => void;
  
  // Example graphs
  loadExampleGraph: (type: 'small' | 'medium' | 'complex') => void;
}

let nodeIdCounter = 1;

const createInitialState = (): Pick<GraphState, 'graph' | 'selectedNode' | 'selectedEdge' | 'sourceNode' | 'targetNode'> => ({
  graph: {
    nodes: [],
    edges: []
  },
  selectedNode: null,
  selectedEdge: null,
  sourceNode: null,
  targetNode: null
});

export const useGraphStore = create<GraphState>((set, get) => ({
  ...createInitialState(),
  
  addNode: (x, y) => set(state => {
    const id = `node${nodeIdCounter++}`;
    return {
      graph: {
        ...state.graph,
        nodes: [...state.graph.nodes, { id, x, y, label: id }]
      }
    };
  }),
  
  updateNode: (id, updates) => set(state => ({
    graph: {
      ...state.graph,
      nodes: state.graph.nodes.map(node => 
        node.id === id ? { ...node, ...updates } : node
      )
    }
  })),
  
  removeNode: (id) => set(state => ({
    graph: {
      nodes: state.graph.nodes.filter(node => node.id !== id),
      edges: state.graph.edges.filter(edge => 
        edge.source !== id && edge.target !== id
      )
    },
    selectedNode: state.selectedNode === id ? null : state.selectedNode,
    sourceNode: state.sourceNode === id ? null : state.sourceNode,
    targetNode: state.targetNode === id ? null : state.targetNode
  })),
  
  selectNode: (id) => set({ selectedNode: id }),
  
  addEdge: (source, target, weight) => set(state => {
    // Don't add edge if it already exists
    const edgeExists = state.graph.edges.some(
      e => e.source === source && e.target === target
    );
    
    if (edgeExists || source === target) {
      return state;
    }
    
    return {
      graph: {
        ...state.graph,
        edges: [...state.graph.edges, { source, target, weight }]
      }
    };
  }),
  
  updateEdge: (source, target, weight) => set(state => ({
    graph: {
      ...state.graph,
      edges: state.graph.edges.map(edge => 
        (edge.source === source && edge.target === target) 
          ? { ...edge, weight } 
          : edge
      )
    }
  })),
  
  removeEdge: (source, target) => set(state => ({
    graph: {
      ...state.graph,
      edges: state.graph.edges.filter(
        edge => !(edge.source === source && edge.target === target)
      )
    },
    selectedEdge: (state.selectedEdge?.source === source && state.selectedEdge?.target === target) 
      ? null 
      : state.selectedEdge
  })),
  
  selectEdge: (source, target) => set({ 
    selectedEdge: source && target ? { source, target } : null 
  }),
  
  clearGraph: () => set(createInitialState()),
  
  loadGraph: (graph) => set({ graph }),
  
  setSourceNode: (id) => set({ sourceNode: id }),
  
  setTargetNode: (id) => set({ targetNode: id }),
  
  loadExampleGraph: (type) => {
    // Reset node counter
    nodeIdCounter = 1;
    
    if (type === 'small') {
      set({
        graph: {
          nodes: [
            { id: 'A', x: 100, y: 100, label: 'A' },
            { id: 'B', x: 250, y: 100, label: 'B' },
            { id: 'C', x: 175, y: 200, label: 'C' },
          ],
          edges: [
            { source: 'A', target: 'B', weight: 4 },
            { source: 'A', target: 'C', weight: 2 },
            { source: 'B', target: 'C', weight: 1 },
          ]
        },
        selectedNode: null,
        selectedEdge: null,
        sourceNode: 'A',
        targetNode: 'C'
      });
    } 
    else if (type === 'medium') {
      set({
        graph: {
          nodes: [
            { id: 'A', x: 100, y: 100, label: 'A' },
            { id: 'B', x: 250, y: 50, label: 'B' },
            { id: 'C', x: 400, y: 100, label: 'C' },
            { id: 'D', x: 250, y: 200, label: 'D' },
            { id: 'E', x: 175, y: 300, label: 'E' },
          ],
          edges: [
            { source: 'A', target: 'B', weight: 4 },
            { source: 'A', target: 'D', weight: 2 },
            { source: 'B', target: 'C', weight: 3 },
            { source: 'B', target: 'D', weight: 1 },
            { source: 'C', target: 'D', weight: 2 },
            { source: 'D', target: 'E', weight: 5 },
            { source: 'A', target: 'E', weight: 8 },
          ]
        },
        selectedNode: null,
        selectedEdge: null,
        sourceNode: 'A',
        targetNode: 'C'
      });
    } 
    else if (type === 'complex') {
      set({
        graph: {
          nodes: [
            { id: 'A', x: 100, y: 100, label: 'A' },
            { id: 'B', x: 250, y: 50, label: 'B' },
            { id: 'C', x: 400, y: 100, label: 'C' },
            { id: 'D', x: 250, y: 200, label: 'D' },
            { id: 'E', x: 100, y: 300, label: 'E' },
            { id: 'F', x: 400, y: 300, label: 'F' },
            { id: 'G', x: 250, y: 350, label: 'G' },
          ],
          edges: [
            { source: 'A', target: 'B', weight: 4 },
            { source: 'A', target: 'D', weight: 2 },
            { source: 'B', target: 'C', weight: 3 },
            { source: 'B', target: 'D', weight: 1 },
            { source: 'C', target: 'D', weight: 2 },
            { source: 'C', target: 'F', weight: 6 },
            { source: 'D', target: 'E', weight: 3 },
            { source: 'D', target: 'F', weight: 4 },
            { source: 'E', target: 'G', weight: 2 },
            { source: 'F', target: 'G', weight: 1 },
          ]
        },
        selectedNode: null,
        selectedEdge: null,
        sourceNode: 'A',
        targetNode: 'G'
      });
    }
  }
}));
