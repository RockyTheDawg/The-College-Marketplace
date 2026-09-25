import React, { useState, useEffect } from 'react';
import { SubleaseContract, Campus, CurrentUser, SubletListing } from '../types';

interface ContractBuilderProps {
  currentCampus: Campus;
  currentUser: CurrentUser;
  contracts: SubleaseContract[];
  onSaveContract: (contract: SubleaseContract) => void;
  prefillListing?: SubletListing | null;
  onClearPrefill?: () => void;
}

export const ContractBuilder: React.FC<ContractBuilderProps> = ({
  currentCampus,
  currentUser,
  contracts,
  onSaveContract,
  prefillListing,
  onClearPrefill,
}) => {
  // Active selected or new contract
  const [activeContractId, setActiveContractId] = useState<string>(
    contracts[0]?.id || 'new'
  );

  // Form Fields
  const [sublessorName, setSublessorName] = useState<string>('');
  const [sublessorEmail, setSublessorEmail] = useState<string>('');
  const [sublesseeName, setSublesseeName] = useState<string>(currentUser.name);
  const [sublesseeEmail, setSublesseeEmail] = useState<string>(currentUser.email);
  const [propertyAddress, setPropertyAddress] = useState<string>('');
  const [unitNumber, setUnitNumber] = useState<string>('');
  const [termStart, setTermStart] = useState<string>('2026-05-25');
  const [termEnd, setTermEnd] = useState<string>('2026-08-15');
  const [monthlyRent, setMonthlyRent] = useState<number>(1200);
  const [securityDeposit, setSecurityDeposit] = useState<number>(600);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState<string>(
    'Water, trash, recycling, and high-speed campus WiFi. Electricity split equally among residents.'
  );
  const [houseRules, setHouseRules] = useState<string>(
    'Quiet hours 10:30 PM - 8:00 AM on weekdays. No indoor smoking or vaping. Guests permitted up to 2 consecutive nights with roommate notification.'
  );
  const [sublesseeSignature, setSublesseeSignature] = useState<string>('');
  const [sublessorSignature, setSublessorSignature] = useState<string>('');
  const [contractStatus, setContractStatus] = useState<'Draft' | 'Pending Sublessee Signature' | 'Fully Executed'>('Draft');
  const [showSignedSuccess, setShowSignedSuccess] = useState<boolean>(false);

  // Load from prefillListing if provided
  useEffect(() => {
    if (prefillListing) {
      setSublessorName(prefillListing.poster.name);
      setSublessorEmail(prefillListing.poster.email);
      setSublesseeName(currentUser.name);
      setSublesseeEmail(currentUser.email);
      setPropertyAddress(prefillListing.address);
      setUnitNumber(prefillListing.roomType);
      setTermStart(prefillListing.startDate);
      setTermEnd(prefillListing.endDate);
      setMonthlyRent(prefillListing.pricePerMonth);
      setSecurityDeposit(Math.round(prefillListing.pricePerMonth * 0.5));
      setSublessorSignature(prefillListing.poster.name);
      setContractStatus('Pending Sublessee Signature');
    }
  }, [prefillListing, currentUser]);

  // Load active contract when selected
  const handleSelectContract = (c: SubleaseContract) => {
    setActiveContractId(c.id);
    setSublessorName(c.sublessorName);
    setSublessorEmail(c.sublessorEmail);
    setSublesseeName(c.sublesseeName);
    setSublesseeEmail(c.sublesseeEmail);
    setPropertyAddress(c.propertyAddress);
    setUnitNumber(c.unitNumber);
    setTermStart(c.termStart);
    setTermEnd(c.termEnd);
    setMonthlyRent(c.monthlyRent);
    setSecurityDeposit(c.securityDeposit);
    setUtilitiesIncluded(c.utilitiesIncluded);
    setHouseRules(c.houseRules);
    setSublessorSignature(c.sublessorSignature || '');
    setSublesseeSignature(c.sublesseeSignature || '');
    setContractStatus(c.status);
    if (onClearPrefill) onClearPrefill();
  };

  const handleCreateNew = () => {
    setActiveContractId('new');
    setSublessorName(currentUser.name);
    setSublessorEmail(currentUser.email);
    setSublesseeName('');
    setSublesseeEmail('');
    setPropertyAddress('2400 Telegraph Ave, Berkeley, CA');
    setUnitNumber('Private Bedroom A');
    setTermStart('2026-05-25');
    setTermEnd('2026-08-15');
    setMonthlyRent(1200);
    setSecurityDeposit(600);
    setSublessorSignature('');
    setSublesseeSignature('');
    setContractStatus('Draft');
    if (onClearPrefill) onClearPrefill();
  };

  const handleSignContract = (role: 'sublessee' | 'sublessor') => {
    if (role === 'sublessee') {
      const sig = sublesseeSignature.trim() || currentUser.name;
      setSublesseeSignature(sig);
      const isBothSigned = !!sublessorSignature;
      const nextStatus = isBothSigned ? 'Fully Executed' : 'Pending Sublessee Signature';
      setContractStatus(nextStatus);

      const updatedContract: SubleaseContract = {
        id: activeContractId === 'new' ? `ctr_${Date.now()}` : activeContractId,
        campusId: currentCampus.id,
        universityName: currentCampus.name,
        createdAt: new Date().toISOString().split('T')[0],
        status: isBothSigned ? 'Fully Executed' : 'Pending Sublessee Signature',
        sublessorName,
        sublessorEmail,
        sublesseeName,
        sublesseeEmail,
        propertyAddress,
        unitNumber,
        termStart,
        termEnd,
        monthlyRent,
        securityDeposit,
        utilitiesIncluded,
        houseRules,
        sublessorSignature,
        sublessorSignedAt: sublessorSignature ? new Date().toISOString() : undefined,
        sublesseeSignature: sig,
        sublesseeSignedAt: new Date().toISOString(),
      };
      onSaveContract(updatedContract);
      setShowSignedSuccess(true);
      setTimeout(() => setShowSignedSuccess(false), 4000);
    } else {
      const sig = sublessorName || currentUser.name;
      setSublessorSignature(sig);
      const isBothSigned = !!sublesseeSignature;
      setContractStatus(isBothSigned ? 'Fully Executed' : 'Pending Sublessee Signature');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>{currentCampus.name} Legal Template</span>
            <span aria-hidden="true">·</span>
            <span>Standard Residential Sublease</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Enforceable Student Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display text-balance">
            Automated Sublease Contract Generator
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Protect both parties with our campus-vetted sublease contract. Automatically populates property clauses, security deposit protections, utility splits, and legally binding digital signatures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNew}
            className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-white border border-stone-300 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
          >
            + New Agreement
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {showSignedSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 flex items-center gap-3 text-xs text-emerald-900">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            ✓
          </div>
          <div>
            <span className="font-semibold">Sublease Agreement Digitally Signed & Recorded!</span>
            <p className="text-emerald-800 mt-0.5">
              Both parties have official verification timestamps under {currentCampus.name} campus honor policy.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Left editor parameters, Right live formatted document preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Clause Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Existing contracts selector */}
          {contracts.length > 0 && (
            <div className="bg-white rounded-lg border border-stone-200 p-3">
              <span className="text-xs text-stone-500 font-medium block mb-2">Saved Student Contracts</span>
              <div className="space-y-1">
                {contracts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectContract(c)}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      activeContractId === c.id
                        ? 'bg-stone-900 text-white font-medium'
                        : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span className="truncate max-w-[200px]">{c.propertyAddress || 'Untitled Contract'}</span>
                    <span className="text-[10px] opacity-80">{c.status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
              Contract Terms & Parties
            </h2>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Sublessor (Current Tenant Name & Email)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={sublessorName}
                    onChange={(e) => setSublessorName(e.target.value)}
                    placeholder="Sublessor Name"
                    className="text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                  <input
                    type="email"
                    value={sublessorEmail}
                    onChange={(e) => setSublessorEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Sublessee (Incoming Student Name & Email)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={sublesseeName}
                    onChange={(e) => setSublesseeName(e.target.value)}
                    placeholder="Sublessee Name"
                    className="text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                  <input
                    type="email"
                    value={sublesseeEmail}
                    onChange={(e) => setSublesseeEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Leased Premises Address & Room Unit
                </label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  placeholder="e.g. 2435 Dwight Way, Apt 3B, Berkeley, CA"
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded mb-2 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <input
                  type="text"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="e.g. Master Bedroom with Ensuite Bath"
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={termStart}
                    onChange={(e) => setTermStart(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={termEnd}
                    onChange={(e) => setTermEnd(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Monthly Rent ($)
                  </label>
                  <input
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Security Deposit ($)
                  </label>
                  <input
                    type="number"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Utilities & Internet Coverage
                </label>
                <textarea
                  rows={2}
                  value={utilitiesIncluded}
                  onChange={(e) => setUtilitiesIncluded(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Quiet Hours & House Rules
                </label>
                <textarea
                  rows={2}
                  value={houseRules}
                  onChange={(e) => setHouseRules(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>

            {/* Digital Signature Panel */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
                Execute Digital Signature
              </h3>

              <div>
                <label className="block text-xs text-stone-600 mb-1">
                  Type Legal Full Name to Sign as Sublessee:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sublesseeSignature}
                    onChange={(e) => setSublesseeSignature(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full text-xs px-2.5 py-1.5 border border-stone-300 rounded font-serif italic focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                  <button
                    onClick={() => handleSignContract('sublessee')}
                    className="px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded shrink-0 cursor-pointer shadow-xs"
                  >
                    Sign & Bind
                  </button>
                </div>
              </div>

              {!sublessorSignature && (
                <button
                  onClick={() => handleSignContract('sublessor')}
                  className="text-xs text-stone-600 hover:text-stone-900 underline block cursor-pointer"
                >
                  Sign as Sublessor ({sublessorName || 'Current Host'})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Formal Legal Agreement Paper Preview */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-stone-300 shadow-md p-8 sm:p-10 font-serif text-stone-800 space-y-6 text-xs sm:text-sm leading-relaxed print:p-0 print:border-none print:shadow-none">
          {/* Header Seal */}
          <div className="text-center pb-4 border-b-2 border-stone-900">
            <h2 className="text-base sm:text-lg font-bold tracking-wider uppercase font-display text-stone-900">
              Residential Sublease Agreement
            </h2>
            <p className="text-xs text-stone-500 font-sans tracking-wide mt-1 uppercase">
              Governed by the Municipal Housing Code of {currentCampus.city}, {currentCampus.state}
            </p>
            <p className="text-[11px] text-stone-400 font-mono mt-0.5">
              QuadHaven Student Housing Verification Protocol · Reference #{activeContractId}
            </p>
          </div>

          {/* Recitals */}
          <p>
            This Sublease Agreement (the <span className="font-semibold">"Sublease"</span>) is made effective as of{' '}
            <span className="font-semibold underline">{termStart || '___________'}</span>, by and between{' '}
            <span className="font-semibold underline">{sublessorName || 'Elena Rostova'}</span> (<span className="italic">{sublessorEmail}</span>, hereinafter designated as <span className="font-semibold">"Sublessor"</span>) and{' '}
            <span className="font-semibold underline">{sublesseeName || currentUser.name}</span> (<span className="italic">{sublesseeEmail}</span>, hereinafter designated as <span className="font-semibold">"Sublessee"</span>). Both parties affirm active student enrollment at{' '}
            <span className="font-semibold">{currentCampus.name}</span>.
          </p>

          {/* Section 1: Leased Premises */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-1">
              1. Leased Premises & Description
            </h3>
            <p>
              Sublessor agrees to sublease to Sublessee, and Sublessee agrees to rent from Sublessor, the portion of the residential property located at:{' '}
              <span className="font-semibold">{propertyAddress || '2435 Dwight Way, Apt 3B, Berkeley, CA'}</span>, specifically consisting of{' '}
              <span className="font-semibold">{unitNumber || 'Designated Master Ensuite Bedroom'}</span>, along with shared access to kitchen, living areas, and common facilities.
            </p>
          </div>

          {/* Section 2: Term */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-1">
              2. Term of Sublease
            </h3>
            <p>
              The term of this Sublease shall commence on <span className="font-semibold underline">{termStart}</span>, and shall terminate on{' '}
              <span className="font-semibold underline">{termEnd}</span>, at which point Sublessee shall peacefully surrender possession in clean condition.
            </p>
          </div>

          {/* Section 3: Rent & Security Deposit */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-1">
              3. Rent & Security Deposit
            </h3>
            <p>
              Sublessee covenants to pay Sublessor rent at the rate of <span className="font-semibold tabular-nums font-mono">${monthlyRent}.00 USD</span> per calendar month, due on the first day of each month. A security deposit of{' '}
              <span className="font-semibold tabular-nums font-mono">${securityDeposit}.00 USD</span> shall be held by Sublessor and returned within 14 days of lease termination, minus documented repairs for physical damage exceeding ordinary wear and tear.
            </p>
          </div>

          {/* Section 4: Utilities */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-1">
              4. Utilities & Amenities
            </h3>
            <p>
              The monthly rent includes: <span className="italic">{utilitiesIncluded}</span>.
            </p>
          </div>

          {/* Section 5: Master Lease and Landlord Consent */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-1">
              5. Landlord Consent & Primary Lease Compliance
            </h3>
            <p>
              Sublessor represents that the landlord/property owner of the premises has granted consent for this sublease. Sublessee agrees to strictly abide by all terms of the master lease and municipal noise ordinances.
            </p>
          </div>

          {/* Section 6: House Rules */}
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-stone-900 mb-1">
              6. House Rules & Quiet Enjoyment
            </h3>
            <p>
              {houseRules}
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 border-t-2 border-stone-300 grid grid-cols-2 gap-8 font-sans">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase text-stone-500 block">Sublessor Signature:</span>
              <div className="h-12 border-b border-stone-400 flex items-end pb-1">
                {sublessorSignature ? (
                  <span className="font-serif italic text-lg text-stone-900">{sublessorSignature}</span>
                ) : (
                  <span className="text-xs text-stone-400 italic">[Pending Signature]</span>
                )}
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                {sublessorName} · @{currentCampus.emailDomain}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase text-stone-500 block">Sublessee Signature:</span>
              <div className="h-12 border-b border-stone-400 flex items-end pb-1">
                {sublesseeSignature ? (
                  <span className="font-serif italic text-lg text-emerald-900 font-bold">{sublesseeSignature}</span>
                ) : (
                  <span className="text-xs text-stone-400 italic">[Pending Signature]</span>
                )}
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                {sublesseeName} · Verified Student
              </div>
            </div>
          </div>

          {/* Status Seal */}
          <div className="pt-4 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 font-sans">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${contractStatus === 'Fully Executed' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
              <span className="font-medium text-stone-700">Status: {contractStatus}</span>
            </div>
            <span className="font-mono text-[11px]">Timestamped via QuadHaven</span>
          </div>
        </div>
      </div>
    </div>
  );
};
