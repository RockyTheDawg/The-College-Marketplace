import React, { useState } from 'react';
import { MarketplaceItem, Campus, CurrentUser, ItemCategory, ItemCondition } from '../types';

interface CreateMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCampus: Campus;
  currentUser: CurrentUser;
  onAddItem: (item: MarketplaceItem) => void;
}

export const CreateMarketplaceModal: React.FC<CreateMarketplaceModalProps> = ({
  isOpen,
  onClose,
  currentCampus,
  currentUser,
  onAddItem,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Furniture');
  const [price, setPrice] = useState<number>(45);
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [courseCode, setCourseCode] = useState('');
  const [pickupLocation, setPickupLocation] = useState('Moffitt Library or Southside Lobby');
  const [description, setDescription] = useState('');
  const [visualCategory, setVisualCategory] = useState<'desk' | 'textbook' | 'monitor' | 'bike' | 'microwave' | 'chair'>('desk');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    let derivedVisual = visualCategory;
    if (category === 'Textbooks & Notes') derivedVisual = 'textbook';
    else if (category === 'Electronics & Tech') derivedVisual = 'monitor';
    else if (category === 'Bikes & Scooters') derivedVisual = 'bike';
    else if (category === 'Kitchen & Home') derivedVisual = 'microwave';

    const newItem: MarketplaceItem = {
      id: `item_${Date.now()}`,
      campusId: currentCampus.id,
      title: title.trim(),
      category,
      price: Number(price),
      originalPrice: originalPrice > 0 ? Number(originalPrice) : undefined,
      condition,
      description: description.trim(),
      courseCode: courseCode.trim() || undefined,
      pickupLocation: pickupLocation.trim(),
      seller: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        major: currentUser.major,
        year: currentUser.year,
        verified: currentUser.isVerified,
        avatarColor: 'bg-emerald-700',
      },
      visualCategory: derivedVisual,
      isSold: false,
      createdAt: 'Just now',
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-lg w-full my-8 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-base font-semibold text-stone-900">List an Item for Campus Sale</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Available to verified students at {currentCampus.name}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Item Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ergonomic Standing Desk, CS 61B Textbook, Mini Fridge"
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
              >
                <option value="Furniture">Furniture</option>
                <option value="Textbooks & Notes">Textbooks & Notes</option>
                <option value="Electronics & Tech">Electronics & Tech</option>
                <option value="Bikes & Scooters">Bikes & Scooters</option>
                <option value="Kitchen & Home">Kitchen & Home</option>
                <option value="Free / Moving Out">Free / Moving Out</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
          </div>

          {category === 'Textbooks & Notes' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Course Code (Optional)
              </label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g. CS 61A, ECON 101, CHEM 1A"
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Student Price ($)
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Original Retail ($ Optional)
              </label>
              <input
                type="number"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Campus Hand-off Location
            </label>
            <input
              type="text"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Moffitt Library 3rd floor, Unit 1 Courtyard, West Campus Lobby"
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Description & Details
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Note any wear, dimensions, accessories included, and your general availability for pickup..."
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
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
              List Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
