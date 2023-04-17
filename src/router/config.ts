import {
  DashboardLayout,
  DashboardLayoutDefault,
  DashboardLayoutError,
  DashboardLayoutNotFound,
  DashboardLayoutPermissionDenied,
  LandingLayout,
  LandingLayoutDefault,
  LandingLayoutError,
  LandingLayoutNotFound
} from '@/layouts';
import { AppError, AppNotFound, AppPermissionDenied, Products, SignIn, SignUp, TRouteConfig, Users } from '@/router';

// import { AppError } from '@/router/utils/lazy-importter';
import { PATHS } from './paths';

export const routerConfig: TRouteConfig = {
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
            errorComponent: LandingLayoutError
          }
        },
        {
          path: PATHS.PAGE.SIGN_UP(),
          element: {
            component: SignUp,
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
          path: PATHS.PAGE.USERS(),
          element: {
            component: Users,
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
