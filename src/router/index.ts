import routerConfig from './config';
import history from './history';
import PATHS from './paths';
import Router from './Router';

export * from './helpers';
export { history, PATHS, routerConfig };
export type { TRoute, TRouteCommon, TRouteConfig, TRouteElement } from './types';

export default Router;
