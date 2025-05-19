
import { Graph, NodeId, AlgorithmResult, AlgorithmStep } from "@/types/graph";

export const runBellmanFord = async (graph: Graph, sourceId: NodeId): Promise<AlgorithmResult> => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  
  // Validate source node exists
  if (!graph.nodes.find(node => node.id === sourceId)) {
    throw new Error("Source node not found in graph");
  }
  
  // Initialize distances and paths
  const distances: Record<NodeId, number> = {};
  const previous: Record<NodeId, NodeId | null> = {};
  
  // Initialize all nodes
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === sourceId ? 0 : Infinity;
    previous[node.id] = null;
  });
  
  // Add initialization step
  steps.push({
    type: 'init',
    description: `Initialize distances: set ${sourceId} to 0 and all others to infinity`,
    distances: { ...distances },
  });
  
  const nodeCount = graph.nodes.length;
  const visitedNodes = new Set<NodeId>([sourceId]);
  
  // Relax edges repeatedly
  for (let i = 1; i < nodeCount; i++) {
    let updated = false;
    
    steps.push({
      type: 'visit',
      description: `Iteration ${i} of ${nodeCount-1}`,
      visitedNodes: Array.from(visitedNodes),
      distances: { ...distances },
    });
    
    // Go through all edges
    for (const edge of graph.edges) {
      if (distances[edge.source] === Infinity) continue;
      
      const newDistance = distances[edge.source] + edge.weight;
      
      // Update if we found a shorter path
      if (newDistance < distances[edge.target]) {
        distances[edge.target] = newDistance;
        previous[edge.target] = edge.source;
        updated = true;
        
        // Add node to visited set
        visitedNodes.add(edge.target);
        
        // Add update step
        steps.push({
          type: 'update',
          description: `Update distance to ${edge.target} via ${edge.source}: ${distances[edge.target]} → ${newDistance}`,
          currentNode: edge.target,
          visitedNodes: Array.from(visitedNodes),
          distances: { ...distances },
        });
      }
    }
    
    // If no updates were made in this round, we can stop early
    if (!updated) break;
  }
  
  // Check for negative cycles
  for (const edge of graph.edges) {
    if (distances[edge.source] === Infinity) continue;
    
    const newDistance = distances[edge.source] + edge.weight;
    
    if (newDistance < distances[edge.target]) {
      const endTime = performance.now();
      
      steps.push({
        type: 'final',
        description: `Negative cycle detected involving edge from ${edge.source} to ${edge.target}`,
        visitedNodes: Array.from(visitedNodes),
        distances: { ...distances },
      });
      
      throw new Error("Graph contains a negative weight cycle");
    }
  }
  
  // Reconstruct paths
  const paths: Record<NodeId, NodeId[]> = {};
  
  graph.nodes.forEach(node => {
    const path: NodeId[] = [];
    let current: NodeId | null = node.id;
    
    // Trace path back to source
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    // Only include if reachable
    if (path.length > 0 && path[0] === sourceId) {
      paths[node.id] = path;
    } else {
      paths[node.id] = [];
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
