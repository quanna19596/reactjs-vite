import { ELayoutPath, EPagePath, ESpecialPath } from '@/router';

export type TRouteCommon = {
  appError: React.FC;
  appNotFound: React.FC;
  appPermissionDenied: React.FC;
};

export type TRouteElement = {
  index?: boolean;
  component: React.FC;
  isPrivate?: boolean;
  fallbackPermissionDenied?: React.FC;
  errorComponent?: React.FC;
};

export type TRoute = {
  path?: ELayoutPath | EPagePath | ESpecialPath;
  element: TRouteElement;
  children?: TRoute[];
};

export type TRouteConfig = {
  common: TRouteCommon;
  routes: TRoute[];
};
