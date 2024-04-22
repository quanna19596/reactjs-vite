import {
  DashboardLayout,
  DashboardLayoutDefault,
  DashboardLayoutError,
  DashboardLayoutNotFound,
  DashboardLayoutPermissionDenied
} from '@/layouts/private/DashboardLayout';
import {
  LandingLayout,
  LandingLayoutDefault,
  LandingLayoutError,
  LandingLayoutNotFound,
  LandingLayoutPermissionDenied
} from '@/layouts/public/LandingLayout';
import { AppError, AppNotFound, AppPermissionDenied, Products, SignIn } from '@/pages';

import PATHS from './paths';
import { TRouteConfig } from './types';

const routerConfig: TRouteConfig = {
  common: {
    appError: AppError,
    appNotFound: AppNotFound,
    appPermissionDenied: AppPermissionDenied
  },
  routes: [
    {
      path: PATHS.LAYOUT.LANDING(),
      element: {
        component: LandingLayout
      },
      children: [
        {
          element: {
            index: true,
            component: LandingLayoutDefault,
            errorComponent: LandingLayoutError
          }
        },
        {
          path: PATHS.PAGE.SIGN_IN(),
          element: {
            component: SignIn,
            isPrivate: true,
            fallbackPermissionDenied: LandingLayoutPermissionDenied,
            errorComponent: LandingLayoutError
          }
        },
        {
          path: PATHS.SPECIAL.REST(),
          element: {
            component: LandingLayoutNotFound,
            errorComponent: LandingLayoutError
          }
        }
      ]
    },
    {
      path: PATHS.LAYOUT.DASHBOARD(),
      element: {
        component: DashboardLayout,
        isPrivate: true,
        fallbackPermissionDenied: AppPermissionDenied
      },
      children: [
        {
          element: {
            index: true,
            component: DashboardLayoutDefault,
            errorComponent: DashboardLayoutError
          }
        },
        {
          path: PATHS.PAGE.PRODUCTS(),
          element: {
            component: Products,
            isPrivate: true,
            fallbackPermissionDenied: DashboardLayoutPermissionDenied,
            errorComponent: DashboardLayoutError
          }
        },
        {
          path: PATHS.SPECIAL.REST(),
          element: {
            component: DashboardLayoutNotFound,
            errorComponent: DashboardLayoutError
          }
        }
      ]
    }
  ]
};

export default routerConfig;
