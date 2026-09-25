import React, { useState, useMemo } from 'react';
import { RoommateProfile, Campus, CurrentUser } from '../types';

interface RoommateMatcherProps {
  roommates: RoommateProfile[];
  currentCampus: Campus;
  currentUser: CurrentUser;
  onConnectRoommate: (roommate: RoommateProfile) => void;
}

export const RoommateMatcher: React.FC<RoommateMatcherProps> = ({
  roommates,
  currentCampus,
  currentUser,
  onConnectRoommate,
}) => {
  // User's own lifestyle preferences for compatibility calculation
  const [mySleep, setMySleep] = useState<string>('Moderate (11 PM - 1 AM)');
  const [myCleanliness, setMyCleanliness] = useState<string>('Spotless / Daily Cleaning');
  const [myStudy, setMyStudy] = useState<string>('Silent Focus at Home');
  const [mySocial, setMySocial] = useState<string>('Occasional Weekend Dinners');
  const [termFilter, setTermFilter] = useState<string>('all');

  const campusRoommates = useMemo(() => {
    return roommates.filter((r) => r.campusId === currentCampus.id);
  }, [roommates, currentCampus.id]);

  // Calculate dynamic compatibility score based on lifestyle alignment
  const scoredRoommates = useMemo(() => {
    return campusRoommates
      .filter((r) => {
        if (termFilter !== 'all' && r.preferredTerm !== termFilter) return false;
        return true;
      })
      .map((r) => {
        let score = 65; // Base compatibility
        const reasons: string[] = [];

        if (r.lifestyle.sleepSchedule === mySleep) {
          score += 12;
          reasons.push('Aligned sleep routines');
        } else if (
          (mySleep.includes('Moderate') && !r.lifestyle.sleepSchedule.includes('Early')) ||
          (r.lifestyle.sleepSchedule.includes('Moderate'))
        ) {
          score += 6;
          reasons.push('Compatible sleep hours');
        }

        if (r.lifestyle.cleanliness === myCleanliness) {
          score += 15;
          reasons.push('Identical chore & kitchen cleanliness standards');
        } else if (r.lifestyle.cleanliness.includes('Tidy') || myCleanliness.includes('Tidy')) {
          score += 7;
          reasons.push('Manageable cleaning expectations');
        }

        if (r.lifestyle.studyHabit === myStudy) {
          score += 10;
          reasons.push('Matching study focus environments');
        }

        if (r.lifestyle.socialLevel === mySocial) {
          score += 10;
          reasons.push('Equal home hosting preferences');
        }

        const cappedScore = Math.min(99, score);
        return {
          ...r,
          matchScore: cappedScore,
          matchReasons: reasons,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [campusRoommates, termFilter, mySleep, myCleanliness, myStudy, mySocial]);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <span>{currentCampus.name}</span>
          <span aria-hidden="true">·</span>
          <span>Verified Student Housing Pool</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display text-balance">
          QuadMatch: Student Roommate Finder
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl">
          Match with verified {currentCampus.shortName} students looking to co-sign an apartment, fill an open room, or find a summer sublet partner. Verified habits, zero awkward roommate surprises.
        </p>
      </div>

      {/* Interactive Lifestyle Preferences Bar */}
      <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono flex items-center gap-2">
            <span>Your Living Habits for Match Calibration</span>
            <span className="text-[10px] text-emerald-700 font-normal">Active algorithm</span>
          </h2>
          <span className="text-xs text-stone-500">Adjust any factor to recalculate matches</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-stone-500 mb-1 font-medium">Sleep Habits</label>
            <select
              value={mySleep}
              onChange={(e) => setMySleep(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50"
            >
              <option value="Early Bird (before 11 PM)">Early Bird (before 11 PM)</option>
              <option value="Moderate (11 PM - 1 AM)">Moderate (11 PM - 1 AM)</option>
              <option value="Night Owl (after 1 AM)">Night Owl (after 1 AM)</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-500 mb-1 font-medium">Cleanliness Style</label>
            <select
              value={myCleanliness}
              onChange={(e) => setMyCleanliness(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50"
            >
              <option value="Spotless / Daily Cleaning">Spotless / Daily Cleaning</option>
              <option value="Tidy / Weekly Chores">Tidy / Weekly Chores</option>
              <option value="Casual / Relaxed">Casual / Relaxed</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-500 mb-1 font-medium">Study Preference</label>
            <select
              value={myStudy}
              onChange={(e) => setMyStudy(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50"
            >
              <option value="Silent Focus at Home">Silent Focus at Home</option>
              <option value="Study on Campus / Library">Study on Campus / Library</option>
              <option value="Music & Social Study">Music & Social Study</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-500 mb-1 font-medium">Social / Guests</label>
            <select
              value={mySocial}
              onChange={(e) => setMySocial(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-stone-50"
            >
              <option value="Quiet Sanctuary">Quiet Sanctuary</option>
              <option value="Occasional Weekend Dinners">Occasional Weekend Dinners</option>
              <option value="Frequent Gatherings">Frequent Gatherings</option>
            </select>
          </div>
        </div>

        {/* Term filter buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-500">Filter by Term:</span>
          {['all', 'Summer 2026', 'Fall 2026', 'Full Year 2026-2027'].map((term) => (
            <button
              key={term}
              onClick={() => setTermFilter(term)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                termFilter === term
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900'
              }`}
            >
              {term === 'all' ? 'All Terms' : term}
            </button>
          ))}
        </div>
      </div>

      {/* Roommate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scoredRoommates.map((roommate) => {
          return (
            <div
              key={roommate.id}
              className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 hover:border-stone-300 transition-all flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                {/* Header with Avatar and Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full ${roommate.avatarColor} text-white font-bold text-base flex items-center justify-center shrink-0`}>
                      {roommate.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-stone-900">{roommate.name}</h2>
                        <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Verified</span>
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        {roommate.major}
                      </p>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {roommate.year} · Looking for {roommate.preferredTerm}
                      </p>
                    </div>
                  </div>

                  {/* Compatibility Meter */}
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold font-mono tabular-nums text-stone-900">
                      {roommate.matchScore}%
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">Compatibility</span>
                  </div>
                </div>

                {/* Compatibility Reasons */}
                {roommate.matchReasons.length > 0 && (
                  <div className="bg-stone-50 rounded p-2.5 space-y-1 text-xs text-stone-700 border border-stone-100">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">Why You Align</span>
                    {roommate.matchReasons.map((reason, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bio */}
                <p className="text-xs text-stone-700 leading-relaxed">
                  "{roommate.bio}"
                </p>

                {/* Lifestyle Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="bg-stone-50 p-2 rounded border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Schedule</span>
                    <span className="font-medium text-stone-800">{roommate.lifestyle.sleepSchedule}</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Cleanliness</span>
                    <span className="font-medium text-stone-800">{roommate.lifestyle.cleanliness}</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Study Space</span>
                    <span className="font-medium text-stone-800">{roommate.lifestyle.studyHabit}</span>
                  </div>
                  <div className="bg-stone-50 p-2 rounded border border-stone-100">
                    <span className="text-stone-400 text-[10px] block">Budget Target</span>
                    <span className="font-medium font-mono text-stone-800">
                      ${roommate.budgetMin} – ${roommate.budgetMax}/mo
                    </span>
                  </div>
                </div>

                {/* Preferred Neighborhoods */}
                <div className="text-xs text-stone-500 flex items-center gap-1.5">
                  <span className="font-medium text-stone-700">Neighborhoods:</span>
                  <span>{roommate.targetNeighborhoods.join(' · ')}</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-mono">@{currentCampus.emailDomain}</span>
                <button
                  onClick={() => onConnectRoommate(roommate)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer shadow-xs"
                >
                  Start Conversation
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
