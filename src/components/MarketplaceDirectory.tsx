import React, { useState, useMemo } from 'react';
import { MarketplaceItem, Campus, CurrentUser, ItemCategory } from '../types';
import { ListingImage } from './ListingImage';

interface MarketplaceDirectoryProps {
  items: MarketplaceItem[];
  currentCampus: Campus;
  currentUser: CurrentUser;
  onSelectItem: (item: MarketplaceItem) => void;
  onMessageSeller: (item: MarketplaceItem) => void;
  onOpenCreateItem: () => void;
  onToggleSave: (id: string) => void;
}

export const MarketplaceDirectory: React.FC<MarketplaceDirectoryProps> = ({
  items,
  currentCampus,
  currentUser,
  onSelectItem,
  onMessageSeller,
  onOpenCreateItem,
  onToggleSave,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const campusItems = useMemo(() => {
    return items.filter((item) => item.campusId === currentCampus.id);
  }, [items, currentCampus.id]);

  const filteredItems = useMemo(() => {
    return campusItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCourse = item.courseCode ? item.courseCode.toLowerCase().includes(q) : false;
        const matchLocation = item.pickupLocation.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCourse && !matchLocation) return false;
      }
      return true;
    });
  }, [campusItems, selectedCategory, selectedCondition, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Editorial Headline */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>{currentCampus.name} Campus Exchange</span>
            <span aria-hidden="true">·</span>
            <span>Local Hand-offs Only</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{campusItems.length} active listings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display text-balance">
            Student Passing-Downs & Marketplace
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Desks, course textbooks, electronics, and bikes passed down directly between verified {currentCampus.shortName} students. No shipping fees, no strangers, meet safely at campus dorms or libraries.
          </p>
        </div>

        <button
          onClick={onOpenCreateItem}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer shrink-0 shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>List Item for Sale</span>
        </button>
      </div>

      {/* Categories & Filter Bar */}
      <div className="bg-white rounded-lg border border-stone-200 p-4 space-y-3 shadow-xs">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbooks by course code (e.g. CS 61A), standing desks, monitors, bikes..."
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

        {/* Category buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'Furniture', label: 'Furniture & Desks' },
            { id: 'Textbooks & Notes', label: 'Textbooks & Notes' },
            { id: 'Electronics & Tech', label: 'Electronics & Tech' },
            { id: 'Bikes & Scooters', label: 'Bikes & Scooters' },
            { id: 'Kitchen & Home', label: 'Kitchen & Appliances' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg border border-dashed border-stone-300 p-10 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-stone-900">No Items Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Be the first to list an item or change your search keywords.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedCondition('all');
              setSearchQuery('');
            }}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded cursor-pointer"
          >
            Show All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isSaved = currentUser.savedItemIds.includes(item.id);
            const discountPct =
              item.originalPrice && item.originalPrice > item.price
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : null;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-stone-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  {/* Card Visual */}
                  <div className="relative">
                    <ListingImage
                      category={item.visualCategory}
                      title={item.title}
                      badgeText={item.condition}
                      className="w-full h-44"
                    />
                    <button
                      onClick={() => onToggleSave(item.id)}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-white flex items-center justify-center backdrop-blur-xs cursor-pointer transition-colors z-20"
                      title={isSaved ? 'Remove from saved' : 'Save item'}
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

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-stone-700">{item.condition}</span>
                      {item.courseCode && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-amber-800 font-semibold">{item.courseCode}</span>
                        </>
                      )}
                    </div>

                    <h2
                      onClick={() => onSelectItem(item)}
                      className="text-base font-semibold text-stone-900 line-clamp-1 hover:text-amber-800 cursor-pointer transition-colors"
                    >
                      {item.title}
                    </h2>

                    {/* Price and discount */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                        ${item.price}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-stone-400 line-through font-mono">
                          ${item.originalPrice}
                        </span>
                      )}
                      {discountPct && (
                        <span className="text-xs font-semibold text-emerald-700 font-mono">
                          ({discountPct}% off retail)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Pickup spot */}
                    <div className="text-xs text-stone-500 flex items-center gap-1 pt-1">
                      <svg className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="truncate">{item.pickupLocation}</span>
                    </div>

                    {/* Verified seller */}
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-5 h-5 rounded-full ${item.seller.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
                          {item.seller.name[0]}
                        </div>
                        <span className="text-stone-700 font-medium truncate max-w-[120px]">
                          {item.seller.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-medium">
                        Verified Student
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onSelectItem(item)}
                    className="w-1/2 py-1.5 font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-200/70 rounded transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onMessageSeller(item)}
                    className="w-1/2 py-1.5 font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded transition-colors cursor-pointer text-center shadow-xs"
                  >
                    Make Offer
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
