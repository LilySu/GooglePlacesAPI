# Embodied OS - Biomarker-Driven Venue Discovery

Transform physiological biomarker data into personalized, evidence-based venue recommendations using AI-powered semantic analysis.

## 🎯 What This Does

Instead of searching for "yoga near me," this system:

1. **Analyzes your biomarker data** (from PDFs, health apps, lab reports)
2. **Identifies physiological stressors** (high cortisol, inflammation, muscle fatigue, etc.)
3. **Understands the "why"** behind each marker using bem.ai semantic AI
4. **Recommends specific venues** that address your unique stressors
5. **Explains the connection** between your biology and the recommendation

### Example Flow

```
📄 Upload PDF showing:
   - HRV declined 24%
   - Sleep quality dropped 18%
   - Grip strength down 13%

↓

🧬 bem.ai analyzes and detects:
   - Primary: Chronic stress (nervous system dysregulation)
   - Secondary: Neuromuscular fatigue

↓

🎯 System recommends:
   "Restorative Yoga Studio"
   Required: quiet environment, yin yoga, meditation space
   
   WHY: "High cortisol indicates chronic stress activation. 
   Restorative practices activate the parasympathetic nervous 
   system, directly reducing cortisol and restoring balance."

↓

📍 Google Maps shows:
   10 ranked venues matching your biomarker needs
   (Not just highest-rated generic results)
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Google Maps API key with Places API enabled
- bem.ai API key

### Installation

```bash
# Clone or download the project
npm install

# Create environment file
cp .env.example .env

# Add your API keys to .env
VITE_GOOGLE_PLACES_API=your_google_maps_key
VITE_BEM_API_KEY=your_bem_ai_key

# Start development server
npm run dev
```

### Get API Keys

**Google Maps API:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project
3. Enable "Maps JavaScript API" and "Places API"
4. Create credentials → API key
5. (Optional) Restrict key to your domain

**bem.ai API:**
1. Sign up at [bem.ai](https://bem.ai)
2. Generate API key from dashboard
3. Fund account with credits

## 📁 Project Structure

```
src/
├── biomarkerAnalyzer.js       # Core semantic analysis engine
│   ├── BIOMARKER_PROFILES      # 8 stressor categories with reasoning
│   ├── analyzeBiomarkersWithBem() # bem.ai integration
│   ├── mapStressorToVenue()   # Profile → venue mapping
│   └── generatePlacesQuery()  # Google Places query builder
│
├── EnhancedApp.jsx            # Main React application
│   ├── PDF upload handler
│   ├── Google Maps integration
│   ├── Results display
│   └── Transparent recommendation UI
│
├── pdfScanner.js              # PDF text extraction
├── testUtilities.js           # Example data & validation
├── DOCUMENTATION.md           # Full system documentation
└── index.css                  # Styles & animations
```

## 🧬 Supported Biomarker Categories

### 1. **High Cortisol / Chronic Stress**
- **Markers:** HRV decline, sleep fragmentation, elevated resting HR
- **Venue:** Restorative Yoga Studio
- **Attributes:** Quiet environment, yin yoga, meditation

### 2. **Low Electrolytes**
- **Markers:** Sodium, potassium, magnesium below optimal
- **Venue:** Recovery Center with IV Therapy
- **Attributes:** Nutritional counseling, mineral replenishment

### 3. **High Inflammation**
- **Markers:** CRP elevated, ESR high, joint pain
- **Venue:** Contrast Therapy Center
- **Attributes:** Infrared sauna, cold plunge

### 4. **Muscle Fatigue**
- **Markers:** Creatine kinase elevated, lactate high, strength decline
- **Venue:** Sports Recovery Facility
- **Attributes:** Massage therapy, compression

### 5. **Poor Sleep Quality**
- **Markers:** Sleep score <70, REM reduced, wake frequency high
- **Venue:** Sleep Wellness Center
- **Attributes:** Float therapy, sound healing

### 6. **Low Grip Strength**
- **Markers:** Grip test decline ≥10%
- **Venue:** Therapeutic Yoga (Iyengar)
- **Attributes:** Props, alignment focus

### 7. **Core Instability**
- **Markers:** Plank time decline ≥5%, lower back pain
- **Venue:** Pilates Studio
- **Attributes:** Reformer, core-focused

### 8. **Balance Deficit**
- **Markers:** Single-leg stand decline ≥5%
- **Venue:** Balance & Movement Studio
- **Attributes:** Hatha yoga, proprioception training

## 💡 Usage Examples

### Basic Usage

```javascript
import { processBiomarkerReport } from './biomarkerAnalyzer';

// After extracting text from PDF
const result = await processBiomarkerReport(
  pdfText, 
  bemApiKey, 
  userLocation
);

