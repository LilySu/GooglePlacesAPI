import { useState, useMemo } from 'react';
import { Upload, FileText } from 'lucide-react';
import SpreadsheetView from './SpreadsheetView';
import { parseExcelToSpreadsheet, buildSpreadsheetFromSessionData } from '../utils/spreadsheetParser';
import { extractTextFromPDF } from '../services/pdfScanner';
import { processBiomarkerReport } from '../services/biomarkerAnalyzer';
import * as XLSX from 'xlsx';

export default function UploadView({ sessionData, setSessionData, plantGrowth, setPlantGrowth, onBemAnalysis }) {
  const [uploadedSpreadsheet, setUploadedSpreadsheet] = useState(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfStatus, setPdfStatus] = useState(null);

  const spreadsheetData = useMemo(() => {
    return uploadedSpreadsheet || buildSpreadsheetFromSessionData(sessionData);
  }, [uploadedSpreadsheet, sessionData]);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPdfLoading(true);
    setPdfStatus('Extracting text from PDF...');

    try {
      const rawText = await extractTextFromPDF(file);
      setPdfStatus('Analyzing biomarkers with AI...');

      const bemApiKey = import.meta.env.VITE_BEM_API_KEY;
      const result = await processBiomarkerReport(rawText, bemApiKey, { lat: 37.7749, lng: -122.4194 });

      if (result.success && onBemAnalysis) {
        onBemAnalysis(result);
      }

      setPdfStatus(result.success ? 'Analysis complete! Check the "For You" tab for personalized recommendations.' : 'Analysis completed with limited results.');
      setPlantGrowth(Math.min(100, plantGrowth + 15));
    } catch (error) {
      console.error('PDF analysis failed:', error);
      setPdfStatus('Could not analyze this PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleExcelUpload = async (e) => {
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
            const s1 = getCell(r, 1);
            const s6 = getCell(r, 2);
            const s12 = getCell(r, 3);
            if (s1 !== null || s6 !== null || s12 !== null) {
              metricMap[metric.toLowerCase()] = { s1, s6, s12 };
            }
          }

          const map = (label, fallbackKey) => {
            const entry = metricMap[label.toLowerCase()];
            return {
              s1: entry?.s1 ?? sessionData.session1[fallbackKey],
              s6: entry?.s6 ?? sessionData.session6[fallbackKey],
              s12: entry?.s12 ?? sessionData.session12[fallbackKey],
            };
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

          setSessionData({
            session1: buildSession('s1'),
            session6: buildSession('s6'),
            session12: buildSession('s12'),
          });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-rose-600" />
            <h3 className="text-xl text-amber-900 font-light" style={{fontFamily: 'Spectral, serif'}}>
              Upload Biomarker PDF
            </h3>
          </div>
          <p className="text-sm text-amber-700 mb-4" style={{fontFamily: 'Work Sans, sans-serif'}}>
            Upload a PDF biomarker report for AI-powered analysis and personalized venue recommendations.
          </p>
          <div className="border-2 border-dashed border-rose-300 rounded-2xl p-6 bg-gradient-to-br from-rose-50 to-orange-50 hover:border-rose-400 transition-all group">
            <Upload className="w-10 h-10 text-rose-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-amber-900 mb-2 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {pdfLoading ? 'Analyzing...' : 'Drop your PDF here'}
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfUpload}
              disabled={pdfLoading}
              className="w-full p-3 border-2 border-rose-200 rounded-xl bg-white hover:border-rose-400 transition-all cursor-pointer text-sm"
              style={{fontFamily: 'Work Sans, sans-serif'}}
            />
          </div>
          {pdfStatus && (
            <p className={`mt-3 text-sm ${pdfStatus.includes('complete') ? 'text-green-600' : 'text-amber-700'}`} style={{fontFamily: 'Work Sans, sans-serif'}}>
              {pdfStatus}
            </p>
          )}
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl text-amber-900 font-light" style={{fontFamily: 'Spectral, serif'}}>
              Upload Tracking Excel
            </h3>
          </div>
          <p className="text-sm text-amber-700 mb-4" style={{fontFamily: 'Work Sans, sans-serif'}}>
            Upload an Excel spreadsheet with session tracking data to update your dashboard metrics.
          </p>
          <div className="border-2 border-dashed border-orange-300 rounded-2xl p-6 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-orange-400 transition-all group">
            <Upload className="w-10 h-10 text-orange-400 mb-2 mx-auto group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium text-amber-900 mb-2 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
              Drop your Excel file here
            </p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              className="w-full p-3 border-2 border-orange-200 rounded-xl bg-white hover:border-orange-400 transition-all cursor-pointer text-sm"
              style={{fontFamily: 'Work Sans, sans-serif'}}
            />
          </div>
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
          Use the Embodied Intelligence Biomarker template with columns: Metric, Session 1, Session 6, Session 12, Change, % Change
        </p>
      </div>
    </div>
  );
}
