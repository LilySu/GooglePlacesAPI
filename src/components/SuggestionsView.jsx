import { useState, useEffect, useRef, useCallback } from 'react';
import { Leaf, Calendar, Heart, Sprout, Sparkles, MapPin, Star, Loader2 } from 'lucide-react';
import { suggestions as staticSuggestions } from '../data/suggestions';

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

export default function SuggestionsView({ currentDay, setCurrentDay, bemAnalysis, sessionData }) {
  const [venueResults, setVenueResults] = useState([]);
  const [venueLoading, setVenueLoading] = useState(false);
  const [activityPlace, setActivityPlace] = useState(null);
  const [mealPlace, setMealPlace] = useState(null);
  const [groceryPlace, setGroceryPlace] = useState(null);
  const [placesReady, setPlacesReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const placesServiceRef = useRef(null);

  const recommendation = bemAnalysis?.recommendation;
  const placesQuery = bemAnalysis?.placesQuery;
  const profile = recommendation?.profile;
  const hasAI = !!recommendation;

  const staticDay = staticSuggestions[currentDay];

  const activitySearch = hasAI ? profile.activity?.searchKeyword : staticDay.activity.searchKeyword;
  const mealSearch = hasAI ? profile.meal?.searchKeyword : staticDay.meal.searchKeyword;
  const grocerySearch = hasAI ? profile.grocery?.searchKeyword : staticDay.grocery.searchKeyword;

  const activityMeta = hasAI ? profile.activity : staticDay.activity;
  const mealMeta = hasAI ? profile.meal : staticDay.meal;
  const groceryMeta = hasAI ? profile.grocery : staticDay.grocery;
  const microPractice = hasAI ? (profile.microPractice || staticDay.microPractice) : staticDay.microPractice;

  const getLocation = useCallback(() => {
    if (placesQuery?.query?.location) return placesQuery.query.location;
    return { lat: 37.7749, lng: -122.4194 };
  }, [placesQuery]);

  const searchPlace = useCallback((service, keyword, location, setter) => {
    if (!keyword) return;
    service.nearbySearch(
      { location, radius: 8000, keyword },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length) {
          setter(results[0]);
        }
      }
    );
  }, []);

  useEffect(() => {
    setActivityPlace(null);
    setMealPlace(null);
    setGroceryPlace(null);
  }, [currentDay, hasAI]);

  useEffect(() => {
    const run = async () => {
      await loadGoogleMapsOnce();
      if (!window.google) return;
      setPlacesReady(true);
    };
    run();
  }, []);

  useEffect(() => {
    if (!placesReady || !window.google) return;

    const location = getLocation();

    if (!placesServiceRef.current) {
      const attrDiv = document.createElement('div');
      placesServiceRef.current = new window.google.maps.places.PlacesService(attrDiv);
    }

    const service = placesServiceRef.current;

    if (activitySearch) searchPlace(service, activitySearch, location, setActivityPlace);
    if (mealSearch) searchPlace(service, mealSearch, location, setMealPlace);
    if (grocerySearch) searchPlace(service, grocerySearch, location, setGroceryPlace);
  }, [placesReady, activitySearch, mealSearch, grocerySearch, getLocation, searchPlace]);

  useEffect(() => {
    if (!hasAI || !placesReady || !placesQuery || !mapRef.current || !window.google) return;

    const location = getLocation();

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 13,
        disableDefaultUI: true,
        zoomControl: true,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
          { featureType: 'water', stylers: [{ color: '#d4e4f7' }] },
        ],
      });
    }

    setVenueLoading(true);
    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

    service.nearbySearch(
      { location, radius: placesQuery.query.radius || 5000, keyword: placesQuery.query.keyword },
      (results, status) => {
        setVenueLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setVenueResults(results.slice(0, 8));
          markersRef.current.forEach(m => m.setMap(null));
          markersRef.current = [];
          results.slice(0, 8).forEach(place => {
            const marker = new window.google.maps.Marker({
              position: place.geometry.location,
              map: mapInstanceRef.current,
              title: place.name,
            });
            markersRef.current.push(marker);
          });
        }
      }
    );
  }, [hasAI, placesReady, placesQuery, getLocation]);

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

      {hasAI && (
        <div className="bg-gradient-to-br from-orange-100 to-rose-100 rounded-3xl p-8 border border-orange-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.45s'}}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center flex-shrink-0 animate-float">
              <Sparkles className="w-7 h-7 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm uppercase tracking-wider text-orange-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                AI-Powered Biomarker Analysis
              </h3>
              <h4 className="text-2xl text-amber-900 mb-2 font-semibold" style={{fontFamily: 'Spectral, serif'}}>
                {placesQuery?.recommendation?.title}
              </h4>
              <p className="text-sm text-rose-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                Detected: {recommendation.profile.primaryStressor}
              </p>
              <p className="text-amber-800 leading-relaxed font-light" style={{fontFamily: 'Work Sans, sans-serif'}}>
                {recommendation.profile.reasoning}
              </p>
              {placesQuery?.recommendation?.lookingFor && (
                <p className="text-sm text-amber-600 mt-3 italic" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Looking for: {placesQuery.recommendation.lookingFor}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {hasAI && (
        <div className="animate-fadeInUp" style={{animationDelay: '0.5s'}}>
          <h3 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2" style={{fontFamily: 'Spectral, serif'}}>
            <MapPin className="w-5 h-5 text-orange-600" />
            Recommended Venues Near You
          </h3>
          <div
            ref={mapRef}
            className="w-full h-64 rounded-2xl border border-orange-200/50 mb-4"
            style={{ minHeight: '250px' }}
          />
          {venueLoading && (
            <div className="flex items-center justify-center gap-2 py-4 text-amber-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span style={{fontFamily: 'Work Sans, sans-serif'}}>Finding venues for you...</span>
            </div>
          )}
          {venueResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {venueResults.map(place => (
                <div key={place.place_id} className="bg-white/60 rounded-2xl p-4 border border-orange-100 card-hover">
                  <h4 className="text-sm font-semibold text-amber-900 mb-1" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    {place.name}
                  </h4>
                  <p className="text-xs text-amber-700 mb-1">{place.vicinity}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs text-amber-600">{place.rating || 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasAI && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200/50 text-center animate-fadeInUp" style={{animationDelay: '0.45s'}}>
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg text-amber-900 mb-2 font-semibold" style={{fontFamily: 'Spectral, serif'}}>
            Personalize These Suggestions
          </h3>
          <p className="text-sm text-amber-700" style={{fontFamily: 'Work Sans, sans-serif'}}>
            Upload a biomarker PDF report in the Upload tab for AI-powered recommendations tailored to your unique physiology.
          </p>
        </div>
      )}

      <div className="bg-gradient-to-br from-rose-100/80 to-orange-100/80 rounded-3xl p-8 border border-rose-200/50 card-hover animate-fadeInUp" style={{animationDelay: '0.5s'}}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-white/80 rounded-2xl flex items-center justify-center flex-shrink-0 animate-float">
            <Leaf className="w-7 h-7 text-rose-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wider text-rose-700 mb-2 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {hasAI ? 'Your Personalized Micro-Practice' : "Today's Micro-Practice"}
            </h3>
            <p className="text-2xl text-amber-900 font-light leading-relaxed" style={{fontFamily: 'Spectral, serif'}}>
              {microPractice}
            </p>
            {hasAI && (
              <p className="text-xs text-rose-600 mt-3 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                Based on your biomarker profile: {recommendation.profile.primaryStressor}
              </p>
            )}
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
                  {activityTime}
                </span>
                {hasAI && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    AI Recommended
                  </span>
                )}
                {activityPlace && !hasAI && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                    Near You
                  </span>
                )}
              </div>
              <h4 className="text-2xl text-amber-900 font-semibold mb-1" style={{fontFamily: 'Spectral, serif'}}>
                {activityTitle}
              </h4>
              {activityPlace && (
                <p className="text-xs text-orange-600 mb-1 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  {hasAI ? `Suggested activity: ${activityMeta.title}` : `For: ${staticDay.activity.title}`}
                </p>
              )}
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-3 h-3 text-amber-500" />
                <p className="text-sm text-amber-700" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  {activityLocation}
                </p>
              </div>
              {activityRating && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-amber-600">{activityRating}</span>
                </div>
              )}
              <p className="text-amber-800 font-light italic" style={{fontFamily: 'Work Sans, sans-serif'}}>
                {activityBenefit}
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
            <div>
              <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                Nourishment Suggestion
              </h3>
              {hasAI && (
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  AI Recommended
                </span>
              )}
              {mealPlace && !hasAI && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Near You
                </span>
              )}
            </div>
          </div>
          <p className="text-2xl text-amber-900 font-light mb-2" style={{fontFamily: 'Spectral, serif'}}>
            {mealTitle}
          </p>
          {mealPlace && (
            <p className="text-xs text-amber-600 mb-1 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {hasAI ? `Try their: ${mealMeta.item}` : `Try: ${staticDay.meal.item}`}
            </p>
          )}
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-amber-500" />
            <p className="text-sm text-amber-700" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {mealLocation}
            </p>
          </div>
          {mealRating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs text-amber-600">{mealRating}</span>
            </div>
          )}
          <p className="text-sm text-amber-800 font-light leading-relaxed" style={{fontFamily: 'Work Sans, sans-serif'}}>
            {mealWhy}
          </p>
        </div>

        <div className="bg-gradient-to-br from-rose-100 to-orange-100 rounded-3xl p-6 border border-rose-200/50 card-hover">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
              <Sprout className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-900" style={{fontFamily: 'Spectral, serif'}}>
                Shopping Suggestion
              </h3>
              {hasAI && (
                <span className="text-xs bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  AI Recommended
                </span>
              )}
              {groceryPlace && !hasAI && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full" style={{fontFamily: 'Work Sans, sans-serif'}}>
                  Near You
                </span>
              )}
            </div>
          </div>
          <p className="text-2xl text-amber-900 font-light mb-2" style={{fontFamily: 'Spectral, serif'}}>
            {groceryTitle}
          </p>
          {groceryPlace && (
            <p className="text-xs text-rose-600 mb-1 font-medium" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {hasAI ? `Look for: ${groceryMeta.item}` : `Look for: ${staticDay.grocery.item}`}
            </p>
          )}
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <p className="text-sm text-rose-700" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {groceryLocation}
            </p>
          </div>
          {groceryRating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-xs text-amber-600">{groceryRating}</span>
            </div>
          )}
          <p className="text-sm text-amber-800 font-light leading-relaxed" style={{fontFamily: 'Work Sans, sans-serif'}}>
            {groceryWhy}
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
              {hasAI ? 'Personalized for Your Biology' : 'Building Longevity Through Daily Choices'}
            </h4>
            <p className="text-amber-800 leading-relaxed font-light" style={{fontFamily: 'Work Sans, sans-serif'}}>
              {hasAI
                ? `These recommendations are tailored to your biomarker profile showing ${recommendation.profile.primaryStressor.toLowerCase()}. The activity, meal, and grocery suggestions work together to address your specific physiological needs — from movement that supports recovery to nutrition that targets the root cause.`
                : "These aren't just random suggestions—they're based on longevity research and real venues near you. Low-impact movement preserves your joints, anti-inflammatory foods reduce cellular aging, and micro-practices build consistency without overwhelm. You're not training for a marathon; you're building a life that lasts."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
