export default function GrowingPlant({ plantGrowth }) {
  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 200 200" className={plantGrowth >= 100 ? 'animate-bloom' : ''}>
        <path d="M 80 160 L 70 200 L 130 200 L 120 160 Z" fill="#c15940" opacity="0.8"/>
        <ellipse cx="100" cy="160" rx="25" ry="8" fill="#e88b6f"/>
        <line x1="100" y1="160" x2="100" y2={160 - plantGrowth * 0.8}
              stroke="#b45309" strokeWidth="3" className="animate-sway"/>
        {plantGrowth > 20 && (
          <ellipse cx="85" cy={160 - plantGrowth * 0.4} rx="15" ry="8"
                   fill="#ea580c" className="animate-sway"/>
        )}
        {plantGrowth > 40 && (
          <ellipse cx="115" cy={160 - plantGrowth * 0.5} rx="15" ry="8"
                   fill="#ea580c" className="animate-sway" style={{animationDelay: '0.5s'}}/>
        )}
        {plantGrowth > 60 && (
          <ellipse cx="90" cy={160 - plantGrowth * 0.6} rx="12" ry="7"
                   fill="#ea580c" className="animate-sway" style={{animationDelay: '1s'}}/>
        )}
        {plantGrowth >= 75 && (
          <g className="animate-bloom">
            <circle cx="100" cy={160 - plantGrowth * 0.8} r="8" fill="#fbbf24"/>
            <circle cx="92" cy={155 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
            <circle cx="108" cy={155 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
            <circle cx="92" cy={165 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
            <circle cx="108" cy={165 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
            <circle cx="100" cy={160 - plantGrowth * 0.8} r="5" fill="#f97316"/>
          </g>
        )}
      </svg>
    </div>
  );
}
