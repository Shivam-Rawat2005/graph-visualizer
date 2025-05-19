
import { create } from "zustand";
import { AlgorithmType, AlgorithmResult, ComparisonResult, NodeId } from "@/types/graph";
import { runDijkstra } from "@/algorithms/dijkstra";
import { runBellmanFord } from "@/algorithms/bellmanFord";
import { runFloydWarshall } from "@/algorithms/floydWarshall";
import { useGraphStore } from "./graphStore";
import { toast } from "sonner";

interface AlgorithmState {
  currentAlgorithm: AlgorithmType | null;
  algorithmResults: Record<AlgorithmType, AlgorithmResult | null>;
  comparisonResults: ComparisonResult[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;  // in milliseconds
  
  // Algorithm actions
  runAlgorithm: (algorithm: AlgorithmType, sourceId: NodeId) => Promise<void>;
  runComparison: (sourceId: NodeId) => Promise<void>;
  clearResults: () => void;
  
  // Animation controls
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  play: () => void;
  pause: () => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  currentAlgorithm: null,
  algorithmResults: {
    dijkstra: null,
    bellmanFord: null,
    floydWarshall: null,
  },
  comparisonResults: [],
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1000,
  
  runAlgorithm: async (algorithm, sourceId) => {
    const graph = useGraphStore.getState().graph;
    
    if (graph.nodes.length === 0) {
      toast.error("Graph is empty. Please add some nodes and edges.");
      return;
    }
    
    if (!sourceId) {
      toast.error("Please select a source node.");
      return;
    }
    
    let result: AlgorithmResult | null = null;
    
    // Run the selected algorithm
    try {
      switch (algorithm) {
        case 'dijkstra':
          result = await runDijkstra(graph, sourceId);
          break;
        case 'bellmanFord':
          result = await runBellmanFord(graph, sourceId);
          break;
        case 'floydWarshall':
          result = await runFloydWarshall(graph, sourceId);
          break;
      }
      
      set(state => ({
        currentAlgorithm: algorithm,
        algorithmResults: {
          ...state.algorithmResults,
          [algorithm]: result
        },
        currentStepIndex: 0,
        isPlaying: false
      }));
      
      toast.success(`${algorithm} algorithm completed successfully`);
    } catch (error) {
      console.error(`Error running ${algorithm}:`, error);
      toast.error(`Error running ${algorithm}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  runComparison: async (sourceId) => {
    const graph = useGraphStore.getState().graph;
    
    if (graph.nodes.length === 0) {
      toast.error("Graph is empty. Please add some nodes and edges.");
      return;
    }
    
    if (!sourceId) {
      toast.error("Please select a source node.");
      return;
    }
    
    const comparisonResults: ComparisonResult[] = [];
    
    try {
      // Run Dijkstra's
      const dijkstraResult = await runDijkstra(graph, sourceId);
      comparisonResults.push({
        algorithm: 'dijkstra',
        executionTime: dijkstraResult.executionTime,
        distances: dijkstraResult.distances
      });
      
      // Run Bellman-Ford
      const bellmanFordResult = await runBellmanFord(graph, sourceId);
      comparisonResults.push({
        algorithm: 'bellmanFord',
        executionTime: bellmanFordResult.executionTime,
        distances: bellmanFordResult.distances
      });
      
      // Run Floyd-Warshall
      const floydWarshallResult = await runFloydWarshall(graph, sourceId);
      comparisonResults.push({
        algorithm: 'floydWarshall',
        executionTime: floydWarshallResult.executionTime,
        distances: floydWarshallResult.distances
      });
      
      set({ comparisonResults });
      toast.success("Algorithm comparison completed successfully");
    } catch (error) {
      console.error("Error running comparison:", error);
      toast.error(`Error running comparison: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  clearResults: () => set({
    currentAlgorithm: null,
    algorithmResults: {
      dijkstra: null,
      bellmanFord: null,
      floydWarshall: null,
    },
    comparisonResults: [],
    currentStepIndex: 0,
    isPlaying: false
  }),
  
  nextStep: () => set(state => {
    const algorithm = state.currentAlgorithm;
    if (!algorithm) return state;
    
    const result = state.algorithmResults[algorithm];
    if (!result) return state;
    
    const nextIndex = Math.min(state.currentStepIndex + 1, result.steps.length - 1);
    return { currentStepIndex: nextIndex };
  }),
  
  prevStep: () => set(state => ({
    currentStepIndex: Math.max(state.currentStepIndex - 1, 0)
  })),
  
  goToStep: (index) => set(state => {
    const algorithm = state.currentAlgorithm;
    if (!algorithm) return state;
    
    const result = state.algorithmResults[algorithm];
    if (!result) return state;
    
    const clampedIndex = Math.max(0, Math.min(index, result.steps.length - 1));
    return { currentStepIndex: clampedIndex };
  }),
  
  play: () => {
    const state = get();
    const algorithm = state.currentAlgorithm;
    if (!algorithm) return;
    
    const result = state.algorithmResults[algorithm];
    if (!result) return;
    
    set({ isPlaying: true });
    
    // Set up interval for playback
    const playInterval = setInterval(() => {
      const currentState = get();
      
      if (!currentState.isPlaying) {
        clearInterval(playInterval);
        return;
      }
      
      // Check if we've reached the end
      if (currentState.currentStepIndex >= result.steps.length - 1) {
        clearInterval(playInterval);
        set({ isPlaying: false });
        return;
      }
      
      // Move to next step
      set({ currentStepIndex: currentState.currentStepIndex + 1 });
    }, state.playbackSpeed);
  },
  
  pause: () => set({ isPlaying: false }),
  
  setPlaybackSpeed: (speed) => set({ playbackSpeed: speed })
}));
