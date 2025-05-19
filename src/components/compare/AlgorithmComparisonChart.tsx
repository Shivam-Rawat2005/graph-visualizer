
import { useGraphStore } from "@/store/graphStore";
import { useAlgorithmStore } from "@/store/algorithmStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlgorithmType } from "@/types/graph";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

const algorithmLabels: Record<AlgorithmType, string> = {
  dijkstra: "Dijkstra's",
  bellmanFord: "Bellman-Ford",
  floydWarshall: "Floyd-Warshall"
};

const AlgorithmComparisonChart: React.FC = () => {
  const { sourceNode, targetNode, graph } = useGraphStore();
  const { comparisonResults, runComparison } = useAlgorithmStore();
  
  // Prepare data for chart
  const chartData = comparisonResults.map(result => ({
    name: algorithmLabels[result.algorithm],
    time: result.executionTime,
  }));
  
  const handleRunComparison = () => {
    if (!sourceNode) {
      toast.error("Please select a source node");
      return;
    }
    
    runComparison(sourceNode);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Algorithm Comparison</h2>
        <Button onClick={handleRunComparison} disabled={!sourceNode || graph.nodes.length === 0}>
          Run Comparison
        </Button>
      </div>
      
      {comparisonResults.length > 0 ? (
        <>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} ms`, 'Execution Time']} />
                <Legend />
                <Bar dataKey="time" name="Execution Time (ms)" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Performance Results</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Algorithm</TableHead>
                  <TableHead className="text-right">Execution Time (ms)</TableHead>
                  {targetNode && <TableHead className="text-right">Distance to {targetNode}</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonResults.map((result) => (
                  <TableRow key={result.algorithm}>
                    <TableCell className="font-medium">{algorithmLabels[result.algorithm]}</TableCell>
                    <TableCell className="text-right">{result.executionTime.toFixed(2)}</TableCell>
                    {targetNode && (
                      <TableCell className="text-right">
                        {result.distances[targetNode] === Infinity ? 
                          "Not reachable" : 
                          result.distances[targetNode]}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {comparisonResults.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-md border text-sm">
              <h3 className="font-medium mb-2">Analysis</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Dijkstra's Algorithm:</strong> Best for non-negative edge weights, 
                  uses a priority queue to optimize finding the shortest path.
                </li>
                <li>
                  <strong>Bellman-Ford Algorithm:</strong> Can handle negative edge weights, 
                  but typically slower than Dijkstra's for most cases.
                </li>
                <li>
                  <strong>Floyd-Warshall Algorithm:</strong> Computes shortest paths between all 
                  pairs of nodes, most efficient for dense graphs.
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-md border">
          <p className="text-gray-500">
            Select a source node and run the comparison to see algorithm performance details
          </p>
        </div>
      )}
    </div>
  );
};

export default AlgorithmComparisonChart;
