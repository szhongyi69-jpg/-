import React from "react";

interface RadarChartProps {
  data: {
    sweet: number;
    acidicOrBitter: number;
    body: number;
    floral: number;
    spicyOrPeaty: number;
    fruity: number;
  };
}

export default function RadarChart({ data }: RadarChartProps) {
  const axes = [
    { label: "甘润度 (Sweet)", value: data.sweet },
    { label: "酸/苦度 (Sour/Bitter)", value: data.acidicOrBitter },
    { label: "酒体厚度 (Body)", value: data.body },
    { label: "花草芬芳 (Floral)", value: data.floral },
    { label: "辛烈泥煤 (Spicy/Peated)", value: data.spicyOrPeaty },
    { label: "果香风采 (Fruity)", value: data.fruity },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100; // max width of the web

  // Calculate coordinates for 6 axes polygonal radar
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / 6) * index - Math.PI / 2; // Star pointing up
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Coordinates for the concentric grid circles/polygons (to act as guide rings)
  const gridLevels = [25, 50, 75, 100];
  const gridCoords = gridLevels.map((level) => {
    return Array.from({ length: 6 }).map((_, index) => {
      const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
      const r = (level / 100) * radius;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    });
  });

  // Calculate coordinates for actual dataset polygon
  const points = axes
    .map((axis, index) => {
      const coords = getCoordinates(index, axis.value);
      return `${coords.x},${coords.y}`;
    })
    .join(" ");

  return (
    <div className="flex flex-col items-center select-none bg-[#05070A]/80 border border-[#1E293B]/60 rounded-lg p-4">
      <h4 className="text-xs uppercase tracking-widest font-mono text-[#D6B283] mb-2">风味轮多维图谱 / Flavor Wheel</h4>
      
      <svg width={size} height={size} className="overflow-visible">
        {/* Draw web grid rings */}
        {gridCoords.map((pointsStr, idx) => (
          <polygon
            key={idx}
            points={pointsStr}
            fill="none"
            stroke="#1E293B"
            strokeWidth="0.8"
            strokeDasharray={idx === 3 ? "none" : "2 3"}
          />
        ))}

        {/* Level indicators */}
        <text x={center} y={center - radius * 0.25} textAnchor="middle" fontSize="8" fill="#475569" className="font-mono">25</text>
        <text x={center} y={center - radius * 0.50} textAnchor="middle" fontSize="8" fill="#475569" className="font-mono">50</text>
        <text x={center} y={center - radius * 0.75} textAnchor="middle" fontSize="8" fill="#475569" className="font-mono">75</text>
        <text x={center} y={center - radius} textAnchor="middle" fontSize="8" fill="#C59659" className="font-mono">100</text>

        {/* Draw axes spokes radiating from center */}
        {Array.from({ length: 6 }).map((_, index) => {
          const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
          const outerX = center + radius * Math.cos(angle);
          const outerY = center + radius * Math.sin(angle);
          return (
            <line
              key={index}
              x1={center}
              y1={center}
              x2={outerX}
              y2={outerY}
              stroke="#1E293B"
              strokeWidth="1"
            />
          );
        })}

        {/* Golden highlighted dataset polygon with glass-morphic fill gradient */}
        <polygon
          points={points}
          fill="rgba(197, 150, 89, 0.25)"
          stroke="#C59659"
          strokeWidth="2.5"
          className="filter drop-shadow-[0_0_8px_rgba(197,150,89,0.5)] transition-all duration-500"
        />

        {/* Data points (glowing gold vertices) */}
        {axes.map((axis, index) => {
          const coords = getCoordinates(index, axis.value);
          return (
            <circle
              key={index}
              cx={coords.x}
              cy={coords.y}
              r="4.5"
              fill="#05070A"
              stroke="#D6B283"
              strokeWidth="2"
              className="hover:r-6 cursor-help"
            >
              <title>{`${axis.label}: ${axis.value}%`}</title>
            </circle>
          );
        })}

        {/* Axis Labels */}
        {axes.map((axis, index) => {
          const angle = (Math.PI * 2 / 6) * index - Math.PI / 2;
          // Push labels slightly further out than maximum radius
          const labelDist = radius + 22;
          const labelX = center + labelDist * Math.cos(angle);
          const labelY = center + labelDist * Math.sin(angle);
          
          let anchor = "middle";
          if (Math.cos(angle) > 0.1) anchor = "start";
          else if (Math.cos(angle) < -0.1) anchor = "end";

          return (
            <g key={index}>
              <text
                x={labelX}
                y={labelY}
                textAnchor={anchor}
                fill="#94A3B8"
                fontSize="10"
                className="font-medium tracking-tight"
              >
                {axis.label.split(" (")[0]}
              </text>
              <text
                x={labelX}
                y={labelY + 11}
                textAnchor={anchor}
                fill="#475569"
                fontSize="8"
                className="font-mono font-semibold"
              >
                {axis.value}%
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
