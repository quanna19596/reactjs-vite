import { Outlet } from 'react-router-dom';

import './LandingLayout.scss';
import { TLandingLayoutProps } from './LandingLayout.types';

const LandingLayout: React.FC<TLandingLayoutProps> = () => {
  return (
    <div className='LandingLayout'>
      LandingLayout
      <Outlet />
    </div>
  );
};

export default LandingLayout;
