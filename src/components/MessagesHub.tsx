import React, { useState } from 'react';
import { Conversation, CurrentUser, Campus } from '../types';

interface MessagesHubProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  currentUser: CurrentUser;
  currentCampus: Campus;
  onSendMessage: (conversationId: string, text: string, isOffer?: boolean, offerDetails?: any) => void;
  onDraftContractForListing: (listingId?: string, listingTitle?: string) => void;
}

export const MessagesHub: React.FC<MessagesHubProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  currentUser,
  currentCampus,
  onSendMessage,
  onDraftContractForListing,
}) => {
  const [inputText, setInputText] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState(1200);
  const [offerDates, setOfferDates] = useState('May 25 – Aug 15');

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  const handleSendQuickTour = () => {
    if (!activeConv) return;
    const tourText = `Hi ${activeConv.participant.name}, could we schedule a 10-minute FaceTime walkthrough or in-person tour of the space this week? I am free weekday afternoons!`;
    onSendMessage(activeConv.id, tourText);
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv) return;
    const offerText = `Formal Offer Submitted: Proposing $${offerPrice}/month for dates (${offerDates}). Please let me know if this works for you!`;
    onSendMessage(activeConv.id, offerText, true, {
      term: 'Summer 2026',
      monthlyRent: offerPrice,
      proposedDates: offerDates,
    });
    setShowOfferModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
          <span>{currentCampus.name} Verified Mesh</span>
          <span aria-hidden="true">·</span>
          <span>End-to-End Campus Authenticated</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-display">
          In-App Messaging & Lease Negotiations
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          Communicate directly with student leaseholders and marketplace sellers. No external email spam or phantom phone numbers.
        </p>
      </div>

      {/* Main Messenger Box */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* Left: Conversations sidebar */}
        <div className="md:col-span-4 border-r border-stone-200 flex flex-col bg-stone-50">
          <div className="p-3.5 border-b border-stone-200 bg-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-700 font-mono">
              Active Threads ({conversations.length})
            </span>
          </div>

          <div className="overflow-y-auto divide-y divide-stone-100 flex-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500">
                No conversations yet. Message any host or marketplace seller to start a secure thread.
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => onSelectConversation(conv.id)}
                    className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 cursor-pointer ${
                      isSelected ? 'bg-amber-50/70 border-l-3 border-amber-800' : 'hover:bg-stone-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full ${conv.participant.avatarColor} text-white font-bold flex items-center justify-center text-sm shrink-0`}>
                      {conv.participant.name[0]}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-900 truncate">
                          {conv.participant.name}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      {conv.listingTitle && (
                        <p className="text-[11px] text-stone-500 truncate mt-0.5 font-medium">
                          {conv.listingTitle}
                        </p>
                      )}
                      <p className="text-xs text-stone-600 truncate mt-1">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat Area */}
        <div className="md:col-span-8 flex flex-col bg-white">
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${activeConv.participant.avatarColor} text-white font-bold flex items-center justify-center text-xs`}>
                    {activeConv.participant.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-stone-900">{activeConv.participant.name}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-medium">
                        Verified @{currentCampus.emailDomain}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      {activeConv.participant.major} · {activeConv.participant.year}
                    </p>
                  </div>
                </div>

                {activeConv.listingTitle && (
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      onClick={() => onDraftContractForListing(activeConv.listingId, activeConv.listingTitle)}
                      className="px-2.5 py-1 text-xs font-medium text-stone-900 bg-white border border-stone-300 hover:bg-stone-50 rounded cursor-pointer"
                    >
                      Draft Sublease Contract
                    </button>
                  </div>
                )}
              </div>

              {/* Message thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-stone-50/30">
                {activeConv.listingTitle && (
                  <div className="bg-white border border-stone-200 rounded-lg p-2.5 text-xs flex items-center justify-between shadow-2xs">
                    <div>
                      <span className="text-[10px] text-stone-400 font-mono uppercase block">Referenced Listing</span>
                      <span className="font-semibold text-stone-900">{activeConv.listingTitle}</span>
                      {activeConv.listingPrice && (
                        <span className="font-mono text-stone-600 ml-2">(${activeConv.listingPrice})</span>
                      )}
                    </div>
                    <button
                      onClick={() => onDraftContractForListing(activeConv.listingId, activeConv.listingTitle)}
                      className="text-xs text-amber-800 hover:text-amber-950 font-medium underline cursor-pointer"
                    >
                      Open Sublease Form
                    </button>
                  </div>
                )}

                {activeConv.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-stone-400">
                        <span>{msg.senderName}</span>
                        <span>·</span>
                        <span className="font-mono">{msg.timestamp}</span>
                      </div>
                      <div
                        className={`max-w-md px-3.5 py-2.5 rounded-lg text-xs leading-relaxed ${
                          isMe
                            ? 'bg-stone-900 text-white rounded-br-none'
                            : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs'
                        }`}
                      >
                        {msg.isOffer && (
                          <div className="mb-1 pb-1 border-b border-amber-300/40 text-amber-300 font-semibold text-[11px]">
                            ⚡ Official Student Offer
                          </div>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Actions Strip */}
              <div className="px-4 py-2 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-stone-400 font-medium text-[11px]">Quick actions:</span>
                <button
                  type="button"
                  onClick={handleSendQuickTour}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded text-stone-700 cursor-pointer"
                >
                  📅 Request Tour
                </button>
                <button
                  type="button"
                  onClick={() => setShowOfferModal(true)}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded text-stone-700 cursor-pointer"
                >
                  💰 Send Price Offer
                </button>
                <button
                  type="button"
                  onClick={() => onDraftContractForListing(activeConv.listingId, activeConv.listingTitle)}
                  className="px-2.5 py-1 bg-white border border-stone-200 hover:bg-stone-100 rounded text-stone-700 cursor-pointer"
                >
                  📄 Create Sublease Contract
                </button>
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSend} className="p-3 border-t border-stone-200 bg-white flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a verified student message..."
                  className="flex-1 text-xs px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md cursor-pointer transition-colors shadow-xs"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6 text-xs text-stone-500">
              Select a conversation to view messages
            </div>
          )}
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-stone-200 max-w-sm w-full p-5 space-y-4">
            <h3 className="text-sm font-semibold text-stone-900">Propose Sublet Offer</h3>
            <form onSubmit={handleSubmitOffer} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Proposed Monthly Rent ($)
                </label>
                <input
                  type="number"
                  required
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full text-xs px-3 py-1.5 border border-stone-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Sublet Duration Dates
                </label>
                <input
                  type="text"
                  required
                  value={offerDates}
                  onChange={(e) => setOfferDates(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 border border-stone-300 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded cursor-pointer"
                >
                  Send Formal Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
