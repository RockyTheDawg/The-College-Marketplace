import React, { useState } from 'react';
import {
  CampusId,
  Campus,
  CurrentUser,
  SubletListing,
  MarketplaceItem,
  RoommateProfile,
  Conversation,
  SubleaseContract,
} from './types';
import {
  CAMPUSES,
  INITIAL_USER,
  INITIAL_SUBLETS,
  INITIAL_MARKETPLACE,
  INITIAL_ROOMMATES,
  INITIAL_CONVERSATIONS,
  INITIAL_CONTRACTS,
} from './data/mockData';
import { Header, NavTab } from './components/Header';
import { CampusBanner } from './components/CampusBanner';
import { SubletDirectory } from './components/SubletDirectory';
import { SubletDetailModal } from './components/SubletDetailModal';
import { CreateSubletModal } from './components/CreateSubletModal';
import { MarketplaceDirectory } from './components/MarketplaceDirectory';
import { MarketplaceDetailModal } from './components/MarketplaceDetailModal';
import { CreateMarketplaceModal } from './components/CreateMarketplaceModal';
import { RoommateMatcher } from './components/RoommateMatcher';
import { ContractBuilder } from './components/ContractBuilder';
import { MessagesHub } from './components/MessagesHub';
import { VerificationModal } from './components/VerificationModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('sublets');
  const [currentCampusId, setCurrentCampusId] = useState<CampusId>('berkeley');
  const [currentUser, setCurrentUser] = useState<CurrentUser>(INITIAL_USER);

  // Entities state
  const [sublets, setSublets] = useState<SubletListing[]>(INITIAL_SUBLETS);
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(INITIAL_MARKETPLACE);
  const [roommates] = useState<RoommateProfile[]>(INITIAL_ROOMMATES);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [contracts, setContracts] = useState<SubleaseContract[]>(INITIAL_CONTRACTS);

  // Modal & Selection States
  const [selectedSublet, setSelectedSublet] = useState<SubletListing | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isCreateSubletOpen, setIsCreateSubletOpen] = useState(false);
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [prefillContractListing, setPrefillContractListing] = useState<SubletListing | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    INITIAL_CONVERSATIONS[0]?.id || ''
  );

  const currentCampus = CAMPUSES.find((c) => c.id === currentCampusId) || CAMPUSES[0];

  // Total unread messages
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Handlers
  const handleSelectCampus = (campusId: CampusId) => {
    setCurrentCampusId(campusId);
    // Adapt user email domain if re-verifying
    const targetCampus = CAMPUSES.find((c) => c.id === campusId);
    if (targetCampus) {
      setCurrentUser((prev) => ({
        ...prev,
        campusId,
      }));
    }
  };

  const handleToggleSaveSublet = (id: string) => {
    setCurrentUser((prev) => {
      const exists = prev.savedSubletIds.includes(id);
      return {
        ...prev,
        savedSubletIds: exists
          ? prev.savedSubletIds.filter((item) => item !== id)
          : [...prev.savedSubletIds, id],
      };
    });
  };

  const handleToggleSaveItem = (id: string) => {
    setCurrentUser((prev) => {
      const exists = prev.savedItemIds.includes(id);
      return {
        ...prev,
        savedItemIds: exists
          ? prev.savedItemIds.filter((item) => item !== id)
          : [...prev.savedItemIds, id],
      };
    });
  };

  const handleMessagePoster = (listing: SubletListing) => {
    // Find or create conversation
    let existing = conversations.find((c) => c.listingId === listing.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participant: listing.poster,
        listingId: listing.id,
        listingTitle: listing.title,
        listingType: 'sublet',
        listingPrice: listing.pricePerMonth,
        lastMessage: `Hi ${listing.poster.name}, I am interested in your sublet for ${listing.term}!`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `Hi ${listing.poster.name}, I am interested in your sublet on ${listing.address} for ${listing.term}. Is it still available for the full duration?`,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
    }
    setActiveTab('messages');
  };

  const handleMessageSeller = (item: MarketplaceItem) => {
    let existing = conversations.find((c) => c.listingId === item.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participant: item.seller,
        listingId: item.id,
        listingTitle: item.title,
        listingType: 'marketplace',
        listingPrice: item.price,
        lastMessage: `Hi ${item.seller.name}, is ${item.title} still available for pickup?`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `Hi ${item.seller.name}, I saw your listing for "${item.title}" ($${item.price}). When are you free to meet near ${item.pickupLocation}?`,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
    }
    setActiveTab('messages');
  };

  const handleConnectRoommate = (roommate: RoommateProfile) => {
    let existing = conversations.find((c) => c.participant.id === roommate.id);
    if (!existing) {
      const newConv: Conversation = {
        id: `conv_${Date.now()}`,
        participant: {
          id: roommate.id,
          name: roommate.name,
          email: roommate.email,
          major: roommate.major,
          year: roommate.year,
          verified: roommate.verified,
          avatarColor: roommate.avatarColor,
        },
        listingTitle: `Roommate Match (${roommate.preferredTerm})`,
        lastMessage: `Hi ${roommate.name}, I noticed our lifestyle habits match! Are you still looking for a place?`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            senderName: currentUser.name,
            text: `Hi ${roommate.name}, saw your profile on QuadMatch. Our study and cleanliness preferences line up really well. Are you still searching for a roommate for ${roommate.preferredTerm}?`,
            timestamp: 'Just now',
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
    }
    setActiveTab('messages');
  };

  const handleDraftContract = (listing: SubletListing) => {
    setPrefillContractListing(listing);
    setActiveTab('contracts');
  };

  const handleDraftContractForListing = (listingId?: string, listingTitle?: string) => {
    const found = sublets.find((s) => s.id === listingId);
    if (found) {
      setPrefillContractListing(found);
    }
    setActiveTab('contracts');
  };

  const handleSendMessage = (conversationId: string, text: string, isOffer?: boolean, offerDetails?: any) => {
    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text,
      timestamp: 'Just now',
      isOffer,
      offerDetails,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Realistic auto-reply simulation after 1.5 seconds
    setTimeout(() => {
      const replyMsg = {
        id: `reply_${Date.now()}`,
        senderId: 'host_auto',
        senderName: 'Host Response',
        text: isOffer
          ? `Thanks for your offer! Let me review this with my building management and I will follow up with the sublet contract draft.`
          : `Thanks for reaching out! Yes, let's connect and review the lease terms together.`,
        timestamp: 'Just now',
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              lastMessage: replyMsg.text,
              lastMessageTime: 'Just now',
              messages: [...c.messages, replyMsg],
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  const handleSaveContract = (newContract: SubleaseContract) => {
    setContracts((prev) => {
      const existsIndex = prev.findIndex((c) => c.id === newContract.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newContract;
        return copy;
      }
      return [newContract, ...prev];
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      {/* Top Bar Contract (3 Zones) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        currentCampus={currentCampus}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenPostListing={() => {
          if (activeTab === 'marketplace') setIsCreateItemOpen(true);
          else setIsCreateSubletOpen(true);
        }}
        unreadCount={unreadCount}
      />

      {/* Campus Context & Anti-Scam Security Strip */}
      <CampusBanner
        currentCampus={currentCampus}
        onSelectCampus={handleSelectCampus}
        currentUser={currentUser}
        onOpenVerification={() => setIsVerificationOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'sublets' && (
          <SubletDirectory
            listings={sublets}
            currentCampus={currentCampus}
            currentUser={currentUser}
            onSelectListing={(l) => setSelectedSublet(l)}
            onMessagePoster={handleMessagePoster}
            onDraftContract={handleDraftContract}
            onOpenCreateSublet={() => setIsCreateSubletOpen(true)}
            onToggleSave={handleToggleSaveSublet}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceDirectory
            items={marketplaceItems}
            currentCampus={currentCampus}
            currentUser={currentUser}
            onSelectItem={(item) => setSelectedItem(item)}
            onMessageSeller={handleMessageSeller}
            onOpenCreateItem={() => setIsCreateItemOpen(true)}
            onToggleSave={handleToggleSaveItem}
          />
        )}

        {activeTab === 'roommates' && (
          <RoommateMatcher
            roommates={roommates}
            currentCampus={currentCampus}
            currentUser={currentUser}
            onConnectRoommate={handleConnectRoommate}
          />
        )}

        {activeTab === 'contracts' && (
          <ContractBuilder
            currentCampus={currentCampus}
            currentUser={currentUser}
            contracts={contracts}
            onSaveContract={handleSaveContract}
            prefillListing={prefillContractListing}
            onClearPrefill={() => setPrefillContractListing(null)}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesHub
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            currentUser={currentUser}
            currentCampus={currentCampus}
            onSendMessage={handleSendMessage}
            onDraftContractForListing={handleDraftContractForListing}
          />
        )}
      </main>

      {/* Trust & Safety Campus Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-stone-900 font-display">QuadHaven</span>
              <span className="text-xs text-stone-500">· Campus Sublet & Marketplace Hub</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-md">
              Restricted to verified university students. All housing agreements and transactions are executed under campus honor codes to eliminate scam deposits and unverified listings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-600">
            <button
              onClick={() => setActiveTab('sublets')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Housing Directory
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Student Exchange
            </button>
            <button
              onClick={() => setActiveTab('roommates')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Roommate Quiz
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className="hover:text-stone-900 cursor-pointer"
            >
              Lease Templates
            </button>
            <button
              onClick={() => setIsVerificationOpen(true)}
              className="text-emerald-700 font-medium hover:underline cursor-pointer"
            >
              Verification Policy
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
        currentCampus={currentCampus}
      />

      <SubletDetailModal
        listing={selectedSublet}
        onClose={() => setSelectedSublet(null)}
        currentUser={currentUser}
        currentCampus={currentCampus}
        onMessagePoster={handleMessagePoster}
        onDraftContract={handleDraftContract}
      />

      <CreateSubletModal
        isOpen={isCreateSubletOpen}
        onClose={() => setIsCreateSubletOpen(false)}
        currentCampus={currentCampus}
        currentUser={currentUser}
        onAddSublet={(newSublet) => {
          setSublets((prev) => [newSublet, ...prev]);
        }}
      />

      <MarketplaceDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        currentUser={currentUser}
        currentCampus={currentCampus}
        onMessageSeller={handleMessageSeller}
      />

      <CreateMarketplaceModal
        isOpen={isCreateItemOpen}
        onClose={() => setIsCreateItemOpen(false)}
        currentCampus={currentCampus}
        currentUser={currentUser}
        onAddItem={(newItem) => {
          setMarketplaceItems((prev) => [newItem, ...prev]);
        }}
      />
    </div>
  );
}
