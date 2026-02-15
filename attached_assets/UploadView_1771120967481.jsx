import { useState, useMemo } from 'react';
import { Upload } from 'lucide-react';
import SpreadsheetView from './SpreadsheetView';
import { parseExcelToSpreadsheet, buildSpreadsheetFromSessionData } from '../utils/spreadsheetParser';
import { SESSION_LIST } from '../data/sessions';
import * as XLSX from 'xlsx';

export default function UploadView({ sessionData, setSessionData, plantGrowth, setPlantGrowth }) {
  const [uploadedSpreadsheet, setUploadedSpreadsheet] = useState(null);
  const [hasUploaded, setHasUploaded] = useState(false);

  const spreadsheetData = useMemo(() => {
    return uploadedSpreadsheet || buildSpreadsheetFromSessionData(sessionData);
  }, [uploadedSpreadsheet, sessionData]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const rows = await parseExcelToSpreadsheet(file);
      setUploadedSpreadsheet(rows);
      setHasUploaded(true);

      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = evt.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const range = XLSX.utils.decode_range(firstSheet['!ref']);

          const getCell = (r, c) => {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = firstSheet[addr];
            return cell ? cell.v : null;
          };

          const metricMap = {};
          for (let r = 1; r <= range.e.r; r++) {
            const metric = getCell(r, 0);
            if (!metric || typeof metric !== 'string') continue;
            const values = {};
            SESSION_LIST.forEach((s, i) => {
              values[s.key] = getCell(r, i + 1);
            });
            const hasData = SESSION_LIST.some(s => values[s.key] !== null);
            if (hasData) {
              metricMap[metric.toLowerCase()] = values;
            }
          }

          const map = (label, fallbackKey) => {
            const entry = metricMap[label.toLowerCase()];
            const result = {};
            SESSION_LIST.forEach(s => {
              result[s.key] = entry?.[s.key] ?? sessionData[s.key][fallbackKey];
            });
            return result;
          };

          const m = {
            plankHold: map('plank hold (seconds)', 'plankHold'),
            sidePlankL: map('side plank hold l (seconds)', 'sidePlankL'),
            sidePlankR: map('side plank hold r (seconds)', 'sidePlankR'),
            boatPose: map('boat pose hold (seconds)', 'boatPose'),
            deadBugQuality: map('dead bug quality (1-10)', 'deadBugQuality'),
            downwardDog: map('downward dog hold (seconds)', 'downwardDog'),
            chaturangaQuality: map('chaturanga quality (1-10)', 'chaturangaQuality'),
            handFloorConnection: map('hand-floor connection (1-10)', 'handFloorConnection'),
            singleLegL: map('single leg stand l (seconds)', 'singleLegL'),
            singleLegR: map('single leg stand r (seconds)', 'singleLegR'),
            treePoseL: map('tree pose l (seconds)', 'treePoseL'),
            treePoseR: map('tree pose r (seconds)', 'treePoseR'),
            eyesClosedBalance: map('eyes-closed balance (seconds)', 'eyesClosedBalance'),
            footPainLevel: map('right foot pain level (1-10)', 'footPainLevel'),
            weightDistribution: map('weight distribution l/r (%)', 'weightDistribution'),
            archEngagement: map('arch engagement quality (1-10)', 'archEngagement'),
            sunSalAConfidence: map('sun sal a confidence (1-10)', 'sunSalAConfidence'),
            sunSalBConfidence: map('sun sal b confidence (1-10)', 'sunSalBConfidence'),
            sunSalAFlow: map('sun sal a flow quality (1-10)', 'sunSalAFlow'),
            sunSalBFlow: map('sun sal b flow quality (1-10)', 'sunSalBFlow'),
            bodyAwareness: map('body awareness (1-10)', 'bodyAwareness'),
            movementConfidence: map('movement confidence (1-10)', 'movementConfidence'),
            energyLevel: map('energy level (1-10)', 'energyLevel'),
            wellbeing: map('overall wellbeing (1-10)', 'wellbeing'),
          };

          const buildSession = (sessionKey) => {
            const result = {};
            for (const [key, vals] of Object.entries(m)) {
              let v = vals[sessionKey];
              if (v !== null && v !== undefined) {
                v = parseFloat(v);
                if (key === 'weightDistribution' && v < 1) v = v * 100;
                result[key] = isNaN(v) ? 0 : v;
              } else {
                result[key] = 0;
              }
            }
            return result;
          };

          const newData = {};
          SESSION_LIST.forEach(s => {
            newData[s.key] = buildSession(s.key);
          });
          setSessionData(newData);
          setPlantGrowth(Math.min(100, plantGrowth + 20));
        } catch (error) {
          console.error('Error updating session data:', error);
        }
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert('Having trouble reading that file. Make sure it follows the Embodied Intelligence Biomarker template!');
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50">
        <h3 className="text-2xl text-amber-900 font-light mb-6" style={{fontFamily: 'Spectral, serif'}}>
          Upload Your Tracking Data
        </h3>

        <div className="border-2 border-dashed border-orange-300 rounded-2xl p-8 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-orange-400 transition-all group">
          <Upload className="w-12 h-12 text-orange-400 mb-3 mx-auto group-hover:scale-110 transition-transform" />
          <p className="text-lg font-medium text-amber-900 mb-2 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
            Drop your Excel file here
          </p>
          <p className="text-sm text-amber-700 mb-4 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
            or click to browse
          </p>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="w-full p-4 border-2 border-orange-200 rounded-xl bg-white hover:border-orange-400 transition-all cursor-pointer"
            style={{fontFamily: 'Work Sans, sans-serif'}}
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl text-amber-900 font-light mb-4 px-1" style={{fontFamily: 'Spectral, serif'}}>
          {hasUploaded ? 'Your Uploaded Data' : 'Biomarker Progress Tracking'}
        </h3>
        <SpreadsheetView spreadsheetData={spreadsheetData} sessionData={sessionData} />
      </div>

      <div className="p-6 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl">
        <p className="text-sm text-amber-800 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
          Use the Embodied Intelligence Biomarker template with columns: Metric, then your checkpoint session columns, Change, % Change
        </p>
      </div>
    </div>
  );
}
