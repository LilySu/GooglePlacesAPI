/**
 * Enhanced Biomarker Analysis System
 * Maps physiological stressors to personalized venue recommendations
 * using bem.ai semantic analysis
 */

// Biomarker thresholds and their implications
const BIOMARKER_PROFILES = {
    highCortisol: {
      indicators: ['cortisol_spike', 'hrv_drop', 'sleep_fragmentation'],
      primaryStressor: 'Chronic Stress / Nervous System Dysregulation',
      venueType: 'Restorative Yoga Studio',
      requiredAttributes: [
        'quiet environment',
        'restorative classes',
        'meditation space',
        'gentle movement focus'
      ],
      semanticKeywords: 'yin yoga restorative meditation mindfulness quiet',
      reasoning: 'High cortisol indicates chronic stress activation. Restorative practices that activate the parasympathetic nervous system help reduce cortisol and restore balance.'
    },
    
    lowElectrolytes: {
      indicators: ['sodium_low', 'potassium_low', 'magnesium_deficiency'],
      primaryStressor: 'Electrolyte Depletion / Mineral Imbalance',
      venueType: 'Recovery Center with Nutrition Focus',
      requiredAttributes: [
        'IV therapy available',
        'nutritional counseling',
        'mineral-rich menu',
        'hydration station'
      ],
      semanticKeywords: 'recovery wellness nutrition IV therapy hydration mineral',
      reasoning: 'Electrolyte depletion affects cellular function and recovery. Venues with nutritional support and mineral replenishment accelerate restoration.'
    },
    
    highInflammation: {
      indicators: ['crp_elevated', 'esr_high', 'joint_pain_increase'],
      primaryStressor: 'Systemic Inflammation',
      venueType: 'Recovery & Contrast Therapy Center',
      requiredAttributes: [
        'infrared sauna',
        'cold plunge',
        'contrast therapy',
        'anti-inflammatory focus'
      ],
      semanticKeywords: 'infrared sauna cold plunge contrast therapy recovery inflammation',
      reasoning: 'Elevated inflammation markers respond well to contrast therapy. Heat increases circulation while cold reduces inflammatory response, promoting faster recovery.'
    },
    
    muscleFatigue: {
      indicators: ['lactate_high', 'creatine_kinase_elevated', 'strength_drop'],
      primaryStressor: 'Muscle Fatigue / Inadequate Recovery',
      venueType: 'Sports Recovery Facility',
      requiredAttributes: [
        'massage therapy',
        'compression therapy',
        'active recovery classes',
        'muscle recovery focus'
      ],
      semanticKeywords: 'sports massage compression recovery physical therapy muscle',
      reasoning: 'Elevated muscle fatigue markers indicate incomplete recovery. Targeted muscle recovery treatments improve circulation and accelerate healing.'
    },
    
    poorSleep: {
      indicators: ['sleep_score_low', 'rem_reduced', 'wake_frequency_high'],
      primaryStressor: 'Sleep Quality Degradation',
      venueType: 'Relaxation & Sleep Wellness Center',
      requiredAttributes: [
        'float therapy',
        'sound healing',
        'circadian rhythm support',
        'relaxation techniques'
      ],
      semanticKeywords: 'float therapy sound bath relaxation sleep wellness meditation',
      reasoning: 'Poor sleep quality affects all recovery systems. Float therapy and sound healing promote deep relaxation and nervous system recalibration.'
    },
    
    lowGripStrength: {
      indicators: ['grip_drop_significant', 'forearm_fatigue'],
      primaryStressor: 'Upper Body Neuromuscular Fatigue',
      venueType: 'Therapeutic Yoga Studio',
      requiredAttributes: [
        'iyengar yoga',
        'props available',
        'alignment focus',
        'therapeutic approach'
      ],
      semanticKeywords: 'iyengar yoga therapeutic props alignment restorative',
      reasoning: 'Grip strength decline indicates neuromuscular fatigue. Iyengar yoga uses props to rebuild strength progressively without overloading.'
    },
    
    coreInstability: {
      indicators: ['plank_time_decreased', 'lower_back_pain'],
      primaryStressor: 'Core Weakness / Postural Instability',
      venueType: 'Pilates & Core Training Studio',
      requiredAttributes: [
        'reformer pilates',
        'core-focused classes',
        'posture correction',
        'small group training'
      ],
      semanticKeywords: 'pilates reformer core strength posture stability',
      reasoning: 'Core instability affects entire kinetic chain. Pilates focuses on deep core activation and postural re-education.'
    },
    
    balanceDeficit: {
      indicators: ['single_leg_stand_decreased', 'proprioception_issues'],
      primaryStressor: 'Balance & Proprioception Decline',
      venueType: 'Balance & Movement Studio',
      requiredAttributes: [
        'hatha yoga',
        'balance training',
        'proprioceptive exercises',
        'slow movement focus'
      ],
      semanticKeywords: 'hatha yoga balance training stability proprioception tai chi',
      reasoning: 'Balance decline indicates proprioceptive system degradation. Slow, mindful movement practices recalibrate spatial awareness and stability.'
    }
  };
  
  /**
   * Analyze PDF biomarker data using bem.ai semantic understanding
   */
  export const analyzeBiomarkersWithBem = async (rawText, bemApiKey) => {
    try {
      const response = await fetch('https://api.bem.ai/v1/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bemApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: rawText,
          instruction: `
            Analyze this biomarker and fitness assessment report comprehensively.
            
            Compare baseline (Session 1) to current state (Session 12 or most recent).
            
            Identify ALL physiological stressors present:
            
            1. CORTISOL/STRESS MARKERS:
               - Look for: HRV decline, sleep disruption, mood changes
               - Calculate percentage changes
               - Flag if cortisol-related markers show dysregulation
            
            2. ELECTROLYTE MARKERS:
               - Look for: sodium, potassium, magnesium levels
               - Check for dehydration indicators
               - Flag if below optimal ranges
            
            3. INFLAMMATION MARKERS:
               - Look for: CRP, ESR, or subjective pain increases
               - Check for chronic inflammation indicators
               - Flag if elevated above baseline
            
            4. MUSCLE FATIGUE:
               - Look for: lactate, creatine kinase, strength decreases
               - Check: grip strength (10%+ drop), plank time (5%+ drop)
               - Flag if recovery appears incomplete
            
            5. SLEEP QUALITY:
               - Look for: sleep score, REM percentage, wake frequency
               - Check for sleep architecture degradation
               - Flag if quality declined significantly
            
            6. BALANCE/PROPRIOCEPTION:
               - Look for: single leg stand time (5%+ drop)
               - Check for asymmetry between left/right
               - Flag if balance metrics declined
            
            Return a JSON object with:
            {
              "primaryStressors": ["stressor1", "stressor2"],
              "biomarkerChanges": {
                "cortisol": { "change_percent": -15, "concerning": true },
                "electrolytes": { "status": "low", "concerning": true },
                "inflammation": { "markers_elevated": false, "concerning": false },
                "gripStrength": { "change_percent": -12, "concerning": true },
                "coreStability": { "change_percent": -6, "concerning": true },
                "balance": { "change_percent": -3, "concerning": false },
                "sleep": { "quality_score": 72, "concerning": false }
              },
              "topPriority": "highCortisol",
              "confidenceLevel": "high"
            }
          `
        })
      });
      
      if (!response.ok) {
        throw new Error(`bem.ai API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('bem.ai analysis failed:', error);
      throw error;
    }
  };
  
  /**
   * Map biomarker analysis to venue recommendation
   */
  export const mapStressorToVenue = (analysisResult) => {
    const { topPriority, biomarkerChanges, primaryStressors } = analysisResult;
    
    // Get the primary profile
    const profile = BIOMARKER_PROFILES[topPriority] || BIOMARKER_PROFILES.muscleFatigue;
    
    // Build detailed explanation
    const explanation = {
      detected: primaryStressors,
      severity: analysisResult.confidenceLevel,
      biomarkerEvidence: Object.entries(biomarkerChanges)
        .filter(([_, data]) => data.concerning)
        .map(([marker, data]) => ({
          marker,
          change: data.change_percent || data.status,
          threshold: 'exceeded'
        }))
    };
    
    return {
      profile,
      explanation,
      timestamp: new Date().toISOString()
    };
  };
  
  /**
   * Generate Google Places API query from biomarker profile
   */
  export const generatePlacesQuery = (venueRecommendation, userLocation) => {
    const { profile, explanation } = venueRecommendation;
    
    return {
      // Primary search parameters
      query: {
        keyword: profile.semanticKeywords,
        type: profile.venueType.toLowerCase().replace(/\s+/g, '_'),
        location: userLocation,
        radius: 5000, // 5km default
        rankby: 'prominence'
      },
      
      // Attributes to verify in results
      requiredAttributes: profile.requiredAttributes,
      
      // User-facing explanation
      recommendation: {
        title: `Recommended: ${profile.venueType}`,
        stressor: profile.primaryStressor,
        why: profile.reasoning,
        biomarkerEvidence: explanation.biomarkerEvidence,
        lookingFor: profile.requiredAttributes.join(', ')
      },
      
      // For display
      searchSummary: `Finding venues with: ${profile.requiredAttributes.slice(0, 2).join(' and ')}`
    };
  };
  
  /**
   * Complete pipeline: PDF → Analysis → Venue Recommendation
   */
  export const processBiomarkerReport = async (pdfText, bemApiKey, userLocation) => {
    try {
      // Step 1: Semantic analysis via bem.ai
      console.log('🧬 Analyzing biomarkers...');
      const analysisResult = await analyzeBiomarkersWithBem(pdfText, bemApiKey);
      
      // Step 2: Map to venue profile
      console.log('📍 Mapping to venue recommendation...');
      const venueRecommendation = mapStressorToVenue(analysisResult);
      
      // Step 3: Generate Places query
      console.log('🔍 Generating search parameters...');
      const placesQuery = generatePlacesQuery(venueRecommendation, userLocation);
      
      return {
        analysis: analysisResult,
        recommendation: venueRecommendation,
        placesQuery,
        success: true
      };
    } catch (error) {
      console.error('Pipeline error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  export default {
    analyzeBiomarkersWithBem,
    mapStressorToVenue,
    generatePlacesQuery,
    processBiomarkerReport,
    BIOMARKER_PROFILES
  };