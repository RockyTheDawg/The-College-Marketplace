import React, { useState } from 'react';
import { SubleaseContract, Campus, CurrentUser, GuarantorInfo } from '../types';

interface ParentPortalViewProps {
  currentCampus: Campus;
  currentUser: CurrentUser;
  activeContract: SubleaseContract;
  onUpdateContract: (updated: SubleaseContract) => void;
  onOpenContractView: () => void;
}

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({
  currentCampus,
  currentUser,
  activeContract,
  onUpdateContract,
  onOpenContractView,
}) => {
  const existingGuarantor = activeContract.guarantor;

  // Portal form state
  const [parentName, setParentName] = useState(existingGuarantor?.name || 'Maria Rivera');
  const [parentEmail, setParentEmail] = useState(existingGuarantor?.email || 'm.rivera.family@gmail.com');
  const [parentPhone, setParentPhone] = useState(existingGuarantor?.phone || '(510) 555-0182');
  const [relationship, setRelationship] = useState<'Mother' | 'Father' | 'Legal Guardian' | 'Other Family'>(
    existingGuarantor?.relationship || 'Mother'
  );
  const [parentAddress, setParentAddress] = useState(
    existingGuarantor?.address || '742 Evergreen Terrace, San Jose, CA 95125'
  );
  const [parentSignature, setParentSignature] = useState(existingGuarantor?.signature || '');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'ach' | 'card'>('ach');
  const [accountNumber, setAccountNumber] = useState('····4921');
  const [routingNumber, setRoutingNumber] = useState('121000358');
  const [isDepositSubmitting, setIsDepositSubmitting] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Invite code generation
  const inviteCode = `SQ-COGN-${activeContract.id.slice(-4).toUpperCase()}-${currentUser.studentIdLast4}`;

  const handleSignGuaranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentSignature.trim() || !agreedToTerms) return;

    const updatedGuarantor: GuarantorInfo = {
      name: parentName,
      email: parentEmail,
      phone: parentPhone,
      relationship,
      address: parentAddress,
      status: 'Signed & Approved',
      signature: parentSignature.trim(),
      signedAt: new Date().toISOString(),
      depositFunded: existingGuarantor?.depositFunded || false,
      paymentMethod: existingGuarantor?.paymentMethod || 'Chase ACH (···4921) via Escrow Vault',
    };

    const updatedContract: SubleaseContract = {
      ...activeContract,
      status: 'Fully Executed',
      guarantor: updatedGuarantor,
    };

    onUpdateContract(updatedContract);
    setShowSuccessBanner(true);
    setTimeout(() => setShowSuccessBanner(false), 5000);
  };

  const handleFundEscrowDeposit = () => {
    setIsDepositSubmitting(true);
    setTimeout(() => {
      setIsDepositSubmitting(false);
      const updatedContract: SubleaseContract = {
        ...activeContract,
        guarantor: {
          ...(activeContract.guarantor || {
            name: parentName,
            email: parentEmail,
            phone: parentPhone,
            relationship,
            address: parentAddress,
            status: 'Signed & Approved',
            signature: parentSignature || parentName,
            signedAt: new Date().toISOString(),
            depositFunded: true,
          }),
          depositFunded: true,
          paymentMethod: paymentMethod === 'ach' ? `Direct ACH Checking (···4921)` : 'Visa Credit (···8820)',
        },
        escrow: {
          ...activeContract.escrow,
          status: 'Held in Escrow',
        },
      };
      onUpdateContract(updatedContract);
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>StudentSquare Family & Financial Trust</span>
            <span aria-hidden="true">·</span>
            <span>Parent & Legal Guardian Portal</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">FDIC Insured Escrow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-display text-balance">
            Verified Parent & Guarantor Co-Signer Portal
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            A transparent portal for parents and legal guardians to review residential sublease terms, provide binding co-signer guarantees, and securely fund deposits via protected escrow.
          </p>
        </div>

        {/* Invite link snippet for student */}
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs max-w-xs shrink-0">
          <span className="text-[10px] uppercase font-mono text-stone-400 block">Student Guarantor Invite Link</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono font-semibold text-stone-800 truncate">{inviteCode}</span>
            <button
              onClick={() => alert(`Invite link copied: https://studentsquare.app/guarantor?code=${inviteCode}`)}
              className="text-stone-900 font-medium hover:underline text-[11px] cursor-pointer shrink-0"
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>

      {showSuccessBanner && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 flex items-center gap-3 text-xs text-emerald-900">
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
            ✓
          </div>
          <div>
            <span className="font-semibold">Co-Signer Guarantee Recorded & Escrow Vault Updated!</span>
            <p className="text-emerald-800 mt-0.5">
              Legal documents have been synchronized with {currentCampus.name} student housing records and host {activeContract.sublessorName}.
            </p>
          </div>
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Lease Commitment Overview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
                Student Lease Under Review
              </span>
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>{activeContract.status}</span>
              </span>
            </div>

            {/* Student Card */}
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border border-stone-100">
              <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
                {currentUser.name[0]}
              </div>
              <div className="text-xs">
                <span className="font-semibold text-stone-900 text-sm">{currentUser.name}</span>
                <p className="text-stone-500">{currentUser.major} · {currentCampus.name}</p>
                <p className="font-mono text-stone-400 mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            {/* Financial Obligations breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Property Address</span>
                <span className="font-medium text-stone-900 text-right">{activeContract.propertyAddress}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Designated Unit</span>
                <span className="font-medium text-stone-900">{activeContract.unitNumber}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Lease Dates</span>
                <span className="font-medium font-mono text-stone-900">
                  {activeContract.termStart} to {activeContract.termEnd}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Monthly Sublease Rent</span>
                <span className="font-semibold font-mono text-stone-900 tabular-nums">
                  ${activeContract.monthlyRent}.00 / month
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Security Deposit (Escrow Protected)</span>
                <span className="font-semibold font-mono text-emerald-800 tabular-nums">
                  ${activeContract.securityDeposit}.00
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Host / Primary Tenant</span>
                <span className="font-medium text-stone-900">
                  {activeContract.sublessorName} ({activeContract.sublessorEmail})
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={onOpenContractView}
                className="text-xs text-stone-900 font-medium hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Legal Contract Text</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>

          {/* Third-Party Escrow Vault Explanation for Parents */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h2 className="text-xs font-semibold text-emerald-950">How Your Deposit is Protected</h2>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              When you submit the security deposit (${activeContract.securityDeposit}), funds are held in an escrow trust account. The host <span className="font-semibold underline">cannot access the funds</span> until your student completes the 12-point move-in inspection or 48 hours pass without dispute.
            </p>
          </div>
        </div>

        {/* Right Column: Parent Verification, Guarantee Signature, and Deposit Funding */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Parent / Guardian Identity & Information */}
          <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
              1. Parent / Legal Guardian Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Parent / Guardian Legal Name</label>
                <input
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Relationship to Student</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value as any)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                  <option value="Other Family">Other Family Co-Signer</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Email Address (for Receipt & Updates)</label>
                <input
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Residential Street Address</label>
                <input
                  type="text"
                  required
                  value={parentAddress}
                  onChange={(e) => setParentAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Digital Guarantor Agreement */}
          <form onSubmit={handleSignGuaranty} className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 shadow-xs">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
              2. Digital Co-Signer Guaranty Agreement
            </h2>

            <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs text-stone-600 leading-relaxed max-h-36 overflow-y-auto font-serif">
              <p>
                "FOR VALUE RECEIVED, and in consideration of the execution of the residential sublease for {activeContract.propertyAddress} to student {currentUser.name}, the undersigned Guarantor hereby unconditionally guarantees the full and prompt payment of all rent and financial covenants under said agreement. This Guaranty is continuing and binding upon Guarantor's heirs and legal representatives."
              </p>
            </div>

            <label className="flex items-start gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-stone-900"
              />
              <span>
                I agree to the legally binding terms of this Guaranty and confirm I am the authorized legal parent or guardian for {currentUser.name}.
              </span>
            </label>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Type Legal Full Name as Co-Signer Signature:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={parentSignature}
                  onChange={(e) => setParentSignature(e.target.value)}
                  placeholder="e.g. Maria Rivera"
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded font-serif italic focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <button
                  type="submit"
                  disabled={!agreedToTerms || !parentSignature.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 rounded shrink-0 cursor-pointer shadow-xs"
                >
                  Sign Guaranty
                </button>
              </div>
            </div>

            {activeContract.guarantor?.signedAt && (
              <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-mono">
                <span>✓ Signed by {activeContract.guarantor.name} ({activeContract.guarantor.relationship}) on {activeContract.guarantor.signedAt.slice(0, 10)}</span>
              </div>
            )}
          </form>

          {/* Step 3: Escrow Deposit Submission */}
          <div className="bg-white rounded-lg border border-stone-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
                3. Fund Security Deposit via Escrow Vault (${activeContract.securityDeposit}.00)
              </h2>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Escrow Protected
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('ach')}
                className={`p-3 rounded border text-left cursor-pointer transition-colors ${
                  paymentMethod === 'ach'
                    ? 'border-stone-900 bg-stone-50 font-medium'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Bank Account (ACH)</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">$0 Fee</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Direct wire from checking or savings</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded border text-left cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-stone-900 bg-stone-50 font-medium'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Debit / Credit Card</span>
                  <span className="text-[10px] text-stone-400">Instant</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Visa, Mastercard, Amex</p>
              </button>
            </div>

            {paymentMethod === 'ach' ? (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-500 mb-1">Routing Transit Number</label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-stone-500 mb-1">Checking Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="text-xs space-y-2">
                <div>
                  <label className="block text-stone-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4000 1234 5678 9010"
                    className="w-full px-2.5 py-1.5 border border-stone-300 rounded font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div className="text-xs text-stone-500">
                Total Authorized: <span className="font-mono font-bold text-stone-900">${activeContract.securityDeposit}.00</span>
              </div>

              <button
                type="button"
                onClick={handleFundEscrowDeposit}
                disabled={isDepositSubmitting}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-md cursor-pointer transition-colors shadow-xs"
              >
                {isDepositSubmitting ? 'Funding Escrow...' : activeContract.guarantor?.depositFunded ? 'Deposit Funded (Hold Active)' : 'Authorize & Fund Escrow'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
