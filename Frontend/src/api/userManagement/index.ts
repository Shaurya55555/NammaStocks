import { get, put } from '../http/client';

export interface UserProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  watchlist: string[];
  created_at: string;
  updated_at: string;
}

export interface UserProfileUpdate {
  first_name?: string;
  last_name?: string;
  watchlist?: string[];
}

export const userManagementApi = {
  /**
   * Get the current user's profile including watchlist.
   * Endpoint: GET /user-management/profile
   */
  async getProfile(token: string): Promise<UserProfile> {
    return get<UserProfile>('/user-management/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },

  /**
   * Update the user's profile (e.g. watchlist).
   * Endpoint: PUT /user-management/profile
   */
  async updateProfile(token: string, updates: UserProfileUpdate): Promise<UserProfile> {
    return put<UserProfile>('/user-management/profile', updates, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
};
