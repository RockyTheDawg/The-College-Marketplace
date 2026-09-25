import React, { useState, useEffect } from 'react';
import { Campus, LocalBusRoute } from '../types';

interface CampusTransitHubProps {
  currentCampus: Campus;
  deviceType?: 'ios' | 'android' | 'desktop';
  onUpdateDeviceType?: (device: 'ios' | 'android' | 'desktop') => void;
  busSyncEnabled?: boolean;
  onToggleBusSync?: (enabled: boolean) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const CampusTransitHub: React.FC<CampusTransitHubProps> = ({
  currentCampus,
  deviceType: initialDeviceType = 'ios',
  onUpdateDeviceType,
  busSyncEnabled: initialBusSync = true,
  onToggleBusSync,
  onClose,
  isModal = false,
}) => {
  // Detect OS if not set
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) return 'ios';
      if (/android/.test(ua)) return 'android';
    }
    return initialDeviceType || 'ios';
  });

  const [busSyncEnabled, setBusSyncEnabled] = useState<boolean>(initialBusSync);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [alertSubscribed, setAlertSubscribed] = useState(false);
  const [simulatedBusOffset, setSimulatedBusOffset] = useState(0);

  // Fallback bus routes if not defined on campus
  const localBuses: LocalBusRoute[] = currentCampus.localBuses && currentCampus.localBuses.length > 0
    ? currentCampus.localBuses
    : [
        {
          routeNumber: 'C1',
          routeName: `${currentCampus.shortName} Campus Circulator`,
          destination: currentCampus.transitHub || 'Central Campus Station',
          etaMinutes: 2,
          crowdLevel: 'Low',
          isLive: true,
        },
        {
          routeNumber: 'C2',
          routeName: `${currentCampus.shortName} Express Shuttle`,
          destination: 'Student Union & Residence Halls',
          etaMinutes: 6,
          crowdLevel: 'Medium',
          isLive: true,
        },
        {
          routeNumber: 'RT-10',
          routeName: 'Local Metro Link',
          destination: 'Downtown & Transit Center',
          etaMinutes: 11,
          crowdLevel: 'Low',
          isLive: true,
        },
      ];

  const busApp = currentCampus.campusBusApp || {
    name: `${currentCampus.shortName} Bus & Transit Mobile`,
    appType: 'Official Campus Transit',
    isMobileSynced: true,
    iosUrl: 'https://apps.apple.com/us/app/passio-go/id1256385150',
    androidUrl: 'https://play.google.com/store/apps/details?id=com.passio3.go',
  };

  // Animate bus position along the simulated map
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedBusOffset((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleDeviceChange = (dev: 'ios' | 'android' | 'desktop') => {
    setDeviceType(dev);
    onUpdateDeviceType?.(dev);
  };

  const handleToggleSync = () => {
    const next = !busSyncEnabled;
    setBusSyncEnabled(next);
    onToggleBusSync?.(next);
  };

  return (
    <div className={`bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden ${isModal ? 'max-w-4xl w-full mx-auto' : 'w-full'}`}>
      {/* Header */}
      <div className="bg-stone-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-300">
              Live Campus Transit & Bus Overlay
            </span>
          </div>
          <h2 className="text-xl font-bold font-display mt-1 text-white flex items-center gap-2">
            <span>{currentCampus.name} Shuttle & Bus Map</span>
          </h2>
          <p className="text-xs text-stone-300 mt-1">
            Real-time live departures, device GPS synchronization, and local campus transit app integration
          </p>
        </div>

        {/* Device Sync & Close Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Device Selector */}
          <div className="flex items-center bg-stone-800 p-1 rounded-lg border border-stone-700 text-xs">
            <button
              onClick={() => handleDeviceChange('ios')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                deviceType === 'ios' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
              title="Sync with Apple Maps Transit (iOS)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.73 1.4-.58.67-1.1 1.76-.96 2.82 1.04.08 2.09-.5 2.73-1.28z" />
              </svg>
              <span>Apple iOS</span>
            </button>
            <button
              onClick={() => handleDeviceChange('android')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                deviceType === 'android' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-300 hover:text-white'
              }`}
              title="Sync with Google Maps Transit (Android)"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.125 12 8.125s-3.5902.2866-5.1367.8247L4.841 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
              </svg>
              <span>Android</span>
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="bg-stone-50 border-b border-stone-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${busSyncEnabled ? 'bg-emerald-500' : 'bg-stone-400'}`} />
          <span className="font-semibold text-stone-800">
            {busSyncEnabled
              ? `Synced with ${deviceType === 'ios' ? 'Apple Maps & iOS Transit' : 'Google Maps & Android Transit'}`
              : 'Device Sync Paused'}
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500 font-mono">
            {currentCampus.transitHub}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSync}
            className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
              busSyncEnabled
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
            }`}
          >
            {busSyncEnabled ? '✓ Sync Active' : 'Enable Device Sync'}
          </button>

          <button
            onClick={() => setIsWalletModalOpen(true)}
            className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <span>{deviceType === 'ios' ? 'Add to Apple Wallet' : 'Add to Google Wallet'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Live Interactive Bus Map + Local Bus Lines */}
      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Campus Bus Map (Interactive SVG/Canvas View) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Interactive Campus Bus Map</h3>
              <p className="text-xs text-stone-500">Live GPS telemetry of {currentCampus.name} campus shuttle routes</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live GPS Updates (Every 2s)
            </span>
          </div>

          {/* Interactive Map Visual */}
          <div className="relative w-full h-80 sm:h-96 rounded-xl bg-stone-950 border border-stone-800 overflow-hidden shadow-inner flex flex-col justify-between p-4">
            {/* Background Grid & Road Overlay (SVG) */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#262626" strokeWidth="0.7" />
                </pattern>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Campus Roads */}
              {/* Outer Loop */}
              <rect x="40" y="40" width="85%" height="75%" rx="24" fill="none" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
              <rect x="40" y="40" width="85%" height="75%" rx="24" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" strokeDasharray="6 6" />

              {/* Central Cross Street */}
              <line x1="40" y1="50%" x2="90%" y2="50%" stroke="#334155" strokeWidth="10" />
              <line x1="50%" y1="40" x2="50%" y2="85%" stroke="#334155" strokeWidth="10" />

              {/* Active Campus Bus Route Curve */}
              <path
                d="M 60,60 C 220,50 340,110 460,90 C 560,70 660,140 680,240 C 650,300 480,270 320,280 C 140,290 80,180 60,60 Z"
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="4"
                strokeDasharray="4 4"
                className="animate-pulse opacity-90"
              />

              {/* Bus Stops */}
              <circle cx="80" cy="80" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="320" cy="95" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="580" cy="115" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="640" cy="240" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="340" cy="280" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <circle cx="120" cy="240" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

              {/* User Location Pulse Marker */}
              <circle cx="280" cy="190" r="14" fill="#3b82f6" fillOpacity="0.3" className="animate-ping" />
              <circle cx="280" cy="190" r="6" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* Simulated Live Bus 1 Marker */}
            <div
              className="absolute z-10 transition-all duration-1000 ease-linear pointer-events-none"
              style={{
                left: `${30 + Math.sin(simulatedBusOffset * 0.1) * 35}%`,
                top: `${40 + Math.cos(simulatedBusOffset * 0.1) * 30}%`,
              }}
            >
              <div className="bg-emerald-500 text-stone-950 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-lg flex items-center gap-1 border border-white">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-ping" />
                <span>🚌 {localBuses[0]?.routeNumber || 'Bus 1'} · 2m ETA</span>
              </div>
            </div>

            {/* Simulated Live Bus 2 Marker */}
            <div
              className="absolute z-10 transition-all duration-1000 ease-linear pointer-events-none"
              style={{
                left: `${60 - Math.cos(simulatedBusOffset * 0.08) * 25}%`,
                top: `${60 + Math.sin(simulatedBusOffset * 0.08) * 20}%`,
              }}
            >
              <div className="bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-full text-[10px] shadow-lg flex items-center gap-1 border border-white">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                <span>🚌 {localBuses[1]?.routeNumber || 'Bus 2'} · 6m ETA</span>
              </div>
            </div>

            {/* Map UI Floating Cards */}
            <div className="relative z-20 flex justify-between items-start">
              <div className="bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-lg p-2.5 text-xs text-white max-w-xs shadow-lg">
                <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase">Your GPS Location</span>
                <p className="font-semibold text-white mt-0.5">Campus Residential Zone</p>
                <p className="text-[11px] text-stone-400">0.3 mi to nearest stop · 4 min walk</p>
              </div>

              {/* Transit Legend */}
              <div className="bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-lg p-2 text-[10px] text-stone-300 space-y-1 shadow-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>You (GPS Verified)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Active Campus Bus</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span>Covered Bus Shelter</span>
                </div>
              </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="relative z-20 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-lg p-2.5 text-xs text-stone-200 flex flex-wrap items-center justify-between gap-2 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold">NEXT BUS:</span>
                <span className="font-semibold text-white">{localBuses[0]?.routeName || 'Campus Express'}</span>
                <span className="text-stone-400">→ {localBuses[0]?.destination}</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                Arriving in {localBuses[0]?.etaMinutes || 2} min
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Local Bus in the Area & Campus Bus App Detection */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Official / Local Campus Bus App Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                  Local Campus Bus App
                </span>
                <h4 className="text-sm font-bold text-stone-900 mt-1.5">{busApp.name}</h4>
                <p className="text-xs text-stone-600 mt-0.5">
                  {busApp.appType} · Official transit provider for {currentCampus.name}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                🚌
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-stone-600">
                Device Sync: <strong className="text-stone-900">{deviceType === 'ios' ? 'iOS (Apple Maps)' : 'Android (Google Maps)'}</strong>
              </span>
              <a
                href={deviceType === 'ios' ? busApp.iosUrl : busApp.androidUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-amber-900 hover:text-amber-950 hover:underline cursor-pointer"
              >
                <span>Open {deviceType === 'ios' ? 'App Store' : 'Play Store'}</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Local Buses in the Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-stone-900">Local Buses in the Area</h3>
              <span className="text-xs text-stone-500 font-mono">{localBuses.length} Active Lines</span>
            </div>

            <div className="space-y-2.5">
              {localBuses.map((bus) => (
                <div
                  key={bus.routeNumber}
                  onClick={() => setSelectedRoute(bus.routeNumber)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedRoute === bus.routeNumber
                      ? 'border-stone-900 bg-stone-50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-stone-900 text-white font-mono font-bold text-xs">
                        {bus.routeNumber}
                      </span>
                      <div>
                        <h5 className="text-xs font-bold text-stone-900">{bus.routeName}</h5>
                        <p className="text-[11px] text-stone-500">to {bus.destination}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-emerald-700">
                        {bus.etaMinutes} min
                      </div>
                      <span
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          bus.crowdLevel === 'Low'
                            ? 'bg-emerald-50 text-emerald-700'
                            : bus.crowdLevel === 'Medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {bus.crowdLevel} Crowding
                      </span>
                    </div>
                  </div>

                  {selectedRoute === bus.routeNumber && (
                    <div className="mt-3 pt-3 border-t border-stone-200 text-xs flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setAlertSubscribed(true);
                          setTimeout(() => setAlertSubscribed(false), 3000);
                        }}
                        className="text-stone-700 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <span>🔔</span>
                        <span>{alertSubscribed ? 'Alert Set! Ringing in 1 min' : 'Notify 1 min before arrival'}</span>
                      </button>

                      <span className="text-[11px] text-stone-400 font-mono">
                        GPS ID: #BUS-{bus.routeNumber}-88
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Transit Help Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-600">
            <span className="font-semibold text-stone-800">💡 Student Transit Pass:</span> All registered students with a verified .edu email ride {currentCampus.name} campus shuttles for free with student ID or phone wallet pass.
          </div>
        </div>
      </div>

      {/* Wallet Pass Modal Simulation */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-stone-200 shadow-2xl relative">
            <button
              onClick={() => setIsWalletModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 cursor-pointer"
            >
              ✕
            </button>

            {/* Apple / Google Wallet Simulated Card */}
            <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-xl p-5 shadow-xl border border-stone-700">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-stone-700">
                <span className="font-display font-bold text-amber-400">StudentSquare Pass</span>
                <span className="font-mono text-[10px] text-stone-300">
                  {deviceType === 'ios' ? ' Apple Wallet' : 'G Google Wallet'}
                </span>
              </div>

              <div className="py-4">
                <p className="text-[10px] uppercase tracking-wider text-stone-400 font-mono">Campus Transit Privilege</p>
                <h3 className="text-lg font-bold text-white mt-0.5">{currentCampus.name}</h3>
                <p className="text-xs text-stone-300 mt-1">Unlimited Campus Bus & Shuttle Pass</p>
              </div>

              <div className="pt-3 border-t border-stone-700 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[10px] text-stone-400 block">STATUS</span>
                  <span className="text-emerald-400 font-semibold">VERIFIED .EDU</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">EXPIRES</span>
                  <span className="text-stone-300">AUG 2027</span>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center space-y-3">
              <p className="text-xs text-stone-600">
                Transit pass synced to your {deviceType === 'ios' ? 'iPhone' : 'Android'} device. Tap against shuttle readers when boarding.
              </p>
              <button
                onClick={() => setIsWalletModalOpen(false)}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
