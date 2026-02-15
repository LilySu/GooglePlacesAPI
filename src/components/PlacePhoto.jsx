// ============================================
// PlacePhoto.jsx - Null-safe version
// ============================================
import { useState, useEffect } from 'react';

function PlacePhoto({ place, fallbackImage, altText, className }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setPhotoUrl(null);

    if (!place || !window.google) {
      setLoading(false);
      return;
    }

    if (place.photos && place.photos.length > 0) {
      try {
        const photo = place.photos[0];
        const url = photo.getUrl({
          maxWidth: 800,
          maxHeight: 600
        });
        
        console.log('📸 Loading photo for', place.name || 'unknown');
        setPhotoUrl(url);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error getting photo:', err);
        setError(true);
        setLoading(false);
      }
    } else {
      console.log('📷 No photos available');
      setError(true);
      setLoading(false);
    }
  }, [place]);

  if (loading || error || !photoUrl) {
    return (
      <div className="relative">
        <img
          src={fallbackImage}
          alt={altText}
          className={className}
        />
        {loading && place && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={photoUrl}
        alt={place?.name ? `${place.name} - ${altText}` : altText}
        className={`${className} transition-opacity duration-300`}
        onError={() => {
          console.log('❌ Failed to load image');
          setError(true);
        }}
      />
      <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
        📸 Place photo
      </div>
    </div>
  );
}

export default PlacePhoto;
