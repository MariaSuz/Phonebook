import type { UserFormModel } from '@/logic/types/forms/UserFormModel';

const TOKEN_KEY = 'token';
const USER_KEY = 'currentUser';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);

export const getStoredUser = (): UserFormModel | null => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored || stored === 'undefined' || stored === 'null') return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: UserFormModel) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const clearAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
