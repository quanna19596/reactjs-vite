import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import Fallback from '@/components/Fallback';

const PublicRoute: React.FC<{ component: React.FC; errorComponent?: React.FC }> = ({ component: Component, errorComponent }) => {
  return (
    <Suspense fallback={<Fallback />}>
      {errorComponent ? (
        <ErrorBoundary FallbackComponent={errorComponent}>
          <Component />
        </ErrorBoundary>
      ) : (
        <Component />
      )}
    </Suspense>
  );
};

export default PublicRoute;
