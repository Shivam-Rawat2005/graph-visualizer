
const GraphLegend: React.FC = () => {
  const legendItems = [
    { color: '#64748b', label: 'Normal Node' },
    { color: '#f59e0b', label: 'Source Node' },
    { color: '#ef4444', label: 'Target Node' },
    { color: '#10b981', label: 'Visited Node' },
    { color: '#8b5cf6', label: 'Current Node' },
    { color: '#3b82f6', label: 'Selected Node' },
    { color: '#60a5fa', label: 'Hovered Node' },
  ];
  
  const edgeLegendItems = [
    { color: '#94a3b8', label: 'Regular Edge' },
    { color: '#10b981', label: 'Path Edge', lineWidth: 4 },
    { color: '#8b5cf6', label: 'Selected Edge', lineWidth: 3 },
  ];

  return (
    <div className="bg-white border rounded-md p-4">
      <h3 className="font-medium mb-2 text-sm">Legend</h3>
      
      <div className="mb-3">
        <p className="text-xs font-medium mb-1">Nodes:</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {legendItems.map(({ color, label }) => (
            <div key={label} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <p className="text-xs font-medium mb-1">Edges:</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {edgeLegendItems.map(({ color, label, lineWidth }) => (
            <div key={label} className="flex items-center space-x-2">
              <div className="flex items-center">
                <div 
                  className="w-8 h-0 border-t"
                  style={{ 
                    borderColor: color,
                    borderWidth: lineWidth || 2 
                  }}
                />
              </div>
              <span className="text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraphLegend;
