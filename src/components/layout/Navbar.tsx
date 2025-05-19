
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <header className="bg-background shadow-sm border-b">
      <div className="container flex justify-between items-center h-16">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-gradient-to-r from-purple-500 to-violet-500 text-transparent bg-clip-text">
            GraphViz
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/visualizer" className="font-medium hover:text-primary transition-colors">
            Visualizer
          </Link>
          <Link to="/compare" className="font-medium hover:text-primary transition-colors">
            Compare
          </Link>
          <Link to="/learn" className="font-medium hover:text-primary transition-colors">
            Learn
          </Link>
        </nav>
        
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          <Button asChild variant="default" size="sm">
            <Link to="/visualizer">Try It Now</Link>
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden border-t">
        <div className="flex justify-around p-2">
          <Link to="/" className="flex flex-col items-center p-2">
            <span className="text-xs font-medium">Home</span>
          </Link>
          <Separator orientation="vertical" className="h-8" />
          <Link to="/visualizer" className="flex flex-col items-center p-2">
            <span className="text-xs font-medium">Visualizer</span>
          </Link>
          <Separator orientation="vertical" className="h-8" />
          <Link to="/compare" className="flex flex-col items-center p-2">
            <span className="text-xs font-medium">Compare</span>
          </Link>
          <Separator orientation="vertical" className="h-8" />
          <Link to="/learn" className="flex flex-col items-center p-2">
            <span className="text-xs font-medium">Learn</span>
          </Link>
          <Separator orientation="vertical" className="h-8" />
          <div className="flex flex-col items-center p-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
