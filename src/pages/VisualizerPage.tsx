
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GraphCanvas from "@/components/graph/GraphCanvas";
import GraphControls from "@/components/graph/GraphControls";
import AlgorithmControls from "@/components/graph/AlgorithmControls";
import GraphLegend from "@/components/graph/GraphLegend";
import { useGraphStore } from "@/store/graphStore";

const VisualizerPage = () => {
  // Load a small example graph if the graph is empty
  const { graph, loadExampleGraph } = useGraphStore();
  
  useEffect(() => {
    if (graph.nodes.length === 0) {
      loadExampleGraph('small');
    }
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">Graph Algorithm Visualizer</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <GraphControls />
            
            <div className="h-[500px]">
              <GraphCanvas />
            </div>
            
            <AlgorithmControls />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-md border shadow-sm">
              <h2 className="font-medium mb-4">Instructions</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-medium">Creating Your Graph</h3>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Click <strong>Add Node</strong> and then click on the canvas to place nodes</li>
                    <li>Click <strong>Add Edge</strong>, click a source node, then a target node</li>
                    <li>Select a node and click <strong>Set as Source</strong> to set your starting point</li>
                    <li>Optionally set a target node to visualize the path to it</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-medium">Running Algorithms</h3>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Select an algorithm from the dropdown</li>
                    <li>Click <strong>Run Algorithm</strong> to start</li>
                    <li>Use the playback controls to watch the algorithm work step by step</li>
                    <li>Check the result panel to see the final distances and execution time</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <GraphLegend />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VisualizerPage;
