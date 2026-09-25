export type CampusId = string;

export interface LocalBusRoute {
  routeNumber: string;
  routeName: string;
  destination: string;
  etaMinutes: number;
  crowdLevel: 'Low' | 'Medium' | 'Full';
  isLive: boolean;
}

export interface CampusBusApp {
  name: string;
  appType: string;
  isMobileSynced: boolean;
  iosUrl: string;
  androidUrl: string;
}

export interface Campus {
  id: CampusId;
  name: string;
  shortName: string;
  nicknames?: string[];
  emailDomain: string;
  mascot: string;
  city: string;
  state: string;
  region: 'West' | 'Midwest' | 'Northeast' | 'South';
  isPrivate: boolean;
  subletCount: number;
  itemCount: number;
  primaryShuttleName: string;
  transitHub: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  campusBusApp?: CampusBusApp;
  localBuses?: LocalBusRoute[];
}

export interface LocationState {
  status: 'prompt' | 'granted' | 'denied' | 'simulated';
  latitude?: number;
  longitude?: number;
  distanceMiles?: number;
  cityName?: string;
  inCampusRange: boolean;
}

export type HousingTerm = 'Summer 2026' | 'Fall 2026' | 'Spring 2027' | 'Full Year 2026-2027';
export type RoomType = 'Entire Studio' | 'Private Room / Private Bath' | 'Private Room / Shared Bath' | 'Shared Room' | '2-Bedroom Takeover';

export interface TransitOverlay {
  shuttleName: string;
  nearestStop: string;
  walkTimeToStopMin: number;
  nextArrivalsMin: number[];
  bikeLaneSafetyScore: number; // 0-100
  bikeLaneType: 'Protected Green Wave' | 'Dedicated Buffered Lane' | 'Campus Dedicated Path' | 'Shared Low-Traffic';
  lectureHallDistances: {
    hallName: string;
    walkTimeMin: number;
    distanceMi: number;
    shuttleAvailable?: boolean;
  }[];
}

export interface EscrowDetails {
  escrowId: string;
  depositAmount: number;
  status: 'Pending Payment' | 'Held in Escrow' | 'Released to Host' | 'Under Inspection Dispute';
  protectionPlanActive: boolean;
  coverageMax: number; // e.g. $10,000
  inspectionDeadline: string;
  disputeResolutionGuaranteed: boolean;
}

export interface MoveInInspectionItem {
  id: string;
  category: 'Keys & Entry' | 'Bedroom Condition' | 'Bathroom Cleanliness' | 'Appliances & AC' | 'Smoke & Fire Safety';
  title: string;
  verified: boolean;
  notes?: string;
}

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
  transit: TransitOverlay;
  escrowEligible: boolean;
  guarantorAccepted: boolean;
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

export interface GuarantorInfo {
  name: string;
  email: string;
  phone: string;
  relationship: 'Mother' | 'Father' | 'Legal Guardian' | 'Other Family';
  address: string;
  status: 'Invited' | 'Reviewing' | 'Signed & Approved';
  signature?: string;
  signedAt?: string;
  depositFunded: boolean;
  paymentMethod?: string;
}

export interface SubleaseContract {
  id: string;
  campusId: CampusId;
  universityName: string;
  createdAt: string;
  status: 'Draft' | 'Pending Sublessee Signature' | 'Pending Guarantor Signature' | 'Fully Executed';
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
  // Guarantor & Escrow Additions
  guarantorRequired: boolean;
  guarantor?: GuarantorInfo;
  escrow: EscrowDetails;
  inspectionChecklist: MoveInInspectionItem[];
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isEduConnected: boolean;
  campusId: CampusId;
  major: string;
  year: string;
  studentIdLast4: string;
  savedSubletIds: string[];
  savedItemIds: string[];
  hasGuarantorLinked: boolean;
  guarantorEmail?: string;
  deviceType?: 'ios' | 'android' | 'desktop';
  busSyncEnabled?: boolean;
}
