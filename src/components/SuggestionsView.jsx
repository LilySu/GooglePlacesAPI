import { useState, useEffect, useRef } from 'react';
import { Leaf, Calendar, Heart, Sprout, Sparkles, MapPin, Star, Shuffle } from 'lucide-react';
import { suggestions as staticSuggestions } from '../data/suggestions';
import harvestBowlImg from '@assets/j-g-1yDF6qRULCY-unsplash_1771111819808_1771120987644.jpg';
import purplePotatoesImg from '@assets/zoshua-colah-Hz5Q8RstsNg-unsplash_1771111849811_1771120987643.jpg';

const BIOMARKER_ALERTS = [
  {
    label: 'Grip Strength',
    dropPercent: 10,
    emoji: '\u{1F932}',
    exercise: 'Downward Facing Dog',
    description: 'Holding this pose rebuilds the hand-to-floor connection and strengthens your grip endurance.',
    gradient: 'from-rose-100/90 to-orange-50/90',
    accent: 'rose',
  },
  {
    label: 'Core Stability',
    dropPercent: 5,
    emoji: '\u{1F9D8}',
    exercise: 'Hold a Plank',
    prescription: 'Aim for at least 15 seconds, 4 times a week.',
    description: 'Rebuilding your plank hold restores the deep core engagement needed for every movement you do.',
    gradient: 'from-amber-100/90 to-orange-50/90',
    accent: 'amber',
  },
  {
    label: 'Balance & Symmetry',
    dropPercent: 5,
    emoji: '\u{1F333}',
    exercise: 'Tree Pose (L)',
    description: 'Practicing a static balance pose helps recalibrate your stability and weight distribution.',
    gradient: 'from-orange-100/90 to-amber-50/90',
    accent: 'orange',
  },
];

const ACCENT_STYLES = {
  rose: {
    badge: 'bg-rose-200/70 text-rose-700',
    border: 'border-rose-200/60',
    heading: 'text-rose-800',
    tag: 'text-rose-600',
  },
  amber: {
    badge: 'bg-amber-200/70 text-amber-700',
    border: 'border-amber-200/60',
    heading: 'text-amber-800',
    tag: 'text-amber-600',
  },
  orange: {
    badge: 'bg-orange-200/70 text-orange-700',
    border: 'border-orange-200/60',
    heading: 'text-orange-800',
    tag: 'text-orange-600',
  },
};

