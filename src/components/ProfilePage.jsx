import { ArrowLeft, Crown, CreditCard, User, Calendar, ChevronRight } from 'lucide-react';
import userProfileImg from '@assets/anna-keibalo-FvISk7v55o8-unsplash_1771112533870_1771120987645.png';

export default function ProfilePage({ onBack }) {
  return (
    <div className="space-y-6 animate-fadeInUp">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-900 transition-colors font-medium"
        style={{fontFamily: 'Work Sans, sans-serif'}}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-orange-200/50">
        <div className="flex items-center gap-5 mb-6">
          <img
            src={userProfileImg}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-3 border-amber-300/60 shadow-md"
          />
          <div>
            <h2 className="text-2xl font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
              Jordan Mitchell
            </h2>
            <p className="text-sm text-amber-600" style={{fontFamily: 'Work Sans, sans-serif'}}>
              jordan.mitchell@email.com
            </p>
            <p className="text-xs text-amber-500 mt-1" style={{fontFamily: 'Work Sans, sans-serif'}}>
              Member since January 2026
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-2">
          <div className="bg-amber-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-semibold text-amber-900">5</p>
            <p className="text-xs text-amber-600" style={{fontFamily: 'Work Sans, sans-serif'}}>Sessions</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-semibold text-amber-900">28</p>
            <p className="text-xs text-amber-600" style={{fontFamily: 'Work Sans, sans-serif'}}>Days Active</p>
          </div>
          <div className="bg-amber-50 rounded-2xl p-4 text-center">
            <p className="text-2xl font-semibold text-amber-900">87%</p>
            <p className="text-xs text-amber-600" style={{fontFamily: 'Work Sans, sans-serif'}}>Match Score</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-6 border border-amber-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                Subscription Plan
              </h3>
              <p className="text-sm text-amber-600" style={{fontFamily: 'Work Sans, sans-serif'}}>
                Manage your membership
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-100 px-3 py-1 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                Free Tier
              </span>
            </div>
            <button className="px-5 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all" style={{fontFamily: 'Work Sans, sans-serif'}}>
              Upgrade to Premium
            </button>
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <p className="text-sm text-amber-800" style={{fontFamily: 'Work Sans, sans-serif'}}>5 session uploads per month</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <p className="text-sm text-amber-800" style={{fontFamily: 'Work Sans, sans-serif'}}>Basic biomarker tracking</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <p className="text-sm text-amber-800" style={{fontFamily: 'Work Sans, sans-serif'}}>1 community match</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
              <p className="text-sm text-amber-500" style={{fontFamily: 'Work Sans, sans-serif'}}>Unlimited uploads (Premium)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
              <p className="text-sm text-amber-500" style={{fontFamily: 'Work Sans, sans-serif'}}>Advanced analytics & trends (Premium)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-amber-300 rounded-full" />
              <p className="text-sm text-amber-500" style={{fontFamily: 'Work Sans, sans-serif'}}>Unlimited community matches (Premium)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-orange-200/50 overflow-hidden">
        <h3 className="text-lg font-semibold text-amber-900 px-6 pt-6 pb-3" style={{fontFamily: 'Spectral, serif'}}>
          Account Settings
        </h3>
        <SettingsRow icon={<User className="w-5 h-5 text-amber-600" />} label="Edit Profile" subtitle="Name, photo, bio" />
        <SettingsRow icon={<CreditCard className="w-5 h-5 text-amber-600" />} label="Billing & Payment" subtitle="No payment method on file" />
        <SettingsRow icon={<Calendar className="w-5 h-5 text-amber-600" />} label="Connected Apps" subtitle="Google Fit, Apple Health" last />
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-amber-400" style={{fontFamily: 'Work Sans, sans-serif'}}>
          Embodied v1.0 · Terms of Service · Privacy Policy
        </p>
      </div>
    </div>
  );
}

function SettingsRow({ icon, label, subtitle, last }) {
  return (
    <button className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-amber-50/60 transition-colors ${!last ? 'border-b border-orange-100/50' : ''}`}>
      <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-amber-900" style={{fontFamily: 'Work Sans, sans-serif'}}>{label}</p>
        <p className="text-xs text-amber-500" style={{fontFamily: 'Work Sans, sans-serif'}}>{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
    </button>
  );
}
