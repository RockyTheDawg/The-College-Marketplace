import React from 'react';
import { Campus } from '../types';

interface DisconnectedLockScreenProps {
  currentCampus: Campus;
  onReconnectEdu: () => void;
}

export const DisconnectedLockScreen: React.FC<DisconnectedLockScreenProps> = ({
  currentCampus,
  onReconnectEdu,
}) => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-700 mx-auto flex items-center justify-center text-3xl shadow-xs">
          🔒
        </div>

        <span className="inline-block mt-4 text-[11px] font-mono uppercase tracking-wider text-red-800 font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          Campus Gating Enforced · Access Revoked
        </span>

        <h2 className="text-2xl font-bold font-display text-stone-900 mt-3">
          .edu Email Disconnected
        </h2>

        <p className="text-xs text-stone-600 mt-2.5 leading-relaxed max-w-md mx-auto">
          You have been automatically signed out. Because StudentSquare is an authentic, campus-gated network protected by security deposit escrow and digital lease agreements, access is restricted strictly to active university students with an authorized institutional .edu connection.
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 my-6 text-left text-xs space-y-2 text-stone-700">
          <div className="font-semibold text-stone-900 flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Why did this happen?</span>
          </div>
          <p className="text-stone-600 text-[11px] leading-relaxed">
            Your university student session was disconnected, unlinked, or expired. To prevent unauthorized off-campus solicitors from accessing student housing directories and messaging channels, access is instantly locked upon disconnection.
          </p>
          <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 font-mono">
            Campus Network: {currentCampus.name} (@{currentCampus.emailDomain})
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onReconnectEdu}
            className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Connect University .edu Email</span>
            <span>→</span>
          </button>

          <p className="text-[11px] text-stone-400">
            Accepts official institutional emails (.edu) from all 50 states plus private universities.
          </p>
        </div>
      </div>
    </div>
  );
};
