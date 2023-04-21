import { TPathParams } from './types';

const PATHS = {
  LAYOUT: {
    LANDING: (): string => '/',
    DASHBOARD: (): string => '/dashboard'
  },
  PAGE: {
    SIGN_IN: (): string => '/sign-in',
    SIGN_UP: (): string => '/sign-up',
    USERS: (): string => '/users',
    PRODUCTS: (): string => '/products',
    NOT_FOUND: (): string => '/not-found',
    PRODUCT_DETAIL: (params?: TPathParams): string => `/products/${params?.slug || ':slug'}`
  },
  SPECIAL: {
    EMPTY: (): string => '',
    ROOT: (): string => '/',
    REST: (): string => '*'
  }
};

export default PATHS;
