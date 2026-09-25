import React, { useState, useEffect } from 'react';
import { SubletListing, Campus, CurrentUser } from '../types';

interface CampusInteractiveMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: SubletListing[];
  currentCampus: Campus;
  currentUser: CurrentUser;
  onSelectListing: (listing: SubletListing) => void;
  onMessagePoster: (listing: SubletListing) => void;
}

export const CampusInteractiveMapModal: React.FC<CampusInteractiveMapModalProps> = ({
  isOpen,
  onClose,
  listings,
  currentCampus,
  currentUser,
  onSelectListing,
  onMessagePoster,
}) => {
  const [selectedListing, setSelectedListing] = useState<SubletListing | null>(null);
  const [mapMode, setMapMode] = useState<'shuttles' | 'walk' | 'bike'>('shuttles');
  const [radarOffset, setRadarOffset] = useState<number>(0);

  // Filter listings for current campus
  const campusListings = listings.filter((l) => l.campusId === currentCampus.id);

  useEffect(() => {
    const timer = setInterval(() => {
      setRadarOffset((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm">
      <div className="bg-stone-900 text-white rounded-2xl shadow-2xl border border-stone-800 max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <div className="px-6 py-4 bg-stone-950 border-b border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                Device GPS Synced · {currentUser.deviceType?.toUpperCase() || 'IOS'} Maps & Transit
              </span>
            </div>
            <h2 className="text-xl font-bold font-display mt-1 text-white">
              {currentCampus.name} Interactive Campus & Housing Map
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Map Mode selector */}
            <div className="flex items-center bg-stone-900 p-1 rounded-lg border border-stone-700 text-xs">
              <button
                onClick={() => setMapMode('shuttles')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  mapMode === 'shuttles' ? 'bg-white text-stone-900 font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                🚌 Shuttle Stops
              </button>
              <button
                onClick={() => setMapMode('walk')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  mapMode === 'walk' ? 'bg-white text-stone-900 font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                🚶 Lecture Walks
              </button>
              <button
                onClick={() => setMapMode('bike')}
                className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                  mapMode === 'bike' ? 'bg-white text-stone-900 font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                🚲 Bike Lanes
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-2 rounded-lg bg-stone-800 hover:bg-stone-700 cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Map Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-stone-950 flex flex-col justify-between p-6">
          {/* Simulated Map SVG Background */}
          <svg className="absolute inset-0 w-full h-full opacity-70 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#262626" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100% " fill="url(#mapGrid)" />

            {/* Campus Boundary & Roads */}
            <path
              d="M 100,80 C 350,50 600,120 850,90 C 950,150 920,350 900,500 C 850,650 600,720 350,680 C 150,650 80,450 100,80 Z"
              fill="none"
              stroke="#334155"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 200,200 C 400,180 600,250 800,220"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />
            <path
              d="M 300,100 C 320,300 280,500 350,650"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
            />

            {/* Live Shuttle Loop Line */}
            <path
              d="M 150,150 C 380,120 580,190 810,170 C 880,300 840,550 780,600 C 550,650 320,580 200,450 Z"
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          </svg>

          {/* User Location Radar Pulse */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 animate-ping absolute" />
            <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-lg z-10">
              📍
            </div>
            <div className="bg-stone-900/90 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-stone-700 mt-2 shadow-xl">
              Your Device GPS ({currentCampus.shortName} Campus)
            </div>
          </div>

          {/* Interactive Listing Pins on Map */}
          <div className="absolute inset-0 pointer-auto">
            {campusListings.map((l, index) => {
              // Deterministic spread positioning for mockup pins
              const offsets = [
                { top: '25%', left: '30%' },
                { top: '60%', left: '70%' },
                { top: '40%', left: '65%' },
                { top: '70%', left: '25%' },
                { top: '30%', left: '75%' },
              ];
              const pos = offsets[index % offsets.length];
              const isSelected = selectedListing?.id === l.id;

              return (
                <div
                  key={l.id}
                  className="absolute z-20 transition-transform hover:scale-110 cursor-pointer"
                  style={{ top: pos.top, left: pos.left }}
                  onClick={() => setSelectedListing(l)}
                >
                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-1.5 border transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-stone-950 border-white scale-110 shadow-amber-400/50'
                        : 'bg-stone-900 text-white border-stone-700 hover:bg-stone-800'
                    }`}
                  >
                    <span>🏠</span>
                    <span className="font-mono">${l.pricePerMonth}</span>
                    <span className="text-[10px] opacity-85 hidden sm:inline">· {l.transit?.walkTimeToStopMin || 2}m stop</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Map Legend / Info Overlay */}
          <div className="relative z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
            <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-xl p-3 text-xs space-y-1 shadow-2xl max-w-xs pointer-events-auto">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                {currentCampus.primaryShuttleName}
              </span>
              <p className="font-semibold text-white">Hub: {currentCampus.transitHub}</p>
              <p className="text-[11px] text-stone-400">
                Click any property pin to inspect live commute times, bike lane scores, and walking distance to classes.
              </p>
            </div>

            {/* Map Mode Status Pill */}
            <div className="bg-stone-900/90 backdrop-blur-md border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-300 font-mono shadow-2xl pointer-events-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                {mapMode === 'shuttles' && 'Showing Active Shuttle Stops & Next Arrivals'}
                {mapMode === 'walk' && 'Showing Walking Paths to Lecture Halls'}
                {mapMode === 'bike' && 'Showing Protected Grade-Separated Bike Lanes'}
              </span>
            </div>
          </div>

          {/* Selected Listing Popup Card (Bottom Sheet on Map) */}
          {selectedListing && (
            <div className="absolute bottom-6 left-6 right-6 z-40 bg-stone-900 border border-stone-700 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-stone-800 border border-stone-700 overflow-hidden shrink-0 flex items-center justify-center text-2xl">
                  🏠
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400">
                    <span className="text-amber-400 font-semibold">{selectedListing.neighborhood}</span>
                    <span>·</span>
                    <span>{selectedListing.roomType}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedListing.title}</h3>
                  <p className="text-xs text-stone-300 mt-0.5">
                    📍 {selectedListing.address} ({selectedListing.distanceToCampus})
                  </p>
                </div>
              </div>

              {/* Transit Stats & Actions */}
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-stone-800">
                {selectedListing.transit && (
                  <div className="text-right text-xs">
                    <div className="text-emerald-400 font-mono font-semibold">
                      {selectedListing.transit.walkTimeToStopMin}m walk to shuttle
                    </div>
                    <div className="text-stone-400 text-[11px]">
                      Bike Score: <strong className="text-white">{selectedListing.transit.bikeLaneSafetyScore}/100</strong>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectListing(selectedListing);
                    }}
                    className="px-3 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onMessagePoster(selectedListing);
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                  >
                    Message Host
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
