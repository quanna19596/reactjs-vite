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
import { TRouteConfig, AppError, AppNotFound, AppPermissionDenied, Products, SignIn, SignUp, Users } from '@/router';
import { ELayoutPath, EPagePath, ESpecialPath } from './enums';

export const routerConfig: TRouteConfig = {
  common: {
    appError: AppError,
    appNotFound: AppNotFound,
    appPermissionDenied: AppPermissionDenied
  },
  routes: [
    {
      path: ELayoutPath.LANDING,
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
          path: EPagePath.SIGN_IN,
          element: {
            component: SignIn,
            errorComponent: LandingLayoutError
          }
        },
        {
          path: EPagePath.SIGN_UP,
          element: {
            component: SignUp,
            errorComponent: LandingLayoutError
          }
        },
        {
          path: ESpecialPath.REST,
          element: {
            component: LandingLayoutNotFound,
            errorComponent: LandingLayoutError
          }
        }
      ]
    },
    {
      path: ELayoutPath.DASHBOARD,
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
          path: EPagePath.PRODUCTS,
          element: {
            component: Products,
            isPrivate: true,
            fallbackPermissionDenied: DashboardLayoutPermissionDenied,
            errorComponent: DashboardLayoutError
          }
        },
        {
          path: EPagePath.USERS,
          element: {
            component: Users,
            isPrivate: true,
            fallbackPermissionDenied: DashboardLayoutPermissionDenied,
            errorComponent: DashboardLayoutError
          }
        },
        {
          path: ESpecialPath.REST,
          element: {
            component: DashboardLayoutNotFound,
            errorComponent: DashboardLayoutError
          }
        }
      ]
    }
  ]
};
