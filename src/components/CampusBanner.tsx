import React from 'react';
import { Campus, CampusId, CurrentUser } from '../types';
import { CAMPUSES } from '../data/mockData';

interface CampusBannerProps {
  currentCampus: Campus;
  onSelectCampus: (campusId: CampusId) => void;
  currentUser: CurrentUser;
  onOpenVerification: () => void;
}

export const CampusBanner: React.FC<CampusBannerProps> = ({
  currentCampus,
  onSelectCampus,
  currentUser,
  onOpenVerification,
}) => {
  return (
    <div className="bg-stone-900 text-stone-200 py-3 px-4 sm:px-6 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Active Campus Switcher */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-stone-400 font-mono uppercase tracking-wider text-[11px]">Active Campus</span>
          <span className="text-stone-600">·</span>
          
          <div className="relative inline-block">
            <select
              value={currentCampus.id}
              onChange={(e) => onSelectCampus(e.target.value as CampusId)}
              className="bg-stone-800 border border-stone-700 text-white font-medium text-xs rounded px-2.5 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 appearance-none"
            >
              {CAMPUSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city}, {c.state})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-stone-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <span className="text-stone-600 hidden md:inline">·</span>
          <span className="text-stone-400 hidden md:inline">
            Official @{currentCampus.emailDomain} network
          </span>
        </div>

        {/* Right: Anti-Scam Security Protocol badge and verify modal trigger */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-stone-300">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="truncate">Scam-Free Guarantee: Verified Students Only</span>
          </div>

          {!currentUser.isVerified ? (
            <button
              onClick={onOpenVerification}
              className="text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
            >
              Verify Now
            </button>
          ) : (
            <button
              onClick={onOpenVerification}
              className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] cursor-pointer"
            >
              ID #{currentUser.studentIdLast4} · Active
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
