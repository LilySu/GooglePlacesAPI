import { Activity, Target, Zap, Heart, Sparkles, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculateProgress, getProgressData } from '../utils/calculations';
import { SESSION_LIST, FIRST_SESSION, LAST_SESSION } from '../data/sessions';
import CommunityMatchCard from './CommunityMatchCard';
import { matchedUser } from '../data/communityData';

export default function DashboardView({ sessionData, currentSession, setCurrentSession, onOpenChat }) {
  const progressData = getProgressData(sessionData);

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-2 mb-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
        {SESSION_LIST.map(s => (
          <button
            key={s.key}
            onClick={() => setCurrentSession(s.key)}
            title={s.fullLabel}
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
              currentSession === s.key
                ? 'bg-amber-600 text-white'
                : 'bg-white/60 text-amber-700 hover:bg-white/80'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="animate-fadeInUp" style={{animationDelay: '0.5s'}}>
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
        <MetricCard
          icon={<Activity className="w-6 h-6 text-orange-600 mb-2" />}
          label="Plank Hold"
          value={sessionData[currentSession].plankHold}
          unit="s"
          progress={calculateProgress(sessionData, 'plankHold').percentChange}
          gradient="from-amber-100 to-orange-100"
          textColor="text-amber-700"
        />
        <MetricCard
          icon={<Target className="w-6 h-6 text-rose-600 mb-2" />}
          label="Balance L"
          value={sessionData[currentSession].singleLegL}
          unit="s"
          progress={calculateProgress(sessionData, 'singleLegL').percentChange}
          gradient="from-rose-100 to-orange-100"
          textColor="text-rose-700"
        />
        <MetricCard
          icon={<Zap className="w-6 h-6 text-amber-600 mb-2" />}
          label="Energy Level"
          value={sessionData[currentSession].energyLevel}
          unit="/10"
          progress={calculateProgress(sessionData, 'energyLevel').percentChange}
          gradient="from-orange-100 to-amber-100"
          textColor="text-amber-700"
        />
        <MetricCard
          icon={<Heart className="w-6 h-6 text-rose-600 mb-2" />}
          label="Wellbeing"
          value={sessionData[currentSession].wellbeing}
          unit="/10"
          progress={calculateProgress(sessionData, 'wellbeing').percentChange}
          gradient="from-rose-100 to-amber-100"
          textColor="text-rose-700"
        />
      </div>

      <CommunityMatchCard
        matchedUser={matchedUser}
        sessionData={sessionData}
        onOpenChat={onOpenChat}
      />

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
              Your plank hold nearly doubled from {sessionData[FIRST_SESSION].plankHold}s to {sessionData[LAST_SESSION].plankHold}s—like a steady oak growing stronger! Your wellbeing jumped from {sessionData[FIRST_SESSION].wellbeing} to {sessionData[LAST_SESSION].wellbeing}, and your foot pain decreased from {sessionData[FIRST_SESSION].footPainLevel} to {sessionData[LAST_SESSION].footPainLevel}. Every session, you're building a foundation for decades of vibrant living. 🌳
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, progress, gradient, textColor }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 card-hover`}>
      {icon}
      <p className={`text-xs ${textColor} mb-1 font-medium`} style={{fontFamily: 'Work Sans, sans-serif'}}>
        {label}
      </p>
      <p className="text-2xl font-light text-amber-900">
        {value}<span className="text-sm text-amber-600">{unit}</span>
      </p>
      <p className="text-xs text-green-600 mt-1">+{progress}%</p>
    </div>
  );
}
