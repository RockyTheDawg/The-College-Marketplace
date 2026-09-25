import React from 'react';
import { CurrentUser, Campus } from '../types';

export type NavTab = 'sublets' | 'marketplace' | 'roommates' | 'contracts' | 'messages';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: CurrentUser;
  currentCampus: Campus;
  onOpenVerification: () => void;
  onOpenPostListing: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentCampus,
  onOpenVerification,
  onOpenPostListing,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark in display face */}
        <button
          onClick={() => setActiveTab('sublets')}
          className="text-xl font-bold tracking-tight text-stone-900 font-display hover:text-amber-800 transition-colors cursor-pointer text-left"
        >
          QuadHaven
        </button>

        {/* Zone 2: Clean text navigation links with subtle underline/active state */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('sublets')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
              activeTab === 'sublets'
                ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Sublets
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
              activeTab === 'marketplace'
                ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('roommates')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
              activeTab === 'roommates'
                ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Roommates
          </button>
          <button
            onClick={() => setActiveTab('contracts')}
            className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
              activeTab === 'contracts'
                ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Contracts
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`relative transition-colors whitespace-nowrap cursor-pointer pb-1 ${
              activeTab === 'messages'
                ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Messages
            {unreadCount > 0 && (
              <span className="ml-1.5 text-xs text-amber-700 font-mono font-bold">
                ({unreadCount})
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* User verification button / status */}
          <button
            onClick={onOpenVerification}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
              currentUser.isVerified
                ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70'
                : 'border-amber-300 bg-amber-50/70 text-amber-800 hover:bg-amber-100/70'
            }`}
            title="Click to manage student verification"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                currentUser.isVerified ? 'bg-emerald-600' : 'bg-amber-600'
              }`}
            />
            <span>{currentUser.isVerified ? `${currentCampus.shortName} Verified` : 'Verify .edu'}</span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenPostListing}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs"
          >
            Post Listing
          </button>
        </div>
      </div>

      {/* Mobile nav bar below header for small screens */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-stone-200 bg-stone-50 text-xs font-medium">
        <button
          onClick={() => setActiveTab('sublets')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'sublets' ? 'text-stone-900 font-bold bg-white' : 'text-stone-600'
          }`}
        >
          Sublets
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'marketplace' ? 'text-stone-900 font-bold bg-white' : 'text-stone-600'
          }`}
        >
          Marketplace
        </button>
        <button
          onClick={() => setActiveTab('roommates')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'roommates' ? 'text-stone-900 font-bold bg-white' : 'text-stone-600'
          }`}
        >
          Roommates
        </button>
        <button
          onClick={() => setActiveTab('contracts')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'contracts' ? 'text-stone-900 font-bold bg-white' : 'text-stone-600'
          }`}
        >
          Contracts
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-2 py-1 rounded cursor-pointer whitespace-nowrap ${
            activeTab === 'messages' ? 'text-stone-900 font-bold bg-white' : 'text-stone-600'
          }`}
        >
          Messages {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>
    </header>
  );
};
