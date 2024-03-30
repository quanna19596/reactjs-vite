import { Outlet } from 'react-router-dom';

import { TLandingLayoutProps } from './LandingLayout.types';

import './LandingLayout.scss';

const LandingLayout: React.FC<TLandingLayoutProps> = () => {
  return (
    <div className='LandingLayout'>
      LandingLayout
      <Outlet />
    </div>
  );
};

export default LandingLayout;
