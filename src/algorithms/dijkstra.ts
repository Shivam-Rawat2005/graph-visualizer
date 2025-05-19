
import { Graph, NodeId, AlgorithmResult, AlgorithmStep } from "@/types/graph";
import { PriorityQueue } from "./util";

export const runDijkstra = async (graph: Graph, sourceId: NodeId): Promise<AlgorithmResult> => {
  const startTime = performance.now();
  const steps: AlgorithmStep[] = [];
  
  // Validate source node exists
  if (!graph.nodes.find(node => node.id === sourceId)) {
    throw new Error("Source node not found in graph");
  }
  
  // Initialize distances and paths
  const distances: Record<NodeId, number> = {};
  const previous: Record<NodeId, NodeId | null> = {};
  const visited: Set<NodeId> = new Set();
  
  // Create adjacency list for faster lookups
  const adjacencyList: Record<NodeId, Array<{node: NodeId, weight: number}>> = {};
  
  // Initialize all nodes
  graph.nodes.forEach(node => {
    distances[node.id] = node.id === sourceId ? 0 : Infinity;
    previous[node.id] = null;
    adjacencyList[node.id] = [];
  });
  
  // Build adjacency list
  graph.edges.forEach(edge => {
    adjacencyList[edge.source].push({ node: edge.target, weight: edge.weight });
  });
  
  // Add initialization step
  steps.push({
    type: 'init',
    description: `Initialize distances: set ${sourceId} to 0 and all others to infinity`,
    distances: { ...distances },
  });
  
  // Create priority queue
  const pq = new PriorityQueue<NodeId>();
  pq.enqueue(sourceId, 0);
  
  // Dijkstra's algorithm
  while (!pq.isEmpty()) {
    const { element: currentNode, priority: currentDistance } = pq.dequeue()!;
    
    // Skip if we've processed this node
    if (visited.has(currentNode)) continue;
    
    // Mark as visited
    visited.add(currentNode);
    
    // Add visit step
    steps.push({
      type: 'visit',
      description: `Visit node ${currentNode} with distance ${currentDistance}`,
      currentNode,
      visitedNodes: Array.from(visited),
      distances: { ...distances },
    });
    
    // Explore neighbors
    for (const { node: neighbor, weight } of adjacencyList[currentNode]) {
      // Skip if neighbor already processed
      if (visited.has(neighbor)) continue;
      
      // Calculate new distance
      const newDistance = distances[currentNode] + weight;
      
      // Update if we found a shorter path
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = currentNode;
        
        // Add update step
        steps.push({
          type: 'update',
          description: `Update distance to ${neighbor} via ${currentNode}: ${distances[neighbor]} → ${newDistance}`,
          currentNode,
          distances: { ...distances },
          visitedNodes: Array.from(visited),
        });
        
        // Add to priority queue
        pq.enqueue(neighbor, newDistance);
      }
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
    visitedNodes: Array.from(visited),
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
