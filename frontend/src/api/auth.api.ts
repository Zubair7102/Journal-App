import { apiClient } from './client';
import type { UserCredentials } from '../types/user';

const textResponse = {
  transformResponse: [(payload: string) => payload],
  responseType: 'text' as const,
};

export const signup = async (credentials: UserCredentials): Promise<string> => {
  const { data } = await apiClient.post<string>('/public/signup', credentials, textResponse);
  return data;
};

export const login = async (credentials: UserCredentials): Promise<string> => {
  const { data } = await apiClient.post<string>('/public/login', credentials, textResponse);
  return data;
};

export const getGoogleAuthUrl = async (): Promise<string> => {
  const { data } = await apiClient.get<{ url: string }>('/auth/google/url', {
    withCredentials: true,
  });
  return data.url;
};
