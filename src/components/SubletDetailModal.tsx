import React from 'react';
import { SubletListing, CurrentUser, Campus } from '../types';
import { ListingImage } from './ListingImage';

interface SubletDetailModalProps {
  listing: SubletListing | null;
  onClose: () => void;
  currentUser: CurrentUser;
  currentCampus: Campus;
  onMessagePoster: (listing: SubletListing) => void;
  onDraftContract: (listing: SubletListing) => void;
}

export const SubletDetailModal: React.FC<SubletDetailModalProps> = ({
  listing,
  onClose,
  currentUser,
  currentCampus,
  onMessagePoster,
  onDraftContract,
}) => {
  if (!listing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-3xl w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>Listing #{listing.id}</span>
            <span aria-hidden="true">·</span>
            <span>{listing.neighborhood}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Verified {currentCampus.shortName} Housing</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Visual Header */}
          <ListingImage
            category={listing.visualCategory}
            title={listing.title}
            badgeText={listing.term}
            className="w-full h-56"
          />

          {/* Title and Key Financials */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
                <span>{listing.roomType}</span>
                <span aria-hidden="true">·</span>
                <span>{listing.totalBedrooms} Bed / {listing.totalBathrooms} Bath Unit</span>
                {listing.buildingName && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-stone-700">{listing.buildingName}</span>
                  </>
                )}
              </div>
              <h1 className="text-xl font-bold text-stone-900 font-display">
                {listing.title}
              </h1>
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <span>{listing.address} ({listing.distanceToCampus})</span>
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-right shrink-0 min-w-[180px]">
              <div className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
                ${listing.pricePerMonth}
                <span className="text-xs text-stone-500 font-normal"> / mo</span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {listing.utilitiesIncluded ? 'Utilities Included in Rent' : '+ Estimated $60-80 utilities'}
              </p>
              <div className="text-xs font-mono text-stone-700 mt-2 pt-2 border-t border-stone-200 flex justify-between">
                <span>Lease Window:</span>
                <span className="font-semibold">{listing.startDate.slice(5)} – {listing.endDate.slice(5)}</span>
              </div>
            </div>
          </div>

          {/* Landlord Permission & Security Assurance */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="text-xs">
              <h2 className="text-xs font-semibold text-emerald-950">Landlord-Approved Sublet</h2>
              <p className="text-emerald-800 mt-0.5">
                The primary leaseholder has confirmed property manager consent for this sublease. QuadHaven will provide the official university-standard sublease agreement to prevent any unauthorized occupant disputes.
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              About This Sublet
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities checklist */}
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Included Amenities & Housing Features
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {listing.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50 p-2 rounded border border-stone-200">
                  <svg className="w-3.5 h-3.5 text-stone-900 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="truncate">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Student Host Profile */}
          <div className="border border-stone-200 rounded-lg p-4 bg-stone-50 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Current Leaseholder / Poster
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${listing.poster.avatarColor} text-white font-bold flex items-center justify-center text-sm`}>
                  {listing.poster.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-900">{listing.poster.name}</span>
                    <span className="text-[11px] text-emerald-700 font-mono bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Verified Student
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    {listing.poster.major} · {listing.poster.year}
                  </p>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                    {listing.poster.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500">
            Protected by Campus Student Honor Code
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onMessagePoster(listing);
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-900 bg-white border border-stone-300 hover:bg-stone-100 rounded-md cursor-pointer transition-colors"
            >
              Message Host
            </button>
            <button
              onClick={() => {
                onClose();
                onDraftContract(listing);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer transition-colors shadow-xs"
            >
              Generate Sublease Agreement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
