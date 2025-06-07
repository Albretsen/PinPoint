export interface GroupImage {
  storage_path: string;
}

export interface GroupChallenge {
  id: string;
  image_id: string;
  challenge_date: string;
  started_at: string;
  ended_at: string;
  group_images?: GroupImage[];
}

export interface Group {
  id: string;
  name: string;
  is_public: boolean;
  invite_code: string;
  owner_id: string;
  created_at: string;
  daily_challenge_time: string;
  is_archived: boolean;
  description: string;
  cover_image: string | null;
  member_count: number;
  is_admin?: boolean;
  joined_at?: string;
  is_member?: boolean;
  latest_activity?: string;
  group_challenges?: GroupChallenge[];
}

export interface GroupMember {
  user_id: string;
  group_id: string;
  is_admin: boolean;
  joined_at: string;
  groups: Group;
} 