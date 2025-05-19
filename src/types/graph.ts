
export type NodeId = string;

export interface Node {
  id: NodeId;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  source: NodeId;
  target: NodeId;
  weight: number;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

export type AlgorithmType = 'dijkstra' | 'bellmanFord' | 'floydWarshall';

export interface AlgorithmStep {
  type: 'init' | 'visit' | 'update' | 'final';
  description: string;
  visitedNodes?: NodeId[];
  currentNode?: NodeId;
  distances?: Record<NodeId, number>;
  path?: NodeId[];
}

export interface AlgorithmResult {
  steps: AlgorithmStep[];
  distances: Record<NodeId, number>;
  paths: Record<NodeId, NodeId[]>;
  executionTime: number;
}

export interface ComparisonResult {
  algorithm: AlgorithmType;
  executionTime: number;
  distances: Record<NodeId, number>;
}
