import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ESpecialPath, PrivateRoute, PublicRoute, routerConfig } from '@/router';
import { TRoute, TRouteElement } from './utils/types';

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
      const commonRouteProps = { key: route.path, element: wrappedElement };

      return isDefaultRoute ? (
        <Route index {...commonRouteProps} />
      ) : (
        <Route path={route.path} {...commonRouteProps}>
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });
  };

  return (
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={routerConfig.common.appError}>
        <Routes>
          {renderRoutes(routerConfig.routes)}
          <Route path={ESpecialPath.REST} element={<PublicRoute component={routerConfig.common.appNotFound} />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Router;
