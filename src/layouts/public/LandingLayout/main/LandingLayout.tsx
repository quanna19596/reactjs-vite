import { Outlet } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/redux';
import { petSlice } from '@/redux/slices/pet-store';
import { useStrictEffect } from '@/utils';

import { TLandingLayoutProps } from './LandingLayout.types';

import './LandingLayout.scss';

const LandingLayout: React.FC<TLandingLayoutProps> = () => {
  const dispatch = useAppDispatch();
  const pet = useAppSelector((state) => state.petStore.pet.getPetById);

  useStrictEffect(() => {
    dispatch(petSlice.actions.getPetByIdRequest({ paths: { id: '9223372036854333000' }, storeInGlobalState: true }));
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
