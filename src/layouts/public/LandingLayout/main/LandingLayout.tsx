import { Outlet } from 'react-router-dom';

import { petstoreSlices, useAppDispatch, useAppSelector } from '@/redux';
import { useStrictEffect } from '@/utils';

import { TLandingLayoutProps } from './LandingLayout.types';

import './LandingLayout.scss';

const LandingLayout: React.FC<TLandingLayoutProps> = () => {
  const dispatch = useAppDispatch();
  const pet = useAppSelector((state) => state.pet.getPetById);

  useStrictEffect(() => {
    dispatch(petstoreSlices.petSlice.actions.getPetByIdRequest({ paths: { id: '614' }, storeInGlobalState: true }));
  }, []);

  console.log(pet);

  return (
    <div className='LandingLayout'>
      LandingLayout
      <Outlet />
    </div>
  );
};

export default LandingLayout;
