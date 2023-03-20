import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';

import { EStatusCode } from '@/enums';
import { clearTokens, getAccessToken, getRefreshToken, storeAccessToken, storeRefreshToken } from '@/utils';
import { TTokenSubscribers, ICustomAxiosRequestConfig } from './types';
import { history } from '@/router';

// import { EAuthEndPoint } from './eco/auth/endpoints';

let isRefreshingAccessToken = false;
let tokenSubscribers: TTokenSubscribers[] = [];

const AuthorizedInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL
  });

  const refreshTokens = async (): Promise<string> => {
    const existingRefreshToken: string = getRefreshToken();

    if (!existingRefreshToken) {
      navigate(`${LayoutPaths.Auth}${Paths.Login}`);
    }

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
    const authBearer: string | unknown = getAccessToken();
    request.headers = request.headers ?? {};

    if (authBearer) {
      request.headers.Authorization = `Bearer ${authBearer}`;
    }

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
      navigate(`${LayoutPaths.Auth}${Paths.Login}`);
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
            navigate(`${LayoutPaths.Auth}${Paths.Login}`);
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

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

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

export default AuthorizedInstance;
