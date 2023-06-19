import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { petstoreSlices, useAppDispatch } from '@/redux';

import { TLandingLayoutProps } from './LandingLayout.types';

import './LandingLayout.scss';

const LandingLayout: React.FC<TLandingLayoutProps> = () => {
  a = 2;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(petstoreSlices.petSlice.actions.getPetByIdRequest({ paths: { id: '123' } }));
  }, []);

  return (
    <div className='LandingLayout'>
      LandingLayout
      <Outlet />
    </div>
  );
};

export default LandingLayout;
