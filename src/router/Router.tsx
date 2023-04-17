import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';

import { ESpecialPath, history, HistoryRouter, PrivateRoute, PublicRoute, routerConfig, TRoute, TRouteElement } from '@/router';

const Router: React.FC = () => {
  const elementWrapper = (element: TRouteElement): JSX.Element => {
    const commonRouteProps = { component: element.component, errorComponent: element.errorComponent };
    const publicRouteProps = { ...commonRouteProps };
    const privateRouteProps = { ...commonRouteProps, fallbackPermissionDeniedComponent: element.fallbackPermissionDenied as React.FC };
    const isPrivate = element.isPrivate;
    const wrappedElement = isPrivate ? <PrivateRoute {...privateRouteProps} /> : <PublicRoute {...publicRouteProps} />;
    return wrappedElement;
  };

  const renderRoutes = (routes: TRoute[]): JSX.Element[] => {
    return routes.map((route) => {
      const wrappedElement = elementWrapper(route.element);
      const isDefaultRoute = route.element.index;
      const commonRouteProps = { element: wrappedElement };

      return isDefaultRoute ? (
        <Route key='indexRoute' index {...commonRouteProps} />
      ) : (
        <Route key={route.path} path={route.path} {...commonRouteProps}>
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
    <HistoryRouter history={history}>
      <ErrorBoundary FallbackComponent={routerConfig.common.appError}>
        <Routes>
          {renderRoutes(routerConfig.routes)}
          <Route path={ESpecialPath.REST} element={<PublicRoute component={routerConfig.common.appNotFound} />} />
        </Routes>
      </ErrorBoundary>
    </HistoryRouter>
  );
};

export default Router;
