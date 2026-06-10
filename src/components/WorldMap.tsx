import React, { useState } from "react";
import { CountryCulture } from "../types";
import { Compass, Wine, BookOpen, Scroll, Award, Globe } from "lucide-react";

interface WorldMapProps {
  countries: CountryCulture[];
  onSelectCountry: (country: CountryCulture) => void;
  selectedCountry: CountryCulture | null;
}

export default function WorldMap({
  countries,
  onSelectCountry,
  selectedCountry,
}: WorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<CountryCulture | null>(null);

  // Fallback map paths or simplified continent visual styling for an premium blueprint lookup
  return (
    <div className="bg-[#090D14] border border-[#1E293B] rounded-xl p-6 relative overflow-hidden backdrop-blur-md">
      {/* Absolute high-end aesthetic details */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Globe className="w-5 h-5 text-[#C59659] animate-spin-slow" />
        <span className="text-xs uppercase tracking-widest font-mono text-[#D6B283]">航海酒香星图 / Explorer Coordinate</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* The Map visual container */}
        <div className="lg:col-span-2 bg-[#05070A] border border-[#1E293B]/50 rounded-lg p-4 relative min-h-[360px] flex items-center justify-center">
          {/* Stylized background lines */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent pointer-events-none" />
          
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-auto max-h-[400px] text-[#1E293B] fill-current select-none"
          >
            {/* Extremely elegant stylized world contours as a background grid layout */}
            {/* North America */}
            <path d="M 120 70 A 100 100 0 0 1 350 180 L 300 240 L 160 210 Z" className="opacity-15 hover:opacity-20 transition-all duration-300 fill-slate-800" />
            <path d="M 160 210 L 300 240 L 220 330 L 180 320 Z" className="opacity-15 hover:opacity-20 transition-all duration-300 fill-slate-800" />
            {/* South America */}
            <path d="M 220 330 L 320 380 L 290 480 L 260 480 Z" className="opacity-10 hover:opacity-15 transition-all duration-300 fill-slate-800" />
            {/* Eurasia / Africa */}
            <path d="M 400 80 L 700 60 L 920 120 L 850 320 L 700 340 L 410 240 Z" className="opacity-15 hover:opacity-20 transition-all duration-300 fill-slate-800" />
            <path d="M 420 250 L 580 270 L 560 420 L 460 400 Z" className="opacity-10 hover:opacity-15 transition-all duration-300 fill-slate-700" />
            {/* Australia */}
            <path d="M 760 360 A 60 60 0 0 1 890 420 L 800 450 Z" className="opacity-15 hover:opacity-20 transition-all duration-300 fill-slate-800" />

            {/* Longitudinal and Latitudinal Lines */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="#1E293B" strokeDasharray="3 6" strokeWidth="1" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="#1E293B" strokeDasharray="3 6" strokeWidth="1" />
            <line x1="0" y1="125" x2="1000" y2="125" stroke="#1E293B" strokeOpacity="0.4" strokeWidth="0.5" />
            <line x1="0" y1="375" x2="1000" y2="375" stroke="#1E293B" strokeOpacity="0.4" strokeWidth="0.5" />

            {/* Interactive Country Beacons (Mapped strictly via proportional percentage coordinate calculations) */}
            {countries.map((c) => {
              // Convert coordinate 0-100 to map scale 1000 x 500
              const xValue = c.coordinate.x * 10;
              const yValue = c.coordinate.y * 5;
              const isSelected = selectedCountry?.id === c.id;
              const isHovered = hoveredCountry?.id === c.id;

              return (
                <g
                  key={c.id}
                  className="cursor-pointer group"
                  onClick={() => onSelectCountry(c)}
                  onMouseEnter={() => setHoveredCountry(c)}
                  onMouseLeave={() => setHoveredCountry(null)}
                >
                  {/* Outer breathing pulse ring */}
                  <circle
                    cx={xValue}
                    cy={yValue}
                    r={isSelected ? 22 : isHovered ? 16 : 10}
                    className="fill-transparent stroke-[#C59659] stroke-2 opacity-50 group-hover:opacity-100 transition-all duration-500"
                    style={{
                      transformOrigin: `${xValue}px ${yValue}px`,
                      animation: isSelected ? "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite" : "none"
                    }}
                  />
                  
                  {/* Golden central node */}
                  <circle
                    cx={xValue}
                    cy={yValue}
                    r={isSelected ? 8 : 5}
                    className={`${
                      isSelected ? "fill-[#C59659] shadow-lg shadow-yellow-500/50" : "fill-[#C59659]/70"
                    } group-hover:fill-yellow-400 transition-all duration-300`}
                  />

                  {/* Elegant typography details above or next to the locator node */}
                  <rect
                    x={xValue - 50}
                    y={yValue - 28}
                    width={100}
                    height={18}
                    rx="4"
                    fill="#090D14"
                    stroke={isSelected ? "#C59659" : "#1E293B"}
                    strokeWidth="0.7"
                    className="opacity-90 transition-all duration-300"
                  />
                  <text
                    x={xValue}
                    y={yValue - 16}
                    textAnchor="middle"
                    className="font-display font-medium select-none"
                    fill={isSelected ? "#F3EADC" : "#D6B283"}
                    fontSize="10"
                  >
                    {c.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map legend */}
          <div className="absolute bottom-3 right-4 flex items-center gap-4 text-[10px] font-mono text-[#E2E8F0]/40 bg-[#05070A]/80 px-3 py-1.5 rounded-md border border-[#1E293B]/20">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C59659]" />
              <span>代表性酒类国度</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full border border-[#C59659] animate-ping" />
              <span>智能活动雷达</span>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Side-card Panel */}
        <div className="bg-[#05070A] border border-[#1E293B] rounded-lg p-5 flex flex-col justify-between">
          {selectedCountry ? (
            <div className="space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                  <div>
                    <h3 className="text-xl font-display font-bold text-[#F3EADC] flex items-center gap-2">
                      <Compass className="w-5 h-5 text-[#C59659]" />
                      {selectedCountry.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedCountry.english_name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase bg-[#C59659]/10 text-[#D6B283] px-2 py-1 rounded inline-block border border-[#C59659]/20">
                      年度总产
                    </span>
                    <p className="text-xs font-mono font-medium text-slate-300 mt-1">{selectedCountry.annual_production}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300 italic leading-relaxed mt-3 px-3 py-2 bg-[#090D14] border-l-2 border-[#C59659] rounded-r-md">
                  “{selectedCountry.description}”
                </p>

                {/* Wine history block */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#D6B283]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>历史风土 / Heritage Story</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed ps-5">
                    {selectedCountry.history}
                  </p>
                </div>

                {/* Representative Spirits and Brands with bento chips */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-[#090D14] border border-[#1E293B]/60 rounded p-2.5">
                    <div className="flex items-center gap-1 text-xs font-mono font-medium text-[#C59659] mb-1.5">
                      <Wine className="w-3.5 h-3.5" />
                      <span>国家代表酒款</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCountry.representative_spirits.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#090D14] border border-[#1E293B]/60 rounded p-2.5">
                    <div className="flex items-center gap-1 text-xs font-mono font-medium text-[#C59659] mb-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>享誉世界名厂</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCountry.famous_brands.map((item, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Drinking Etiquette at the bottom */}
              <div className="mt-4 pt-4 border-t border-[#1E293B]/60 bg-[#C59659]/5 p-3 rounded border border-[#C59659]/10">
                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#D6B283] mb-1">
                  <Scroll className="w-3.5 h-3.5" />
                  <span>品饮之仪 / Drinking Etiquette</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedCountry.drinking_etiquette}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <Compass className="w-10 h-10 text-slate-700 animate-pulse" />
              <p className="text-sm text-[#D6B283]">点击星图上的金色航海标</p>
              <p className="text-xs text-slate-500 max-w-[200px]">
                即刻解锁苏格兰、法国、中国、日本、墨西哥或韩国悠久的酒文化历史、知名品牌和礼仪。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
