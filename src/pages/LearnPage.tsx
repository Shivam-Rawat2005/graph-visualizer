
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AlgorithmDetails from "@/components/learn/AlgorithmDetails";
import { AlgorithmType } from "@/types/graph";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LearnPage = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('dijkstra');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-6">Learn Graph Algorithms</h1>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 border rounded-md shadow-sm">
            <h2 className="text-xl font-medium mb-4">Introduction to Graph Theory</h2>
            
            <div className="prose max-w-none">
              <p>
                Graph theory is a fundamental area of mathematics and computer science that studies the 
                relationships between objects. A graph is a mathematical structure consisting of nodes 
                (vertices) connected by edges.
              </p>
              
              <h3>Key Concepts in Graph Theory</h3>
              
              <ul>
                <li><strong>Nodes/Vertices:</strong> The fundamental units of a graph, representing objects or entities.</li>
                <li><strong>Edges:</strong> Connections between nodes, representing relationships or links.</li>
                <li><strong>Directed vs Undirected:</strong> In directed graphs, edges have a direction, while in undirected graphs they don't.</li>
                <li><strong>Weighted vs Unweighted:</strong> Weighted graphs have values (weights) associated with edges.</li>
                <li><strong>Path:</strong> A sequence of edges connecting a sequence of vertices.</li>
                <li><strong>Cycle:</strong> A path that starts and ends at the same vertex.</li>
              </ul>
              
              <h3>Applications of Graph Theory</h3>
              
              <p>
                Graphs are incredibly versatile and are used to model various real-world systems:
              </p>
              
              <ul>
                <li>Transportation networks (roads, flights, railways)</li>
                <li>Social networks (friendships, followers)</li>
                <li>Computer networks (internet connections, data flows)</li>
                <li>Biological networks (protein interactions, ecological food webs)</li>
                <li>Recommendation systems (product relationships, content similarity)</li>
              </ul>
              
              <h3>Shortest Path Problems</h3>
              
              <p>
                One of the most common problems in graph theory is finding the shortest path between nodes. 
                This is particularly important in:
              </p>
              
              <ul>
                <li>Navigation systems and route planning</li>
                <li>Network routing protocols</li>
                <li>Resource allocation</li>
                <li>Circuit design and telecommunications</li>
              </ul>
              
              <p>
                Several algorithms have been developed to solve shortest path problems efficiently, 
                with different approaches suited to different types of graphs and constraints.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 border rounded-md shadow-sm">
            <h2 className="text-xl font-medium mb-4">Shortest Path Algorithms</h2>
            
            <Tabs 
              defaultValue="dijkstra" 
              onValueChange={(value) => setSelectedAlgorithm(value as AlgorithmType)}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="dijkstra">Dijkstra's</TabsTrigger>
                <TabsTrigger value="bellmanFord">Bellman-Ford</TabsTrigger>
                <TabsTrigger value="floydWarshall">Floyd-Warshall</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dijkstra">
                <AlgorithmDetails algorithm="dijkstra" />
              </TabsContent>
              
              <TabsContent value="bellmanFord">
                <AlgorithmDetails algorithm="bellmanFord" />
              </TabsContent>
              
              <TabsContent value="floydWarshall">
                <AlgorithmDetails algorithm="floydWarshall" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LearnPage;
