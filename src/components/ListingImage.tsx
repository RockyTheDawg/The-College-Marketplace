import React from 'react';

interface ListingImageProps {
  category: 'studio' | 'private_room' | 'loft' | 'duplex' | 'modern_apt' | 'desk' | 'textbook' | 'monitor' | 'bike' | 'microwave' | 'chair';
  title: string;
  className?: string;
  badgeText?: string;
}

export const ListingImage: React.FC<ListingImageProps> = ({
  category,
  title,
  className = 'w-full h-48',
  badgeText,
}) => {
  // Cohesive, collegiate architectural & interior styling
  const renderVisual = () => {
    switch (category) {
      case 'studio':
        return (
          <div className="relative w-full h-full bg-linear-to-br from-stone-800 via-stone-700 to-amber-950 flex flex-col justify-between p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-15">
              <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                <rect x="30" y="40" width="160" height="180" strokeWidth="1.5" />
                <line x1="110" y1="40" x2="110" y2="220" strokeWidth="1" />
                <line x1="30" y1="130" x2="190" y2="130" strokeWidth="1" />
                <rect x="220" y="100" width="150" height="120" strokeWidth="1.5" />
                <circle cx="295" cy="140" r="30" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex justify-between items-start z-10">
              <span className="text-[11px] font-medium tracking-wide text-stone-300 uppercase">Studio Loft · Bay View</span>
              {badgeText && (
                <span className="text-[11px] text-amber-200 font-mono tracking-tight">{badgeText}</span>
              )}
            </div>
            <div className="z-10 text-stone-100">
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
                <span>Furnished Studio</span>
                <span>·</span>
                <span>Self-Contained</span>
              </div>
              <p className="text-sm font-semibold truncate text-white">{title}</p>
            </div>
          </div>
        );

      case 'private_room':
        return (
          <div className="relative w-full h-full bg-linear-to-br from-stone-900 via-stone-800 to-emerald-950 flex flex-col justify-between p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-15">
              <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                <rect x="50" y="50" width="140" height="200" strokeWidth="1.5" />
                <rect x="230" y="80" width="120" height="140" strokeWidth="1.5" />
                <line x1="230" y1="120" x2="350" y2="120" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex justify-between items-start z-10">
              <span className="text-[11px] font-medium tracking-wide text-stone-300 uppercase">Private Room · Southside</span>
              {badgeText && (
                <span className="text-[11px] text-emerald-300 font-mono tracking-tight">{badgeText}</span>
              )}
            </div>
            <div className="z-10 text-stone-100">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium mb-1">
                <span>Private Bedroom</span>
                <span>·</span>
                <span>Ensuite Option</span>
              </div>
              <p className="text-sm font-semibold truncate text-white">{title}</p>
            </div>
          </div>
        );

      case 'loft':
        return (
          <div className="relative w-full h-full bg-linear-to-br from-slate-900 via-stone-800 to-sky-950 flex flex-col justify-between p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                <line x1="20" y1="260" x2="380" y2="260" strokeWidth="2" />
                <rect x="60" y="60" width="280" height="160" strokeWidth="1.5" />
                <line x1="60" y1="110" x2="340" y2="110" strokeWidth="1" strokeDasharray="4 4" />
                <rect x="100" y="140" width="100" height="80" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex justify-between items-start z-10">
              <span className="text-[11px] font-medium tracking-wide text-stone-300 uppercase">Urban Loft · Campus Border</span>
              {badgeText && (
                <span className="text-[11px] text-sky-200 font-mono tracking-tight">{badgeText}</span>
              )}
            </div>
            <div className="z-10 text-stone-100">
              <div className="flex items-center gap-2 text-xs text-sky-300 font-medium mb-1">
                <span>High Ceilings</span>
                <span>·</span>
                <span>Natural Daylight</span>
              </div>
              <p className="text-sm font-semibold truncate text-white">{title}</p>
            </div>
          </div>
        );

      case 'modern_apt':
      case 'duplex':
        return (
          <div className="relative w-full h-full bg-linear-to-br from-stone-900 via-neutral-800 to-amber-900 flex flex-col justify-between p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-15">
              <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                <rect x="40" y="40" width="320" height="220" strokeWidth="1.5" />
                <line x1="200" y1="40" x2="200" y2="260" strokeWidth="1.5" />
                <line x1="40" y1="150" x2="200" y2="150" strokeWidth="1" />
              </svg>
            </div>
            <div className="flex justify-between items-start z-10">
              <span className="text-[11px] font-medium tracking-wide text-stone-300 uppercase">Full Apartment · Lease Takeover</span>
              {badgeText && (
                <span className="text-[11px] text-amber-200 font-mono tracking-tight">{badgeText}</span>
              )}
            </div>
            <div className="z-10 text-stone-100">
              <div className="flex items-center gap-2 text-xs text-amber-200 font-medium mb-1">
                <span>Multi-Room</span>
                <span>·</span>
                <span>Official Lease Assignment</span>
              </div>
              <p className="text-sm font-semibold truncate text-white">{title}</p>
            </div>
          </div>
        );

      // Marketplace visuals
      case 'desk':
        return (
          <div className="relative w-full h-full bg-stone-900 flex flex-col justify-between p-4 border border-stone-800">
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <svg className="w-24 h-24 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M3 14h18M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase z-10">Study Furniture</span>
            <div className="z-10">
              <p className="text-xs text-amber-400 font-medium">Verified Student Pickup</p>
              <p className="text-sm font-semibold text-white truncate">{title}</p>
            </div>
          </div>
        );

      case 'textbook':
        return (
          <div className="relative w-full h-full bg-stone-900 flex flex-col justify-between p-4 border border-stone-800">
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <svg className="w-24 h-24 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase z-10">Course Reader / Text</span>
            <div className="z-10">
              <p className="text-xs text-emerald-400 font-medium">Campus Library Hand-off</p>
              <p className="text-sm font-semibold text-white truncate">{title}</p>
            </div>
          </div>
        );

      case 'monitor':
        return (
          <div className="relative w-full h-full bg-stone-900 flex flex-col justify-between p-4 border border-stone-800">
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <svg className="w-24 h-24 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase z-10">Tech & Displays</span>
            <div className="z-10">
              <p className="text-xs text-blue-400 font-medium">Tested & Working</p>
              <p className="text-sm font-semibold text-white truncate">{title}</p>
            </div>
          </div>
        );

      case 'bike':
        return (
          <div className="relative w-full h-full bg-stone-900 flex flex-col justify-between p-4 border border-stone-800">
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <svg className="w-24 h-24 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="6" cy="16" r="3" strokeWidth="1.5" />
                <circle cx="18" cy="16" r="3" strokeWidth="1.5" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 16l4-8h4l3 8M10 8l2 8" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase z-10">Campus Mobility</span>
            <div className="z-10">
              <p className="text-xs text-teal-400 font-medium">Ready to Ride</p>
              <p className="text-sm font-semibold text-white truncate">{title}</p>
            </div>
          </div>
        );

      case 'chair':
      case 'microwave':
      default:
        return (
          <div className="relative w-full h-full bg-stone-900 flex flex-col justify-between p-4 border border-stone-800">
            <div className="absolute inset-0 flex items-center justify-center opacity-25">
              <svg className="w-24 h-24 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-stone-400 uppercase z-10">Dorm & Apartment</span>
            <div className="z-10">
              <p className="text-xs text-amber-300 font-medium">Student Passing-Down</p>
              <p className="text-sm font-semibold text-white truncate">{title}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`overflow-hidden rounded-lg ${className}`}>
      {renderVisual()}
    </div>
  );
};
