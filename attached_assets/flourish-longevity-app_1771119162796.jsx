import React, { useState } from 'react';
import { Heart, Sparkles, TrendingUp, Leaf, Upload, Camera, Calendar, Award, Sprout, Activity, Target, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import * as XLSX from 'xlsx';

export default function EmbodiedLongevity() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sessionData, setSessionData] = useState({
    session1: {
      // Core Strength
      plankHold: 13.8,
      sidePlankL: 10,
      sidePlankR: 11,
      boatPose: 20,
      deadBugQuality: 6,
      // Grip Strength
      downwardDog: 30,
      chaturangaQuality: 5,
      handFloorConnection: 3,
      // Balance & Stability
      singleLegL: 7,
      singleLegR: 6,
      treePoseL: 15,
      treePoseR: 13,
      eyesClosedBalance: 5,
      // Foot Intelligence
      footPainLevel: 6,
      weightDistribution: 30,
      archEngagement: 4,
      // Sun Salutation Mastery
      sunSalAConfidence: 4,
      sunSalBConfidence: 2,
      sunSalAFlow: 5,
      sunSalBFlow: 3,
      // Subjective Measures
      bodyAwareness: 4,
      movementConfidence: 2,
      energyLevel: 3,
      wellbeing: 3
    },
    session6: {
      plankHold: 15,
      sidePlankL: 11,
      sidePlankR: 11.5,
      boatPose: 24,
      deadBugQuality: 7,
      downwardDog: 33,
      chaturangaQuality: 6,
      handFloorConnection: 3.5,
      singleLegL: 9,
      singleLegR: 7,
      treePoseL: 17,
      treePoseR: 14,
      eyesClosedBalance: 7,
      footPainLevel: 5,
      weightDistribution: 35,
      archEngagement: 5,
      sunSalAConfidence: 6,
      sunSalBConfidence: 5,
      sunSalAFlow: 6,
      sunSalBFlow: 4,
      bodyAwareness: 6,
      movementConfidence: 4,
      energyLevel: 5,
      wellbeing: 5
    },
    session12: {
      plankHold: 27,
      sidePlankL: 14,
      sidePlankR: 13,
      boatPose: 30,
      deadBugQuality: 8,
      downwardDog: 35,
      chaturangaQuality: 7,
      handFloorConnection: 4,
      singleLegL: 10,
      singleLegR: 9,
      treePoseL: 18,
      treePoseR: 17,
      eyesClosedBalance: 12,
      footPainLevel: 4,
      weightDistribution: 40,
      archEngagement: 6,
      sunSalAConfidence: 8,
      sunSalBConfidence: 7,
      sunSalAFlow: 7,
      sunSalBFlow: 6,
      bodyAwareness: 7,
      movementConfidence: 6,
      energyLevel: 8,
      wellbeing: 9
    }
  });

  const [currentSession, setCurrentSession] = useState('session12');
  const [showUpload, setShowUpload] = useState(false);
  const [plantGrowth, setPlantGrowth] = useState(75);

  // 3-day cadence suggestions
  const suggestions = {
    day1: {
      activity: {
        title: "Low-Impact Jazzercise",
        time: "5:30 PM",
        location: "Community Center",
        benefit: "Great for hip mobility!",
        type: "class"
      },
      meal: {
        item: "Harvest Bowl",
        location: "Sweetgreen",
        why: "Packed with anti-inflammatory ingredients and colorful veggies",
      },
      grocery: {
        item: "Purple Potatoes",
        location: "99 Ranch Market",
        why: "Rich in anthocyanins for brain health",
      },
      microPractice: "While your morning tea steeps, try 3 gentle hip circles in each direction. Your joints will thank you."
    },
    day2: {
      activity: {
        title: "Gentle Yoga Flow",
        time: "9:00 AM",
        location: "Wellness Studio",
        benefit: "Perfect for balance & flexibility",
        type: "class"
      },
      meal: {
        item: "Bone Broth",
        location: "Brodo (or your local butcher)",
        why: "Supports joint health and gut healing",
      },
      grocery: {
        item: "Wild-Caught Salmon",
        location: "Whole Foods",
        why: "Omega-3s for heart and brain longevity",
      },
      microPractice: "Stand on one leg while brushing your teeth. Switch legs halfway through. Balance is built in tiny moments."
    },
    day3: {
      activity: {
        title: "Walking Meditation",
        time: "7:00 AM",
        location: "Riverside Park",
        benefit: "Build community while moving gently",
        type: "group"
      },
      meal: {
        item: "Mediterranean Mezze Platter",
        location: "Local Mediterranean spot",
        why: "Olive oil, legumes, and veggies for longevity",
      },
      grocery: {
        item: "Organic Berries",
        location: "Farmer's Market",
        why: "Antioxidants that protect your cells from aging",
      },
      microPractice: "Take three deep breaths before each meal. Notice the colors, textures, and aromas. Mindful eating is a longevity practice."
    }
  };

  const [currentDay, setCurrentDay] = useState('day1');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        // Parse the uploaded biomarker data
        const parseSession = (row, prefix) => ({
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
        });

        if (jsonData.length > 0) {
          setSessionData({
            session1: parseSession(jsonData[0], 'S1'),
            session6: parseSession(jsonData[0], 'S6'),
            session12: parseSession(jsonData[0], 'S12'),
          });
          setShowUpload(false);
          setPlantGrowth(Math.min(100, plantGrowth + 20));
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        alert('Having trouble reading that file. Make sure it follows the Embodied Intelligence Biomarker template!');
      }
    };
    reader.readAsBinaryString(file);
  };

  const calculateProgress = (metric) => {
    const s1 = sessionData.session1[metric];
    const s12 = sessionData.session12[metric];
    const change = s12 - s1;
    const percentChange = s1 > 0 ? ((change / s1) * 100).toFixed(1) : 0;
    return { change, percentChange };
  };

  const calculateLongevityScore = (session) => {
    const data = sessionData[session];
    const coreStrength = (data.plankHold / 60 * 10 + data.sidePlankL / 30 * 10 + data.sidePlankR / 30 * 10 + data.boatPose / 60 * 10 + data.deadBugQuality) / 5;
    const gripStrength = (data.downwardDog / 60 * 10 + data.chaturangaQuality + data.handFloorConnection) / 3;
    const balance = (data.singleLegL / 30 * 10 + data.singleLegR / 30 * 10 + data.treePoseL / 30 * 10 + data.treePoseR / 30 * 10 + data.eyesClosedBalance / 30 * 10) / 5;
    const footHealth = (10 - data.footPainLevel + data.weightDistribution / 10 + data.archEngagement) / 3;
    const sunSalMastery = (data.sunSalAConfidence + data.sunSalBConfidence + data.sunSalAFlow + data.sunSalBFlow) / 4;
    const subjective = (data.bodyAwareness + data.movementConfidence + data.energyLevel + data.wellbeing) / 4;
    
    return Math.round((coreStrength + gripStrength + balance + footHealth + sunSalMastery + subjective) / 6 * 10);
  };

  const longevityScore = calculateLongevityScore(currentSession);
  const session1Score = calculateLongevityScore('session1');
  const session12Score = calculateLongevityScore('session12');

  const progressData = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 p-4 md:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;600&family=Work+Sans:wght@300;400;500;600&display=swap');
        
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        @keyframes bloom {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        
        .animate-float { animation: gentleFloat 6s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-bloom { animation: bloom 0.6s ease-out; }
        .animate-sway { animation: gentle-sway 4s ease-in-out infinite; }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(180, 83, 9, 0.12);
        }
        
        .shimmer-text {
          background: linear-gradient(90deg, #b45309 0%, #ea580c 50%, #b45309 100%);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        @keyframes gentle-sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <div className="inline-flex items-center gap-3 mb-3">
            <Sprout className="w-10 h-10 text-orange-500 animate-float" />
            <h1 className="text-5xl md:text-6xl font-light text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
              Embodied
            </h1>
          </div>
          <p className="text-amber-700 text-lg font-light" style={{fontFamily: 'Work Sans, sans-serif'}}>
            Your longevity journey, one gentle practice at a time
          </p>
        </div>

        {/* Longevity Score Hero */}
        <div className="mb-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl p-8 border border-orange-200/50 card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-rose-300/20 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <h3 className="text-sm uppercase tracking-wider text-orange-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Your Total Longevity Score
                </h3>
                <p className="text-7xl font-light text-amber-900 mb-2">
                  <span className="shimmer-text font-semibold">{longevityScore}</span>
                  <span className="text-3xl text-amber-600">/100</span>
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-lg text-green-600 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    +{session12Score - session1Score} points since Session 1
                  </span>
                </div>
                <p className="text-xl text-amber-800 font-light italic" style={{fontFamily: 'Spectral, serif'}}>
                  "Your body is stronger, more balanced, and more vibrant than when you started! 🌸"
                </p>
              </div>
              
              {/* Growing Plant */}
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 200 200" className={plantGrowth >= 100 ? 'animate-bloom' : ''}>
                  <path d="M 80 160 L 70 200 L 130 200 L 120 160 Z" fill="#c15940" opacity="0.8"/>
                  <ellipse cx="100" cy="160" rx="25" ry="8" fill="#e88b6f"/>
                  <line x1="100" y1="160" x2="100" y2={160 - plantGrowth * 0.8} 
                        stroke="#b45309" strokeWidth="3" className="animate-sway"/>
                  {plantGrowth > 20 && (
                    <ellipse cx="85" cy={160 - plantGrowth * 0.4} rx="15" ry="8" 
                             fill="#ea580c" className="animate-sway"/>
                  )}
                  {plantGrowth > 40 && (
                    <ellipse cx="115" cy={160 - plantGrowth * 0.5} rx="15" ry="8" 
                             fill="#ea580c" className="animate-sway" style={{animationDelay: '0.5s'}}/>
                  )}
                  {plantGrowth > 60 && (
                    <ellipse cx="90" cy={160 - plantGrowth * 0.6} rx="12" ry="7" 
                             fill="#ea580c" className="animate-sway" style={{animationDelay: '1s'}}/>
                  )}
                  {plantGrowth >= 75 && (
                    <g className="animate-bloom">
                      <circle cx="100" cy={160 - plantGrowth * 0.8} r="8" fill="#fbbf24"/>
                      <circle cx="92" cy={155 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
                      <circle cx="108" cy={155 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
                      <circle cx="92" cy={165 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
                      <circle cx="108" cy={165 - plantGrowth * 0.8} r="6" fill="#fb923c"/>
                      <circle cx="100" cy={160 - plantGrowth * 0.8} r="5" fill="#f97316"/>
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-3 mb-8 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                : 'bg-white/60 text-amber-900 hover:bg-white/80'
            }`}
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('suggestions')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              currentView === 'suggestions'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                : 'bg-white/60 text-amber-900 hover:bg-white/80'
            }`}
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            For You
          </button>
          <button
            onClick={() => setCurrentView('metrics')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              currentView === 'metrics'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                : 'bg-white/60 text-amber-900 hover:bg-white/80'
            }`}
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            All Metrics
          </button>
          <button
            onClick={() => setCurrentView('upload')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              currentView === 'upload'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg'
                : 'bg-white/60 text-amber-900 hover:bg-white/80'
            }`}
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            Upload
          </button>
        </div>

        {/* Dashboard View */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            {/* Session Selector */}
            <div className="flex justify-center gap-3 mb-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => setCurrentSession('session1')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentSession === 'session1'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/60 text-amber-700 hover:bg-white/80'
                }`}
              >
                Session 1
              </button>
              <button
                onClick={() => setCurrentSession('session6')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentSession === 'session6'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/60 text-amber-700 hover:bg-white/80'
                }`}
              >
                Session 6
              </button>
              <button
                onClick={() => setCurrentSession('session12')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentSession === 'session12'
                    ? 'bg-amber-600 text-white'
                    : 'bg-white/60 text-amber-700 hover:bg-white/80'
                }`}
              >
                Session 12
              </button>
            </div>

            {/* Progress Charts */}
            <div className="animate-fadeInUp" style={{animationDelay: '0.5s'}}>
              {/* Line Chart */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border border-orange-200/50 card-hover">
                <h3 className="text-lg font-semibold text-amber-900 mb-4" style={{fontFamily: 'Spectral, serif'}}>
                  Look How Far You've Come! 📈
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" opacity={0.3} />
                    <XAxis 
                      dataKey="session" 
                      stroke="#b45309"
                      style={{fontFamily: 'Work Sans, sans-serif', fontSize: '12px'}}
                    />
                    <YAxis 
                      stroke="#b45309"
                      style={{fontFamily: 'Work Sans, sans-serif', fontSize: '12px'}}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #fed7aa',
                        borderRadius: '12px',
                        fontFamily: 'Work Sans, sans-serif'
                      }}
                    />
                    <Line type="monotone" dataKey="Core Strength" stroke="#ea580c" strokeWidth={3} />
                    <Line type="monotone" dataKey="Balance" stroke="#f97316" strokeWidth={3} />
                    <Line type="monotone" dataKey="Subjective" stroke="#fb923c" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-5 card-hover">
                <Activity className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-xs text-amber-700 mb-1 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Plank Hold
                </p>
                <p className="text-2xl font-light text-amber-900">
                  {sessionData[currentSession].plankHold}<span className="text-sm text-amber-600">s</span>
                </p>
                <p className="text-xs text-green-600 mt-1">+{calculateProgress('plankHold').percentChange}%</p>
              </div>

              <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-2xl p-5 card-hover">
                <Target className="w-6 h-6 text-rose-600 mb-2" />
                <p className="text-xs text-rose-700 mb-1 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Balance L
                </p>
                <p className="text-2xl font-light text-rose-900">
                  {sessionData[currentSession].singleLegL}<span className="text-sm text-rose-600">s</span>
                </p>
                <p className="text-xs text-green-600 mt-1">+{calculateProgress('singleLegL').percentChange}%</p>
              </div>

              <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-5 card-hover">
                <Zap className="w-6 h-6 text-amber-600 mb-2" />
                <p className="text-xs text-amber-700 mb-1 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Energy Level
                </p>
                <p className="text-2xl font-light text-amber-900">
                  {sessionData[currentSession].energyLevel}<span className="text-sm text-amber-600">/10</span>
                </p>
                <p className="text-xs text-green-600 mt-1">+{calculateProgress('energyLevel').percentChange}%</p>
              </div>

              <div className="bg-gradient-to-br from-rose-100 to-amber-100 rounded-2xl p-5 card-hover">
                <Heart className="w-6 h-6 text-rose-600 mb-2" />
                <p className="text-xs text-rose-700 mb-1 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Wellbeing
                </p>
                <p className="text-2xl font-light text-rose-900">
                  {sessionData[currentSession].wellbeing}<span className="text-sm text-rose-600">/10</span>
                </p>
                <p className="text-xs text-green-600 mt-1">+{calculateProgress('wellbeing').percentChange}%</p>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-br from-rose-100/80 to-orange-100/80 rounded-3xl p-8 border border-rose-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.7s'}}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center flex-shrink-0 animate-float">
                  <Sparkles className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-orange-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    Your Progress Story
                  </h3>
                  <p className="text-2xl text-amber-900 font-light leading-relaxed" style={{fontFamily: 'Spectral, serif'}}>
                    Your plank hold nearly doubled from {sessionData.session1.plankHold}s to {sessionData.session12.plankHold}s—like a steady oak growing stronger! Your wellbeing jumped from {sessionData.session1.wellbeing} to {sessionData.session12.wellbeing}, and your foot pain decreased from {sessionData.session1.footPainLevel} to {sessionData.session12.footPainLevel}. Every session, you're building a foundation for decades of vibrant living. 🌳
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* For You Suggestions View */}
        {currentView === 'suggestions' && (
          <div className="space-y-6">
            {/* Day Selector */}
            <div className="flex justify-center gap-3 mb-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              <button
                onClick={() => setCurrentDay('day1')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  currentDay === 'day1'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white/60 text-amber-700 hover:bg-white/80'
                }`}
                style={{fontFamily: 'Work Sans, sans-serif'}}
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDay('day2')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  currentDay === 'day2'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white/60 text-amber-700 hover:bg-white/80'
                }`}
                style={{fontFamily: 'Work Sans, sans-serif'}}
              >
                Tomorrow
              </button>
              <button
                onClick={() => setCurrentDay('day3')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  currentDay === 'day3'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'bg-white/60 text-amber-700 hover:bg-white/80'
                }`}
                style={{fontFamily: 'Work Sans, sans-serif'}}
              >
                Day After
              </button>
            </div>

            {/* Daily Micro-Practice */}
            <div className="bg-gradient-to-br from-rose-100/80 to-orange-100/80 rounded-3xl p-8 border border-rose-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.5s'}}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center flex-shrink-0 animate-float">
                  <Leaf className="w-7 h-7 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm uppercase tracking-wider text-rose-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    Today's Micro-Practice
                  </h3>
                  <p className="text-2xl text-amber-900 font-light leading-relaxed" style={{fontFamily: 'Spectral, serif'}}>
                    {suggestions[currentDay].microPractice}
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Suggestion */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-orange-600" style={{fontFamily: 'Work Sans, sans-serif'}}>
                        {suggestions[currentDay].activity.time}
                      </span>
                    </div>
                    <h4 className="text-2xl text-amber-900 font-semibold mb-1" style={{fontFamily: 'Spectral, serif'}}>
                      {suggestions[currentDay].activity.title}
                    </h4>
                    <p className="text-sm text-amber-700 mb-2" style={{fontFamily: 'Work Sans, sans-serif'}}>
                      📍 {suggestions[currentDay].activity.location}
                    </p>
                    <p className="text-amber-800 font-light italic" style={{fontFamily: 'Work Sans, sans-serif'}}>
                      {suggestions[currentDay].activity.benefit}
                    </p>
                  </div>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all whitespace-nowrap">
                  Save Spot
                </button>
              </div>
            </div>

            {/* Meal & Grocery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
              {/* Meal Suggestion */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-6 border border-amber-200/50 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                    Nourishment Suggestion
                  </h3>
                </div>
                <p className="text-2xl text-amber-900 font-light mb-2" style={{fontFamily: 'Spectral, serif'}}>
                  {suggestions[currentDay].meal.item}
                </p>
                <p className="text-sm text-amber-700 mb-3" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  📍 {suggestions[currentDay].meal.location}
                </p>
                <p className="text-sm text-amber-800 font-light leading-relaxed" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  {suggestions[currentDay].meal.why}
                </p>
              </div>

              {/* Grocery Suggestion */}
              <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl p-6 border border-rose-200/50 card-hover">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-rose-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                    Shopping Suggestion
                  </h3>
                </div>
                <p className="text-2xl text-amber-900 font-light mb-2" style={{fontFamily: 'Spectral, serif'}}>
                  {suggestions[currentDay].grocery.item}
                </p>
                <p className="text-sm text-rose-700 mb-3" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  📍 {suggestions[currentDay].grocery.location}
                </p>
                <p className="text-sm text-amber-800 font-light leading-relaxed" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  {suggestions[currentDay].grocery.why}
                </p>
              </div>
            </div>

            {/* Educational Insight */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.8s'}}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-amber-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    Why This Matters
                  </h3>
                  <h4 className="text-xl text-amber-900 mb-2 font-semibold" style={{fontFamily: 'Spectral, serif'}}>
                    Building Longevity Through Daily Choices
                  </h4>
                  <p className="text-amber-800 leading-relaxed font-light" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    These aren't just random suggestions—they're based on longevity research. Low-impact movement preserves your joints, anti-inflammatory foods reduce cellular aging, and micro-practices build consistency without overwhelm. You're not training for a marathon; you're building a life that lasts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Metrics View */}
        {currentView === 'metrics' && (
          <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            {/* Core Strength */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50 card-hover">
              <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
                <Activity className="w-7 h-7 text-orange-600" />
                Core Strength
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Plank Hold', key: 'plankHold', unit: 's' },
                  { label: 'Side Plank L', key: 'sidePlankL', unit: 's' },
                  { label: 'Side Plank R', key: 'sidePlankR', unit: 's' },
                  { label: 'Boat Pose', key: 'boatPose', unit: 's' },
                  { label: 'Dead Bug Quality', key: 'deadBugQuality', unit: '/10' },
                ].map(metric => (
                  <div key={metric.key} className="bg-amber-50 rounded-2xl p-4">
                    <p className="text-sm text-amber-700 mb-2 font-medium">{metric.label}</p>
                    <p className="text-3xl font-light text-amber-900">
                      {sessionData[currentSession][metric.key]}<span className="text-lg text-amber-600">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+{calculateProgress(metric.key).percentChange}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grip Strength */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-rose-200/50 card-hover">
              <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
                <Target className="w-7 h-7 text-rose-600" />
                Grip Strength
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Downward Dog Hold', key: 'downwardDog', unit: 's' },
                  { label: 'Chaturanga Quality', key: 'chaturangaQuality', unit: '/10' },
                  { label: 'Hand-Floor Connection', key: 'handFloorConnection', unit: '/10' },
                ].map(metric => (
                  <div key={metric.key} className="bg-rose-50 rounded-2xl p-4">
                    <p className="text-sm text-rose-700 mb-2 font-medium">{metric.label}</p>
                    <p className="text-3xl font-light text-rose-900">
                      {sessionData[currentSession][metric.key]}<span className="text-lg text-rose-600">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+{calculateProgress(metric.key).percentChange}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Balance & Stability */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 card-hover">
              <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
                <Leaf className="w-7 h-7 text-amber-600" />
                Balance & Stability
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Single Leg Stand L', key: 'singleLegL', unit: 's' },
                  { label: 'Single Leg Stand R', key: 'singleLegR', unit: 's' },
                  { label: 'Tree Pose L', key: 'treePoseL', unit: 's' },
                  { label: 'Tree Pose R', key: 'treePoseR', unit: 's' },
                  { label: 'Eyes-Closed Balance', key: 'eyesClosedBalance', unit: 's' },
                ].map(metric => (
                  <div key={metric.key} className="bg-amber-50 rounded-2xl p-4">
                    <p className="text-sm text-amber-700 mb-2 font-medium">{metric.label}</p>
                    <p className="text-3xl font-light text-amber-900">
                      {sessionData[currentSession][metric.key]}<span className="text-lg text-amber-600">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+{calculateProgress(metric.key).percentChange}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Foot Intelligence */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50 card-hover">
              <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
                <Activity className="w-7 h-7 text-orange-600" />
                Foot Intelligence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Foot Pain Level', key: 'footPainLevel', unit: '/10', inverse: true },
                  { label: 'Weight Distribution', key: 'weightDistribution', unit: '%' },
                  { label: 'Arch Engagement', key: 'archEngagement', unit: '/10' },
                ].map(metric => (
                  <div key={metric.key} className="bg-orange-50 rounded-2xl p-4">
                    <p className="text-sm text-orange-700 mb-2 font-medium">{metric.label}</p>
                    <p className="text-3xl font-light text-orange-900">
                      {sessionData[currentSession][metric.key]}<span className="text-lg text-orange-600">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">
                        {metric.inverse ? '-' : '+'}{Math.abs(calculateProgress(metric.key).percentChange)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sun Salutation Mastery */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-rose-200/50 card-hover">
              <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
                <Sparkles className="w-7 h-7 text-rose-600" />
                Sun Salutation Mastery
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Sun Sal A Confidence', key: 'sunSalAConfidence', unit: '/10' },
                  { label: 'Sun Sal B Confidence', key: 'sunSalBConfidence', unit: '/10' },
                  { label: 'Sun Sal A Flow Quality', key: 'sunSalAFlow', unit: '/10' },
                  { label: 'Sun Sal B Flow Quality', key: 'sunSalBFlow', unit: '/10' },
                ].map(metric => (
                  <div key={metric.key} className="bg-rose-50 rounded-2xl p-4">
                    <p className="text-sm text-rose-700 mb-2 font-medium">{metric.label}</p>
                    <p className="text-3xl font-light text-rose-900">
                      {sessionData[currentSession][metric.key]}<span className="text-lg text-rose-600">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+{calculateProgress(metric.key).percentChange}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subjective Measures */}
            <div className="bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl p-8 border border-orange-200/50 card-hover">
              <h3 className="text-2xl font-semibold text-amber-900 mb-6 flex items-center gap-3" style={{fontFamily: 'Spectral, serif'}}>
                <Heart className="w-7 h-7 text-orange-600" />
                Subjective Wellbeing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Body Awareness', key: 'bodyAwareness', unit: '/10' },
                  { label: 'Movement Confidence', key: 'movementConfidence', unit: '/10' },
                  { label: 'Energy Level', key: 'energyLevel', unit: '/10' },
                  { label: 'Overall Wellbeing', key: 'wellbeing', unit: '/10' },
                ].map(metric => (
                  <div key={metric.key} className="bg-white/60 rounded-2xl p-4">
                    <p className="text-sm text-amber-700 mb-2 font-medium">{metric.label}</p>
                    <p className="text-3xl font-light text-amber-900">
                      {sessionData[currentSession][metric.key]}<span className="text-lg text-amber-600">{metric.unit}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600">+{calculateProgress(metric.key).percentChange}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload View */}
        {currentView === 'upload' && (
          <div className="space-y-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50">
              <h3 className="text-2xl text-amber-900 font-light mb-6" style={{fontFamily: 'Spectral, serif'}}>
                Upload Your Tracking Data
              </h3>
              
              <div className="border-2 border-dashed border-orange-300 rounded-2xl p-12 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-orange-400 transition-all group">
                <Upload className="w-16 h-16 text-orange-400 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <p className="text-lg font-medium text-amber-900 mb-2 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Drop your Excel file here
                </p>
                <p className="text-sm text-amber-700 mb-6 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
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

              <div className="mt-8 p-6 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl">
                <p className="text-sm text-amber-800 text-center" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Use the Embodied Intelligence Biomarker template with columns for all metrics across Sessions 1, 6, and 12
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}