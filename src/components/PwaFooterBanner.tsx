import React from 'react';
import { Smartphone, Apple, Play } from 'lucide-react';

export const PwaFooterBanner: React.FC = () => {
  // Prevent links from navigating anywhere as requested ("dont have it lead it anyways yet")
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-12 px-4 sm:px-6 border-t border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Info */}
        <div className="max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/20">
            <Smartphone className="w-3.5 h-3.5" />
            PWA Mobile App Available
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
            Install StudentSquare PWA on iOS & Android
          </h3>
          <p className="text-sm text-stone-400 mt-2 leading-relaxed">
            Get instant push notifications for new sublets, live campus bus tracking, and secure escrow chats right from your mobile home screen. Scan a QR code below or add to home screen.
          </p>
        </div>

        {/* Right Side: Apple Store (Left) & Google Play (Right) with QR under each */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          
          {/* Apple App Store Column */}
          <div className="flex flex-col items-center bg-stone-800/80 border border-stone-700/60 rounded-2xl p-5 shadow-lg w-52 hover:border-stone-600 transition-all">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
              <Apple className="w-4 h-4 fill-current" />
              <span>Apple App Store</span>
            </div>

            {/* QR Code Placeholder (Non-functional as requested) */}
            <div 
              onClick={handleClick}
              className="bg-white p-3 rounded-xl shadow-inner cursor-pointer group relative"
              title="Scan QR Code (Preview)"
            >
              <svg className="w-28 h-28 text-stone-900" viewBox="0 0 24 24" fill="currentColor">
                {/* Stylized QR Code Matrix SVG */}
                <path d="M2 2h6v6H2V2zm2 2v2h2V4H4zM16 2h6v6h-6V2zm2 2v2h2V4h-2zM2 16h6v6H2v-6zm2 2v2h2v-2H4zM11 2h2v3h-2V2zm0 6h2v2h-2V8zm-5 5h3v2H6v-2zm6 0h2v2h-2v-2zm5 0h3v2h-3v-2zm-6 5h2v3h-2v-3zm5-3h2v6h-2v-6zm-11 5h6v2H6v-2zm12-9h3v3h-3v-3zm-6 0h3v3h-3v-3z" />
              </svg>
              <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span className="text-[10px] font-bold bg-stone-900 text-white px-2 py-0.5 rounded shadow">iOS PWA</span>
              </div>
            </div>

            <a
              href="#apple-store"
              onClick={handleClick}
              className="mt-4 w-full py-2 px-3 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Apple className="w-3.5 h-3.5 fill-current" />
              <span>App Store (iOS)</span>
            </a>
          </div>

          {/* Google Play Store Column */}
          <div className="flex flex-col items-center bg-stone-800/80 border border-stone-700/60 rounded-2xl p-5 shadow-lg w-52 hover:border-stone-600 transition-all">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
              <Play className="w-4 h-4 fill-current text-emerald-400" />
              <span>Google Play Store</span>
            </div>

            {/* QR Code Placeholder (Non-functional as requested) */}
            <div 
              onClick={handleClick}
              className="bg-white p-3 rounded-xl shadow-inner cursor-pointer group relative"
              title="Scan QR Code (Preview)"
            >
              <svg className="w-28 h-28 text-stone-900" viewBox="0 0 24 24" fill="currentColor">
                {/* Stylized QR Code Matrix SVG 2 */}
                <path d="M2 2h6v6H2V2zm2 2v2h2V4H4zM16 2h6v6h-6V2zm2 2v2h2V4h-2zM2 16h6v6H2v-6zm2 2v2h2v-2H4zM12 11h3v3h-3v-3zm-6 0h3v3H6v-3zm12 0h3v3h-3v-3zm-6 6h2v3h-2v-3zm5-3h2v6h-2v-6zm-11 5h6v2H6v-2zm12-9h3v3h-3v-3zm-6 0h3v3h-3v-3z" />
              </svg>
              <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <span className="text-[10px] font-bold bg-stone-900 text-white px-2 py-0.5 rounded shadow">Android PWA</span>
              </div>
            </div>

            <a
              href="#google-play"
              onClick={handleClick}
              className="mt-4 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Google Play</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
