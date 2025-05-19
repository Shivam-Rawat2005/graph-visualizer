
const GraphLegend: React.FC = () => {
  const legendItems = [
    { color: '#64748b', label: 'Normal Node' },
    { color: '#f59e0b', label: 'Source Node' },
    { color: '#ef4444', label: 'Target Node' },
    { color: '#10b981', label: 'Visited Node' },
    { color: '#8b5cf6', label: 'Current Node' },
    { color: '#3b82f6', label: 'Selected Node' },
  ];

  return (
    <div className="bg-white border rounded-md p-4">
      <h3 className="font-medium mb-2 text-sm">Legend</h3>
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
  );
};

export default GraphLegend;
