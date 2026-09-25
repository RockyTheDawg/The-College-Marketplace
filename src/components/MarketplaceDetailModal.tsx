import React from 'react';
import { MarketplaceItem, CurrentUser, Campus } from '../types';
import { ListingImage } from './ListingImage';

interface MarketplaceDetailModalProps {
  item: MarketplaceItem | null;
  onClose: () => void;
  currentUser: CurrentUser;
  currentCampus: Campus;
  onMessageSeller: (item: MarketplaceItem) => void;
}

export const MarketplaceDetailModal: React.FC<MarketplaceDetailModalProps> = ({
  item,
  onClose,
  currentUser,
  currentCampus,
  onMessageSeller,
}) => {
  if (!item) return null;

  const discountPct =
    item.originalPrice && item.originalPrice > item.price
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-lg w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-3.5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>{item.category}</span>
            <span aria-hidden="true">·</span>
            <span>{item.condition}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Verified Campus Hand-off</span>
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
        <div className="overflow-y-auto p-6 space-y-5">
          <ListingImage
            category={item.visualCategory}
            title={item.title}
            badgeText={item.condition}
            className="w-full h-48"
          />

          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>{item.category}</span>
              {item.courseCode && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-amber-800 font-semibold">{item.courseCode}</span>
                </>
              )}
            </div>
            <h1 className="text-xl font-bold text-stone-900 font-display">
              {item.title}
            </h1>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
                ${item.price}
              </span>
              {item.originalPrice && (
                <span className="text-sm text-stone-400 line-through font-mono">
                  ${item.originalPrice}
                </span>
              )}
              {discountPct && (
                <span className="text-xs font-semibold text-emerald-700 font-mono">
                  ({discountPct}% below store price)
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Item Details & Condition
            </h2>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-1 text-xs">
            <span className="text-stone-500 font-medium">Safe Student Meetup Point:</span>
            <div className="flex items-center gap-1.5 text-stone-800 font-medium">
              <svg className="w-4 h-4 text-stone-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span>{item.pickupLocation}</span>
            </div>
          </div>

          {/* Seller profile */}
          <div className="border border-stone-200 rounded-lg p-3.5 bg-stone-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${item.seller.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                {item.seller.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-900">{item.seller.name}</span>
                  <span className="text-[10px] text-emerald-700 font-medium">
                    Verified @{currentCampus.emailDomain}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  {item.seller.major} · {item.seller.year}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs text-stone-500 font-mono">No transaction fees</span>
          <button
            onClick={() => {
              onClose();
              onMessageSeller(item);
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer transition-colors shadow-xs"
          >
            Message Seller & Purchase
          </button>
        </div>
      </div>
    </div>
  );
};
