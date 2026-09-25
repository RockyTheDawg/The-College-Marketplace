import React, { useState } from 'react';
import { CurrentUser, Campus } from '../types';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CurrentUser;
  onUpdateUser: (updated: Partial<CurrentUser>) => void;
  currentCampus: Campus;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  currentCampus,
}) => {
  const [step, setStep] = useState<'status' | 'input' | 'otp' | 'success'>(
    currentUser.isVerified ? 'status' : 'input'
  );
  const [emailInput, setEmailInput] = useState(
    currentUser.email || `student@${currentCampus.emailDomain}`
  );
  const [studentName, setStudentName] = useState(currentUser.name || 'Alex Rivera');
  const [majorInput, setMajorInput] = useState(currentUser.major || 'Computer Science & Data Science');
  const [yearInput, setYearInput] = useState(currentUser.year || 'Junior (Class of 2027)');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.toLowerCase().endsWith('.edu')) {
      setErrorMessage('Please provide an official university email ending in .edu');
      return;
    }
    setErrorMessage('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length < 4 && otpCode !== '947201') {
      setErrorMessage('Please enter the 6-digit code sent to your email.');
      return;
    }
    const randId = Math.floor(1000 + Math.random() * 9000).toString();
    onUpdateUser({
      name: studentName,
      email: emailInput,
      isVerified: true,
      major: majorInput,
      year: yearInput,
      studentIdLast4: randId,
    });
    setStep('success');
  };

  const handleRevoke = () => {
    onUpdateUser({
      isVerified: false,
    });
    setStep('input');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Campus Identity & Verification</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Gated by official @{currentCampus.emailDomain} institutional credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 p-1 rounded-md cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content based on step */}
        <div className="p-6">
          {step === 'status' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-emerald-950">Active Student Account Verified</h3>
                    <span className="text-xs text-emerald-700 font-mono">ID #{currentUser.studentIdLast4}</span>
                  </div>
                  <p className="text-xs text-emerald-800 mt-1">
                    Your institutional affiliation is active for {currentCampus.name}. You have unrestricted permissions to post sublets, message hosts, execute binding sublease agreements, and buy/sell campus items.
                  </p>
                </div>
              </div>

              <div className="border border-stone-200 rounded-lg divide-y divide-stone-100 text-xs">
                <div className="p-3 flex justify-between">
                  <span className="text-stone-500">Student Name</span>
                  <span className="font-medium text-stone-900">{currentUser.name}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-stone-500">Verified Email</span>
                  <span className="font-mono text-stone-900">{currentUser.email}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-stone-500">Department / Major</span>
                  <span className="font-medium text-stone-900">{currentUser.major}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-stone-500">Academic Standing</span>
                  <span className="font-medium text-stone-900">{currentUser.year}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span className="text-stone-500">Security Clearance</span>
                  <span className="text-emerald-700 font-medium">Scam-Proof Safe Trader Certified</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleRevoke}
                  className="text-xs text-stone-500 hover:text-red-700 cursor-pointer"
                >
                  Change Email / Re-verify
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {step === 'input' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="text-xs text-stone-600 leading-relaxed">
                To eliminate fraudulent accounts, sublease deposits scams, and off-campus scalpers, QuadHaven requires an active institutional .edu email from an accredited university.
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Student Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  University Student Email (.edu)
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                  placeholder={`e.g. yourname@${currentCampus.emailDomain}`}
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Must be an official .edu domain (e.g. @{currentCampus.emailDomain}, @utexas.edu, @umich.edu)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    required
                    value={majorInput}
                    onChange={(e) => setMajorInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Class Standing
                  </label>
                  <select
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                  >
                    <option value="Freshman (Class of 2029)">Freshman (Class of 2029)</option>
                    <option value="Sophomore (Class of 2028)">Sophomore (Class of 2028)</option>
                    <option value="Junior (Class of 2027)">Junior (Class of 2027)</option>
                    <option value="Senior (Class of 2026)">Senior (Class of 2026)</option>
                    <option value="Graduate Student / PhD">Graduate Student / PhD</option>
                  </select>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  {errorMessage}
                </p>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer"
                >
                  Send Verification Code
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-xs text-amber-900">
                <p className="font-medium">Verification Code Sent!</p>
                <p className="text-stone-600 mt-1">
                  We simulated sending a 6-digit confirmation token to <span className="font-mono font-medium text-stone-800">{emailInput}</span>.
                </p>
                <p className="mt-2 text-[11px] text-amber-800 font-mono">
                  [Quick Demo Code]: Click "Fill 947201" or enter 947201
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  6-Digit OTP Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center text-base tracking-widest px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
                    placeholder="947201"
                  />
                  <button
                    type="button"
                    onClick={() => setOtpCode('947201')}
                    className="px-3 py-2 text-xs font-medium bg-stone-100 hover:bg-stone-200 rounded text-stone-700 shrink-0 cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  {errorMessage}
                </p>
              )}

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  Back to Email
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer"
                >
                  Verify & Activate
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-900">Verification Complete</h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  Your student status at {currentCampus.name} has been confirmed. You now hold full access to all campus sublet contacts, contracts, and marketplace listings.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer"
              >
                Start Exploring
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
