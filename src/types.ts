export type CampusId = 'berkeley' | 'utaustin' | 'umich' | 'nyu' | 'uw';

export interface Campus {
  id: CampusId;
  name: string;
  shortName: string;
  emailDomain: string;
  mascot: string;
  city: string;
  state: string;
  subletCount: number;
  itemCount: number;
}

export type HousingTerm = 'Summer 2026' | 'Fall 2026' | 'Spring 2027' | 'Full Year 2026-2027';
export type RoomType = 'Entire Studio' | 'Private Room / Private Bath' | 'Private Room / Shared Bath' | 'Shared Room' | '2-Bedroom Takeover';

export interface SubletListing {
  id: string;
  title: string;
  campusId: CampusId;
  address: string;
  neighborhood: string;
  distanceToCampus: string;
  pricePerMonth: number;
  term: HousingTerm;
  startDate: string;
  endDate: string;
  roomType: RoomType;
  totalBedrooms: number;
  totalBathrooms: number;
  furnished: boolean;
  petFriendly: boolean;
  utilitiesIncluded: boolean;
  inUnitLaundry: boolean;
  parkingAvailable: boolean;
  femaleOnly?: boolean;
  maleOnly?: boolean;
  description: string;
  landlordApproved: boolean;
  buildingName?: string;
  poster: {
    id: string;
    name: string;
    email: string;
    major: string;
    year: string;
    verified: boolean;
    avatarColor: string;
  };
  amenities: string[];
  visualCategory: 'studio' | 'private_room' | 'loft' | 'duplex' | 'modern_apt';
  createdAt: string;
}

export type ItemCategory = 'Furniture' | 'Textbooks & Notes' | 'Electronics & Tech' | 'Bikes & Scooters' | 'Kitchen & Home' | 'Free / Moving Out';
export type ItemCondition = 'Brand New' | 'Like New' | 'Good' | 'Fair';

export interface MarketplaceItem {
  id: string;
  title: string;
  campusId: CampusId;
  category: ItemCategory;
  price: number;
  originalPrice?: number;
  condition: ItemCondition;
  description: string;
  courseCode?: string;
  pickupLocation: string;
  seller: {
    id: string;
    name: string;
    email: string;
    major: string;
    year: string;
    verified: boolean;
    avatarColor: string;
  };
  visualCategory: 'desk' | 'textbook' | 'monitor' | 'bike' | 'microwave' | 'chair';
  isSold: boolean;
  createdAt: string;
}

export interface RoommateProfile {
  id: string;
  name: string;
  campusId: CampusId;
  email: string;
  major: string;
  year: string;
  bio: string;
  budgetMin: number;
  budgetMax: number;
  preferredTerm: HousingTerm;
  lifestyle: {
    sleepSchedule: 'Early Bird (before 11 PM)' | 'Moderate (11 PM - 1 AM)' | 'Night Owl (after 1 AM)';
    cleanliness: 'Spotless / Daily Cleaning' | 'Tidy / Weekly Chores' | 'Casual / Relaxed';
    studyHabit: 'Silent Focus at Home' | 'Study on Campus / Library' | 'Music & Social Study';
    socialLevel: 'Quiet Sanctuary' | 'Occasional Weekend Dinners' | 'Frequent Gatherings';
    dietaryOrPets: string;
  };
  targetNeighborhoods: string[];
  verified: boolean;
  avatarColor: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isOffer?: boolean;
  offerDetails?: {
    term: string;
    monthlyRent: number;
    proposedDates: string;
  };
}

export interface Conversation {
  id: string;
  participant: {
    id: string;
    name: string;
    email: string;
    major: string;
    year: string;
    verified: boolean;
    avatarColor: string;
  };
  listingId?: string;
  listingTitle?: string;
  listingType?: 'sublet' | 'marketplace';
  listingPrice?: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface SubleaseContract {
  id: string;
  campusId: CampusId;
  universityName: string;
  createdAt: string;
  status: 'Draft' | 'Pending Sublessee Signature' | 'Fully Executed';
  sublessorName: string;
  sublessorEmail: string;
  sublesseeName: string;
  sublesseeEmail: string;
  propertyAddress: string;
  unitNumber: string;
  termStart: string;
  termEnd: string;
  monthlyRent: number;
  securityDeposit: number;
  utilitiesIncluded: string;
  houseRules: string;
  sublessorSignature?: string;
  sublessorSignedAt?: string;
  sublesseeSignature?: string;
  sublesseeSignedAt?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  campusId: CampusId;
  major: string;
  year: string;
  studentIdLast4: string;
  savedSubletIds: string[];
  savedItemIds: string[];
}
