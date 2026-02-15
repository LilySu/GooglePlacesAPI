export const matchedUser = {
  name: 'Maya',
  avatar: '🧘‍♀️',
  distance: '0.8 mi away',
  similarityScore: 87,
  bio: "Also recovering from a foot injury and focused on rebuilding balance. She's 3 weeks ahead of you on the same trajectory — her tree pose went from 8s to 22s!",
  sessionData: {
    session1: {
      plankHold: 12, sidePlankL: 6, sidePlankR: 7, boatPose: 8, deadBugQuality: 4,
      downwardDog: 15, chaturangaQuality: 3, handFloorConnection: 3,
      singleLegL: 8, singleLegR: 10, treePoseL: 8, treePoseR: 10, eyesClosedBalance: 3,
      footPainLevel: 7, weightDistribution: 45, archEngagement: 3,
      sunSalAConfidence: 3, sunSalBConfidence: 2, sunSalAFlow: 3, sunSalBFlow: 2,
      bodyAwareness: 4, movementConfidence: 3, energyLevel: 4, wellbeing: 4
    },
    session6: {
      plankHold: 22, sidePlankL: 14, sidePlankR: 15, boatPose: 16, deadBugQuality: 6,
      downwardDog: 28, chaturangaQuality: 5, handFloorConnection: 5,
      singleLegL: 18, singleLegR: 20, treePoseL: 16, treePoseR: 18, eyesClosedBalance: 7,
      footPainLevel: 5, weightDistribution: 48, archEngagement: 5,
      sunSalAConfidence: 5, sunSalBConfidence: 4, sunSalAFlow: 5, sunSalBFlow: 4,
      bodyAwareness: 6, movementConfidence: 5, energyLevel: 6, wellbeing: 6
    },
    session12: {
      plankHold: 35, sidePlankL: 22, sidePlankR: 24, boatPose: 25, deadBugQuality: 8,
      downwardDog: 42, chaturangaQuality: 7, handFloorConnection: 7,
      singleLegL: 28, singleLegR: 30, treePoseL: 22, treePoseR: 25, eyesClosedBalance: 12,
      footPainLevel: 3, weightDistribution: 50, archEngagement: 7,
      sunSalAConfidence: 7, sunSalBConfidence: 6, sunSalAFlow: 7, sunSalBFlow: 6,
      bodyAwareness: 8, movementConfidence: 7, energyLevel: 8, wellbeing: 8
    }
  }
};

export const initialChatMessages = [
  {
    id: 'sys-1',
    type: 'system',
    category: 'class',
    text: 'Maya completed "Gentle Flow Yoga" at Wellness Studio — 45 min session',
    time: 'Yesterday, 9:15 AM',
    imageKey: 'gentleFlow',
  },
  {
    id: 'match-1',
    type: 'match',
    text: "That class was so good! The instructor really focused on balance work today. My tree pose felt so much steadier 🌳",
    time: 'Yesterday, 10:02 AM',
  },
  {
    id: 'user-1',
    type: 'user',
    text: "That's awesome! I've been working on my tree pose too. Did they do any single-leg drills?",
    time: 'Yesterday, 10:15 AM',
  },
  {
    id: 'match-2',
    type: 'match',
    text: "Yes! We did single-leg stands with eyes closed — so hard but I could feel my ankle stabilizers firing. You should try the Tuesday class!",
    time: 'Yesterday, 10:22 AM',
  },
  {
    id: 'sys-2',
    type: 'system',
    category: 'meal',
    text: 'Maya logged a meal: Mediterranean Mezze Platter at Daphne\'s — anti-inflammatory',
    time: 'Yesterday, 1:30 PM',
  },
  {
    id: 'match-3',
    type: 'match',
    text: "The hummus at Daphne's is incredible. Plus all that olive oil — good fats for recovery! 🫒",
    time: 'Yesterday, 2:00 PM',
  },
  {
    id: 'sys-3',
    type: 'system',
    text: "You and Maya both improved your plank hold this week! 🎉",
    time: 'Today, 8:00 AM',
  },
];
