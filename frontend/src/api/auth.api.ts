import { apiClient } from './client';
import type { UserCredentials } from '../types/user';

export const signup = async (credentials: UserCredentials): Promise<string> => {
  const { data } = await apiClient.post<string>('/public/signup', credentials);
  return data;
};

export const login = async (credentials: UserCredentials): Promise<string> => {
  const { data } = await apiClient.post<string>('/public/login', credentials, {
    transformResponse: [(payload) => payload],
    responseType: 'text',
  });
  return data;
};

export const getGoogleAuthUrl = async (): Promise<string> => {
  const { data } = await apiClient.get<{ url: string }>('/auth/google/url', {
    withCredentials: true,
  });
  return data.url;
};
