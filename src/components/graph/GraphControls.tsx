
import { Button } from "@/components/ui/button";
import { useGraphStore } from "@/store/graphStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GraphControls: React.FC = () => {
  const { clearGraph, loadExampleGraph } = useGraphStore();

  const handleLoadExample = (example: string) => {
    loadExampleGraph(example as 'small' | 'medium' | 'complex');
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex-grow md:max-w-xs">
        <Select onValueChange={handleLoadExample}>
          <SelectTrigger>
            <SelectValue placeholder="Load Example Graph" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Examples</SelectLabel>
              <SelectItem value="small">Small Graph (3 nodes)</SelectItem>
              <SelectItem value="medium">Medium Graph (5 nodes)</SelectItem>
              <SelectItem value="complex">Complex Graph (7 nodes)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => clearGraph()}
        variant="outline"
      >
        Clear Graph
      </Button>
    </div>
  );
};

export default GraphControls;
