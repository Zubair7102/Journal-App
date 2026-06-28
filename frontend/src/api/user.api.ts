import { apiClient } from './client';
import type { UserProfile, UserUpdateInput } from '../types/user';

export const fetchCurrentUser = async (): Promise<UserProfile> => {
  const { data } = await apiClient.get<UserProfile>('/user/me');
  return data;
};

export const updateUser = async (input: UserUpdateInput): Promise<UserProfile> => {
  const { data } = await apiClient.put<UserProfile>('/user', input);
  return {
    userName: data.userName,
    email: data.email,
    roles: data.roles,
    sentimentAnalysis: data.sentimentAnalysis,
  };
};

export const deleteUser = async (): Promise<void> => {
  await apiClient.delete('/user');
};

export const fetchGreeting = async (cityName: string): Promise<string> => {
  const { data } = await apiClient.get<string>('/user/greet', {
    params: { cityName },
    transformResponse: [(payload) => payload],
    responseType: 'text',
  });
  return data;
};
