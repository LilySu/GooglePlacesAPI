import React, { useMemo } from 'react';

const BIOMARKER_ALERTS = [
  {
    key: 'grip',
    label: 'Grip Strength',
    exercise: 'Downward Facing Dog',
    description: 'Holding this pose rebuilds the hand-to-floor connection and strengthens your grip endurance.'
  },
  {
    key: 'core',
    label: 'Core Stability',
    exercise: 'Hold a Plank',
    prescription: 'Aim for at least 15 seconds, 4 times a week.',
    description: 'Rebuilding your plank hold restores the deep core engagement needed for stability.'
  },
  {
    key: 'balance',
    label: 'Balance & Symmetry',
    exercise: 'Tree Pose (L)',
    description: 'Practicing a static balance pose helps recalibrate your stability and weight distribution.'
  }
];

export default function SuggestionsView({ sessionData }) {
  // Logic to calculate drops from your PDF data structure
  const activeAlerts = useMemo(() => {
    const alerts = [];
    const s1 = sessionData.cp1; // Session 1 
    const s12 = sessionData.cp5; // Mapping Session 12 to your 'Today' state 

    // 1. Grip Strength Alert (-10%)
    if (s12.downwardDog <= s1.downwardDog * 0.9) {
      alerts.push({ ...BIOMARKER_ALERTS[0], drop: 10 });
    }
    // 2. Core Stability Alert (-5%)
    if (s12.plankHold <= s1.plankHold * 0.95) {
      alerts.push({ ...BIOMARKER_ALERTS[1], drop: 5 });
    }
    // 3. Balance Alert (-5%)
    if (s12.singleLegL <= s1.singleLegL * 0.95) {
      alerts.push({ ...BIOMARKER_ALERTS[2], drop: 5 });
    }
    return alerts;
  }, [sessionData]);

  return (
    <div className="space-y-4">
      {activeAlerts.map((alert, i) => (
        <div 
          key={i}
          className="bg-rose-50 border-2 border-rose-300 animate-alertPulse rounded-3xl p-6 transition-all"
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl pt-1">⚠️</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase tracking-widest font-bold text-rose-600">
                  {alert.label} Alert
                </span>
                <span className="bg-rose-200 text-rose-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  ↓ {alert.drop}% today
                </span>
              </div>
              <h4 className="text-xl font-semibold text-rose-800 mb-1">
                Suggest exercise: {alert.exercise}
              </h4>
              {alert.prescription && (
                <p className="text-sm font-bold text-amber-800 mb-1">{alert.prescription}</p>
              )}
              <p className="text-sm text-amber-900/80 leading-relaxed">
                {alert.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
