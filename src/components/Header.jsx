import { useState, useRef, useEffect } from 'react';
import { Sprout, Settings, LogOut } from 'lucide-react';
import userProfileImg from '@assets/anna-keibalo-FvISk7v55o8-unsplash_1771112533870_1771120987645.png';

export default function Header({ onProfileClick }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative text-center mb-8 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
      <div className="absolute top-0 right-0 z-50" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-full transition-transform hover:scale-105"
        >
          <img
            src={userProfileImg}
            alt="Profile"
            className="w-11 h-11 rounded-full object-cover border-2 border-amber-300/60 shadow-sm cursor-pointer"
          />
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-orange-200/50 overflow-hidden z-50 animate-fadeInUp">
            <button
              onClick={() => { setShowDropdown(false); onProfileClick(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-amber-900 hover:bg-amber-50 transition-colors"
              style={{fontFamily: 'Work Sans, sans-serif'}}
            >
              <Settings className="w-4 h-4 text-amber-600" />
              Settings
            </button>
            <div className="border-t border-orange-100" />
            <button
              onClick={() => { setShowDropdown(false); alert('You have been logged out.'); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-700 hover:bg-rose-50 transition-colors"
              style={{fontFamily: 'Work Sans, sans-serif'}}
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              Log Out
            </button>
          </div>
        )}
      </div>

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
  );
}
