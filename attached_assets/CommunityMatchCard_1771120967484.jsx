import { Users, MapPin, ArrowRight, TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis } from 'recharts';
import { getProgressData } from '../utils/calculations';
import mayaProfileImg from '@assets/maria-lupan-Omae6x2qFTU-unsplash_1771112352871.png';

function getOverlayData(userSessionData, matchSessionData) {
  const userData = getProgressData(userSessionData);
  const matchData = getProgressData(matchSessionData);
  return userData.map((item, i) => ({
    session: item.session,
    you: parseFloat(item['Core Strength']) + parseFloat(item['Balance']),
    match: parseFloat(matchData[i]['Core Strength']) + parseFloat(matchData[i]['Balance']),
  }));
}

export default function CommunityMatchCard({ matchedUser, sessionData, onOpenChat }) {
  const overlayData = getOverlayData(sessionData, matchedUser.sessionData);

  return (
    <div className="bg-gradient-to-br from-purple-50/80 via-rose-50/80 to-orange-50/80 backdrop-blur-sm rounded-3xl p-6 border border-purple-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.8s'}}>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-purple-600" />
        <h3 className="text-sm uppercase tracking-wider text-purple-700 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
          Your Wellness Match
        </h3>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3">
            <img
              src={mayaProfileImg}
              alt={matchedUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200/60 shadow-sm"
            />
            <div>
              <h4 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                {matchedUser.name}
              </h4>
              <div className="flex items-center gap-1 text-sm text-amber-600">
                <MapPin className="w-3.5 h-3.5" />
                {matchedUser.distance}
              </div>
            </div>
            <div className="ml-auto bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
              {matchedUser.similarityScore}% match
            </div>
          </div>

          <p className="text-sm text-amber-700 mb-4 leading-relaxed">
            {matchedUser.bio}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-purple-600 font-medium uppercase tracking-wide">Trajectory Comparison</span>
          </div>
          <div className="bg-white/60 rounded-2xl p-3 border border-purple-100/50">
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={overlayData}>
                <XAxis dataKey="session" tick={{fontSize: 10, fill: '#92400e'}} axisLine={false} tickLine={false} />
                <Line type="monotone" dataKey="you" stroke="#ea580c" strokeWidth={2.5} dot={{r: 4, fill: '#ea580c'}} name="You" />
                <Line type="monotone" dataKey="match" stroke="#a855f7" strokeWidth={2.5} dot={{r: 4, fill: '#a855f7'}} strokeDasharray="6 3" name={matchedUser.name} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-1">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-orange-500 rounded"></div>
                <span className="text-xs text-amber-700">You</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-purple-500 rounded" style={{borderTop: '2px dashed #a855f7', height: 0}}></div>
                <span className="text-xs text-purple-600">{matchedUser.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex md:flex-col items-center justify-center gap-3">
          <button
            onClick={onOpenChat}
            className="bg-gradient-to-r from-purple-500 to-rose-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            Connect
            <ArrowRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-purple-400">Send a message</span>
        </div>
      </div>
    </div>
  );
}
