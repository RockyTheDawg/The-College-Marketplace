import React, { useState } from 'react';
import { CurrentUser, Campus } from '../types';

export type NavTab = 'sublets' | 'marketplace' | 'roommates' | 'contracts' | 'guarantor' | 'messages' | 'transit';

interface HeaderProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currentUser: CurrentUser;
  currentCampus: Campus;
  onOpenVerification: () => void;
  onOpenPostListing: () => void;
  onOpenEscrowModal: () => void;
  onDisconnectEdu?: () => void;
  unreadCount: number;
  locationVerified?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  currentCampus,
  onOpenVerification,
  onOpenPostListing,
  onOpenEscrowModal,
  onDisconnectEdu,
  unreadCount,
  locationVerified = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Wordmark & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            {/* Mobile & Tablet 3-Lines Hamburger Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors cursor-pointer p-1.5 focus:outline-none"
              aria-label="Open Navigation Menu"
              title="Open Navigation Menu"
            >
              <span
                className={`w-5 h-0.5 bg-stone-800 rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-stone-800 rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? 'opacity-0' : 'mb-1'
                }`}
              />
              <span
                className={`w-5 h-0.5 bg-stone-800 rounded-full transition-all duration-200 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </button>

            {/* Brand Logo Wordmark */}
            <button
              onClick={() => handleTabClick('sublets')}
              className="text-xl font-bold tracking-tight text-stone-900 font-display hover:text-amber-800 transition-colors cursor-pointer text-left whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>StudentSquare</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-normal">
                {currentCampus.shortName}
              </span>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => handleTabClick('sublets')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === 'sublets'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sublets & Housing
            </button>
            <button
              onClick={() => handleTabClick('marketplace')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === 'marketplace'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Marketplace
            </button>
            <button
              onClick={() => handleTabClick('roommates')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === 'roommates'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Roommates
            </button>
            <button
              onClick={() => handleTabClick('contracts')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === 'contracts'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Contracts & Escrow
            </button>
            <button
              onClick={() => handleTabClick('transit')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 flex items-center gap-1.5 ${
                activeTab === 'transit'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Bus & Transit</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            <button
              onClick={() => handleTabClick('guarantor')}
              className={`transition-colors whitespace-nowrap cursor-pointer pb-1 flex items-center gap-1.5 ${
                activeTab === 'guarantor'
                  ? 'text-stone-900 font-semibold border-b-2 border-stone-900'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>Co-Signer Portal</span>
            </button>
            <button
              onClick={() => handleTabClick('messages')}
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

          {/* Zone 3: Actions & Verification */}
          <div className="flex items-center gap-2">
            {/* Escrow Vault Button */}
            <button
              onClick={onOpenEscrowModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              title="Deposit Escrow & Move-in Protection Status"
            >
              <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-mono text-[11px]">Escrow Vault</span>
            </button>

            {/* User verification button / status */}
            <button
              onClick={onOpenVerification}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
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
              <span className="hidden sm:inline">
                {currentUser.isVerified ? `${currentCampus.shortName} Verified` : 'Verify .edu'}
              </span>
              <span className="sm:hidden">
                {currentUser.isVerified ? 'Verified' : 'Verify'}
              </span>
            </button>

            {/* Post Listing CTA */}
            <button
              onClick={onOpenPostListing}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              Post Listing
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet 3-Lines Slide-Out Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Menu Container */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto z-10 p-5">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold font-display text-stone-900">StudentSquare</h3>
                  <p className="text-xs text-stone-500">{currentCampus.name}</p>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Status Chips */}
              <div className="py-3 space-y-2 border-b border-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Status</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      currentUser.isVerified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentUser.isVerified ? '✓ .edu Verified' : '⚠️ Unverified'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Location</span>
                  <span
                    className={`text-[11px] font-medium flex items-center gap-1 ${
                      locationVerified ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    <span>📍</span>
                    <span>{locationVerified ? 'Campus Radius Active' : 'Location Needed'}</span>
                  </span>
                </div>
              </div>

              {/* Navigation Tabs List */}
              <nav className="py-4 space-y-1">
                <button
                  onClick={() => handleTabClick('sublets')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'sublets' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>🏠</span>
                    <span>Sublets & Housing</span>
                  </span>
                  <span className="text-[10px] opacity-70">Directory</span>
                </button>

                <button
                  onClick={() => handleTabClick('marketplace')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'marketplace' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>🛒</span>
                    <span>Marketplace</span>
                  </span>
                  <span className="text-[10px] opacity-70">Books & Gear</span>
                </button>

                <button
                  onClick={() => handleTabClick('roommates')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'roommates' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>👥</span>
                    <span>Roommate Matcher</span>
                  </span>
                  <span className="text-[10px] opacity-70">Habits</span>
                </button>

                <button
                  onClick={() => handleTabClick('transit')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'transit' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>🚌</span>
                    <span>Campus Bus & Transit</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>

                <button
                  onClick={() => handleTabClick('contracts')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'contracts' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>📄</span>
                    <span>Lease Contracts</span>
                  </span>
                  <span className="text-[10px] opacity-70">Templates</span>
                </button>

                <button
                  onClick={() => handleTabClick('guarantor')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'guarantor' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>🛡️</span>
                    <span>Parent Co-Signer</span>
                  </span>
                  <span className="text-[10px] opacity-70">Guarantor</span>
                </button>

                <button
                  onClick={() => handleTabClick('messages')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    activeTab === 'messages' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span>💬</span>
                    <span>Messages</span>
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-mono font-bold text-[10px]">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </nav>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenPostListing();
                  }}
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs text-center"
                >
                  + Post New Listing
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenEscrowModal();
                  }}
                  className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium cursor-pointer text-center"
                >
                  Escrow & Insurance Vault
                </button>
              </div>
            </div>

            {/* Drawer Footer & Disconnect EDU action */}
            <div className="pt-4 border-t border-stone-200 space-y-2">
              <div className="text-[11px] text-stone-500 font-mono truncate">
                {currentUser.email}
              </div>

              {onDisconnectEdu && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onDisconnectEdu();
                  }}
                  className="w-full py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>⚠️</span>
                  <span>Disconnect .edu Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
