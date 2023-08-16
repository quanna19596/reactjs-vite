import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { petstoreSlices, useAppDispatch } from '@/redux';

import { TLandingLayoutProps } from './LandingLayout.types';

import './LandingLayout.scss';

const LandingLayout: React.FC<TLandingLayoutProps> = () => {
  const dispatch = useAppDispatch();

  return (
    <div className='LandingLayout'>
      LandingLayout
      <Outlet />
    </div>
  );
};

export default LandingLayout;
