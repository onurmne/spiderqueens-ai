export type UserRole = "user" | "contestant" | "admin";

export type UploadStatus = "pending" | "approved" | "rejected";

export type CosplayCategory =
  | "Spider-Gwen"
  | "Silk"
  | "Spider-Woman"
  | "Venomized"
  | "Spider-Girl"
  | "Original Spider-Queen";

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string;
  superVoteBalance: number;
  country: string;
  createdAt: string;
}

export interface Contestant {
  id: string;
  userId: string;
  displayName: string;
  username: string;
  instagramUrl: string;
  country: string;
  countryCode: string;
  profilePhotoUrl: string;
  cosplayPhotoUrl: string;
  category: CosplayCategory;
  bio: string;
  status: UploadStatus;
  rejectionReason?: string;
  voteCount: number;
  superVoteCount: number;
  competitionId: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface Vote {
  id: string;
  userId: string;
  contestantId: string;
  createdAt: string;
}

export interface SuperVote {
  id: string;
  userId: string;
  contestantId: string;
  amount: number;
  createdAt: string;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "ended" | "upcoming";
  prizePool: string;
  weekNumber: number;
}

export interface Winner {
  id: string;
  competitionId: string;
  competitionTitle: string;
  contestantId: string;
  displayName: string;
  country: string;
  cosplayPhotoUrl: string;
  totalVotes: number;
  weekNumber: number;
  crownedAt: string;
}

export interface UploadFormData {
  displayName: string;
  username: string;
  instagramUrl: string;
  country: string;
  countryCode: string;
  category: CosplayCategory;
  bio: string;
  profilePhotoUrl: string;
  cosplayPhotoUrl: string;
}

export interface N8nWebhookConfig {
  webhookUrl: string;
  enabled: boolean;
  telegramNotify: boolean;
  autoApprove: boolean;
}

export interface SponsoredBrand {
  id: string;
  name: string;
  logoUrl: string;
  tagline: string;
  offerText: string;
  linkUrl: string;
}
