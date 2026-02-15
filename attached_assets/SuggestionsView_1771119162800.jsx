import { Leaf, Calendar, Heart, Sprout, Sparkles } from 'lucide-react';
import { suggestions } from '../data/suggestions';

export default function SuggestionsView({ currentDay, setCurrentDay }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3 mb-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
        {[
          { key: 'day1', label: 'Today' },
          { key: 'day2', label: 'Tomorrow' },
          { key: 'day3', label: 'Day After' },
        ].map(day => (
          <button
            key={day.key}
            onClick={() => setCurrentDay(day.key)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              currentDay === day.key
                ? 'bg-amber-600 text-white shadow-lg'
                : 'bg-white/60 text-amber-700 hover:bg-white/80'
            }`}
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            {day.label}
          </button>
        ))}
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
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
  );
}
