export interface UserCredentials {
  userName: string;
  password: string;
  email?: string;
}

export interface UserProfile {
  userName: string;
  email?: string | null;
  roles?: string[];
  sentimentAnalysis?: boolean | null;
}

export interface UserUpdateInput {
  userName: string;
  password: string;
}
