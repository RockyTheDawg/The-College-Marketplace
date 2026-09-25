import React, { useState } from 'react';
import { SubletListing, Campus, CurrentUser, HousingTerm, RoomType } from '../types';

interface CreateSubletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampus: Campus;
  currentUser: CurrentUser;
  onAddSublet: (listing: SubletListing) => void;
}

export const CreateSubletModal: React.FC<CreateSubletModalProps> = ({
  isOpen,
  onClose,
  currentCampus,
  currentUser,
  onAddSublet,
}) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Southside');
  const [distanceToCampus, setDistanceToCampus] = useState('0.4 mi to Campus (6 min walk)');
  const [pricePerMonth, setPricePerMonth] = useState<number>(1150);
  const [term, setTerm] = useState<HousingTerm>('Summer 2026');
  const [startDate, setStartDate] = useState('2026-05-25');
  const [endDate, setEndDate] = useState('2026-08-15');
  const [roomType, setRoomType] = useState<RoomType>('Private Room / Shared Bath');
  const [furnished, setFurnished] = useState(true);
  const [petFriendly, setPetFriendly] = useState(false);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(true);
  const [inUnitLaundry, setInUnitLaundry] = useState(true);
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [description, setDescription] = useState('');
  const [landlordApproved, setLandlordApproved] = useState(true);
  const [buildingName, setBuildingName] = useState('');
  const [visualCategory, setVisualCategory] = useState<'studio' | 'private_room' | 'loft' | 'duplex' | 'modern_apt'>('private_room');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !address.trim() || !description.trim()) return;

    const newListing: SubletListing = {
      id: `sub_${Date.now()}`,
      campusId: currentCampus.id,
      title: title.trim(),
      address: address.trim(),
      neighborhood: neighborhood.trim(),
      distanceToCampus: distanceToCampus.trim(),
      pricePerMonth: Number(pricePerMonth),
      term,
      startDate,
      endDate,
      roomType,
      totalBedrooms: 3,
      totalBathrooms: 2,
      furnished,
      petFriendly,
      utilitiesIncluded,
      inUnitLaundry,
      parkingAvailable,
      description: description.trim(),
      landlordApproved,
      buildingName: buildingName.trim() || undefined,
      poster: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        major: currentUser.major,
        year: currentUser.year,
        verified: currentUser.isVerified,
        avatarColor: 'bg-emerald-700',
      },
      amenities: [
        furnished ? 'Fully Furnished' : 'Unfurnished',
        utilitiesIncluded ? 'Utilities Included' : 'Shared Utility Split',
        inUnitLaundry ? 'In-Unit Washer & Dryer' : 'On-Site Laundry',
        'High-Speed Campus WiFi',
        'Study Space & Desk',
      ],
      visualCategory,
      transit: {
        shuttleName: `${currentCampus.shortName} Campus Transit`,
        nearestStop: `${neighborhood} Avenue Stop`,
        walkTimeToStopMin: 2,
        nextArrivalsMin: [5, 15, 25],
        bikeLaneSafetyScore: 92,
        bikeLaneType: 'Dedicated Buffered Lane',
        lectureHallDistances: [
          { hallName: 'Main Campus Quad', walkTimeMin: 6, distanceMi: 0.3, shuttleAvailable: true },
          { hallName: 'Undergraduate Library', walkTimeMin: 8, distanceMi: 0.45, shuttleAvailable: true },
          { hallName: 'Science & Engineering Complex', walkTimeMin: 11, distanceMi: 0.6, shuttleAvailable: true },
        ],
      },
      escrowEligible: true,
      guarantorAccepted: true,
      createdAt: 'Just now',
    };

    onAddSublet(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-2xl w-full my-8 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div>
            <h2 className="text-base font-semibold text-stone-900">Post a Student Sublet or Lease Takeover</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Publishing to verified students at {currentCampus.name}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Listing Headline
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunny Master Bedroom with Private Bath near Telegraph"
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Property Street Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 2435 Dwight Way, Apt 3B"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Neighborhood / Campus District
              </label>
              <input
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="e.g. Southside, West Campus, Kerrytown"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Monthly Rent (USD)
              </label>
              <input
                type="number"
                required
                min={200}
                max={6000}
                value={pricePerMonth}
                onChange={(e) => setPricePerMonth(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Housing Term
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value as HousingTerm)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
              >
                <option value="Summer 2026">Summer 2026</option>
                <option value="Fall 2026">Fall 2026</option>
                <option value="Spring 2027">Spring 2027</option>
                <option value="Full Year 2026-2027">Full Year 2026-2027</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Room Layout
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
              >
                <option value="Entire Studio">Entire Studio</option>
                <option value="Private Room / Private Bath">Private Room / Private Bath</option>
                <option value="Private Room / Shared Bath">Private Room / Shared Bath</option>
                <option value="Shared Room">Shared Room</option>
                <option value="2-Bedroom Takeover">2-Bedroom Takeover</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Sublet Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Sublet End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Walk Time / Proximity to Campus
            </label>
            <input
              type="text"
              value={distanceToCampus}
              onChange={(e) => setDistanceToCampus(e.target.value)}
              placeholder="e.g. 0.3 mi to Library (4 min walk)"
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Description & House Details
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the room, furniture included, roommates living here, study atmosphere, and building amenities..."
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          {/* Quick Checkboxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={furnished}
                onChange={(e) => setFurnished(e.target.checked)}
                className="rounded border-stone-300 text-stone-900"
              />
              <span>Furnished</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={utilitiesIncluded}
                onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                className="rounded border-stone-300 text-stone-900"
              />
              <span>Utilities Included</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inUnitLaundry}
                onChange={(e) => setInUnitLaundry(e.target.checked)}
                className="rounded border-stone-300 text-stone-900"
              />
              <span>In-Unit Laundry</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={petFriendly}
                onChange={(e) => setPetFriendly(e.target.checked)}
                className="rounded border-stone-300 text-stone-900"
              />
              <span>Pet Friendly</span>
            </label>
          </div>

          {/* Anti-Scam Landlord Approval Confirmation */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-md p-3 text-xs text-amber-900">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={landlordApproved}
                onChange={(e) => setLandlordApproved(e.target.checked)}
                className="mt-0.5 rounded border-amber-300 text-stone-900"
              />
              <div>
                <span className="font-semibold text-amber-950">Landlord Sublease Authorization Compliance</span>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  I confirm that our original master lease allows subleasing or that our property management has provided written consent. StudentSquare will provide the standard institutional sublease contract template upon agreement.
                </p>
              </div>
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer transition-colors shadow-xs"
            >
              Publish Verified Sublet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
