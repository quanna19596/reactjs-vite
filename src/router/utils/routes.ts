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
import { ELayoutPath, EPagePath, ERouteType } from './enums';
import { SignIn, SignUp, Products, Users } from './lazy-importter';
import { TRoute } from './types';

export const routes: TRoute[] = [
  {
    type: ERouteType.LAYOUT,
    path: ELayoutPath.LANDING,
    component: LandingLayout,
    errorComponent: LandingLayoutError,
    defaultComponent: LandingLayoutDefault,
    notFoundComponent: LandingLayoutNotFound,
    privacy: {
      isPrivate: false
    },
    children: [
      {
        type: ERouteType.PAGE,
        path: EPagePath.SIGN_IN,
        component: SignIn
      },
      {
        type: ERouteType.PAGE,
        path: EPagePath.SIGN_UP,
        component: SignUp
      }
    ]
  },
  {
    type: ERouteType.LAYOUT,
    path: ELayoutPath.DASHBOARD,
    component: DashboardLayout,
    errorComponent: DashboardLayoutError,
    defaultComponent: DashboardLayoutDefault,
    notFoundComponent: DashboardLayoutNotFound,
    privacy: {
      isPrivate: true,
      fallbackComponent: DashboardLayoutPermissionDenied
    },
    children: [
      {
        type: ERouteType.PAGE,
        path: EPagePath.PRODUCTS,
        component: Products
      },
      {
        type: ERouteType.PAGE,
        path: EPagePath.USERS,
        component: Users
      }
    ]
  }
];