if (result.success) {
  console.log('Primary Stressor:', result.analysis.topPriority);
  console.log('Venue Type:', result.recommendation.profile.venueType);
  console.log('Search Query:', result.placesQuery.query.keyword);
}
```

### Custom Profile

Add your own biomarker profile:

```javascript
// In biomarkerAnalyzer.js
BIOMARKER_PROFILES.customStressor = {
  indicators: ['marker1_low', 'marker2_high'],
  primaryStressor: 'Your Stressor Name',
  venueType: 'Recommended Venue Type',
  requiredAttributes: [
    'attribute 1',
    'attribute 2'
  ],
  semanticKeywords: 'keyword1 keyword2 keyword3',
  reasoning: 'Scientific explanation of why this venue helps...'
};
```

### Testing with Mock Data

```javascript
import { EXAMPLE_BIOMARKER_REPORTS, runTests } from './testUtilities';

// Use pre-built example reports
const examplePDF = EXAMPLE_BIOMARKER_REPORTS.highCortisol.rawText;

// Or run all test cases
await runTests(bemApiKey);
```

## 🔍 How bem.ai Analysis Works

### The Instruction

Unlike keyword matching, bem.ai receives detailed instructions:

```javascript
instruction: `
  Analyze this biomarker report. Compare Session 1 to Session 12.
  
  Identify physiological stressors across 8 categories:
  1. CORTISOL/STRESS: HRV decline, sleep issues, mood changes
  2. ELECTROLYTES: sodium, potassium, magnesium levels
  3. INFLAMMATION: CRP, ESR, pain markers
  [... continues for all categories]
  
  Return JSON with:
  - primaryStressors: array of detected issues
  - biomarkerChanges: percentage changes with concern flags
  - topPriority: most urgent stressor
  - confidenceLevel: analysis reliability
`
```

### The Response

```json
{
  "primaryStressors": ["highCortisol", "lowGripStrength"],
  "biomarkerChanges": {
    "cortisol": { "change_percent": -24, "concerning": true },
    "gripStrength": { "change_percent": -13, "concerning": true },
    "balance": { "change_percent": -3, "concerning": false }
  },
  "topPriority": "highCortisol",
  "confidenceLevel": "high"
}
```

### Why This Matters

bem.ai doesn't just find keywords—it understands:
- **Context:** Session 1 vs Session 12 trends
- **Severity:** Which changes cross clinical thresholds
- **Relationships:** How markers interconnect
- **Priority:** What to address first

## 🗺️ Google Places Integration

### Intelligent Query Generation

Standard approach:
```javascript
// ❌ Generic, unhelpful
keyword: "yoga"
```

Our approach:
```javascript
// ✅ Biomarker-specific, nuanced
keyword: "yin yoga restorative meditation mindfulness quiet"
requiredAttributes: [
  "quiet environment",
  "restorative classes", 
  "meditation space"
]
```

### Ranking Algorithm

Results are re-scored beyond just Google's rating:

```javascript
// Base score from Google
let score = place.rating || 0;

// Boost for each matching attribute
requiredAttributes.forEach(attr => {
  if (place.name.toLowerCase().includes(attr)) {
    score += 1.5; // Significant boost
  }
});

// Sort by combined score
places.sort((a, b) => b.relevanceScore - a.relevanceScore);
```

**Result:** A "4.3-star Restorative Yoga Studio with meditation space" ranks higher than a "4.9-star generic gym."

## 🎨 User Interface

### Transparency Features

The UI shows:

1. **Biomarker Evidence Panel**
   - Which metrics changed
   - By what percentage
   - Confidence level

2. **Stressor Explanation**
   - What it means physiologically
   - Why it matters
   - Health implications

3. **Recommendation Logic**
   - Why this venue type
   - How it addresses the stressor
   - What to look for

4. **Search Parameters**
   - Exact keywords used
   - Ranking methodology
   - Search radius

### Example Display

```
🧬 Biomarker Analysis
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Primary Stressors: High Cortisol, Low Grip Strength

Concerning Metrics:
• HRV: -24% ⚠️
• Sleep Quality: -18% ⚠️
• Grip Strength: -13% ⚠️

Confidence: HIGH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Recommended: Restorative Yoga Studio
For: Chronic Stress / Nervous System Dysregulation

💡 Why This Matters:
High cortisol indicates chronic stress activation. 
Restorative practices that activate the parasympathetic 
nervous system help reduce cortisol and restore balance.

Looking for venues with:
• quiet environment • restorative classes
• meditation space • gentle movement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Search Parameters
Keywords: yin yoga restorative meditation mindfulness
Radius: 5 km from current location
Ranking: Attribute match + Google rating
```

## 📊 PDF Format Requirements

Your biomarker PDF should include:

### Minimum Required Data

```
Session 1 (Baseline):
[Any biomarker name]: [value]

