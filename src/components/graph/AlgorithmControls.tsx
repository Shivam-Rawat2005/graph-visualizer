
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useGraphStore } from "@/store/graphStore";
import { useAlgorithmStore } from "@/store/algorithmStore";
import { AlgorithmType } from "@/types/graph";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const AlgorithmControls = () => {
  const { sourceNode, targetNode } = useGraphStore();
  const { 
    currentAlgorithm, 
    algorithmResults, 
    currentStepIndex, 
    isPlaying,
    playbackSpeed,
    runAlgorithm, 
    clearResults, 
    nextStep, 
    prevStep, 
    goToStep,
    play,
    pause,
    setPlaybackSpeed
  } = useAlgorithmStore();
  
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('dijkstra');
  
  const algorithmLabels: Record<AlgorithmType, string> = {
    dijkstra: "Dijkstra's Algorithm",
    bellmanFord: "Bellman-Ford Algorithm",
    floydWarshall: "Floyd-Warshall Algorithm"
  };
  
  const handleRunAlgorithm = () => {
    if (!sourceNode) {
      toast.error("Please select a source node");
      return;
    }
    
    runAlgorithm(algorithm, sourceNode);
  };
  
  const currentResult = currentAlgorithm ? algorithmResults[currentAlgorithm] : null;
  const totalSteps = currentResult?.steps.length || 0;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="space-y-2 flex-grow">
          <p className="text-sm font-medium">Select Algorithm</p>
          <Select
            value={algorithm}
            onValueChange={(value) => setAlgorithm(value as AlgorithmType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dijkstra">{algorithmLabels.dijkstra}</SelectItem>
              <SelectItem value="bellmanFord">{algorithmLabels.bellmanFord}</SelectItem>
              <SelectItem value="floydWarshall">{algorithmLabels.floydWarshall}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={handleRunAlgorithm} disabled={!sourceNode || isPlaying}>
          Run Algorithm
        </Button>
        
        <Button 
          onClick={clearResults} 
          variant="outline" 
          disabled={!currentAlgorithm}
        >
          Clear Results
        </Button>
      </div>
      
      {currentAlgorithm && totalSteps > 0 && (
        <>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium">
                Step {currentStepIndex + 1} of {totalSteps}
              </p>
              <div className="text-sm text-gray-500">
                {currentResult?.steps[currentStepIndex]?.description}
              </div>
            </div>
            
            <div className="pt-2">
              <Slider
                value={[currentStepIndex]}
                min={0}
                max={totalSteps - 1}
                step={1}
                onValueChange={(value) => goToStep(value[0])}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2">
              <Button
                onClick={prevStep}
                disabled={currentStepIndex === 0 || isPlaying}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              {isPlaying ? (
                <Button onClick={pause} variant="outline" size="sm">
                  Pause
                </Button>
              ) : (
                <Button 
                  onClick={play}
                  disabled={currentStepIndex >= totalSteps - 1} 
                  variant="outline" 
                  size="sm"
                >
                  Play
                </Button>
              )}
              
              <Button
                onClick={nextStep}
                disabled={currentStepIndex >= totalSteps - 1 || isPlaying}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Speed:</span>
              <Select
                value={playbackSpeed.toString()}
                onValueChange={(value) => setPlaybackSpeed(parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="250">Fast</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="1000">Slow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {currentResult && (
            <div className="bg-gray-50 p-3 rounded-md border text-sm">
              <p className="font-medium">Results:</p>
              <p>Algorithm: {algorithmLabels[currentAlgorithm]}</p>
              <p>Execution time: {currentResult.executionTime.toFixed(2)} ms</p>
              {targetNode && currentResult.distances[targetNode] !== undefined && (
                <p>
                  Distance to target: {
                    currentResult.distances[targetNode] === Infinity 
                      ? "Not reachable" 
                      : currentResult.distances[targetNode]
                  }
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlgorithmControls;
