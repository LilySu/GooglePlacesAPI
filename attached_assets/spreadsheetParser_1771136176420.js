import * as XLSX from 'xlsx';
import { SESSION_LIST } from '../data/sessions';

const CATEGORY_NAMES = [
  'CORE STRENGTH',
  'GRIP STRENGTH',
  'BALANCE & STABILITY',
  'FOOT INTELLIGENCE',
  'SUN SALUTATION MASTERY',
  'SUBJECTIVE MEASURES',
  'TOTAL LONGEVITY SCORE',
];

function isCategory(val) {
  if (typeof val !== 'string') return false;
  return CATEGORY_NAMES.some(cat => val.toUpperCase().includes(cat));
}

export function parseExcelToSpreadsheet(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const range = XLSX.utils.decode_range(firstSheet['!ref']);

        const rows = [];
        let lastContentRow = 0;
        for (let r = 1; r <= range.e.r; r++) {
          const getCell = (c) => {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = firstSheet[addr];
            return cell ? cell.v : '';
          };
          const metric = getCell(0);
          if (metric !== '' && !isCategory(metric)) lastContentRow = r;
          if (isCategory(metric) && metric.toUpperCase() !== 'TOTAL LONGEVITY SCORE') lastContentRow = r;
        }

        for (let r = 1; r <= lastContentRow; r++) {
          const getCell = (c) => {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = firstSheet[addr];
            return cell ? cell.v : '';
          };

          const metric = getCell(0);
          const values = SESSION_LIST.map((_, i) => getCell(i + 1));

          if (metric === '' && values.every(v => v === '')) {
            if (rows.length > 0 && !rows[rows.length - 1].isSpacer) {
              rows.push({ isSpacer: true });
            }
            continue;
          }

          if (isCategory(metric) && metric.toUpperCase() !== 'TOTAL LONGEVITY SCORE') {
            rows.push({ isCategory: true, label: metric.toString().toUpperCase() });
            continue;
          }

          if (metric.toString().toUpperCase() === 'TOTAL LONGEVITY SCORE') continue;

          if (metric !== '') {
            const row = { label: metric.toString() };
            SESSION_LIST.forEach((s, i) => {
              row[s.key] = values[i] === '' ? null : values[i];
            });
            rows.push(row);
          }
        }

        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsBinaryString(file);
  });
}

export function buildSpreadsheetFromSessionData(sessionData) {
  const s = (session, key) => sessionData[session]?.[key] ?? '';

  const row = (label, key) => {
    const r = { label };
    SESSION_LIST.forEach(ses => {
      r[ses.key] = s(ses.key, key);
    });
    return r;
  };

  return [
    { isCategory: true, label: 'CORE STRENGTH' },
    row('Plank hold (seconds)', 'plankHold'),
    row('Side plank hold L (seconds)', 'sidePlankL'),
    row('Side plank hold R (seconds)', 'sidePlankR'),
    row('Boat pose hold (seconds)', 'boatPose'),
    row('Dead bug quality (1-10)', 'deadBugQuality'),
    { isSpacer: true },
    { isCategory: true, label: 'GRIP STRENGTH' },
    row('Downward dog hold (seconds)', 'downwardDog'),
    row('Chaturanga quality (1-10)', 'chaturangaQuality'),
    row('Hand-floor connection (1-10)', 'handFloorConnection'),
    { isSpacer: true },
    { isCategory: true, label: 'BALANCE & STABILITY' },
    row('Single leg stand L (seconds)', 'singleLegL'),
    row('Single leg stand R (seconds)', 'singleLegR'),
    row('Tree pose L (seconds)', 'treePoseL'),
    row('Tree pose R (seconds)', 'treePoseR'),
    row('Eyes-closed balance (seconds)', 'eyesClosedBalance'),
    { isSpacer: true },
    { isCategory: true, label: 'FOOT INTELLIGENCE' },
    row('Right foot pain level (1-10)', 'footPainLevel'),
    row('Weight distribution L/R (%)', 'weightDistribution'),
    row('Arch engagement quality (1-10)', 'archEngagement'),
    { isSpacer: true },
    { isCategory: true, label: 'SUN SALUTATION MASTERY' },
    row('Sun Sal A confidence (1-10)', 'sunSalAConfidence'),
    row('Sun Sal B confidence (1-10)', 'sunSalBConfidence'),
    row('Sun Sal A flow quality (1-10)', 'sunSalAFlow'),
    row('Sun Sal B flow quality (1-10)', 'sunSalBFlow'),
    { isSpacer: true },
    { isCategory: true, label: 'SUBJECTIVE MEASURES' },
    row('Body awareness (1-10)', 'bodyAwareness'),
    row('Movement confidence (1-10)', 'movementConfidence'),
    row('Energy level (1-10)', 'energyLevel'),
    row('Overall wellbeing (1-10)', 'wellbeing'),
  ];
}
