import { lazy } from 'react';

const retryLoadComponent = (fn: () => Promise<unknown>, retriesLeft = 5, interval = 1000): Promise<any> => {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch((error) => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            reject(error);
            return;
          }

          retryLoadComponent(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
};

export const AppError = lazy(() => retryLoadComponent(() => import('@/pages/public/AppError')));
export const AppNotFound = lazy(() => retryLoadComponent(() => import('@/pages/public/AppNotFound')));
export const AppPermissionDenied = lazy(() => retryLoadComponent(() => import('@/pages/public/AppPermissionDenied')));

export const SignIn = lazy(() => retryLoadComponent(() => import('@/pages/public/SignIn')));
export const SignUp = lazy(() => retryLoadComponent(() => import('@/pages/public/SignUp')));

export const Products = lazy(() => retryLoadComponent(() => import('@/pages/private/Products')));
export const Users = lazy(() => retryLoadComponent(() => import('@/pages/private/Users')));
