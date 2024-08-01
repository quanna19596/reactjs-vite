import { Outlet, useOutletContext } from 'react-router-dom';

import { TDashboardLayoutContextType, TDashboardLayoutProps } from './DashboardLayout.types';

import './DashboardLayout.scss';

const DashboardLayout: React.FC<TDashboardLayoutProps> = () => {
  return (
    <div className='DashboardLayout'>
      DashboardLayout
      <Outlet context={{} satisfies TDashboardLayoutContextType} />
    </div>
  );
};

export const useDashboardLayoutContext = (): TDashboardLayoutContextType => {
  return useOutletContext<TDashboardLayoutContextType>();
};

export default DashboardLayout;
