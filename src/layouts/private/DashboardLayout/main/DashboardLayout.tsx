import { Outlet } from 'react-router-dom';

import { TDashboardLayoutProps } from './DashboardLayout.types';

import './DashboardLayout.scss';

const DashboardLayout: React.FC<TDashboardLayoutProps> = () => {
  return (
    <div className='DashboardLayout'>
      DashboardLayout
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
