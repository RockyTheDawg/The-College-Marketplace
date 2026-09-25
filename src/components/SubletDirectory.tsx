import React, { useState, useMemo } from 'react';
import { SubletListing, HousingTerm, Campus, CurrentUser } from '../types';
import { ListingImage } from './ListingImage';

interface SubletDirectoryProps {
  listings: SubletListing[];
  currentCampus: Campus;
  currentUser: CurrentUser;
  onSelectListing: (listing: SubletListing) => void;
  onMessagePoster: (listing: SubletListing) => void;
  onDraftContract: (listing: SubletListing) => void;
  onOpenCreateSublet: () => void;
  onToggleSave: (id: string) => void;
}

export const SubletDirectory: React.FC<SubletDirectoryProps> = ({
  listings,
  currentCampus,
  currentUser,
  onSelectListing,
  onMessagePoster,
  onDraftContract,
  onOpenCreateSublet,
  onToggleSave,
}) => {
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [onlyFurnished, setOnlyFurnished] = useState<boolean>(false);
  const [onlyPetFriendly, setOnlyPetFriendly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const campusListings = useMemo(() => {
    return listings.filter((l) => l.campusId === currentCampus.id);
  }, [listings, currentCampus.id]);

  const filteredListings = useMemo(() => {
    return campusListings.filter((l) => {
      if (selectedTerm !== 'all' && l.term !== selectedTerm) return false;
      if (selectedType !== 'all') {
        if (selectedType === 'studio' && l.roomType !== 'Entire Studio') return false;
        if (selectedType === 'private' && !l.roomType.includes('Private')) return false;
        if (selectedType === 'entire' && !l.roomType.includes('Takeover') && l.roomType !== 'Entire Studio') return false;
      }
      if (l.pricePerMonth > maxPrice) return false;
      if (onlyFurnished && !l.furnished) return false;
      if (onlyPetFriendly && !l.petFriendly) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = l.title.toLowerCase().includes(q);
        const matchNeighborhood = l.neighborhood.toLowerCase().includes(q);
        const matchAddress = l.address.toLowerCase().includes(q);
        const matchPoster = l.poster.name.toLowerCase().includes(q);
        if (!matchTitle && !matchNeighborhood && !matchAddress && !matchPoster) return false;
      }
      return true;
    });
  }, [campusListings, selectedTerm, selectedType, maxPrice, onlyFurnished, onlyPetFriendly, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Editorial Headline & Campus Scope */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>{currentCampus.name}</span>
            <span aria-hidden="true">·</span>
            <span>{currentCampus.city}, {currentCampus.state}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{campusListings.length} verified listings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display text-balance">
            Student Sublets & Lease Takeovers
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Direct lease assignments and summer subleases posted by verified {currentCampus.shortName} students. No broker fees, no Craigslist spammers, and pre-approved landlord permission.
          </p>
        </div>

        <button
          onClick={onOpenCreateSublet}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Post a Sublet</span>
        </button>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-lg border border-stone-200 p-4 space-y-4 shadow-xs">
        {/* Top search & price slider */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by neighborhood, street name, or amenities..."
              className="w-full text-xs pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-stone-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-stone-500 whitespace-nowrap">Max Rent:</span>
            <input
              type="range"
              min="800"
              max="3500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <span className="text-xs font-mono font-semibold text-stone-900 tabular-nums whitespace-nowrap min-w-[65px] text-right">
              ${maxPrice}/mo
            </span>
          </div>

          <div className="md:col-span-3 flex items-center gap-3 justify-end text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
              <input
                type="checkbox"
                checked={onlyFurnished}
                onChange={(e) => setOnlyFurnished(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
              />
              <span>Furnished</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700">
              <input
                type="checkbox"
                checked={onlyPetFriendly}
                onChange={(e) => setOnlyPetFriendly(e.target.checked)}
                className="rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
              />
              <span>Pet Friendly</span>
            </label>
          </div>
        </div>

        {/* Segmented Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-xs text-stone-400 font-medium mr-1">Term:</span>
            {[
              { id: 'all', label: 'All Terms' },
              { id: 'Summer 2026', label: 'Summer 2026' },
              { id: 'Fall 2026', label: 'Fall 2026' },
              { id: 'Full Year 2026-2027', label: 'Full Year Lease' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTerm(t.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedTerm === t.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center flex-wrap gap-1.5">
            <span className="text-xs text-stone-400 font-medium mr-1">Layout:</span>
            {[
              { id: 'all', label: 'All Layouts' },
              { id: 'studio', label: 'Studio' },
              { id: 'private', label: 'Private Room' },
              { id: 'entire', label: 'Full Apt' },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-stone-300 p-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-stone-900">No Sublets Match This Criteria</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your maximum rent slider or clearing active filters to view all available listings for {currentCampus.name}.
          </p>
          <button
            onClick={() => {
              setSelectedTerm('all');
              setSelectedType('all');
              setMaxPrice(3000);
              setOnlyFurnished(false);
              setOnlyPetFriendly(false);
              setSearchQuery('');
            }}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const isSaved = currentUser.savedSubletIds.includes(listing.id);
            return (
              <div
                key={listing.id}
                className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-stone-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Card Image and Save Toggle */}
                  <div className="relative">
                    <ListingImage
                      category={listing.visualCategory}
                      title={listing.title}
                      badgeText={listing.term}
                      className="w-full h-44"
                    />
                    <button
                      onClick={() => onToggleSave(listing.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer transition-colors z-20"
                      title={isSaved ? 'Remove from saved' : 'Save listing'}
                    >
                      <svg
                        className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Unboxed Metadata (Zero-pill rule compliant) */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <span>{listing.neighborhood}</span>
                      <span aria-hidden="true">·</span>
                      <span>{listing.roomType}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">Landlord Approved</span>
                    </div>

                    {/* Listing Title */}
                    <h2
                      onClick={() => onSelectListing(listing)}
                      className="text-base font-semibold text-stone-900 line-clamp-1 hover:text-amber-800 cursor-pointer transition-colors"
                    >
                      {listing.title}
                    </h2>

                    {/* Pricing and Dates */}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                          ${listing.pricePerMonth}
                        </span>
                        <span className="text-xs text-stone-500 font-normal"> / month</span>
                      </div>
                      <div className="text-right text-xs text-stone-500 font-mono">
                        {listing.startDate.slice(5)} to {listing.endDate.slice(5)}
                      </div>
                    </div>

                    {/* Proximity snippet */}
                    <p className="text-xs text-stone-600 line-clamp-1">
                      {listing.distanceToCampus}
                    </p>

                    {/* Verified Student Poster */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-full ${listing.poster.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
                          {listing.poster.name[0]}
                        </div>
                        <span className="text-stone-700 font-medium truncate max-w-[130px]">
                          {listing.poster.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>@{currentCampus.emailDomain}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Strip */}
                <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <button
                    onClick={() => onSelectListing(listing)}
                    className="py-1.5 px-2 font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 rounded transition-colors cursor-pointer"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onMessagePoster(listing)}
                    className="py-1.5 px-2 font-medium text-amber-900 hover:text-amber-950 hover:bg-amber-100/70 rounded transition-colors cursor-pointer"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => onDraftContract(listing)}
                    className="py-1.5 px-2 font-medium text-stone-900 hover:bg-stone-200/70 rounded transition-colors cursor-pointer"
                  >
                    Draft Lease
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
