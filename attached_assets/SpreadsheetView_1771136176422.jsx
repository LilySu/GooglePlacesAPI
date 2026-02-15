import { calculateLongevityScore } from '../utils/calculations';
import { SESSION_LIST, FIRST_SESSION, LAST_SESSION } from '../data/sessions';

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

function computeChange(first, last) {
  if (first === '' || last === '' || first === null || last === null || first === undefined || last === undefined) return { change: '', pct: '' };
  const firstNum = parseFloat(first);
  const lastNum = parseFloat(last);
  if (isNaN(firstNum) || isNaN(lastNum)) return { change: '', pct: '' };
  const change = lastNum - firstNum;
  const pct = firstNum !== 0 ? ((change / Math.abs(firstNum)) * 100) : 0;
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
  const colCount = SESSION_LIST.length + 3;

  const scores = {};
  SESSION_LIST.forEach(s => {
    scores[s.key] = calculateLongevityScore(sessionData, s.key);
  });
  const scoreChange = scores[LAST_SESSION] - scores[FIRST_SESSION];
  const scorePct = scores[FIRST_SESSION] !== 0 ? ((scoreChange / scores[FIRST_SESSION]) * 100).toFixed(1) : '0';
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
              {SESSION_LIST.map(s => (
                <th key={s.key} className="text-center px-3 py-3 text-sm font-semibold text-amber-900 border-b border-r border-amber-300 min-w-[80px]" title={s.fullLabel}>
                  {s.label}
                </th>
              ))}
              <th className="text-center px-3 py-3 text-sm font-semibold text-amber-900 border-b border-r border-amber-300 min-w-[90px]">Change</th>
              <th className="text-center px-3 py-3 text-sm font-semibold text-amber-900 border-b border-amber-300 min-w-[80px]">%</th>
            </tr>
          </thead>
          <tbody>
            {spreadsheetData.map((row, idx) => {
              if (row.isCategory) {
                const colors = categoryColors[row.label] || { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' };
                return (
                  <tr key={idx} className={colors.bg}>
                    <td colSpan={colCount} className={`px-4 py-2.5 text-xs font-bold tracking-wider ${colors.text} border-b ${colors.border} uppercase`}>
                      {row.label}
                    </td>
                  </tr>
                );
              }

              if (row.isSpacer) {
                return (
                  <tr key={idx}>
                    <td colSpan={colCount} className="h-1 bg-gradient-to-r from-transparent via-orange-200/50 to-transparent"></td>
                  </tr>
                );
              }

              const isPercent = row.label && row.label.toLowerCase().includes('%');
              const firstVal = row[FIRST_SESSION];
              const lastVal = row[LAST_SESSION];
              const { change, pct } = computeChange(firstVal, lastVal);
              const changeColor = getChangeColor(change);

              return (
                <tr key={idx} className="hover:bg-amber-50/60 transition-colors">
                  <td className="px-4 py-2 text-sm text-amber-800 border-b border-r border-orange-100 font-medium">
                    {row.label}
                  </td>
                  {SESSION_LIST.map((s, i) => (
                    <td key={s.key} className={`px-3 py-2 text-sm text-amber-900 text-center border-b border-r border-orange-100 tabular-nums ${i === SESSION_LIST.length - 1 ? 'font-semibold' : ''}`}>
                      {formatValue(row[s.key], isPercent)}
                    </td>
                  ))}
                  <td className={`px-3 py-2 text-sm text-center border-b border-r border-orange-100 tabular-nums font-medium ${changeColor}`}>
                    {change}
                  </td>
                  <td className={`px-3 py-2 text-sm text-center border-b border-orange-100 tabular-nums font-medium ${changeColor}`}>
                    {pct}
                  </td>
                </tr>
              );
            })}

            <tr className="bg-gradient-to-r from-orange-200 to-rose-200">
              <td className="px-4 py-3 text-sm font-bold text-amber-900 border-t-2 border-r border-amber-400 uppercase tracking-wider">
                Total Longevity Score
              </td>
              {SESSION_LIST.map(s => (
                <td key={s.key} className="px-3 py-3 text-lg font-bold text-amber-900 text-center border-t-2 border-r border-amber-400">
                  {scores[s.key]}
                </td>
              ))}
              <td className={`px-3 py-3 text-lg font-bold text-center border-t-2 border-r border-amber-400 ${scoreChangeColor}`}>
                {scoreChangeStr}
              </td>
              <td className={`px-3 py-3 text-lg font-bold text-center border-t-2 border-amber-400 ${scoreChangeColor}`}>
                {scorePctStr}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
