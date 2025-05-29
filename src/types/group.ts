export type GroupImage = {
  id: string;
  image_url: string;
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

export type Group = {
  id: string;
  name: string;
  is_public: boolean;
  invite_code: string | null;
  owner_id: string;
  created_at: string;
  daily_challenge_time: string;
  is_archived: boolean;
  description: string;
  is_admin: boolean;
  joined_at: string;
  current_challenge?: {
    id: string;
    challenge_date: string;
    started_at: string;
    ended_at: string | null;
    image: GroupImage;
  };
};

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
    group_challenges: GroupChallenge[];
  };
}; 