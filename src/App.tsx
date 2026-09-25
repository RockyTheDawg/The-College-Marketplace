import React, { useState } from 'react';
import {
  CampusId,
  CurrentUser,
  SubletListing,
  MarketplaceItem,
  RoommateProfile,
  Conversation,
  SubleaseContract,
} from './types';
import {
  ALL_CAMPUSES,
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
import { ParentPortalView } from './components/ParentPortalView';
import { MessagesHub } from './components/MessagesHub';
import { VerificationModal } from './components/VerificationModal';
import { EscrowInspectionModal } from './components/EscrowInspectionModal';
import { CampusTransitHub } from './components/CampusTransitHub';
import { LocationGateModal } from './components/LocationGateModal';
import { DisconnectedLockScreen } from './components/DisconnectedLockScreen';
import { PwaFooterBanner } from './components/PwaFooterBanner';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('sublets');
  const [currentCampusId, setCurrentCampusId] = useState<CampusId>('berkeley');
  const [currentUser, setCurrentUser] = useState<CurrentUser>(INITIAL_USER);

  // Gating & Security States
  const [isSignedOut, setIsSignedOut] = useState<boolean>(false);
  const [isLocationAllowed, setIsLocationAllowed] = useState<boolean>(true);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [actionRestrictedNotice, setActionRestrictedNotice] = useState<string | null>(null);

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
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);
  const [prefillContractListing, setPrefillContractListing] = useState<SubletListing | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    INITIAL_CONVERSATIONS[0]?.id || ''
  );

  const currentCampus = ALL_CAMPUSES.find((c) => c.id === currentCampusId) || ALL_CAMPUSES[0];
  const activeContract = contracts[0] || INITIAL_CONTRACTS[0];

  // Total unread messages
  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Email Verification Gate Helper
  // Ensures that student email MUST be verified before they can post, message, or do anything!
  const ensureVerified = (actionName: string): boolean => {
    if (!currentUser.isVerified) {
      setActionRestrictedNotice(
        `Email verification required: You must verify your official ${currentCampus.shortName} (.edu) email before you can ${actionName}.`
      );
      setIsVerificationOpen(true);
      return false;
    }
    return true;
  };

  // Location Access Check
  const ensureLocationAllowed = (): boolean => {
    if (!isLocationAllowed) {
      setIsLocationModalOpen(true);
      return false;
    }
    return true;
  };

  // Campus Selector Handler
  const handleSelectCampus = (campusId: CampusId) => {
    setCurrentCampusId(campusId);
    const targetCampus = ALL_CAMPUSES.find((c) => c.id === campusId);
    if (targetCampus) {
      setCurrentUser((prev) => ({
        ...prev,
        campusId,
      }));
    }
  };

  // Disconnect EDU Handler: Revokes access and signs out automatically
  const handleDisconnectEdu = () => {
    setCurrentUser((prev) => ({
      ...prev,
      isEduConnected: false,
      isVerified: false,
    }));
    setIsSignedOut(true);
  };

  // Re-connect EDU Handler: Re-authenticate to regain access
  const handleReconnectEdu = () => {
    setIsSignedOut(false);
    setIsVerificationOpen(true);
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

  // Message Poster Handler (Gated by Email Verification & Location)
  const handleMessagePoster = (listing: SubletListing) => {
    if (!ensureVerified('message sublet hosts')) return;
    if (!ensureLocationAllowed()) return;

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
            text: `Hi ${listing.poster.name}, I saw your sublet on ${listing.address} for ${listing.term}. Is it still available? I also checked the shuttle and bike route and it's perfect for my morning classes.`,
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

  // Message Seller Handler (Gated by Email Verification)
  const handleMessageSeller = (item: MarketplaceItem) => {
    if (!ensureVerified('message marketplace sellers')) return;
    if (!ensureLocationAllowed()) return;

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

  // Connect Roommate Handler (Gated by Email Verification)
  const handleConnectRoommate = (roommate: RoommateProfile) => {
    if (!ensureVerified('connect with potential roommates')) return;
    if (!ensureLocationAllowed()) return;

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
            text: `Hi ${roommate.name}, saw your profile on StudentSquare. Our study and cleanliness preferences line up really well. Are you still searching for a roommate for ${roommate.preferredTerm}?`,
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

  // Draft Contract Handler (Gated by Email Verification)
  const handleDraftContract = (listing: SubletListing) => {
    if (!ensureVerified('initiate legal sublease agreements')) return;
    setPrefillContractListing(listing);
    setActiveTab('contracts');
  };

  const handleDraftContractForListing = (listingId?: string) => {
    if (!ensureVerified('draft lease agreements')) return;
    const found = sublets.find((s) => s.id === listingId);
    if (found) {
      setPrefillContractListing(found);
    }
    setActiveTab('contracts');
  };

  const handleSendMessage = (conversationId: string, text: string, isOffer?: boolean, offerDetails?: any) => {
    if (!ensureVerified('send chat messages')) return;

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

    // Realistic auto-reply simulation
    setTimeout(() => {
      const replyMsg = {
        id: `reply_${Date.now()}`,
        senderId: 'host_auto',
        senderName: 'Host Response',
        text: isOffer
          ? `Thanks for your offer! Let me review this with my building management and I will follow up with the sublet contract draft via StudentSquare Escrow.`
          : `Thanks for reaching out! Yes, let's connect and review the lease terms together. Our parent co-signer portal is also ready whenever your family wants to review.`,
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

  // If user disconnected .edu email: they lose access to the app and are signed out
  if (isSignedOut || !currentUser.isEduConnected) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold font-display text-stone-900">StudentSquare</div>
          <span className="text-xs text-red-600 font-mono font-semibold">🔒 Session Terminated</span>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <DisconnectedLockScreen
            currentCampus={currentCampus}
            onReconnectEdu={handleReconnectEdu}
          />
        </main>
        <VerificationModal
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          currentUser={currentUser}
          onUpdateUser={(updated) => {
            setCurrentUser((prev) => ({ ...prev, ...updated, isEduConnected: true }));
            setIsSignedOut(false);
          }}
          currentCampus={currentCampus}
          onDisconnectEdu={handleDisconnectEdu}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900">
      {/* Top Bar Contract with Mobile & Tablet 3-Lines Hamburger Drawer */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        currentCampus={currentCampus}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenPostListing={() => {
          if (!ensureVerified('post a listing')) return;
          if (!ensureLocationAllowed()) return;
          if (activeTab === 'marketplace') setIsCreateItemOpen(true);
          else setIsCreateSubletOpen(true);
        }}
        onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
        onDisconnectEdu={handleDisconnectEdu}
        unreadCount={unreadCount}
        locationVerified={isLocationAllowed}
      />

      {/* Campus Context & Nationwide Selector with Nickname Search */}
      <CampusBanner
        currentCampus={currentCampus}
        onSelectCampus={handleSelectCampus}
        currentUser={currentUser}
        onOpenVerification={() => setIsVerificationOpen(true)}
        onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
        onOpenTransit={() => setActiveTab('transit')}
        locationVerified={isLocationAllowed}
      />

      {/* Location Area Notice (Once logged in to EDU, only see what is in their area) */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-stone-800">
              📍 Area-Restricted View Active:
            </span>
            <span className="text-stone-600">
              Only showing housing, sublets, and marketplace items within the <strong>{currentCampus.name}</strong> ({currentCampus.city}, {currentCampus.state}) zone.
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isLocationAllowed && (
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded font-semibold cursor-pointer"
              >
                Allow Location Access
              </button>
            )}
            <button
              onClick={() => setActiveTab('transit')}
              className="text-stone-600 hover:text-stone-900 cursor-pointer flex items-center gap-1 font-mono text-[11px]"
            >
              <span>🚌 Device Bus Sync:</span>
              <strong className="text-emerald-700">{currentUser.deviceType?.toUpperCase() || 'IOS'}</strong>
            </button>
          </div>
        </div>
      </div>

      {/* Action Restricted Warning Modal Alert (if user tries to post or message while unverified) */}
      {actionRestrictedNotice && !currentUser.isVerified && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-4">
          <div className="bg-amber-50 border border-amber-300 rounded-lg p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🔒</span>
              <span>{actionRestrictedNotice}</span>
            </div>
            <button
              onClick={() => setActionRestrictedNotice(null)}
              className="text-amber-700 hover:text-amber-950 font-bold p-1 cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'sublets' && (
          <SubletDirectory
            listings={sublets}
            currentCampus={currentCampus}
            currentUser={currentUser}
            onSelectListing={(l) => setSelectedSublet(l)}
            onMessagePoster={handleMessagePoster}
            onDraftContract={handleDraftContract}
            onOpenCreateSublet={() => {
              if (ensureVerified('post a sublet listing') && ensureLocationAllowed()) {
                setIsCreateSubletOpen(true);
              }
            }}
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
            onOpenCreateItem={() => {
              if (ensureVerified('list marketplace items') && ensureLocationAllowed()) {
                setIsCreateItemOpen(true);
              }
            }}
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

        {activeTab === 'transit' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
              <div>
                <h1 className="text-2xl font-bold font-display text-stone-900">
                  Campus Shuttle & Transit Synchronization
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Live bus arrivals, route telemetry, and automatic device integration for iOS and Android
                </p>
              </div>
              <button
                onClick={() => setActiveTab('sublets')}
                className="self-start text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                ← Back to Housing
              </button>
            </div>

            <CampusTransitHub
              currentCampus={currentCampus}
              deviceType={currentUser.deviceType || 'ios'}
              onUpdateDeviceType={(dev) =>
                setCurrentUser((prev) => ({ ...prev, deviceType: dev }))
              }
              busSyncEnabled={currentUser.busSyncEnabled ?? true}
              onToggleBusSync={(en) =>
                setCurrentUser((prev) => ({ ...prev, busSyncEnabled: en }))
              }
            />
          </div>
        )}

        {activeTab === 'contracts' && (
          <ContractBuilder
            currentCampus={currentCampus}
            currentUser={currentUser}
            contracts={contracts}
            onSaveContract={handleSaveContract}
            prefillListing={prefillContractListing}
            onClearPrefill={() => setPrefillContractListing(null)}
            onOpenParentPortal={() => setActiveTab('guarantor')}
            onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
          />
        )}

        {activeTab === 'guarantor' && (
          <ParentPortalView
            currentCampus={currentCampus}
            currentUser={currentUser}
            activeContract={activeContract}
            onUpdateContract={handleSaveContract}
            onOpenContractView={() => setActiveTab('contracts')}
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

      {/* PWA Mobile App & QR Codes Section */}
      <PwaFooterBanner />

      {/* Trust & Safety Campus Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-stone-900 font-display">StudentSquare</span>
              <span className="text-xs text-stone-500">· Campus Sublet & Marketplace Hub</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 max-w-md">
              Restricted to verified university students across all 50 US states & private colleges. Protected by FDIC-insured deposit escrow, parent co-signer workflows, and campus transit overlays.
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
              onClick={() => setActiveTab('transit')}
              className="hover:text-stone-900 cursor-pointer text-emerald-800 font-medium"
            >
              Bus Map & Device Sync
            </button>
            <button
              onClick={() => setActiveTab('guarantor')}
              className="hover:text-stone-900 cursor-pointer font-medium text-emerald-800"
            >
              Parent & Guarantor Portal
            </button>
            <button
              onClick={() => setIsEscrowModalOpen(true)}
              className="hover:text-stone-900 cursor-pointer font-medium text-amber-900"
            >
              Escrow & Insurance Vault
            </button>
            <button
              onClick={handleDisconnectEdu}
              className="text-red-600 hover:text-red-800 cursor-pointer font-medium"
            >
              Disconnect .edu Account
            </button>
          </div>
        </div>
      </footer>

      {/* Location Gate Modal (Enforces location allowed to see only what is in their area) */}
      <LocationGateModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentCampus={currentCampus}
        onAllowLocation={(_coords) => {
          setIsLocationAllowed(true);
        }}
      />

      {/* Modals */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => {
          setIsVerificationOpen(false);
          setActionRestrictedNotice(null);
        }}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated, isEduConnected: true }))}
        currentCampus={currentCampus}
        onDisconnectEdu={handleDisconnectEdu}
      />

      <EscrowInspectionModal
        isOpen={isEscrowModalOpen}
        onClose={() => setIsEscrowModalOpen(false)}
        contract={activeContract}
        currentCampus={currentCampus}
        currentUser={currentUser}
        onUpdateContract={handleSaveContract}
      />

      <SubletDetailModal
        listing={selectedSublet}
        onClose={() => setSelectedSublet(null)}
        currentUser={currentUser}
        currentCampus={currentCampus}
        onMessagePoster={handleMessagePoster}
        onDraftContract={handleDraftContract}
        onOpenParentPortal={() => setActiveTab('guarantor')}
        onOpenEscrowModal={() => setIsEscrowModalOpen(true)}
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
