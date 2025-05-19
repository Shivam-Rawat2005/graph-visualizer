
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-16">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 space-y-6 md:pr-10 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Visualize Graph Algorithms With Ease
                </h1>
                <p className="text-lg text-gray-700">
                  An intuitive tool to understand and compare shortest path algorithms like Dijkstra's, 
                  Bellman-Ford, and Floyd-Warshall.
                </p>
                <div className="flex gap-4">
                  <Button asChild size="lg">
                    <Link to="/visualizer">Try It Now</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/learn">Learn More</Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-lg p-4 border">
                  <img 
                    src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80" 
                    alt="Graph visualization" 
                    className="rounded-lg w-full h-64 md:h-80 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Interactive Graph Editor</h3>
                <p className="text-gray-600">
                  Add nodes and edges with custom weights. Modify your graph in real-time with an intuitive interface.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Algorithm Visualization</h3>
                <p className="text-gray-600">
                  Watch algorithms run step-by-step and see how they find the shortest paths in your graph.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600">
                    <path d="M12 20v-6M6 20V10M18 20V4"/>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Algorithm Comparison</h3>
                <p className="text-gray-600">
                  Compare different algorithms side by side to understand their strengths, weaknesses, and performance.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-12">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Start Learning Graph Algorithms Today</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're a student, teacher, or just curious about algorithms, 
              our visualization tool helps make complex concepts simple.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/visualizer">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
