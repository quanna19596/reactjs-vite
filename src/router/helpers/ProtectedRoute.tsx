import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { getAccessToken } from '@/utils';
import { Fallback } from '@/components';

const ProtectedRoute: React.FC<{
  component: React.FC;
  fallbackComponent: React.FC;
  errorComponent?: React.FC;
  guards?: { fallbackHandler: () => void; conditional: boolean }[];
}> = ({ component: Component, fallbackComponent: FallbackComponent, errorComponent }) => {
  const isLoggedIn = getAccessToken();

  const checkedAuthComponent = isLoggedIn ? <Component /> : <FallbackComponent />;

  return (
    <Suspense fallback={<Fallback />}>
      {errorComponent ? <ErrorBoundary FallbackComponent={errorComponent}>{checkedAuthComponent}</ErrorBoundary> : checkedAuthComponent}
    </Suspense>
  );
};

export default ProtectedRoute;
