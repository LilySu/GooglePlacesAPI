import { Activity, Target, Leaf, Sparkles, Heart, TrendingUp } from 'lucide-react';
import { calculateProgress } from '../utils/calculations';

const metricSections = [
  {
    title: 'Core Strength',
    icon: Activity,
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200/50',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    metrics: [
      { label: 'Plank Hold', key: 'plankHold', unit: 's' },
      { label: 'Side Plank L', key: 'sidePlankL', unit: 's' },
      { label: 'Side Plank R', key: 'sidePlankR', unit: 's' },
      { label: 'Boat Pose', key: 'boatPose', unit: 's' },
      { label: 'Dead Bug Quality', key: 'deadBugQuality', unit: '/10' },
    ],
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },
  {
    title: 'Grip Strength',
    icon: Target,
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200/50',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    metrics: [
      { label: 'Downward Dog Hold', key: 'downwardDog', unit: 's' },
      { label: 'Chaturanga Quality', key: 'chaturangaQuality', unit: '/10' },
      { label: 'Hand-Floor Connection', key: 'handFloorConnection', unit: '/10' },
    ],
    gridCols: 'grid-cols-1 md:grid-cols-3',
  },
  {
    title: 'Balance & Stability',
    icon: Leaf,
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-200/50',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    metrics: [
      { label: 'Single Leg Stand L', key: 'singleLegL', unit: 's' },
      { label: 'Single Leg Stand R', key: 'singleLegR', unit: 's' },
      { label: 'Tree Pose L', key: 'treePoseL', unit: 's' },
      { label: 'Tree Pose R', key: 'treePoseR', unit: 's' },
      { label: 'Eyes-Closed Balance', key: 'eyesClosedBalance', unit: 's' },
    ],
    gridCols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },
  {
    title: 'Foot Intelligence',
    icon: Activity,
    iconColor: 'text-orange-600',
    borderColor: 'border-orange-200/50',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    metrics: [
      { label: 'Foot Pain Level', key: 'footPainLevel', unit: '/10', inverse: true },
      { label: 'Weight Distribution', key: 'weightDistribution', unit: '%' },
      { label: 'Arch Engagement', key: 'archEngagement', unit: '/10' },
    ],
    gridCols: 'grid-cols-1 md:grid-cols-3',
  },
  {
    title: 'Sun Salutation Mastery',
    icon: Sparkles,
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200/50',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    metrics: [
      { label: 'Sun Sal A Confidence', key: 'sunSalAConfidence', unit: '/10' },
      { label: 'Sun Sal B Confidence', key: 'sunSalBConfidence', unit: '/10' },
      { label: 'Sun Sal A Flow Quality', key: 'sunSalAFlow', unit: '/10' },
      { label: 'Sun Sal B Flow Quality', key: 'sunSalBFlow', unit: '/10' },
    ],
    gridCols: 'grid-cols-1 md:grid-cols-2',
  },
];

export default function MetricsView({ sessionData, currentSession }) {
  return (
    <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
      {metricSections.map(section => {
        const Icon = section.icon;
        return (
          <div key={section.title} className={`bg-white/60 backdrop-blur-sm rounded-3xl p-8 border ${section.borderColor} card-hover`}>
            <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
              <Icon className={`w-7 h-7 ${section.iconColor}`} />
              {section.title}
            </h3>
            <div className={`grid ${section.gridCols} gap-4`}>
              {section.metrics.map(metric => (
                <div key={metric.key} className={`${section.bgColor} rounded-2xl p-4`}>
                  <p className={`text-sm ${section.textColor} mb-2 font-medium`}>{metric.label}</p>
                  <p className="text-3xl font-light text-amber-900">
                    {sessionData[currentSession][metric.key]}
                    <span className={`text-lg ${section.textColor}`}>{metric.unit}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">
                      {metric.inverse ? '-' : '+'}
                      {Math.abs(calculateProgress(sessionData, metric.key).percentChange)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl p-8 border border-orange-200/50 card-hover">
        <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
          <Heart className="w-7 h-7 text-orange-600" />
          Subjective Wellbeing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'Body Awareness', key: 'bodyAwareness', unit: '/10' },
            { label: 'Movement Confidence', key: 'movementConfidence', unit: '/10' },
            { label: 'Energy Level', key: 'energyLevel', unit: '/10' },
            { label: 'Overall Wellbeing', key: 'wellbeing', unit: '/10' },
          ].map(metric => (
            <div key={metric.key} className="bg-white/60 rounded-2xl p-4">
              <p className="text-sm text-amber-700 mb-2 font-medium">{metric.label}</p>
              <p className="text-3xl font-light text-amber-900">
                {sessionData[currentSession][metric.key]}<span className="text-lg text-amber-600">{metric.unit}</span>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">+{calculateProgress(sessionData, metric.key).percentChange}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
