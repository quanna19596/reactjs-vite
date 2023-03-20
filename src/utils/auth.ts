import { EStorage } from '@/enums';
import { getCookie, removeCookie, setCookie } from './browser-handling';

export const getRefreshToken = (): string => getCookie(EStorage.COOKIE_REFRESH_TOKEN);

export const storeRefreshToken = (refreshToken: string): void => setCookie(EStorage.COOKIE_REFRESH_TOKEN, refreshToken);

export const getAccessToken = (): string => getCookie(EStorage.COOKIE_ACCESS_TOKEN);

export const storeAccessToken = (accessToken: string): void => setCookie(EStorage.COOKIE_ACCESS_TOKEN, accessToken);

export const clearTokens = (): void => {
  removeCookie(EStorage.COOKIE_REFRESH_TOKEN);
  removeCookie(EStorage.COOKIE_ACCESS_TOKEN);
};
