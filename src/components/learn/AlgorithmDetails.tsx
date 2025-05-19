
import { AlgorithmType } from "@/types/graph";
import { Separator } from "@/components/ui/separator";

interface AlgorithmDetailsProps {
  algorithm: AlgorithmType;
}

const AlgorithmDetails: React.FC<AlgorithmDetailsProps> = ({ algorithm }) => {
  const details = {
    dijkstra: {
      name: "Dijkstra's Algorithm",
      description: "A greedy algorithm that finds the shortest path between nodes in a graph with non-negative edge weights.",
      timeComplexity: "O((V + E) log V) with a priority queue, where V is the number of vertices and E is the number of edges.",
      spaceComplexity: "O(V)",
      advantages: [
        "Efficient for sparse graphs",
        "Always finds the shortest path (if all edge weights are non-negative)",
        "Can be optimized with priority queue implementations"
      ],
      limitations: [
        "Cannot handle negative weights",
        "Less efficient for dense graphs",
        "Computes paths from only one source vertex"
      ],
      pseudocode: `
function Dijkstra(Graph, source):
    dist[source] = 0
    for each vertex v in Graph:
        if v ≠ source
            dist[v] = infinity
        add v to priority queue Q
    
    while Q is not empty:
        u = vertex in Q with min dist[u]
        remove u from Q
        
        for each neighbor v of u:
            alt = dist[u] + length(u, v)
            if alt < dist[v]:
                dist[v] = alt
                prev[v] = u
                
    return dist[], prev[]
      `
    },
    bellmanFord: {
      name: "Bellman-Ford Algorithm",
      description: "An algorithm that finds the shortest paths from a single source vertex to all other vertices, even in graphs with negative edge weights.",
      timeComplexity: "O(V × E) where V is the number of vertices and E is the number of edges.",
      spaceComplexity: "O(V)",
      advantages: [
        "Can handle negative edge weights",
        "Detects negative weight cycles",
        "Simpler implementation than Dijkstra's"
      ],
      limitations: [
        "Slower than Dijkstra's for non-negative weights",
        "Not suitable for large graphs due to its time complexity",
        "Cannot find shortest paths if negative cycles exist"
      ],
      pseudocode: `
function BellmanFord(Graph, source):
    dist[source] = 0
    for each vertex v in Graph:
        if v ≠ source
            dist[v] = infinity
            
    // Relax edges repeatedly
    for i = 1 to |V| - 1:
        for each edge (u, v) with weight w in Graph:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
                
    // Check for negative weight cycles
    for each edge (u, v) with weight w in Graph:
        if dist[u] + w < dist[v]:
            return "Graph contains a negative weight cycle"
            
    return dist[], prev[]
      `
    },
    floydWarshall: {
      name: "Floyd-Warshall Algorithm",
      description: "A dynamic programming algorithm for finding shortest paths between all pairs of vertices in a weighted graph.",
      timeComplexity: "O(V³) where V is the number of vertices.",
      spaceComplexity: "O(V²)",
      advantages: [
        "Finds all-pairs shortest paths in a single execution",
        "Can handle negative edge weights",
        "Simple implementation"
      ],
      limitations: [
        "Cubic time complexity makes it unsuitable for large graphs",
        "Cannot handle negative cycles",
        "Higher space complexity than Dijkstra's or Bellman-Ford"
      ],
      pseudocode: `
function FloydWarshall(Graph):
    dist = |V| × |V| matrix
    
    // Initialize distances
    for each vertex i in Graph:
        for each vertex j in Graph:
            if i == j:
                dist[i][j] = 0
            else if (i,j) is an edge in Graph:
                dist[i][j] = weight of edge (i,j)
            else:
                dist[i][j] = infinity
                
    // Consider paths through intermediate vertices
    for k = 1 to |V|:
        for i = 1 to |V|:
            for j = 1 to |V|:
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    
    return dist[][]
      `
    }
  };
  
  const algorithmInfo = details[algorithm];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{algorithmInfo.name}</h2>
      <p className="text-gray-700">{algorithmInfo.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Complexity</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Time Complexity:</span> {algorithmInfo.timeComplexity}
            </div>
            <div>
              <span className="font-medium">Space Complexity:</span> {algorithmInfo.spaceComplexity}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Advantages</h3>
            <ul className="list-disc pl-5 space-y-1">
              {algorithmInfo.advantages.map((advantage, index) => (
                <li key={index}>{advantage}</li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Limitations</h3>
            <ul className="list-disc pl-5 space-y-1">
              {algorithmInfo.limitations.map((limitation, index) => (
                <li key={index}>{limitation}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pseudocode</h3>
          <pre className="bg-slate-800 text-white p-3 rounded-md overflow-x-auto text-sm">
            <code>{algorithmInfo.pseudocode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetails;
