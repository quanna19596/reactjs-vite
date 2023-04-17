import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { EStatusCode } from '@/enums';
import { history, PATHS } from '@/router';
import { ICustomAxiosRequestConfig, TTokenSubscribers } from '@/services';
import { clearTokens, getAccessToken, getFullPath, getRefreshToken, storeAccessToken, storeRefreshToken } from '@/utils';

// import { EAuthEndPoint } from './eco/auth/endpoints';

let isRefreshingAccessToken = false;
let tokenSubscribers: TTokenSubscribers[] = [];

export const AuthorizedInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL
  });

  const goToLogin = (): void => history.push(getFullPath(PATHS.PAGE.SIGN_IN()));

  const getBearerToken = (token: string): string => `Bearer ${token}`;

  const refreshTokens = async (): Promise<string> => {
    const existingRefreshToken: string = getRefreshToken();

    if (!existingRefreshToken) goToLogin();

    // const { jwtAccessToken, refreshToken } = await AuthInstance.refreshToken({
    //   refreshToken: existingRefreshToken ?? '',
    // });

    const jwtAccessToken = '';
    const refreshToken = '';

    storeAccessToken(jwtAccessToken);
    storeRefreshToken(refreshToken);

    return getAccessToken();
  };

  const onRequest = async (request: ICustomAxiosRequestConfig): Promise<ICustomAxiosRequestConfig> => {
    const accessToken: string | unknown = getAccessToken();
    const hasAccessToken = accessToken && typeof accessToken === 'string';

    request.headers = request.headers ?? {};

    if (hasAccessToken) request.headers.Authorization = getBearerToken(accessToken);

    return { ...request, headers: request.headers };
  };

  const onTokenRefreshed = (error: Error | null, newAccessToken?: string): void => {
    tokenSubscribers.map((cb: (error: Error | null, newAccessToken?: string) => void) => cb(error, newAccessToken));
  };

  const onResponseSuccess = (response: AxiosResponse): AxiosResponse => response;

  const onResponseError = async (axiosError: AxiosError): Promise<void | AxiosResponse<any>> => {
    const { response } = axiosError;
    const responseStatus = response?.status;
    const originalRequest = axiosError.config;
    const refreshTokenFailed = originalRequest?.url === '/refresh-token';
    const requestUnauthorized = responseStatus === EStatusCode.UNAUTHORIZED;

    if (requestUnauthorized && refreshTokenFailed) {
      onTokenRefreshed(new Error('Failed to refresh access token'));
      clearTokens();
      goToLogin();
      return Promise.reject(axiosError);
    }

    if (responseStatus === EStatusCode.UNAUTHORIZED && originalRequest) {
      if (!isRefreshingAccessToken) {
        isRefreshingAccessToken = true;
        refreshTokens()
          .then((newAccessToken) => {
            onTokenRefreshed(null, newAccessToken);
          })
          .catch(() => {
            onTokenRefreshed(new Error('Failed to refresh access token'));
            clearTokens();
            goToLogin();
            return Promise.reject(axiosError);
          })
          .finally(() => {
            isRefreshingAccessToken = false;
            tokenSubscribers = [];
          });
      }

      const storeOriginalRequest: Promise<void | AxiosResponse<any>> = new Promise((resolve, reject) => {
        tokenSubscribers.push((error: Error | null, newAccessToken?: string) => {
          if (error) return reject(error);

          if (newAccessToken) originalRequest.headers.Authorization = getBearerToken(newAccessToken);

          return resolve(axios(originalRequest));
        });
      });

      return storeOriginalRequest;
    }

    return Promise.reject(axiosError);
  };

  instance.interceptors.request.use(onRequest);
  instance.interceptors.response.use(onResponseSuccess, onResponseError);

  return instance;
};
