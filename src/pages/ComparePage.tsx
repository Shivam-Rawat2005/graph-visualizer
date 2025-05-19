
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GraphCanvas from "@/components/graph/GraphCanvas";
import GraphControls from "@/components/graph/GraphControls";
import AlgorithmComparisonChart from "@/components/compare/AlgorithmComparisonChart";
import { useGraphStore } from "@/store/graphStore";
import { Separator } from "@/components/ui/separator";

const ComparePage = () => {
  // Load a medium example graph if the graph is empty
  const { graph, loadExampleGraph } = useGraphStore();
  
  useEffect(() => {
    if (graph.nodes.length === 0) {
      loadExampleGraph('medium');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">Algorithm Comparison</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white p-4 border rounded-md shadow-sm">
              <h2 className="text-xl font-medium mb-4">Graph Setup</h2>
              <GraphControls />
              
              <div className="h-[400px] mt-4">
                <GraphCanvas />
              </div>
            </div>
            
            <div className="bg-white p-4 border rounded-md shadow-sm">
              <h2 className="text-xl font-medium mb-4">When to Use Each Algorithm</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Dijkstra's Algorithm</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Best for graphs with non-negative edge weights. Most efficient for sparse graphs 
                    and when you only need the shortest path from one source to one or all destinations.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium">Bellman-Ford Algorithm</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Use when the graph might contain negative edge weights. It's slower than Dijkstra's, 
                    but can detect negative cycles and works with a wider range of graphs.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium">Floyd-Warshall Algorithm</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Ideal when you need shortest paths between all pairs of nodes. It's 
                    more efficient for dense graphs and has a simpler implementation but has
                    higher time complexity (O(V³)).
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 border rounded-md shadow-sm">
            <AlgorithmComparisonChart />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparePage;
