import { Outlet, useOutletContext } from 'react-router-dom';

import { TLandingLayoutContextType, TLandingLayoutProps } from './LandingLayout.types';

import './LandingLayout.scss';

const LandingLayout: React.FC<TLandingLayoutProps> = () => {
  return (
    <div className='LandingLayout'>
      LandingLayout
      <Outlet context={{} satisfies TLandingLayoutContextType} />
    </div>
  );
};

export const useDashboardLayoutContext = (): TLandingLayoutContextType => {
  return useOutletContext<TLandingLayoutContextType>();
};

export default LandingLayout;
