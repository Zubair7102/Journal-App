import axios from 'axios';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const status = error.response?.status;
  const data = error.response?.data;

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (status === 409) {
    return 'User already exists. Try a different username or login instead.';
  }

  if (status === 400) {
    return 'Invalid request. Check your details and try again.';
  }

  if (!error.response) {
    return 'Cannot reach the server. Make sure the backend is running on port 8081.';
  }

  return fallback;
};
