import * as XLSX from 'xlsx';

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
          const s1 = getCell(1);
          const s6 = getCell(2);
          const s12 = getCell(3);

          if (metric === '' && s1 === '' && s6 === '' && s12 === '') {
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
            rows.push({
              label: metric.toString(),
              s1: s1 === '' ? null : s1,
              s6: s6 === '' ? null : s6,
              s12: s12 === '' ? null : s12,
            });
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

  return [
    { isCategory: true, label: 'CORE STRENGTH' },
    { label: 'Plank hold (seconds)', s1: s('session1','plankHold'), s6: s('session6','plankHold'), s12: s('session12','plankHold') },
    { label: 'Side plank hold L (seconds)', s1: s('session1','sidePlankL'), s6: s('session6','sidePlankL'), s12: s('session12','sidePlankL') },
    { label: 'Side plank hold R (seconds)', s1: s('session1','sidePlankR'), s6: s('session6','sidePlankR'), s12: s('session12','sidePlankR') },
    { label: 'Boat pose hold (seconds)', s1: s('session1','boatPose'), s6: s('session6','boatPose'), s12: s('session12','boatPose') },
    { label: 'Dead bug quality (1-10)', s1: s('session1','deadBugQuality'), s6: s('session6','deadBugQuality'), s12: s('session12','deadBugQuality') },
    { isSpacer: true },
    { isCategory: true, label: 'GRIP STRENGTH' },
    { label: 'Downward dog hold (seconds)', s1: s('session1','downwardDog'), s6: s('session6','downwardDog'), s12: s('session12','downwardDog') },
    { label: 'Chaturanga quality (1-10)', s1: s('session1','chaturangaQuality'), s6: s('session6','chaturangaQuality'), s12: s('session12','chaturangaQuality') },
    { label: 'Hand-floor connection (1-10)', s1: s('session1','handFloorConnection'), s6: s('session6','handFloorConnection'), s12: s('session12','handFloorConnection') },
    { isSpacer: true },
    { isCategory: true, label: 'BALANCE & STABILITY' },
    { label: 'Single leg stand L (seconds)', s1: s('session1','singleLegL'), s6: s('session6','singleLegL'), s12: s('session12','singleLegL') },
    { label: 'Single leg stand R (seconds)', s1: s('session1','singleLegR'), s6: s('session6','singleLegR'), s12: s('session12','singleLegR') },
    { label: 'Tree pose L (seconds)', s1: s('session1','treePoseL'), s6: s('session6','treePoseL'), s12: s('session12','treePoseL') },
    { label: 'Tree pose R (seconds)', s1: s('session1','treePoseR'), s6: s('session6','treePoseR'), s12: s('session12','treePoseR') },
    { label: 'Eyes-closed balance (seconds)', s1: s('session1','eyesClosedBalance'), s6: s('session6','eyesClosedBalance'), s12: s('session12','eyesClosedBalance') },
    { isSpacer: true },
    { isCategory: true, label: 'FOOT INTELLIGENCE' },
    { label: 'Right foot pain level (1-10)', s1: s('session1','footPainLevel'), s6: s('session6','footPainLevel'), s12: s('session12','footPainLevel') },
    { label: 'Weight distribution L/R (%)', s1: s('session1','weightDistribution'), s6: s('session6','weightDistribution'), s12: s('session12','weightDistribution') },
    { label: 'Arch engagement quality (1-10)', s1: s('session1','archEngagement'), s6: s('session6','archEngagement'), s12: s('session12','archEngagement') },
    { isSpacer: true },
    { isCategory: true, label: 'SUN SALUTATION MASTERY' },
    { label: 'Sun Sal A confidence (1-10)', s1: s('session1','sunSalAConfidence'), s6: s('session6','sunSalAConfidence'), s12: s('session12','sunSalAConfidence') },
    { label: 'Sun Sal B confidence (1-10)', s1: s('session1','sunSalBConfidence'), s6: s('session6','sunSalBConfidence'), s12: s('session12','sunSalBConfidence') },
    { label: 'Sun Sal A flow quality (1-10)', s1: s('session1','sunSalAFlow'), s6: s('session6','sunSalAFlow'), s12: s('session12','sunSalAFlow') },
    { label: 'Sun Sal B flow quality (1-10)', s1: s('session1','sunSalBFlow'), s6: s('session6','sunSalBFlow'), s12: s('session12','sunSalBFlow') },
    { isSpacer: true },
    { isCategory: true, label: 'SUBJECTIVE MEASURES' },
    { label: 'Body awareness (1-10)', s1: s('session1','bodyAwareness'), s6: s('session6','bodyAwareness'), s12: s('session12','bodyAwareness') },
    { label: 'Movement confidence (1-10)', s1: s('session1','movementConfidence'), s6: s('session6','movementConfidence'), s12: s('session12','movementConfidence') },
    { label: 'Energy level (1-10)', s1: s('session1','energyLevel'), s6: s('session6','energyLevel'), s12: s('session12','energyLevel') },
    { label: 'Overall wellbeing (1-10)', s1: s('session1','wellbeing'), s6: s('session6','wellbeing'), s12: s('session12','wellbeing') },
  ];
}
