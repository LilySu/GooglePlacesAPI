import React, { useEffect, useState, useMemo } from 'react';
import { 
  APIProvider, 
  Map, 
  useMapsLibrary, 
  useMap, 
  Marker 
} from '@vis.gl/react-google-maps';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API;
const BEM_KEY = import.meta.env.VITE_BEM_API_KEY;

const YogaFinder = () => {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [semanticKeyword, setSemanticKeyword] = useState('yoga');

  // 1. PDF Text Extraction Logic
  const extractText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(' ') + '\n';
    }
    return text;
  };

  // 2. bem.ai Semantic Analysis Logic
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const rawText = await extractText(file);
      
      // Call bem.ai Analyze endpoint
      const response = await fetch('https://api.bem.ai/v1/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEM_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: rawText,
          instruction: `
            Analyze this biomarker report. Compare 'Session 1' to 'Session 12'.
            Return a JSON object with:
            - grip_alert: true if 'Downward dog hold' decreased by 10% or more.
            - core_alert: true if 'Plank hold' decreased by 5% or more.
            - balance_alert: true if 'Single leg stand L' decreased by 5% or more.
          `
        })
      });
      
      const result = await response.json();

      // 3. Trigger specific alerts based on analysis
      if (result.grip_alert) {
        setAlert({
          title: "Grip Strength Alert (-10%)",
          exercise: "Downward Facing Dog",
          message: "Holding this pose rebuilds the hand-to-floor connection.",
          accent: "#f43f5e" // rose-500
        });
        setSemanticKeyword('Iyengar Yoga Restorative');
      } else if (result.core_alert) {
        setAlert({
          title: "Core Stability Alert (-5%)",
          exercise: "Hold a Plank",
          message: "Aim for at least 15 seconds, 4 times a week.",
          accent: "#f59e0b" // amber-500
        });
        setSemanticKeyword('Core Strength Yoga');
      } else if (result.balance_alert) {
        setAlert({
          title: "Balance & Symmetry Alert (-5%)",
          exercise: "Tree Pose (L)",
          message: "Practicing a static balance pose helps recalibrate weight distribution.",
          accent: "#0ea5e9" // sky-500
        });
        setSemanticKeyword('Hatha Yoga Balance');
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Google Places API Call
  useEffect(() => {
    if (!placesLibrary || !map) return;

    const service = new placesLibrary.PlacesService(map);
    const request = {
      location: map.getCenter(),
      radius: 5000,
      keyword: semanticKeyword
    };

    service.nearbySearch(request, (results, status) => {
      if (status === placesLibrary.PlacesServiceStatus.OK && results) {
        setPlaces(results);
      }
    });
  }, [placesLibrary, map, semanticKeyword]);

  return (
    <>
      {places.map((place) => (
        <Marker 
          key={place.place_id} 
          position={place.geometry.location} 
          title={place.name}
        />
      ))}

      <div style={panelStyle}>
        <h2 style={{ fontFamily: 'serif', color: '#451a03', marginTop: 0 }}>Embodied OS</h2>
        
        {/* PDF Upload Section */}
        <label style={uploadButtonStyle}>
          {loading ? "Analyzing Biomarkers..." : "📁 Upload Progress PDF"}
          <input type="file" accept="application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>

        <hr style={{ border: 'none', borderTop: '1px solid #fde68a', margin: '20px 0' }} />

        {/* Dynamic Alert Card */}
        {alert && (
          <div style={{ border: `2px solid ${alert.accent}`, backgroundColor: `${alert.accent}10`, ...alertCardStyle }} className="animate-alertPulse">
            <h4 style={{ margin: '0 0 8px 0', color: alert.accent }}>{alert.title}</h4>
            <p style={{ fontSize: '13px', margin: '0 0 8px 0', color: '#451a03' }}>
              <strong>Suggest:</strong> {alert.exercise}
            </p>
            <p style={{ fontSize: '12px', margin: 0, opacity: 0.8 }}>{alert.message}</p>
          </div>
        )}

        <h3 style={{ fontSize: '16px', color: '#92400e' }}>Refined for you:</h3>
        <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '15px' }}>"{semanticKeyword}"</p>
        
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {places.length === 0 && <li style={{ fontSize: '14px', color: '#92400e' }}>Finding the best local support...</li>}
          {places.map((place) => (
            <li key={place.place_id} style={listItemStyle}>
              <strong style={{ color: '#451a03' }}>{place.name}</strong><br />
              <small style={{ color: '#78350f' }}>{place.vicinity}</small><br />
              <span style={{ color: '#f59e0b', fontSize: '12px' }}>⭐ {place.rating || 'N/A'}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

// --- Styles ---
const panelStyle = {
  position: 'absolute', top: '20px', left: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  padding: '24px', borderRadius: '28px', width: '340px',
  maxHeight: '90vh', overflowY: 'auto', zIndex: 1,
  boxShadow: '0 15px 35px rgba(69, 26, 3, 0.15)',
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

const uploadButtonStyle = {
  display: 'block', width: '100%', padding: '12px',
  textAlign: 'center', backgroundColor: '#fff7ed',
  border: '2px dashed #fcd34d', borderRadius: '16px',
  color: '#b45309', fontWeight: '600', cursor: 'pointer',
  fontSize: '14px'
};

const alertCardStyle = {
  padding: '16px', borderRadius: '20px', marginBottom: '20px'
};

const listItemStyle = {
  marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #fef3c7'
};

export default function App() {
  const defaultCenter = { lat: 37.7749, lng: -122.4194 };

  if (!API_KEY) return <div style={{ padding: '20px', color: 'red' }}>Error: API Key missing.</div>;

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <APIProvider apiKey={API_KEY}>
        <Map defaultCenter={defaultCenter} defaultZoom={13} gestureHandling={'greedy'} disableDefaultUI={false}>
          <YogaFinder />
        </Map>
      </APIProvider>
    </div>
  );
}