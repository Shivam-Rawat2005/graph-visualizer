
import { Graph, NodeId, AlgorithmResult, AlgorithmStep } from "@/types/graph";

export const runFloydWarshall = async (graph: Graph, sourceId: NodeId): Promise<AlgorithmResult> => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  
  // Validate source node exists
  if (!graph.nodes.find(node => node.id === sourceId)) {
    throw new Error("Source node not found in graph");
  }
  
  // Get all node IDs
  const nodeIds = graph.nodes.map(node => node.id);
  
  // Initialize distances matrix
  const dist: Record<NodeId, Record<NodeId, number>> = {};
  const next: Record<NodeId, Record<NodeId, NodeId | null>> = {};
  
  // Initialize with infinity
  nodeIds.forEach(i => {
    dist[i] = {};
    next[i] = {};
    
    nodeIds.forEach(j => {
      dist[i][j] = i === j ? 0 : Infinity;
      next[i][j] = null;
    });
  });
  
  // Fill in direct edges
  graph.edges.forEach(edge => {
    dist[edge.source][edge.target] = edge.weight;
    next[edge.source][edge.target] = edge.target;
  });
  
  // Add initialization step
  steps.push({
    type: 'init',
    description: "Initialize distance matrix with direct edges",
    distances: dist[sourceId],
  });
  
  // Floyd-Warshall algorithm
  const visitedNodes = new Set<NodeId>();
  
  for (const k of nodeIds) {
    visitedNodes.add(k);
    
    steps.push({
      type: 'visit',
      description: `Consider paths through node ${k}`,
      currentNode: k,
      visitedNodes: Array.from(visitedNodes),
      distances: { ...dist[sourceId] }
    });
    
    for (const i of nodeIds) {
      for (const j of nodeIds) {
        const throughK = dist[i][k] + dist[k][j];
        
        if (throughK < dist[i][j]) {
          dist[i][j] = throughK;
          next[i][j] = next[i][k];
          
          if (i === sourceId) {
            steps.push({
              type: 'update',
              description: `Update distance from ${sourceId} to ${j} via ${k}: ${dist[sourceId][j]}`,
              visitedNodes: Array.from(visitedNodes),
              currentNode: j,
              distances: { ...dist[sourceId] }
            });
          }
        }
      }
    }
  }
  
  // Convert to format required by AlgorithmResult
  const distances: Record<NodeId, number> = {};
  const paths: Record<NodeId, NodeId[]> = {};
  
  nodeIds.forEach(target => {
    distances[target] = dist[sourceId][target];
    
    // Reconstruct path
    if (next[sourceId][target] !== null) {
      const path: NodeId[] = [sourceId];
      let at = sourceId;
      
      while (at !== target) {
        at = next[at][target]!;
        path.push(at);
      }
      
      paths[target] = path;
    } else {
      paths[target] = [];
    }
  });
  
  // Add final step
  steps.push({
    type: 'final',
    description: 'Algorithm completed',
    visitedNodes: Array.from(visitedNodes),
    distances: { ...distances },
  });
  
  const endTime = performance.now();
  
  return {
    steps,
    distances,
    paths,
    executionTime: endTime - startTime
  };
};