function AlertCard({ alert, index }) {
  const s = ACCENT_STYLES[alert.accent];

  return (
    <div
      className={`bg-gradient-to-br ${alert.gradient} rounded-3xl p-6 border ${s.border} card-hover animate-fadeInUp`}
      style={{ animationDelay: `${0.15 + index * 0.12}s` }}
    >
      <div className="flex items-start gap-5">
        <div className="text-4xl flex-shrink-0 pt-1">{alert.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-sm uppercase tracking-widest font-semibold ${s.tag}`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
              {alert.label}
            </span>
            <span className={`text-sm ${s.badge} px-3 py-1 rounded-full font-semibold`} style={{ fontFamily: 'Work Sans, sans-serif' }}>
              ↓ {alert.dropPercent}% this month
            </span>
          </div>
          <h4 className={`text-xl md:text-2xl font-semibold ${s.heading} mb-1`} style={{ fontFamily: 'Spectral, serif' }}>
            {alert.exercise}
          </h4>
          {alert.prescription && (
            <p className="text-base font-medium text-amber-800 mb-1.5" style={{ fontFamily: 'Work Sans, sans-serif' }}>
              {alert.prescription}
            </p>
          )}
          <p className="text-base text-amber-700/90 leading-relaxed" style={{ fontFamily: 'Work Sans, sans-serif' }}>
            {alert.description}
          </p>
        </div>
      </div>
    </div>
  );
}

let googleMapsPromise = null;
function loadGoogleMapsOnce() {
  if (window.google) return Promise.resolve();
  if (googleMapsPromise) return googleMapsPromise;
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API;
  if (!apiKey) return Promise.resolve();
  googleMapsPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
  return googleMapsPromise;
}

function MiniMap({ place }) {
  const ref = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const placeId = place?.place_id || place?.name || null;

  useEffect(() => {
    console.log('🗺️ MiniMap useEffect triggered', { 
      hasPlace: !!place, 
      placeName: place?.name,
      placeId: placeId,
      hasGeometry: !!place?.geometry?.location 
    });

    if (!ref.current || !window.google || !place?.geometry?.location) {
      console.log('⏸️ MiniMap skipping - missing requirements');
      // Clear any existing map when no place
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
        markerInstance.current = null;
      }
      return;
    }

    const pos = {
      lat: typeof place.geometry.location.lat === 'function' 
        ? place.geometry.location.lat() 
        : place.geometry.location.lat,
      lng: typeof place.geometry.location.lng === 'function' 
        ? place.geometry.location.lng() 
        : place.geometry.location.lng,
    };

    console.log('📍 MiniMap rendering', { pos, placeName: place.name });

    // Clean up old marker
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
      markerInstance.current = null;
    }

    if (mapInstance.current) {
      // Update existing map
      mapInstance.current.setCenter(pos);
      mapInstance.current.setZoom(15);
    } else {
      // Create new map instance
      mapInstance.current = new window.google.maps.Map(ref.current, {
        center: pos,
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: false,
        draggable: false,
        scrollwheel: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          { featureType: 'water', stylers: [{ color: '#d4e4f7' }] },
        ],
      });
    }

    // Create new marker
    markerInstance.current = new window.google.maps.Marker({
      position: pos,
      map: mapInstance.current,
      title: place.name,
    });

    console.log('✅ MiniMap marker created for', place.name);

  }, [place, placeId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
    };
  }, []);

  // FIXED: Always render the div, even when no place
  // This ensures the ref is available when place data arrives
  return (
    <div
      ref={ref}
      className="w-full h-36 rounded-xl border border-orange-200/30 mt-3"
      style={{ 
        minHeight: '144px',
        backgroundColor: place?.geometry?.location ? 'transparent' : '#f3f4f6' // Gray when loading
      }}
    >
      {!place?.geometry?.location && (
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          Loading map...
        </div>
      )}
    </div>
  );
}

export default function SuggestionsView({ currentDay, setCurrentDay, sessionData }) {
  const [activityResults, setActivityResults] = useState([]);
  const [mealResults, setMealResults] = useState([]);
  const [groceryResults, setGroceryResults] = useState([]);
  const [activityIdx, setActivityIdx] = useState(0);
  const [mealIdx, setMealIdx] = useState(0);
  const [groceryIdx, setGroceryIdx] = useState(0);
  const [placesReady, setPlacesReady] = useState(false);
  const [shuffling, setShuffling] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const placesServiceRef = useRef(null);

  const staticDay = staticSuggestions[currentDay];

  const activitySearch = staticDay.activity.searchKeyword;
  const mealSearch = staticDay.meal.searchKeyword;
  const grocerySearch = staticDay.grocery.searchKeyword;

  const activityMeta = staticDay.activity;
  const mealMeta = staticDay.meal;
  const groceryMeta = staticDay.grocery;
  const microPractice = staticDay.microPractice;

  const activityPlace = activityResults[activityIdx] || null;
  const mealPlace = mealResults[mealIdx] || null;
  const groceryPlace = groceryResults[groceryIdx] || null;

  useEffect(() => {
    const run = async () => {
      await loadGoogleMapsOnce();
      if (!window.google) return;
      setPlacesReady(true);
    };
    run();
  }, []);

  useEffect(() => {
    console.log('🔄 Search Effect Triggered', {
      currentDay,
      placesReady,
      hasGoogle: !!window.google,
      searches: { activitySearch, mealSearch, grocerySearch }
    });

    setActivityResults([]);
    setMealResults([]);
    setGroceryResults([]);
    setActivityIdx(0);
    setMealIdx(0);
    setGroceryIdx(0);

    if (!placesReady || !window.google) {
      console.log('⏸️ Skipping search - not ready');
      return;
    }

    if (!activitySearch && !mealSearch && !grocerySearch) {
      console.log('⚠️ No search keywords found!');
      return;
    }

    setIsSearching(true);

    const location = { lat: 37.7749, lng: -122.4194 };

    if (!placesServiceRef.current) {
      const attrDiv = document.createElement('div');
      placesServiceRef.current = new window.google.maps.places.PlacesService(attrDiv);
    }

    const service = placesServiceRef.current;
    let completedSearches = 0;
    const totalSearches = [activitySearch, mealSearch, grocerySearch].filter(Boolean).length;

    const onSearchComplete = () => {
      completedSearches++;
      console.log(`✅ Search ${completedSearches}/${totalSearches} complete`);
      if (completedSearches === totalSearches) {
        setIsSearching(false);
      }
    };

    if (activitySearch) {
      console.log('🔍 Searching activity:', activitySearch);
      service.nearbySearch(
        { location, radius: 8000, keyword: activitySearch },
        (results, status) => {
          console.log('Activity search result:', status, results?.length || 0);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length) {
            setActivityResults(results.slice(0, 10));
          }
          onSearchComplete();
        }
      );
    }

    if (mealSearch) {
      console.log('🔍 Searching meal:', mealSearch);
      service.nearbySearch(
        { location, radius: 8000, keyword: mealSearch },
        (results, status) => {
          console.log('Meal search result:', status, results?.length || 0);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length) {
            setMealResults(results.slice(0, 10));
          }
          onSearchComplete();
        }
      );
    }

    if (grocerySearch) {
      console.log('🔍 Searching grocery:', grocerySearch);
      service.nearbySearch(
        { location, radius: 8000, keyword: grocerySearch },
        (results, status) => {
          console.log('Grocery search result:', status, results?.length || 0);
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length) {
            setGroceryResults(results.slice(0, 10));
          }
          onSearchComplete();
        }
      );
    }

    if (totalSearches === 0) {
      setIsSearching(false);
    }

  }, [currentDay, placesReady, activitySearch, mealSearch, grocerySearch]);

  const handleShuffle = () => {
    console.log('🎲 Shuffle triggered');
    setShuffling(true);
    const pickRandom = (arr, currentIdx) => {
      if (arr.length <= 1) return 0;
      let next;
      do { next = Math.floor(Math.random() * arr.length); } while (next === currentIdx && arr.length > 1);
      return next;
    };
    setActivityIdx(pickRandom(activityResults, activityIdx));
    setMealIdx(pickRandom(mealResults, mealIdx));
    setGroceryIdx(pickRandom(groceryResults, groceryIdx));
    setTimeout(() => setShuffling(false), 400);
  };

  const activityTitle = activityPlace ? activityPlace.name : activityMeta.title;
  const activityLocation = activityPlace ? activityPlace.vicinity : activityMeta.location;
  const activityRating = activityPlace?.rating;
  const activityTime = activityMeta.time;
  const activityBenefit = activityMeta.benefit;

  const mealTitle = mealPlace ? mealPlace.name : (mealMeta.item || mealMeta.title);
  const mealLocation = mealPlace ? mealPlace.vicinity : mealMeta.location;
  const mealRating = mealPlace?.rating;
  const mealWhy = mealMeta.why;

  const groceryTitle = groceryPlace ? groceryPlace.name : (groceryMeta.item || groceryMeta.title);
  const groceryLocation = groceryPlace ? groceryPlace.vicinity : groceryMeta.location;
  const groceryRating = groceryPlace?.rating;
  const groceryWhy = groceryMeta.why;

  const hasResults = activityResults.length > 0 || mealResults.length > 0 || groceryResults.length > 0;

  return (
    <div className="space-y-6">
      {isSearching && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          🔍 Searching places...
        </div>
      )}

      <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-sm uppercase tracking-widest text-rose-600 font-semibold px-1" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Your Body This Month
        </h3>
        {BIOMARKER_ALERTS.map((alert, i) => (
          <AlertCard key={alert.label} alert={alert} index={i} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 mb-6 animate-fadeInUp" style={{animationDelay: '0.5s'}}>
        <div className="flex items-center gap-3">
          {[
            { key: 'day1', label: 'Today' },
            { key: 'day2', label: 'Tomorrow' },
            { key: 'day3', label: 'Day After' },
          ].map(day => (
            <button
              key={day.key}
              onClick={() => {
                console.log('📅 Day button clicked:', day.key);
                setCurrentDay(day.key);
              }}
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
        {hasResults && (
          <button
            onClick={handleShuffle}
            disabled={shuffling}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full text-sm font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-60"
            style={{fontFamily: 'Work Sans, sans-serif'}}
          >
            <Shuffle className={`w-4 h-4 ${shuffling ? 'animate-spin' : ''}`} />
            Discover Something New
          </button>
        )}
      </div>

      <div className="bg-gradient-to-br from-rose-100/80 to-orange-100/80 rounded-3xl p-4 sm:p-6 md:p-8 border border-rose-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.55s'}}>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/80 rounded-2xl flex items-center justify-center flex-shrink-0 animate-float">
            <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wider text-rose-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
              Today's Micro-Practice
            </h3>
            <p className="text-lg sm:text-2xl text-amber-900 font-light leading-relaxed" style={{fontFamily: 'Spectral, serif'}}>
              {microPractice}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-orange-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.6s'}}>
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-orange-600" style={{fontFamily: 'Work Sans, sans-serif'}}>
                {activityTime}
              </span>
              {activityPlace && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Near You
                </span>
              )}
            </div>
            <h4 className="text-2xl text-amber-900 font-semibold mb-1" style={{fontFamily: 'Spectral, serif'}}>
              {activityTitle}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-3 h-3 text-amber-500" />
              <p className="text-sm text-amber-700" style={{fontFamily: 'Work Sans, sans-serif'}}>
                {activityLocation}
              </p>
              {activityRating && (
                <>
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 ml-2" />
                  <span className="text-xs text-amber-600">{activityRating}</span>
                </>
              )}
            </div>
            <p className="text-sm text-amber-800 font-light italic line-clamp-1" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {activityBenefit}
            </p>
            <MiniMap place={activityPlace} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 animate-fadeInUp" style={{animationDelay: '0.7s'}}>
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-4 sm:p-6 border border-amber-200/50 card-hover flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                Nourishment Suggestion
              </h3>
              {mealPlace && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Near You
                </span>
              )}
            </div>
          </div>
          <p className="text-xl text-amber-900 font-light mb-1" style={{fontFamily: 'Spectral, serif'}}>
            {mealTitle}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-amber-500" />
            <p className="text-sm text-amber-700 truncate" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {mealLocation}
            </p>
            {mealRating && (
              <>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 ml-1 flex-shrink-0" />
                <span className="text-xs text-amber-600 flex-shrink-0">{mealRating}</span>
              </>
            )}
          </div>
          <p className="text-sm text-amber-800 font-light line-clamp-1 mb-3" style={{fontFamily: 'Work Sans, sans-serif'}}>
            {mealWhy}
          </p>
          <div className="mt-auto">
            <img
              src={harvestBowlImg}
              alt="Nourishment suggestion"
              className="w-full h-36 object-cover rounded-2xl border border-amber-200/50"
            />
            <MiniMap place={mealPlace} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl p-4 sm:p-6 border border-rose-200/50 card-hover flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center flex-shrink-0">
              <Sprout className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                Shopping Suggestion
              </h3>
              {groceryPlace && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Near You
                </span>
              )}
            </div>
          </div>
          <p className="text-xl text-amber-900 font-light mb-1" style={{fontFamily: 'Spectral, serif'}}>
            {groceryTitle}
          </p>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <p className="text-sm text-rose-700 truncate" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {groceryLocation}
            </p>
            {groceryRating && (
              <>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500 ml-1 flex-shrink-0" />
                <span className="text-xs text-amber-600 flex-shrink-0">{groceryRating}</span>
              </>
            )}
          </div>
          <p className="text-sm text-amber-800 font-light line-clamp-1 mb-3" style={{fontFamily: 'Work Sans, sans-serif'}}>
            {groceryWhy}
          </p>
          <div className="mt-auto">
            <img
              src={purplePotatoesImg}
              alt="Shopping suggestion"
              className="w-full h-36 object-cover rounded-2xl border border-rose-200/50"
            />
            <MiniMap place={groceryPlace} />
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 border border-amber-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.8s'}}>
        <div className="flex items-start gap-3 sm:gap-4">
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