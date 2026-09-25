import React, { useState, useMemo } from 'react';
import { Campus, CampusId, CurrentUser } from '../types';
import { ALL_CAMPUSES } from '../data/mockData';

interface CampusBannerProps {
  currentCampus: Campus;
  onSelectCampus: (campusId: CampusId) => void;
  currentUser: CurrentUser;
  onOpenVerification: () => void;
  onOpenEscrowModal: () => void;
  onOpenTransit?: () => void;
  locationVerified?: boolean;
}

const POPULAR_NICKNAMES = [
  { label: 'GCU', id: 'gcu' },
  { label: 'TAMU', id: 'tamu' },
  { label: 'ASU', id: 'asu' },
  { label: 'Cal / UCB', id: 'berkeley' },
  { label: 'UCLA', id: 'ucla' },
  { label: 'UMich', id: 'umich' },
  { label: 'UT Austin', id: 'utaustin' },
  { label: 'UF', id: 'uf' },
  { label: 'OSU', id: 'osu' },
  { label: 'NYU', id: 'nyu' },
];

export const CampusBanner: React.FC<CampusBannerProps> = ({
  currentCampus,
  onSelectCampus,
  currentUser,
  onOpenVerification,
  onOpenEscrowModal,
  onOpenTransit,
  locationVerified = true,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'public' | 'private'>('all');
  const [selectedState, setSelectedState] = useState<string>('all');

  // Distinct states list
  const states = useMemo(() => {
    const s = new Set<string>();
    ALL_CAMPUSES.forEach((c) => s.add(c.state));
    return Array.from(s).sort();
  }, []);

  const filteredCampuses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const result = ALL_CAMPUSES.filter((c) => {
      if (filterType === 'private' && !c.isPrivate) return false;
      if (filterType === 'public' && c.isPrivate) return false;
      if (selectedState !== 'all' && c.state !== selectedState) return false;

      if (q) {
        const matchName = c.name.toLowerCase().includes(q);
        const matchShort = c.shortName.toLowerCase().includes(q);
        const matchCity = c.city.toLowerCase().includes(q);
        const matchState = c.state.toLowerCase().includes(q);
        const matchDomain = c.emailDomain.toLowerCase().includes(q);
        const matchMascot = c.mascot?.toLowerCase().includes(q);
        const matchNicknames = c.nicknames?.some((nick) =>
          nick.toLowerCase().includes(q)
        );

        if (!matchName && !matchShort && !matchCity && !matchState && !matchDomain && !matchMascot && !matchNicknames) {
          return false;
        }
      }
      return true;
    });

    // Sort A-Z by university name
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, filterType, selectedState]);

  return (
    <div className="bg-stone-900 text-stone-200 py-2 px-4 sm:px-6 border-b border-stone-800 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Left: Active Campus Switcher with Nickname Search & All 50 States */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="text-stone-400 font-mono uppercase tracking-wider text-[11px]">Campus Network</span>
          <span className="text-stone-600">·</span>

          {/* Custom Campus Selector Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-stone-800 hover:bg-stone-750 border border-stone-700 text-white font-medium text-xs rounded px-3 py-1.5 flex items-center gap-2 cursor-pointer transition-colors shadow-2xs"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold">{currentCampus.name}</span>
              {currentCampus.nicknames && currentCampus.nicknames.length > 0 && (
                <span className="font-mono text-amber-300 text-[10px] bg-amber-950/70 px-1 rounded border border-amber-800/80">
                  {currentCampus.nicknames[0]}
                </span>
              )}
              <span className="text-stone-400 text-[11px]">
                ({currentCampus.state} · {currentCampus.isPrivate ? 'Private' : 'Public'})
              </span>
              <svg
                className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Nationwide 50 States & Private Universities Dropdown Panel */}
            {isDropdownOpen && (
              <div className="absolute left-0 mt-2 w-84 sm:w-105 bg-white rounded-xl shadow-2xl border border-stone-200 p-3 text-stone-900 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900 font-display">
                    Select University (Search by Nickname or Name)
                  </span>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="text-stone-400 hover:text-stone-700 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Popular Nickname Quick-Filter Chips */}
                <div className="py-2 border-b border-stone-100">
                  <div className="text-[10px] font-mono uppercase text-stone-500 mb-1">
                    Quick Nickname Jump:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {POPULAR_NICKNAMES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onSelectCampus(item.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          currentCampus.id === item.id
                            ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search & State Filter */}
                <div className="py-2 space-y-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by nickname (e.g. GCU, ASU, TAMU) or university name..."
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 font-sans"
                    autoFocus
                  />

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="border border-stone-300 rounded px-1.5 py-1 text-stone-700 bg-stone-50"
                    >
                      <option value="all">All States ({states.length})</option>
                      {states.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        filterType === 'all' ? 'bg-stone-900 text-white font-medium' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType('public')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        filterType === 'public' ? 'bg-stone-900 text-white font-medium' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      Public
                    </button>
                    <button
                      onClick={() => setFilterType('private')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        filterType === 'private' ? 'bg-stone-900 text-white font-medium' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>

                {/* Filtered Campus List */}
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 text-xs">
                  {filteredCampuses.length === 0 ? (
                    <div className="p-4 text-center text-stone-500">
                      No campuses match "{searchTerm}". Try searching by state or full name.
                    </div>
                  ) : (
                    filteredCampuses.map((c) => {
                      const isSelected = c.id === currentCampus.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCampus(c.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected ? 'bg-amber-50 text-amber-950 font-semibold' : 'hover:bg-stone-100'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-stone-900 font-medium">{c.name}</span>
                              {c.nicknames && c.nicknames.length > 0 && (
                                <span className="font-mono text-[10px] text-amber-800 bg-amber-100 px-1 py-0.2 rounded">
                                  AKA: {c.nicknames.slice(0, 2).join(', ')}
                                </span>
                              )}
                              {c.isPrivate && (
                                <span className="text-[10px] text-purple-700 bg-purple-50 px-1 rounded border border-purple-200">
                                  Private
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-stone-500">
                              {c.city}, {c.state} · @{c.emailDomain}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-stone-400">
                            {c.subletCount} sublets
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Bus Transit Shortcut */}
          {onOpenTransit && (
            <button
              onClick={onOpenTransit}
              className="bg-stone-800/90 hover:bg-stone-750 text-emerald-300 border border-emerald-900/60 rounded px-2.5 py-1 text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5"
              title="Open Campus Bus & Shuttle Map"
            >
              <span>🚌</span>
              <span>Bus Map & Sync</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          )}

          {/* Location Verification Tag */}
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-stone-400 font-mono">
            <span>📍</span>
            <span>{locationVerified ? `GPS Area Verified: ${currentCampus.city}` : 'Location Access Required'}</span>
          </div>
        </div>

        {/* Right: Security & Escrow Guarantee */}
        <div className="flex items-center flex-wrap gap-3 text-xs">
          <button
            onClick={onOpenEscrowModal}
            className="flex items-center gap-1.5 text-stone-300 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Deposit Escrow: FDIC-Protected</span>
          </button>

          <span className="text-stone-700 hidden sm:inline">|</span>

          {!currentUser.isVerified ? (
            <button
              onClick={onOpenVerification}
              className="text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Verify .edu</span>
            </button>
          ) : (
            <button
              onClick={onOpenVerification}
              className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] cursor-pointer flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ID #{currentUser.studentIdLast4} · Verified</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
