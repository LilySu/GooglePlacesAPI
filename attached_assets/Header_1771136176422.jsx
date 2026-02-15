import { Sprout } from 'lucide-react';
import userProfileImg from '@assets/anna-keibalo-FvISk7v55o8-unsplash_1771112533870.png';

export default function Header() {
  return (
    <div className="relative text-center mb-8 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
      <img
        src={userProfileImg}
        alt="Profile"
        className="absolute top-0 right-0 w-11 h-11 rounded-full object-cover border-2 border-amber-300/60 shadow-sm"
      />
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
