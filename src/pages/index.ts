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

export const AppError = lazy(() => retryLoadComponent(() => import('@/pages/common/AppError')));
export const AppNotFound = lazy(() => retryLoadComponent(() => import('@/pages/common/AppNotFound')));
export const AppPermissionDenied = lazy(() => retryLoadComponent(() => import('@/pages/common/AppPermissionDenied')));

// [BEGIN] Public
export const SignIn = lazy(() => retryLoadComponent(() => import('@/pages/public/SignIn')));
// [END] Public

// [BEGIN] Private
export const Products = lazy(() => retryLoadComponent(() => import('@/pages/private/Products'))); // [END] Private
