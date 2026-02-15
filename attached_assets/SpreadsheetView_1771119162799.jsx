import { calculateLongevityScore } from '../utils/calculations';

const categoryColors = {
  'CORE STRENGTH': { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' },
  'GRIP STRENGTH': { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-300' },
  'BALANCE & STABILITY': { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-300' },
  'FOOT INTELLIGENCE': { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' },
  'SUN SALUTATION MASTERY': { bg: 'bg-rose-100', text: 'text-rose-900', border: 'border-rose-300' },
  'SUBJECTIVE MEASURES': { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-300' },
};

function formatValue(val, isPercent) {
  if (val === '' || val === null || val === undefined) return '';
  if (typeof val === 'number') {
    if (isPercent && val > 0 && val < 1) return `${Math.round(val * 100)}%`;
    return Number.isInteger(val) ? val.toString() : val.toFixed(1);
  }
  return val;
}

function computeChange(s1, s12) {
  if (s1 === '' || s12 === '' || s1 === null || s12 === null || s1 === undefined || s12 === undefined) return { change: '', pct: '' };
  const s1Num = parseFloat(s1);
  const s12Num = parseFloat(s12);
  if (isNaN(s1Num) || isNaN(s12Num)) return { change: '', pct: '' };
  const change = s12Num - s1Num;
  const pct = s1Num !== 0 ? ((change / Math.abs(s1Num)) * 100) : 0;
  const changeStr = Number.isInteger(change) ? change.toString() : change.toFixed(1);
  return {
    change: change >= 0 ? `+${changeStr}` : changeStr,
    pct: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`
  };
}

function getChangeColor(changeStr) {
  if (!changeStr || changeStr === '') return 'text-amber-800';
  if (changeStr.startsWith('+')) return 'text-green-700';
  if (changeStr.startsWith('-')) return 'text-red-600';
  return 'text-amber-800';
}

export default function SpreadsheetView({ spreadsheetData, sessionData }) {
  const s1Score = calculateLongevityScore(sessionData, 'session1');
  const s6Score = calculateLongevityScore(sessionData, 'session6');
  const s12Score = calculateLongevityScore(sessionData, 'session12');
  const scoreChange = s12Score - s1Score;
  const scorePct = s1Score !== 0 ? ((scoreChange / s1Score) * 100).toFixed(1) : '0';
  const scoreChangeColor = scoreChange >= 0 ? 'text-green-700' : 'text-red-600';
  const scoreChangeStr = scoreChange >= 0 ? `+${scoreChange}` : `${scoreChange}`;
  const scorePctStr = scoreChange >= 0 ? `+${scorePct}%` : `${scorePct}%`;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-orange-200/50 overflow-hidden animate-fadeInUp" style={{animationDelay: '0.5s'}}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{fontFamily: 'Work Sans, sans-serif'}}>
          <thead>
            <tr className="bg-gradient-to-r from-amber-200 to-orange-200">
              <th className="text-left px-4 py-3 text-sm font-semibold text-amber-900 border-b border-r border-amber-300 min-w-[240px]">Metric</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-amber-900 border-b border-r border-amber-300 min-w-[100px]">Session 1</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-amber-900 border-b border-r border-amber-300 min-w-[100px]">Session 6</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-amber-900 border-b border-r border-amber-300 min-w-[100px]">Session 12</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-amber-900 border-b border-r border-amber-300 min-w-[100px]">Change (S1→S12)</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-amber-900 border-b border-amber-300 min-w-[90px]">% Change</th>
            </tr>
          </thead>
          <tbody>
            {spreadsheetData.map((row, idx) => {
              if (row.isCategory) {
                const colors = categoryColors[row.label] || { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' };
                return (
                  <tr key={idx} className={colors.bg}>
                    <td colSpan={6} className={`px-4 py-2.5 text-xs font-bold tracking-wider ${colors.text} border-b ${colors.border} uppercase`}>
                      {row.label}
                    </td>
                  </tr>
                );
              }

              if (row.isSpacer) {
                return (
                  <tr key={idx}>
                    <td colSpan={6} className="h-1 bg-gradient-to-r from-transparent via-orange-200/50 to-transparent"></td>
                  </tr>
                );
              }

              const isPercent = row.label && row.label.toLowerCase().includes('%');
              const { change, pct } = computeChange(row.s1, row.s12);
              const changeColor = getChangeColor(change);

              return (
                <tr key={idx} className="hover:bg-amber-50/60 transition-colors">
                  <td className="px-4 py-2 text-sm text-amber-800 border-b border-r border-orange-100 font-medium">
                    {row.label}
                  </td>
                  <td className="px-4 py-2 text-sm text-amber-900 text-center border-b border-r border-orange-100 tabular-nums">
                    {formatValue(row.s1, isPercent)}
                  </td>
                  <td className="px-4 py-2 text-sm text-amber-900 text-center border-b border-r border-orange-100 tabular-nums">
                    {formatValue(row.s6, isPercent)}
                  </td>
                  <td className="px-4 py-2 text-sm text-amber-900 text-center border-b border-r border-orange-100 tabular-nums font-semibold">
                    {formatValue(row.s12, isPercent)}
                  </td>
                  <td className={`px-4 py-2 text-sm text-center border-b border-r border-orange-100 tabular-nums font-medium ${changeColor}`}>
                    {change}
                  </td>
                  <td className={`px-4 py-2 text-sm text-center border-b border-orange-100 tabular-nums font-medium ${changeColor}`}>
                    {pct}
                  </td>
                </tr>
              );
            })}

            <tr className="bg-gradient-to-r from-orange-200 to-rose-200">
              <td className="px-4 py-3 text-sm font-bold text-amber-900 border-t-2 border-r border-amber-400 uppercase tracking-wider">
                Total Longevity Score
              </td>
              <td className="px-4 py-3 text-lg font-bold text-amber-900 text-center border-t-2 border-r border-amber-400">
                {s1Score}
              </td>
              <td className="px-4 py-3 text-lg font-bold text-amber-900 text-center border-t-2 border-r border-amber-400">
                {s6Score}
              </td>
              <td className="px-4 py-3 text-lg font-bold text-amber-900 text-center border-t-2 border-r border-amber-400">
                {s12Score}
              </td>
              <td className={`px-4 py-3 text-lg font-bold text-center border-t-2 border-r border-amber-400 ${scoreChangeColor}`}>
                {scoreChangeStr}
              </td>
              <td className={`px-4 py-3 text-lg font-bold text-center border-t-2 border-amber-400 ${scoreChangeColor}`}>
                {scorePctStr}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
