import { ERouteType, ELayoutPath, EPagePath, ESpecialPath } from './enums';

export type TRoute = {
  type: ERouteType;
  path: ELayoutPath | EPagePath | ESpecialPath;
  component: React.FC;
  errorComponent?: React.FC;
  defaultComponent?: React.FC;
  notFoundComponent?: React.FC;
  privacy?: {
    isPrivate: boolean;
    fallbackComponent?: React.FC;
  };
  children?: TRoute[];
};
