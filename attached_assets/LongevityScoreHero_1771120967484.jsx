import { TrendingUp } from 'lucide-react';
import GrowingPlant from './GrowingPlant';

export default function LongevityScoreHero({ longevityScore, firstScore, lastScore, plantGrowth }) {
  const pointsGained = lastScore - firstScore;

  return (
    <div className="mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
      <div className="bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl p-8 border border-orange-200/50 card-hover relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-rose-300/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wider text-orange-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
              Your Total Longevity Score
            </h3>
            <p className="text-7xl font-light text-amber-900 mb-2">
              <span className="shimmer-text font-semibold">{longevityScore}</span>
              <span className="text-3xl text-amber-600">/100</span>
            </p>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-lg text-green-600 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                +{pointsGained} points over 14 days
              </span>
            </div>
            <p className="text-xl text-amber-800 font-light italic" style={{fontFamily: 'Spectral, serif'}}>
              "Your body is stronger, more balanced, and more vibrant than when you started! 🌸"
            </p>
          </div>

          <GrowingPlant plantGrowth={plantGrowth} />
        </div>
      </div>
    </div>
  );
}
