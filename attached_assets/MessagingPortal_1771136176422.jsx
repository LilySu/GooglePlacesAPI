import { useState } from 'react';
import { ArrowLeft, Send, Users, Utensils, Dumbbell } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, Area, AreaChart } from 'recharts';
import { getProgressData } from '../utils/calculations';
import { SESSION_LIST } from '../data/sessions';
import { initialChatMessages } from '../data/communityData';
import gentleFlowImg from '@assets/dane-wetton-t1NEMSm1rgI-unsplash_1771111922313.jpg';
import partnerChallengeImg from '@assets/jessica-streser-5ai6kpW4NOw-unsplash_1771111996592.jpg';

const MESSAGE_IMAGES = {
  gentleFlow: gentleFlowImg,
  partnerChallenge: partnerChallengeImg,
};

function getTrajectoryChartData(sessionData) {
  const raw = getProgressData(sessionData);
  return raw.map(item => ({
    session: item.session,
    strength: parseFloat(item['Core Strength']),
    balance: parseFloat(item['Balance']),
    wellbeing: parseFloat(item['Subjective']),
  }));
}

function TrajectoryMiniChart({ sessionData, label, color, bgGradient }) {
  const data = getTrajectoryChartData(sessionData);

  return (
    <div className={`rounded-2xl p-4 border ${bgGradient}`}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{color, fontFamily: 'Work Sans, sans-serif'}}>
        {label}
      </p>
      <ResponsiveContainer width="100%" height={100}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`grad-${label.replace(/\s/g,'')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="session" tick={false} axisLine={false} tickLine={false} hide />
          <Area type="monotone" dataKey="strength" stroke={color} strokeWidth={2} fill={`url(#grad-${label.replace(/\s/g,'')})`} dot={false} />
          <Line type="monotone" dataKey="balance" stroke={color} strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          <Line type="monotone" dataKey="wellbeing" stroke={color} strokeWidth={1} strokeOpacity={0.5} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] opacity-50" style={{color}}>{SESSION_LIST[0].label}</span>
        <span className="text-[10px] opacity-50" style={{color}}>{SESSION_LIST[SESSION_LIST.length - 1].label}</span>
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  if (message.type === 'system') {
    const isClass = message.category === 'class';
    const isMeal = message.category === 'meal';
    return (
      <div className="flex justify-center my-3">
        <div className={`max-w-md rounded-2xl px-4 py-3 text-sm border ${
          isClass ? 'bg-purple-50 border-purple-200 text-purple-800' :
          isMeal ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-gray-50 border-gray-200 text-gray-700'
        }`}>
          <div className="flex items-start gap-2">
            {isClass && <Dumbbell className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500" />}
            {isMeal && <Utensils className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />}
            {!isClass && !isMeal && <Users className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />}
            <div className="flex-1 min-w-0">
              <p className="leading-relaxed">{message.text}</p>
              {message.imageKey && MESSAGE_IMAGES[message.imageKey] && (
                <img
                  src={MESSAGE_IMAGES[message.imageKey]}
                  alt=""
                  className="w-full h-36 object-cover rounded-xl mt-2 border border-purple-200/40"
                />
              )}
              <p className="text-[10px] opacity-50 mt-1">{message.time}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isUser = message.type === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} my-2`}>
      <div className={`max-w-xs rounded-2xl px-4 py-3 text-sm ${
        isUser
          ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
          : 'bg-white border border-purple-200 text-amber-900'
      }`}>
        {!isUser && (
          <p className="text-[10px] font-semibold text-purple-500 mb-1">{message.senderName || 'Match'}</p>
        )}
        <p className="leading-relaxed">{message.text}</p>
        <p className={`text-[10px] mt-1 ${isUser ? 'text-white/60' : 'opacity-40'}`}>{message.time}</p>
      </div>
    </div>
  );
}

export default function MessagingPortal({ matchedUser, sessionData, onBack }) {
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    const now = new Date();
    const timeStr = `Today, ${now.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit'})}`;
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      type: 'user',
      text: inputText.trim(),
      time: timeStr
    }]);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium"
        style={{fontFamily: 'Work Sans, sans-serif'}}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-gradient-to-r from-purple-100/80 to-rose-100/80 rounded-3xl p-5 border border-purple-200/50">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-rose-200 rounded-2xl flex items-center justify-center text-xl">
            {matchedUser.avatar}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
              {matchedUser.name}
            </h3>
            <p className="text-xs text-purple-500">{matchedUser.distance} · {matchedUser.similarityScore}% trajectory match</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrajectoryMiniChart
          sessionData={sessionData}
          label="Your Journey"
          color="#ea580c"
          bgGradient="bg-orange-50/80 border-orange-200/50"
        />
        <TrajectoryMiniChart
          sessionData={matchedUser.sessionData}
          label={`${matchedUser.name}'s Journey`}
          color="#a855f7"
          bgGradient="bg-purple-50/80 border-purple-200/50"
        />
      </div>

      <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-purple-200/30 overflow-hidden">
        <div className="max-h-96 overflow-y-auto p-4 space-y-1">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={{...msg, senderName: matchedUser.name}} />
          ))}
        </div>

        <div className="border-t border-purple-100 p-4 bg-white/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 bg-white/80 border border-purple-200/50 rounded-full px-4 py-2.5 text-sm text-amber-900 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              style={{fontFamily: 'Work Sans, sans-serif'}}
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
