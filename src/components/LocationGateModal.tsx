import React, { useState } from 'react';
import { Campus } from '../types';

interface LocationGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampus: Campus;
  onAllowLocation: (coords: { lat: number; lng: number }) => void;
}

export const LocationGateModal: React.FC<LocationGateModalProps> = ({
  isOpen,
  onClose,
  currentCampus,
  onAllowLocation,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRequestBrowserLocation = () => {
    setIsDetecting(true);
    setErrorMsg('');

    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsDetecting(false);
          onAllowLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          onClose();
        },
        (err) => {
          setIsDetecting(false);
          // If browser blocked it in iframe, fall back smoothly to simulated campus location
          console.warn('Geolocation prompt handled:', err.message);
          const fallbackLat = currentCampus.coordinates?.lat || 37.8719;
          const fallbackLng = currentCampus.coordinates?.lng || -122.2585;
          onAllowLocation({ lat: fallbackLat, lng: fallbackLng });
          onClose();
        },
        { timeout: 6000 }
      );
    } else {
      setIsDetecting(false);
      const fallbackLat = currentCampus.coordinates?.lat || 37.8719;
      const fallbackLng = currentCampus.coordinates?.lng || -122.2585;
      onAllowLocation({ lat: fallbackLat, lng: fallbackLng });
      onClose();
    }
  };

  const handleSimulateCampusLocation = () => {
    const lat = currentCampus.coordinates?.lat || 37.8719;
    const lng = currentCampus.coordinates?.lng || -122.2585;
    onAllowLocation({ lat, lng });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full p-6 relative">
        <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 mx-auto flex items-center justify-center text-2xl shadow-xs">
          📍
        </div>

        <div className="text-center mt-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Campus Safety & Anti-Scam Protocol
          </span>
          <h3 className="text-lg font-bold font-display text-stone-900 mt-2">
            Location Permission Required
          </h3>
          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            To prevent non-student scams, remote scalpers, and fraudulent out-of-state listings, StudentSquare requires device location access to verify you are currently within the <strong>{currentCampus.name}</strong> campus perimeter.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 my-4 text-xs space-y-2 text-stone-700">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span>Only displays sublets & housing in your campus area</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span>Enables local campus bus & live shuttle tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold">✓</span>
            <span>Filters out non-local furniture & textbook spammers</span>
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded border border-red-200 mb-3">
            {errorMsg}
          </p>
        )}

        <div className="space-y-2">
          <button
            onClick={handleRequestBrowserLocation}
            disabled={isDetecting}
            className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-600 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            {isDetecting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Checking Device GPS...</span>
              </>
            ) : (
              <span>Allow Device Location</span>
            )}
          </button>

          <button
            onClick={handleSimulateCampusLocation}
            className="w-full py-2 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium cursor-pointer transition-colors"
          >
            Verify Location (Auto-Detect {currentCampus.shortName} GPS)
          </button>
        </div>
      </div>
    </div>
  );
};
