import { Outlet } from 'react-router-dom';

import './DashboardLayout.scss';
import { TDashboardLayoutProps } from './DashboardLayout.types';

const DashboardLayout: React.FC<TDashboardLayoutProps> = () => {
  return (
    <div className='DashboardLayout'>
      DashboardLayout
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
