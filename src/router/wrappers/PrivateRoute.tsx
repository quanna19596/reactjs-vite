import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Fallback from '@/components/Fallback';
import { getAccessToken } from '@/utils/auth';

const PrivateRoute: React.FC<{
  component: React.FC;
  fallbackPermissionDeniedComponent: React.FC;
  errorComponent?: React.FC;
  guards?: { fallbackHandler: () => void; conditional: boolean }[];
}> = ({ component: Component, fallbackPermissionDeniedComponent: FallbackPermissionDeniedComponent, errorComponent }) => {
  const isLoggedIn = getAccessToken();

  const checkedAuthComponent = isLoggedIn ? <Component /> : <FallbackPermissionDeniedComponent />;

  return (
    <Suspense fallback={<Fallback />}>
      {errorComponent ? <ErrorBoundary FallbackComponent={errorComponent}>{checkedAuthComponent}</ErrorBoundary> : checkedAuthComponent}
    </Suspense>
  );
};

export default PrivateRoute;
