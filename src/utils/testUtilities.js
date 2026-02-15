/**
 * Example Biomarker Data Structures
 * For testing and demonstration purposes
 */

export const EXAMPLE_BIOMARKER_REPORTS = {
  
    highCortisol: {
      rawText: `
        BIOMARKER ASSESSMENT REPORT
        Patient: John Doe
        Date: February 2026
        
        SESSION 1 (Baseline - December 2025):
        Heart Rate Variability (HRV): 68ms
        Resting Heart Rate: 62 bpm
        Sleep Quality Score: 87/100
        REM Sleep: 24%
        Deep Sleep: 18%
        Wake Events: 2 per night
        Mood Score: 8/10
        Stress Level: 3/10
        
        SESSION 12 (Current - February 2026):
        Heart Rate Variability (HRV): 52ms (-24%)
        Resting Heart Rate: 74 bpm (+19%)
        Sleep Quality Score: 71/100 (-18%)
        REM Sleep: 18% (-25%)
        Deep Sleep: 12% (-33%)
        Wake Events: 6 per night (+200%)
        Mood Score: 5/10 (-38%)
        Stress Level: 8/10 (+167%)
        
        INTERPRETATION:
        Significant decline in HRV and sleep architecture suggests chronic stress
        activation and nervous system dysregulation. Elevated wake frequency
        and reduced deep sleep indicate disrupted recovery processes.
      `,
      expectedAnalysis: {
        primaryStressors: ['highCortisol'],
        topPriority: 'highCortisol',
        biomarkerChanges: {
          cortisol: { change_percent: -24, concerning: true },
          sleep: { quality_score: 71, concerning: true }
        }
      }
    },
  
    lowElectrolytes: {
      rawText: `
        ELECTROLYTE PANEL - COMPREHENSIVE
        Patient: Jane Smith
        Lab Date: February 14, 2026
        
        SESSION 1 (Baseline):
        Sodium (Na): 142 mEq/L (Normal: 136-145)
        Potassium (K): 4.2 mEq/L (Normal: 3.5-5.0)
        Magnesium (Mg): 2.1 mg/dL (Normal: 1.7-2.2)
        Chloride (Cl): 102 mEq/L (Normal: 98-107)
        Hydration Status: Well-hydrated
        
        SESSION 12 (Current):
        Sodium (Na): 134 mEq/L ↓ (Low-normal)
        Potassium (K): 3.4 mEq/L ↓ (Low-normal)
        Magnesium (Mg): 1.6 mg/dL ↓ (Below optimal)
        Chloride (Cl): 96 mEq/L ↓ (Low-normal)
        Hydration Status: Mild dehydration noted
        
        SYMPTOMS REPORTED:
        - Muscle cramping during exercise
        - Fatigue at end of workouts
        - Difficulty recovering between sessions
        - Occasional dizziness upon standing
        
        CLINICAL NOTES:
        Pattern suggests mineral depletion secondary to increased training
        volume without adequate replenishment. Recommend electrolyte
        optimization and hydration protocol assessment.
      `,
      expectedAnalysis: {
        primaryStressors: ['lowElectrolytes'],
        topPriority: 'lowElectrolytes',
        biomarkerChanges: {
          electrolytes: { status: 'depleted', concerning: true }
        }
      }
    },
  
    muscleFatigue: {
      rawText: `
        STRENGTH & RECOVERY ASSESSMENT
        Athlete: Mike Johnson
        Sport: CrossFit
        Assessment Period: 12 weeks
        
        SESSION 1 (Week 1):
        Grip Strength (Downward Dog Hold): 75 seconds
        Core Stability (Plank Hold): 120 seconds
        Upper Body: Bench 225lbs x 8 reps
        Lower Body: Squat 315lbs x 6 reps
        Creatine Kinase: 180 U/L (Normal: 30-200)
        Lactate (post-workout): 8.2 mmol/L
        Recovery Rating: 8/10
        
        SESSION 12 (Week 12):
        Grip Strength (Downward Dog Hold): 62 seconds (-17%)
        Core Stability (Plank Hold): 105 seconds (-13%)
        Upper Body: Bench 225lbs x 6 reps (-25% volume)
        Lower Body: Squat 315lbs x 4 reps (-33% volume)
        Creatine Kinase: 420 U/L ↑ (Elevated)
        Lactate (post-workout): 11.8 mmol/L ↑
        Recovery Rating: 4/10
        
        PERFORMANCE NOTES:
        Progressive decline in all strength metrics over 12-week period.
        Elevated CK suggests accumulated muscle damage. Athlete reports
        persistent soreness and difficulty completing planned workouts.
        
        RECOMMENDATION:
        Deload week indicated. Focus on recovery modalities before
        resuming progressive training.
      `,
      expectedAnalysis: {
        primaryStressors: ['muscleFatigue', 'lowGripStrength', 'coreInstability'],
        topPriority: 'muscleFatigue',
        biomarkerChanges: {
          gripStrength: { change_percent: -17, concerning: true },
          coreStability: { change_percent: -13, concerning: true },
          muscleFatigue: { creatine_kinase: 420, concerning: true }
        }
      }
    },
  
    balanceDeficit: {
      rawText: `
        BALANCE & PROPRIOCEPTION ASSESSMENT
        Patient: Sarah Williams (Post-injury return)
        Injury: Ankle sprain (8 weeks ago)
        
        SESSION 1 (Pre-injury baseline):
        Single Leg Stand - Left: 60 seconds
        Single Leg Stand - Right: 58 seconds
        Asymmetry: 3% (within normal limits)
        Star Excursion Test - Left: 95% reach
        Star Excursion Test - Right: 94% reach
        Confidence Score: 9/10
        
        SESSION 12 (Current - 8 weeks post-injury):
        Single Leg Stand - Left: 34 seconds (-43%) ⚠️
        Single Leg Stand - Right: 56 seconds (-3%)
        Asymmetry: 39% (significant) ⚠️
        Star Excursion Test - Left: 78% reach (-18%)
        Star Excursion Test - Right: 93% reach (-1%)
        Confidence Score: 5/10
        
        FUNCTIONAL NOTES:
        Patient reports "feeling unsteady" on left leg. Compensatory
        patterns observed during gait. Reduced push-off on affected side.
        
        CLINICAL IMPRESSION:
        Proprioceptive deficit following ankle injury. Neuromuscular
        re-education needed to restore balance symmetry and prevent
        re-injury.
      `,
      expectedAnalysis: {
        primaryStressors: ['balanceDeficit'],
        topPriority: 'balanceDeficit',
        biomarkerChanges: {
          balance: { change_percent: -43, concerning: true }
        }
      }
    },
  
    multipleStressors: {
      rawText: `
        COMPREHENSIVE WELLNESS REPORT
        Client: Alex Rivera
        Program: Executive Wellness
        
        SESSION 1 (3 months ago):
        HRV: 72ms
        Sleep Score: 83/100
        Grip Strength: 68 seconds
        Plank Hold: 90 seconds
        Single Leg Stand (L): 45 seconds
        Single Leg Stand (R): 46 seconds
        Sodium: 141 mEq/L
        Magnesium: 2.0 mg/dL
        CRP (inflammation): 0.8 mg/L
        Body Composition: 18% body fat
        Stress Score: 4/10
        
        SESSION 12 (Current):
        HRV: 54ms (-25%) ⚠️
        Sleep Score: 69/100 (-17%) ⚠️
        Grip Strength: 59 seconds (-13%) ⚠️
        Plank Hold: 84 seconds (-7%)
        Single Leg Stand (L): 42 seconds (-7%)
        Single Leg Stand (R): 45 seconds (-2%)
        Sodium: 136 mEq/L ↓
        Magnesium: 1.7 mg/dL ↓ ⚠️
        CRP (inflammation): 2.4 mg/L ↑ ⚠️
        Body Composition: 21% body fat (+17%)
        Stress Score: 8/10 (+100%)
        
        LIFESTYLE FACTORS:
        - Work hours increased from 45 to 65/week
        - Training frequency decreased from 5x to 2x/week
        - Sleep duration decreased from 7.5h to 6h
        - Reported increase in alcohol consumption
        - Skipping meals, relying on caffeine
        
        PRIMARY CONCERNS:
        1. Chronic stress (HRV decline, sleep disruption)
        2. Inflammation (elevated CRP)
        3. Mineral depletion (low magnesium)
        4. Strength decline (grip, core)
        
        CLINICAL PRIORITY:
        Stress management is primary concern. All other markers
        appear secondary to chronic stress activation.
      `,
      expectedAnalysis: {
        primaryStressors: ['highCortisol', 'highInflammation', 'lowElectrolytes', 'lowGripStrength'],
        topPriority: 'highCortisol',
        biomarkerChanges: {
          cortisol: { change_percent: -25, concerning: true },
          inflammation: { markers_elevated: true, concerning: true },
          electrolytes: { status: 'low', concerning: true },
          gripStrength: { change_percent: -13, concerning: true }
        }
      }
    }
  };
  
  /**
   * Test utility to validate bem.ai responses
   */
  export const validateBemResponse = (response, expectedAnalysis) => {
    const results = {
      passed: [],
      failed: [],
      warnings: []
    };
  
    // Check if primary stressors were detected
    if (response.primaryStressors) {
      expectedAnalysis.primaryStressors.forEach(stressor => {
        if (response.primaryStressors.includes(stressor)) {
          results.passed.push(`✓ Correctly identified ${stressor}`);
        } else {
          results.failed.push(`✗ Failed to identify ${stressor}`);
        }
      });
    } else {
      results.failed.push('✗ No primaryStressors in response');
    }
  
    // Check top priority
    if (response.topPriority === expectedAnalysis.topPriority) {
      results.passed.push(`✓ Correct priority: ${response.topPriority}`);
    } else {
      results.warnings.push(`⚠ Priority mismatch: got ${response.topPriority}, expected ${expectedAnalysis.topPriority}`);
    }
  
    // Check confidence level
    if (response.confidenceLevel) {
      results.passed.push(`✓ Confidence level: ${response.confidenceLevel}`);
    } else {
      results.warnings.push('⚠ No confidence level provided');
    }
  
    return results;
  };
  
  /**
   * Generate mock Google Places results based on stressor type
   */
  export const generateMockPlaces = (stressorType) => {
    const placesByStressor = {
      highCortisol: [
        {
          name: 'Peaceful Mind Yoga Studio',
          vicinity: '123 Calm Street, San Francisco',
          rating: 4.8,
          types: ['yoga', 'meditation', 'wellness'],
          relevanceScore: 9.3
        },
        {
          name: 'Restorative Wellness Center',
          vicinity: '456 Quiet Avenue, San Francisco',
          rating: 4.7,
          types: ['yoga', 'spa', 'meditation'],
          relevanceScore: 8.9
        }
      ],
      lowElectrolytes: [
        {
          name: 'Revive Recovery Center',
          vicinity: '789 Health Boulevard, San Francisco',
          rating: 4.9,
          types: ['health', 'wellness', 'nutrition'],
          relevanceScore: 9.1
        },
        {
          name: 'Optimal Wellness Clinic',
          vicinity: '321 Vitality Lane, San Francisco',
          rating: 4.6,
          types: ['health', 'nutrition', 'iv_therapy'],
          relevanceScore: 8.7
        }
      ],
      muscleFatigue: [
        {
          name: 'Elite Sports Recovery',
          vicinity: '555 Performance Drive, San Francisco',
          rating: 4.8,
          types: ['spa', 'sports', 'massage'],
          relevanceScore: 9.0
        },
        {
          name: 'Athlete Recovery Lab',
          vicinity: '777 Training Court, San Francisco',
          rating: 4.7,
          types: ['sports', 'recovery', 'physical_therapy'],
          relevanceScore: 8.8
        }
      ]
    };
  
    return placesByStressor[stressorType] || [];
  };
  
  /**
   * CLI test runner
   */
  export const runTests = async (bemApiKey) => {
    console.log('🧪 Running Biomarker Analysis Tests...\n');
  
    for (const [testName, testData] of Object.entries(EXAMPLE_BIOMARKER_REPORTS)) {
      console.log(`📋 Test: ${testName}`);
      console.log('─'.repeat(50));
  
      try {
        // In a real test, you would call:
        // const response = await analyzeBiomarkersWithBem(testData.rawText, bemApiKey);
        
        // For demonstration, we'll show expected output
        console.log('Expected Analysis:');
        console.log(JSON.stringify(testData.expectedAnalysis, null, 2));
        console.log('');
        
        // const validationResults = validateBemResponse(response, testData.expectedAnalysis);
        // console.log('Validation Results:', validationResults);
        
      } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
      }
  
      console.log('');
    }
  };
  
  export default {
    EXAMPLE_BIOMARKER_REPORTS,
    validateBemResponse,
    generateMockPlaces,
    runTests
  };