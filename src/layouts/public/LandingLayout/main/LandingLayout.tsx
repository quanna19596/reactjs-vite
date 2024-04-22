import { Outlet } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import petSlice from '@/redux/slices/pet-store/pet/slice';
import { useStrictEffect } from '@/utils/hooks';

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
