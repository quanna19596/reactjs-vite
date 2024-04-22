import { EStorageKey } from '@/enums/other';

import { getCookie, removeCookie, setCookie } from './browser';

export const getRefreshToken = (): string => getCookie(EStorageKey.COOKIE_REFRESH_TOKEN);

export const storeRefreshToken = (refreshToken: string): void => setCookie(EStorageKey.COOKIE_REFRESH_TOKEN, refreshToken);

export const getAccessToken = (): string => getCookie(EStorageKey.COOKIE_ACCESS_TOKEN);

export const storeAccessToken = (accessToken: string): void => setCookie(EStorageKey.COOKIE_ACCESS_TOKEN, accessToken);

export const clearTokens = (): void => {
  removeCookie(EStorageKey.COOKIE_REFRESH_TOKEN);
  removeCookie(EStorageKey.COOKIE_ACCESS_TOKEN);
};
