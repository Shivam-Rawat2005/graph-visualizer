
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t py-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">GraphViz</h3>
            <p className="text-gray-600 text-sm">
              An interactive tool for visualizing graph algorithms, designed for everyone.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Features</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/visualizer" className="text-sm text-gray-600 hover:text-primary">
                  Interactive Graph Editor
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-sm text-gray-600 hover:text-primary">
                  Algorithm Comparison
                </Link>
              </li>
              <li>
                <Link to="/learn" className="text-sm text-gray-600 hover:text-primary">
                  Learning Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Algorithms</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/learn/dijkstra" className="text-sm text-gray-600 hover:text-primary">
                  Dijkstra's Algorithm
                </Link>
              </li>
              <li>
                <Link to="/learn/bellman-ford" className="text-sm text-gray-600 hover:text-primary">
                  Bellman-Ford Algorithm
                </Link>
              </li>
              <li>
                <Link to="/learn/floyd-warshall" className="text-sm text-gray-600 hover:text-primary">
                  Floyd-Warshall Algorithm
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/learn/basics" className="text-sm text-gray-600 hover:text-primary">
                  Graph Theory Basics
                </Link>
              </li>
              <li>
                <Link to="/learn/shortest-path" className="text-sm text-gray-600 hover:text-primary">
                  Shortest Path Problems
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} GraphViz. An educational tool for graph algorithms.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
