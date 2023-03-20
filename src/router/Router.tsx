import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import {
  PublicRoute,
  Paths,
  SignIn,
  SignUp,
  AppError,
  ProtectedRoute,
  Products,
  Users,
  routes,
  ERouteType,
  AppNotFound,
  ELayoutPath,
  ESpecialPath
} from '@/router';
import {
  DashboardLayout,
  DashboardLayoutDefault,
  DashboardLayoutError,
  DashboardLayoutNotFound,
  LandingLayout,
  LandingLayoutDefault,
  LandingLayoutError,
  LandingLayoutNotFound
} from '@/layouts';
import { TRoute } from './utils/types';

const Router: React.FC = () => {
  // const landingRouteProps = {
  //   errorComponent: LandingLayoutError
  // };

  // const dashboardRouteProps = {
  //   fallbackPath: Paths.Layout.DashboardLayout,
  //   errorComponent: DashboardLayoutError
  // };

  const protectComponent = (route: TRoute): JSX.Element => {
    const isPrivate = route.privacy && route.privacy.isPrivate && route?.privacy?.fallbackComponent;
    const fallbackComponent = route?.privacy?.fallbackComponent as React.FC;
    const commonRouteProps = { component: route.component, errorComponent: route.errorComponent };
    const protectedRouteProps = { ...commonRouteProps, fallbackComponent };
    const protectedComponent = isPrivate ? <ProtectedRoute {...protectedRouteProps} /> : <PublicRoute {...commonRouteProps} />;
    return protectedComponent;
  };

  return (
    // <BrowserRouter>
    //   <ErrorBoundary FallbackComponent={AppError}>
    //     <Routes>
    //       <Route element={<PublicRoute component={LandingLayout} errorComponent={AppError} />}>
    //         <Route index element={<LandingLayoutDefault />} />
    //         <Route path={Paths.Page.SignIn} element={<PublicRoute component={SignIn} {...landingRouteProps} />} />
    //         <Route path={Paths.Page.SignUp} element={<PublicRoute component={SignUp} {...landingRouteProps} />} />
    //         <Route path={Paths.Rest} element={<PublicRoute component={LandingLayoutNotFound} {...landingRouteProps} />} />
    //       </Route>

    //       <Route
    //         path={Paths.Layout.DashboardLayout}
    //         element={<ProtectedRoute component={DashboardLayout} fallbackPath={Paths.Root} errorComponent={AppError} />}
    //       >
    //         <Route index element={<DashboardLayoutDefault />} />
    //         <Route path={Paths.Page.Products} element={<ProtectedRoute component={Products} {...dashboardRouteProps} />} />
    //         <Route path={Paths.Page.Users} element={<ProtectedRoute component={Users} {...dashboardRouteProps} />} />
    //         <Route path={Paths.Rest} element={<ProtectedRoute component={DashboardLayoutNotFound} {...dashboardRouteProps} />} />
    //       </Route>

    //       <Route path={Paths.Rest} element={<PublicRoute component={LandingLayoutNotFound} {...landingRouteProps} />} />
    //     </Routes>
    //   </ErrorBoundary>
    // </BrowserRouter>
    <BrowserRouter>
      <ErrorBoundary FallbackComponent={AppError}>
        <Routes>
          {routes.map((route) => {
            const isLayout = route.type === ERouteType.LAYOUT;
            const isPage = route.type === ERouteType.PAGE;
            const protectedComponent = protectComponent(route);
            // const isPrivate = route.privacy && route.privacy.isPrivate && route?.privacy?.fallbackComponent;
            // const fallbackComponent = route?.privacy?.fallbackComponent as React.FC;
            // const commonRouteProps = { component: route.component, errorComponent: route.errorComponent };
            // const protectedRouteProps = { ...commonRouteProps, fallbackComponent };
            // const protectedComponent = isPrivate ? <ProtectedRoute {...protectedRouteProps} /> : <PublicRoute {...commonRouteProps} />;

            if (isPage) {
              return <Route key={route.path} path={route.path} element={protectedComponent} />;
            }

            if (isLayout) {
              const DefaultComponent = route.defaultComponent as React.FC;
              const isRootLayout = route.path === ESpecialPath.ROOT || route.path === ESpecialPath.EMPTY;
              const NotFoundComponent = route.notFoundComponent as React.FC;

              return (
                <Route key={route.path} path={route.path} element={protectedComponent}>
                  <Route index element={<DefaultComponent />} />
                  {route.children?.map((childRoute) => {
                    const protectedComponent = protectComponent(route);

                    return <Route key={childRoute.path} path={childRoute.path} element={protectedComponent} />;
                  })}
                  {!isRootLayout && <Route path={ESpecialPath.REST} element={<NotFoundComponent />} />}
                </Route>
              );
            }
          })}

          <Route path={Paths.Rest} element={<PublicRoute component={AppNotFound} />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Router;