Session 12 (Current):
[Same biomarker name]: [value] ([% change])
```

### Example Format

```
WELLNESS ASSESSMENT REPORT

SESSION 1 - December 2025:
Heart Rate Variability: 68ms
Sleep Quality Score: 87/100
Grip Strength (Downward Dog): 75 seconds
Plank Hold: 120 seconds

SESSION 12 - February 2026:
Heart Rate Variability: 52ms (-24%)
Sleep Quality Score: 71/100 (-18%)
Grip Strength (Downward Dog): 62 seconds (-17%)
Plank Hold: 105 seconds (-13%)
```

### Tips for Best Results

- Include percentage changes (bem.ai can calculate them, but explicit is better)
- Use consistent naming between sessions
- Include units (seconds, mg/dL, mmol/L, etc.)
- Add clinical notes if available
- Multiple biomarkers improve accuracy

## 🔧 Customization

### Adjust Search Radius

```javascript
// In biomarkerAnalyzer.js, generatePlacesQuery()
radius: 8000, // 8km instead of default 5km
```

### Change Ranking Boost

```javascript
// In EnhancedApp.jsx, searchNearbyPlaces()
requiredAttributes.forEach(attr => {
  if (nameAndTypes.includes(attr.toLowerCase())) {
    score += 2.0; // Increase from 1.5 for stronger bias
  }
});
```

### Add New Biomarker Category

```javascript
// In biomarkerAnalyzer.js
BIOMARKER_PROFILES.newCategory = {
  indicators: ['marker_a', 'marker_b'],
  primaryStressor: 'Descriptive Name',
  venueType: 'Type of Venue',
  requiredAttributes: ['attribute1', 'attribute2'],
  semanticKeywords: 'search keywords here',
  reasoning: 'Scientific explanation why this venue helps'
};
```

## 🐛 Troubleshooting

### No Venues Appearing

**Check:**
1. API keys are valid and have credits
2. Location permissions granted in browser
3. Google Places API is enabled in Cloud Console
4. bem.ai analysis completed successfully

**Debug:**
```javascript
console.log('Analysis result:', result);
console.log('Places query:', result.placesQuery);
```

### Incorrect Recommendations

**Possible causes:**
1. PDF format not recognized by bem.ai
2. Biomarker names don't match profile indicators
3. Thresholds too strict/loose

**Solutions:**
- Use example PDF format as template
- Check bem.ai response in console
- Adjust profile thresholds in `BIOMARKER_PROFILES`

### bem.ai Errors

**Common issues:**
- Invalid API key format
- Insufficient credits
- Request timeout

**Fix:**
```javascript
try {
  const result = await analyzeBiomarkersWithBem(text, key);
} catch (error) {
  console.error('bem.ai error:', error.message);
  // Implement fallback or retry logic
}
```

## 🧪 Testing

### Run Example Tests

```bash
npm run test
```

Or manually:

```javascript
import testUtilities from './testUtilities';

// Use pre-built examples
const example = testUtilities.EXAMPLE_BIOMARKER_REPORTS.highCortisol;

// Process with your API key
const result = await processBiomarkerReport(
  example.rawText,
  process.env.VITE_BEM_API_KEY,
  { lat: 37.7749, lng: -122.4194 }
);

// Validate
const validation = testUtilities.validateBemResponse(
  result.analysis,
  example.expectedAnalysis
);

console.log(validation);
```

## 🚀 Production Deployment

### Environment Variables

```bash
# Production .env
VITE_GOOGLE_PLACES_API=prod_google_key
VITE_BEM_API_KEY=prod_bem_key
VITE_APP_ENV=production
```

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel --prod
```

### Security Considerations

1. **API Key Rotation:** Rotate keys every 90 days
2. **Rate Limiting:** Implement client-side rate limiting
3. **API Restrictions:** Restrict Google API key to your domain
4. **Error Handling:** Don't expose API keys in error messages

## 📈 Future Enhancements

### Planned Features

- [ ] Wearable device integration (Apple Health, Garmin, Whoop)
- [ ] Temporal trend tracking across multiple sessions
- [ ] Booking integration with venues
- [ ] Community reviews from users with similar biomarkers
- [ ] Outcome tracking (did the recommendation help?)
- [ ] Multi-modal analysis (biomarkers + symptoms + lifestyle)

### Contribute

Have an idea? Open an issue or submit a PR!

## 📄 License

MIT License - feel free to use and modify

## 🙏 Credits

- **bem.ai** - Semantic biomarker analysis
- **Google Maps** - Location intelligence
- **PDF.js** - PDF text extraction
- **React Google Maps** - Map component library

## 💬 Support

- Documentation: See `DOCUMENTATION.md`
- Issues: GitHub Issues
- Email: support@embodied-os.com

---

**Built with ❤️ for evidence-based wellness**

Last Updated: February 2026 | Version 1.0.0