import React, { useState } from 'react';
import { SubleaseContract, Campus, CurrentUser, MoveInInspectionItem } from '../types';

interface EscrowInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: SubleaseContract;
  currentCampus: Campus;
  currentUser: CurrentUser;
  onUpdateContract: (updated: SubleaseContract) => void;
}

export const EscrowInspectionModal: React.FC<EscrowInspectionModalProps> = ({
  isOpen,
  onClose,
  contract,
  currentCampus,
  currentUser,
  onUpdateContract,
}) => {
  const [checklist, setChecklist] = useState<MoveInInspectionItem[]>(contract.inspectionChecklist);
  const [activeTab, setActiveTab] = useState<'overview' | 'checklist' | 'insurance'>('checklist');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [showDisputeInput, setShowDisputeInput] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, verified: !item.verified } : item
    );
    setChecklist(updated);
  };

  const allVerified = checklist.every((i) => i.verified);

  const handleReleaseEscrow = () => {
    const updated: SubleaseContract = {
      ...contract,
      inspectionChecklist: checklist,
      escrow: {
        ...contract.escrow,
        status: 'Released to Host',
      },
    };
    onUpdateContract(updated);
    setStatusMessage('Deposit Escrow funds successfully released to host! Inspection confirmed complete.');
    setTimeout(() => {
      setStatusMessage(null);
      onClose();
    }, 2500);
  };

  const handleTriggerDispute = () => {
    const updated: SubleaseContract = {
      ...contract,
      inspectionChecklist: checklist,
      escrow: {
        ...contract.escrow,
        status: 'Under Inspection Dispute',
      },
    };
    onUpdateContract(updated);
    setStatusMessage('Escrow hold extended. StudentSquare campus mediation opened.');
    setTimeout(() => {
      setStatusMessage(null);
      setShowDisputeInput(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-2xl w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-stone-900">Sublet Insurance & Deposit Escrow Vault</h2>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                {contract.escrow.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Vault #{contract.escrow.escrowId} · {currentCampus.name} Move-In Protection Protocol
            </p>
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

        {/* Tab switcher */}
        <div className="flex border-b border-stone-200 px-6 bg-stone-50/50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'checklist' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Move-In Inspection Checklist ({checklist.filter(i => i.verified).length}/{checklist.length})
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`py-2.5 px-3 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'insurance' ? 'border-stone-900 text-stone-900 font-semibold' : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            $10,000 Protection Policy Details
          </button>
        </div>

        {statusMessage && (
          <div className="m-4 p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-medium">
            {statusMessage}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-5">
          {activeTab === 'checklist' && (
            <div className="space-y-4">
              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                <span className="font-semibold text-amber-950">48-Hour Move-In Inspection Window</span>
                <p className="mt-0.5 text-stone-700">
                  Inspect the space upon arrival. The security deposit (<span className="font-mono font-bold">${contract.securityDeposit}.00</span>) remains safely locked in third-party escrow until you complete this checklist and authorize release.
                </p>
              </div>

              {/* Checklist items */}
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-3 rounded-lg border text-xs transition-colors cursor-pointer flex items-start gap-3 ${
                      item.verified
                        ? 'bg-stone-50 border-stone-200 text-stone-900'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.verified}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-0.5 rounded border-stone-300 text-stone-900 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900">{item.title}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{item.category}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-stone-500 mt-1 italic">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {showDisputeInput ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3 text-xs">
                  <h3 className="font-semibold text-red-900">Report Inaccuracy or Damage Dispute</h3>
                  <p className="text-red-800">
                    Explain what does not match the listing (e.g. broken AC, missing keys, dirty condition). Funds will remain frozen in escrow.
                  </p>
                  <textarea
                    rows={3}
                    value={disputeNotes}
                    onChange={(e) => setDisputeNotes(e.target.value)}
                    placeholder="Provide details and photos..."
                    className="w-full p-2 border border-red-300 rounded bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowDisputeInput(false)}
                      className="px-3 py-1.5 text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleTriggerDispute}
                      className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-medium cursor-pointer"
                    >
                      Freeze Escrow & Submit Dispute
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDisputeInput(true)}
                  className="text-xs text-red-700 hover:text-red-900 underline font-medium cursor-pointer block"
                >
                  Does not match listing? Report an issue & freeze deposit escrow
                </button>
              )}
            </div>
          )}

          {activeTab === 'insurance' && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-emerald-950">StudentSquare Sublet Protection Policy</h3>
                  <span className="font-mono font-bold text-emerald-800">$10,000 Coverage</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  Included automatically with every verified contract on StudentSquare. Both students and sublessors are insured against accidental damages, unauthorized cancellations, and unexpected emergency displacement.
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="font-semibold text-stone-900 block">1. Property Damage Shield ($10,000 Max)</span>
                  <p className="text-stone-600 mt-0.5">
                    Covers accidental interior, furniture, or plumbing damages during the sublease term without requiring lengthy small-claims litigation.
                  </p>
                </div>
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="font-semibold text-stone-900 block">2. Host Ghosting / Move-In Failure Guarantee ($1,200 Housing Credit)</span>
                  <p className="text-stone-600 mt-0.5">
                    If a host cancels within 72 hours of move-in or keys are not delivered, StudentSquare guarantees emergency hotel accommodation and immediately refunds 100% of escrow deposits.
                  </p>
                </div>
                <div className="p-3 border border-stone-200 rounded-lg">
                  <span className="font-semibold text-stone-900 block">3. 100% Escrow Fraud Immunity</span>
                  <p className="text-stone-600 mt-0.5">
                    Scammers on Facebook Marketplace commonly demand Zelle, Venmo, or cash deposits upfront. StudentSquare Escrow Vault guarantees that money is never touched by individuals until physical possession is verified.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 font-mono">
            Escrow Amount: <span className="font-bold text-stone-900">${contract.securityDeposit}.00</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Close
            </button>
            {contract.escrow.status !== 'Released to Host' ? (
              <button
                onClick={handleReleaseEscrow}
                disabled={!allVerified}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-40 rounded-md cursor-pointer transition-colors shadow-xs"
              >
                Approve & Release Escrow to Host
              </button>
            ) : (
              <span className="text-xs font-semibold text-emerald-800 font-mono">
                ✓ Escrow Disbursed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
