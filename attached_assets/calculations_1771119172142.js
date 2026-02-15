export function calculateProgress(sessionData, metric) {
  const s1 = sessionData.session1[metric];
  const s12 = sessionData.session12[metric];
  const change = s12 - s1;
  const percentChange = s1 > 0 ? ((change / s1) * 100).toFixed(1) : 0;
  return { change, percentChange };
}

export function calculateLongevityScore(sessionData, session) {
  const data = sessionData[session];
  const coreStrength = (data.plankHold / 60 * 10 + data.sidePlankL / 30 * 10 + data.sidePlankR / 30 * 10 + data.boatPose / 60 * 10 + data.deadBugQuality) / 5;
  const gripStrength = (data.downwardDog / 60 * 10 + data.chaturangaQuality + data.handFloorConnection) / 3;
  const balance = (data.singleLegL / 30 * 10 + data.singleLegR / 30 * 10 + data.treePoseL / 30 * 10 + data.treePoseR / 30 * 10 + data.eyesClosedBalance / 30 * 10) / 5;
  const footHealth = (10 - data.footPainLevel + data.weightDistribution / 10 + data.archEngagement) / 3;
  const sunSalMastery = (data.sunSalAConfidence + data.sunSalBConfidence + data.sunSalAFlow + data.sunSalBFlow) / 4;
  const subjective = (data.bodyAwareness + data.movementConfidence + data.energyLevel + data.wellbeing) / 4;

  return Math.round((coreStrength + gripStrength + balance + footHealth + sunSalMastery + subjective) / 6 * 10);
}

export function getProgressData(sessionData) {
  return [
    {
      session: 'Session 1',
      'Core Strength': (sessionData.session1.plankHold / 60 * 10).toFixed(1),
      'Balance': (sessionData.session1.singleLegL / 30 * 10).toFixed(1),
      'Subjective': sessionData.session1.wellbeing,
    },
    {
      session: 'Session 6',
      'Core Strength': (sessionData.session6.plankHold / 60 * 10).toFixed(1),
      'Balance': (sessionData.session6.singleLegL / 30 * 10).toFixed(1),
      'Subjective': sessionData.session6.wellbeing,
    },
    {
      session: 'Session 12',
      'Core Strength': (sessionData.session12.plankHold / 60 * 10).toFixed(1),
      'Balance': (sessionData.session12.singleLegL / 30 * 10).toFixed(1),
      'Subjective': sessionData.session12.wellbeing,
    },
  ];
}

export function parseSessionFromExcel(row, prefix) {
  return {
    plankHold: parseFloat(row[`${prefix}PlankHold`]) || 0,
    sidePlankL: parseFloat(row[`${prefix}SidePlankL`]) || 0,
    sidePlankR: parseFloat(row[`${prefix}SidePlankR`]) || 0,
    boatPose: parseFloat(row[`${prefix}BoatPose`]) || 0,
    deadBugQuality: parseFloat(row[`${prefix}DeadBug`]) || 0,
    downwardDog: parseFloat(row[`${prefix}DownwardDog`]) || 0,
    chaturangaQuality: parseFloat(row[`${prefix}Chaturanga`]) || 0,
    handFloorConnection: parseFloat(row[`${prefix}HandFloor`]) || 0,
    singleLegL: parseFloat(row[`${prefix}SingleLegL`]) || 0,
    singleLegR: parseFloat(row[`${prefix}SingleLegR`]) || 0,
    treePoseL: parseFloat(row[`${prefix}TreePoseL`]) || 0,
    treePoseR: parseFloat(row[`${prefix}TreePoseR`]) || 0,
    eyesClosedBalance: parseFloat(row[`${prefix}EyesClosed`]) || 0,
    footPainLevel: parseFloat(row[`${prefix}FootPain`]) || 0,
    weightDistribution: parseFloat(row[`${prefix}WeightDist`]) || 0,
    archEngagement: parseFloat(row[`${prefix}ArchEngagement`]) || 0,
    sunSalAConfidence: parseFloat(row[`${prefix}SunSalAConf`]) || 0,
    sunSalBConfidence: parseFloat(row[`${prefix}SunSalBConf`]) || 0,
    sunSalAFlow: parseFloat(row[`${prefix}SunSalAFlow`]) || 0,
    sunSalBFlow: parseFloat(row[`${prefix}SunSalBFlow`]) || 0,
    bodyAwareness: parseFloat(row[`${prefix}BodyAwareness`]) || 0,
    movementConfidence: parseFloat(row[`${prefix}MovementConf`]) || 0,
    energyLevel: parseFloat(row[`${prefix}Energy`]) || 0,
    wellbeing: parseFloat(row[`${prefix}Wellbeing`]) || 0,
  };
}
