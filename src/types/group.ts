export type GroupImage = {
  id: string;
  storage_path: string;
  taken_at: string | null;
  uploader_id: string;
};

export type GroupChallenge = {
  id: string;
  challenge_date: string;
  started_at: string;
  ended_at: string | null;
  group_images: GroupImage;
};

export interface Group {
  id: string;
  name: string;
  is_public: boolean;
  invite_code: string | null;
  owner_id: string;
  created_at: string;
  daily_challenge_time: string;
  is_archived: boolean;
  description: string;
  cover_image: string | null;
  member_count?: number;
  is_admin?: boolean;
  joined_at?: string;
  is_member?: boolean;
  current_challenge?: {
    id: string;
    challenge_date: string;
    started_at: string;
    ended_at: string | null;
    image: GroupImage;
  };
  group_challenges?: GroupChallenge[];
}

export type GroupMember = {
  is_admin: boolean;
  joined_at: string;
  groups: {
    id: string;
    name: string;
    is_public: boolean;
    invite_code: string | null;
    owner_id: string;
    created_at: string;
    daily_challenge_time: string;
    is_archived: boolean;
    description: string;
    cover_image?: string;
    group_challenges: GroupChallenge[];
  };
}; 